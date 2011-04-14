/*==============================================================================
This Wikiwyg mode supports a DesignMode wysiwyg editor with toolbar buttons

COPYRIGHT:

    Copyright (c) 2005 Socialtext Corporation
    655 High Street
    Palo Alto, CA 94301 U.S.A.
    All rights reserved.

Wikiwyg is free software.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 =============================================================================*/

proto = new Subclass('Wikiwyg.Wysiwyg', 'Wikiwyg.Mode');

proto.classtype = 'wysiwyg';
proto.modeDescription = 'Wysiwyg';

proto.config = {
    border: '1px solid black',
    useParentStyles: true,
    useStyleMedia: 'wikiwyg',
    iframeId: null,
    iframeObject: null,
    disabledToolbarButtons: [],
    editHandler: undefined,
    editHeightMinimum: 150,
    editHeightAdjustment: 1.3,
    clearRegex: null,
    enableClearHandler: false,
    noToolbar: false,
    noTableSorting: false
};

proto.initializeObject = function() {
    this.edit_iframe = this.get_edit_iframe();
    this.div = this.edit_iframe;
    this.div.style.width = '99%';
    var self = this;
}

proto.toHtml = function(func) {
    this.get_inner_html(func);
}

proto.clear_inner_html = function() {
    var inner_html = this.get_inner_html();
    var clear = this.config.clearRegex;
    var res = inner_html.match(clear) ? 'true' : 'false';
    if (clear && inner_html.match(clear)) {
        if ($.browser.safari) {
            this.set_inner_html('<div></div>');
        }
        else {
            this.set_inner_html('');
        }
    }
}

proto.get_keybinding_area = function() {
    return this.get_edit_document();
}

proto.get_edit_iframe = function() {
    var iframe;
    if (this.config.iframeId) {
        iframe = document.getElementById(this.config.iframeId);
        iframe.iframe_hack = true;
    }
    else if (this.config.iframeObject) {
        iframe = this.config.iframeObject;
        iframe.iframe_hack = true;
    }
    else {
        // XXX in IE need to wait a little while for iframe to load up
        iframe = document.createElement('iframe');
    }
    return iframe;
}

proto.get_edit_window = function() { // See IE, below
    return this.edit_iframe.contentWindow;
}

proto.get_edit_document = function() { // See IE, below
    return this.get_edit_window().document;
}

proto.get_inner_html = function(cb) {
    var innerHTML = this.get_edit_document().body.innerHTML;

    if (cb) {
        cb(innerHTML);
        return;
    }

    return innerHTML;
}

proto.getInnerText = function() {
    var body = this.get_edit_document().body;
    return body.innerText || body.textContent || '';
}

proto.set_inner_html = function(html) {
    if (this.get_edit_document().body) {
        this.get_edit_document().body.innerHTML = html;
        $(this.get_edit_document()).triggerHandler('change');
    }
}

proto.apply_stylesheets = function() {
    var styles = document.styleSheets;
    var head   = this.get_edit_document().getElementsByTagName("head")[0];

    for (var i = 0; i < styles.length; i++) {
        var style = styles[i];

        if (style.href == location.href)
            this.apply_inline_stylesheet(style, head);
        else
            if (this.should_link_stylesheet(style))
                this.apply_linked_stylesheet(style, head);
    }
}

proto.apply_inline_stylesheet = function(style, head) {
    var style_string = "";
    for ( var i = 0 ; i < style.cssRules.length ; i++ ) {
        if ( style.cssRules[i].type == 3 ) {
            // IMPORT_RULE

            /* It's pretty strange that this doesnt work.
               That's why Ajax.get() is used to retrive the css text.

            this.apply_linked_stylesheet({
                href: style.cssRules[i].href,
                type: 'text/css'
            }, head);
            */

            style_string += Ajax.get(style.cssRules[i].href);
        } else {
            style_string += style.cssRules[i].cssText + "\n";
        }
    }
    if (style_string.length > 0) {
        style_string += "\nbody { padding: 5px; }\n";
        this.append_inline_style_element(style_string, head);
    }
}

proto.append_inline_style_element = function(style_string, head) {
    // Add a body padding so words are not touching borders.
    var style_elt = document.createElement("style");
    style_elt.setAttribute("type", "text/css");
    if ( style_elt.styleSheet ) { /* IE */
        style_elt.styleSheet.cssText = style_string;
    }
    else { /* w3c */
        var style_text = document.createTextNode(style_string);
        style_elt.appendChild(style_text);
        head.appendChild(style_elt);
    }
    // XXX This doesn't work in IE!!
    // head.appendChild(style_elt);
}

proto.should_link_stylesheet = function(style, head) {
        var media = style.media;
        var config = this.config;
        var media_text = media.mediaText ? media.mediaText : media;
        var use_parent =
             ((!media_text || media_text == 'screen') &&
             config.useParentStyles);
        var use_style = (media_text && (media_text == config.useStyleMedia));
        if (!use_parent && !use_style) // TODO: simplify
            return false;
        else
            return true;
}

proto.apply_linked_stylesheet = function(style, head) {
    var link = Wikiwyg.createElementWithAttrs(
        'link', {
            href:  style.href,
            type:  style.type,
            media: 'screen',
            rel:   'STYLESHEET'
        }, this.get_edit_document()
    );
    head.appendChild(link);
}

proto.exec_command = function(command, option) {
    if ( Wikiwyg.is_ie && command.match(/^insert/) && !command.match(/^insert.*list$/)) {
        /* IE6+7 has a bug that prevents insertion at the beginning of
         * the edit document if it begins with a non-text element.
         * So we test if the selection starts at the beginning, and
         * prepends a temporary space so the insert can work. -- {bz: 1451}
         */

        this.set_focus(); // Need this before .insert_html

        var range = this.__range
                 || this.get_edit_document().selection.createRange();

        if (range.boundingLeft == 1 && range.boundingTop <= 20) {
            var doc = this.get_edit_document();
            var div = doc.getElementsByTagName('div')[0];

            var randomString = Math.random();
            var stub = doc.createTextNode(' ');

            div.insertBefore(stub, div.firstChild);

            var stubRange = doc.body.createTextRange();
            stubRange.findText(' ');
            stubRange.select();
        }
        else {
            range.collapse();
            range.select();
        }
    }

    if ((command == 'inserthtml') && ((typeof(option) != 'string') || option.length == 0)) {
        return true;
    }
    return(this.get_edit_document().execCommand(command, false, option));
};

proto.format_command = function(command) {
    this.exec_command('formatblock', '<' + command + '>');
}

proto.do_bold = function() {
    this.exec_command('bold');
}
proto.do_italic = function() {
    this.exec_command('italic');
}
proto.do_underline = function() {
    this.exec_command('underline');
}
proto.do_strike = function() {
    this.exec_command('strikethrough');
}
proto.do_hr = function() {
    this.exec_command('inserthorizontalrule');
}
proto.do_ordered = function() {
    this.exec_command('insertorderedlist');
}
proto.do_unordered = function() {
    this.exec_command('insertunorderedlist');
}
proto.do_indent = function() {
    this.exec_command('indent');
}
proto.do_outdent = function() {
    this.exec_command('outdent');
}

proto.do_h1 = proto.format_command;
proto.do_h2 = proto.format_command;
proto.do_h3 = proto.format_command;
proto.do_h4 = proto.format_command;
proto.do_h5 = proto.format_command;
proto.do_h6 = proto.format_command;
proto.do_pre = proto.format_command;

proto.insert_html = function(html) { // See IE
    this.get_edit_window().focus();
    this.exec_command('inserthtml', html);
    $(this.get_edit_document()).triggerHandler('change');
}

proto.do_unlink = function() {
    this.exec_command('unlink');
}

proto.do_www = function() {
    var selection = this.get_link_selection_text();
	if (selection != null) {
		var  url =  prompt("Please enter a link", "Type in your link here");
		this.exec_command('createlink', url);
	}
}

proto.get_selection_text = function() { // See IE, below
    return this.get_edit_window().getSelection().toString();
}

/*==============================================================================
Support for Internet Explorer in Wikiwyg.Wysiwyg
 =============================================================================*/
if (Wikiwyg.is_ie) {

proto.toHtml = function(func) {
    var self = this;
    this.get_inner_html_async(function(html){
        var br = "<br class=\"p\"/>";

        html = self.remove_padding_material(html);
        html = html
            .replace(/\n*<p>\n?/ig, "")
            .replace(/<\/p>(?:<br class=padding>)?/ig, br)

        func(html);
    });
}

proto.remove_padding_material = function(html) {
    var dom = document.createElement("div");
    if (Wikiwyg.is_ie)
        html = html.replace(/<P>\s*<HR>\s*<\/P>\s*/g, '<HR>\n\n');

    $(dom).html(html);

    // <BR>&nbsp; at t last. This is likely
    // something left by deleting from a padding <p>.
    var pTags = dom.getElementsByTagName("p");

    for(var i = 0; i < pTags.length; i++) {
      var p = pTags[i];
      if (p.nodeType == 1) {
          if (/<P class=padding>&nbsp;<\/P>/.test(p.outerHTML)) {
              p.outerHTML = "<BR class=padding>"
          } else if (p.innerHTML.match(/&nbsp;$/)) {
              var h = p.innerHTML
              p.innerHTML = h.replace(/&nbsp;$/,"");
          }
      }
    }

    return dom.innerHTML;
}

proto.get_edit_window = function() {
    return this.edit_iframe;
}

proto.get_edit_document = function() {
    return this.edit_iframe.contentWindow.document;
}

proto.onbeforedeactivate = function() {
    this.__range = this.get_edit_document().selection.createRange();
}

proto.onactivate = function() {
    this.__range = undefined;
}

proto.get_selection_text = function() {
    var selection = this.get_edit_document().selection;

    if (selection != null) {
        this.__range = selection.createRange();
        if (!this.__range.htmlText) return;
        return Wikiwyg.htmlUnescape(this.__range.htmlText.replace( /<[^>]+>/g, '' ));
    }
    return '';
}

proto.insert_html = function(html, triedSetFocus) {
    var doc = this.get_edit_document();
    var range = this.__range;
    if (!range) {
        range = doc.selection.createRange();
    }

    if (range.boundingTop == 2 && range.boundingLeft == 2)
        return;

    var id = "marquee-" + (Date.now ? Date.now() : (new Date()).getTime());

    if (triedSetFocus) {
        /* Counter the move-right effect of re-focusing (cf. {bz: 1962}),
         * by moving leftward by one character.  Ugly, but it works.
         */
        range.move('character', -1);
    }

    range.execCommand('insertmarquee', false, id);

    var $newNode = $('#'+id, this.get_edit_document());
    if ($newNode.size() == 0)  {
        /* {bz: 2756} - We're deliberately re-focus and have IE8 move
         * the cursor rightward, then compensate for it in the second
         * call to ourselves (see the triedSetFocus paragraph above).
         */
        $('#'+id).remove();

        if (triedSetFocus) {
            /* This should never happen -- at least until IE9 is released ;-) */
            alert("Sorry, an IE bug prevented this action. Please select some text first and try again.");
            return;
        }
        else {
            this._hasFocus = false;
            this.__range = null;
            this.set_focus();
            return this.insert_html(html, true);
        }
    }

    $newNode.replaceWith(html);

    range.collapse(false);
    range.select();

    if (this.__range) {
        this.__range = null;
    }

    $(this.get_edit_document()).triggerHandler('change');
}

proto.get_inner_html = function( cb ) {
    if ( cb ) {
        this.get_inner_html_async( cb );
        return;
    }

    var html = null;
    try {
        html = this.get_editable_div().innerHTML;
    } catch (e) {
        html = '';
    }

    return html;
}

proto.get_editable_div = function () {
    if (!this._editable_div) {
        this._editable_div = this.get_edit_document().createElement('div');
        this._editable_div.contentEditable = true;
        this._editable_div.style.overflow = 'auto';
        this._editable_div.style.border = 'none'
        this._editable_div.style.position = 'absolute';
        this._editable_div.style.width = '100%';
        this._editable_div.style.height = '100%';
        this._editable_div.id = 'wysiwyg-editable-div';
        this._editable_div.onbeforedeactivate = this.onbeforedeactivate.bind(this);
        this._editable_div.onactivate = this.onactivate.bind(this);
        this.get_edit_document().body.appendChild(this._editable_div);
        var self = this;
        setTimeout(function () { self._editable_div.focus() }, 500);
    }
    return this._editable_div;
}

proto.get_inner_html_async = function( cb, tries ) {
    var self = this;
    var doc = this.get_edit_document();
    if ( doc.readyState == 'loading' ) {
        setTimeout( function() {
            self.get_inner_html(cb);
        }, 500);
    } else {
        var html = null;
        try {
            html = this.get_editable_div().innerHTML;
        } catch (e) {
            if (tries < 20) {
                setTimeout( function() {
                    self.get_inner_html_async( cb, tries + 1 );
                }, 500);
            }
            else {
                html = loc('error.edit-again');
            }
        }
        if (html != null) {
            cb(html);
            return html;
        }
    }
}

proto.set_inner_html = function(html) {
    var self = this;
    var doc = this.get_edit_document();
    if ( doc.readyState == 'loading' ) {
        setTimeout( function() {
            self.set_inner_html(html);
        }, 100);      
    } else if (!self._editable_div) {
        // First time running get_editable_div() -- give it 1.6sec
        // The heuristic here is to allow 3 tries of tryAppendDiv to pass.
        self.get_editable_div();

        if (!html) { return }
        setTimeout( function() {
            self.set_inner_html(html);
        }, 1600);      
    } else {
        try {
            this._editable_div.innerHTML = html;
            $(this.get_edit_document()).triggerHandler('change');
        } catch (e) {
            try {
                 self._editable_div.parentNode.removeChild(self._editable_div);
	    } catch (e) {}

            self._editable_div = null;
            self.get_editable_div();

	    // 1.6sec clearly not enough -- give it another 10.1sec
            // The heuristic here is to allow 10 tries of tryAppendDiv to pass.
            setTimeout( function() {
                self.set_inner_html(html);
            }, 10100);
        }
    }
}

// Use IE's design mode default key bindings for now.
proto.enable_keybindings = function() {}

} // end of global if

