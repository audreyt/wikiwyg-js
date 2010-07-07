/*==============================================================================
This Wikiwyg class provides toolbar support

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

proto = new Subclass('Wikiwyg.Toolbar', 'Wikiwyg.Base');
proto.classtype = 'toolbar';

proto.config = {};

proto.initializeObject = function() {
    this.div = document.getElementById("wikiwyg_toolbar");
    this.button_container = this.div;

    var self = this;
    $("img.wikiwyg_button", this.div).bind("click", function(e) {
        if ( $(this).hasClass('disabled') ) return;
        var action = $(this).attr("id").replace(/^wikiwyg_button_/, '');
        self.wikiwyg.current_mode.process_command(action);
    });
}

proto.enableThis = function() {
    this.button_container.style.display = 'block';
}

proto.disableThis = function() {
    this.button_container.style.display = 'none';
}

proto.resetModeSelector = function() {
    this.wikiwyg.disable_button(this.wikiwyg.first_mode.classname);
}

proto.setup_widgets = function() {
    this.setup_widgets_menu(loc('Insert'));
}

proto.setup_widgets_menu = function(title) {
    jQuery("#st-editing-insert-menu > li")
        .find("li:has('ul') > a")
        .addClass('daddy');
    if (jQuery.browser.msie) {
        jQuery("#st-editing-insert-menu li")
            .hover(
                function () { if (!jQuery(this).hasClass('disabled')) jQuery(this).addClass('sfhover') },
                function () { jQuery(this).removeClass('sfhover') }
            );
    }

    var self = this;
    if (jQuery.browser.msie) {
        jQuery("#st-editing-insert-menu > li > ul a").mouseover(function(){
            if (self.wikiwyg.current_mode.get_editable_div) {
                self._currentModeHadFocus = self.wikiwyg.current_mode._hasFocus;
            }
        });
    }
    jQuery("#st-editing-insert-menu > li > ul a, #st-editing-insert-menu > li > ul > li > ul > li > a").click(
        function(e) {
            var action = jQuery(this).attr("do");
            if (action == null) {
                return false;
            }

            if (jQuery.isFunction( self.wikiwyg.current_mode[action] ) ) {
                if (jQuery.browser.msie &&
                    self.wikiwyg.current_mode.get_editable_div
                ) {
                    if (!self._currentModeHadFocus) {
                        self.wikiwyg.current_mode.set_focus();
                    }
                }

                self.wikiwyg.current_mode[action]
                    .apply(self.wikiwyg.current_mode);

                self.focus_link_menu(action, e.target.innerHTML)

                return false;
            }

            var self2 = this;
            setTimeout(function() {
                alert("'" +
                    jQuery(self2).text() +
                    "' is not supported in this mode"
                );
            }, 50);
            return false;
        }
    );
}

proto.focus_link_menu = function(action, label) {
    if (! (
        action.match(/^do_widget_link2/)
        &&
        label.match(/^(Wiki|Web|Section)/)
    )) return;

    type = RegExp.$1.toLowerCase();
    jQuery("#add-" + type + "-link")
        .attr("checked", "checked");
    jQuery("#add-" + type + "-link-section")
        .find('input[type="text"]:eq(0)').focus().end()
        .find('input[type="text"][value]:eq(0)').focus().select();
}
