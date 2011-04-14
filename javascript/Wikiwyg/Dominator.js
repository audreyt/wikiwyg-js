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

proto = new Subclass('Wikiwyg.Dominator', 'Wikiwyg.Mode');

proto.classtype = 'dominator';
proto.modeDescription = 'Dominator';

proto.config = {
    divId: null
}

proto.initializeObject = function() {
    if (this.config.divId)
        this.div = document.getElementById(this.config.divId);
    else
        this.div = document.createElement('div');
}

proto.fromHtml = function(html) {
    var self = this;
    this.div.innerHTML =
        this.convert_html_to_dom_dump(this.sanitize_html(html));
}

// XXX Not sure what this is for anymore...
proto.sanitize_html = function(html) {
    return html;
}

/*==============================================================================
Code to convert from html to a dom dump
 =============================================================================*/
proto.convert_html_to_dom_dump = function(html) {
    html = html.replace(/&nbsp;/g, '†');
    var dom = document.createElement('div');
    dom.innerHTML = html;
    this.output = [];
    this.list_type = [];
    this.indent_level = 0;

    this.walk(dom);

    var text = this.output.join('');
    text = '<pre>' + text + '</pre>';
    return text;
}

proto.appendOutput = function(string) {
    this.output.push(string);
}

proto.walk = function(element) {
    if (!element) return;
    this.indent_level++;
    for (var part = element.firstChild; part; part = part.nextSibling) {
        if (part.nodeType == 1) {
            this.appendOutput(this.startTag(part));
            this.walk(part);
            this.appendOutput(this.endTag(part));
        }
        else if (part.nodeType == 3) {
            this.appendOutput(this.textNode(part));
        }
        else if (part.nodeType == 8) {
            this.appendOutput(this.commentNode(part));
        }
        else {
            this.appendOutput(this.unknownNode(part));
        }
    }
    this.indent_level--;
}

proto.startTag = function(element) {
    return this.indent() + '&lt;' + element.nodeName +
        this.attributes(element) + '>\n';
}

proto.attributes = function(element) {
    var a = element.attributes;
    if (!(a && a.length))
        return '';
    var output = '';
    for (var i = 0; i < a.length; i++) {
        if(a[i].nodeName == "contentEditable") continue;
        if(!a[i].nodeValue) continue;
        output += ' ' + a[i].nodeName + '="' + a[i].nodeValue + '"';
    }
    return output;
}

proto.endTag = function(element) {
    return '';
}

proto.textNode = function(element) {
    var text = element.nodeValue.
        replace(/ /g, '·').
        replace(/\n/g, '\\');
    return this.indent() + text + '\n';
}

proto.commentNode = function(element) {
    var text = element.nodeValue.
        replace(/ /g, '·').
        replace(/\n/g, '\\');
    return this.indent() + '&lt;!--' + text + '-->\n';
}

proto.indent = function() {
    return '<span style="color: red">' + '_'.times(this.indent_level - 1) + '</span>';
}