// Here goes the original javascript/Wikiwyg/Socialtext.js.
/*==============================================================================
Wikiwyg - Turn any HTML div into a wikitext /and/ wysiwyg edit area.

DESCRIPTION:

Wikiwyg is a Javascript library that can be easily integrated into any
wiki or blog software. It offers the user multiple ways to edit/view a
piece of content: Wysiwyg, Wikitext, Raw-HTML and Preview.

The library is easy to use, completely object oriented, configurable and
extendable.

See the Wikiwyg documentation for details.

AUTHORS:

    Ingy döt Net <ingy@cpan.org>
    Casey West <casey@geeknest.com>
    Chris Dent <cdent@burningchrome.com>
    Matt Liggett <mml@pobox.com>
    Ryan King <rking@panoptic.com>
    Dave Rolsky <autarch@urth.org>

COPYRIGHT:

    Copyright (c) 2005 Socialtext Corporation
    655 High Street
    Palo Alto, CA 94301 U.S.A.
    All rights reserved.

Wikiwyg is free software.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

 =============================================================================*/

/*==============================================================================
Socialtext Wysiwyg subclass.
 =============================================================================*/

proto.process_command = function(command) {
    command = command
        .replace(/-/g, '_');
    if (this['do_' + command])
        this['do_' + command](command);

    if ( command == 'link' && !(this.wikiwyg.config.noToolbar)) {
        var self = this;
        setTimeout(function() {
            self.wikiwyg.toolbarObject
                .focus_link_menu('do_widget_link2', 'Wiki');
        }, 100);
    }

    if (Wikiwyg.is_gecko) this.get_edit_window().focus();
}

proto.fix_up_relative_imgs = function() {
    var base = location.href.replace(/(.*?:\/\/.*?\/).*/, '$1');
    var imgs = this.get_edit_document().getElementsByTagName('img');
    for (var ii = 0; ii < imgs.length; ++ii) {
        if (imgs[ii].src != imgs[ii].src.replace(/^\//, base)) {
            if ( jQuery.browser.msie && !imgs[ii].complete) {
                jQuery(imgs[ii]).load(function(){
                    this.src = this.src.replace(/^\//, base);
                });
            }
            else {
                imgs[ii].src = imgs[ii].src.replace(/^\//, base);
            }
        }
    }
}

proto.blur = function() {
    try {
        if (Wikiwyg.is_gecko) this.get_edit_window().blur();
        if (Wikiwyg.is_ie) this.get_editable_div().blur();
    } catch (e) {}
}

proto.set_focus = function() {
    try {
        if (Wikiwyg.is_gecko) this.get_edit_window().focus();
        if (Wikiwyg.is_ie && !this._hasFocus) {
            this.get_editable_div().focus();
        }
    } catch (e) {}
}

proto.on_key_enter = function(e) {
    var win = this.get_edit_window();
    var doc = this.get_edit_document();
    var sel, node;

    if (win.getSelection) {
        sel = win.getSelection();
        if (!sel) return;
        node = sel.anchorNode;
    }
    else if (doc.selection) {
        sel = doc.selection;
        if (!sel) return;
        node = sel.createRange().parentElement();
    }

    if (!node) return;

    if (jQuery(node).is("li")) {
        jQuery(node).find("br:last-child").remove();
    }
}

proto.enable_table_navigation_bindings = function() {
    var self = this;
    var event_name = "keydown";
    if (jQuery.browser.mozilla && navigator.oscpu.match(/Mac/)) {
        event_name = "keypress";
    }

    self.bind( event_name, function (e) {
        if (e.metaKey || e.ctrlKey) { return true; }
        switch (e.keyCode) {
            case 9: { // Tab
                var $cell = self.find_table_cell_with_cursor();
                if (!$cell) { return; }
                e.preventDefault();

                var $new_cell;
                if (e.shiftKey) {
                    $new_cell = $cell.prev('td');
                    if (!$new_cell.length) {
                        $new_cell = $cell.parents('tr:first').prev('tr').find('td:last');
                        if (!$new_cell.length) {
                            return;
                        }
                    }
                }
                else {
                    $new_cell = $cell.next('td');
                    if (!$new_cell.length) {
                        $new_cell = $cell.parents('tr:first').next('tr').find('td:first');
                        if (!$new_cell.length) {
                            // Extend the table now we're at the last cell
                            var doc = self.get_edit_document();
                            var $tr = jQuery(doc.createElement('tr'));
                            $cell.parents("tr").find("td").each(function() {
                                $tr.append('<td style="border: 1px solid black; padding: 0.2em;">&nbsp;</td>');
                            });
                            $tr.insertAfter( $cell.parents('tr:first') );
                            $new_cell = $tr.find('td:first');
                        }
                    }
                }

                self.set_focus_on_cell($new_cell);
                break;
            }
            case 38: { // Up
                self._do_table_up_or_down(e, 'prev', ':first');
                break;
            }
            case 40: { // Down
                self._do_table_up_or_down(e, 'next', ':last');
                break;
            }
        }
    });
}

proto._do_table_up_or_down = function(e, direction, selector) {
    var self = this;
    if (e.shiftKey) { return; }

    var $cell = self.find_table_cell_with_cursor();
    if (!$cell) { return; }

    var col = self._find_column_index($cell);
    if (!col) { return; }

    var $tr = $cell.parents('tr:first')[direction]('tr:first');
    var $new_cell;
    if ($tr.length) {
        var tds = $tr.find('td');
        $new_cell = $(tds[col-1]);
        e.preventDefault();
    }
    else {
        // At the top/bottom row - move to the first/last cell,
        // and do not preventDefault, so we can move outside the table
        $new_cell = $cell.parents('table:first').find('tr'+selector+' td'+selector);
    }

    self.set_focus_on_cell($new_cell);
}

proto.enable_pastebin = function () {
    var self = this;

    if ($.browser.safari) {
        this.bind('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch (e.which) {
                    case 66: case 98: {
                        self.do_bold();
                        e.preventDefault();
                        break;
                    }
                    case 73: case 105: {
                        self.do_italic();
                        e.preventDefault();
                        break;
                    }
                }
            }
        });
        self.enable_pastebin_webkit();
        return;
    }

    self.pastebin = jQuery('#pastebin').attr('contentWindow');

    if (self.pastebin) {
        if (!self.pastebin.document.body) {
            setTimeout(function() {
                self.rebindHandlers();
            }, 500);
            return;
        }

        self.pastebin.document.body.innerHTML = "";
        self.pastebin.document.designMode = "on";
    }

    var event_name = "keydown";
    if (jQuery.browser.mozilla && navigator.oscpu.match(/Mac/)) {
        event_name = "keypress";
    }

    this.bind(event_name, function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.which == 86 || e.which == 118)) {
            self.on_before_paste();
        }
        else if (self.on_key_handler) {
            return self.on_key_handler(e);
        }
        else if (e.which == 13) {;
            self.on_key_enter(e);
        }
    });

    this.rebindHandlers();
}

// WebKit 5xx can only paste into the same editable div, not another iframe,
// so it needs a separate treatment.
proto.enable_pastebin_webkit = function () {
    var self = this;
    $(self.get_edit_window()).unbind('paste').bind("paste", function(e) {
        self.get_edit_window().focus();

        var editDoc = self.get_edit_document();
        var sel = self.get_edit_window().getSelection();
        var oldRange = sel.getRangeAt(0);

        $('div.pastebin', editDoc).remove();

        var pasteBin = editDoc.createElement('div');
        pasteBin.style.width = '1px';
        pasteBin.style.height = '1px';
        pasteBin.style.position = 'fixed';
        pasteBin.style.top = '0';
        pasteBin.style.right = '-4000';
        pasteBin.className = 'pastebin';
        pasteBin.appendChild( editDoc.createTextNode('') );
        editDoc.body.appendChild( pasteBin );
        pasteBin.focus();

        var r = editDoc.createRange();
        r.setStart( pasteBin, 0 );
        r.setEnd( pasteBin, 0 );

        sel.removeAllRanges();
        sel.addRange(r);

        setTimeout(function(){
            var pastedHtml;

            while (pasteBin.firstChild && pasteBin.firstChild.tagName && pasteBin.firstChild.tagName.toLowerCase() == 'meta') {
                pasteBin.removeChild( pasteBin.firstChild );
            }

            if (pasteBin.firstChild && pasteBin.firstChild.className == 'Apple-style-span') {
                pastedHtml = pasteBin.firstChild.innerHTML;
            }
            else {
                pastedHtml = pasteBin.innerHTML;
            }
            try {
                editDoc.body.removeChild( pasteBin );
            } catch (e) {}
            sel.removeAllRanges();
            sel.addRange(oldRange);
            self.on_pasted(pastedHtml);
        }, 1);
    }, false);
}

proto.on_before_paste = function () {
    var self = this;
    if (self.pastebin) {
        self.pastebin.focus();

        setTimeout(function() {
            var html = self.pastebin.document.body.innerHTML;
            self.pastebin.document.body.innerHTML = "";

            self.on_pasted(html);
        }, 100);
    }
}

proto.bind = function (event_name, callback) {
    var $edit_doc = jQuery(this.get_edit_document());
    var $edit_win = jQuery(this.get_edit_window());

    this._bindings = this._bindings || {};
    this._bindings[event_name] = this._bindings[event_name] || [];

    /* ONLY add the callback to this._bindings if it isn't already
     * there! This means we need to do a string compare of callbacks
     * so we catch identical anonymous functions.
     */
    var matches = jQuery.grep(
        this._bindings[event_name],
        function(i,n) { return String(callback) == String(i) }
    );
    if (!matches.length) {
        this._bindings[event_name].push(callback);
        this._bindHandler(event_name, callback);
    }
}

proto.rebindHandlers = function() {
    if (this._bindings) {
        for (var event_name in this._bindings) {
            this._unbindHandler(event_name);
            for (var i=0; i<this._bindings[event_name].length; i++) {
                this._bindHandler(event_name, this._bindings[event_name][i]);
            }
        }
    }
}

proto._unbindHandler = function(event_name) {
    jQuery(this.get_edit_document()).unbind(event_name);
    jQuery(this.get_edit_window()).unbind(event_name);
}

proto._bindHandler = function(event_name, callback) {
    if ((Wikiwyg.is_ie || $.browser.webkit) && event_name == 'blur') {
        jQuery(this.get_edit_window()).bind(event_name, callback);
    }
    else {
        jQuery(this.get_edit_document()).bind(event_name, callback);
    }
}

