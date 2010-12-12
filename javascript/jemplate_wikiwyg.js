// BEGIN jemplate_wikiwyg/insert_menu
Jemplate.templateMap['insert_menu'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += ' <div id="st-page-editing-widget-menu">\n  <ul id="st-editing-insert-menu">\n   <li><a onclick="return false" href="#">Insert</a>\n    <ul>\n     <li><a do="do_widget_image" onclick="return false;" href="#">Image</a></li>\n     <li><a do="do_table" onclick="return false;" href="#">Table</a></li>\n     <li><a do="do_hr" onclick="return false;" href="#">Horizontal Line</a></li>\n     <li><a onclick="return false" href="#" class="daddy">A Link To...</a>\n      <ul>\n       <li><a do="do_widget_file" onclick="return false;" href="#">A File Attached to This Page</a></li>\n       <li><a do="do_widget_link2_section" onclick="return false;" href="#">A Section in This Page</a></li>\n       <li><a do="do_widget_link2" onclick="return false;" href="#">A Different Wiki Page</a></li>\n       <li><a do="do_widget_blog" onclick="return false;" href="#">A Person\'s Blog</a></li>\n       <li><a do="do_widget_tag" onclick="return false;" href="#">Pages Related to a Tag</a></li>\n       <li><a do="do_widget_link2_hyperlink" onclick="return false;" href="#">A Page on The Web</a></li>\n      </ul>\n     </li>\n     <li>\n      <a onclick="return false" href="#" class="daddy">From Workspaces...</a>\n      <ul>\n       <li><a do="do_widget_include" onclick="return false;" href="#">A Page Include</a></li>\n       <li><a do="do_widget_ss" onclick="return false;" href="#">A Spreadsheet Include</a></li>\n       <li><a do="do_widget_tag_list" onclick="return false;" href="#">Tagged Pages</a></li>\n       <li><a do="do_widget_recent_changes" onclick="return false;" href="#">Recent Changes</a></li>\n       <li><a do="do_widget_blog_list" onclick="return false;" href="#">Blog Postings</a></li>\n       <li><a do="do_widget_search" onclick="return false;" href="#">Wiki Search Results</a></li>\n      </ul>\n     </li>\n     <li><a onclick="return false" href="#" class="daddy">From The Web...</a>\n      <ul>\n       <li><a do="do_widget_googlesearch" onclick="return false;" href="#">Google Search Results</a></li>\n       <li><a do="do_widget_fetchrss" onclick="return false;" href="#">RSS Feed Items</a></li>\n       <li><a do="do_widget_fetchatom" onclick="return false;" href="#">Atom Feed Items</a></li>\n      </ul>\n     </li>\n     <li><a onclick="return false" href="#" class="daddy">Organizing Your Page...</a>\n      <ul>\n       <li><a do="do_widget_toc" onclick="return false;" href="#">Table of Contents</a></li>\n       <li><a do="do_widget_section" onclick="return false;" href="#">Section Marker</a></li>\n      </ul>\n     </li>\n     <li><a onclick="return false" href="#" class="daddy">Communicating...</a>\n      <ul>\n      <li><a do="do_widget_skype" onclick="return false;" href="#">Skype Link</a></li>\n      <li><a do="do_widget_aim" onclick="return false;" href="#">AIM Link</a></li>\n      <li><a do="do_widget_yahoo" onclick="return false;" href="#">Yahoo! Messenger Link</a></li>\n     </ul>\n    </li>\n    <li><a onclick="return false" href="#" class="daddy">Name &amp; Date...</a>\n     <ul>\n      <li><a do="do_widget_user" onclick="return false;" href="#">User Name</a></li>\n      <li><a do="do_widget_date" onclick="return false;" href="#">Local Date &amp; Time</a></li>\n     </ul>\n    </li>\n    <li><a do="do_widget_asis" onclick="return false;" href="#">Unformatted Text...</a></li>\n   </ul>\n  </li>\n </ul>\n <div style="clear: both;" id="menu-style-reset"/>\n </div>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate_wikiwyg/st_page_editing_toolbar
Jemplate.templateMap['st_page_editing_toolbar'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<div id="st-page-editing-toolbar">\n <div class="wikiwyg_toolbar" id="wikiwyg_toolbar" style="display: block;">\n  <div class="other_buttons">\n  <img class="wikiwyg_button" id="wikiwyg_button_bold" alt="Bold (Ctrl+b)" title="Bold (Ctrl+b)" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/bold.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_italic" alt="Italic(Ctrl+i)" title="Italic(Ctrl+i)" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/italic.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_strike" alt="Strike Through(Ctrl+d)" title="Strike Through(Ctrl+d)" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/strike.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_h1" alt="Heading 1" title="Heading 1" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/h1.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_h2" alt="Heading 2" title="Heading 2" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/h2.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_h3" alt="Heading 3" title="Heading 3" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/h3.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_h4" alt="Heading 4" title="Heading 4" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/h4.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_p" alt="Normal Text" title="Normal Text" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/p.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_ordered" alt="Numbered List" title="Numbered List" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/ordered.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_unordered" alt="Bulleted List" title="Bulleted List" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/unordered.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_outdent" alt="Less Indented" title="Less Indented" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/outdent.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_indent" alt="More Indented" title="More Indented" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/indent.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_link" alt="Create Link" title="Create Link" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/link.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_image" alt="Include an Image" title="Include an Image" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/image.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_table" alt="New Table" title="New Table" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/table.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_table-settings" alt="Table Settings" title="Table Settings" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/table-settings.png"/><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n />\n  </div>\n  <div class="table_buttons disabled">\n   <img class="wikiwyg_button" id="wikiwyg_button_add-row-below" alt="Add Table Row Below Current Row" title="Add Table Row Below Current Row" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/add-row-below.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_add-row-above" alt="Add Table Row Above Current Row" title="Add Table Row Above Current Row" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/add-row-above.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_move-row-down" alt="Move Current Table Row Down" title="Move Current Table Row Down" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/move-row-down.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_move-row-up" alt="Move Current Table Row Up" title="Move Current Table Row Up" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/move-row-up.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_del-row" alt="Delete Current Table Row" title="Delete Current Table Row" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/del-row.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_add-col-left" alt="Add Table Column to the Left" title="Add Table Column to the Left" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/add-col-left.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_add-col-right" alt="Add Table Column to the Right" title="Add Table Column to the Right" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/add-col-right.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_move-col-left" alt="Move Current Table Column to the Left" title="Move Current Table Column to the Left" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/move-col-left.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_move-col-right" alt="Move Current Table Column to the Right" title="Move Current Table Column to the Right" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/move-col-right.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_del-col" alt="Delete Current Table Column" title="Delete Current Table Column" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/del-col.png"\n />\n  </div>\n </div>\n';
//line 41 "st_page_editing_toolbar"
output += context.include('insert_menu');
output += '\n</div>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate_wikiwyg/dropdown.tt2
Jemplate.templateMap['dropdown.tt2'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<ul id="';
//line 1 "dropdown.tt2"
output += stash.get('id');
output += '-list" class="dropdownOptions">\n    ';
//line 6 "dropdown.tt2"

// FOREACH 
(function() {
    var list = stash.get('options');
    list = new Jemplate.Iterator(list);
    var retval = list.get_first();
    var value = retval[0];
    var done = retval[1];
    var oldloop;
    try { oldloop = stash.get('loop') } finally {}
    stash.set('loop', list);
    try {
        while (! done) {
            stash.data['option'] = value;
output += '\n        <li class="dropdownItem ';
//line 3 "dropdown.tt2"
if (stash.get(['loop', 0, 'last', 0])) {
output += 'last';
}

output += '">\n            <a value="';
//line 4 "dropdown.tt2"
output += stash.get(['option', 0, 'value', 0]);
output += '" href="#">';
//line 4 "dropdown.tt2"
output += stash.get(['option', 0, 'optionTitle', 0]) || stash.get(['option', 0, 'title', 0]);
output += '</a>\n        </li>\n    ';;
            retval = list.get_next();
            value = retval[0];
            done = retval[1];
        }
    }
    catch(e) {
        throw(context.set_error(e, output));
    }
    stash.set('loop', oldloop);
})();

output += '\n</ul>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate_wikiwyg/edit_wikiwyg
Jemplate.templateMap['edit_wikiwyg'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '\n<div id="st-edit-mode-container" style="display: none">\n    <div id="controls">\n        <div id="st-editing-tools-edit">\n            <ul>\n                <li class="flexButton">\n                    <a class="genericOrangeButton" id="st-save-button-link" href="#">';
//line 8 "edit_wikiwyg"
output += stash.get(['loc', [ 'Save' ]]);
output += '</a>\n                </li>\n                <li class="flexButton">\n                    <a class="genericOrangeButton" id="st-preview-button-link" href="#">';
//line 11 "edit_wikiwyg"
output += stash.get(['loc', [ 'Preview' ]]);
output += '</a>\n                </li>\n                <li class="flexButton">\n                    <a class="genericOrangeButton" id="st-cancel-button-link" href="#">';
//line 14 "edit_wikiwyg"
output += stash.get(['loc', [ 'Cancel' ]]);
output += '</a></li>\n                </li>\n            </ul>\n\n            <ul class="editModeSwitcher">\n                <li><a href="#" id="st-mode-wysiwyg-button" onclick="return false;">';
//line 19 "edit_wikiwyg"
output += stash.get(['loc', [ 'Rich Text' ]]);
output += '</a></li>\n                <li><a href="#" id="st-mode-wikitext-button" onclick="return false;">';
//line 20 "edit_wikiwyg"
output += stash.get(['loc', [ 'Wiki Text' ]]);
output += '</a>\n                    <a href="#" id="st-edit-tips">(?)</a>\n                </li>\n            </ul>\n        </div><!-- st-editing-tools-edit END -->\n\n        <div id="bootstrap-loader">\n            ';
//line 27 "edit_wikiwyg"
output += stash.get(['loc', [ 'Loading...' ]]);
output += '\n            <img src="/static/skin/common/images/ajax-loader.gif">\n        </div>\n\n        ';
//line 31 "edit_wikiwyg"
output += context.include('element/edit_summary.html.tt2');
output += '\n\n\n        <div id="controlsRight">\n            <ul class="level1">\n                ';
//line 40 "edit_wikiwyg"
if (stash.get('ui_is_expanded')) {
output += '\n                <li><a href="#" title="';
//line 37 "edit_wikiwyg"
output += stash.get(['loc', [ 'Return edit area to normal view' ]]);
output += '" id="st-edit-pagetools-expand">';
//line 37 "edit_wikiwyg"
output += stash.get(['loc', [ 'Normal' ]]);
output += '</a></li>\n                ';
}
else {
output += '\n                <li><a href="#" title="';
//line 39 "edit_wikiwyg"
output += stash.get(['loc', [ 'Expand edit area to fill browser window' ]]);
output += '" id="st-edit-pagetools-expand">';
//line 39 "edit_wikiwyg"
output += stash.get(['loc', [ 'Expand' ]]);
output += '</a></li>\n                ';
}

output += '\n            </ul>\n        </div><!-- controlsRight END -->\n    </div><!-- controls END -->\n    <div id="st-edit-mode-view">\n        <div id="contentContainer">\n\n           <div id="contentTitle">\n                ';
//line 59 "edit_wikiwyg"
if (stash.get('is_new') && ! stash.get('is_incipient')) {
output += '\n                    <h2 id="st-editing-title" class="tableTitle">\n                        ';
//line 50 "edit_wikiwyg"
output += stash.get(['loc', [ 'Editing:' ]]);
output += '\n                        <input type="text" size="65" id="st-newpage-pagename-edit" value="';
//line 51 "edit_wikiwyg"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['page', 0, 'title', 0]);

    return context.filter(output, 'html_encode', []);
})();

output += '" onclick="Socialtext.clear_untitled(this)"/>\n                    </h2>\n                ';
}
else {
output += '\n                    <h2 id="st-editing-title" class="tableTitle" title="';
//line 54 "edit_wikiwyg"
output += stash.get(['loc', [ 'Editing: ' ]]);
//line 54 "edit_wikiwyg"
output += stash.get(['page', 0, 'display_title', 0]);
output += '">\n                        ';
//line 55 "edit_wikiwyg"
output += stash.get(['loc', [ 'Editing:' ]]);
output += '\n                        ';
//line 56 "edit_wikiwyg"
output += stash.get(['page', 0, 'display_title', 0]);
output += '\n                        <input type="hidden" id="st-newpage-pagename-edit" value="';
//line 57 "edit_wikiwyg"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['page', 0, 'title', 0]);

    return context.filter(output, 'html_encode', []);
})();

output += '" />\n                    </h2>\n                ';
}

