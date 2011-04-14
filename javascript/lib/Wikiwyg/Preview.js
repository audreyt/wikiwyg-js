/*==============================================================================
This Wikiwyg mode supports a preview of current changes

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

proto = new Subclass('Wikiwyg.Preview', 'Wikiwyg.Mode');

proto.classtype = 'preview';
proto.modeDescription = 'Preview';

proto.config = {
    divId: null
}

proto.initializeObject = function() {
    if (this.config.divId)
        this.div = document.getElementById(this.config.divId);
    else
        this.div = document.createElement('div');
    // XXX Make this a config option.
    this.div.style.backgroundColor = 'lightyellow';
}

proto.enableThis = function() {
    Wikiwyg.Mode.prototype.enableThis.apply(this, arguments);
    jQuery('table.sort', this.div)
        .each(function() {
            Socialtext.make_table_sortable(this);
        });
}

proto.toHtml = function(func) {
    func(this.div.innerHTML);
}

proto.disableStarted = function() {
    this.wikiwyg.divHeight = this.div.offsetHeight;
}

proto.enableStarted = function() {
    jQuery('#st-edit-mode-container').addClass('preview');
}

proto.disableFinished = function() {
    jQuery('#st-edit-mode-container').removeClass('preview');
}

proto.fromHtml = function(html) {
    this.div.innerHTML = html;
    this.div.style.display = 'block';
    this.wikiwyg.enableLinkConfirmations();
    if (/SyntaxHighlighter\.all/.test(html)) {
        $('#st-page-preview script[src]').each(function(){
            $.getScript($(this).attr('src'), function(){
                var _alert = window.alert;
                SyntaxHighlighter.vars.discoveredBrushes = null;
                window.alert = function(){};
                SyntaxHighlighter.highlight();
                window.alert = _alert;
            })
        });

    }
}