proto.enableThis = function() {
    Wikiwyg.Mode.prototype.enableThis.call(this);
    this.edit_iframe.style.border = this.config.border;
    this.edit_iframe.width = '99%';
    this.setHeightOf(this.edit_iframe);
    this.fix_up_relative_imgs();

    var self = this;
    var ready = function() {
        if (!self.wikiwyg.previous_mode && !Wikiwyg.is_gecko) {
            self.fromHtml( self.wikiwyg.div.innerHTML );
        }
        if (Wikiwyg.is_gecko) {
            var doEnableDesignMode = function() {
                try {
                    self.get_edit_document().designMode = 'on';
                } catch (e) {
                    setTimeout(doEnableDesignMode, 100);
                    return;
                }
                setTimeout(function() {
                    try {
                        self.get_edit_document().execCommand(
                            "enableObjectResizing", false, false
                        );
                        self.get_edit_document().execCommand(
                            "enableInlineTableEditing", false, false
                        );

                        if (!self.wikiwyg.previous_mode) {
                            self.fromHtml( self.wikiwyg.div.innerHTML );
                        }
                    }
                    catch(e){
                        setTimeout(doEnableDesignMode, 100);
                    }
                    $('#st-page-editing-wysiwyg').css('visibility', 'visible');
                }, 100);
            };
            doEnableDesignMode();
        }
        else if (Wikiwyg.is_ie) {
            /* IE needs this to prevent stack overflow when switching modes,
             * as described in {bz: 1511}.
             */
            self._ieSelectionBookmark = null;

            if (jQuery.browser.version <= 6) {
                /* We take advantage of IE6's overflow:visible bug
                 * to make the DIV always agree with the dimensions
                 * of the inner content.  More details here:
                 *     http://www.quirksmode.org/css/overflow.html
                 * Note that this must not be applied to IE7+, because
                 * overflow:visible is implemented correctly there, and
                 * setting it could trigger a White Screen of Death
                 * as described in {bz: 1366}.
                 */
                jQuery(self.get_editable_div()).css(
                    'overflow', 'visible'
                );
            }

            $('#st-page-editing-wysiwyg').css('visibility', 'visible');
        }
        else {
            $('#st-page-editing-wysiwyg').css('visibility', 'visible');
        }

        self.enable_keybindings();
        self.enable_table_navigation_bindings();

        self.enable_pastebin();
        if (!self.wikiwyg.config.noAutoFocus) {
            self.set_focus();
        }
        self.rebindHandlers();
        self.set_clear_handler();

        if (!self.config.noTableSorting) {
            jQuery.poll(
                function() {
                    return jQuery("table.sort", self.get_edit_document())
                        .size() > 0
                },
                function() {
                    jQuery('table.sort', self.get_edit_document())
                        .each(function() {
                            Socialtext.make_table_sortable(this);
                        });
                }, 500, 10000
            );
        }
    };

    jQuery.poll(
        function() {
            var win = self.get_edit_window();
            var loaded = false;
            try {
                loaded = self.edit_iframe.contentWindow.Socialtext.body_loaded;
            } catch (e) {}
            if (!loaded) return false;

            var doc = self.get_edit_document();
            if (!doc) return false;
            if (jQuery.browser.msie && doc.readyState != 'interactive' && doc.readyState != 'complete') {
                return false;
            }
            return doc.body && typeof(doc.body.innerHTML) != 'undefined';
        },
        function() { ready() },
        500, 10000
    );

    if (!this.config.noToolbar && !this.__toolbar_styling_interval) {
        this.__toolbar_styling_interval = setInterval(
            function() {
                try {
                    self.toolbarStyling()
                }
                catch(e) { }
            }, 1000
        );
    }
}

proto.disableThis = function() {
    Wikiwyg.Mode.prototype.disableThis.call(this);
    clearInterval( this.__toolbar_styling_interval );
    this.__toolbar_styling_interval = null;
}

proto.on_pasted = function(html) {
    var self = this;

    html = html.replace(/^(?:\s*<meta\s[^>]*>)+/i, '');

    if (this.paste_buffer_is_simple(html)) {
        self.insert_html( html );
        return;
    }

    // The "false" here for isWholeDocument means we're dealing with HTML fragments.
    var wikitext = self.wikiwyg.mode_objects[WW_ADVANCED_MODE].convert_html_to_wikitext(html, false);

    if (!/<(?:table|img)[\s>]/i.test(html)) {
        // The HTML does not contain tables or images - use the JS Document parser.
        html = ((new Document.Parser.Wikitext()).parse(wikitext, new Document.Emitter.HTML()));
        self.insert_html( html.replace(/^\s*<p>/i, '').replace(/<\/p>\s*$/i, '') );
        return;
    }

    // For complex tables, we still fallback to server-side rendering for now.
    jQuery.ajax({
        type: 'post',
        url: 'index.cgi',
        data: {
            action: 'wikiwyg_wikitext_to_html',
            content: wikitext
        },
        success: function(html) {
            /* {bz: 3006}: Fix up pasted relative wiki-links copied from Wikiwyg itself. */
            var base = location.href.replace(/\?.*/, '');

            html = html
                .replace(/^<div class="wiki">\n*/i, '')
                .replace(/\n*<br\b[^>]*\/><\/div>\n*$/i, '')
                .replace(/^<p>([\s\S]*?)<\/p>/, '$1')
                .replace(/(<a\b[^>]*\bhref=['"])(index.cgi)?\?/ig, '$1' + base + '?');

            self.insert_html( html );

//             jQuery.hideLightbox();
        },
        error: function(xhr) {
//             jQuery.hideLightbox();
        }
    });
}

proto.paste_buffer_is_simple = function(buffer) {
    return (
        (buffer.indexOf("<") < 0 && buffer.indexOf(">") < 0) ||
        (!buffer.match(/<(font|script|applet|object|div|p|br)/i))
    );
}

proto.toolbarStyling = function() {
    if (this.busy_styling)
        return;

    this.busy_styling = true;

    try {
        var cursor_state = this.get_cursor_state();
        if( cursor_state.inside_table ) {
            jQuery(".table_buttons, .table_buttons img").removeClass("disabled");

            jQuery("#wikiwyg_button_table").addClass("disabled");
            jQuery("#wikiwyg_button_table-settings").removeClass("disabled");

            if (cursor_state.header_row) {
                jQuery("#wikiwyg_button_move-row-down, #wikiwyg_button_move-row-up, #wikiwyg_button_add-row-above").addClass("disabled");
            }
            if (cursor_state.first_row) {
                jQuery("#wikiwyg_button_move-row-up").addClass("disabled");

                if (cursor_state.sortable_table) {
                    jQuery("#wikiwyg_button_del-row").addClass("disabled");
                }
            }
            if (cursor_state.last_row) {
                jQuery("#wikiwyg_button_move-row-down").addClass("disabled");
            }
            if (cursor_state.first_column) {
                jQuery("#wikiwyg_button_move-col-left").addClass("disabled");
            }
            if (cursor_state.last_column) {
                jQuery("#wikiwyg_button_move-col-right").addClass("disabled");
            }
        }
        else {
            jQuery(".table_buttons").addClass("disabled");
            jQuery("#wikiwyg_button_table").removeClass("disabled");
            jQuery("#wikiwyg_button_table-settings").addClass("disabled");
        }

        if (Wikiwyg.is_gecko) {
            this.get_edit_document().execCommand("enableInlineTableEditing", false, false);
        }
    } catch(e) { }
    this.busy_styling = false;
}

proto.get_cursor_state = function() {
    var selection = this.get_edit_document().selection
        ? this.get_edit_document().selection
        : this.get_edit_window().getSelection();
    var anchor = selection.anchorNode
        ? selection.anchorNode
        : selection.createRange().parentElement();

    var cursor_state = {
        sortable_table: false,
        inside_table: false,
        header_row: false,
        first_row: false,
        last_row: false,
        last_column: false
    };

    var $table = jQuery(anchor, this.get_edit_window()).parents("table");
    if( $table.size() == 0 ) {
        return cursor_state;
    }

    cursor_state.inside_table = true;
    cursor_state.table = $table.get(0);
    cursor_state.sortable_table = $table.is(".sort");

    var $tr = jQuery(anchor, this.get_edit_window()).parents("tr");

    if ($tr.size() == 0) return cursor_state;

    if ($tr.prev("tr").size() == 0) cursor_state.first_row = true;
    if ($tr.next("tr").size() == 0) cursor_state.last_row = true;

    var $td = jQuery(anchor, this.get_edit_window()).parents("td");
    var $th = jQuery(anchor, this.get_edit_window()).parents("th");

    if ($td.size() > 0) {
        if ($td.prev("td").size() == 0) cursor_state.first_column = true;
        if ($td.next("td").size() == 0) cursor_state.last_column = true;
    }
    if ($th.size() > 0) {
        if ($th.prev("th").size() == 0) cursor_state.first_column = true;
        if ($th.next("th").size() == 0) cursor_state.last_column = true;
        cursor_state.header_row = true;
    }

    return cursor_state;
}

proto.set_clear_handler = function () {
    var self = this;
    if (!this.wikiwyg.config.enableClearHandler && !Socialtext.new_page) return;

    var editor = Wikiwyg.is_ie ? self.get_editable_div()
                               : self.get_edit_document();

    var clean = function(e) {
        self.clear_inner_html();
        jQuery(editor).unbind('click', clean).unbind('keydown', clean);
        $(window).focus();
        self.set_focus();
    };

    try {
        jQuery(editor).one("click", clean).one("keydown", clean);
    } catch (e) {};
}

proto.show_messages = function(html) {}

proto.do_p = function() {
    this.format_command("p");
}

proto.do_image = function() {
    this.do_widget_image();
}

proto.do_video = function() {
    this.do_widget_video();
}

proto.do_link = function(widget_element) {
    this._do_link(widget_element);
}

proto.do_video = function() {
    this.do_widget_video();
}

proto.do_widget = function(widget_element) {
    if (widget_element && widget_element.nodeName) {
        this.do_opensocial_setup(widget_element);
        return;
    }
    this.do_opensocial_gallery();
}

proto.add_wiki_link = function(widget_element, dummy_widget) {
    var label     = jQuery("#wiki-link-text").val(); 
    var workspace = jQuery("#st-widget-workspace_id").val() || "";
    var page_name = jQuery("#st-widget-page_title").val();
    var section   = jQuery("#wiki-link-section").val();
    var workspace_id = dummy_widget.title_and_id.workspace_id.id || workspace.replace(/\s+/g, '');

    if (!page_name) {
        this.set_add_a_link_error( "Please fill in the Page field for wiki links." );
        return false;
    } 

    if (workspace && workspace_id && !this.lookupTitle("workspace_id", workspace_id)) {
        this.set_add_a_link_error( "That workspace does not exist." );
        return false;
    }

    if (!section && (!workspace || workspace == Socialtext.wiki_id)) {  // blue links
        this.make_wiki_link(page_name, label);
    } else { // widgets
        var wafl = this.create_link_wafl(label, workspace_id, page_name , section);
        this.insert_link_wafl_widget(wafl, widget_element);
    }

    return true;
}

proto.add_section_link = function(widget_element) {
    var section = jQuery('#section-link-text').val();

    if (!section) {
        this.set_add_a_link_error( "Please fill in the section field for section links." );
        return false;
    } 

    var wafl = this.create_link_wafl(false, false, false, section);
    this.insert_link_wafl_widget(wafl, widget_element);

    return true;
}

proto.add_web_link = function() {
    var url       = jQuery('#web-link-destination').val();
    var url_text  = jQuery('#web-link-text').val();

    if (!this.valid_web_link(url)) {
        this.set_add_a_link_error("Please fill in the Link destination field for web links.");
        return false;
    }

    this.make_web_link(url, url_text);
    return true;
}

proto.valid_web_link = function(url) {
    return (url.length && url.match(/^(http|https|ftp|irc|mailto|file):/));
}

proto.insert_link_wafl_widget = function(wafl, widget_element) {
    this.insert_widget(wafl, widget_element);
}

proto.make_wiki_link = function(page_name, link_text) {
    this.make_link(link_text, page_name, false);
}

proto.make_web_link = function(url, link_text) {
    this.make_link(link_text, false, url);
}


proto.make_link = function(label, page_name, url) {

    var text = label || page_name || url;
    var href = url || encodeURIComponent(page_name);
    var attr = "";
    if (page_name) {
        attr = " wiki_page=\"" + html_escape(page_name).replace(/"/g, "&quot;") + "\"";
    }
    var html = "<a href=\"" + href + "\"" + attr + ">" + html_escape( text.replace(/"/g, '\uFF02').replace(/"/g, "&quot;") );


    html += "</a>";

    this.set_focus(); // Need this before .insert_html
    this.insert_html(html);
}

proto.insert_table_html = function(rows, columns, options) {
    var self = this;
    var innards = '';
    var cell = '<td><span style="padding:.5em">&nbsp;</span></td>';
    for (var i = 0; i < rows; i++) {
        var row = '';
        for (var j = 0; j < columns; j++)
            row += cell;
        innards += '<tr>' + row + '</tr>';
    }

    var id = 'table-' + (new Date).getTime();
    var $table = jQuery('<table></table>')
        .attr('id', id)
        .addClass("formatter_table")
        .html(innards);
    var $div = jQuery('<div />').append($table);
    this.insert_html($div.html());

    jQuery.poll(
        function() {
            return jQuery('#'+id, self.get_edit_document()).size() > 0
        },
        function() {
            var $table = jQuery('#'+id, self.get_edit_document());
            $table.removeAttr('id');
            self.applyTableOptions($table, options);

            // Skip the <br/> padding around tables for Selenium so we can test with the cursor in tables.
            if (Wikiwyg.is_selenium) { return; } 

            if ($table.prev().length == 0) {
                // Table is the first element in document - add a <br/> so
                // navigation is possible beyond the table.
                $table.before('<br />');
            }
            if ($table.next().length == 0) {
                // Table is the last element in document - add a <br/> so
                // navigation is possible beyond the table.
                $table.after('<br />');
            }
        },
        500, 10000
    );
}

proto.closeTableDialog = function() {
    var doc = this.get_edit_document();
    jQuery(doc).unbind("keypress");
    jQuery.hideLightbox();
    this.rebindHandlers();
}

proto.do_new_table = function() {
    var self = this;
    var do_table = function() {
        var $error = jQuery('.table-create .error');

        var rows = jQuery('.table-create input[name=rows]').val();
        var cols = jQuery('.table-create input[name=columns]').val();
        if (! rows.match(/^\d+$/))
            return $error.text(loc('error.invalid-rows'));
        if (! cols.match(/^\d+$/))
            return $error.text(loc('error.invalid-columns'));
        rows = Number(rows);
        cols = Number(cols);
        if (! (rows && cols))
            return $error.text(loc('error.rows-and-columns-required'));
        if (rows > 100)
            return $error.text(loc('error.rows-too-big'));
        if (cols > 35)
            return $error.text(loc('error.columns-too-big'));
        self.set_focus(); // Need this before .insert_html
        var options = self.tableOptionsFromNode(jQuery('.table-create'));
        self.insert_table_html(rows, cols, options);
        self.closeTableDialog();
    }
    var setup = function() {
        jQuery('.table-create input[name=rows]').focus();
        jQuery('.table-create input[name=rows]').select();
        jQuery('.table-create .save')
            .unbind("click")
            .bind("click", function() {
                do_table();
                return false;
            });
        jQuery('.table-create .close')
            .unbind("click")
            .bind("click", function() {
                self.closeTableDialog();
                return false;
            });
        jQuery("#lightbox").one("lightbox-unload", function() {
            self.set_focus();
        });
    }
    jQuery.showLightbox({
        html: Jemplate.process("table-create.html", {"loc": loc}),
        width: 300,
        callback: setup
    });
    return false;
}

proto.deselect = function() {
    if (Wikiwyg.is_ie) {
        var r = this.get_edit_document().selection.createRange();
        r.collapse(true);
        r.select();

        this.__range = undefined;
    }
    else {
        this.get_edit_window().getSelection().collapseToStart();
    }
}

proto.find_table_cell_with_cursor = function() {
    var doc = this.get_edit_document();

    try {
        var container = this.get_edit_window().getSelection()
            .getRangeAt(0).startContainer;
    }
    catch (e) {};

    if (container) {
        this.deselect();

        var $container = $(container);
        if ($container.get(0).tagName && $container.get(0).tagName.toLowerCase() == 'td') {
            return $container;
        }

        var $td = $container.parents('td:first');
        if (! $td.length) { return; }
        return $td;
    }

    jQuery("span.find-cursor", doc).removeClass('find-cursor');

    // Note that we explicitly don't call set_focus() here, otherwise
    // IE will move the cursor to the next cell -- See {bz: 1692}.
    this.deselect();
    this.insert_html("<span class=\"find-cursor\"></span>");

    var cursor = jQuery("span.find-cursor", doc);
    if (! cursor.parents('td').length) { return; }
    var $cell = cursor.parents("td");

    cursor.remove();
    $cell.html($cell.html()
        .replace(/<span style="padding: [^;]*;">(.*?)<\/span>/g, '$1')
    );

    return $cell;
}

proto.set_focus_on_cell = function($new_cell) {
    var self = this;
    self.set_focus();

    if (Wikiwyg.is_gecko) {
        var $span = $new_cell.find("span");
        if ($span.length > 0) {
            if ($span.html() == '') {
                $span.html('&nbsp;');
            }
        }
        else {
            $span = $new_cell;
        }

        var r = self.get_edit_document().createRange();
        r.setStart( $span.get(0), 0 );
        r.setEnd( $span.get(0), 0 );

        var s = self.get_edit_window().getSelection();
        s.removeAllRanges();
        s.addRange(r);
    }
    else if (jQuery.browser.msie) {
        var r = self.get_edit_document().selection.createRange();
        r.moveToElementText( $new_cell.get(0) );
        r.collapse(true);
        r.select();
    }
}

proto._do_table_manip = function(callback) {
    var self = this;
    setTimeout(function() {
        var $cell = self.find_table_cell_with_cursor();
        if (! $cell) return;

        var $new_cell = callback.call(self, $cell);

        if ($new_cell) {
            $cell = $new_cell;
            self.set_focus_on_cell($new_cell);
        }

        setTimeout(function() {
            var $table = $cell.parents("table.sort:eq(0)");
            try {
                $table.trigger("update");
            } catch(e) { }
        }, 50);

    }, 100);
}

// This is the same as in Socialtext::Formatter::Unit
proto.parseTableOptions = function (opt_string) {
    if (!opt_string) opt_string = '';
    var options = { border: true };
    jQuery.each(opt_string.split(' '), function (i,key){
        if (!key.length) return;
        if (String(key).match(/^([^:=]+)[:=](.*)$/)) {
            key = RegExp.$1;
            var val = RegExp.$2;
            options[key] = (val == 'off' || val == 'false') ? false : true;
        }
        else {
            options[key] = true;
        }
    });
    return options;
}

proto.applyTableOptions = function($table, opt_string) {
    if (!opt_string) return;
    $table.attr('options', opt_string);
    var options = this.parseTableOptions(opt_string);

    if (options.border) {
        $table.removeClass('borderless');
    }
    else {
        $table.addClass('borderless');
    }

    if (options.sort) {
        setTimeout(function() {
            Socialtext.make_table_sortable($table.get(0));
        }, 100);
    }
    else {
        Socialtext.make_table_unsortable( $table.get(0) );
    }
}

proto.tableOptionsFromNode = function ($node) {
    var opt_array = [];
    jQuery('input[type=checkbox]', $node).each(function(i, el) {
        var key = $(el).attr('name');
        opt_array.push(key + ($(el).is(':checked') ? ':on' : ':off'));
    });
    return opt_array.join(' ');
}

proto.do_table_settings = function() {
    var self = this;

    this._do_table_manip(function($cell) {
        var $table = $cell.parents("table:eq(0)");
        var $lb = $('#st-table-settings');

        jQuery("#st-table-settings .submit").one("click", function() {
            var opt_string = self.tableOptionsFromNode($lb);
            self.applyTableOptions($table, opt_string);

            jQuery.hideLightbox();
            return false;
        });

        jQuery.showLightbox({
            content: '#st-table-settings',
            close: '#st-table-settings .close',
            width: 300,
            callback: function() {
                var options = self.parseTableOptions($table.attr('options'));
                jQuery.each(options, function(key,val) {
                    var $el = $lb.find("input[name="+key+"]")
                    if (val) {
                        $el.attr("checked", "checked");
                    }
                    else {
                        $el.removeAttr("checked");
                    }
                });

                /* Don't allow sorting a single row table, or a new table */
                if ($table.find('tr').size() < 2) {
                    $lb.find("input[name=sort]").attr('disabled', true);
                }
            }
        });
    });
}

proto.do_add_row_below = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        var doc = this.get_edit_document();
        var $tr = jQuery(doc.createElement('tr'));
        $cell.parents("tr:first").find("td").each(function() {
            $tr.append('<td style="border: 1px solid black; padding: 0.2em;">&nbsp;</td>');
        });
        $tr.insertAfter( $cell.parents("tr:first") );
    });
}

proto.do_add_row_above = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        var doc = this.get_edit_document();
        var $tr = jQuery(doc.createElement('tr'));

        $cell.parents("tr:first").find("td").each(function() {
            $tr.append('<td style="border: 1px solid black; padding: 0.2em;">&nbsp;</td>');
        });
        $tr.insertBefore( $cell.parents("tr:first") );
    });
}