output += '\n            </div>\n\n            <div class="st-content" id="st-content-page-edit">\n                <div id="st-edit-mode-toolbar">\n                    <div id="st-page-editing">\n                        <div id="st-editing-prefix-container">\n                            <div id="st-page-editing-toolbar-container">\n\n                                ';
//line 68 "edit_wikiwyg"
output += context.include('st_page_editing_toolbar');
output += '\n\n                                <div id="st-page-editing-button-toolbar">\n                                    <div id="st-page-editing-uploadbutton">\n                                        <a id="st-edit-mode-uploadbutton" class="button" href="#" title="';
//line 72 "edit_wikiwyg"
output += stash.get(['loc', [ 'Click this button to upload a file to the page' ]]);
output += '">';
//line 72 "edit_wikiwyg"
output += stash.get(['loc', [ 'Upload files...' ]]);
output += '</a>\n                                    </div>\n\n                                    <div id="st-page-editing-tagbutton">\n                                        <a id="st-edit-mode-tagbutton" class="button" href="#" title="';
//line 76 "edit_wikiwyg"
output += stash.get(['loc', [ 'Click this button to add a tag to the page' ]]);
output += '">';
//line 76 "edit_wikiwyg"
output += stash.get(['loc', [ 'Add tags...' ]]);
output += '</a>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n                <form id="st-page-editing-form" target="st-save-frame" name="st-page-editing-form" method="post" enctype="multipart/form-data" action="index.cgi">\n                    <input id="st-page-editing-pagename"  type="hidden" name="page_name" value="';
//line 84 "edit_wikiwyg"

