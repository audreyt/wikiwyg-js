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

This library is free software; you can redistribute it and/or modify it
under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation; either version 2.1 of the License, or (at
your option) any later version.

This library is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Lesser
General Public License for more details.

    http://www.gnu.org/copyleft/lesser.txt

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
