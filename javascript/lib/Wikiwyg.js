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
    Kang-min Liu <gugod@gugod.org>

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
Subclass - this can be used to create new classes
 =============================================================================*/
Subclass = function(class_name, base_class_name) {
    if (!class_name) throw("Can't create a subclass without a name");

    var parts = class_name.split('.');
    var subclass = window;
    for (var i = 0; i < parts.length; i++) {
        if (! subclass[parts[i]])
            subclass[parts[i]] = function() {};
        subclass = subclass[parts[i]];
    }

    if (base_class_name) {
        var baseclass = eval('new ' + base_class_name + '()');
        subclass.prototype = baseclass;
        subclass.prototype.baseclass = baseclass;
    }

    subclass.prototype.classname = class_name;
    return subclass.prototype;
}

/*==============================================================================
Wikiwyg - Primary Wikiwyg base class
 =============================================================================*/

// Constructor and class methods
Class('Wikiwyg -nostrict', function() {

var proto = this.prototype;

// Fix {bz: 2339} 'this.init is not a function'
proto.init = function() {}

Wikiwyg.VERSION = '3.00';

if (typeof LocalizedStrings == 'undefined')
    this.addGlobal().LocalizedStrings = {};
this.addGlobal().WW_SIMPLE_MODE = 'Wikiwyg.Wysiwyg';
this.addGlobal().WW_ADVANCED_MODE = 'Wikiwyg.Wikitext';
this.addGlobal().WW_PREVIEW_MODE = 'Wikiwyg.Preview';
this.addGlobal().WW_HTML_MODE = 'Wikiwyg.HTML';

// Browser support properties
Wikiwyg.ua = navigator.userAgent.toLowerCase();
Wikiwyg.is_ie = (
    Wikiwyg.ua.indexOf("msie") != -1 &&
    Wikiwyg.ua.indexOf("opera") == -1 && 
    Wikiwyg.ua.indexOf("webtv") == -1
);
Wikiwyg.is_ie7 = (
    Wikiwyg.is_ie &&
    Wikiwyg.ua.indexOf("7.0") != -1
);
Wikiwyg.is_gecko = (
    Wikiwyg.ua.indexOf('gecko') != -1 &&
    Wikiwyg.ua.indexOf('safari') == -1 &&
    Wikiwyg.ua.indexOf('konqueror') == -1
);
Wikiwyg.is_safari = (
    Wikiwyg.ua.indexOf('safari') != -1
);

/* Safari 5+ is Gecko-compatible. */
if ($.browser.safari && parseInt($.browser.version) > 500) {
    if (Wikiwyg.ua.indexOf('mobile') == -1) {
        Wikiwyg.is_gecko = true;
        Wikiwyg.is_safari = false;
    }
}

Wikiwyg.is_opera = (
    Wikiwyg.ua.indexOf('opera') != -1
);
Wikiwyg.is_konqueror = (
    Wikiwyg.ua.indexOf("konqueror") != -1
)
Wikiwyg.browserIsSupported = (
    Wikiwyg.is_gecko ||
    Wikiwyg.is_ie ||
    Wikiwyg.is_safari
);

/* {bz: 2407} - Selenium 1.0+ is almost undetectable, so we
 * use the undocumented-anywhere-on-web "seleniumAlert"
 * variable as the probe.  The "Selenium" variable is still
 * probed to retain compatibility with Selenium 0.9x.
 *
 * {bz: 3471} - In multiWindow mode and under an iframe, even
 * the seleniumAlert detection fails.  Use window.opener to
 * probe if we're opened by the Selenium RC runner.
 */
Wikiwyg._try_probe_selenium = function () {
    try {
        Wikiwyg.is_selenium = (
            (typeof seleniumAlert != 'undefined' && seleniumAlert)
            || (typeof Selenium != 'undefined' && Selenium)
            || ((typeof window.top != 'undefined' && window.top)
                && (window.top.selenium_myiframe
                    || window.top.seleniumLoggingFrame)
            || ((typeof window.top.opener != 'undefined' && window.top.opener)
                && (window.top.opener.selenium_myiframe
                    || window.top.opener.seleniumLoggingFrame))
            )
        );
    } catch (e) {
        setTimeout(Wikiwyg._try_probe_selenium, 1000);
    }
};

Wikiwyg._try_probe_selenium();

// Wikiwyg environment setup public methods
proto.createWikiwygArea = function(div, config) {
    this.set_config(config);
    this.initializeObject(div, config);
};

proto.default_config = {
    javascriptLocation: 'lib/',
    doubleClickToEdit: false,
    toolbarClass: 'Wikiwyg.Toolbar',
    firstMode: null,
    modeClasses: [ WW_SIMPLE_MODE, WW_ADVANCED_MODE, WW_PREVIEW_MODE ]
};

proto.initializeObject = function(div, config) {
    if (! Wikiwyg.browserIsSupported) return;
    if (this.enabled) return;
    this.enabled = true;
    this.div = div;
    this.divHeight = this.div.offsetHeight;
    if (!config) config = {};

    this.set_config(config);

    this.mode_objects = {};
    for (var i = 0; i < this.config.modeClasses.length; i++) {
        var class_name = this.config.modeClasses[i];
        var mode_object = eval('new ' + class_name + '()');
        mode_object.wikiwyg = this;
        mode_object.set_config(config[mode_object.classtype]);
        mode_object.initializeObject();
        this.mode_objects[class_name] = mode_object;
    }
    var firstMode = this.config.firstMode
        ? this.config.firstMode
        : this.config.modeClasses[0];
    this.setFirstModeByName(firstMode);

    if (this.config.toolbarClass && !this.config.noToolbar) {
        var class_name = this.config.toolbarClass;
        this.toolbarObject = eval('new ' + class_name + '()');
        this.toolbarObject.wikiwyg = this;
        this.toolbarObject.set_config(config.toolbar);
        this.toolbarObject.initializeObject();
    }

    // These objects must be _created_ before the toolbar is created
    // but _inserted_ after.
    for (var i = 0; i < this.config.modeClasses.length; i++) {
        var mode_class = this.config.modeClasses[i];
        var mode_object = this.modeByName(mode_class);
        this.insert_div_before(mode_object.div);
    }

    if (this.config.doubleClickToEdit) {
        var self = this;
        this.div.ondblclick = function() { self.editMode() }; 
    }
}

// Wikiwyg environment setup private methods
proto.set_config = function(user_config) {
    var new_config = {};
    var keys = [];
    for (var key in this.default_config) {
        keys.push(key);
    }
    if (user_config != null) {
        for (var key in user_config) {
            keys.push(key);
        }
    }
    for (var ii = 0; ii < keys.length; ii++) {
        var key = keys[ii];
        if (user_config != null && user_config[key] != null) {
            new_config[key] = user_config[key];
        } else if (this.default_config[key] != null) {
            new_config[key] = this.default_config[key];
        } else if (this[key] != null) {
            new_config[key] = this[key];
        }
    }
    this.config = new_config;
}

proto.insert_div_before = function(div) {
    div.style.display = 'none';
    if (! div.iframe_hack) {
        this.div.parentNode.insertBefore(div, this.div);
    }
}

// Wikiwyg actions - public methods
proto.displayMode = function() {
    for (var i = 0; i < this.config.modeClasses.length; i++) {
        var mode_class = this.config.modeClasses[i];
        var mode_object = this.modeByName(mode_class);
        mode_object.disableThis();
    }
    if (!this.config.noToolbar) this.toolbarObject.disableThis();
    this.div.style.display = 'block';
    this.divHeight = this.div.offsetHeight;

    jQuery('table.sort')
        .each(function() {
            Socialtext.make_table_sortable(this);
        });
}

proto.switchMode = function(new_mode_key, cb) {
    var new_mode = this.modeByName(new_mode_key);
    var old_mode = this.current_mode;
    var self = this;

    var method = 'toHtml';
    if (/Preview/.test(new_mode.classname)) {
        method = 'toNormalizedHtml';
    }

    old_mode[method](
        function(html) {
            jQuery("#st-edit-summary").hide();
            new_mode.enableStarted();
            old_mode.disableStarted();
            self.previous_mode = old_mode;
            new_mode.fromHtml(html);
            old_mode.disableThis();
            new_mode.enableThis();
            new_mode.enableFinished();
            old_mode.disableFinished();
            self.current_mode = new_mode;

            jQuery("#st-edit-summary").show();

            if (cb) { cb(); }
        }
    );
}

proto.modeByName = function(mode_name) {
    return this.mode_objects[mode_name]
}

proto.cancelEdit = function() {
    this.displayMode();
}

proto.fromHtml = function(html) {
    this.div.innerHTML = html;
}

proto.setFirstModeByName = function(mode_name) {
    if (!this.modeByName(mode_name))
        die('No mode named ' + mode_name);
    this.first_mode = this.modeByName(mode_name);
}

if (! this.global.wikiwyg_nlw_debug)
    this.addGlobal().wikiwyg_nlw_debug = false;

if (this.global.wikiwyg_nlw_debug)
    proto.default_config.modeClasses.push(WW_HTML_MODE);

proto.hideScrollbars = function () {
    this._originalHTMLOverflow = jQuery('html').css('overflow') || 'visible';
    this._originalBodyOverflow = jQuery('body').css('overflow') || 'visible';
}

proto.showScrollbars = function () {
    jQuery('html').css('overflow', this._originalHTMLOverflow);
    jQuery('body').css('overflow', this._originalBodyOverflow);
}

proto.resizeEditor = function () {
    if (!this.is_editing) return;
    if (this.__resizing) return;
    this.__resizing = true;

    var $iframe = jQuery('#st-page-editing-wysiwyg');
    var $textarea = jQuery('#wikiwyg_wikitext_textarea');

    if ($iframe.is(":visible")) {
        $iframe.width( jQuery('#st-edit-mode-view').width() - 48 );

        this.modeByName(WW_SIMPLE_MODE).setHeightOf(
            this.modeByName(WW_SIMPLE_MODE).edit_iframe
        );

        if (jQuery.browser.msie) {
            setTimeout(function() {
                try {
                    var s = $iframe.get(0).contentWindow.document.body.style;
                    s.zoom = 0;
                    s.zoom = 1;
                } catch(e) {
                    setTimeout(arguments.callee, 1000);
                }
            }, 1);
        }
    }
    else if ($textarea.is(":visible")) {
        this.modeByName(WW_ADVANCED_MODE).setHeightOfEditor();
    }

    this.__resizing = false;
}

proto.preview_link_text = loc('Preview');
proto.preview_link_more = loc('Edit More');

proto.preview_link_action = function() {
    var self = this;

    if (this.isOffline()) {
        alert(loc("The browser is currently offline; please connect to the internet and try again."));
        return;
    }

    var preview = self.modeButtonMap[WW_PREVIEW_MODE];
    var current = self.current_mode;

    self.enable_edit_more = function() {
        jQuery(preview)
            .html(loc('Edit More'))
            .unbind('click')
            .click( function () {
                self.switchMode(current.classname, function(){
                    if (jQuery("#contentRight").is(":visible")) 
                        jQuery('#st-page-maincontent')
                            .css({ 'margin-right': '240px'});
                    self.preview_link_reset();

                    // This timeout is for IE so the iframe is ready - {bz: 1358}.
                    setTimeout(function() {
                        self.resizeEditor();
                        self.hideScrollbars();
                    }, 50);
                });

                return false;
            });
    };

    this.modeByName(WW_PREVIEW_MODE).div.innerHTML = "";
    this.switchMode(WW_PREVIEW_MODE, function(){
        preview.innerHTML = self.preview_link_more;
        jQuery("#st-edit-mode-toolbar").hide();
        self.showScrollbars();

        jQuery(preview)
            .unbind('click')
            .click(self.button_disabled_func());
        self.enable_edit_more();
        self.disable_button(current.classname);

        jQuery('#st-page-maincontent').attr('marginRight', '0px');
    });
    return false;
}

proto.preview_link_reset = function() {
    var preview = this.modeButtonMap[WW_PREVIEW_MODE];

    preview.innerHTML = this.preview_link_text;
    jQuery("#st-edit-mode-toolbar").show();

    var self = this;
    jQuery(preview)
        .html(loc('Preview'))
        .unbind('click')
        .click( function() {
            self.preview_link_action();
            return false;
        });
}

proto.enable_button = function(mode_name) {
    if (mode_name == WW_PREVIEW_MODE) return;
    var button = this.modeButtonMap[mode_name];
    if (! button) return; // for when the debugging button doesn't exist
    jQuery(button).removeClass('disabled');
    jQuery(button).unbind('click').click(this.button_enabled_func(mode_name));
}

proto.button_enabled_func = function(mode_name) {
    var self = this;
    return function() {
        if (mode_name == self.current_mode.classname) {
            /* Already in the correct mode -- No need to switch */
            return false;
        }
        self.message.clear();
        self.switchMode(mode_name, function() {
            for (var mode in self.modeButtonMap) {
                if (mode != mode_name)
                    self.enable_button(mode);
            }
            self.preview_link_reset();
            Cookie.set('first_wikiwyg_mode', mode_name);
            self.setFirstModeByName(mode_name);
        });
        return false;
    }
}

proto.disable_button = function(mode_name) {
    var self = this;
    if (mode_name == WW_PREVIEW_MODE) return;
    var button = this.modeButtonMap[mode_name];
    jQuery(button).addClass('disabled');
    jQuery(button).click(function () {
        self.button_disabled_func(mode_name);
    });
}

proto.button_disabled_func = function(mode_name) {
    return function() { return false }
}

proto.active_page_exists = function (page_name) {
    return Page.active_page_exists(page_name);
}

proto.newpage_duplicate_pagename_keyupHandler = function(event) {
    jQuery('#st-newpage-duplicate-option-different').attr('checked', true);
    jQuery('#st-newpage-duplicate-option-suggest').attr('checked', false);
    jQuery('#st-newpage-duplicate-option-append').attr('checked', false);
    return this.newpage_duplicate_keyupHandler(event);
}

proto.newpage_duplicate_keyupHandler = function(event) {
    var key;

    if (window.event) {
        key = window.event.keyCode;
    }
    else if (event.which) {
        key = event.which;
    }

    // Return/Enter key
    if (key == 13) {
        this.newpage_duplicate_ok();
        return false;
    }
}

proto.newpage_display_duplicate_dialog = function(page_name) {
    jQuery('#st-newpage-duplicate-suggest')
        .text(Socialtext.username + ': ' + page_name);
    jQuery('#st-newpage-duplicate-appendname').text(page_name);

    jQuery('#st-newpage-duplicate-link')
        .text(page_name)
        .attr('href', '/' + Socialtext.wiki_id + '/index.cgi?' + page_name)
        .attr('target', page_name);
    
    jQuery('#st-newpage-duplicate-pagename').val(page_name);
    jQuery('#st-newpage-duplicate-option-different').attr('checked', true);
    jQuery('#st-newpage-duplicate-option-suggest').attr('checked', false);
    jQuery('#st-newpage-duplicate-option-append').attr('checked', false);
    jQuery('#st-newpage-duplicate').show();
    jQuery('#st-newpage-duplicate-pagename').trigger('focus');

    jQuery.showLightbox({
        content:'#st-newpage-duplicate-interface',
        close:'#st-newpage-duplicate-cancelbutton'
    });

    return false;
}

proto.newpage_save = function(page_name, pagename_editfield) {
    var saved = false;
    page_name = trim(page_name);

    if (page_name.length == 0) {
        alert(loc('You must specify a page name'));
        if (pagename_editfield) {
            pagename_editfield.focus();
        }
    }
    else if (is_reserved_pagename(page_name)) {
        alert(loc('"[_1]" is a reserved page name. Please use a different name', page_name));
        if (pagename_editfield) {
            pagename_editfield.focus();
        }
    }
    else if (encodeURIComponent(page_name).length > 255) {
        alert(loc('Page title is too long after URL encoding'));
        if (pagename_editfield) {
            pagename_editfield.focus();
        }
    }
    else {
        if (this.active_page_exists(page_name)) {
            jQuery.hideLightbox();
            setTimeout(function () {
                wikiwyg.newpage_display_duplicate_dialog(page_name)
            }, 1000);
        } else {
            jQuery('#st-page-editing-pagename').val(page_name);
            this.saveContent();
            saved = true;
        }
    }
    return saved;
}

proto.isOffline = function () {
    if (typeof navigator == 'object' && typeof navigator.onLine == 'boolean' && !navigator.onLine) {
        return true;
    }

    // WebKit's navigator.onLine is unreliable when VMWare or Parallels is
    // installed - https://bugs.webkit.org/show_bug.cgi?id=32327
    // Do a GET on blank.html to determine onlineness instead.
    var onLine = false;
    $.ajax({
        async: false,
        type: 'GET',
        url: '/static/html/blank.html?_=' + Math.random(),
        timeout: 10 * 1000,
        success: function(data) {
            onLine = data;
        }
    });
    return !onLine;
}

proto.saveContent = function() {
    if (jQuery('#st-save-button-link').is(':hidden')) {
        // Don't allow "Save" to be clicked while saving: {bz: 1718}
        return;
    }

    if (this.isOffline()) {
        alert(loc("The browser is currently offline; please connect to the internet and try again."));
        return;
    }

    jQuery("#st-edit-summary").hide();
    jQuery('#st-editing-tools-edit ul').hide();
    jQuery('<div id="saving-message" />')
        .html(loc('Saving...'))
        .css('color', 'red')
        .appendTo('#st-editing-tools-edit');

    var self = this;
    setTimeout(function(){
        self.saveChanges();
    }, 1);
}


proto.newpage_saveClicked = function() {
    var page_name = jQuery('#st-page-editing-pagename').val() || '';
    var focus_field = jQuery(
        '#st-page-editing-pagename:visible, #st-newpage-save-pagename:visible'
    );
    var saved = this.newpage_save(page_name, focus_field.get(0));
    if (saved) {
        jQuery.hideLightbox();
    }
    return saved;
}

proto.newpage_duplicate_ok = function() {
    // Ok - this is the suck. I am duplicating the radio buttons in the HTML form here
    // in the JavaScript code. Damn deadlines
    var options = ['different', 'suggest', 'append'];
    var option = jQuery('input[name=st-newpage-duplicate-option]:checked').val();
    if (!option) {
        alert(loc('You must select one of the options or click cancel'));
        return;
    }
    switch(option) {
        case 'different':
            var edit_field = jQuery('#st-newpage-duplicate-pagename');
            if (this.newpage_save(edit_field.val(), edit_field.get(0))) {
                jQuery.hideLightbox();
            }
            break;
        case 'suggest':
            var name = jQuery('#st-newpage-duplicate-suggest').text();
            if (this.newpage_save(name)) {
                jQuery.hideLightbox();
            }
            break;
        case 'append':
            jQuery('#st-page-editing-append').val('bottom');
            jQuery('#st-page-editing-pagename').val(
                jQuery('#st-newpage-duplicate-appendname').text()
            );
            jQuery.hideLightbox();
            this.saveContent();
            break;
    }
    return false;
}

proto.displayNewPageDialog = function() {
    jQuery('#st-newpage-save-pagename').val('');
    jQuery.showLightbox({
        content: '#st-newpage-save',
        close: '#st-newpage-save-cancelbutton',
        focus: '#st-newpage-save-pagename'
    });
    jQuery('#st-newpage-save-form').unbind('submit').submit( function () {
        jQuery('#st-page-editing-pagename').val(
            jQuery('#st-newpage-save-pagename').val()
        );
        wikiwyg.newpage_saveClicked();
        return false;
    });
    jQuery('#st-newpage-save-savebutton').unbind('click').click(function () {
        jQuery('#st-newpage-save-form').submit();
        return false;
    });
    return false;
}

proto.saveButtonHandler = function() {
    if (Socialtext.new_page) {
        this.saveNewPage();
    }
    else {
        this.saveContent();
    }

    return false;
}

proto.saveNewPage = function() {
    var new_page_name = jQuery('#st-newpage-pagename-edit').val();
    if (trim(new_page_name).length > 0 && ! is_reserved_pagename(new_page_name)) {
        if (this.active_page_exists(new_page_name)) {
            jQuery('#st-page-editing-pagename').val(new_page_name);
            return this.newpage_saveClicked();
        }
        else  {
            if (encodeURIComponent(new_page_name).length > 255) {
                alert(loc('Page title is too long after URL encoding'));
                this.displayNewPageDialog();
                return;
            }
            jQuery('#st-page-editing-pagename').val(new_page_name);
            this.saveContent();
        }
    }
    else {
        this.displayNewPageDialog();
    }
}

proto.saveChanges = function() {
    var self = this;
    self.disableLinkConfirmations();

    jQuery('#st-page-editing-summary')
        .val(this.edit_summary());
    var $signal_checkbox = jQuery('#st-edit-summary-signal-checkbox');
    jQuery('#st-page-editing-signal-summary')
        .val($signal_checkbox.length && ($signal_checkbox[0].checked ? '1' : '0'));
    jQuery('#st-page-editing-signal-to')
        .val( $('#st-edit-summary-signal-to').val() );

    var originalWikitext = self.originalWikitext;
    var on_error = function() {
        self.enableLinkConfirmations();
        self.originalWikitext = originalWikitext;
        jQuery("#st-edit-summary").show();
        jQuery('#st-editing-tools-edit ul').show();
        jQuery('#saving-message').remove();
    };
    var submit_changes = function(wikitext) {
        /*
        if ( Wikiwyg.is_safari ) {
            var e = $("content-edit-body");
            e.style.display = "block";
            e.style.height = "1px";
        }
        */

        var saver = function() {
            Socialtext.prepare_attachments_before_save();
            Socialtext.set_save_error_resume_handler(on_error);

            jQuery('#st-page-editing-pagebody').val(wikitext);
            jQuery('#st-page-editing-form').trigger('submit');
            return true;
        }

        // This timeout is so that safari's text box is ready
        setTimeout(function() { return saver() }, 1);

        return true;
    }

    // Safari just saves the wikitext, with no conversion.
    if (Wikiwyg.is_safari) {
        var wikitext_mode = this.modeByName(WW_ADVANCED_MODE);
        var wikitext = wikitext_mode.toWikitext();
        submit_changes(wikitext);
        return;
    }
    this.current_mode.toHtml(
        function(html) {
            var wikitext_mode = self.modeByName(WW_ADVANCED_MODE);
            wikitext_mode.convertHtmlToWikitext(
                html,
                function(wikitext) { submit_changes(wikitext) }
            );
        },
        on_error
    );
}

proto.confirmCancellation = function(msg) {
    return confirm(
        loc("[_1]\n\nYou have unsaved changes.\n\nPress OK to continue, or Cancel to stay on the current page.", msg)
    );

}

proto.confirmLinkFromEdit = function() {
    this.signal_edit_cancel();
    if (wikiwyg.contentIsModified()) {
        var msg = loc("Are you sure you want to navigate away from this page?");
        var response =  wikiwyg.confirmCancellation(msg);

        // wikiwyg.confirmed is for the situations when multiple confirmations
        // are considered. It store the value of this confirmation for
        // other handlers to check whether user has already confirmed
        // or not.
        wikiwyg.confirmed = response;

        if (response) {
            wikiwyg.disableLinkConfirmations();
        }
        return response;
    }
    return true;
}

proto.enableLinkConfirmations = function() {
    this.originalWikitext = Wikiwyg.is_safari
        ? this.mode_objects[WW_ADVANCED_MODE].getTextArea()
        : this.get_wikitext_from_html(this.div.innerHTML);

    wikiwyg.confirmed = false;

    window.onbeforeunload = function(ev) {
        if (Wikiwyg.is_selenium) {
            /* Selenium cannot handle .onbeforeunload, so simply let the
             * browser unload the window because there's no way to force
             * "Cancel" from within Javascript.
             */
            return undefined;
        }

        var msg = loc("You have unsaved changes.");
        if (!ev) ev = window.event;
        if ( wikiwyg.confirmed != true && wikiwyg.contentIsModified() ) {
            if (Wikiwyg.is_safari) {
                return msg;
            }
            ev.returnValue = msg;
        }
    }

    var self = this;
    window.onunload = function(ev) {
        self.signal_edit_cancel();
        Socialtext.discardDraft('edit_cancel');
        Attachments.delete_new_attachments();
    }

    /* Handle the Home link explicitly instead of relying on
     * window.onbeforeunload, so Selenium can test it.
     */
    jQuery('#st-home-link').click(function(){
        return self.confirmLinkFromEdit();
    });
 
    return false;
}

proto.signal_edit_cancel = function() {
    jQuery.ajax({
        type: 'POST',
        url: location.pathname,
        data: {
            action: 'edit_cancel',
            page_name: Socialtext.wikiwyg_variables.page.title,
            revision_id: Socialtext.wikiwyg_variables.page.revision_id
        }
    });
}

proto.disableLinkConfirmations = function() {
    this.originalWikitext = null;
    window.onbeforeunload = null;
    window.onunload = null;

    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        if (links[i].onclick == this.confirmLinkFromEdit)
            links[i].onclick = null;
    }

    // Disable the Home confirmLinkFromEdit trigger explicitly. -- {bz: 1735}
    jQuery('#st-home-link').unbind('click');
}

proto.contentIsModified = function() {
    if (this.originalWikitext == null) {
        return true;
    }

    var current_wikitext = this.get_current_wikitext();

    /* The initial clearing of "Replace this text with your own." shouldn't
     * count as modification -- {bz: 2232} */
    var clearRegex = this.modeByName(WW_ADVANCED_MODE).config.clearRegex;
    if (this.originalWikitext.match(clearRegex) && current_wikitext.match(/^\n?$/)) {
        return false;
    }
    return (current_wikitext != this.originalWikitext);
}

proto.diffContent = function () {
    if (this.originalWikitext == null) {
        jQuery.showLightbox('There is no originalWikitext');
    }
    else if (this.contentIsModified()) {
        var current_wikitext = this.get_current_wikitext();
        jQuery.ajax({
            type: 'POST',
            url: location.pathname,
            data: {
                action: 'wikiwyg_diff',
                text1: this.originalWikitext,
                text2: current_wikitext
            },
            success: function (data) {
                jQuery.showLightbox({
                    html: '<pre style="font-family:Courier">'+data+'</pre>',
                    width: '95%'
                });
            }
        });
    }
    else {
        jQuery.showLightbox("Content is not modified");
    }
    return void(0);
}

proto.get_current_wikitext = function() {
    if (!this.current_mode) return;
    if (this.current_mode.classname.match(/Wikitext/))
        return this.current_mode.toWikitext();
    var html = (this.current_mode.classname.match(/Wysiwyg/))
        ? this.current_mode.get_inner_html()
        : this.current_mode.div.innerHTML;
    return this.get_wikitext_from_html(html);
}

proto.get_wikitext_from_html = function(html) {
    // {bz: 1985}: Need the "true" below for the isWholeDocument flag.
    return eval(WW_ADVANCED_MODE).prototype.convert_html_to_wikitext(html, true);
}

proto.set_edit_tips_span_display = function() {
    jQuery('#st-edit-tips')
        .unbind('click')
        .click(function () {
            jQuery.showLightbox({
                content: '#st-ref-card',
                close: '#st-ref-card-close'
            });
            return false;
        });
}

proto.editMode = function() {
    if (Socialtext.page_type == 'spreadsheet') return;

    this.hideScrollbars();
    this.current_mode = this.first_mode;
    this.current_mode.fromHtml(this.div.innerHTML);
    if (!this.config.noToolbar) this.toolbarObject.resetModeSelector();
    this.current_mode.enableThis();
}

// Class level helper methods
Wikiwyg.unique_id_base = 0;
Wikiwyg.createUniqueId = function() {
    return 'wikiwyg_' + Wikiwyg.unique_id_base++;
}

// This method is deprecated. Use Ajax.get and Ajax.post.
Wikiwyg.liveUpdate = function(method, url, query, callback) {
    if (method == 'GET') {
        return Ajax.get(
            url + '?' + query,
            callback
        );
    }
    if (method == 'POST') {
        return Ajax.post(
            url,
            query,
            callback
        );
    }
    throw("Bad method: " + method + " passed to Wikiwyg.liveUpdate");
}

Wikiwyg.htmlEscape = function(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/"/g,"&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}

Wikiwyg.htmlUnescape = function(escaped) {
    var _NewlineReplacementCharacter_ = String.fromCharCode(0xFFFC);
    return jQuery(
        "<div>" + 
        escaped.replace(/</g, '&lt;')
               .replace(/ /g, '&#160;')
               .replace(/\r?\n/g, _NewlineReplacementCharacter_) +
        "</div>"
    ).text().replace(/\xA0/g, ' ')
            .replace(new RegExp(_NewlineReplacementCharacter_, 'g'), '\n');
}

Wikiwyg.showById = function(id) {
    document.getElementById(id).style.visibility = 'inherit';
}

Wikiwyg.hideById = function(id) {
    document.getElementById(id).style.visibility = 'hidden';
}


Wikiwyg.changeLinksMatching = function(attribute, pattern, func) {
    var links = document.getElementsByTagName('a');
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        var my_attribute = link.getAttribute(attribute);
        if (my_attribute && my_attribute.match(pattern)) {
            link.setAttribute('href', '#');
            link.onclick = func;
        }
    }
}

