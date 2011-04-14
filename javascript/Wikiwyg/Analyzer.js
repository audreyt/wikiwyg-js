/*==============================================================================
Wikiwyg - Turn any HTML div into a wikitext /and/ wysiwyg edit area.

COPYRIGHT:

    Copyright (c) 2005-2011 Socialtext Corporation 
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

/*

x Add Toolbar
x Put in busy semaphore
x Set interval to 100ms
x Write Wikiwyg.Dominator
x Change spaces to '·' in text mode
x Allow all wikiwyg classes to be configged with an area id
x Pulldown selector of all pages
x Make preview hit the server
x Insert 'Loading page...' message while loading page
x Get rid of alert when leaving or reloading pages
x Write mode switching code
x Edit from wikitext
x Edit from html
x Push from preview
x Click on edit area selects mode
x Make it work on IE
x Remove extra attributes in IE DOMinator
x Don't update windows unless current window has changed

- Make Layout Selector work
- Make Height Selector work
- Fix onclick for iframe
- Prune uneeded javascript files
- Use checkboxes for selectors

*/

onload = function() {
    var ww = wikiwyg = new Wikiwyg.Analyzer();

    var myConfig = {
        toolbar: {
            divId: 'toolbar_div',
            imagesLocation: nlw_make_s2_path('/images/wikiwyg_icons/')
        },
        wysiwyg: {
            iframeId: 'wysiwyg_iframe'
        },
        modeClasses: [
            WW_SIMPLE_MODE,
            WW_ADVANCED_MODE,
            WW_HTML_MODE,
            WW_PREVIEW_MODE,
            'Wikiwyg.Dominator'
        ]
    };

    var myDiv = document.getElementById('bogus_wikiwyg_content_div');
    ww.createWikiwygArea(myDiv, myConfig);
    if (! ww.enabled) return;
    
    var analyzer = wikiwyg.analyzer = new Analyzer();
    analyzer.wikiwyg = wikiwyg;

    var simple    = analyzer.simple    = ww.mode_objects[WW_SIMPLE_MODE];
    var advanced  = analyzer.advanced  = ww.mode_objects[WW_ADVANCED_MODE];
    var html      = analyzer.html      = ww.mode_objects[WW_HTML_MODE];
    var preview   = analyzer.preview   = ww.mode_objects[WW_PREVIEW_MODE];
    var dominator = analyzer.dominator = ww.mode_objects['Wikiwyg.Dominator'];

    advanced.area =
    advanced.textarea = document.getElementById('wikitextarea');
    html.textarea     = document.getElementById('htmltextarea');
    preview.div       = document.getElementById('preview_div');
    dominator.div     = document.getElementById('dominator_div');

    simple.old_content = '';
    advanced.old_content = '';
    html.old_content = '';
    preview.old_content = '';
    
    // XXX - Despite many attempts we can't seem to trigger an event on the
    // designmode iframe. Bonus points for solving this one.
    simple.get_edit_window().onclick = function() {
        alert('XXX This is not working yet :(');
        document.forms[0].mode[0].checked = true;
    }
    advanced.textarea.onclick = function() {
        document.forms[0].mode[1].checked = true;
    }
    html.textarea.onclick = function() {
        document.forms[0].mode[2].checked = true;
    }
    preview.div.ondblclick = function() {
        document.forms[0].mode[3].checked = true;
    }

    analyzer.setup_pulldowns();
    // setTimeout for IE.
    setTimeout( function () {
        simple.enableThis();
        analyzer.interval_id = setInterval(function() {analyzer.update()}, 100);
    }, 500);
}

//------------------------------------------------------------------------------
proto = Subclass('Analyzer');

proto.busy = 0;

proto.setup_pulldowns = function() {
    document.forms[0].mode[0].checked = true;
    var p = document.forms[0].page_selector;
    var l = document.forms[0].layout_selector;
    var h = document.forms[0].height_selector;
    var self = this;
    p.onchange = function(e) { self.changePage(e) };
    h.onchange = function(e) { self.changeHeight(e) };
    p[0].selected = true;
    l[0].selected = true;
    h[0].selected = true;
}

proto.changePage = function(e) {
    var target = Wikiwyg.is_ie ? event.srcElement : e.target;
    var page_id = target.value;
    var self = this;
    this.busy++;
    this.simple.set_inner_html( "<blink>Loading..</blink>" ) ;
    this.preview.div.innerHTML = "<blink>Loading..</blink>";
    this.advanced.textarea.value="Loading..";
    this.html.textarea.value="Loading..";
    Ajax.get(
        'index.cgi' + '?action=wikiwyg_get_page_html;page_id=' + page_id,
        function(r) {
            self.simple.fromHtml(r);
            self.busy--;
        }
    );
}