proto._rebuild_sortable = function(table) {
    Socialtext.make_table_unsortable( table );
    setTimeout(function() {
        Socialtext.make_table_sortable( table );
    }, 100);
}

proto.do_add_col_left = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        var doc = this.get_edit_document();
        self._traverse_column($cell, function($td) {
            $td.before(
                $(doc.createElement( $td.get(0).tagName ))
                    .attr({style: 'border: 1px solid black;', padding: '0.2em'})
                    .html("<span>&nbsp;</span>")
            );
        });

        var table = $cell.parents("table:eq(0)").get(0);
        if ($(table).hasClass('sort')) {
            this._rebuild_sortable( table );
        }
    });
}

proto.do_add_col_right = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        var doc = this.get_edit_document();
        self._traverse_column($cell, function($td) {
            $td.after(
                $(doc.createElement( $td.get(0).tagName ))
                    .attr({style: 'border: 1px solid black;', padding: '0.2em'})
                    .html("<span>&nbsp;</span>")
            );
        });

        var table = $cell.parents("table:eq(0)").get(0);
        if ($(table).hasClass('sort')) {
            this._rebuild_sortable( table );
        }
    });
}

proto.do_del_row = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        var col = self._find_column_index($cell);
        var $new_cell = $cell.parents('tr')
            .next().find("td:nth-child(" + col + ")");
        if (!$new_cell.length) {
            $new_cell = $cell.parents('tr')
                .prev().find("td:nth-child(" + col + ")");
        }
        if ($new_cell.length) {
            $cell.parents('tr').remove();
            return $new_cell;
        }
        else {
            $cell.parents("table").remove();
            return;
        }
    });
}

proto._traverse_column_with_prev = function($cell, callback) {
    this._traverse_column($cell, callback, -1);
}

proto._traverse_column_with_next = function($cell, callback) {
    this._traverse_column($cell, callback, +1);
}

proto._traverse_column = function($cell, callback, offset) {
    var $table = $cell.parents("table");
    var col = this._find_column_index($cell);
    var $trs = $table.find('tr');
    for (var i = 0; i < $trs.length; i++) {
        var $tds = $($trs[i]).find('td,th');
        if ($tds.length >= col) {
            var $td = $($tds.get(col-1));
            if (offset) {
                if ($tds.length >= col+offset && col+offset >= 1) {
                    var $td2 = $($tds.get(col+offset-1));
                    callback($td, $td2);
                }
            }
            else {
                callback($td);
            }
        }
    }
}

proto.do_del_col = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        if ($cell.parents('tr:first').find('td').length <= 1) {
            $cell.parents("table").remove();
            return;
        }

        var $tr = $cell.parents('tr:first');
        var col = self._find_column_index($cell);
        self._traverse_column($cell, function($td) {
            $td.remove();
        });

        var table = $cell.parents("table:eq(0)").get(0);
        this._rebuild_sortable( table );

        var tds = $tr.find('td');
        if (tds.length >= col) {
            return $(tds[col-1]);
        }
        else {
            return $(tds[col-2]);
        }
    });
}

proto.do_move_row_up = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        var $r = $cell.parents("tr");
        $r.prev().insertAfter( $r );
    });
}

proto.do_move_row_down = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        var $r = $cell.parents("tr");
        $r.next().insertBefore( $r );
    });
}

proto.do_move_col_left = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        self._traverse_column_with_prev($cell, function($td, $prev) {
            $prev.insertAfter($td);
        });
    });
}

proto.do_move_col_right = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        self._traverse_column_with_next($cell, function($td, $next) {
            $next.insertBefore($td);
        });
    });
}

proto.do_table = function() {
    var doc = this.get_edit_document();
    jQuery("span.find-cursor", doc).removeClass('find-cursor');
    this.set_focus(); // Need this before .insert_html
    this.insert_html( "<span class=\"find-cursor\"></span>" );

    var self = this;
    setTimeout(function() {
        var $cell = self.find_table_cell_with_cursor();
        if (! $cell)
            return self.do_new_table();
        return;
    }, 100);
}

proto._scroll_to_center = function($cell) {
    var $editor;
    var eHeight, eWidth;

    if (Wikiwyg.is_ie) {
        $editor = jQuery( this.get_editable_div() );
        if (jQuery.browser.version <= 6) {
            if ($editor.css('overflow') != 'auto') {
                $editor.css('overflow', 'auto');
            }
        }

        eHeight = $editor.height();
        eWidth = $editor.width();
    }
    else {
        var doc = this.get_edit_document();
        eHeight = doc.body.clientHeight;
        eWidth = doc.body.clientWidth;
    }

    var cHeight = $cell.height();
    var cWidth = $cell.width();

    var cTop, cLeft;
    if (Wikiwyg.is_ie) {
        cTop = $cell.offset().top + $editor.scrollTop();
        cLeft = $cell.offset().left + $editor.scrollLeft();
    }
    else {
        cTop = $cell.position().top;
        cLeft = $cell.position().left;
    }

    var sLeft = cLeft + (cWidth - eWidth) / 2;
    var sTop = cTop + (cHeight - eHeight) / 2;

    if (sLeft < 0) sLeft = 0;
    if (sTop < 0) sTop = 0;

    if (Wikiwyg.is_ie) {
        $editor.scrollLeft(sLeft).scrollTop(sTop);
    }
    else {
        var win = this.get_edit_window();
        win.scrollTo(sLeft, sTop);
    }
}

proto._find_column_index = function($cell) {
    $cell.addClass('find-cell');
    var tds = $cell.parents('tr:first').find('td');
    for (var i = 0; i < tds.length; i++) {
        if ($(tds[i]).hasClass('find-cell')) {
            $cell.removeClass('find-cell');
            return i+1;
        }
    }
    $cell.removeClass('find-cell');
    return 0;
}

proto.setHeightOf = function (iframe) {
    iframe.style.height = this.get_edit_height() + 'px';
};

proto.socialtext_wikiwyg_image = function(image_name) {
    return this.wikiwyg.config.toolbar.imagesLocation + image_name;
}


