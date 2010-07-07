Class('Document.Emitter.HTML(Document.Emitter)', function() {

var proto = this.prototype;
proto.className = 'Document.Emitter.HTML';

proto.content = function() {
    var len = this.output.length;
    return this.output;
}

proto.begin_node = function(node) {
    var tag = node.type;
    switch (tag) {
        case 'asis': case 'line': return;
        case 'br': case 'hr': {
            this.output += '<'+tag+' />';
            return;
        }
        case 'html': {
            var onload = "if (typeof(ss) != 'undefined' && ss.editor) { var recalc = function () { try { ss.editor.DoPositionCalculations() } catch (e) { setTimeout(recalc, 500) } }; recalc() } if (!window.image_dimension_cache) window.image_dimension_cache = {};window.image_dimension_cache['https://www2.socialtext.net/data/wafl/Raw%20HTML%20section.%20Edit%20in%20Wiki%20Text%20mode.?uneditable=1'] = [ this.offsetWidth, this.offsetHeight ]; this.style.width = this.offsetWidth + 'px'; this.style.height = this.offsetHeight + 'px'";
            this.output += '<img widget="'+node._html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/>/, '&gt;')+'" src="https://www2.socialtext.net/data/wafl/Raw%20HTML%20section.%20Edit%20in%20Wiki%20Text%20mode.?uneditable=1" title="Raw HTML section. Edit in Wiki Text mode." onload="'+onload+'" />';
            return;
        }
        case 'waflparagraph': case 'waflphrase': case 'im': {
            var onload = "if (typeof(ss) != 'undefined' && ss.editor) { var recalc = function () { try { ss.editor.DoPositionCalculations() } catch (e) { setTimeout(recalc, 500) } }; recalc() } if (!window.image_dimension_cache) window.image_dimension_cache = {};window.image_dimension_cache['https://www2.socialtext.net/data/wafl/"+node._label.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "\\'").replace(/\\/g, "\\\\")+"'] = [ this.offsetWidth, this.offsetHeight ]; this.style.width = this.offsetWidth + 'px'; this.style.height = this.offsetHeight + 'px'";

            if ((!Document.Emitter.HTML.renderImageAsNormalWAFL) && node._wafl.match(/^image:\s*(\S+)(?:\s+size=(\w+))?/)) {
                var imageName = RegExp.$1;
                var width = RegExp.$2;
                switch (width) {
                    case 'small':  { width = '100'; break; }
                    case 'medium': { width = '300'; break; }
                    case 'large':  { width = '600'; break; }
                }
                if (width && width.search(/^[.\d]+$/) == 0) {
                    width = ' width="'+width+'"';
                }
                if ((typeof $ != 'undefined') && $('#st-attachment-listing').size()) {
                    var found = null;
                    $('#st-attachment-listing a').each(function(){
                        var $_ = $(this);
                        if ($_.text() == imageName) {
                            found = '<img widget="{'+node._wafl.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/>/, '&gt;')+'}" src="' + $_.attr('href') + '" onload="'+onload+'"'+width+' />';
                            return false;
                        }
                    });
                    if (found) {
                        this.output += found;
                        return;
                    }
                }
            }
            this.output += '<img widget="{'+node._wafl.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/>/, '&gt;')+'}" src="https://www2.socialtext.net/data/wafl/'+encodeURIComponent(node._label)+'" onload="'+onload+'" />';
            return;
        }
        case 'a': case 'wikilink': {
            this.output += '<a href="'+encodeURI(node._href)+'">';
            return;
        }
        case 'file': {
            this.output += '<a title="(network resource)" href="'+encodeURI(node._href)+'">';
            return;
        }
        case 'table': {
            var cls = 'formatter_table';

            if (node._sort) { cls += ' sort' }
            if (!node._border) { cls += ' borderless' }

            this.output += '<table '
                         + (node._border ? 'border="1" ' : '')
                         + 'style="border-collapse:collapse" '
                         + 'options="'+node._options+'" '
                         + 'class="'+cls+'"'
                         + ">\n";
            return;
        }
        case 'ul': case 'ol': case 'table': case 'tr': {
            this.output += '<'+tag+">\n";
            return;
        }
        default: {
            this.output += '<'+tag+'>';
            return;
        }
    }
}

proto.end_node = function(node) {
    var tag = node.type;
    switch (tag) {
        case 'asis': case 'br': case 'hr': case 'html': case 'waflparagraph': case 'waflphrase': case 'im': return;
        case 'line': {
            this.output += '<br />';
            return;
        }
        case 'file': case 'wikilink': {
            this.output += '</a>';
            return;
        }
        default: {
            if (tag.search(/^(?:p|ul|ol|li|h\d|table|tr|td)$/) == 0) {
                this.output += '</'+tag+">\n";
            }
            else {
                this.output += '</'+tag+'>';
            }
            return;
        }
    }
    return;
}

proto.text_node = function(text) {
    if (/[&<>"']/.test(text)) {
        this.output += text
            .replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&#34;')
            .replace(/'/g, '&#39;');
    }
    else {
        this.output += text
    }
}

});
