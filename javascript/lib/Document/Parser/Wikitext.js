Class('Document.Parser.Wikitext(Document.Parser)', function() {

var proto = this.prototype;
proto.className = 'Document.Parser.Wikitext';

proto.init = function() {}

proto.create_grammar = function() {
    var all_blocks = ['pre', 'html', 'hr', 'hx', 'waflparagraph', 'ul', 'ol', 'blockquote', 'table', 'p', 'empty', 'else'];

    // Phrase TODO: im
    var all_phrases = ['waflphrase', 'asis', 'wikilink', 'wikilink2', 'a', 'im', 'mail', 'file', 'tt', 'b', 'i', 'del', 'a'];

    var re_huggy = function(brace1, brace2) {
        var preAlphaNum = '\\w';
        if (brace1 == '-') { preAlphaNum += ':;'; }
        brace2 = '\\' + (brace2 || brace1);
        brace1 = '\\' + brace1;
        return {
            match: new RegExp('(?:^|[^'+brace1+preAlphaNum+'])('+brace1+'(?=\\S)(?!'+brace2+')(.*?[^\\s'+brace2+'])'+brace2+'(?=[^'+brace2+'\\w]|$))'),
            phrases: (brace1 == '\\`') ? null : all_phrases,
            lookbehind: true
        };
    };

    var im_types = {
        yahoo: 'yahoo',
        ymsgr: 'yahoo',
        callto: 'callto',
        callme: 'callto',
        skype: 'callto',
        aim: 'aim'
    };

    var im_label = {
        aim: "AIM: %1",
        yahoo: "Yahoo: %1",
        callto: "Skype: %1"
    };

    var im_re = '(\\b(';
    for (var key in im_types) {
        im_re += key + '|';
    }
    im_re = im_re.replace(/\|$/, ')\\:([^\\s\\>\\)]+))');

    var re_list = function(bullet, filter_out) {
        var exclusion = new RegExp('(^|\n)' + filter_out + '\ *', 'g');
        return {
            match: new RegExp(
                "^(" + bullet + "+\ .*\n" +
                "(?:[\*\-\+\#]+\ .*\n)*" +
                ")(?:\s*\n)?"
            ),
            blocks: ['ul', 'ol', 'subl', 'li'],
            filter: function(node) {
                return node.text.replace(exclusion, '$1');
            }
        };
    };

    var _escape_pipes = function(input) {
        // Escape | in {{...}} sections with 0xFFFC (Object Replacement) characters,
        // so the "td" parser won't get confused when parsing "| {{...|...}} |".
        return input.replace(/{{(.*?)}}/g, function(match, text){
            return '{{'+text.replace(/\|/g, String.fromCharCode(0xFFFC))+'}}';
        });
    };

    var FFFC = new RegExp(String.fromCharCode(0xFFFC), 'g');
    var _unescape_pipes = function(output) {
        // Unescape 0xFFFC back to |.
        return output.replace(/{{(.*?)}}/g, function(match, text) {
            return '{{'+text.replace(FFFC, '|')+'}}';
        });
    };

    return {
        _all_blocks: all_blocks,
        _all_phrases: all_phrases,
        top: { blocks: all_blocks },
        ol: re_list('#', '[*#]'),
        ul: re_list('[-+*]', '[-+*#]'),
        blockquote: {
            match: /^((?:>[^\n]*\n)+)(?:\s*\n)?/,
            blocks: ['blockquote', 'line'],
            filter: function(node) { return node.text.replace(/(^|\n)>\ ?/g, '$1') }
        },
        line: {
            match: /([^\n]*)\n/,
            phrases: all_phrases
        },
        subl: {
            type: 'li',
            match: /^(([^\n]*)\n[*#]+\ [^\n]*\n(?:[*#]+\ [^\n]*\n)*)(?:\s*\n)?/,
            blocks: ['ul', 'ol', 'li2']
        },
        li: {
            match: /([^\n]*)\n/,
            phrases: all_phrases
        },
        li2: {
            type: '', // Do not emit begin/end node; just reparse
            match: /([^\n]*)\n/,
            phrases: all_phrases
        },
        html: {
            match: /^(\.html\ *\n(?:[^\n]*\n)*?\.html)\ *\n(?:\s*\n)?/,
            filter: function(node) {
                node._html = node.text;
                return '';
            }
        },
        pre: { match: /^\.pre\ *\n((?:[^\n]*\n)*?)\.pre\ *\n(?:\s*\n)?/ },
        hr: { match: /^--+(?:\s*\n)?/ },
        table: {
            match: /^((?:\|\| *([^\|\n]+?) *\n)?(((\|.*\| \n(?=\|))|(\|.*\|  +\n)|(?:\|.*?\|\n))+))/,
            blocks: ['tr'],
            filter: function(node) {
                node._options = node['1'] || '';
                node._border = true;
                node._sort = false;

                var opts = node._options.match(/([^\s:=]+[:=]\s*\S*)/g) || [];
                for (var i = 0; i < opts.length; i++) {
                    var match = opts[i].match(/^([^\s:=]+)[:=]\s*(\S*)/),
                        key = match['1'],
                        val = match['2'];
                    node['_'+key] = ((val != 'off') && (val != 'false'));
                }

                return node['2'];
            }
        },

        tr: {
            match: /^((?:(?:^|\n)\|.*?\|(?:\n| \n(?=\|)|  +\n)))/,
            blocks: ['td_multi_line_block', 'td_single_line_block', 'td_phrase', 'td_final'],
            filter: function(node) { return node.text.replace(/\s+$/, '') }
        },

        td_multi_line_block: {
            pre_match: _escape_pipes,
            match: /\|[ \t]*\n?(\s*?[^|]*?\n[^|]*?)[ \t]*(?=\|)/,
            post_match: _unescape_pipes,
            blocks: ['pre', 'html', 'hr', 'hx', 'waflparagraph', 'ol', 'ul', 'blockquote', 'p', 'empty', 'else'],
            filter: function(node) {
                node.type = 'td';
                return node.text.replace(/\n?$/, '\n');
            }
        },

        td_single_line_block: {
            pre_match: _escape_pipes,
            match: /\|[ \t]*\n?((?:\*+|#+|>+|\^+)\s[^|]*?)[ \t]*(?=\|)/,
            post_match: _unescape_pipes,
            blocks: ['hx', 'ol', 'ul'],
            filter: function(node) {
                node.type = 'td';
                return node.text + '\n';
            }
        },

        td_phrase: {
            pre_match: _escape_pipes,
            match: /\|[ \t]*\n?(\s*?[^|]*?)[ \t]*(?=\|)/,
            post_match: _unescape_pipes,
            phrases: all_phrases,
            filter: function(node) {
                node.type = 'td';
                return node.text;
            }
        },

        td_final: {
            match: /^\s*\|\s*/,
            filter: function(node) { node.type = '' }
        },

        hx: {
            match: /^((\^+) *([^\n]*?)(\s+=+)?\s*?\n+)/,
            phrases: all_phrases,
            filter: function(node) {
                node.type = 'h' + node['1'].length;
                return node[2];
            }
        },
        p: {
            match: /^((?:(?!(?:(?:\^+|\#+|\*+|\-+) |\>|\.\w+\s*\n|\{[^\}\n]+\}\s*\n))[^\n]*\S[^\n]*\n)+(?:(?=^|\n)\s*\n)*)/,
            phrases: all_phrases,
            filter: function(node) { return node.text.replace(/\n$/, '').replace(/\n/g, String.fromCharCode(0xFFFC)+'\n'); }
        },
        empty: {
            match: /^(\s*\n)/,
            filter: function(node) { node.type = '' }
        },
        'else': {
            match: /^(([^\n]*)\n)/,
            phrases: [],
            filter: function(node) {
                node.type = 'p';
            }
        },
        waflparagraph: {
            match: /^(?:"[^"]+")?\{([\w-]+(?=[\:\ \}])(?:\s*:)?\x20*[^\n}]*?\x20*)\}[\ \t]*\n(?:\s*\n)?/,
            filter: function(node) {
                node._wafl = node._label = node.text;
                // node._function = node._wafl.replace(/[: ].*/, '');;
                // node._options = node._wafl.replace(/^[^: ]*[: ]?/, '');
                return '';
            }
        },
        waflphrase: {
            match: /(?:^|[\s\-])((?:"([^\n]+?)")?\{([\w-]+(?=[\:\ \}])(?:\s*:)?\x20*[^\n]*?\x20*)\}(?=[\W_]|$))/,
            filter: function(node) {
                node._wafl = node[2];
                node._label = node[1] || node._wafl;
                // node._function = node._wafl.replace(/[: ].*/, '');;
                // node._options = node._wafl.replace(/^[^: ]*[: ]?/, '');
                return '';
            },
            lookbehind: true
        },
        asis: {
            match: /(\{\{([^\n]*?)\}\}(\}*))/,
            filter: function(node) {
                node.type = '';
                return(node[1] + node[2]);
            }
        },
        wikilink: {
            match: /(?:^|[_\W])(\[()(?=[^\s\[\]])(.*?)\](?=[_\W]|$))/,
            filter: function(node) {
                node._href = '?' + node[2];
                return(node.text || node[2]);
            },
            lookbehind: true
        },
        wikilink2: {
            type: 'wikilink',
            match: /(?:"([^"]*)"\s*)(\[(?=[^\s\[\]])(.*?)\](?=[_\W]|$))/,
            filter: function(node) {
                node._href = '?' + node[2];
                return(node[1] || node[2]);
            }
        },
        a: {
            match: /((?:"([^"]*)"\s*)?<?((?:http|https|ftp|irc|file):(?:\/\/)?[\;\/\?\:\@\&\=\+\$\,\[\]\#A-Za-z0-9\-\_\.\!\~\*\'\(\)%]+[A-Za-z0-9\/#])>?)/,
            filter: function(node) {
                node._href = node[2];
                return(node[1] || node[2]);
            }
        },
        file: {
            match: /((?:"([^"]*)")?<(\\\\[^\s\>\)]+)>)/,
            filter: function(node) {
                var href = node[2].replace(/^\\\\/, '');
                node._href = "file://" + href.replace(/\\/g, '/');
                return(node['1'] || href);
            }
        },
        im: {
            match: (new RegExp(im_re)),
            filter: function(node) {
                node._wafl = node[1] + ': ' + node[2];
                node._label = (im_label[im_types[node[1]]] || '%1').replace(/%1/g, node[2]);
                return '';
            }
        },
        mail: {
            match: /([\w+%\-\.]+@(?:[\w\-]+\.)+[\w\-]+)/,
            filter: function(node) {
                node.type = 'a';
                node._href = "mailto:" + node.text.replace(/%/g, '%25');
            }
        },
        tt: re_huggy('`'), // Special-cased in re_huggy above to disallow subphrases
        b: re_huggy('*'),
        i: re_huggy('_'),
        del: re_huggy('-')
    };
};

});
