/*==============================================================================
Wikiwyg - Turn any HTML div into a wikitext /and/ wysiwyg edit area.

DESCRIPTION:

Wikiwyg is a Javascript library that can be easily integrated into any
wiki or blog software. It offers the user multiple ways to edit/view a
piece of content: Wysiwyg, Wikitext, Raw-HTML and Preview.

The library is easy to use, completely object oriented, configurable and
extendable.

See the Wikiwyg documentation for details.

SYNOPSIS:

From anywhere you can produce a message box with a call like this:

    this.wikiwyg.message.display({
        title: 'Foo button does not work in Bar mode',
        body: 'To use the Foo button you should first switch to Baz mode'
    });

AUTHORS:

    Brian Ingerson <ingy@cpan.org>
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
NLW Message Center Class
 =============================================================================*/
 
{

var proto = Subclass('Wikiwyg.MessageCenter');
var klass = Wikiwyg.MessageCenter;
klass.closeTimer = null;

proto.messageCenter = jQuery('#st-message-center');
proto.messageCenterTitle = jQuery('#st-message-center-title');
proto.messageCenterBody = jQuery('#st-message-center-body');
proto.messageCenterControlClose = jQuery('#st-message-center-control-close');
proto.messageCenterControlArrow = jQuery('#st-message-center-control-arrow');
proto.closeDelayDefault = 10;

proto.display = function (args) {
    this.closeDelay = 
        (args.timeout ? args.timeout : this.closeDelayDefault) * 1000;
    this.messageCenterTitle.html(args.title);
    this.messageCenterBody.html(args.body);

    if (this.messageCenter.size()) {
        this.messageCenter.show();
        this.setCloseTimer();
        this.installEvents();
        this.installControls();
    }
};
proto.clearCloseTimer = function () {
    if (klass.closeTimer)
        window.clearTimeout(klass.closeTimer);
};
proto.setCloseTimer = function () {
    this.clearCloseTimer();
    var self = this;
    klass.closeTimer = window.setTimeout(
        function () { self.closeMessageCenter() },
        this.closeDelay
    );
};
proto.closeMessageCenter = function () {
    if (this.messageCenter.size()) {
        this.messageCenter.hide();
        this.closeMessage();
        this.clearCloseTimer();
    }
};
proto.clear = proto.closeMessageCenter;
proto.installEvents = function () {
    var self = this;
    this.messageCenter
        .mouseover(function () { self.openMessage() })
        .mouseout(function () { self.closeMessage() });
};
proto.openMessage = function () {
    this.clearCloseTimer();
    this.messageCenterControlArrow.attr(
        'src',
        this.messageCenterControlArrow.attr('src').replace(/right/, 'down')
    );
    this.messageCenterBody.show();
};
proto.closeMessage = function () {
    this.setCloseTimer();
    this.messageCenterControlArrow.attr(
        'src',
        this.messageCenterControlArrow.attr('src').replace(/down/, 'right')
    );
    this.messageCenterBody.hide();
};
proto.installControls = function () {
    var self = this;
    this.messageCenterControlClose.click(function () { self.closeMessageCenter() });
};

}