// FILTER
output += (function() {
    var output = '';

output += stash.get(['page', 0, 'title', 0]);

    return context.filter(output, 'html_encode', []);
})();

output += '"/>\n                    <input id="st-page-editing-revisionid"  type="hidden" name="revision_id" value="';
//line 85 "edit_wikiwyg"
output += stash.get(['page', 0, 'revision_id', 0]);
output += '" />\n                    <input id="st-page-editing-pagetype"  type="hidden" name="page_type" value="';
//line 86 "edit_wikiwyg"
output += stash.get(['page', 0, 'page_type', 0]);
output += '" />\n                    <input id="st-page-editing-pagebody"  type="hidden" name="page_body" value="" />\n                    <input id="st-page-editing-action" type="hidden" name="action" value="edit_content" />\n                    <input id="st-page-editing-caller" type="hidden" name="caller_action" value="';
//line 89 "edit_wikiwyg"
output += stash.get(['page', 0, 'caller', 0]);
output += '" />\n                    <input id="st-page-editing-summary" type="hidden" name="edit_summary" />\n                    <input id="st-page-editing-signal-summary" type="hidden" name="signal_edit_summary" value="0" />\n                    <input id="st-page-editing-signal-to" type="hidden" name="signal_edit_to_network" value="" />\n                    ';
//line 95 "edit_wikiwyg"

// FOREACH 
(function() {
    var list = stash.get('new_tags');
    list = new Jemplate.Iterator(list);
    var retval = list.get_first();
    var value = retval[0];
    var done = retval[1];
    var oldloop;
    try { oldloop = stash.get('loop') } finally {}
    stash.set('loop', list);
    try {
        while (! done) {
            stash.data['tag'] = value;
output += '\n                    <input type="hidden" name="add_tag" value="';
//line 94 "edit_wikiwyg"
output += stash.get('tag');
output += '" />\n                    ';;
            retval = list.get_next();
            value = retval[0];
            done = retval[1];
        }
    }
    catch(e) {
        throw(context.set_error(e, output));
    }
    stash.set('loop', oldloop);
})();