proto.get_link_selection_text = function() {
    var selection = this.get_selection_text();
    if (! selection) {
        alert(loc("error.link-selection-required"));
        return;
    }
    return selection;
}

/* This function is the same as the baseclass one, except it doesn't use
 * Function.prototype.bind(), and hence is free of the dependency on
 * Prototype.js, as required by S3.
 */
proto.get_editable_div = function () {
    if (!this._editable_div) {
        var doc = this.get_edit_document();
        this._editable_div = doc.createElement('div');
        this._editable_div.contentEditable = true;
        this._editable_div.style.overflow = 'auto';
        this._editable_div.style.border = 'none'
        this._editable_div.style.width = '100%';
        this._editable_div.style.height = '100%';
        this._editable_div.id = 'wysiwyg-editable-div';
        this._editable_div.className = 'wiki';

        var self = this;
        this._editable_div.onbeforedeactivate = function () {
            self.__range = doc.selection.createRange();
        };
        this._editable_div.onactivate = function () {
            /* We don't undefine self.__range here as exec_command()
             * will make use of the previous range after onactivate.
             */
            return;
        };

        if ( jQuery.browser.msie ) {
            var win = self.get_edit_window();
            self._ieSelectionBookmark = null;
            self._hasFocus = false;

            doc.attachEvent("onbeforedeactivate", function() {
                self._ieSelectionBookmark = null;
                try {
                    var range = doc.selection.createRange();
                    self._ieSelectionBookmark = range.getBookmark();
                } catch (e) {};
            });

            self.get_edit_window().attachEvent("onfocus", function() {
                self._hasFocus = true;
            });

            self.get_edit_window().attachEvent("onblur", function() {
                self._hasFocus = false;
            });

            doc.attachEvent("onactivate", function() {
                 if (! self._ieSelectionBookmark) {
                     return;
                 }

                 if (self._isActivating) return;
                 self._isActivating = true;

                 try {
                     var range = doc.body.createTextRange();
                     range.moveToBookmark(self._ieSelectionBookmark);
                     range.collapse();
                     range.select();
                 } catch (e) {};

                 self._isActivating = false;
            });
        } 

        var tryFocusDiv = function(tries) {
            setTimeout(function() {
                try {
                    self._editable_div.focus();
                } catch(e) {
                    /* If we get here, the doc is partially initializing so we
                     * may get a "Permission denied" error, so try again.
                     */
                    if (tries > 0) {
                        tryFocusDiv(tries - 1);
                    }
                }
            }, 500);
        };

        var tryAppendDiv = function(tries) {
            setTimeout(function() {
                try {
                    if (doc.body) {
                        jQuery("iframe#st-page-editing-wysiwyg").width( jQuery('#st-edit-mode-view').width() - 48 );
                        doc.body.appendChild(self._editable_div);
                        tryFocusDiv(100);
                    }
                    else if (tries > 0) {
                        tryAppendDiv(tries - 1);
                    }
                } catch(e) {
                    /* If we get here, the doc is partially initializing so we
                     * may get a "Permission denied" error, so try again.
                     */
                    if (tries > 0) {
                        tryAppendDiv(tries - 1);
                    }
                }
            }, 500);
        };

        // Retry for up to 100 times = 50 seconds
        tryAppendDiv(100);
    }
    return this._editable_div;
}

/*==============================================================================
Socialtext Debugging code
 =============================================================================*/
{ var klass = Wikiwyg;

klass.run_formatting_tests = function(link) {
    var all = document.getDivsByClassName('wikiwyg_formatting_test');
    foreach(all, function (each) {
        klass.run_formatting_test(each);
    })
}

klass.run_formatting_test = function(div) {
    var pre_elements = div.getElementsByTagName('pre');
    var html_text = pre_elements[0].innerHTML;
    var wiki_text = pre_elements[1].innerHTML;
    html_text = Wikiwyg.htmlUnescape(html_text);
    var wikitext = new Wikiwyg.Wikitext();
    var result = wikitext.convert_html_to_wikitext(html_text);
    result = klass.ensure_newline_at_end_of_string(result);
    wiki_text = klass.ensure_newline_at_end_of_string(wiki_text);
    if (! div.wikiwyg_formatting_test_results_shown)
        div.wikiwyg_formatting_test_results_shown = 0;
    if (result == wiki_text) {
        div.style.backgroundColor = '#0f0';
    }
    else if (! div.wikiwyg_formatting_test_results_shown++) {
        div.style.backgroundColor = '#f00';
        div.innerHTML = div.innerHTML + '<br/>Bad: <pre>\n' +
            result + '</pre>';
        jQuery('#wikiwyg_test_results').append('<a href="#'+div.id+'">Failed '+div.id+'</a>; ');
    }
}

klass.ensure_newline_at_end_of_string = function(str) {
    return str + ('\n' == str.charAt(str.length-1) ? '' : '\n');
}

wikiwyg_run_all_formatting_tests = function() {
    var divs = document.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i++) {
        var div = divs[i];
        if (div.className != 'wikiwyg_formatting_test') continue;
        klass.formatting_test(div);
    }
}

klass.run_all_formatting_tests = wikiwyg_run_all_formatting_tests;

}

/* The code below were originally in Wikiwyg.Widgets. */
var widgets_list = Wikiwyg.Widgets.widgets;
var widget_data = Wikiwyg.Widgets.widget;

proto.fromHtml = function(html) {
    if (typeof html != 'string') html = '';

    html = html.replace(
        new RegExp(
            '(<!--[\\d\\D]*?-->)|(<(span|div)\\sclass="nlw_phrase">)[\\d\\D]*?(<!--\\swiki:\\s[\\d\\D]*?\\s--><\/\\3>)',
            'g'
        ), function(_, _1, _2, _3, _4) {
            return(_1 ? _1 : _2 + '&nbsp;' + _4);
        }
    );

    if (Wikiwyg.is_ie) {
        html = html.replace(/<DIV class=wiki>([\s\S]*)<\/DIV>/gi, "$1");

        var br_at_the_end = new RegExp("(\n?<br ?/>)+$", "i");
        if(html.match(br_at_the_end)) {
            html = html.replace(br_at_the_end, "")
            html += "<p> </p>"
        }
        html = this.assert_padding_around_block_elements(html);
        html = this.assert_padding_between_block_elements(html);
    }
    else {
        html = this.replace_p_with_br(html);
    }

    var dom = document.createElement('div');
    dom.innerHTML = html;
    this.sanitize_dom(dom);
    this.set_inner_html(dom.innerHTML);
    this.setWidgetHandlers();

    return dom.innerHTML;
}

proto.assert_padding_between_block_elements = function(html) {
    var doc = document.createElement("div");
    doc.innerHTML = html;
    if (doc.childNodes.length == 1) {
        var h = doc.childNodes[0].innerHTML;
        if (h) doc.innerHTML = h;
    }

    var node_is_a_block = function(node) {
        if (node.nodeType == 1) {
            var tag = node.tagName.toLowerCase();
            if (tag.match(/^(ul|ol|table|blockquote|p)$/)) return true;
            if (tag == 'span' && node.className == 'nlw_phrase') {
                if (!(node.lastChild.nodeValue||"").match("include:")) {
                    return true;
                }
            }
        }
        return false;
    };

    for(var i = 1; i < doc.childNodes.length; i++) {
        if ( node_is_a_block(doc.childNodes[i]) ) {
            if ( node_is_a_block(doc.childNodes[i-1]) ) {
                var padding = document.createElement("p");
                padding.setAttribute("class", "padding");
                padding.innerHTML='&nbsp;';
                doc.insertBefore(padding, doc.childNodes[i]);
                i++;
            }
        }
    }

    return doc.innerHTML;
}

proto.assert_padding_around_block_elements = function(html) {
    var tmpElement = document.createElement('div');
    var separator = '<<<'+Math.random()+'>>>';
    var chunks = html.replace(/<!--[\d\D]*?-->/g, separator + '$&' + separator).split(separator);
    var escapedHtml = '';
    for(var i=0;i<chunks.length;i++) {
        var chunk = chunks[i];
        if (/^<!--/.test(chunk) && /-->$/.test(chunk)) {
            /* {bz: 4285}: Do not escape <div>s in <!-- wiki: ... --> sections */
            escapedHtml += chunk;
        }
        else {
            escapedHtml += chunk
                .replace(/<div\b/g, '<span tmp="div"')
                .replace(/<\/div>/g, '</span>')
        }
    }
    tmpElement.innerHTML = escapedHtml;
    var doc = $(tmpElement);

    var el;
    while (el = doc.find('span[tmp=div]:first')[0]) {
        var span = jQuery(el);
        var divElement = document.createElement("div");
        divElement.appendChild( (span.clone().removeAttr('tmp'))[0] );

        var div = divElement.innerHTML
            .replace(/^<span/, '<div')
            .replace(/<\/span>$/, '</div>');

        var parent_el = span.parent('p').get(0);
        if (!parent_el) {
            span.replaceWith(div);
            continue;
        }

        var p = jQuery(parent_el);
        var p_html = p.html();
        var p_before = p_html.replace(
            /[ \t]*<span[^>]*tmp="div"[\s\S]*/i, ''
        );

        span.remove();

        p.html(
            p.html().substr(p_before.length)
                    .replace(/^[ \t]*/, '')
        );
        p.before(jQuery('<p />').html(p_before));
        p.before(div);
    }

    return doc.html();
}

proto.replace_p_with_br = function(html) {
    var br = "<br class=\"p\"/>";
    var doc = document.createElement("div");
    doc.innerHTML = this.assert_padding_around_block_elements(html);
    var p_tags = jQuery(doc).find("p").get();
    for(var i=0;i<p_tags.length;i++) {
        var html = p_tags[i].innerHTML;
        var parent_tag = null;
        var parent = p_tags[i].parentNode;
        if (parent && parent.tagName) {
            parent_tag = parent.tagName.toLowerCase();
        }
        var prev = p_tags[i].previousSibling;
        var prev_tag = null;
        if (prev && prev.tagName) {
            prev_tag = prev.tagName.toLowerCase();
        }

        html = html.replace(/(<br\b[^>]*>)?\s*$/, br + br);

        if (prev && prev_tag && (prev_tag == 'div' || (prev_tag == 'span' && prev.firstChild && prev.firstChild.tagName && prev.firstChild.tagName.toLowerCase() == 'div'))) {
            html = html.replace(/^\n?[ \t]*/,br + br)
        }
        else if (prev && prev_tag && prev_tag != 'br' && prev_tag != 'p') {
            html = html.replace(/^\n?/,br)
        }
        else if (prev && prev_tag && prev_tag == 'br') {
            html = html.replace(/^\n?/,'')

            var remove_br = function() {
                var ps = prev.previousSibling;
                while (ps && ps.nodeType == 3) {
                    ps = ps.previousSibling;
                }
                if (ps && ps.tagName &&
                    ps.tagName.toLowerCase() == 'blockquote') {
                    return true;
                }
                return false;
            }();

            if (remove_br) {
                jQuery(prev).remove();
            }
        }
        else {
            html = html.replace(/^\n?/,'')
        }

        if (prev && prev.nodeType == 3) {
            prev.nodeValue = prev.nodeValue.replace(/\n*$/,'')
        }

        jQuery(p_tags[i]).replaceWith(html);
    }
    return doc.innerHTML;
}

proto.toHtml = function(func) {
    if (Wikiwyg.is_ie) {
        var self = this;
        this.get_inner_html_async(function(html){
            var br = "<br class=\"p\"/>";

            html = self.remove_padding_material(html);

            /* {bz: 4812}: Don't replace <p> and <br> tags inside WAFL alt text */
            var separator = '<<<'+Math.random()+'>>>';
            var chunks = html.replace(/\balt="st-widget-[^"]*"/ig, separator + '$&' + separator).split(separator);
            var escapedHtml = '';
            for(var i=0;i<chunks.length;i++) {
                var chunk = chunks[i];
                if (/^alt="st-widget-/.test(chunk) && /"$/.test(chunk)) {
                    escapedHtml += chunk;
                }
                else {
                    escapedHtml += chunk
                        .replace(/\n*<p>\n?/ig, "")
                        .replace(/<\/p>(?:<br class=padding>)?/ig, br)
                }
            }

            func(escapedHtml);
        });
    }
    else {
        func(this.get_inner_html());
    }

    clearInterval( this._fixer_interval_id );
    delete this._fixer_interval_id;

    /*
    if (Wikiwyg.is_ie7) {
        clearInterval( this._white_page_fixer_interval_id );
        delete this._white_page_fixer_interval_id;
    }
    */
}