Wikiwyg.createElementWithAttrs = function(element, attrs, doc) {
    if (doc == null)
        doc = document;
    return Wikiwyg.create_element_with_attrs(element, attrs, doc);
}

Wikiwyg.create_element_with_attrs = function(element, attrs, doc) {
    var elem = doc.createElement(element);
    for (name in attrs)
        elem.setAttribute(name, attrs[name]);
    return elem;
}

this.addGlobal().die = function(e) { // See IE, below
    throw(e);
}

String.prototype.times = function(n) {
    return n ? this + this.times(n-1) : "";
}

Wikiwyg.is_old_firefox = (
    Wikiwyg.ua.indexOf('firefox/1.0.7') != -1 &&
    Wikiwyg.ua.indexOf('safari') == -1 &&
    Wikiwyg.ua.indexOf('konqueror') == -1
);

Wikiwyg.is_safari2 = (
    Wikiwyg.is_safari &&
    Wikiwyg.ua.indexOf("version/2") != -1
);

Wikiwyg.is_safari3 = (
    Wikiwyg.is_safari &&
    Wikiwyg.ua.indexOf("version/3") != -1
);

Wikiwyg.is_safari_unknown = (
    Wikiwyg.is_safari &&
    Wikiwyg.ua.indexOf("version/") == -1
);

