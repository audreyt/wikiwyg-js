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