output += '\n                    <input id="st-page-editing-append" type="hidden" name="append_mode" value="" />\n                    <textarea id="st-page-editing-pagebody-decoy" wrap="virtual" name="page_body_decoy"></textarea>\n                    <div style="display: none" id="st-page-editing-files"></div>\n                </form>\n                <iframe frameborder="0" id="st-page-editing-wysiwyg" src="?action=wikiwyg_html" scrolling="no" style="visibility: hidden"></iframe>\n                <div id="st-page-preview"></div>\n                <div id="wikiwyg-page-content"></div>\n                <br style="clear: both; height: 1px" />\n            </div>\n        </div>\n    </div>\n</div><!-- controls END -->\n\n<div class="lightbox" id="st-tagqueue-interface">\n    <form id="st-tagqueue">\n        <div class="title" id="st-tagqueue-title">';
//line 111 "edit_wikiwyg"
output += stash.get(['loc', [ 'Add Tags' ]]);
output += '</div>\n        <p id="st-tagqueue-tagprompt">\n            ';
//line 113 "edit_wikiwyg"
output += stash.get(['loc', [ 'Tag:' ]]);
output += ' <input id="st-tagqueue-field" class="st-tagqueue-input" type="text" name="tagfield"/>\n        </p>\n        <div class="list" id="st-tagqueue-list" style="display: none">\n            <span class="st-tagqueue-listlabel">\n                ';
//line 117 "edit_wikiwyg"
output += stash.get(['loc', [ 'Tags to apply:' ]]);
output += '\n            </span>\n        </div>\n        <div class="buttons" id="st-tagqueue-buttons">\n            <input type="button" id="st-tagqueue-close" \n                   value="';
//line 122 "edit_wikiwyg"
output += stash.get(['loc', [ 'Close' ]]);
output += '" />\n            <input type="submit" id="st-tagqueue-addbutton"\n                   value="';
//line 124 "edit_wikiwyg"
output += stash.get(['loc', [ 'Add' ]]);
output += '" />\n        </div>\n    </form>\n</div>\n\n<div class="lightbox" id="st-newpage-duplicate-interface">\n    <form onsubmit="return false;">\n        <div class="title" id="st-newpage-duplicate-title">';
//line 131 "edit_wikiwyg"
output += stash.get(['loc', [ 'Page Already Exists' ]]);
output += '</div>\n        <br />\n        <p class="st-newpage-duplicate-prompt">';
//line 133 "edit_wikiwyg"
output += stash.get(['loc', [ 'There is <span id="st-newpage-duplicate-emphasis">already a page</span> named <a id="st-newpage-duplicate-link" href="#" target="">XXX</a>. Would you like to:' ]]);
output += '</p>\n        <p class="st-newpage-duplicate-option"><label><input type="radio" name="st-newpage-duplicate-option" id="st-newpage-duplicate-option-different" value="different"/> ';
//line 134 "edit_wikiwyg"
output += stash.get(['loc', [ 'Save with a different name:' ]]);
output += '</label> <input id="st-newpage-duplicate-pagename" size="40" type="text" name="pagename"/></p>\n        <p class="st-newpage-duplicate-option"><label><input type="radio" name="st-newpage-duplicate-option" id="st-newpage-duplicate-option-suggest" value="suggest"/> ';
//line 135 "edit_wikiwyg"
output += stash.get(['loc', [ 'Save the page with the name "<span id="st-newpage-duplicate-suggest">XXX</span>"' ]]);
output += '</label></p>\n        <p class="st-newpage-duplicate-option"><label><input type="radio" name="st-newpage-duplicate-option" id="st-newpage-duplicate-option-append" value="append"/> ';
//line 136 "edit_wikiwyg"
output += stash.get(['loc', [ 'Append your text to the bottom of the existing page named:' ]]);
output += ' "<span id="st-newpage-duplicate-appendname">XXX</span>"</label></p>\n        <div id="st-newpage-duplicate-buttons" style="float: right">\n            <ul class="widgetButton" style="float:left; padding:10px">\n                <li class="flexButton">\n                    <a class="submit genericOrangeButton" id="st-newpage-duplicate-okbutton" href="#">\n                        ';
//line 141 "edit_wikiwyg"
output += stash.get(['loc', [ 'OK' ]]);
output += '\n                    </a>\n                </li>\n            </ul>\n            <ul class="widgetButton" style="float:left; padding:10px">\n                <li class="flexButton">\n                    <a class="close genericOrangeButton" id="st-newpage-duplicate-cancelbutton" href="#">\n                        ';
//line 148 "edit_wikiwyg"
output += stash.get(['loc', [ 'Cancel' ]]);
output += '\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </form>\n</div>\n\n<div id="st-newpage-save" class="lightbox">\n    <form id="st-newpage-save-form">\n    <div id="st-newpage-save-interface">\n        <div class="title" id="st-newpage-save-title">';
//line 159 "edit_wikiwyg"
output += stash.get(['loc', [ 'Save Page As' ]]);
output += '</div>\n        <p id="st-newpage-save-prompt">';
//line 160 "edit_wikiwyg"
output += stash.get(['loc', [ 'Enter a meaningful and distinctive title for your page.' ]]);
output += '</p>\n        <p id="st-newpage-save-field-pagename">\n            ';
//line 162 "edit_wikiwyg"
output += stash.get(['loc', [ 'Page Title:' ]]);
output += ' <input id="st-newpage-save-pagename" size="45" type="text" name="pagename"/>\n        </p>\n        <p id="st-newpage-save-tip">';
//line 164 "edit_wikiwyg"
output += stash.get(['loc', [ 'Tip: You\'ll be able to find this page later by using the title you choose.' ]]);
output += '</p>\n        <div class="buttons" id="st-newpage-save-buttons">\n            <table width="100%" border="0">\n            <tr>\n            <td align="right"><input type="button" id="st-newpage-save-cancelbutton" value="';
//line 168 "edit_wikiwyg"
output += stash.get(['loc', [ 'Cancel' ]]);
output += '"/></td>\n            <td width="70px" align="right"><input type="submit" id="st-newpage-save-savebutton" value="';
//line 169 "edit_wikiwyg"
output += stash.get(['loc', [ 'Save' ]]);
output += '" /></td>\n            </tr>\n            </table>\n        </div>\n    </div>\n    </form>\n</div>\n\n<div style="overflow-y:scroll;height:400px" id="st-ref-card" class="lightbox">\n    <div class="buttons">\n        <input id="st-ref-card-close" class="close" type="button" value="';
//line 179 "edit_wikiwyg"
output += stash.get(['loc', [ 'Close' ]]);
output += '"/>\n    </div>\n    <table class="st-refcard-table">\n        <tr class="st-refcard-table-row">\n            <th>';
//line 183 "edit_wikiwyg"
output += stash.get(['loc', [ 'To Get This...' ]]);
output += ' </th>\n            <th>';
//line 184 "edit_wikiwyg"
output += stash.get(['loc', [ 'Type This' ]]);
output += '</th>\n        </tr>\n        <tr class="st-refcard-table-row">\n            <td><b>';
//line 187 "edit_wikiwyg"
output += stash.get(['loc', [ 'bold words' ]]);
output += '</b></td>\n            <td>*';
//line 188 "edit_wikiwyg"
output += stash.get(['loc', [ 'bold words*' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><i>';
//line 191 "edit_wikiwyg"
output += stash.get(['loc', [ 'italic words' ]]);
output += '</i></td>\n            <td>';
//line 192 "edit_wikiwyg"
output += stash.get(['loc', [ '_italic words_' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><del>';
//line 195 "edit_wikiwyg"
output += stash.get(['loc', [ 'strikeout' ]]);
output += '</del></td>\n            <td>-';
//line 196 "edit_wikiwyg"
output += stash.get(['loc', [ 'strikeout-' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><tt>';
//line 199 "edit_wikiwyg"
output += stash.get(['loc', [ 'monospace' ]]);
output += '</tt></td>\n            <td>`';
//line 200 "edit_wikiwyg"
output += stash.get(['loc', [ 'monospace`' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>\n                <table class="formatter_table"><tbody>\n                    <tr>\n                        <td>';
//line 206 "edit_wikiwyg"
output += stash.get(['loc', [ 'table' ]]);
output += '</td>\n                        <td>';
//line 207 "edit_wikiwyg"
output += stash.get(['loc', [ 'value' ]]);
output += '</td>\n                    </tr>\n                    <tr>\n                        <td>';
//line 210 "edit_wikiwyg"
output += stash.get(['loc', [ 'dinette' ]]);
output += '</td>\n                        <td>$';
//line 211 "edit_wikiwyg"
output += stash.get(['loc', [ '75' ]]);
output += '</td>\n                    </tr>\n                </table>\n            </td>\n            <td>';
//line 215 "edit_wikiwyg"
output += stash.get(['loc', [ '|table|value|<br>|dinette|$75|<br>' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><blockquote>';
//line 218 "edit_wikiwyg"
output += stash.get(['loc', [ 'indented' ]]);
output += '<br>';
//line 218 "edit_wikiwyg"
output += stash.get(['loc', [ 'lines' ]]);
output += '</blockquote></td>\n            <td>&gt;indented<br>&gt;lines</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="./index.cgi?Page%20Link" title="\\[Page link\\]" target="_blank">Page Link</a></td>\n            <td>[';
//line 223 "edit_wikiwyg"
output += stash.get(['loc', [ 'Page Link' ]]);
output += ']</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="./index.cgi?Page%20Link" title="\\';
//line 226 "edit_wikiwyg"
output += stash.get(['loc', [ 'Page Link' ]]);
output += '\\]" target="_blank">Link text</a></td>\n            <td>"';
//line 227 "edit_wikiwyg"
output += stash.get(['loc', [ 'Link text' ]]);
output += '" [';
//line 227 "edit_wikiwyg"
output += stash.get(['loc', [ 'Page Link' ]]);
output += ']</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><u>';
//line 230 "edit_wikiwyg"
output += stash.get(['loc', [ 'Page Link' ]]);
output += '</u> ';
//line 230 "edit_wikiwyg"
output += stash.get(['loc', [ 'to different-workspace' ]]);
output += '</td>\n            <td>{link: different-workspace [Page Title]} to different-workspace</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>';
//line 234 "edit_wikiwyg"
output += stash.get(['loc', [ 'Page section name' ]]);
output += '</td>\n            <td>{';
//line 235 "edit_wikiwyg"
output += stash.get(['loc', [ 'section:Name}' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><u>';
//line 238 "edit_wikiwyg"
output += stash.get(['loc', [ 'Link to section' ]]);
output += '</u> ';
//line 238 "edit_wikiwyg"
output += stash.get(['loc', [ 'in the same page' ]]);
output += '</td>\n            <td>{';
//line 239 "edit_wikiwyg"
output += stash.get(['loc', [ 'link: Section} (note: headings are sections too)' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><u>Link to section</u> of a different page</td>\n            <td>{link: [Page Title] Section}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><u>Link to section</u> of a page in another workspace</td>\n            <td>{link: another workspace [Page Title] Section}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="http://www.socialtext.com/" title="[external link]" target="_blank">http://www.socialtext.com/</a></td>\n            <td>http://www.socialtext.com/</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="mailto:info@socialtext.com/" title="[email link]">info@socialtext.com</a></td>\n            <td>info@socialtext.com</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="http://www.socialtext.com/" title="[external link]" target="_blank">Socialtext Home Page</a></td>\n            <td>"Socialtext Home Page"&lt;http://www.socialtext.com&gt;</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="mailto:info@socialtext.com/" title="[email link]">Socialtext Email</a></td>\n            <td>"Socialtext Email"&lt;mailto:info@socialtext.com&gt;</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><img src="/static/skin/s2/images/logo-bar-12.gif" alt="[external image]" border="0"></td>\n            <td>&lt;http://www.socialtext.com/images/socialtext-140.gif&gt;</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><hr></td>\n            <td>----</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><ul><li> item 1 <ul><li> subitem 1 </li></ul></li><li> item 2 </li></ul></td>\n            <td>* item 1<br>** subitem 1<br>* item 2</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><ol><li> item 1 <ol><li> subitem 1 </li></ol></li><li> item 2 </li></ol></td>\n            <td># item 1<br>## subitem 1<br># item 2</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h1>heading 1</h1></td>\n            <td>^ heading 1</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h2>heading 2</h2></td>\n            <td>^^ heading 2</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h3>heading 3</h3></td>\n            <td>^^^ heading 3</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h4>heading 4</h4></td>\n            <td>^^^^ heading 4</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h5>heading 5</h5></td>\n            <td>^^^^^ heading 5</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h6>heading 6</h6></td>\n            <td>^^^^^^ heading 6</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><img src="/static/skin/s2/images/logo-bar-12.gif" alt=" [image attachment]" border="0"></td>\n            <td>{image: logo-bar-12.gif} (image attached to page)</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><img src="/static/skin/s2/images/logo-bar-12.gif" alt="[image attachment]" border="0"></td>\n            <td>{image: workspace [page name] logo-bar-12.gif} (image attached to a page in another workspace)</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="./proposal.pdf">proposal.pdf</a> on this page</td>\n            <td>{file: proposal.pdf} on this page</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="./proposal.pdf">proposal.pdf</a> on <u>page name</u></td>\n            <td>{file: [page name] proposal.pdf} - [page name]</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>My Blog blog</td>\n            <td>{blog: My Blog}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>Meeting notes category</td>\n            <td>{category: Meeting Notes}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>Yahoo user yahoouser presence</td>\n            <td>Yahoo user ymsgr:yahoouser presence</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>AOL user aimuser presence</td>\n            <td>AOL user aim:aimuser presence</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>Block of HTML</td>\n            <td>.html<br>&lt;img src="http://mysite.com/offsite.jpg"&gt;<br>.html</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>Block of text with no *special* punctuation</td>\n            <td>.pre<br>Block of text with no *special* punctuation<br>.pre</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><sup>™</sup></td>\n            <td>{tm}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>*this text is not bold*</td>\n            <td>{{*this text is not bold*}}</td>\n        </tr> \n    </table>\n</div>\n\n<div id="st-table-settings" class="lightbox">\n    <span class="title">';
//line 357 "edit_wikiwyg"
output += stash.get(['loc', [ 'Edit Table' ]]);
output += '</span>\n    <input type="checkbox" name="sort" />\n    <label for="sort">';
//line 359 "edit_wikiwyg"
output += stash.get(['loc', [ 'Table is Sortable' ]]);
output += '</label>\n\n    <br/>\n\n    <input type="checkbox" name="border" />\n    <label for="border">';
//line 364 "edit_wikiwyg"
output += stash.get(['loc', [ 'Show Cell Borders' ]]);
output += '</label>\n\n    <div>\n        <ul class="widgetButton" style="float:left; padding:10px">\n            <li class="flexButton">\n                <a class="submit genericOrangeButton" id="table-info-save" href="#">\n                    ';
//line 370 "edit_wikiwyg"
output += stash.get(['loc', [ 'Save' ]]);
output += '\n                </a>\n            </li>\n        </ul>\n        <ul class="widgetButton" style="float:left; padding:10px">\n            <li class="flexButton">\n                <a class="close genericOrangeButton" id="table-info-cancel" href="#">\n                    ';
//line 377 "edit_wikiwyg"
output += stash.get(['loc', [ 'Cancel' ]]);
output += '\n                </a>\n            </li>\n        </ul>\n    </div>\n</div>\n\n<iframe style="height: 1px; position: absolute; top: -2px;" frameborder="0" id="pastebin" src="';
//line 384 "edit_wikiwyg"
output += stash.get(['wiki', 0, 'skin_uri', []]);
output += '/html/wikiwyg.html"></iframe>\n<iframe style="height: 1px; position: absolute; top: -2px;" frameborder="0" id="st-save-frame" name="st-save-frame" src="/static/html/blank.html"></iframe>\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate_wikiwyg/element/insert_widget_menu
Jemplate.templateMap['element/insert_widget_menu'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<ul>\n  <li class="main">Insert\n    <ul>\n      <li do="do_widget_image">Image</li>\n      <li do="do_table">Table</li>\n      <li do="do_hr">Horizontal&nbsp;Line</li>\n      <li>Link\n        <ul>\n          <li do="do_widget_link2">Wiki&nbsp;Link</li>\n          <li do="do_widget_link2">Web&nbsp;Link</li>\n          <li do="do_widget_link2">Section&nbsp;Link</li>\n          <li do="do_widget_tag">Tag&nbsp;Link</li>\n          <li do="do_widget_blog">Blog&nbsp;Link</li>\n          <li do="do_widget_file">Attachment&nbsp;Link</li>\n        </ul>\n      </li>\n      <li>Content&nbsp;Block\n        <ul>\n          <li do="do_widget_toc">Table&nbsp;of&nbsp;contents</li>\n          <li do="do_widget_include">Page&nbsp;Include</li>\n          <li do="do_widget_ss">Spreadsheet&nbsp;Include</li>\n          <li do="do_widget_recent_changes">Recent&nbsp;Changes</li>\n          <li do="do_widget_blog_list">Blog&nbsp;List</li>\n          <li do="do_widget_tag_list">Tag&nbsp;List</li>\n          <li do="do_widget_search">Search&nbsp;Results</li>\n          <li do="do_widget_googlesearch">Google&nbsp;Search</li>\n        </ul>\n      </li>\n      <li>Field\n        <ul>\n          <li do="do_widget_user">Username</li>\n          <li do="do_widget_date">Local&nbsp;Date&nbsp;and&nbsp;Time</li>\n        </ul>\n      </li>\n      <li>IM&nbsp;Link\n        <ul>\n          <li do="do_widget_aim">AIM</li>\n          <li do="do_widget_yahoo">Yahoo!</li>\n          <li do="do_widget_skype">Skype</li>\n        </ul>\n      </li>\n      <li>External&nbsp;Feed\n        <ul>\n          <li do="do_widget_fetchrss">RSS</li>\n          <li do="do_widget_fetchatom">ATOM</li>\n          <li do="do_widget_technorati">Technorati</li>\n        </ul>\n      </li>\n    </ul>\n  </li>\n</ul>\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate_wikiwyg/element/edit_summary_explanation
Jemplate.templateMap['element/edit_summary_explanation'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += 'You can add a short explanation that summarizes your\nediting changes in the input field provided. This is\ncompletely optional.\n\nMouse over the Save button at any time to reveal the\nsummary input and type in your text. Hitting Enter\nwill save the page.\n\nThe Page Summary will show up in various places\nincluding the Page Revision History and any listings\nwhere the page is shown.\n\nIf you want to save the page with no summary, simply\nclick Save.\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate_wikiwyg/element/edit_summary.html.tt2
Jemplate.templateMap['element/edit_summary.html.tt2'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<div id="st-edit-summary">\n    <div class="body">\n        <form action="#">\n            <div class="field">\n                <label for="st-edit-summary-text-area">';
//line 5 "element/edit_summary.html.tt2"
output += stash.get(['loc', [ 'Summarize your edit (optional)' ]]);
output += '</label>\n                <input type="text" id="st-edit-summary-text-area" maxlength="250" class="input">\n            </div>\n            ';
//line 16 "element/edit_summary.html.tt2"
if (stash.get(['plugins_enabled', 0, 'grep', [ 'signals' ], 'size', 0]) && stash.get(['plugins_enabled_for_current_workspace_account', 0, 'grep', [ 'signals' ], 'size', 0])) {
output += '            <div class="signal">\n                <div class="preview" style="display: none;">Your Signal will appear as:<div id="st-edit-summary-signal-preview" class="text"></div></div>\n                <input id="st-edit-summary-signal-checkbox" type="checkbox" /><label for="st-edit-summary-signal-checkbox">';
//line 11 "element/edit_summary.html.tt2"
output += stash.get(['loc', [ 'Signal this edit to' ]]);
output += '</label>\n                <input id="st-edit-summary-signal-to" type="hidden" />\n                <span class="select" id="signal_network">...</span>\n                <img id="signal_network_warning" src="/static/skin/common/images/warning-icon.png" style="margin-right: -20px; position: relative; display: none" title="';
//line 14 "element/edit_summary.html.tt2"
output += stash.get(['loc', [ 'Only members with permission to view this page will receive the signal.' ]]);
output += '" />\n            </div>';
}

output += '\n         ';
output += '\n        </form>\n    </div>\n</div>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

;
// BEGIN jemplate/widget_html_edit.html
Jemplate.templateMap['widget_html_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_html_edit.html"
output += stash.get(['loc', [ 'Raw HTML Block' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_html_edit.html"
output += stash.get(['loc', [ 'Insert a block of raw HTML.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_html_edit.html"
output += stash.get(['loc', [ ':' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-html" name="html" value="';
//line 10 "widget_html_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('html');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="html_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_html_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_html_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_html_edit.html"
output += stash.get(['loc', [ '' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_html_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_html_edit.html"
output += stash.get('html_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="html_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_html_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_html_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate/table-create.html
Jemplate.templateMap['table-create.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "table-create.html"
output += stash.get(['loc', [ 'Create Table' ]]);
output += '</span>\n<form action="#" onsubmit="return false">\n<table class="table-create">\n    <tr>\n        <td class="row-col-label">\n            ';
//line 6 "table-create.html"
output += stash.get(['loc', [ 'Columns:' ]]);
output += '&nbsp;\n        </td>\n        <td class="col-value">\n            <input name="columns" type="text" value="3">\n        </td>\n    </tr>\n\n    <tr>\n        <td class="row-col-label">\n            ';
//line 15 "table-create.html"
output += stash.get(['loc', [ 'Rows:' ]]);
output += '&nbsp;\n        </td>\n        <td class="row-value">\n            <input name="rows" type="text" value="5">\n        </td>\n    </tr>\n\n    <tr>\n        <td></td>\n        <td>\n            <input type="checkbox" name="sort" disabled="true" />\n            <label for="sort">';
//line 26 "table-create.html"
output += stash.get(['loc', [ 'Table is Sortable' ]]);
output += '</label>\n        </td>\n    </tr>\n    <tr>\n        <td></td>\n        <td>\n            <input type="checkbox" name="border" checked="checked" />\n            <label for="border">';
//line 33 "table-create.html"
output += stash.get(['loc', [ 'Show Cell Borders' ]]);
output += '</label>\n        </td>\n    </tr>\n\n    <tr>\n        <td colspan="2">\n            <div>\n                <ul class="widgetButton" style="float:left; padding:10px">\n                    <li class="flexButton">\n                        <a class="save genericOrangeButton" id="table-info-save" href="#">\n                            ';
//line 43 "table-create.html"
output += stash.get(['loc', [ 'Save' ]]);
output += '\n                        </a>\n                    </li>\n                </ul>\n                <ul class="widgetButton" style="float:left; padding:10px">\n                    <li class="flexButton">\n                        <a class="close genericOrangeButton" id="table-info-cancel" href="#">\n                            ';
//line 50 "table-create.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += '\n                        </a>\n                    </li>\n                </ul>\n            </div>\n        </td>\n    </tr>\n\n    <tr>\n        <td colspan="2">\n            <span class="error"></span>\n        </td>\n    </tr>\n</table>\n</form>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate/table-options.html
Jemplate.templateMap['table-options.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">Table Options</span><br/>\n<table class="table-options">\n    <tr>\n        <td class="row-col-label">\n            ';
//line 5 "table-options.html"
output += stash.get(['loc', [ 'Current Row:' ]]);
output += '&nbsp;\n        </td>\n        <td class="row-col-value">\n            <span class="row-number"></span>\n            (<span class="row-head"></span>)\n        </td>\n    </tr>\n\n    <tr>\n        <td class="row-col-label two">\n            ';
//line 15 "table-options.html"
output += stash.get(['loc', [ 'Current Column:' ]]);
output += '&nbsp;\n        </td>\n        <td class="row-col-value">\n            <span class="col-number"></span>\n            (<span class="col-head"></span>)\n        </td>\n    </tr>\n\n    <tr>\n        <td class="row options">\n            <ul>\n                <li><a href="#" class="add row above">';
//line 26 "table-options.html"
output += stash.get(['loc', [ 'Add a row above' ]]);
output += '</a></li>\n                <li><a href="#" class="add row below">';
//line 27 "table-options.html"
output += stash.get(['loc', [ 'Add a row below' ]]);
output += '</a></li>\n                <li>&nbsp;</li>\n                <li><a href="#" class="move row up">';
//line 29 "table-options.html"
output += stash.get(['loc', [ 'Move row up' ]]);
output += '</a></li>\n                <li><a href="#" class="move row down">';
//line 30 "table-options.html"
output += stash.get(['loc', [ 'Move row down' ]]);
output += '</a></li>\n                <li>&nbsp;</li>\n                <li><a href="#" class="delete row">';
//line 32 "table-options.html"
output += stash.get(['loc', [ 'Delete row' ]]);
output += '</a></li>\n\n            </ul>\n        </td>\n\n        <td class="column options">\n            <ul>\n                <li><a href="#" class="add column left">';
//line 39 "table-options.html"
output += stash.get(['loc', [ 'Add a column left' ]]);
output += '</a></li>\n                <li><a href="#" class="add column right">';
//line 40 "table-options.html"
output += stash.get(['loc', [ 'Add a column right' ]]);
output += '</a></li>\n                <li>&nbsp;</li>\n                <li><a href="#" class="move column left">';
//line 42 "table-options.html"
output += stash.get(['loc', [ 'Move column left' ]]);
output += '</a></li>\n                <li><a href="#" class="move column right">';
//line 43 "table-options.html"
output += stash.get(['loc', [ 'Move column right' ]]);
output += '</a></li>\n                <li>&nbsp;</li>\n                <li><a href="#" class="delete column">';
//line 45 "table-options.html"
output += stash.get(['loc', [ 'Delete column' ]]);
output += '</a></li>\n            </ul>\n\n        </td>\n    </tr>\n    <tr>\n        <td colspan="2">\n            <div class="buttons">\n                <input name="save" type="submit" value=';
//line 53 "table-options.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n                <input name="cancel" type="reset" value=';
//line 54 "table-options.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n            </div>\n        </td>\n    </tr>\n</table>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate/add-a-link.html
Jemplate.templateMap['add-a-link.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<div id="st-widget-link-dialog" class="lightbox">\n  <span class="title">';
//line 2 "add-a-link.html"
output += stash.get(['loc', [ 'Add a link' ]]);
output += '</span>\n  <form id="add-a-link-form">\n   <p class="heads-up">';
//line 4 "add-a-link.html"
output += stash.get(['loc', [ 'Required fields are indicated by an' ]]);
output += ' <span class="heads-up-indicator">*</span></p>\n\n   <div id="add-wiki-link-section">\n    <div class="add-a-link-subheader">\n      <input type="radio" class="editfield" checked="checked"\n             name="add-link-type" id="add-wiki-link" />\n      <label for="add-wiki-link" class="label">';
//line 10 "add-a-link.html"
output += stash.get(['loc', [ 'Wiki link' ]]);
output += '</label>\n    </div>\n    <div class="add-a-link-set">\n     <div>\n         <label for="wiki-link-text" class="editlabel">';
//line 14 "add-a-link.html"
output += stash.get(['loc', [ 'Linked text' ]]);
output += ':</label>\n         <input type="text" size="25" class="editfield" \n                name="wiki-link-text" id="wiki-link-text" />\n     </div>\n     <div>\n        <label for="wiki-link-workspace" class="editlabel">';
//line 19 "add-a-link.html"
output += stash.get(['loc', [ 'Workspace' ]]);
output += ':</label>\n        <input type="text" size="25" class="editfield" \n               name="wiki-link-workspace" id="st-widget-workspace_id"/>\n        <span class="additional-info">';
//line 22 "add-a-link.html"
output += stash.get(['loc', [ 'If not current' ]]);
output += '</span>\n     </div>\n     <div>\n         <label for="wiki-link-page" class="editlabel">';
//line 25 "add-a-link.html"
output += stash.get(['loc', [ 'Page' ]]);
output += ': <span class="heads-up-indicator">*</span></label>\n        <input type="text" size="25" class="editfield" \n               name="wiki-link-page" id="st-widget-page_title" />\n     </div>\n     <div>\n        <label for="wiki-link-section" class="editlabel">';
//line 30 "add-a-link.html"
output += stash.get(['loc', [ 'Section' ]]);
output += ':</label>\n        <input type="text" size="25" class="editfield" \n               name="wiki-link-section" id="wiki-link-section" />\n     </div>\n    </div>\n   </div>\n\n  <div id="add-web-link-section">\n   <div class="add-a-link-subheader">\n       <input type="radio" class="editfield" \n             name="add-link-type" id="add-web-link" />\n       <label for="add-web-link" class="label">';
//line 41 "add-a-link.html"
output += stash.get(['loc', [ 'Web link' ]]);
output += '</label>\n   </div>\n   <div class="add-a-link-set">\n    <div>\n        <label for="web-link-text" class="editlabel">';
//line 45 "add-a-link.html"
output += stash.get(['loc', [ 'Linked text' ]]);
output += ':</label>\n        <input type="text" size="25" class="editfield" \n               name="web-link-text" id="web-link-text" />\n    </div>\n    <div>\n        <label for="web-link-destination" class="editlabel">';
//line 50 "add-a-link.html"
output += stash.get(['loc', [ 'Link destination' ]]);
output += ': <span class="heads-up-indicator">*</span></label>\n        <input type="text" size="25" class="editfield" value="http://"\n               name="web-link-destination" id="web-link-destination" />\n    </div>\n   </div>\n  </div>\n\n  <div id="add-section-link-section">\n   <div class="add-a-link-subheader">\n       <input type="radio" class="editfield" \n             name="add-link-type" id="add-section-link" />\n       <label for="add-section-link" class="label">';
//line 61 "add-a-link.html"
output += stash.get(['loc', [ 'Section in current page' ]]);
output += '</label>\n   </div>\n   <div class="add-a-link-set">\n    <div>\n        <label for="section-link-text" class="editlabel">';
//line 65 "add-a-link.html"
output += stash.get(['loc', [ 'Section' ]]);
output += ' <span class="heads-up-indicator">*</span>:</label>\n        <input type="text" size="25" class="editfield" \n               name="section-link-text" id="section-link-text" />\n    </div>\n   </div>\n  </div>\n\n  <div id="add-a-link-error" class="widget_edit_error_msg"></div>\n  <div class="buttons">\n    <input id="st-widget-link-savebutton" type="submit" value=';
//line 74 "add-a-link.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-link-cancelbutton" type="reset" value=';
//line 75 "add-a-link.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n  </div>\n </form>\n</div>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

;