this.addGlobal().setup_wikiwyg = function() {
    if (! Wikiwyg.browserIsSupported) return;

    if ( jQuery("#st-edit-mode-container").size() != 1 ||
         jQuery("iframe#st-page-editing-wysiwyg").size() != 1 ) {
        Socialtext.wikiwyg_variables.loc = loc;
        var template = 'edit_wikiwyg';
        var html = Jemplate.process(template, Socialtext.wikiwyg_variables);

        if (Wikiwyg.is_gecko || (jQuery.browser.version == 6 && jQuery.browser.msie)) {
            html = html.replace(/scrolling="no"><\/iframe>/, "></iframe>");
        }

        jQuery(html).insertBefore('#st-display-mode-container');

        if (!Socialtext.wikiwyg_variables.hub.current_workspace.enable_spreadsheet) {
            jQuery('a[do="do_widget_ss"]').parent("li").remove()
        }

        if (Wikiwyg.is_gecko) {
            jQuery("iframe#st-page-editing-wysiwyg").attr("scrolling", "auto");
        }

        if (Socialtext.show_signal_network_dropdown) {
            Socialtext.show_signal_network_dropdown();
        }
    }

    // The div that holds the page HTML
    var myDiv = jQuery('#wikiwyg-page-content').get(0);
    if (! myDiv)
        return false;
    if (window.wikiwyg_nlw_debug)
        Wikiwyg.prototype.modeClasses.push(WW_HTML_MODE);

    // Get the "opening" mode from a cookie, or reasonable default
    var firstMode = Cookie.get('first_wikiwyg_mode')
    if (firstMode == null ||
        (firstMode != WW_SIMPLE_MODE && firstMode != WW_ADVANCED_MODE)
    ) firstMode = WW_SIMPLE_MODE;

    if ( Wikiwyg.is_safari ) firstMode = WW_ADVANCED_MODE;

    var clearRichText = new RegExp(
        ( "^"
        + "\\s*(</?(span|br|div)\\b[^>]*>\\s*)*"
        + loc("Replace this text with your own.")
        + "\\s*(</?(span|br|div)\\b[^>]*>\\s*)*"
        + "$"
        ), "i"
    );

    var clearWikiText = new RegExp(
        "^" + loc("Replace this text with your own.") + "\\s*$"
    );

    // Wikiwyg configuration
    var myConfig = {
        doubleClickToEdit: false,
        firstMode: firstMode,
        javascriptLocation: nlw_make_s2_path('/javascript/'),
        toolbar: {
            imagesLocation: nlw_make_s2_path('/images/wikiwyg_icons/')
        },
        wysiwyg: {
            clearRegex: clearRichText,
            iframeId: 'st-page-editing-wysiwyg',
            editHeightMinimum: 200,
            editHeightAdjustment: 1.3
        },
        wikitext: {
            clearRegex: clearWikiText,
            textareaId: 'st-page-editing-pagebody-decoy'
        },
        preview: {
            divId: 'st-page-preview'
        }
    };

    // The Wikiwyg object must be stored as a global (aka window property)
    // so that it stays in scope for the duration of the window. The Wikiwyg
    // code should not make reference to the global wikiwyg variable, though,
    // since that breaks encapsulation. (It's an easy trap to fall into.)
    var ww = new Wikiwyg();
    window.wikiwyg = ww;

    ww.createWikiwygArea(myDiv, myConfig);
    if (! ww.enabled) return;

    ww.message = new Wikiwyg.MessageCenter();

    // For example, because of a unregistered user on a self-register space:
    if (!jQuery('#st-editing-tools-edit').size() ||
        !jQuery('#st-edit-button-link').size())
        throw new Error('Unauthorized');

    ww.wikitext_link = jQuery('#st-mode-wikitext-button').get(0);

    Wikiwyg.setup_newpage();

    ww.starting_edit = false;

    ww.cancel_nlw_wikiwyg = function () {
        ww.confirmed = true;
        Socialtext.discardDraft('edit_cancel');
        Attachments.delete_new_attachments();
        if (Socialtext.new_page) {
            window.location = '?action=homepage';
        }
        else if (location.href.match(/caller_action=blog_display;?/)) {
            location.href = 'index.cgi?action=blog_redirect;start=' +
                encodeURIComponent(location.href);
            return false;
        }
        else if (jQuery.browser.msie) {
            // Cheap-and-cheerful-but-not-fun workaround for {bz: 1261}.
            // XXX TODO XXX - Implement a proper fix!
            window.location.reload();
        }

        jQuery("#st-edit-mode-container").hide();
        jQuery("#st-display-mode-container, #st-all-footers").show();

        ww.cancelEdit();
        ww.preview_link_reset();
        jQuery("#st-pagetools, #st-editing-tools-display").show();
        jQuery("#st-editing-tools-edit").hide();
        jQuery("#st-page-maincontent").css('margin-right', '0px');

        if (Page.element && Page.element.content) {
            jQuery(Page.element.content).css("height", "100%");
        }

        // XXX WTF? ENOFUNCTION
        //do_post_cancel_tidying();
        ww.disableLinkConfirmations();

        ww.is_editing = false;
        ww.showScrollbars();

        jQuery('#st-edit-summary-text-area, #st-edit-summary-signal-to').val('');
        jQuery('#st-edit-summary-signal-checkbox').attr('checked', false);

        Socialtext.ui_expand_off();
    };

    ww.start_nlw_wikiwyg = function() {
        if (Socialtext.page_type == 'spreadsheet') return;

        if (ww.starting_edit) {
            return;
        }

        // Check for any pre edit hooks. If we have 'em, let them decide
        // whether or not we launch wikiwyg. Do this so that we can make any
        // async web calls we need to in order to make that determination.
        if ( Socialtext.pre_edit_hook ) {
            Socialtext.pre_edit_hook( ww._really_start_nlw_wikiwyg, ww.cancel_nlw_wikiwyg );
        }
        else {
            ww._really_start_nlw_wikiwyg();
        }
    }

    ww._really_start_nlw_wikiwyg = function() {
        ww.starting_edit = true;

        try {
            // if `Cancel` and then `Edit` buttons are clicked, we need
            // to set a timer to prevent the edit summary box from displaying
            // immediately
            ok_to_show_summary = false;
            setTimeout(function() { ok_to_show_summary = true }, 2000);

            if (Wikiwyg.is_safari) {
                delete ww.current_wikitext;
                jQuery('#wikiwyg_button_table-settings').addClass("disabled");

                // To fix the tab focus order, remove the (unused) iframes.
                jQuery("#st-page-editing-wysiwyg, #pastebin").remove();
            }
            if (Wikiwyg.is_safari || Wikiwyg.is_old_firefox) {
                jQuery("#st-page-editing-uploadbutton").hide();
            }
            
            jQuery("#st-all-footers").hide();

            jQuery("#st-display-mode-container").hide();

            // See the comment about "two seconds" below
            if (firstMode == WW_SIMPLE_MODE) {
                jQuery("#st-editing-tools-edit .editModeSwitcher a").hide();
            }

            jQuery("#st-editing-tools-edit, #wikiwyg_toolbar").show();
            jQuery("#st-edit-mode-container").show();

            if (jQuery("#contentRight").is(":visible"))
                jQuery("#st-page-maincontent").css("margin-right", "240px");
 
            if (!Socialtext.new_page)
                Page.refreshPageContent();

            Attachments.reset_new_attachments();

            Socialtext.maybeLoadDraft(function(draft) {
                ww.modeByName(WW_ADVANCED_MODE).convertWikitextToHtml(
                    draft.content,
                    function(new_html) {
                        Page.html = new_html;
                    }
                );
            });

            Socialtext.startAutoSave(function(){
                if (!ww.contentIsModified()) { return; }
                return ww.get_current_wikitext();
            });

// We used to use this line:
//          myDiv.innerHTML = $('st-page-content').innerHTML;
// But IE likes to take our non XHTML formatted lists and make them XHTML.
// That messes up the wikiwyg formatter. So now we do this line:
            myDiv.innerHTML =
                // This lines fixes
                // https://bugs.socialtext.net:555/show_bug.cgi?id=540
                "<span></span>" +
                (Page.html
                // And the variable above is undefined for new pages. This is
                // what we fallback to.
                || jQuery('#st-page-content').html());

            ww.editMode();
            ww.preview_link_reset();
            jQuery("#st-pagetools").hide();
            jQuery("#st-editing-tools-display").hide();

            nlw_edit_controls_visible = true;

            if (Socialtext.page_type == 'wiki') {
                ww.enableLinkConfirmations();
            }

            ww.is_editing = true;

            if (Wikiwyg.is_safari) {
                ww.message.display({
                    title: loc("Socialtext has limited editing capabilities in Safari."),
                    body: loc("<a target=\"_blank\" href=\"http://www.mozilla.com/firefox/\">Download Firefox</a> for richer Socialtext editing functionality.")
                });
            }

            if (firstMode == WW_SIMPLE_MODE) {
                // Give the browser two seconds to render the initial iframe.
                // If we don't do this, click on "Wiki text" prematurely will
                // hang the editor up.  Humans usually take more than 1000ms
                // to find the link anyway, but Selenium can trigger this bug
                // quite regularly given a high enough latency to the server.
                setTimeout( function() {
                    jQuery("#st-editing-tools-edit .editModeSwitcher a").show();
                    ww.set_edit_tips_span_display();
                }, 2000 );
            }

            if (Socialtext.ui_expand_setup) {
                Socialtext.ui_expand_setup();
            }

            jQuery(window).trigger("resize");

            ww.starting_edit = false;
        } catch(e) {
            ww.starting_edit = false;
            throw(e);
        };

        return false;
    }

    jQuery(window).bind("resize", function () {
        ww.resizeEditor();
    });
 
    jQuery('#st-edit-button-link').click(ww.start_nlw_wikiwyg);
    jQuery("#st-edit-actions-below-fold-edit").click(ww.start_nlw_wikiwyg);

    if (Socialtext.double_click_to_edit) {
        jQuery("#st-page-content").bind("dblclick", ww.start_nlw_wikiwyg);
    }

    if (!Socialtext.new_page) {
        setTimeout(function() {
            if (Socialtext.page_type == 'spreadsheet') return;
            jQuery('#st-save-button-link').click(function() {
                ww.is_editing = false;
                ww.showScrollbars();
                ww.saveButtonHandler();
                return false;
            });
        }, 200);
    }

    // node handles
    jQuery('#st-cancel-button-link').click(function() {
        if (Socialtext.page_type == 'spreadsheet') return;
        ww.signal_edit_cancel();
        try {
            if (ww.contentIsModified()) {
                // If it's not confirmed somewhere else, do it right here.
                if (ww.confirmed != true && !ww.confirmCancellation(loc("Are you sure you want to cancel?") ))
                    return false;
            }

            ww.cancel_nlw_wikiwyg();

        } catch(e) {}
        return false;
    });

    // Begin - Edit Summary Logic
    jQuery("#st-edit-summary .field input").each(function() {
        var $self = jQuery(this);
        var label = $self.prev("label").text();

        $self
        .val("")
        .addClass("default")
        .bind("focus", function() {
            $self.addClass("focus");
        })
        .bind("blur", function() {
            $self.removeClass("focus");
            if( $self.val() == "" )
                $self.addClass("default");
            else
                $self.removeClass("default");
        });
    });

    var ok_to_show_summary = false;

    ww.update_edit_summary_preview = function () {
        if (jQuery('#st-edit-summary .preview').is(':hidden')) return true;
        setTimeout(function () {
            var page = Socialtext.page_title;
            var workspace = Socialtext.wiki_title;
            var name = Socialtext.username;

            var summary = ww.edit_summary();
            summary = ww.word_truncate(summary, 140);
            var html = ' <strong>' + name + '</strong>';
            if (!summary)
                html += ' ' + loc('wants you to know about an edit of') + ' <strong>' + page + '</strong> ' + loc('in') + ' ' + workspace;
            else
                html += ', ' + loc('"[_1]"', summary) + ' (' + loc('edited') + ' <strong>' + page + '</strong> ' + loc('in') + ' ' + workspace + ')';

            jQuery('#st-edit-summary .preview .text')
                .html(html);
        }, 5);
        return true;
    }

    jQuery('#st-edit-summary .input')
        .change(ww.update_edit_summary_preview)
        .keydown(ww.update_edit_summary_preview)
        .click(ww.update_edit_summary_preview);

    /***
     * For {bz: 2088}: Using our default text display, we can fit
     * about 44 "M" chars, the widest displaying character, in a line
     * of preview text. Let's add a <wbr> tag to let the browser wrap
     * if it wants to.
     ***/
    ww.force_break = function (str) {
        return str.replace(/(.{44})/g, '$1<wbr>');
    }

    ww.word_truncate = function (s, len) {
        if (!s || !len) return '';
        if (s.length <= len) return ww.force_break(s);

        var truncated = "";
        var parts = s.split(' ');
        if (parts.length == 1) {
            truncated = s.slice(0, len);
        }
        else {
            for (var i=0,l=parts.length; i < l; i++) {
                if ((truncated.length + parts[i].length) > len) break;
                truncated += parts[i] + ' ';
            }
            // if the first part is really huge we won't have any parts in
            // truncated so we will slice the first part
            if (truncated.length == 0) {
                truncated = parts[0].slice(0, len);
            }
        }
        truncated = ww.force_break(truncated);
        return truncated.replace(/ +$/, '') + '&hellip;';
    }

    ww.edit_summary = function () {
        var $input = jQuery('#st-edit-summary .input');
        if ($input.size() == 0) return '';

        var val = $input.val()
            .replace(/\s+/g, ' ')
            .replace(/^\s*(.*?)\s*$/, '$1');
        return val;
    }

    jQuery('#st-edit-summary form')
        .unbind('submit')
        .submit(function () {
            jQuery('#st-save-button-link').click();
            return false;    
        });

    jQuery("body").mousedown(function(e) {
        if ( jQuery(e.target).parents("#st-edit-summary").size() > 0 ) return;
        if ( jQuery(e.target).is("#st-edit-summary") ) return;
    });

    jQuery('#st-preview-button-link')
        .unbind('click')
        .click(function () {
            ww.preview_link_action();
            return false;
        });

    if (window.wikiwyg_nlw_debug) {
        jQuery('#edit-wikiwyg-html-link').click( function() {
            ww.switchMode(WW_HTML_MODE);
            return false;
        })
    }

    jQuery('#st-mode-wysiwyg-button').click(function () {
        ww.button_enabled_func(WW_SIMPLE_MODE)();
        return false;
    });

    // Disable Rich Text button for Safari browser.
    if ( Wikiwyg.is_safari )  {
        jQuery('#st-mode-wysiwyg-button')
            .css("text-decoration", "line-through")
            .unbind("click")
            .bind("click", function() {
                alert(loc("Safari does not support Rich Text editing"));
                return false;
            });
    }

    jQuery('#st-mode-wikitext-button').click(function() {
        ww.button_enabled_func(WW_ADVANCED_MODE)();
        return false;
    });

    jQuery('#st-edit-mode-tagbutton').click(function() {
        jQuery.showLightbox({
            content:'#st-tagqueue-interface',
            close:'#st-tagqueue-close',
            focus:'#st-tagqueue-field'
        });
        return false;
    });

    jQuery('#st-tagqueue-field')
        .lookahead({
            submitOnClick: true,
            url: '/data/workspaces/' + Socialtext.wiki_id + '/tags',
            linkText: function (i) {
                return [i.name, i.name];
            }
        });

    var add_tag = function() {
        var input_field = jQuery('#st-tagqueue-field');
        var tag = input_field.val();
        if (tag == '') return false;
        input_field.val('');

        var skip = false;
        jQuery('.st-tagqueue-taglist-name').each(function (index, element) {
            var text = jQuery(element).text();
            text = text.replace(/^, /, '');
            if ( tag == text ) {
                skip = true;
            }
        });

        if ( skip ) { return false; }

        Socialtext.addNewTag(tag);

       return false;
    };

    jQuery('#st-tagqueue').submit(add_tag);

    jQuery('#st-edit-mode-uploadbutton').click(function () {
        Attachments.showUploadInterface();
        $('#st-attachments-attach-editmode').val(1);
        return false;
    });

    ww.modeButtonMap = bmap = {};
    bmap[WW_SIMPLE_MODE] = jQuery('#st-mode-wysiwyg-button').get(0);
    bmap[WW_ADVANCED_MODE] = jQuery('#st-mode-wikitext-button').get(0);
    bmap[WW_PREVIEW_MODE] = jQuery('#st-preview-button-link').get(0);
    bmap[WW_HTML_MODE] = jQuery('#edit-wikiwyg-html-link').get(0);
}