proto.changeHeight = function(e) {
    var target = Wikiwyg.is_ie ? event.srcElement : e.target;
    var height = '' + target.value + 'px';
    var divs = this.getAllModeDivs();
    for (var i = 0; i < divs.length; i++) {
        divs[i].style.height = height;
    }
    var inner_height = (target.value - 100) + 'px';

    var inner_divs = ['wysiwyg_iframe','wikitextarea','htmltextarea','preview_div','dominator_div'];
    for(var i = 0; i < inner_divs.length; i ++) {
        document.getElementById(inner_divs[i]).style.height = inner_height;
    }
}

proto.mode_ids = ['simple', 'advanced', 'html', 'preview', 'dominator'];

proto.getAllModeDivs = function() {
    var divs = [];
    for(var i  =0; i< this.mode_ids.length; i++) {
        var div_id = this.mode_ids[i] + "_mode_div";
        divs.push(document.getElementById(div_id));
    }
    return divs;
}

proto.update = function() {
    if (this.busy) return;
    if (this.isFocused('simple'))
        this.updateFromSimple();
    else if (this.isFocused('advanced'))
        this.updateFromAdvanced();
    else if (this.isFocused('html'))
        this.updateFromHtml();
    else if (this.isFocused('preview'))
        this.updateFromPreview();
}

proto.isFocused = function(mode) {
    var selector = document.forms[0].mode;
    for (var i = 0; i < selector.length; i++) {
        if (selector[i].value == mode)
            return selector[i].checked;
    }
    throw 'oops';
}

proto.updateFromSimple = function() {
    var simple = this.simple;
    this.wikiwyg.current_mode = simple;
    this.wikiwyg.previous_mode = simple;
    if (simple.old_content == simple.get_inner_html())
        return;
    simple.old_content = simple.get_inner_html();

    this.busy++;
    var self = this;
    simple.toHtml(
        function(html) {
            try {
                var wikitext = self.advanced.convert_html_to_wikitext(html);
                self.busy++;
                self.advanced.convertWikitextToHtml(
                    wikitext,
                    function(new_html) {
                        self.preview.div.innerHTML = new_html;
                        self.busy--;
                    }
                );
                self.html.fromHtml(html);
                self.advanced.fromHtml(html);
                self.dominator.fromHtml(html);
            }
            catch(e) {
                throw('Error converting from simple: ' + e);
            }
            self.busy--;
        }
    );
}

proto.updateFromAdvanced = function() {
    var advanced = this.advanced;
    this.wikiwyg.current_mode = advanced;
    this.wikiwyg.previous_mode = advanced;
    if (advanced.old_content == advanced.textarea.value)
        return;
    advanced.old_content = advanced.textarea.value;

    this.busy++;
    var self = this;
    advanced.toHtml(
        function(html) {
            self.preview.div.innerHTML = html;
            self.html.fromHtml(html);
            self.simple.fromHtml(html);
            self.dominator.fromHtml(html);
            self.busy--;
        }
    );
}

proto.updateFromHtml = function() {
    var html = this.html;
    this.wikiwyg.current_mode = html;
    this.wikiwyg.previous_mode = html;
    if (html.old_content == html.textarea.value)
        return;
    html.old_content = html.textarea.value;

    this.busy++;
    var self = this;
    html.toHtml(
        function(myhtml) {
            self.preview.div.innerHTML = myhtml;
            self.advanced.fromHtml(myhtml);
            self.simple.fromHtml(myhtml);
            self.dominator.fromHtml(myhtml);
            self.busy--;
        }
    );
}

proto.updateFromPreview = function() {
    var preview = this.preview;
    this.wikiwyg.current_mode = preview;
    this.wikiwyg.previous_mode = preview;
    if (preview.old_content == preview.div.innerHTML)
        return;
    preview.old_content = preview.div.innerHTML;

    this.busy++;
    var self = this;
    preview.toHtml(
        function(html) {
            self.html.fromHtml(html);
            self.advanced.fromHtml(html);
            self.simple.fromHtml(html);
            self.dominator.fromHtml(html);
            self.busy--;
        }
    );
}

//------------------------------------------------------------------------------
proto = eval(WW_SIMPLE_MODE).prototype;

proto.show_messages = function() {};

//------------------------------------------------------------------------------
proto = eval(WW_ADVANCED_MODE).prototype;

proto.spaceChar = '·';

proto.getTextArea = function() {
    return this.textarea.value.replace(new RegExp(this.spaceChar, 'g'), ' ');
}

proto.setTextArea = function(text) {
    this.textarea.value = text.replace(/ /g, this.spaceChar);
}

//------------------------------------------------------------------------------
proto = Subclass('Wikiwyg.Analyzer', 'Wikiwyg');

proto.enableLinkConfirmations = function() {};