proto.getNextSerialForOpenSocialWidget = function(src) {
    var max = 0;
    var imgs = this.get_edit_document().getElementsByTagName('img');
    for (var ii = 0; ii < imgs.length; ii++) {
        var match = (imgs[ii].getAttribute('alt') || '').match(
            /^st-widget-\{widget:\s*([^\s#]+)(?:\s*#(\d+))?((?:\s+[^\s=]+=\S*)*)\s*\}$/
        );
        if (match && match[1].replace(/^local:widgets:/, '') == src.replace(/^local:widgets:/, '')) {
            max = Math.max( max, (match[2] || 1) );
        }
    }
    return max+1;
}

proto.setWidgetHandlers = function() {
    var self = this;
    if (this.wikiwyg.config.noWidgetHandlers) return;
    var win = this.get_edit_window();
    var doc = this.get_edit_document();

    // XXX: this setTimeout make several wikiwyg js-test meaningless.. :(
    if (Wikiwyg.is_ie) {
        if (! (doc && doc.body && doc.body.innerHTML) ){
            setTimeout(function() { self.setWidgetHandlers() }, 500);
            return;
        }
    }
    var imgs = this.get_edit_document().getElementsByTagName('img');
    for (var ii = 0; ii < imgs.length; ii++) {
        this.setWidgetHandler(imgs[ii]);
    }

    if (jQuery.browser.msie && !this.wikiwyg.config.noRevertWidgetImages)
        this.revert_widget_images();

    if (jQuery(doc, win).data("mouseup_handler_set")) return;

    jQuery(doc, win).mouseup(function(e) {
        if (e.target && e.target.tagName && e.target.tagName.toLowerCase() == 'img' && /^st-widget-/.test(e.target.getAttribute('alt'))) {
            self.currentWidget = self.parseWidgetElement(e.target);
            var id = self.currentWidget.id;  
            if (widget_data[id] && widget_data[id].uneditable) {
                alert(loc("info.wafl-uneditable"))  
            }
            else {
                self.getWidgetInput(e.target, false, false);
            }
        }
    }).data("mouseup_handler_set", true);
}

proto.setWidgetHandler = function(img) {
    var widget = img.getAttribute('alt');
    if (! /^st-widget-/.test(widget)) return;
    this.currentWidget = this.parseWidgetElement(img);
    this.currentWidget = this.setTitleAndId(this.currentWidget);
    this.attachTooltip(img);
}

proto.revert_widget_images = function() {
    if ( this._fixer_interval_id ) {
        return;
    }
    var self = this;
    var fixing = false;

    var fixer = function() {
        if (fixing) return;
        fixing = true;

        var imgs = self.get_edit_document().getElementsByTagName('img');
        for (var i=0, l = imgs.length; i < l; i++) {
            var img = imgs[i];

            if (! /^st-widget-/.test(img.getAttribute('alt'))) { continue; }

            img.removeAttribute("style");
            img.removeAttribute("width");
            img.removeAttribute("height");
        }
        self.reclaim_element_registry_space();

        fixing = false;
    };
    this._fixer_interval_id = setInterval(fixer, 500);
}

proto.sanitize_dom = function(dom) {
    Wikiwyg.Mode.prototype.sanitize_dom.call(this, dom);
    this.widget_walk(dom);

    // Skip the <br/> padding around tables for Selenium so we can test with the cursor in tables.
    if (Wikiwyg.is_selenium) { return; } 

    // Table is the first element in document - prepend a <br/> so
    // navigation is possible beyond the table.
    var $firstTable = $('table:first', dom);
    if ($firstTable.length && ($firstTable.prev().length == 0)) {
        $firstTable.before('<br />');
    }
    // Table is the last element in document - append a <br/> so
    // navigation is possible beyond the table.
    var $lastTable = $('table:last', dom);
    if ($lastTable.length && ($lastTable.next().length == 0)) {
        $firstTable.after('<br />');
    }
}

proto.attachTooltip = function(elem) {
    if (elem.getAttribute("title"))
        return;

    var title = (typeof widget_data[this.currentWidget.id].title == "object")
      ? this.currentWidget.full
        ? widget_data[this.currentWidget.id].title.full
        : widget_data[this.currentWidget.id].title['default']
      : widget_data[this.currentWidget.id].title;

    var params = title.match(/\$(\w+)/g);
    var newtitle = title; 
    var newtitle_args = "";
    if ( params != null ){
        for ( i = 0; i < params.length; i++) {
            params[i] = params[i].replace(/^\$/, "");
            var text = this.currentWidget[params[i]];
            if (typeof(text) != 'undefined') {
                if (text == '') {
                    if (params[i] == 'page_title')
                        text = Page.page_title;
                    else if (params[i] == 'workspace_id')
                        text = Page.wiki_title;
                }
                else {
                    newtitle = newtitle.replace("$" + params[i], "[_" + ( i + 1 ) + "]");
                    newtitle_args += ", \"" + text.replace(/"/g, '\\"') + "\"";
                }
            }
            else {
                newtitle_args += ", \"\"";
            }
            newtitle = newtitle.replace("$" + params[i], "");
        }
    }
    if (newtitle_args != "") {
        newtitle = eval("loc(\"" + newtitle + "\"" + newtitle_args + ")");
        if ( newtitle == 'undefined' ){
            newtitle = title;
        }
    }else{
        newtitle = eval("loc(\"" + newtitle + "\")");
        if ( newtitle == 'undefined' ){
            newtitle = title;
        }
    }
    elem.setAttribute("title", newtitle);
}

var wikiwyg_widgets_element_registry = new Array();
proto.reclaim_element_registry_space = function() {
    var imgs = this.get_edit_document().getElementsByTagName('img');
    for(var i = 0; i < wikiwyg_widgets_element_registry.length; i++ ) {
        var found = false;
        for (var j = 0; j < imgs.length; j++) {
            var img = imgs[j];
            if (! /^st-widget-/.test(img.getAttribute('alt'))) { continue; }
            if (wikiwyg_widgets_element_registry[i] == img) {
                found = true;
                break;
            }
        }
        if ( !found ) {
            delete wikiwyg_widgets_element_registry[i]
        }
    }
    wikiwyg_widgets_element_registry = 
        jQuery.grep(wikiwyg_widgets_element_registry, function (i) {
            return i != undefined ? true : false
        });
}

proto.element_registry_push = function(elem) {
    var flag = 0;
    jQuery.each(wikiwyg_widgets_element_registry, function() {
        if (this == elem) {
            flag++;
        }
    });
    if ( flag > 0 ) { return false; }
    wikiwyg_widgets_element_registry.push(elem)
    return true;
}

var wikiwyg_widgets_title_lookup = {
};

proto.lookupTitle = function(field, id) {
    var title = this.titleInLookup(field, id);
    if (!title) {
        title = this.pullTitleFromServer(field, id);
    }
    return title;
}

proto.titleInLookup = function (field, id) {
    if (field in wikiwyg_widgets_title_lookup)
        if (id in wikiwyg_widgets_title_lookup[field])
            return wikiwyg_widgets_title_lookup[field][id];
    return '';
}

proto.pullTitleFromServer = function (field, id, data) {
    var uri = Wikiwyg.Widgets.api_for_title[field];
    uri = uri.replace(new RegExp(":" + field), id);

    var details;
    jQuery.ajax({
        url: uri,
        async: false,
        dataType: 'json',
        success: function (data) {
            details = data;
        }
    });
    if (!(field in wikiwyg_widgets_title_lookup))
        wikiwyg_widgets_title_lookup[field] = {};

    if (details) {
        wikiwyg_widgets_title_lookup[field][id] = details.title;
        return details.title;
    }
    else {
        return null;
    }
}

proto.setTitleAndId = function (widget) {
    var widgetDefinition = widget_data[widget.id];
    var fields = widgetDefinition.fields || [widgetDefinition.field];

    for (var i=0; i < fields.length; i++) {
        var field = fields[i];
        if (Wikiwyg.Widgets.api_for_title[field]) {
            if (!widget.title_and_id) {
                widget.title_and_id = {};
            }
            if (!widget.title_and_id[field]) {
                widget.title_and_id[field] = {id: '', title: ''};
            }
            if (widget[field]) {
                var title = this.lookupTitle(field, widget[field]) || widget[field];
                widget.title_and_id[field].id = widget[field];
                widget.title_and_id[field].title = title;
            }
        }
    }

    return widget;
}

proto.parseWidgetElement = function(element) {
    var widget = element.getAttribute('alt').replace(/^st-widget-/, '');
    if (Wikiwyg.is_ie) widget = Wikiwyg.htmlUnescape( widget );
    if ($.browser.webkit) widget = widget.replace(
        /&#x([a-fA-F\d]{2,5});/g, 
        function($_, $1) { 
            return String.fromCharCode(parseInt($1, 16));
        }
    );
    return this.parseWidget(widget);
}

proto.parseWidget = function(widget) {
    var matches;

    widget = widget.replace(/-=/g, '-').replace(/==/g, '=');

    if ((matches = widget.match(/^(aim|yahoo|ymsgr|skype|callme|callto|http|irc|file|ftp|https):([\s\S]*?)\s*$/)) ||
        (matches = widget.match(/^\{(\{([\s\S]+)\})\}$/)) || // AS-IS
        (matches = widget.match(/^"(.+?)"<(.+?)>$/)) || // Named Links
        (matches = widget.match(/^(?:"(.*)")?\{([-\w]+):?\s*([\s\S]*?)\s*\}$/)) ||
        (matches = widget.match(/^\.([-\w]+)\s*?\n([\s\S]*?)\1\s*?$/))
    ) {
        var widget_id = matches[1];
        var full = false;
        var args = matches[2];

        var widget_label;
        if ( matches.length == 4 ) {
            widget_label = matches[1];
            widget_id = matches[2];
            args = matches[3];
        }

        if ( widget_id.match(/^\{/) ) {
            widget_id = "asis";
        }

        widget_id = Wikiwyg.Widgets.resolve_synonyms(widget_id);

        if (widget_id.match(/^(.*)_full$/)) {
            var widget_id = RegExp.$1;
            var full = true;
        }

        // Since multiple versions of the same widget have the same wafl
        // structure we can use the parser for any version. Might as well be the first.
        var isAMultipleWidget = Wikiwyg.Widgets.isMultiple(widget_id);
        if (isAMultipleWidget) {
            widget_id = Wikiwyg.Widgets.getFirstMultiple(widget_id);
        }

        var widget_parse;
        if (this['parse_widget_' + widget_id]) {
            widget_parse = this['parse_widget_' + widget_id](args);
            widget_parse.id = widget_id;
        }
        else if (widget_data[widget_id]) {
            widget_parse = {};
            widget_parse.id = widget_id;
        }
        else {
            widget_parse = {};
            widget_parse.id = 'unknown';
            widget_parse.unknown_id = widget_id;
        }

        widget_parse.full = full;
        widget_parse.widget = widget;
        if (widget_label)
            widget_parse.label = widget_label;

        if (isAMultipleWidget) {
            var previousId = widget_parse.id;
            widget_parse.id = Wikiwyg.Widgets.mapMultipleSameWidgets(widget_parse);
            if (widget_parse.id != previousId && this['parse_widget_' + widget_parse.widget_id]) {
                widget_parse = this['parse_widget_' + widget_parse.id](args);
                widget_parse.id = widget_id;
            }
        }

        return widget_parse;
    }
    else
        throw(loc('error.unexpected-parse=widget', widget));
}

for (var i = 0; i < widgets_list.length; i++) {
    var gen_widget_parser = function(data) {
        return function(widget_args) {
            var widget_parse = {};
            if (data.fields) {
                for (var i = 0; i < data.fields.length; i++) {
                    widget_parse[ data.fields[i] ] = '';
                }
            }
            else if (data.field) {
                widget_parse[ data.field ] = '';
            }
            if (! widget_args.match(/\S/)) {
                return widget_parse;
            }

            // Grab extra args (things like size=medium) from the end
            var all_args = widget_args.match(/(.*?)\s+((?:\S+=+\S+,?)+)$/);
            if (all_args) {
                widget_args = all_args[1];
                var extra_args = all_args[2].split(',');
                for (var i=0; i < extra_args.length; i++) {
                    var keyval = extra_args[i].split(/=+/);
                    widget_parse[keyval[0]] = keyval[1];
                }
            }

            if (! (data.field || data.parse)) {
                data.field = data.fields[0];
            }
            if (data.field) {
                widget_parse[ data.field ] = widget_args;
            }

            var widgetFields = data.parse ? (data.parse.fields || data.fields) : data.fields;

            if (data.parse) {
                var regexp = data.parse.regexp;
                var regexp2 = regexp.replace(/^\?/, '');
                if (regexp != regexp2)
                    regexp = Wikiwyg.Widgets.regexps[regexp2];
                var tokens = widget_args.match(regexp);
                if (tokens) {
                    for (var i = 0; i < widgetFields.length; i++)
                        widget_parse[ widgetFields[i] ] = tokens[i+1];
                }
                else {
                    if (data.parse.no_match)
                        widget_parse[ data.parse.no_match ] = widget_args;
                }
            }

            if (widget_parse.size) {
                if (widget_parse.size.match(/^(\d+)(?:x(\d+))?$/)) {
                    widget_parse.width = RegExp.$1 || '';
                    widget_parse.height = RegExp.$2 || '';
                }
            }

            if (widget_parse.search_term) {
                var term = widget_parse.search_term;
                var term2 = term.replace(/^(tag|category|title):/, '');
                if (term == term2) {
                    widget_parse.search_type = 'text';
                }
                else {
                    widget_parse.search_type = RegExp.$1;
                    if (widget_parse.search_type == 'tag')
                        widget_parse.search_type = 'category';
                    widget_parse.search_term = term2;
                }
            }
            return widget_parse;
        }
    }

    var gen_do_widget = function(w) {
        return function() {
            try {
                this.currentWidget = this.parseWidget('{' + w + ': }');
                this.currentWidget = this.setTitleAndId(this.currentWidget);
                var selection = '';
                try {
                    selection = this.get_selection_text().replace(/\\s+$/,'');
                } catch (e) {
                    selection = '';
                }
                this.getWidgetInput(this.currentWidget, selection, true);
            } catch (E) {
                // ignore error from parseWidget
            }
        }
    };

    var widget = widgets_list[i];
    proto['parse_widget_' + widget] = gen_widget_parser(widget_data[widget]);
    proto['do_widget_' + widget] = gen_do_widget(widget);
}

proto.widget_walk = function(elem) {
    for (var part = elem.firstChild; part; part = part.nextSibling) {
        if (part.nodeType != 1) continue;
        if (part.nodeName == 'SPAN' || part.nodeName == 'DIV') {
            var name = part.className;

            // HALGHALGHAHG - Horrible fix for horrendous IE bug.
            if (part.nextSibling && part.nextSibling.nodeType == 8)
                part.appendChild(part.nextSibling);

            if (name && name.match(/(nlw_phrase|wafl_block)/)) {
                part = this.replace_widget(part);
            }
        }
        this.widget_walk(part);
    }
}

proto.replace_widget = function(elem) {
    var comment = elem.lastChild;
    if (!comment || comment.nodeType != 8) return elem;
    if (! comment.nodeValue.match(/^\s*wiki:/)) return elem;
    var widget = comment.nodeValue.replace(/^\s*wiki:\s*([\s\S]*?)\s*$/, '$1');
    widget = widget.replace(/-=/g, '-');
    var widget_image;
    var src;

    if (/nlw_phrase/.test(elem.className)) {
        if ($.browser.webkit) widget = widget.replace(
            /&#x([a-fA-F\d]{2,5});/g, 
            function($_, $1) { 
                return String.fromCharCode(parseInt($1, 16));
            }
        );
        if ( (matches = widget.match(/^"([\s\S]+?)"<(.+?)>$/m)) || // Named Links
            (matches = widget.match(/^(?:"([\s\S]*)")?\{([-\w]+):?\s*([\s\S]*?)\s*\}$/m))) {
            // For labeled links or wafls, remove all newlines/returns
            widget = widget.replace(/[\r\n]/g, ' ');
        }
        if (widget.match(/^{image:/)) {
            var orig = elem.firstChild;
            if (orig.src) src = orig.src;
        }
    }

    if (!src) src = this.getWidgetImageUrl(widget);

    widget_image = Wikiwyg.createElementWithAttrs('img', {
        'src': src,
        'alt': 'st-widget-' + (Wikiwyg.is_ie? Wikiwyg.htmlEscape(widget) : widget),
        'title': this.getWidgetTooltip(widget)
    });
    elem.parentNode.replaceChild(widget_image, elem);
    return widget_image;
}

proto.insert_generated_image = function (widget_string, elem, cb) {
    this.insert_image(
        this.getWidgetImageUrl(widget_string),
        widget_string,
        elem,
        cb
    );
}

proto.insert_real_image = function(widget, elem, cb) {
    var self = this;
    jQuery.get(
        this.wikiwyg.config.postURL || location.pathname,
        'action=preview' +
        ';wiki_text=' + encodeURIComponent(widget) +
        ';page_name=' + encodeURIComponent(Socialtext.page_id),
        function(dom) {
            var src = jQuery(dom.firstChild).children('img').attr('src');
            if (src) {
                self.insert_image(src, widget, elem, cb);
            }
            else {
                self.insert_generated_image(widget, elem, cb);
            }
        },
        'xml'
    );
}

proto.insert_image = function (src, widget, widget_element, cb) {
    var html = '<img ';

    if (!window.image_dimension_cache) {
        window.image_dimension_cache = {};
    }

    var dim = window.image_dimension_cache[src];

    html += 'onload="if (typeof(ss) != \'undefined\' && ss.editor) { var recalc = function () { try { ss.editor.DoPositionCalculations() } catch (e) { setTimeout(recalc, 500) } }; recalc() } ';

    if (dim && (dim[0] || dim[1])) {
        html += '" width="' + dim[0] + '" height="' + dim[1] + '"';
    }
    else {
        var srcEscaped = src.replace(/&/g,"&amp;")
                            .replace(/"/g,"&quot;")
                            .replace(/</g, "&lt;")
                            .replace(/>/g, "&gt;")
                            .replace(/'/g, "\\'")
                            .replace(/\\/g, "\\\\");
        html += 'if (!window.image_dimension_cache) window.image_dimension_cache = {};';
        html += 'if (this.offsetWidth && this.offsetHeight) { window.image_dimension_cache[' + "'";
        html += srcEscaped;
        html += "'" + '] = [ this.offsetWidth, this.offsetHeight ]; ';
        html += "this.style.width = this.offsetWidth + 'px'; this.style.height = this.offsetHeight + 'px'";
        html += '}"';
    }

    html += ' src="' + src +
        '" alt="st-widget-' + widget.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;") + '" />';
    if ( widget_element ) {
        if ( widget_element.parentNode ) {
            if (widget_element.getAttribute('alt') == 'st-widget-' + widget) {
                // Do nothing - The widget was not modified.
            }
            else {
                $(widget_element).replaceWith(html);
            }
        }
        else {
            this.insert_html(html);
        }
    }
    else {
        this.insert_html(html);
    }
    this.setWidgetHandlers();
    if (cb)
        cb();
}

proto.insert_block = function (text, label, elem) {
    if (!elem) { this.insert_html('<br />'); }
    this.insert_image(
        this.getWidgetImageUrl(label),
        text,
        elem
    );
    if (!elem) { this.insert_html('<br />'); }
}

proto.insert_widget = function(widget, widget_element, cb) {
    var self = this;

    var changer = function() {
        try {
            if (widget.match(/^{image:/)) {
                self.insert_real_image(widget, widget_element, cb);
            }
            else {
                self.insert_generated_image(widget, widget_element, cb);
            }
        }
        catch(e) {
            setTimeout(changer, 300);
        }
    }

    // These lines caused the IE only bug {bz: 1506}.
    // Not running them in IE seems to make widget insertion ok in IE.
    if (! jQuery.browser.msie) {
        this.get_edit_window().focus();
        this.get_edit_document().body.focus();
    }

    changer();
}

proto.getWidgetImageText = function(widget_text, widget) {
    var text = widget_text;
    var config = widget_data[ widget.id ];
    if (config && config.use_title_as_text) {
        text = config.title;
        if (/__title__/.test(text)) {
            var match = widget_text.replace(/-=/g, '-').replace(/==/g, '=').match(/\s__title__=(\S+)[\s}]/);
            if (match) {
                text = text.replace(/__title__/g, decodeURI(match[1]));
            }
            else {
                text = text.replace(/__title__\s+/g, '');
            }
        }
    }
    else if (widget_text.match(/^"([^"]+)"{/)) {
        text = RegExp.$1;
    }
    else if (widget.id && widget_data[widget.id].image_text) {
        for (var i=0; i < widget_data[widget.id].image_text.length; i++) {
            if (widget_data[widget.id].image_text[i].field == 'default') {
                text = widget_data[widget.id].image_text[i].text;
                break;
            }
            else if (widget[widget_data[widget.id].image_text[i].field]) {
                text = widget_data[widget.id].image_text[i].text;
                break;
            }
        }
    }
    text = this.getWidgetImageLocalizeText(widget, text);
    return text;
}

proto.getWidgetImageLocalizeText = function(widget, text) {
    var params = text.match(/%(\w+)/g);
    var newtext = text; 
    var newtext_args = "";
    if (params != null) {
        for (i = 0; i < params.length; i++) {
            params[i] = params[i].replace(/^%/, "");
            var mytext = widget[params[i]] || "";
            newtext = newtext.replace("%" + params[i], "[_" + ( i + 1 ) + "]").replace(/\\/g, '\\\\');
            newtext_args += ", \"" + mytext.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + "\"";
        }
    }
    if (newtext_args != "") {
        newtext = eval("loc(\"" + newtext + "\"" + newtext_args + ")");
        if (newtext == 'undefined'){
            newtext = text;
        }
    }
    else {
        newtext = eval("loc(\"" + newtext + "\")");
        if (newtext == 'undefined') {
            newtext = text;
        }
    }
    return newtext;
}

proto.getWidgetTooltip = function(widget_text) {
    var uneditable = false;
    try {
        var widget = this.parseWidget(widget_text);
        uneditable = widget_data[widget.id].uneditable;
        widget_text = this.getWidgetImageText(widget_text, widget);
    }
    catch (e) {
        // parseWidget can throw an error
        // Just ignore and set the text to be the widget text
    }

    return widget_text;
}

proto.getWidgetImageUrl = function(widget_text) {
    var uneditable = false;
    try {
        var widget = this.parseWidget(widget_text);
        uneditable = widget_data[widget.id].uneditable;
        widget_text = this.getWidgetImageText(widget_text, widget);
    }
    catch (e) {
        // parseWidget can throw an error
        // Just ignore and set the text to be the widget text
    }

    return '/data/wafl/' + encodeURIComponent(widget_text).replace(/%2F/g, '/') + (uneditable ? '?uneditable=1' : '');
}

proto.create_wafl_string = function(widget, form) {
    var data = widget_data[widget];
    var result = data.pattern || '{' + widget + ': %s}';

    var values = this.form_values(widget, form);
    var fields =
        data.fields ? data.fields :
        data.field ? [ data.field ] :
        [];
    if (data.other_fields) {
        jQuery.each(data.other_fields, function (){ fields.push(this) });
    }
    for (var j = 0; j < fields.length; j++) {
        var token = new RegExp('%' + fields[j]);
        result = result.replace(token, values[fields[j]]);
    }

    result = result.
        replace(/^\"\s*\"/, '').
        replace(/\[\s*\]/, '').
        replace(/\<\s*\>/, '').
        replace(/\(\s*\)/, '').
        replace(/\s;\s/, ' ').
        replace(/\s\s+/g, ' ').
        replace(/^\{([-\w]+)\: \}$/,'{$1}');
    if (values.full)
        result = result.replace(/^(\{[-\w]+)/, '$1_full');
    return result;
}

for (var i = 0; i < widgets_list.length; i++) {
    var widget = widgets_list[i];
    var gen_handle = function(widget) {
        return function(form) {
            var values = this.form_values(widget, form);
            this.validate_fields(widget, values);
            return this.create_wafl_string(widget, form);
        };
    };
    proto['handle_widget_' + widget] = gen_handle(widget);
}

proto.form_values = function(widget, form) {
    var data = widget_data[widget];
    var fields =
        data.fields ? data.fields :
        data.field ? [ data.field ] :
        [];
    var values = {};

    for (var i = 0; i < fields.length; i++) {
        var value = '';
        var field = fields[i];

        if (this.currentWidget.title_and_id && this.currentWidget.title_and_id[field] && this.currentWidget.title_and_id[field].id)
            value = this.currentWidget.title_and_id[field].id;
        else if (form[field].length > 1)
            value = jQuery('*[name='+field+']:checked', form).val();
        else
            value = form[field].value.
                replace(/^\s*/, '').
                replace(/\s*$/, '');
        var cb = jQuery('*[name=st-widget-'+field+'-rb]:checked', form);
        if (cb.size()) {
            var whichValue = cb.val();
            if (whichValue == 'current') {
                value = '';
            }
        }
        values[field] = value;
    }
    if (values.label) {
        values.label = values.label.replace(/^"*/, '').replace(/"*$/, '');
    }
    if (values.size) {
        if (values.size == 'custom') {
            values.size = form.width.value || 0 + 'x' + form.height.value || 0;
        }
    }
    if (values.search_term) {
        var type = this.get_radio(form.search_type);
        if (type && type.value != 'text')
            values.search_term = type.value + ':' + values.search_term;
    }
    values.full = (form.full && form.full.checked);

    return values;
}

proto.get_radio = function(elem) {
    if (!(elem && elem.length)) return;
    for (var i = 0; i <= elem.length; i++) {
        if (elem[i].checked)
            return elem[i];
    }
}

proto.validate_fields = function(widget, values) {
    var data = widget_data[widget];
    var required = data.required || (data.field ? [data.field] : null);
    if (required) {
        for (var i = 0; i < required.length; i++) {
            var field = required[i];
            if (! values[field].length) {
                var label = Wikiwyg.Widgets.fields[field];
                throw(loc("error.widget-field-required=label", label));
            }
        }
    }

    var require = data.require_one;
    if (require) {
        var found = 0;
        labels = [];
        for (var i = 0; i < require.length; i++) {
            var field = require[i];
            var label = loc(Wikiwyg.Widgets.fields[field]);
            labels.push(label);
            if (values[field].length)
                found++;
        }
        if (! found)
            throw(loc("error.field-required=labels", labels.join(', ')));
    }

    for (var field in values) {
        var regexp = Wikiwyg.Widgets.match[field];
        if (! regexp) continue;
        if (! values[field].length) continue;
        var fieldOk = true;
        if (this.currentWidget.title_and_id && this.currentWidget.title_and_id[field])
            fieldOk = this.currentWidget.title_and_id[field].id.match(regexp);
        else
            fieldOk = values[field].match(regexp);

        if (!fieldOk) {
            var label = Wikiwyg.Widgets.fields[field];
            throw(loc("error.invalid-widget-field=label", label));
        }
    }

    var checks = data.checks;
    if (checks) {
        for (var i = 0; i < checks.length; i++) {
            var check = checks[i];
            this[check].call(this, values);
        }
    }
}

proto.require_valid_video_url = function(values) {
    if (!values.video_url || !values.video_url.length) {
        throw(loc("error.video-url-required"));
    }

    var error = null;
    jQuery.ajax({
        type: 'get',
        async: false,
        url: 'index.cgi',
        dataType: 'json',
        data: {
            action: 'check_video_url',
            video_url: values.video_url.replace(/^<|>$/g, '')
        },
        success: function(data) {
            if (data.title) {
                return true;
            }
            else {
                error = data.error || loc("error.invalid-video-url");
            }
        },
        error: function(xhr) {
            error = loc("error.check-video-url");
        }
    });

    if (error) {
        throw(error);
    }

    return true;
}

proto.require_page_if_workspace = function(values) {
    if (values.spreadsheet_title) {
        return this.require_spreadsheet_if_workspace(values);
    }

    if (values.workspace_id.length && ! values.page_title.length)
        throw(loc("edit.page-title-required-for-wiki"));
}

proto.require_spreadsheet_if_workspace = function(values) {
    if (values.workspace_id.length && ! values.spreadsheet_title.length)
        throw(loc("edit.spreadsheet-title-required-for-wiki"));
}


proto.hookLookaheads = function() {
    var currentWidget = this.currentWidget;
    jQuery('#st-widget-workspace_id')
        .lookahead({
            filterName: 'title_filter',
            url: '/data/workspaces',
            linkText: function (i) {
                return [ i.title + ' (' + i.name + ')', i.name ];
            },
            onAccept: function () {
                currentWidget.title_and_id.workspace_id.id = this.value;
            }
        })
        .keyup( function () {
            var which = this.value ? 'other' : 'current';
            jQuery('*[name='+this.id+'-rb][value='+which+']')
                .attr('checked', true);
            currentWidget.title_and_id.workspace_id.id = this.value;
        });

    jQuery('#st-widget-page_title')
        .lookahead({
            url: function () {
                var ws = jQuery('#st-widget-workspace_id').val() ||
                         Socialtext.wiki_id;
                return '/data/workspaces/' + ws + '/pages';
            },
            params: {
                minimal_pages: 1,
                type: 'wiki'
            },
            linkText: function (i) { return i.name }
        });

    jQuery("#st-widget-spreadsheet_title")
        .lookahead({
            url: function () {
                var ws = jQuery('#st-widget-workspace_id').val() ||
                         Socialtext.wiki_id;
                return '/data/workspaces/' + ws + '/pages';
            },
            params: {
                minimal_pages: 1,
                type: 'spreadsheet'
            },
            linkText: function (i) { return i.name }
        });

    jQuery('#st-widget-tag_name')
        .lookahead({
            url: function () {
                var ws = jQuery('#st-widget-workspace_id').val() ||
                         Socialtext.wiki_id;
                return '/data/workspaces/' + ws + '/tags';
            },
            linkText: function (i) { return i.name }
        });

    jQuery('#st-widget-weblog_name')
        .lookahead({
            url: function () {
                var ws = jQuery('#st-widget-workspace_id').val() ||
                         Socialtext.wiki_id;
                return '/data/workspaces/' + ws + '/tags';
            },
            filterValue: function (val) {
                return val + '.*(We)?blog$';
            },
            linkText: function (i) { return i.name }
        });

    jQuery('#st-widget-section_name')
        .lookahead({
            url: function () {
                var ws = jQuery('#st-widget-workspace_id').val() || Socialtext.wiki_id;
                var pg = jQuery('#st-widget-page_name').val() || Socialtext.page_id;
                pg = nlw_name_to_id(pg || '');
                return '/data/workspaces/' + ws + '/pages/' + pg + '/sections';
            },
            linkText: function (i) { return i.name }
        });

    jQuery('#st-widget-image_name, #st-widget-file_name')
        .lookahead({
            url: function () {
                var ws = jQuery('#st-widget-workspace_id').val() || Socialtext.wiki_id;
                var pg = jQuery('#st-widget-page_name').val() || Socialtext.page_id;
                pg = nlw_name_to_id(pg || '');
                return '/data/workspaces/' + ws + '/pages/' + pg +
                       '/attachments';
            },
            linkText: function (i) { return i.name }
        });
}

proto.getWidgetInput = function(widget_element, selection, new_widget) {
    // Allow this function to be overridden by an editHandler (used in the
    // activities widget currently)
    if (jQuery.isFunction(this.config.editHandler)) {
        this.config.editHandler(widget_element, selection, new_widget);
        return;
    }

    if ( Wikiwyg.Widgets.widget_editing > 0 )
        return;
    Wikiwyg.Widgets.widget_editing++;

    if ( widget_element.nodeName ) {
        this.currentWidget = this.parseWidgetElement(widget_element);
        this.currentWidget = this.setTitleAndId(this.currentWidget);
        this.currentWidget.element = widget_element;
    }
    else {
        this.currentWidget = widget_element;
    }

    this.currentWidget.skin_path = nlw_make_s2_path('');

    // Give the templates direct access to loc()
    // This should not be needed after new Jemplate release...
    this.currentWidget.loc = loc;

    var widget = this.currentWidget.id;

    if (widget == 'link2') {
        this.do_link(widget_element);
        jQuery('#wiki-link-text').focus();
        return;
    }
    else if (widget == 'link2_section') {
        this.do_link(widget_element);
        jQuery('#add-section-link').select();
        jQuery('#section-link-text').focus();
        return;
    }
    else if (widget == 'link2_hyperlink') {
        this.do_link(widget_element);
        jQuery('#add-web-link').select();
        jQuery('#web-link-text').focus();
        return;
    }
    else if (widget == 'pre') {
        this.do_widget_pre(widget_element);
        return;
    }
    else if (widget == 'html') {
        this.do_widget_html(widget_element);
        return;
    }
    else if (/^code(?:-\w+)?$/.test(widget)) {
        this.do_widget_code(widget_element);
        return;
    }
    else if (widget == 'widget') {
        this.do_opensocial_setup();
        return;
    }

    var template = 'widget_' + widget + '_edit.html';
    var html = Jemplate.process(template, this.currentWidget);

    jQuery('#widget-' + widget).remove();

    jQuery('<div />')
        .attr('id', 'widget-' + widget)
        .attr('class', 'lightbox')
        .html(html)
        .appendTo('body');

    var self = this;
    jQuery.showLightbox({
        content: '#widget-' + widget,
        callback: function() {
            var config = Wikiwyg.Widgets.widget[ widget ];
            var fields =
                (config.focus && [ config.focus ]) ||
                config.required ||
                config.fields ||
                [ config.field ];

            var field = fields[0];
            if (field) {
                var selector =
                    field.match(/^[\#\.]/)
                    ? field
                    : '#st-widget-' + field;
                jQuery(selector).select().focus();
            }

            if (widget == 'video') {
                self._preload_video_dimensions();
            }
        }
    });

    var self = this;
    var form = jQuery('#widget-' + widget + ' form').get(0);

    var intervalId = setInterval(function () {
        if (widget == 'video') {
            $('#st-widget-video_url').triggerHandler('change');
        }
        jQuery('#'+widget+'_wafl_text')
            .html(
                ' <span>' +
                self.create_wafl_string(widget, form).
                    replace(/</g, '&lt;') +
                '</span> '
            );
    }, 500);

    // When the lightbox is closed, decrement widget_editing so lightbox can pop up again. 
    jQuery('#lightbox').unbind('lightbox-unload').bind("lightbox-unload", function(){
        clearInterval(intervalId);
        Wikiwyg.Widgets.widget_editing--;
        if (self.wikiwyg && self.wikiwyg.current_mode && self.wikiwyg.current_mode.set_focus) {
            self.wikiwyg.current_mode.set_focus();
        }
    });

    jQuery('#st-widgets-moreoptions').unbind('click').toggle(
        function () {
            jQuery('#st-widgets-moreoptions')
                .html(loc('wafl.fewer-options'))
            jQuery('#st-widgets-optionsicon')
                .attr('src', nlw_make_s2_path('/images/st/hide_more.gif'));
            jQuery('#st-widgets-moreoptionspanel').show();
        },
        function () {
            jQuery('#st-widgets-moreoptions')
                .html(loc('wafl.more-options'))
            jQuery('#st-widgets-optionsicon')
                .attr('src', nlw_make_s2_path('/images/st/show_more.gif'));
            jQuery('#st-widgets-moreoptionspanel').hide();
        }
    );

    jQuery(form)
        .unbind('submit')
        .submit(function() {
            var error = null;
            jQuery('#lightbox .buttons input').attr('disabled', 'disabled');
            try {
                var widget_string = self['handle_widget_' + widget](form);
                clearInterval(intervalId);
                self.insert_widget(widget_string, widget_element, function () {
                    jQuery('#lightbox .buttons input').attr('disabled', '');
                    jQuery.hideLightbox();
                });
            }
            catch(e) {
                error = String(e);
                jQuery('#'+widget+'_widget_edit_error_msg')
                    .show()
                    .html('<span>'+error+'</span>');
                jQuery('#lightbox .buttons input').attr('disabled', '');
                return false;
            }
            return false;
        });

    jQuery('#st-widget-cancelbutton')
        .unbind('click')
        .click(function () {
            clearInterval(intervalId);
            jQuery.hideLightbox();
        });

    this.hookLookaheads();

        // Grab the current selection and set it in the lightbox. uck
    var data = widget_data[widget];
    var primary_field =
        data.primary_field ||
        data.field ||
        (data.required && data.required[0]) ||
        data.fields[data.fields.length - 1];
    if (new_widget && selection) {
        selection = selection.replace(
            /^<DIV class=wiki>([^\n]*?)(?:&nbsp;)*<\/DIV>$/mg, '$1'
        ).replace(
            /<DIV class=wiki>\r?\n<P><\/P><BR>([\s\S]*?)<\/DIV>/g, '$1'
        ).replace(/<BR>/g,'');

        form[primary_field].value = selection;
    }

    function disable (elem) {
        if (Number(elem.value))
            elem.stored_value = elem.value;
        elem.value = '';
        elem.style.backgroundColor = '#ddd'
        elem.pretend_disabled = true;
    }

    function enable (elem) {
        // Re-enable the width
        if (elem.pretend_disabled) {
            elem.value = elem.stored_value || '';
            elem.style.backgroundColor = '#fff'
            elem.pretend_disabled = false;
        }
    }

    if (form.size) {
        jQuery(form.width).click(function (){
            form.size[form.size.length-1].checked = true;
            disable(form.height);
            enable(form.width);
        }).focus(function() {
            $(this).triggerHandler('click');
        });
        jQuery(form.height).click(function () {
            form.size[form.size.length-1].checked = true;
            disable(form.width);
            enable(form.height);
        }).focus(function() {
            $(this).triggerHandler('click');
        });
        if (!Number(form.height.value))
            disable(form.height);
        else if (!Number(form.width.value))
            disable(form.width);
    }
}

proto._preload_video_dimensions = function() {
    var previousURL = null;
    var loading = false;
    var queued = false;

    $('#st-widget-video_url').unbind('change').change(function(){
        var url = $(this).val();
        if (!/^[-+.\w]+:\/\/[^\/]+\//.test(url)) {
            $('#st-widget-video-original-width').text('');
            url = null;
        }
        if (url == previousURL) { return; }
        previousURL = url;

        if (loading) { queued = true; return; }
        queued = false;

        if (!url) { return; }
        loading = true;

        $('#st-widget-video-original-width').text(loc('edit.loading'));
        $('#video_widget_edit_error_msg').text('').hide();

        jQuery.ajax({
            type: 'get',
            async: true,
            url: 'index.cgi',
            dataType: 'json',
            data: {
                action: 'check_video_url',
                video_url: url.replace(/^<|>$/g, '')
            },
            success: function(data) {
                loading = false;
                if (queued) {
                    $('#st-widget-video_url').triggerHandler('change');
                    return;
                }
                if (data.title) {
                    $('#st-widget-video-original-width').text(
                        loc('wafl.width=px', data.width)
                            + ' ' +
                        loc('wafl.height=px', data.height)
                    );
                }
                else {
                    $('#st-widget-video-original-width').text('');
                }
            }
        });
    });
}