Wikiwyg.setup_newpage = function() {
    if (Socialtext.new_page) {
        jQuery('#st-save-button-link').click(function () {
            wikiwyg.saveNewPage();
            return false;
        });

        jQuery('#st-newpage-duplicate-okbutton').click(function () {
            wikiwyg.newpage_duplicate_ok();
            return false;
        });

        jQuery('#st-newpage-duplicate-cancelbutton').click(function () {
            jQuery.hideLightbox();
            return false;
        });

        // XXX Observe
        jQuery('#st-newpage-duplicate-pagename').bind('keyup', 
            function(event) {
                wikiwyg.newpage_duplicate_pagename_keyupHandler(event);
            }
        );
        jQuery('#st-newpage-duplicate-option-different').bind('keyup',
            function(event) {
                wikiwyg.newpage_duplicate_keyupHandler(event);
            }
        );
        jQuery('#st-newpage-duplicate-option-suggest').bind('keyup',
            function(event) {
                wikiwyg.newpage_duplicate_keyupHandler(event);
            }
        );
        jQuery('#st-newpage-duplicate-option-append').bind('keyup',
            function(event) {
                wikiwyg.newpage_duplicate_keyupHandler(event);
            }
        );
    }
}

});

/*==============================================================================
Base class for Wikiwyg classes
 =============================================================================*/
Class('Wikiwyg.Base', function() {

var proto = this.prototype;

// Fix {bz: 2339} 'this.init is not a function'
proto.init = function () {}

proto.set_config = function(user_config) {
    if (Wikiwyg.Widgets && this.setup_widgets)
        this.setup_widgets();

    for (var key in this.config) {
        if (user_config != null && user_config[key] != null)
            this.merge_config(key, user_config[key]);
        else if (this[key] != null)
            this.merge_config(key, this[key]);
        else if (this.wikiwyg.config[key] != null)
            this.merge_config(key, this.wikiwyg.config[key]);
    }
}

proto.merge_config = function(key, value) {
    if (value instanceof Array || value instanceof Function) {
        this.config[key] = value;
    }
    // cross-browser RegExp object check
    else if (typeof value.test == 'function') {
        this.config[key] = value;
    }
    else if (value instanceof Object) {
        if (!this.config[key])
            this.config[key] = {};
        for (var subkey in value) {
            this.config[key][subkey] = value[subkey];
        }
    }
    else {
        this.config[key] = value;
    }
}

});

/*==============================================================================
Base class for Wikiwyg Mode classes
 =============================================================================*/
Class('Wikiwyg.Mode(Wikiwyg.Base)', function() {

var proto = this.prototype;

// Fix {bz: 2339} 'this.init is not a function'
proto.init = function() {}

// Turns HTML into Wikitext, then to HTML again
proto.toNormalizedHtml = function(cb) {
    var self = this;
    self.toHtml(function(html){
        var wikitext_mode = self.wikiwyg.modeByName('Wikiwyg.Wikitext');
        wikitext_mode.convertHtmlToWikitext(
            html,
            function(wikitext) {
                wikitext_mode.convertWikitextToHtml(
                    wikitext,
                    function(new_html) {
                        cb(new_html);
                    }
                );
            }
        );
    });
}

proto.enableThis = function() {
    this.div.style.display = 'block';
    this.display_unsupported_toolbar_buttons('none');
    if (!this.wikiwyg.config.noToolbar)
        this.wikiwyg.toolbarObject.enableThis();
    this.wikiwyg.div.style.display = 'none';
}

proto.display_unsupported_toolbar_buttons = function(display) {
    if (!this.config) return;
    var disabled = this.config.disabledToolbarButtons;
    if (!disabled || disabled.length < 1) return;

    if (this.wikiwyg.config.noToolbar) return;

    var toolbar_div = this.wikiwyg.toolbarObject.div;
    var toolbar_buttons = toolbar_div.childNodes;
    for (var i in disabled) {
        var action = disabled[i];

        for (var i in toolbar_buttons) {
            var button = toolbar_buttons[i];
            var src = button.src;
            if (!src) continue;

            if (src.match(action)) {
                button.style.display = display;
                break;
            }
        }
    }
}

proto.disableStarted = function() {}
proto.disableFinished = function() {}

proto.disableThis = function() {
    this.display_unsupported_toolbar_buttons('inline');
    this.div.style.display = 'none';
}

proto.process_command = function(command) {
    if (this['do_' + command])
        this['do_' + command](command);
}

proto.enable_keybindings = function() { // See IE
    if (!this.key_press_function) {
        this.key_press_function = this.get_key_press_function();
        this.get_keybinding_area().addEventListener(
            'keypress', this.key_press_function, true
        );
    }
}

proto.get_key_press_function = function() {
    var self = this;
    return function(e) {
        if (! e.ctrlKey) return;
        var key = String.fromCharCode(e.charCode).toLowerCase();
        var command = '';
        switch (key) {
            case 'b': command = 'bold'; break;
            case 'i': command = 'italic'; break;
            case 'u': command = 'underline'; break;
            case 'd': command = 'strike'; break;
            case 'l': command = 'link'; break;
        };

        if (command) {
            e.preventDefault();
            e.stopPropagation();
            self.process_command(command);
        }
    };
}

proto.setHeightOf = function(elem) {
    elem.height = this.get_edit_height() + 'px';
}

proto.sanitize_dom = function(dom) { // See IE, below
    this.element_transforms(dom, {
        del: {
            name: 'strike',
            attr: { }
        },
        strong: {
            name: 'span',
            attr: { style: 'font-weight: bold;' }
        },
        em: {
            name: 'span',
            attr: { style: 'font-style: italic;' }
        }
    });
}

proto.element_transforms = function(dom, el_transforms) {
    for (var orig in el_transforms) {
        var elems = dom.getElementsByTagName(orig);
        var elems_arr = [];
        for (var ii = 0; ii < elems.length; ii++) {
            elems_arr.push(elems[ii])
        }

        while ( elems_arr.length > 0 ) {
            var elem = elems_arr.shift();
            var replace = el_transforms[orig];
            var new_el =
              Wikiwyg.createElementWithAttrs(replace.name, replace.attr);
            new_el.innerHTML = elem.innerHTML;
            elem.parentNode.replaceChild(new_el, elem);
        }
    }
}

/*==============================================================================
Support for Internet Explorer in Wikiwyg
 =============================================================================*/
if (Wikiwyg.is_ie) {

die = function(e) {
    alert(e);
    throw(e);
}

proto = Wikiwyg.Mode.prototype;

proto.enable_keybindings = function() {}

proto.sanitize_dom = function(dom) {
    this.element_transforms(dom, {
        del: {
            name: 'strike',
            attr: { }
        }
    });
}

} // end of global if statement for IE overrides

/*==============================================================================
Mode class generic overrides.
 =============================================================================*/

// magic constant to make sure edit window does not scroll off page
proto.footer_offset = Wikiwyg.is_ie ? 0 : 20;

proto.get_offset_top = function (e) {
    var offset = jQuery(e).offset();
    return offset.top;
}

proto.get_edit_height = function() {
    var available_height = jQuery(window).height();

    var edit_height = this.wikiwyg.config.editHeight;
    if (!edit_height) {
        edit_height = available_height -
                      this.get_offset_top(this.div) -
                      this.footer_offset;

        if (!this.wikiwyg.config.noToolbar) {
            /* Substract the edit area's height by toolbar's height. */
            edit_height -= this.wikiwyg.toolbarObject.div.offsetHeight;
        }
        if (edit_height < 100) edit_height = 100;
    }

    return edit_height;
}

proto.enableStarted = function() {
    jQuery('#st-editing-tools-edit ul').hide();
    jQuery('<div id="loading-message" />')
        .html(loc('Loading...'))
        .appendTo('#st-editing-tools-edit');
    this.wikiwyg.disable_button(this.classname);
    this.wikiwyg.enable_button(this.wikiwyg.current_mode.classname);
}

proto.enableFinished = function() {
    jQuery('#loading-message').remove();
    jQuery('#st-editing-tools-edit ul').show();
}

var WW_ERROR_TABLE_SPEC_BAD =
    loc("That doesn't appear to be a valid number.");
var WW_ERROR_TABLE_SPEC_HAS_ZERO =
    loc("Can't have a 0 for a size.");
proto.parse_input_as_table_spec = function(input) {
    var match = input.match(/^\s*(\d+)(?:\s*x\s*(\d+))?\s*$/i);
    if (match == null)
        return [ false, WW_ERROR_TABLE_SPEC_BAD ];
    var one = match[1], two = match[2];
    function tooSmall(x) { return x.match(/^0+$/) ? true : false };
    if (two == null) two = ''; // IE hack
    if (tooSmall(one) || (two && tooSmall(two)))
        return [ false, WW_ERROR_TABLE_SPEC_HAS_ZERO ];
    return [ true, one, two ];
}

proto.prompt_for_table_dimensions = function() {
    var rows, columns;
    var errorText = '';
    var promptTextMessageForRows = loc('Please enter the number of table rows:');
    var promptTextMessageForColumns = loc('Please enter the number of table columns:');
    
    while (!(rows && columns)) {
        var promptText;

        if(rows) {
           promptText = promptTextMessageForColumns;
        } else {
           promptText = promptTextMessageForRows;
        }

        if (errorText)
            promptText = errorText + "\n" + promptText;

        errorText = null;

        var answer = prompt(promptText, '3');
        if (!answer)
            return null;
        var result = this.parse_input_as_table_spec(answer);
        if (! result[0]) {
            errorText = result[1];
        }
         else if (! rows || result[2]) {
            rows = result[1];
            columns = result[2];
        }
        else {
            columns = result[1];
        }

        if (rows && rows > 100) {
            errorText = loc('Rows is too big. 100 maximum.');
            rows = null;
        }
        if (columns && columns > 35) {
            errorText = loc('Columns is too big. 35 maximum.');
            columns = null;
        }
    }
    return [ rows, columns ];
}

proto._do_link = function(widget_element) {
    var self = this;

    if (!jQuery('#st-widget-link-dialog').size()) {
        Socialtext.wikiwyg_variables.loc = loc;
        jQuery('body').append(
            Jemplate.process("add-a-link.html", Socialtext.wikiwyg_variables)
        );
    }

    var selection = this.get_selection_text();
    if (!widget_element || !widget_element.nodeName ) {
        widget_element = false;
    }

    var dummy_widget = {'title_and_id': { 'workspace_id': {'id': "", 'title': ""}}};
    if (widget_element) {
        var widget = this.parseWidgetElement(widget_element);
        if (widget.section_name && !widget.label && !widget.workspace_id && !widget.page_title) {
            // pre-populate the section link section
            jQuery("#section-link-text").val(widget.section_name);
            jQuery("#add-section-link").attr('checked', true);
        }
        else { 
            // Pre-populate the wiki link section
            jQuery("#wiki-link-text").val(widget.label || "");

            var ws_id    = widget.workspace_id || "";
            var ws_title = this.lookupTitle( "workspace_id", ws_id );
            dummy_widget.title_and_id.workspace_id.id    = ws_id;
            dummy_widget.title_and_id.workspace_id.title = ws_title || "";
            jQuery("#st-widget-workspace_id").val(ws_id || "");

            jQuery("#st-widget-page_title").val(widget.page_title || "");
            jQuery("#wiki-link-section").val(widget.section_name || "");
        }
    }
    else if (selection) {
        jQuery('#st-widget-page_title').val(selection);
        jQuery('#web-link-text').val(selection);
    }

    if (! jQuery("#st-widget-page_title").val() ) {
        jQuery('#st-widget-page_title').val(Socialtext.page_title || "");
    }

    var ws = jQuery('#st-widget-workspace_id').val() || Socialtext.wiki_id;
    jQuery('#st-widget-page_title')
        .lookahead({
            url: function () {
                var ws = jQuery('#st-widget-workspace_id').val() || Socialtext.wiki_id;
                return '/data/workspaces/' + ws + '/pages';
            },
            params: { minimal_pages: 1 },
            linkText: function (i) { return i.name },
            onError: {
                404: function () {
                    var ws = jQuery('#st-widget-workspace_id').val() ||
                             Socialtext.wiki_id;
                    return(loc('Workspace "[_1]" does not exist on wiki', ws));
                }
            }
        });

    jQuery('#st-widget-workspace_id')
        .lookahead({
            filterName: 'title_filter',
            url: '/data/workspaces',
            linkText: function (i) {
                return [ i.title + ' (' + i.name + ')', i.name ];
            },
            onAccept: function(ws_id, value) {
                dummy_widget.title_and_id.workspace_id.id = ws_id;
                var ws_title = self.lookupTitle( "workspace_id", ws_id );
                dummy_widget.title_and_id.workspace_id.title = ws_title || "";
            }
        });

    jQuery('#add-a-link-form')
        .unbind('reset')
        .unbind('submit')
        .bind('reset', function() {
            jQuery.hideLightbox();
            Wikiwyg.Widgets.widget_editing = 0;
            return false;
        })
        .submit(function() {
            if (jQuery.browser.msie)
                jQuery("<input type='text' />").appendTo('body').focus().remove();

            if (jQuery('#add-wiki-link').is(':checked')) {
                if (!self.add_wiki_link(widget_element, dummy_widget)) return false;
            }
            else if (jQuery('#add-section-link').is(':checked')) {
                if (!self.add_section_link(widget_element)) return false;
            }
            else {
                if (!self.add_web_link()) return false;
            }

            var close = function() {
                jQuery.hideLightbox();
                Wikiwyg.Widgets.widget_editing = 0;
            }

            if (jQuery.browser.msie)
                setTimeout(close, 50);
            else
                close();

            return false;
        });

    jQuery('#add-a-link-error').hide();

    jQuery.showLightbox({
        content: '#st-widget-link-dialog',
        close: '#st-widget-link-cancelbutton'
    })

    var self = this;

    // Set the unload handle explicitly so when user clicks the overlay gray
    // area to close lightbox, widget_editing will still be set to false.
    jQuery('#lightbox').bind('lightbox-unload', function(){
        Wikiwyg.Widgets.widget_editing = 0;
        if (self.wikiwyg && self.wikiwyg.current_mode && self.wikiwyg.current_mode.set_focus) {
            self.wikiwyg.current_mode.set_focus();
        }
    });

    this.load_add_a_link_focus_handlers("add-wiki-link");
    this.load_add_a_link_focus_handlers("add-web-link");
    this.load_add_a_link_focus_handlers("add-section-link");

    var callback = function(element) {
        var form    = jQuery("#add-a-link-form").get(0);
    }
}

proto.load_add_a_link_focus_handlers = function(radio_id) {
    var self = this;
    jQuery('#' + radio_id + '-section input[type=text]').focus(function () {
        jQuery('#' + radio_id).attr('checked', true);
    });
}

proto.set_add_a_link_error = function(msg) {
    jQuery("#add-a-link-error")
        .html('<span>' + msg + '</span>')
        .show()
}

proto.create_link_wafl = function(label, workspace, pagename, section) {
    var label_txt = label ? "\"" + label.replace(/"/g, '\uFF02') + "\"" : "";
    var wafl = label_txt + "{link:";
    if (workspace) { wafl += " " + workspace; }
    if (pagename) { wafl += " [" + pagename + "]"; }
    if (section) { wafl += " " + section; }
    wafl += "}";
    return wafl;
}

});

