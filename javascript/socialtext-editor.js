// BEGIN main.js
/* 
COPYRIGHT NOTICE:
    Copyright (c) 2004-2005 Socialtext Corporation 
    235 Churchill Ave 
    Palo Alto, CA 94301 U.S.A.
    All rights reserved.
*/

function foreach(list, func) {
    for (var ii = 0; ii < list.length; ii++)
        func(list[ii]);
}

function elem(id) {
    return document.getElementById(id);
}

function exists(object, key) {
    return (typeof object[key] != 'undefined') ;
}

function assertEquals(a, b, desc) {
    // TODO figure out what the calling line was, or else just start using
    // easily-greppable "desc"s
    if (typeof(a) != typeof(b)) {
        alert(
             desc + " failed:\n"
             + 'typeof('+a+') != typeof('+b+')\n'
             + '('+typeof(a)+' vs. '+typeof(b)+')'
        );
    }
    if (a+'' != b+'')
        alert(desc + " failed: '" + a + "' != '" + b + "'");
}

// TODO Replace this stuff with AddEvent
// var onload_functions = new Array()
var onload_functions = [];
function push_onload_function(func) {
    onload_functions.push(func);
}

function call_onload_functions() {
    while (func = onload_functions.shift()) {
        func();
    }
}

function html_escape(string) {
    return jQuery("<div/>").text(string).html();
}

function escape_plus(string) {
    return encodeURIComponent(string);
}

// http://daniel.glazman.free.fr/weblog/newarchive/2003_06_01_glazblogarc.html#s95320189
document.getDivsByClassName = function(needle) {
    var my_array = document.getElementsByTagName('div');
    var retvalue = new Array();
    var i;
    var j;

    for (i = 0, j = 0; i < my_array.length; i++) {
        var c = " " + my_array[i].className + " ";
        if (c.indexOf(" " + needle + " ") != -1)
             retvalue[j++] = my_array[i];
    }
    return retvalue;
}

// -- Less generic stuff below... ---

// TODO - Class.NLW
function toolbar_warning(element, warning) {
    var old_html = element.innerHTML;
    element.innerHTML = warning;
    element.style.color = 'red';
    return old_html;
}

function set_main_frame_margin() {
    var spacer = document.getElementById('page-container-top-control');
    var fixed_bar = document.getElementById('fixed-bar');

    if (fixed_bar) {
        var new_top_margin = fixed_bar.offsetHeight;
        if (Browser.isIE)
            new_top_margin += 2;

        spacer.style.display = 'block';
        spacer.style.height = new_top_margin + 'px';
    }
}
jQuery(function() {
    jQuery(window).bind("resize", set_main_frame_margin).trigger("resize");
});

function nlw_name_to_id(name) {
    if (name == '')
        return '';
    return encodeURI(
        name.replace(/[^A-Za-z0-9_+]/g, '_') /* For Safari, the similar regex below doesn't work in Safari */
            .replace(/[^A-Za-z0-9_+\u00C0-\u00FF]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_*(.*?)_*$/g, '$1')
            .replace(/^0$/, '_')
            .replace(/^$/, '_')
            .toLocaleLowerCase()
    );
}

function check_revisions(form) {
    var r1;
    var r2;
    
    var old_id = form.old_revision_id;
    if (old_id) {
        for (var i = 0; i < old_id.length; i++) {
            if (old_id[i].checked) {
                 r1 = old_id[i].value;
            }
        }
    }
    else {
        r1 = -1;
    }

    var new_id = form.new_revision_id;
    if (new_id) {
        for (var i = 0; i < new_id.length; i++) {
            if (new_id[i].checked) {
                r2 = new_id[i].value;
            }
        }
    }
    else {
        r2 = -1;
    }

    if ((! r1) || (! r2)) {
        alert(loc('You must select two revisions to compare.'));
        return false;
    }

    if (r1 == r2) {
        alert(loc('You cannot compare a revision to itself.'));
        return false;
    }

    return true;
}

// Dummy JSAN.use since we preload classes
JSAN = {};
JSAN.use = function() {};

if (typeof(Socialtext) == 'undefined') {
    Socialtext = {};
}

Socialtext.clear_untitled = function(input) {
    if (is_reserved_pagename(input.value)) {
        input.value = '';
    }
}

Socialtext.logEvent = function(action) {
    // untitled_page events are an error or ignored, so don't send them
    if (Socialtext.page_id == 'untitled_page')
        return;

    var event_json = JSON.stringify({
        'action': action,
        'event_class': 'page',
        'page' : {
            'id': Socialtext.page_id,
            'workspace_name': Socialtext.wiki_id
        },
        'context': {
            'revision_count': Socialtext.revision_count,
            'revision_id': Socialtext.revision_id
        }
    });

    jQuery.ajax({
        type: 'POST',
        url: '/data/events',
        contentType: 'application/json',
        processData: false,
        data: event_json,
        async: true
    });
}
;
// BEGIN jemplate_wikiwyg.js
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
;
// BEGIN jemplate_wikiwyg_edit.js
// BEGIN widgets widget_edit.tt2
/*
   This JavaScript code was generated by Jemplate, the JavaScript
   Template Toolkit. Any changes made to this file will be lost the next
   time the templates are compiled.

   Copyright 2006-2008 - Ingy döt Net - All rights reserved.
*/

if (typeof(Jemplate) == 'undefined')
    throw('Jemplate.js must be loaded before any Jemplate template files');

Jemplate.templateMap['widget_link2_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Link to a Wiki page' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Use this form to edit the properties of the link to a page section.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Section name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-section_name" name="section_name" value="';
//line 10 "widget_link2_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('section_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="link2_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_link2_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_link2_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Optional properties include the text to display for the link, and the title of a different page.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n<td class="label">';
//line 24 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Link text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-label" name="label" value="';
//line 26 "widget_link2_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('label');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n  <td class="label">';
//line 30 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Workspace:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 32 "widget_link2_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 33 "widget_link2_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 34 "widget_link2_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 36 "widget_link2_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 37 "widget_link2_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 38 "widget_link2_edit.html"
output += stash.get('link2_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 40 "widget_link2_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n<tr>\n  <td class="label">';
//line 45 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Page title:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-page_title-rb" value="current" ';
//line 47 "widget_link2_edit.html"
output += stash.get('page_title') ? '' : 'checked';
output += '>\n';
//line 48 "widget_link2_edit.html"
output += stash.get(['loc', [ 'the current page' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 49 "widget_link2_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-page_title-rb" value="other" ';
//line 51 "widget_link2_edit.html"
output += stash.get('page_title') ? 'checked' : '';
output += ' ?>\n  ';
//line 52 "widget_link2_edit.html"
output += stash.get(['loc', [ 'the page titled' ]]);
//line 53 "widget_link2_edit.html"
output += stash.get('link2_st_widget_page_title_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-page_title" name="page_title" value="';
//line 55 "widget_link2_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('page_title');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 65 "widget_link2_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 65 "widget_link2_edit.html"
output += stash.get('link2_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="link2_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 72 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 73 "widget_link2_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_link2_hyperlink_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'Link to a Web Page' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'Use this form to edit the properties of the link to a web page.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n</table>\n</div>\n<div id="link2_hyperlink_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 11 "widget_link2_hyperlink_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 12 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 15 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'Optional properties include the text to display for the link.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n<td class="label">';
//line 18 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'Linked text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-label" name="label" value="';
//line 20 "widget_link2_hyperlink_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('label');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n<td class="label">';
//line 24 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'Link destination:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-url" name="url" value="';
//line 26 "widget_link2_hyperlink_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('url');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 35 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 35 "widget_link2_hyperlink_edit.html"
output += stash.get('link2_hyperlink_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="link2_hyperlink_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 42 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 43 "widget_link2_hyperlink_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_link2_section_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'Link to a Section' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'Use this form to edit the properties of the link to a section.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n</table>\n</div>\n<div id="link2_section_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 11 "widget_link2_section_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 12 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 15 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'Optional properties include the text to display for the link.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n<td class="label">';
//line 18 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'Linked text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-label" name="label" value="';
//line 20 "widget_link2_section_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('label');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n<td class="label">';
//line 24 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'Link destination:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-url" name="url" value="';
//line 26 "widget_link2_section_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('url');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 35 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 35 "widget_link2_section_edit.html"
output += stash.get('link2_section_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="link2_section_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 42 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 43 "widget_link2_section_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_image_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_image_edit.html"
output += stash.get(['loc', [ 'Attached Image' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_image_edit.html"
output += stash.get(['loc', [ 'Display an image on this page. The image must be already uploaded as an attachment to this page or another page. Use this form to edit the properties of the displayed image.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_image_edit.html"
output += stash.get(['loc', [ 'Image filename:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-image_name" name="image_name" value="';
//line 10 "widget_image_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('image_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n  <td class="label">\n    ';
//line 15 "widget_image_edit.html"
output += stash.get(['loc', [ 'Size:' ]]);
output += '\n  </td>\n  <td class="st-widget-dialog-editfield">\n    ';
//line 18 "widget_image_edit.html"
if (! stash.get('size')) {
//line 18 "widget_image_edit.html"
stash.set('size', 'scaled');
}

output += '\n    ';
//line 19 "widget_image_edit.html"
stash.set('sizes', [ [ 'small', 'Small', 100 ], [ 'medium', 'Medium', 300 ], [ 'large', 'Large', 600 ], [ 'scaled', 'Scaled to fit', 0 ] ]);
output += '\n    <table>\n    ';
//line 40 "widget_image_edit.html"

// FOREACH 
(function() {
    var list = stash.get('sizes');
    list = new Jemplate.Iterator(list);
    var retval = list.get_first();
    var value = retval[0];
    var done = retval[1];
    var oldloop;
    try { oldloop = stash.get('loop') } finally {}
    stash.set('loop', list);
    try {
        while (! done) {
            stash.data['choice'] = value;
output += '\n      <tr>\n        <td>\n          <input type="radio" name="size" value="';
//line 30 "widget_image_edit.html"
output += stash.get(['choice', 0, 0, 0]);
output += '"\n            ';
//line 31 "widget_image_edit.html"
if (stash.get(['choice', 0, 0, 0]) == stash.get('size')) {
output += ' checked="1" ';
}

output += '/>\n          ';
//line 32 "widget_image_edit.html"
output += stash.get(['loc', [ stash.get(['choice', 0, 1, 0]) ]]);
output += '\n        </td>\n        <td style="color:#999999">\n          ';
//line 37 "widget_image_edit.html"
if (stash.get(['choice', 0, 2, 0])) {
output += '\n            ';
//line 36 "widget_image_edit.html"
output += stash.get(['loc', [ 'width: [_1]', stash.get(['choice', 0, 2, 0]) ]]);
output += '\n          ';
}

output += '\n        </td>\n      </tr>\n    ';;
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

output += '\n      <tr>\n        <td>\n          <input type="radio" ';
//line 43 "widget_image_edit.html"
if (stash.get('width') || stash.get('height')) {
output += 'checked="1"';
}

output += '\n                 name="size" value="custom"/>\n          ';
//line 45 "widget_image_edit.html"
output += stash.get(['loc', [ 'Custom' ]]);
output += '\n        </td>\n        <td style="color:#999999">\n          ';
//line 48 "widget_image_edit.html"
output += stash.get(['loc', [ 'width:' ]]);
output += '\n          <input size="3" name="width" value="';
//line 49 "widget_image_edit.html"
output += stash.get('width');
output += '"/>\n          ';
//line 50 "widget_image_edit.html"
output += stash.get(['loc', [ 'height:' ]]);
output += '\n          <input size="3" name="height" value="';
//line 51 "widget_image_edit.html"
output += stash.get('height');
output += '"/>\n        </td>\n      </td>\n    </table>\n  </td>\n</tr>\n</table>\n</div>\n<div id="image_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 61 "widget_image_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 62 "widget_image_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 65 "widget_image_edit.html"
output += stash.get(['loc', [ 'Optional properties include the title of another page to which the image is attached, and link text. If link text is specified then a link to the image is displayed instead of the image.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n  <td class="label">';
//line 68 "widget_image_edit.html"
output += stash.get(['loc', [ 'Page in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 70 "widget_image_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 71 "widget_image_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 72 "widget_image_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 74 "widget_image_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 75 "widget_image_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 76 "widget_image_edit.html"
output += stash.get('image_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 78 "widget_image_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n<tr>\n  <td class="label">';
//line 83 "widget_image_edit.html"
output += stash.get(['loc', [ 'Attached to:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-page_title-rb" value="current" ';
//line 85 "widget_image_edit.html"
output += stash.get('page_title') ? '' : 'checked';
output += '>\n';
//line 86 "widget_image_edit.html"
output += stash.get(['loc', [ 'the current page' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 87 "widget_image_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-page_title-rb" value="other" ';
//line 89 "widget_image_edit.html"
output += stash.get('page_title') ? 'checked' : '';
output += ' ?>\n  ';
//line 90 "widget_image_edit.html"
output += stash.get(['loc', [ 'the page titled' ]]);
//line 91 "widget_image_edit.html"
output += stash.get('image_st_widget_page_title_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-page_title" name="page_title" value="';
//line 93 "widget_image_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('page_title');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n<tr>\n<td class="label">';
//line 98 "widget_image_edit.html"
output += stash.get(['loc', [ 'Link text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-label" name="label" value="';
//line 100 "widget_image_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('label');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 109 "widget_image_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 109 "widget_image_edit.html"
output += stash.get('image_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="image_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 116 "widget_image_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 117 "widget_image_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_file_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_file_edit.html"
output += stash.get(['loc', [ 'Attachment Link' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_file_edit.html"
output += stash.get(['loc', [ 'Display a link to a file attached to a page. Use this form to edit the properities of the link.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_file_edit.html"
output += stash.get(['loc', [ 'Attachment filename:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-file_name" name="file_name" value="';
//line 10 "widget_file_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('file_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="file_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_file_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_file_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_file_edit.html"
output += stash.get(['loc', [ 'Optional properties include specifying a different page for the attachment, and link text.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n  <td class="label">';
//line 24 "widget_file_edit.html"
output += stash.get(['loc', [ 'Page in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 26 "widget_file_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 27 "widget_file_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 28 "widget_file_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 30 "widget_file_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 31 "widget_file_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 32 "widget_file_edit.html"
output += stash.get('file_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 34 "widget_file_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n<tr>\n  <td class="label">';
//line 39 "widget_file_edit.html"
output += stash.get(['loc', [ 'File attached to:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-page_title-rb" value="current" ';
//line 41 "widget_file_edit.html"
output += stash.get('page_title') ? '' : 'checked';
output += '>\n';
//line 42 "widget_file_edit.html"
output += stash.get(['loc', [ 'the current page' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 43 "widget_file_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-page_title-rb" value="other" ';
//line 45 "widget_file_edit.html"
output += stash.get('page_title') ? 'checked' : '';
output += ' ?>\n  ';
//line 46 "widget_file_edit.html"
output += stash.get(['loc', [ 'the page titled' ]]);
//line 47 "widget_file_edit.html"
output += stash.get('file_st_widget_page_title_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-page_title" name="page_title" value="';
//line 49 "widget_file_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('page_title');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n<tr>\n<td class="label">';
//line 54 "widget_file_edit.html"
output += stash.get(['loc', [ 'Link text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-label" name="label" value="';
//line 56 "widget_file_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('label');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 65 "widget_file_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 65 "widget_file_edit.html"
output += stash.get('file_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="file_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 72 "widget_file_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 73 "widget_file_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_toc_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_toc_edit.html"
output += stash.get(['loc', [ 'Table of Contents' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_toc_edit.html"
output += stash.get(['loc', [ 'Display a table of contents for a page. Each header or section on the page is listed as a link in the table of contents. Click "Save" now, or click "More options" to edit the properties for the table of contents.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n</table>\n</div>\n<div id="toc_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 11 "widget_toc_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 12 "widget_toc_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 15 "widget_toc_edit.html"
output += stash.get(['loc', [ 'Optionally, specify which page\'s headers and sections to use for the table of contents.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n  <td class="label">';
//line 18 "widget_toc_edit.html"
output += stash.get(['loc', [ 'Page in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 20 "widget_toc_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 21 "widget_toc_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 22 "widget_toc_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 24 "widget_toc_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 25 "widget_toc_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 26 "widget_toc_edit.html"
output += stash.get('toc_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 28 "widget_toc_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n<tr>\n  <td class="label">';
//line 33 "widget_toc_edit.html"
output += stash.get(['loc', [ 'Headers and<br/>sections in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-page_title-rb" value="current" ';
//line 35 "widget_toc_edit.html"
output += stash.get('page_title') ? '' : 'checked';
output += '>\n';
//line 36 "widget_toc_edit.html"
output += stash.get(['loc', [ 'the current page' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 37 "widget_toc_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-page_title-rb" value="other" ';
//line 39 "widget_toc_edit.html"
output += stash.get('page_title') ? 'checked' : '';
output += ' ?>\n  ';
//line 40 "widget_toc_edit.html"
output += stash.get(['loc', [ 'the page titled' ]]);
//line 41 "widget_toc_edit.html"
output += stash.get('toc_st_widget_page_title_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-page_title" name="page_title" value="';
//line 43 "widget_toc_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('page_title');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 53 "widget_toc_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 53 "widget_toc_edit.html"
output += stash.get('toc_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="toc_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 60 "widget_toc_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 61 "widget_toc_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_include_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_include_edit.html"
output += stash.get(['loc', [ 'Page Include' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_include_edit.html"
output += stash.get(['loc', [ 'Display the contents of another page within the current page. Use this form to edit the properties for the page include.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n  <td class="label">';
//line 8 "widget_include_edit.html"
output += stash.get(['loc', [ 'Other page in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 10 "widget_include_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 11 "widget_include_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 12 "widget_include_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 14 "widget_include_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 15 "widget_include_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 16 "widget_include_edit.html"
output += stash.get('include_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 18 "widget_include_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n<tr>\n<td class="label">';
//line 23 "widget_include_edit.html"
output += stash.get(['loc', [ 'Page title:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-page_title" name="page_title" value="';
//line 25 "widget_include_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('page_title');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="include_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 32 "widget_include_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 33 "widget_include_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 36 "widget_include_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for page include.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 44 "widget_include_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 44 "widget_include_edit.html"
output += stash.get('include_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="include_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 51 "widget_include_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 52 "widget_include_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_section_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_section_edit.html"
output += stash.get(['loc', [ 'Section Marker' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_section_edit.html"
output += stash.get(['loc', [ 'Add a section marker at the current cursor location. You can link to a section marker using a "Section Link". Use this form to edit the properties for the section marker.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_section_edit.html"
output += stash.get(['loc', [ 'Section name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-section_name" name="section_name" value="';
//line 10 "widget_section_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('section_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="section_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_section_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_section_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_section_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for a section marker.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_section_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_section_edit.html"
output += stash.get('section_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="section_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_section_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_section_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_recent_changes_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'What\'s New' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'Display a list of pages recently changed in a workspace. By default only the page titles are displayed. Use this form to edit the list properties.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n  <td class="label">';
//line 8 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'Workspace:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 10 "widget_recent_changes_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 11 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 12 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 14 "widget_recent_changes_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 15 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 16 "widget_recent_changes_edit.html"
output += stash.get('recent_changes_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 18 "widget_recent_changes_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n</table>\n</div>\n<div id="recent_changes_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 26 "widget_recent_changes_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 27 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 30 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'Optionally, specify that the page contents should be displayed.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n<tr>\n<td class="label">\n  ';
//line 38 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'Full results:' ]]);
output += '\n</td>\n<td class="st-widget-dialog-editfield">\n<input type="checkbox" name="full"';
//line 41 "widget_recent_changes_edit.html"
if (stash.get('full')) {
output += ' checked="checked"';
}

output += ' />\n</td>\n</tr>\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 47 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 47 "widget_recent_changes_edit.html"
output += stash.get('recent_changes_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="recent_changes_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 54 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 55 "widget_recent_changes_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_hashtag_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_hashtag_edit.html"
output += stash.get(['loc', [ 'Signal Tag Link' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_hashtag_edit.html"
output += stash.get(['loc', [ '' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_hashtag_edit.html"
output += stash.get(['loc', [ ':' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-tag" name="tag" value="';
//line 10 "widget_hashtag_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('tag');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="hashtag_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_hashtag_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_hashtag_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_hashtag_edit.html"
output += stash.get(['loc', [ '' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_hashtag_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_hashtag_edit.html"
output += stash.get('hashtag_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="hashtag_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_hashtag_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_hashtag_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_tag_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_tag_edit.html"
output += stash.get(['loc', [ 'Tag Link' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_tag_edit.html"
output += stash.get(['loc', [ 'Display a link to a list of pages with a specific tag. Use this form to edit the properties of the link.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_tag_edit.html"
output += stash.get(['loc', [ 'Tag name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-tag_name" name="tag_name" value="';
//line 10 "widget_tag_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('tag_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="tag_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_tag_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_tag_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_tag_edit.html"
output += stash.get(['loc', [ 'Optional properties include link text, and the name of a different workspace for the tags.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n<td class="label">';
//line 24 "widget_tag_edit.html"
output += stash.get(['loc', [ 'Link text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-label" name="label" value="';
//line 26 "widget_tag_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('label');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n  <td class="label">';
//line 30 "widget_tag_edit.html"
output += stash.get(['loc', [ 'Search:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 32 "widget_tag_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 33 "widget_tag_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 34 "widget_tag_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 36 "widget_tag_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 37 "widget_tag_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 38 "widget_tag_edit.html"
output += stash.get('tag_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 40 "widget_tag_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 50 "widget_tag_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 50 "widget_tag_edit.html"
output += stash.get('tag_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="tag_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 57 "widget_tag_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 58 "widget_tag_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_tag_list_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'Tag List' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'Display a list of the most recently changed pages in a workspace that have a specific tag. By default only the page title is displayed. Use this form to edit the list properties.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'Tag name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-tag_name" name="tag_name" value="';
//line 10 "widget_tag_list_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('tag_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="tag_list_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_tag_list_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'Optional properties include specifying which workspace to use and whether to display page titles or whole pages.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n  <td class="label">';
//line 24 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'Pages in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 26 "widget_tag_list_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 27 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 28 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 30 "widget_tag_list_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 31 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 32 "widget_tag_list_edit.html"
output += stash.get('tag_list_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 34 "widget_tag_list_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n\n\n<tr>\n<td class="label">\n  ';
//line 44 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'Full results:' ]]);
output += '\n</td>\n<td class="st-widget-dialog-editfield">\n<input type="checkbox" name="full"';
//line 47 "widget_tag_list_edit.html"
if (stash.get('full')) {
output += ' checked="checked"';
}

output += ' />\n</td>\n</tr>\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 53 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 53 "widget_tag_list_edit.html"
output += stash.get('tag_list_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="tag_list_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 60 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 61 "widget_tag_list_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_blog_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_blog_edit.html"
output += stash.get(['loc', [ 'Blog Link' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_blog_edit.html"
output += stash.get(['loc', [ 'Display a link to a blog. Use this form to edit the properties of the link.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_blog_edit.html"
output += stash.get(['loc', [ 'Blog name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-blog_name" name="blog_name" value="';
//line 10 "widget_blog_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('blog_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="blog_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_blog_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_blog_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_blog_edit.html"
output += stash.get(['loc', [ 'Optional properties include link text, and the name of a different workspace for the blog.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n<td class="label">';
//line 24 "widget_blog_edit.html"
output += stash.get(['loc', [ 'Link text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-label" name="label" value="';
//line 26 "widget_blog_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('label');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n  <td class="label">';
//line 30 "widget_blog_edit.html"
output += stash.get(['loc', [ 'Blog on:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 32 "widget_blog_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 33 "widget_blog_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 34 "widget_blog_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 36 "widget_blog_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 37 "widget_blog_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 38 "widget_blog_edit.html"
output += stash.get('blog_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 40 "widget_blog_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 50 "widget_blog_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 50 "widget_blog_edit.html"
output += stash.get('blog_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="blog_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 57 "widget_blog_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 58 "widget_blog_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_blog_list_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'Blog List' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'Display a list of the most recent entries from a blog in a workspace. By default only the blog entry names are displayed. Use this form to edit the list properties.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'Blog name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-blog_name" name="blog_name" value="';
//line 10 "widget_blog_list_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('blog_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="blog_list_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_blog_list_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'Optional parameters include specifying which workspace to use and whether to display page titles or whole pages.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n  <td class="label">';
//line 24 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 26 "widget_blog_list_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 27 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 28 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 30 "widget_blog_list_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 31 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 32 "widget_blog_list_edit.html"
output += stash.get('blog_list_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 34 "widget_blog_list_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n\n\n<tr>\n<td class="label">\n  ';
//line 44 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'Full results:' ]]);
output += '\n</td>\n<td class="st-widget-dialog-editfield">\n<input type="checkbox" name="full"';
//line 47 "widget_blog_list_edit.html"
if (stash.get('full')) {
output += ' checked="checked"';
}

output += ' />\n</td>\n</tr>\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 53 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 53 "widget_blog_list_edit.html"
output += stash.get('blog_list_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="blog_list_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 60 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 61 "widget_blog_list_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_weblog_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'Blog Link' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'Display a link to a blog. Use this form to edit the properties of the link.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'Blog name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-blog_name" name="blog_name" value="';
//line 10 "widget_weblog_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('blog_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="weblog_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_weblog_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'Optional properties include link text, and the name of a different workspace for the blog.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n<td class="label">';
//line 24 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'Link text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-label" name="label" value="';
//line 26 "widget_weblog_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('label');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n  <td class="label">';
//line 30 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'Blog on:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 32 "widget_weblog_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 33 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 34 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 36 "widget_weblog_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 37 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 38 "widget_weblog_edit.html"
output += stash.get('weblog_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 40 "widget_weblog_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 50 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 50 "widget_weblog_edit.html"
output += stash.get('weblog_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="weblog_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 57 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 58 "widget_weblog_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_weblog_list_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'Blog List' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'Display a list of the most recent entries from a blog in a workspace. By default only the blog entry names are displayed. Use this form to edit the list properties.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'Blog name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-blog_name" name="blog_name" value="';
//line 10 "widget_weblog_list_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('blog_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="weblog_list_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_weblog_list_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'Optional parameters include specifying which workspace to use and whether to display page titles or whole pages.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n  <td class="label">';
//line 24 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 26 "widget_weblog_list_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 27 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 28 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 30 "widget_weblog_list_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 31 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 32 "widget_weblog_list_edit.html"
output += stash.get('weblog_list_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 34 "widget_weblog_list_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n\n\n<tr>\n<td class="label">\n  ';
//line 44 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'Full results:' ]]);
output += '\n</td>\n<td class="st-widget-dialog-editfield">\n<input type="checkbox" name="full"';
//line 47 "widget_weblog_list_edit.html"
if (stash.get('full')) {
output += ' checked="checked"';
}

output += ' />\n</td>\n</tr>\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 53 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 53 "widget_weblog_list_edit.html"
output += stash.get('weblog_list_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="weblog_list_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 60 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 61 "widget_weblog_list_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_fetchrss_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_fetchrss_edit.html"
output += stash.get(['loc', [ 'Inline RSS' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_fetchrss_edit.html"
output += stash.get(['loc', [ 'Display the content of an RSS feed. Use this form to edit the properties of the inline RSS feed.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_fetchrss_edit.html"
output += stash.get(['loc', [ 'RSS feed URL:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-rss_url" name="rss_url" value="';
//line 10 "widget_fetchrss_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('rss_url');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="fetchrss_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_fetchrss_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_fetchrss_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_fetchrss_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for an RSS feed.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_fetchrss_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_fetchrss_edit.html"
output += stash.get('fetchrss_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="fetchrss_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_fetchrss_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_fetchrss_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_fetchatom_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_fetchatom_edit.html"
output += stash.get(['loc', [ 'Inline Atom' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_fetchatom_edit.html"
output += stash.get(['loc', [ 'Display the content of an Atom feed. Use this form to edit the properties of the inline Atom feed.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_fetchatom_edit.html"
output += stash.get(['loc', [ 'Atom feed URL:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-atom_url" name="atom_url" value="';
//line 10 "widget_fetchatom_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('atom_url');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="fetchatom_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_fetchatom_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_fetchatom_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_fetchatom_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for an Atom feed.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_fetchatom_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_fetchatom_edit.html"
output += stash.get('fetchatom_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="fetchatom_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_fetchatom_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_fetchatom_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_search_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_search_edit.html"
output += stash.get(['loc', [ 'Search Results' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_search_edit.html"
output += stash.get(['loc', [ 'Display the search results for the given phrase within a workspace. Use this form to edit the properties for the search.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_search_edit.html"
output += stash.get(['loc', [ 'Search term:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-search_term" name="search_term" value="';
//line 10 "widget_search_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('search_term');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="search_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_search_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_search_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_search_edit.html"
output += stash.get(['loc', [ 'Optional properties include the name of the workspace to search, whether to search in the page title, text or tags, and whether to display full results or just page titles.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n<tr>\n  <td class="label">';
//line 24 "widget_search_edit.html"
output += stash.get(['loc', [ 'In:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 26 "widget_search_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 27 "widget_search_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 28 "widget_search_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 30 "widget_search_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 31 "widget_search_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 32 "widget_search_edit.html"
output += stash.get('search_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 34 "widget_search_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n\n\n<tr>\n<td class="label">\n';
//line 42 "widget_search_edit.html"
output += stash.get(['loc', [ 'Search type:' ]]);
output += '\n</td>\n<td class="st-widget-dialog-editfield">\n<input type="radio" name="search_type" value="text"\n';
//line 46 "widget_search_edit.html"
if (stash.get('search_type') == 'text' || stash.get('search_type') == '') {
output += 'checked="checked"';
}

output += '\n/>';
//line 47 "widget_search_edit.html"
output += stash.get(['loc', [ 'Text' ]]);
output += '\n<input type="radio" name="search_type" value="category"\n';
//line 49 "widget_search_edit.html"
if (stash.get('search_type') == 'category') {
output += 'checked="checked"';
}

output += '\n/>';
//line 50 "widget_search_edit.html"
output += stash.get(['loc', [ 'Tag' ]]);
output += '\n<input type="radio" name="search_type" value="title"\n';
//line 52 "widget_search_edit.html"
if (stash.get('search_type') == 'title') {
output += 'checked="checked"';
}

output += '\n/>';
//line 53 "widget_search_edit.html"
output += stash.get(['loc', [ 'Title' ]]);
output += '\n</td>\n</tr>\n\n\n\n<tr>\n<td class="label">\n  ';
//line 61 "widget_search_edit.html"
output += stash.get(['loc', [ 'Full results:' ]]);
output += '\n</td>\n<td class="st-widget-dialog-editfield">\n<input type="checkbox" name="full"';
//line 64 "widget_search_edit.html"
if (stash.get('full')) {
output += ' checked="checked"';
}

output += ' />\n</td>\n</tr>\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 70 "widget_search_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 70 "widget_search_edit.html"
output += stash.get('search_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="search_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 77 "widget_search_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 78 "widget_search_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_googlesoap_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_googlesoap_edit.html"
output += stash.get(['loc', [ 'Google Search' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_googlesoap_edit.html"
output += stash.get(['loc', [ 'Display the results from a Google search. Use this form to edit the properties for the search.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_googlesoap_edit.html"
output += stash.get(['loc', [ 'Search for:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-search_term" name="search_term" value="';
//line 10 "widget_googlesoap_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('search_term');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="googlesoap_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_googlesoap_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_googlesoap_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_googlesoap_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for an Google search.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_googlesoap_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_googlesoap_edit.html"
output += stash.get('googlesoap_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="googlesoap_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_googlesoap_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_googlesoap_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_googlesearch_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_googlesearch_edit.html"
output += stash.get(['loc', [ 'Google Search' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_googlesearch_edit.html"
output += stash.get(['loc', [ 'Display the results from a Google search. Use this form to edit the properties for the search.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_googlesearch_edit.html"
output += stash.get(['loc', [ 'Search for:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-search_term" name="search_term" value="';
//line 10 "widget_googlesearch_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('search_term');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="googlesearch_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_googlesearch_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_googlesearch_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_googlesearch_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for an Google search.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_googlesearch_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_googlesearch_edit.html"
output += stash.get('googlesearch_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="googlesearch_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_googlesearch_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_googlesearch_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_technorati_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_technorati_edit.html"
output += stash.get(['loc', [ 'Technorati Search' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_technorati_edit.html"
output += stash.get(['loc', [ 'Display the results for a Technorati search. Use this form to edit the properties for the search.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_technorati_edit.html"
output += stash.get(['loc', [ 'Search for:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-search_term" name="search_term" value="';
//line 10 "widget_technorati_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('search_term');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="technorati_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_technorati_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_technorati_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_technorati_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for a Technorati search.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_technorati_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_technorati_edit.html"
output += stash.get('technorati_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="technorati_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_technorati_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_technorati_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_aim_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_aim_edit.html"
output += stash.get(['loc', [ 'AIM Link' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_aim_edit.html"
output += stash.get(['loc', [ 'Display a link to an AIM screen name. The icon will show whether the person is online. Clicking the link will start an IM conversation with the person if your IM client is properly configured. Use this form to edit the properties of the link.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_aim_edit.html"
output += stash.get(['loc', [ 'AIM screen name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-aim_id" name="aim_id" value="';
//line 10 "widget_aim_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('aim_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="aim_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_aim_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_aim_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_aim_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for an AIM link.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_aim_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_aim_edit.html"
output += stash.get('aim_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="aim_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_aim_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_aim_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_yahoo_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_yahoo_edit.html"
output += stash.get(['loc', [ 'Yahoo! IM Link' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_yahoo_edit.html"
output += stash.get(['loc', [ 'Display a link to a Yahoo! instant message ID. The icon will show whether the person is online. Clicking the link will start an IM conversation with the person if your IM client is properly configured. Use this form to edit the properties of the link.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_yahoo_edit.html"
output += stash.get(['loc', [ 'Yahoo! ID:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-yahoo_id" name="yahoo_id" value="';
//line 10 "widget_yahoo_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('yahoo_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="yahoo_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_yahoo_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_yahoo_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_yahoo_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for a Yahoo! link.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_yahoo_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_yahoo_edit.html"
output += stash.get('yahoo_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="yahoo_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_yahoo_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_yahoo_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_skype_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_skype_edit.html"
output += stash.get(['loc', [ 'Skype Link' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_skype_edit.html"
output += stash.get(['loc', [ 'Display a link to a Skype name. Clicking the link will start a Skype call with the person if your Skype client is properly configured. Use this form to edit the properties of the link.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_skype_edit.html"
output += stash.get(['loc', [ 'Skype name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-skype_id" name="skype_id" value="';
//line 10 "widget_skype_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('skype_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="skype_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_skype_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_skype_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_skype_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for a Skype link.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_skype_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_skype_edit.html"
output += stash.get('skype_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="skype_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_skype_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_skype_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_user_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_user_edit.html"
output += stash.get(['loc', [ 'User Name' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_user_edit.html"
output += stash.get(['loc', [ 'Display the full name for the given email address or user name. Use this form to edit the properties of the user name.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_user_edit.html"
output += stash.get(['loc', [ 'User\'s email:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-user_email" name="user_email" value="';
//line 10 "widget_user_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('user_email');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="user_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_user_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_user_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_user_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for a user name.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_user_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_user_edit.html"
output += stash.get('user_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="user_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_user_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_user_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_date_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_date_edit.html"
output += stash.get(['loc', [ 'Date in Local Time' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_date_edit.html"
output += stash.get(['loc', [ 'Display the given date and time in the individually-set time zone for each reader. Use this form to edit the date and time to be displayed' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_date_edit.html"
output += stash.get(['loc', [ 'YYYY-MM-DD&nbsp;HH:MM:SS:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-date_string" name="date_string" value="';
//line 10 "widget_date_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('date_string');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="date_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_date_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_date_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_date_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for a date display.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_date_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_date_edit.html"
output += stash.get('date_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="date_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_date_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_date_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_asis_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_asis_edit.html"
output += stash.get(['loc', [ 'Unformatted' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_asis_edit.html"
output += stash.get(['loc', [ 'Include unformatted text in the page. This text will not be treated as wiki text. Use this form to edit the text.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_asis_edit.html"
output += stash.get(['loc', [ 'Unformatted content:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-asis_content" name="asis_content" value="';
//line 10 "widget_asis_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('asis_content');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="asis_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 17 "widget_asis_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 18 "widget_asis_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 21 "widget_asis_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for unformatted text.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 29 "widget_asis_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 29 "widget_asis_edit.html"
output += stash.get('asis_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="asis_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 36 "widget_asis_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 37 "widget_asis_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_new_form_page_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'New Form Page' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'Select a form and generates a new form page.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n<td class="label">';
//line 8 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'Form name:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-form_name" name="form_name" value="';
//line 10 "widget_new_form_page_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('form_name');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n<td class="label">';
//line 14 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'Link text:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-form_text" name="form_text" value="';
//line 16 "widget_new_form_page_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('form_text');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="new_form_page_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 23 "widget_new_form_page_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 24 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 27 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for a new form page.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 35 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 35 "widget_new_form_page_edit.html"
output += stash.get('new_form_page_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="new_form_page_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 42 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 43 "widget_new_form_page_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

Jemplate.templateMap['widget_ss_edit.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<span class="title">';
//line 1 "widget_ss_edit.html"
output += stash.get(['loc', [ 'Spreadsheet Include' ]]);
output += '</span>\n<form>\n<div class="st-widget-dialog">\n<p class="st-widget-description">';
//line 4 "widget_ss_edit.html"
output += stash.get(['loc', [ 'Display the contents of a spreadsheet within the current page. Use this form to edit the properties for the spreadsheet include.' ]]);
output += '</p>\n<div id="st-widgets-standardoptionspanel">\n<table class="st-widgets-optionstable">\n<tr>\n  <td class="label">';
//line 8 "widget_ss_edit.html"
output += stash.get(['loc', [ 'Other spreadsheet in:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <p class="st-widget-dialog-defaultradio"><input type="radio" name="st-widget-workspace_id-rb" value="current" ';
//line 10 "widget_ss_edit.html"
output += stash.get('workspace_id') ? '' : 'checked';
output += '>\n';
//line 11 "widget_ss_edit.html"
output += stash.get(['loc', [ 'the current workspace' ]]);
output += '\n<i>&nbsp;&nbsp;';
//line 12 "widget_ss_edit.html"
output += stash.get(['loc', [ 'or' ]]);
output += '</i></p>\n<p class="st-widget-dialog-choiceradio">\n  <input type="radio" name="st-widget-workspace_id-rb" value="other" ';
//line 14 "widget_ss_edit.html"
output += stash.get('workspace_id') ? 'checked' : '';
output += ' ?>\n  ';
//line 15 "widget_ss_edit.html"
output += stash.get(['loc', [ 'the workspace named' ]]);
//line 16 "widget_ss_edit.html"
output += stash.get('ss_st_widget_workspace_id_rb');
output += '&nbsp;\n<input size="25" type="text" id="st-widget-workspace_id" name="workspace_id" value="';
//line 18 "widget_ss_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('workspace_id');

    return context.filter(output, 'html', []);
})();

output += '"/>\n</p>\n</td>\n</tr>\n<tr>\n<td class="label">';
//line 23 "widget_ss_edit.html"
output += stash.get(['loc', [ 'Spreadsheet title:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-spreadsheet_title" name="spreadsheet_title" value="';
//line 25 "widget_ss_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('spreadsheet_title');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n<tr>\n<td class="label">';
//line 29 "widget_ss_edit.html"
output += stash.get(['loc', [ 'Spreadsheet cell:' ]]);
output += '</td>\n  <td class="st-widget-dialog-editfield">\n    <input size="40" type="text" id="st-widget-spreadsheet_cell" name="spreadsheet_cell" value="';
//line 31 "widget_ss_edit.html"

// FILTER
output += (function() {
    var output = '';

output += stash.get('spreadsheet_cell');

    return context.filter(output, 'html', []);
})();

output += '"/>\n  </td>\n</tr>\n</table>\n</div>\n<div id="ss_widget_edit_error_msg" class="widget_edit_error_msg"></div>\n<div class="st-widgets-options">\n    <img id="st-widgets-optionsicon" src="';
//line 38 "widget_ss_edit.html"
output += stash.get('skin_path');
output += '/images/st/show_more.gif">\n    <a id="st-widgets-moreoptions" href="#">';
//line 39 "widget_ss_edit.html"
output += stash.get(['loc', [ 'More options' ]]);
output += '</a>\n</div>\n<div id="st-widgets-moreoptionspanel">\n<p class="st-widget-description">';
//line 42 "widget_ss_edit.html"
output += stash.get(['loc', [ 'There are no optional properties for spreadsheet include.' ]]);
output += '</p>\n<table class="st-widgets-moreoptionstable">\n\n\n\n\n</table>\n<div class="st-widgetdialog-wikitext">\n    <span class="label">';
//line 50 "widget_ss_edit.html"
output += stash.get(['loc', [ 'wiki text' ]]);
//line 50 "widget_ss_edit.html"
output += stash.get('ss_st_widgetdialog_wikitext');
output += '\n</span>\n    <span class="wikitext" id="ss_wafl_text">&nbsp;</span>\n</div>\n</div>\n</div>\n<div class="buttons">\n    <input id="st-widget-savebutton" type="submit" value=';
//line 57 "widget_ss_edit.html"
output += stash.get(['loc', [ 'Save' ]]);
output += ' />\n    <input id="st-widget-cancelbutton" type="reset" value=';
//line 58 "widget_ss_edit.html"
output += stash.get(['loc', [ 'Cancel' ]]);
output += ' />\n</div>\n</form>\n\n\n\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

;
// BEGIN widgets widget_menu.tt2
/*
   This JavaScript code was generated by Jemplate, the JavaScript
   Template Toolkit. Any changes made to this file will be lost the next
   time the templates are compiled.

   Copyright 2006-2008 - Ingy döt Net - All rights reserved.
*/

if (typeof(Jemplate) == 'undefined')
    throw('Jemplate.js must be loaded before any Jemplate template files');

Jemplate.templateMap['insert_widget_menu'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<ul id="st-editing-insert-menu">\n  <li><a href="#" onclick="return false">Insert</a>\n    <ul>\n      \n      <li><a href="#" onclick="return false;" do="do_widget_ss">Spreadsheet</a></li>\n      \n      <li><a href="#" onclick="return false;" do="do_widget_image">Image</a></li>\n      \n      <li><a href="#" onclick="return false;" do="do_table">Table</a></li>\n      \n      <li><a href="#" onclick="return false;" do="do_hr">Horizontal&nbsp;Line</a></li>\n      <li><a href="#" onclick="return false">A&nbsp;link&nbsp;to...</a>\n        <ul>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_file">A&nbsp;file&nbsp;attached&nbsp;to&nbsp;this&nbsp;page</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_link2_section">A&nbsp;section&nbsp;in&nbsp;this&nbsp;page</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_link2">A&nbsp;different&nbsp;wiki&nbsp;page</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_blog">A&nbsp;person\'s&nbsp;blog</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_tag">Pages&nbsp;related&nbsp;to&nbsp;a&nbsp;tag</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_link2_hyperlink">A&nbsp;page&nbsp;on&nbsp;the&nbsp;web</a></li>\n        </ul>\n      </li>\n      <li><a href="#" onclick="return false">From&nbsp;workspaces...</a>\n        <ul>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_include">A&nbsp;page&nbsp;include</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_ss">A&nbsp;spreadsheet&nbsp;include</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_tag_list">Tagged&nbsp;pages</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_recent_changes">Recent&nbsp;changes</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_blog_list">Blog&nbsp;postings</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_search">Wiki&nbsp;search&nbsp;results</a></li>\n        </ul>\n      </li>\n      <li><a href="#" onclick="return false">From&nbsp;the&nbsp;web...</a>\n        <ul>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_googlesearch">Google&nbsp;search&nbsp;results</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_technorati">Technorati&nbsp;results</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_fetchrss">RSS&nbsp;feed&nbsp;items</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_fetchatom">Atom&nbsp;feed&nbsp;items</a></li>\n        </ul>\n      </li>\n      <li><a href="#" onclick="return false">Organizing&nbsp;your&nbsp;page...</a>\n        <ul>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_toc">Table&nbsp;of&nbsp;contents</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_section">Section&nbsp;marker</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_hr">Horizontal&nbsp;line</a></li>\n        </ul>\n      </li>\n      <li><a href="#" onclick="return false">Communicating...</a>\n        <ul>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_skype">Skype&nbsp;link</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_aim">AIM&nbsp;link</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_yahoo">Yahoo!&nbsp;Messenger&nbsp;link</a></li>\n        </ul>\n      </li>\n      <li><a href="#" onclick="return false">Name&nbsp;&&nbsp;Date...</a>\n        <ul>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_user">User&nbsp;name</a></li>\n      \n          <li><a href="#" onclick="return false;" do="do_widget_date">Local&nbsp;Date&nbsp;&&nbsp;Time</a></li>\n        </ul>\n      </li>\n      \n      <li><a href="#" onclick="return false;" do="do_widget_asis">Unformatted&nbsp;text...</a></li>\n    </ul>\n  </li>\n</ul>\n\n<div id="menu-style-reset" style="clear: both" />\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

;
;
// BEGIN lib/Wikiwyg.js
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

;
// BEGIN Widgets.js
// BEGIN Widgets.yaml
Wikiwyg.Widgets = {"widgets":["link2","link2_hyperlink","link2_section","image","file","toc","include","section","recent_changes","hashtag","tag","tag_list","blog","blog_list","weblog","weblog_list","fetchrss","fetchatom","search","googlesoap","googlesearch","technorati","aim","yahoo","skype","user","date","asis","new_form_page","ss"],"api_for_title":{"workspace_id":"/data/workspaces/:workspace_id"},"match":{"skype_id":"^(\\S+)$","workspace_id":"^[a-z0-9_\\-]+$","user_email":"^([a-zA-Z0-9_\\+\\.\\-\\&\\!\\%\\+\\$\\*\\^\\']+\\@(([a-zA-Z0-9\\-])+\\.)+([a-zA-Z0-9:]{2,4})+)$","yahoo_id":"^(\\S+)$","aim_id":"^(\\S+)$","date_string":"^(\\d{4}-\\d{2}-\\d{2}\\s+\\d{2}:\\d{2}:\\d{2}.*)$"},"fields":{"search_term":"Search term","blog_name":"Blog name","tag_name":"Tag name","image_name":"Image name","form_name":"Form name","date_string":"YYYY-MM-DD&nbsp;HH:MM:SS","section_name":"Section name","file_name":"File name","form_text":"Link text","user_email":"User\\'s email","page_title":"Page title","workspace_id":"Workspace","skype_id":"Skype name","relative_url":"Relative URL","spreadsheet_title":"Spreadsheet title","rss_url":"RSS feed URL","atom_url":"Atom feed URL","spreadsheet_cell":"Spreadsheet cell","asis_content":"Unformatted content","label":"Link text","aim_id":"AIM screen name","yahoo_id":"Yahoo! ID"},"synonyms":{"callto":"skype","category_list":"tag_list","callme":"skype","ymsgr":"yahoo","category":"tag"},"regexps":{"workspace-value":"^(?:(\\S+);)?\\s*(.*?)?\\s*$","three-part-link":"^(\\S*)?\\s*\\[([^\\]]*)\\]\\s*(.*?)?\\s*$"},"widget":{"search":{"input":{"workspace_id":"radio"},"parse":{"fields":["workspace_id","search_term"],"regexp":"^(?:<(\\S+)>)?\\s*(.*?)?\\s*$"},"pdfields":["workspace_id"],"color":"gold4","required":["search_term"],"desc":"Display the search results for the given phrase within a workspace. Use this form to edit the properties for the search.","id":"search","image_text":[{"text":"search: %search_term","field":"default"}],"labels":{"seach_term":"Search for","workspace_id":"In"},"more_desc":"Optional properties include the name of the workspace to search, whether to search in the page title, text or tags, and whether to display full results or just page titles.","title_and_id":{"workspace_id":{"title":null,"id":null}},"full":"off","pattern":"{search: <%workspace_id> %search_term}","fields":["search_term","workspace_id"],"title":{"default":"Search for '$search_term'. Click to edit.","full":"Display result for searching '$search_term'. Click to edit."},"label":"Search Results"},"date":{"more_desc":"There are no optional properties for a date display.","pattern":"{date: %date_string}","color":"royalblue","desc":"Display the given date and time in the individually-set time zone for each reader. Use this form to edit the date and time to be displayed","title":"Display '$date_string' in reader's time zone. Click to edit.","label":"Date in Local Time","id":"date","image_text":[{"text":"date: %date_string","field":"default"}],"field":"date_string"},"tag_list":{"input":{"workspace_id":"radio"},"parse":{"fields":["workspace_id","tag_name"],"regexp":"^(?:<(\\S+)>)?\\s*(.*?)?\\s*$"},"pdfields":["workspace_id"],"color":"darkviolet","required":["tag_name"],"desc":"Display a list of the most recently changed pages in a workspace that have a specific tag. By default only the page title is displayed. Use this form to edit the list properties.","id":"tag_list","image_text":[{"text":"tag list: %tag_name","field":"default"}],"labels":{"workspace_id":"Pages in"},"more_desc":"Optional properties include specifying which workspace to use and whether to display page titles or whole pages.","title_and_id":{"workspace_id":{"title":null,"id":null}},"full":"off","pattern":"{tag_list: <%workspace_id> %tag_name}","fields":["tag_name","workspace_id"],"title":{"default":"Pages with the '$tag_name' tag. Click to edit.","full":"Display pages with the '$tag_name' tag. Click to edit."},"label":"Tag List"},"file":{"checks":["require_page_if_workspace"],"input":{"workspace_id":"radio","page_title":"radio"},"parse":{"fields":["workspace_id","page_title","file_name"],"regexp":"?three-part-link","no_match":"file_name"},"pdfields":["workspace_id","page_title","label"],"color":"brown","required":["file_name"],"desc":"Display a link to a file attached to a page. Use this form to edit the properities of the link.","id":"file","image_text":[{"text":"file: %label","field":"label"},{"text":"file: %file_name","field":"default"}],"labels":{"workspace_id":"Page in","file_name":"Attachment filename","page_title":"File attached to"},"more_desc":"Optional properties include specifying a different page for the attachment, and link text.","title_and_id":{"workspace_id":{"title":null,"id":null}},"pattern":"\"%label\"{file: %workspace_id [%page_title] %file_name}","fields":["file_name","workspace_id","page_title","label"],"title":"Link to file '$file_name'. Click to edit.","label":"Attachment Link"},"hashtag":{"pattern":"{hashtag: %tag}","color":"green","required":["tag"],"fields":["tag"],"title":"Link to tag '$tag'. Click to edit.","label":"Signal Tag Link","id":"hashtag","image_text":[{"text":"#%tag","field":"tag"}]},"ss":{"checks":["require_page_if_workspace"],"input":{"workspace_id":"radio"},"parse":{"regexp":"?three-part-link"},"pdfields":[],"color":"pink","required":["spreadsheet_title"],"desc":"Display the contents of a spreadsheet within the current page. Use this form to edit the properties for the spreadsheet include.","id":"ss","image_text":[{"text":"ss: %spreadsheet_title (%spreadsheet_cell)","field":"default"}],"labels":{"workspace_id":"Other spreadsheet in"},"more_desc":"There are no optional properties for spreadsheet include.","title_and_id":{"workspace_id":{"title":null,"id":null}},"pattern":"{ss: %workspace_id [%spreadsheet_title] %spreadsheet_cell}","fields":["workspace_id","spreadsheet_title","spreadsheet_cell"],"title":"Include the page '$spreadsheete_title'. Click to edit.","label":"Spreadsheet Include"},"irc":{"color":"darkorange","title":"IRC link. Edit in Wiki Text mode.","id":"irc","uneditable":"true"},"http":{"color":"darkorange","title":"Relative HTTP link. Edit in Wiki Text mode.","id":"http","uneditable":"true"},"link2_hyperlink":{"more_desc":"Optional properties include the text to display for the link.","hide_in_menu":"true","primary_field":"url","pdfields":["label","url"],"color":"blue","pattern":"\"%label\"{link: %workspace_id [%page_title] %section_name}","required":["url"],"fields":["label","url"],"desc":"Use this form to edit the properties of the link to a web page.","title":"Link to '$url'. Click to edit.","id":"link2_hyperlink","label":"Link to a Web Page","labels":{"url":"Link destination","label":"Linked text"}},"user":{"more_desc":"There are no optional properties for a user name.","pattern":"{user: %user_email}","color":"darkgoldenrod","required":["user_email"],"desc":"Display the full name for the given email address or user name. Use this form to edit the properties of the user name.","title":"User mention. Click to edit.","label":"User Name","id":"user","image_text":[{"text":"user: %user_email","field":"default"}],"field":"user_email"},"tag":{"more_desc":"Optional properties include link text, and the name of a different workspace for the tags.","input":{"workspace_id":"radio"},"parse":{"fields":["workspace_id","tag_name"],"regexp":"?workspace-value","no_match":"tag_name"},"title_and_id":{"workspace_id":{"title":null,"id":null}},"pdfields":["label","workspace_id"],"color":"green","pattern":"\"%label\"{tag: %workspace_id; %tag_name}","required":["tag_name"],"fields":["tag_name","label","workspace_id"],"desc":"Display a link to a list of pages with a specific tag. Use this form to edit the properties of the link.","id":"tag","label":"Tag Link","title":"Link to tag '$tag_name'. Click to edit.","image_text":[{"text":"tag: %label","field":"label"},{"text":"tag: %tag_name","field":"tag_name"}],"labels":{"workspace_id":"Search"}},"yahoo":{"more_desc":"There are no optional properties for a Yahoo! link.","pattern":"yahoo:%yahoo_id","required":["yahoo_id"],"desc":"Display a link to a Yahoo! instant message ID. The icon will show whether the person is online. Clicking the link will start an IM conversation with the person if your IM client is properly configured. Use this form to edit the properties of the link.","markup":["bound_phrase","yahoo:",""],"title":"Instant message to '$yahoo_id' using Yahoo! Click to edit.","label":"Yahoo! IM Link","id":"yahoo","image_text":[{"text":"Yahoo! IM: %yahoo_id","field":"default"}],"field":"yahoo_id"},"blog_list":{"input":{"workspace_id":"radio"},"parse":{"fields":["workspace_id","blog_name"],"regexp":"^(?:<(\\S+)>)?\\s*(.*?)?\\s*$"},"pdfields":["workspace_id"],"color":"forestgreen","required":["blog_name"],"desc":"Display a list of the most recent entries from a blog in a workspace. By default only the blog entry names are displayed. Use this form to edit the list properties.","id":"blog_list","image_text":[{"text":"blog list: %blog_name","field":"default"}],"labels":{"workspace_id":"in"},"more_desc":"Optional parameters include specifying which workspace to use and whether to display page titles or whole pages.","title_and_id":{"workspace_id":{"title":null,"id":null}},"full":"off","pattern":"{blog_list: <%workspace_id> %blog_name}","fields":["workspace_id","blog_name"],"title":{"default":"Include the blog '$blog_name'. Click to edit.","full":"Display the blog '$blog_name'. Click to edit."},"label":"Blog List"},"googlesoap":{"more_desc":"There are no optional properties for an Google search.","color":"saddlebrown","pattern":"{googlesoap: %search_term}","desc":"Display the results from a Google search. Use this form to edit the properties for the search.","id":"googlesoap","label":"Google Search","title":"Search Google for '$search_term'. Click to edit.","labels":{"search_term":"Search for"},"image_text":[{"text":"Google: %search_term","field":"default"}],"field":"search_term"},"new_form_page":{"more_desc":"There are no optional properties for a new form page.","parse":{"regexp":"^\\s*(\\S+)\\s+(.+)\\s*$"},"on_menu":"false","color":"maroon","pattern":"{new_form_page: %form_name %form_text}","fields":["form_name","form_text"],"required":["form_name","form_text"],"desc":"Select a form and generates a new form page.","id":"new_form_page","label":"New Form Page","title":"Use $form_name to generate a form. Click to edit.","image_text":[{"text":"form: %form_name","field":"default"}]},"sharepoint":{"color":"red","title":"Sharepoint link. Edit in Wiki Text mode.","id":"sharepoint","uneditable":"true"},"skype":{"more_desc":"There are no optional properties for a Skype link.","pattern":"skype:%skype_id","required":["skype_id"],"desc":"Display a link to a Skype name. Clicking the link will start a Skype call with the person if your Skype client is properly configured. Use this form to edit the properties of the link.","markup":["bound_phrase","skype:",""],"title":"Call '$skype_id' using Skype. Click to edit.","label":"Skype Link","id":"skype","image_text":[{"text":"Skype: %skype_id","field":"default"}],"field":"skype_id"},"https":{"color":"darkorange","title":"HTTP relative link. Edit in Wiki Text mode.","id":"https","uneditable":"true"},"recent_changes":{"more_desc":"Optionally, specify that the page contents should be displayed.","input":{"workspace_id":"radio"},"parse":{"regexp":"^\\s*(.*?)?\\s*$"},"title_and_id":{"workspace_id":{"title":null,"id":null}},"full":"off","color":"gold","pattern":"{recent_changes: %workspace_id}","fields":["workspace_id"],"desc":"Display a list of pages recently changed in a workspace. By default only the page titles are displayed. Use this form to edit the list properties.","id":"recent_changes","label":"What\\'s New","title":{"default":"What's new in the '$workspace_id' workspace. Click to edit.","full":"Display what's new in the '$workspace_id' workspace. Click to edit."},"image_text":[{"text":"recent changes: %workspace_id","field":"workspace_id"},{"text":"recent changes","field":"default"}],"labels":{"workspace_id":"Workspace"}},"include":{"checks":["require_page_if_workspace"],"input":{"workspace_id":"radio"},"parse":{"regexp":"^(\\S*)?\\s*\\[([^\\]]*)\\]\\s*$"},"pdfields":[],"color":"darkblue","required":["page_title"],"desc":"Display the contents of another page within the current page. Use this form to edit the properties for the page include.","id":"include","image_text":[{"text":"include: %page_title","field":"default"}],"labels":{"workspace_id":"Other page in"},"more_desc":"There are no optional properties for page include.","title_and_id":{"workspace_id":{"title":null,"id":null}},"pattern":"{include: %workspace_id [%page_title]}","fields":["workspace_id","page_title"],"title":"Include the page '$page_title'. Click to edit.","label":"Page Include"},"googlesearch":{"more_desc":"There are no optional properties for an Google search.","color":"saddlebrown","pattern":"{googlesearch: %search_term}","desc":"Display the results from a Google search. Use this form to edit the properties for the search.","id":"googlesearch","label":"Google Search","title":"Search Google for '$search_term'. Click to edit.","labels":{"search_term":"Search for"},"image_text":[{"text":"Google: %search_term","field":"default"}],"field":"search_term"},"section":{"more_desc":"There are no optional properties for a section marker.","pattern":"{section: %section_name}","color":"darkred","desc":"Add a section marker at the current cursor location. You can link to a section marker using a \"Section Link\". Use this form to edit the properties for the section marker.","title":"Section marker '$section_name'. Click to edit.","label":"Section Marker","id":"section","image_text":[{"text":"section: %section_name","field":"default"}],"field":"section_name"},"weblog_list":{"input":{"workspace_id":"radio"},"parse":{"fields":["workspace_id","blog_name"],"regexp":"^(?:<(\\S+)>)?\\s*(.*?)?\\s*$"},"pdfields":["workspace_id"],"color":"forestgreen","required":["blog_name"],"desc":"Display a list of the most recent entries from a blog in a workspace. By default only the blog entry names are displayed. Use this form to edit the list properties.","id":"weblog_list","image_text":[{"text":"blog list: %blog_name","field":"default"}],"labels":{"workspace_id":"in"},"more_desc":"Optional parameters include specifying which workspace to use and whether to display page titles or whole pages.","title_and_id":{"workspace_id":{"title":null,"id":null}},"full":"off","pattern":"{weblog_list: <%workspace_id> %blog_name}","fields":["workspace_id","blog_name"],"title":{"default":"Include the blog '$blog_name'. Click to edit.","full":"Display the blog '$blog_name'. Click to edit."},"label":"Blog List"},"ftp":{"color":"darkorange","title":"FTP link. Edit in Wiki Text mode.","id":"ftp","uneditable":"true"},"html":{"color":"indianred","title":"Raw HTML section. Edit in Wiki Text mode.","id":"html","uneditable":"true"},"unknown":{"color":"darkslategrey","title":"Unknown widget '$unknown_id'. Edit in Wiki Text mode.","id":"unknown","uneditable":"true"},"technorati":{"more_desc":"There are no optional properties for a Technorati search.","color":"darkmagenta","pattern":"{technorati: %search_term}","desc":"Display the results for a Technorati search. Use this form to edit the properties for the search.","id":"technorati","label":"Technorati Search","title":"Search Technorati for '$search_term'. Click to edit.","labels":{"search_term":"Search for"},"image_text":[{"text":"Technorati: %search_term","field":"default"}],"field":"search_term"},"toc":{"more_desc":"Optionally, specify which page\\'s headers and sections to use for the table of contents.","checks":["require_page_if_workspace"],"input":{"workspace_id":"radio","page_title":"radio"},"parse":{"regexp":"^(\\S*)?\\s*\\[([^\\]]*)\\]\\s*$","no_match":"workspace_id"},"title_and_id":{"workspace_id":{"title":null,"id":null}},"pdfields":["workspace_id","page_title"],"color":"darkseagreen","pattern":"{toc: %workspace_id [%page_title]}","fields":["workspace_id","page_title"],"desc":"Display a table of contents for a page. Each header or section on the page is listed as a link in the table of contents. Click \"Save\" now, or click \"More options\" to edit the properties for the table of contents.","id":"toc","label":"Table of Contents","title":"Table of contents for '$page_title'. Click to edit.","image_text":[{"text":"toc: %page_title","field":"page_title"},{"text":"toc","field":"default"}],"labels":{"workspace_id":"Page in","page_title":"Headers and<br/>sections in"}},"link2":{"checks":["require_page_if_workspace"],"input":{"workspace_id":"radio","page_title":"radio"},"parse":{"fields":["workspace_id","page_title","section_name"],"regexp":"?three-part-link","no_match":"section_name"},"primary_field":"section_name","pdfields":["label","workspace_id","page_title"],"color":"blue","select_if":{"blank":["workspace_id"]},"required":["section_name"],"desc":"Use this form to edit the properties of the link to a page section.","id":"link2","image_text":[{"text":"link: %label","field":"label"},{"text":"link: %page_title (%section_name )","field":"page_title"},{"text":"link: %section_name","field":"default"}],"labels":{"workspace_id":"Workspace"},"more_desc":"Optional properties include the text to display for the link, and the title of a different page.","hide_in_menu":"true","title_and_id":{"workspace_id":{"title":null,"id":null}},"pattern":"\"%label\"{link: %workspace_id [%page_title] %section_name}","fields":["section_name","label","workspace_id","page_title"],"label":"Link to a Wiki page","title":"Link to $workspace_id: '$page_title' $section_name. Click to edit."},"weblog":{"more_desc":"Optional properties include link text, and the name of a different workspace for the blog.","input":{"workspace_id":"radio"},"parse":{"fields":["workspace_id","blog_name"],"regexp":"?workspace-value","no_match":"blog_name"},"title_and_id":{"workspace_id":{"title":null,"id":null}},"pdfields":["label","workspace_id"],"color":"purple","pattern":"\"%label\"{weblog: %workspace_id; %blog_name}","required":["blog_name"],"fields":["label","blog_name","workspace_id"],"desc":"Display a link to a blog. Use this form to edit the properties of the link.","id":"weblog","label":"Blog Link","title":"Link to blog '$blog_name'. Click to edit.","image_text":[{"text":"blog: %label","field":"label"},{"text":"blog: %blog_name","field":"default"}],"labels":{"workspace_id":"Blog on"}},"blog":{"more_desc":"Optional properties include link text, and the name of a different workspace for the blog.","input":{"workspace_id":"radio"},"parse":{"fields":["workspace_id","blog_name"],"regexp":"?workspace-value","no_match":"blog_name"},"title_and_id":{"workspace_id":{"title":null,"id":null}},"pdfields":["label","workspace_id"],"color":"purple","pattern":"\"%label\"{blog: %workspace_id; %blog_name}","required":["blog_name"],"fields":["label","blog_name","workspace_id"],"desc":"Display a link to a blog. Use this form to edit the properties of the link.","id":"blog","label":"Blog Link","title":"Link to blog '$blog_name'. Click to edit.","image_text":[{"text":"blog: %label","field":"label"},{"text":"blog: %blog_name","field":"default"}],"labels":{"workspace_id":"Blog on"}},"fetchatom":{"more_desc":"There are no optional properties for an Atom feed.","pattern":"{fetchatom: %atom_url}","color":"darkgreen","desc":"Display the content of an Atom feed. Use this form to edit the properties of the inline Atom feed.","title":"Include the '$atom_url' Atom feed. Click to edit.","label":"Inline Atom","id":"fetchatom","image_text":[{"text":"feed: %atom_url","field":"default"}],"field":"atom_url"},"fetchrss":{"more_desc":"There are no optional properties for an RSS feed.","pattern":"{fetchrss: %rss_url}","color":"orange","desc":"Display the content of an RSS feed. Use this form to edit the properties of the inline RSS feed.","title":"Include the '$rss_url' RSS feed. Click to edit.","label":"Inline RSS","id":"fetchrss","image_text":[{"text":"feed: %rss_url","field":"default"}],"field":"rss_url"},"aim":{"more_desc":"There are no optional properties for an AIM link.","pattern":"aim:%aim_id","required":["aim_id"],"desc":"Display a link to an AIM screen name. The icon will show whether the person is online. Clicking the link will start an IM conversation with the person if your IM client is properly configured. Use this form to edit the properties of the link.","markup":["bound_phrase","aim:",""],"title":"Instant message to '$aim_id' using AIM. Click to edit.","label":"AIM Link","id":"aim","image_text":[{"text":"AIM: %aim_id","field":"default"}],"field":"aim_id"},"image":{"extra_fields":["width","height"],"checks":["require_page_if_workspace"],"input":{"workspace_id":"radio","page_title":"radio","size":"size"},"parse":{"fields":["workspace_id","page_title","image_name"],"regexp":"?three-part-link","no_match":"image_name"},"pdfields":["workspace_id","page_title","label"],"color":"red","required":["image_name"],"desc":"Display an image on this page. The image must be already uploaded as an attachment to this page or another page. Use this form to edit the properties of the displayed image.","id":"image","image_text":[{"text":"image: %label","field":"label"},{"text":"image: %image_name","field":"default"}],"labels":{"workspace_id":"Page in","image_name":"Image filename","page_title":"Attached to","size":"Size"},"more_desc":"Optional properties include the title of another page to which the image is attached, and link text. If link text is specified then a link to the image is displayed instead of the image.","title_and_id":{"workspace_id":{"title":null,"id":null}},"pattern":"\"%label\"{image: %workspace_id [%page_title] %image_name size=%size}","fields":["image_name","workspace_id","page_title","label","size"],"label":"Attached Image","title":"Display image '$image_name'. Click to edit."},"link2_section":{"more_desc":"Optional properties include the text to display for the link.","hide_in_menu":"true","primary_field":"url","pdfields":["label","url"],"color":"blue","pattern":"\"%label\"{link: %workspace_id [%page_title] %section_name}","required":["url"],"fields":["label","url"],"desc":"Use this form to edit the properties of the link to a section.","title":"Link to '$url'. Click to edit.","id":"link2_section","label":"Link to a Section","labels":{"url":"Link destination","label":"Linked text"}},"asis":{"more_desc":"There are no optional properties for unformatted text.","pattern":"{{%asis_content}}","color":"darkslateblue","required":["asis_content"],"desc":"Include unformatted text in the page. This text will not be treated as wiki text. Use this form to edit the text.","markup":["bound_phrase","{{","}}"],"title":"Unformatted Content","label":"Unformatted","id":"asis","image_text":[{"text":"unformatted: %asis_content","field":"default"}],"field":"asis_content"}},"menu_hierarchy":[{"widget":"ss","label":"Spreadsheet"},{"widget":"image","label":"Image"},{"insert":"table","label":"Table"},{"insert":"hr","label":"Horizontal Line"},{"sub_menu":[{"widget":"file","label":"A file attached to this page"},{"widget":"link2_section","label":"A section in this page"},{"widget":"link2","label":"A different wiki page"},{"widget":"blog","label":"A person's blog"},{"widget":"tag","label":"Pages related to a tag"},{"widget":"link2_hyperlink","label":"A page on the web"}],"label":"A link to..."},{"sub_menu":[{"widget":"include","label":"A page include"},{"widget":"ss","label":"A spreadsheet include"},{"widget":"tag_list","label":"Tagged pages"},{"widget":"recent_changes","label":"Recent changes"},{"widget":"blog_list","label":"Blog postings"},{"widget":"search","label":"Wiki search results"}],"label":"From workspaces..."},{"sub_menu":[{"widget":"googlesearch","label":"Google search results"},{"widget":"technorati","label":"Technorati results"},{"widget":"fetchrss","label":"RSS feed items"},{"widget":"fetchatom","label":"Atom feed items"}],"label":"From the web..."},{"sub_menu":[{"widget":"toc","label":"Table of contents"},{"widget":"section","label":"Section marker"},{"insert":"hr","label":"Horizontal line"}],"label":"Organizing your page..."},{"sub_menu":[{"widget":"skype","label":"Skype link"},{"widget":"aim","label":"AIM link"},{"widget":"yahoo","label":"Yahoo! Messenger link"}],"label":"Communicating..."},{"sub_menu":[{"widget":"user","label":"User name"},{"widget":"date","label":"Local Date & Time"}],"label":"Name & Date..."},{"widget":"asis","label":"Unformatted text..."}]};;
;
// BEGIN lib/Wikiwyg/Widgets.js
/* This file needs to be loaded after Widgets.js. */

Wikiwyg.Widgets.widget_editing = 0;

Wikiwyg.Widgets.resolve_synonyms = function(widget) {
    for (var ii in Wikiwyg.Widgets.synonyms) {
        widget = widget.replace( new RegExp("^" + ii), Wikiwyg.Widgets.synonyms[ii]);
    }
    return widget;
}

Wikiwyg.Widgets.isMultiple = function(widget_id) {
    var nameMatch = new RegExp(widget_id + '\\d+$');
    for (var i = 0; i < Wikiwyg.Widgets.widgets.length; i++)
        if (Wikiwyg.Widgets.widgets[i].match(nameMatch))
            return true;
    return false;
}

Wikiwyg.Widgets.getFirstMultiple = function(widget_id) {
    var nameMatch = new RegExp(widget_id + '\\d+$');
    for (var i = 0; i < Wikiwyg.Widgets.widgets.length; i++)
        if (Wikiwyg.Widgets.widgets[i].match(nameMatch))
            return Wikiwyg.Widgets.widgets[i];
    return widget_id;
}

Wikiwyg.Widgets.mapMultipleSameWidgets = function(widget_parse) {
    var id = widget_parse.id;
    var strippedId = id.replace(/\d+$/, '');
    var nameMatch = new RegExp(strippedId + '\\d+$');
    var widgets_list = Wikiwyg.Widgets.widgets;
    for (var i = 0; i < widgets_list.length; i++) {
        var widget_name = widgets_list[i];
        if (widget_name.match(nameMatch)) {
            if (widget_data[widget_name].select_if) {
                var match = true;
                if (widget_data[widget_name].select_if.defined) {
                    for (var k = 0; k < widget_data[widget_name].select_if.defined.length; k++) {
                        if (!widget_parse[widget_data[widget_name].select_if.defined[k]])
                            match = false;
                    }
                }
                if (widget_data[widget_name].select_if.blank) {
                    for (var k = 0; k < widget_data[widget_name].select_if.blank.length; k++) {
                        if (widget_parse[widget_data[widget_name].select_if.blank[k]])
                            match = false;
                    }
                }
                if (match) {
                    id = widget_name;
                    break;
                }
            }
        }
    }

    return id;
}
;
// BEGIN lib/Wikiwyg/Toolbar.js
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
;
// BEGIN lib/Wikiwyg/Preview.js
/*==============================================================================
This Wikiwyg mode supports a preview of current changes

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
}

;
// BEGIN lib/Wikiwyg/Wysiwyg.js
/*==============================================================================
This Wikiwyg mode supports a DesignMode wysiwyg editor with toolbar buttons

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
                html = loc('Sorry, an edit error occured; please re-edit this page.');
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
    if (Wikiwyg.is_ie && event_name == 'blur') {
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

proto.show_messages = function(html) {
    var advanced_link = this.advanced_link_html();
    var message_titles = {
        wiki:  loc('Advanced Content in Grey Border'),
        table: loc('Table Edit Tip'),
        both:  loc('Table & Advanced Editing')
    };
    var message_bodies = {
        wiki:
            loc('Advanced content is shown inside a grey border. Switch to [_1] to edit areas inside a grey border.',advanced_link),
        table: loc('Use [_1] to change the number of rows and columns in a table.', advanced_link),
        both: ''
    };
    message_bodies.both = message_bodies.table + ' ' + message_bodies.wiki;

    var wiki    = html.match(/<!--\s*wiki:/);
    var table   = html.match(/<table /i);
    var message = null;
    if      (wiki && table) message = 'both'
    else if (table)         message = 'table'
    else if (wiki)          message = 'wiki';

    if (message) {
        this.wikiwyg.message.display({
            title: message_titles[message],
            body: message_bodies[message],
            timeout: 60
        });
    }
}

proto.do_p = function() {
    this.format_command("p");
}

proto.do_attach = function() {
    this.wikiwyg.message.display(this.use_advanced_mode_message(loc('Attachments')));
}

proto.do_image = function() {
    this.do_widget_image();
}

proto.do_link = function(widget_element) {
    this._do_link(widget_element);
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
    var span_node = document.createElement("span");
    var link_node = document.createElement("a");

    // Anchor text
    var text = label || page_name || url;
    link_node.appendChild( document.createTextNode(text.replace(/"/g, '\uFF02')) );

    // Anchor HREF
    link_node.href = url || "?" + encodeURIComponent(page_name);

    if (page_name) {
        jQuery(link_node).attr('wiki_page', page_name)
    }

    span_node.appendChild( link_node );
    span_node.appendChild( document.createTextNode('\u00A0') );

    this.insert_element_at_cursor(span_node);
}

if (Wikiwyg.is_ie) {
    proto.make_link = function(label, page_name, url) {

        var text = label || page_name || url;
        var href = url || "?" + encodeURIComponent(page_name);
        var attr = "";
        if (page_name) {
            attr = " wiki_page=\"" + html_escape(page_name).replace(/"/g, "&quot;") + "\"";
        }
        var html = "<a href=\"" + href + "\"" + attr + ">" + html_escape( text.replace(/"/g, '\uFF02').replace(/"/g, "&quot;") );


        html += "</a>";

        this.set_focus(); // Need this before .insert_html
        this.insert_html(html);
    }
}

proto.insert_element_at_cursor = function(ele) {
    var selection = this.get_edit_window().getSelection();
    if (selection.toString().length > 0) {
        selection.deleteFromDocument();
    }

    selection  = this.get_edit_window().getSelection();
    var anchor = selection.anchorNode;
    var offset = selection.anchorOffset;

    if (anchor.nodeName == '#text') {  // Insert into a text element.
        var secondNode = anchor.splitText(offset);
        anchor.parentNode.insertBefore(ele, secondNode);
    } else {  // Insert at the start of the line.
        var children = selection.anchorNode.childNodes;
        if (children.length > offset) {
            selection.anchorNode.insertBefore(ele, children[offset]);
        } else {
            anchor.appendChild(ele);
        }
    }
}

proto.use_advanced_mode_message = function(subject) {
    return {
        title: loc('Use Advanced Mode for [_1]', subject),
        body: loc('Switch to [_1] to use this feature.',  this.advanced_link_html()) 
    }
}

proto.advanced_link_html = function() {
    return '<a onclick="wikiwyg.wikitext_link.onclick(); return false" href="#">' + loc('Advanced Mode') + '</a>';
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
            return $error.text(loc('Rows is invalid.'));
        if (! cols.match(/^\d+$/))
            return $error.text(loc('Columns is invalid.'));
        rows = Number(rows);
        cols = Number(cols);
        if (! (rows && cols))
            return $error.text(loc('Rows and Columns must be non-zero.'));
        if (rows > 100)
            return $error.text(loc('Rows is too big. 100 maximum.'));
        if (cols > 35)
            return $error.text(loc('Columns is too big. 35 maximum.'));
        self.set_focus(); // Need this before .insert_html
        var options = self.tableOptionsFromNode(jQuery('.table-create'));
        self.insert_table_html(rows, cols, options);
        self.closeTableDialog();
    }
    var setup = function() {
        jQuery('.table-create input[name=columns]').focus();
        jQuery('.table-create input[name=columns]').select();
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

proto._do_table_manip = function(callback) {
    var self = this;
    setTimeout(function() {
        var $cell = self.find_table_cell_with_cursor();
        if (! $cell) return;

        var $new_cell = callback.call(self, $cell);

        if ($new_cell) {
            $cell = $new_cell;
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
        $cell.parents("tr").find("td").each(function() {
            $tr.append('<td style="border: 1px solid black; padding: 0.2em;">&nbsp;</td>');
        });
        $tr.insertAfter( $cell.parents("tr") );
    });
}

proto.do_add_row_above = function() {
    var self = this;
    this._do_table_manip(function($cell) {
        var doc = this.get_edit_document();
        var $tr = jQuery(doc.createElement('tr'));

        $cell.parents("tr").find("td").each(function() {
            $tr.append('<td style="border: 1px solid black; padding: 0.2em;">&nbsp;</td>');
        });
        $tr.insertBefore( $cell.parents("tr") );
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
        alert(loc("Please select the text you would like to turn into a link."));
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
            html = html
                .replace(/\n*<p>\n?/ig, "")
                .replace(/<\/p>(?:<br class=padding>)?/ig, br)

            func(html);
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
                alert(loc("This is not an editable widget. Please edit it in Wiki Text mode."))  
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
    return this.parseWidget(widget);
}

proto.parseWidget = function(widget) {
    var matches;

    widget = widget.replace(/-=/g, '-').replace(/==/g, '=');

    if ((matches = widget.match(/^(aim|yahoo|ymsgr|skype|callme|callto|http|irc|file|ftp|https):([\s\S]*?)\s*$/)) ||
        (matches = widget.match(/^\{(\{([\s\S]+)\})\}$/)) || // AS-IS
        (matches = widget.match(/^"(.+?)"<(.+?)>$/)) || // Named Links
        (matches = widget.match(/^(?:"(.*)")?\{(\w+):?\s*([\s\S]*?)\s*\}$/)) ||
        (matches = widget.match(/^\.(\w+)\s*?\n([\s\S]*?)\1\s*?$/))
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
        throw(loc('Unexpected Widget >>[_1]<< in parseWidget', widget));
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
                return widget_parse;
            }

            var widgetFields = data.parse.fields || data.fields;
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

    if ( (matches = widget.match(/^"([\s\S]+?)"<(.+?)>$/m)) || // Named Links
        (matches = widget.match(/^(?:"([\s\S]*)")?\{(\w+):?\s*([\s\S]*?)\s*\}$/m))) {
        // For labeled links or wafls, remove all newlines/returns
        widget = widget.replace(/[\r\n]/g, ' ');
    }
    if (widget.match(/^{image:/)) {
        var orig = elem.firstChild;
        if (orig.src) src = orig.src;
    }

    if (!src) src = this.getWidgetImageUrl(widget);

    widget_image = Wikiwyg.createElementWithAttrs('img', {
        'src': src,
        'alt': 'st-widget-' + (Wikiwyg.is_ie? Wikiwyg.htmlEscape(widget) : widget)
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
    // XXX Hack for html block. Should key off of 'uneditable' flag.
    if (widget.id == 'html') {
        text = widget_data.html.title;
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
        data.field ? [ data.field ] :
        data.fields ? data.fields :
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
        replace(/^\{(\w+)\: \}$/,'{$1}');
    if (values.full)
        result = result.replace(/^(\{\w+)/, '$1_full');
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
        data.field ? [ data.field ] :
        data.fields ? data.fields :
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
                throw(loc("'[_1]' is a required field", label));
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
            throw(loc("Requires one of: [_1]", labels.join(', ')));
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
            throw(loc("'[_1]' has an invalid value", label));
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

proto.require_page_if_workspace = function(values) {
    if (values.spreadsheet_title) {
        return this.require_spreadsheet_if_workspace(values);
    }

    if (values.workspace_id.length && ! values.page_title.length)
        throw(loc("Page Title required if Workspace Id specified"));
}

proto.require_spreadsheet_if_workspace = function(values) {
    if (values.workspace_id.length && ! values.spreadsheet_title.length)
        throw(loc("Spreadsheet Title required if Workspace Id specified"));
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
        }
    });

    var self = this;
    var form = jQuery('#widget-' + widget + ' form').get(0);

    // When the lightbox is closed, decrement widget_editing so lightbox can pop up again. 
    jQuery('#lightbox').bind("lightbox-unload", function(){
        Wikiwyg.Widgets.widget_editing--;
        if (self.wikiwyg && self.wikiwyg.current_mode && self.wikiwyg.current_mode.set_focus) {
            self.wikiwyg.current_mode.set_focus();
        }
    });

    var intervalId = setInterval(function () {
        jQuery('#'+widget+'_wafl_text')
            .html(
                ' <span>' +
                self.create_wafl_string(widget, form).
                    replace(/</g, '&lt;') +
                '</span> '
            );
    }, 500);

    jQuery('#st-widgets-moreoptions').unbind('click').toggle(
        function () {
            jQuery('#st-widgets-moreoptions')
                .html(loc('Fewer options'))
            jQuery('#st-widgets-optionsicon')
                .attr('src', nlw_make_s2_path('/images/st/hide_more.gif'));
            jQuery('#st-widgets-moreoptionspanel').show();
        },
        function () {
            jQuery('#st-widgets-moreoptions')
                .html(loc('More options'))
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
            form.size[4].checked = true;
            disable(form.height);
            enable(form.width);
        });
        jQuery(form.height).click(function () {
            form.size[4].checked = true;
            disable(form.width);
            enable(form.height);
        });
        if (!Number(form.height.value))
            disable(form.height);
        else if (!Number(form.width.value))
            disable(form.width);
    }
}

;
// BEGIN lib/Wikiwyg/HTML.js

/*==============================================================================
This Wikiwyg mode supports a simple HTML editor

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

proto = new Subclass('Wikiwyg.HTML', 'Wikiwyg.Mode');

proto.classtype = 'html';
proto.modeDescription = 'HTML';

proto.config = {
    textareaId: null
}

proto.initializeObject = function() {
    this.div = document.createElement('div');
    if (this.config.textareaId)
        this.textarea = document.getElementById(this.config.textareaId);
    else
        this.textarea = document.createElement('textarea');
    this.div.appendChild(this.textarea);
}

proto.enableThis = function() {
    Wikiwyg.Mode.prototype.enableThis.call(this);
    this.textarea.style.width = '100%';
    this.textarea.style.height = '200px';
}

proto.fromHtml = function(html) {
    this.textarea.value = this.sanitize_html(html);
}

proto.toHtml = function(func) {
    func(this.textarea.value);
}

proto.sanitize_html = function(html) {
    return html;
}

proto.process_command = function(command) {};
;
// BEGIN Wikiwyg/MessageCenter.js
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
;
// BEGIN lib/Wikiwyg/Wikitext.js

proto = new Subclass('Wikiwyg.Wikitext', 'Wikiwyg.Mode');
klass = Wikiwyg.Wikitext;

proto.classtype = 'wikitext';
proto.modeDescription = 'Wikitext';

proto.config = {
    textareaId: null,
    supportCamelCaseLinks: false,
    javascriptLocation: null,
    clearRegex: null,
    editHeightMinimum: 10,
    editHeightAdjustment: 1.3,
    markupRules: {
        link: ['bound_phrase', '[', ']'],
        bold: ['bound_phrase', '*', '*'],
        code: ['bound_phrase', '`', '`'],
        italic: ['bound_phrase', '/', '/'],
        underline: ['bound_phrase', '_', '_'],
        strike: ['bound_phrase', '-', '-'],
        p: ['start_lines', ''],
        pre: ['start_lines', '    '],
        h1: ['start_line', '= '],
        h2: ['start_line', '== '],
        h3: ['start_line', '=== '],
        h4: ['start_line', '==== '],
        h5: ['start_line', '===== '],
        h6: ['start_line', '====== '],
        ordered: ['start_lines', '#'],
        unordered: ['start_lines', '*'],
        indent: ['start_lines', '>'],
        hr: ['line_alone', '----'],
        table: ['line_alone', '| A | B | C |\n|   |   |   |\n|   |   |   |'],
        www: ['bound_phrase', '[', ']']
    }
}

proto.initializeObject = function() { // See IE
    this.initialize_object();
}

proto.initialize_object = function() {
    this.div = document.createElement('div');
    if (this.config.textareaId)
        this.textarea = document.getElementById(this.config.textareaId);
    else
        this.textarea = document.createElement('textarea');
    this.textarea.setAttribute('id', 'wikiwyg_wikitext_textarea');
    this.div.appendChild(this.textarea);
    this.area = this.textarea;
    this.clear_inner_text();
}

proto.blur = function() {
    this.textarea.blur();
};

proto.set_focus = function() {
    this.textarea.focus();
}

proto.clear_inner_text = function() {
    var self = this;
    this.area.onclick = function() {
        var inner_text = self.area.value;
        var clear = self.config.clearRegex;
        if (clear && inner_text.match(clear)) {
            self.area.value = '';
            jQuery(self.area).removeClass('clearHandler');
        }
    }
}

proto.enableStarted = function() {
    jQuery("#wikiwyg_button_table").removeClass("disabled");
    jQuery("#wikiwyg_button_table-settings").addClass("disabled");
    jQuery(".table_buttons img").removeClass("disabled");
    jQuery(".table_buttons").addClass("disabled");

    jQuery('#st-mode-wikitext-button').addClass('disabled');
}

proto.toWikitext = function() {
    return this.getTextArea();
}

proto.getTextArea = function() {
    return this.textarea.value;
}

proto.getInnerText = proto.getTextArea;

proto.bind = function (event_name, callback) {
    jQuery(this.textarea).bind(event_name, callback);
}

proto.setTextArea = function(text) {
    this.textarea.value = text;
}

proto.convertHtmlToWikitext = function(html, func) {
    func(this.convert_html_to_wikitext(html, true));
}

proto.get_keybinding_area = function() {
    return this.textarea;
}

/*==============================================================================
Code to markup wikitext
 =============================================================================*/
Wikiwyg.Wikitext.phrase_end_re = /[\s\.\:\;\,\!\?\(\)\"]/;

proto.find_left = function(t, selection_start, matcher) {
    var substring = t.substr(selection_start - 1, 1);
    var nextstring = t.substr(selection_start - 2, 1);
    if (selection_start == 0)
        return selection_start;
    if (substring.match(matcher)) {
        // special case for word.word
        if ((substring != '.') || (nextstring.match(/\s/)))
            return selection_start;
    }
    return this.find_left(t, selection_start - 1, matcher);
}

proto.find_right = function(t, selection_end, matcher) {
    // Guard against IE's strange behaviour of returning -1 as selection_start.
    if (selection_end < 0) return 0;

    var substring = t.substr(selection_end, 1);
    var nextstring = t.substr(selection_end + 1, 1);
    if (selection_end >= t.length)
        return selection_end;
    if (substring.match(matcher)) {
        // special case for word.word
        if ((substring != '.') || (nextstring.match(/\s/)))
            return selection_end;
    }
    return this.find_right(t, selection_end + 1, matcher);
}

proto.get_lines = function() {
    var t = this.area;
    var selection_start = this.getSelectionStart();
    var selection_end = this.getSelectionEnd();

    if (selection_start == null) {
        selection_start = selection_end;
        if (selection_start == null) {
            return false
        }
        selection_start = selection_end =
            t.value.substr(0, selection_start).replace(/\r/g, '').length;
    }

    var our_text = t.value.replace(/\r/g, '');
    selection = our_text.substr(selection_start,
        selection_end - selection_start);

    selection_start = this.find_right(our_text, selection_start, /[^\r\n]/);

    if (selection_start > selection_end)
        selection_start = selection_end;

    selection_end = this.find_left(our_text, selection_end, /[^\r\n]/);

    if (selection_end < selection_start)
        selection_end = selection_start;

    this.selection_start = this.find_left(our_text, selection_start, /[\r\n]/);
    this.selection_end = this.find_right(our_text, selection_end, /[\r\n]/);
    this.setSelectionRange(selection_start, selection_end);
    t.focus();

    this.start = our_text.substr(0,this.selection_start);
    this.sel = our_text.substr(this.selection_start, this.selection_end -
        this.selection_start);
    this.finish = our_text.substr(this.selection_end, our_text.length);

    return true;
}

proto.alarm_on = function() {
    var area = this.area;
    var background = area.style.background;
    area.style.background = '#f88';

    function alarm_off() {
        area.style.background = background;
    }

    window.setTimeout(alarm_off, 250);
    area.focus()
}

proto.get_words = function() {
    function is_insane(selection) {
        return selection.match(/\r?\n(\r?\n|\*+ |\#+ |\=+ )/);
    }

    var t = this.area;
    var selection_start = this.getSelectionStart();
    var selection_end = this.getSelectionEnd();

    if (selection_start == null) {
        selection_start = selection_end;
        if (selection_start == null) {
            return false
        }
        selection_start = selection_end =
            t.value.substr(0, selection_start).replace(/\r/g, '').length;
    }

    var our_text = t.value.replace(/\r/g, '');
    selection = our_text.substr(selection_start,
        selection_end - selection_start);

    selection_start = this.find_right(our_text, selection_start, /(\S|\r?\n)/);
    if (selection_start > selection_end)
        selection_start = selection_end;
    selection_end = this.find_left(our_text, selection_end, /(\S|\r?\n)/);
    if (selection_end < selection_start)
        selection_end = selection_start;

    if (is_insane(selection)) {
        this.alarm_on();
        return false;
    }

    this.selection_start =
        this.find_left(our_text, selection_start, Wikiwyg.Wikitext.phrase_end_re);
    this.selection_end =
        this.find_right(our_text, selection_end, Wikiwyg.Wikitext.phrase_end_re);

    this.setSelectionRange(this.selection_start, this.selection_end);
    t.focus();

    this.start = our_text.substr(0,this.selection_start);
    this.sel = our_text.substr(this.selection_start, this.selection_end -
        this.selection_start);
    this.finish = our_text.substr(this.selection_end, our_text.length);

    return true;
}

proto.markup_is_on = function(start, finish) {
    return (this.sel.match(start) && this.sel.match(finish));
}

proto.clean_selection = function(start, finish) {
    this.sel = this.sel.replace(start, '');
    this.sel = this.sel.replace(finish, '');
}

proto.toggle_same_format = function(start, finish) {
    start = this.clean_regexp(start);
    finish = this.clean_regexp(finish);
    var start_re = new RegExp('^' + start);
    var finish_re = new RegExp(finish + '$');
    if (this.markup_is_on(start_re, finish_re)) {
        this.clean_selection(start_re, finish_re);
        return true;
    }
    return false;
}

proto.clean_regexp = function(string) {
    string = string.replace(/([\^\$\*\+\.\?\[\]\{\}])/g, '\\$1');
    return string;
}

proto.insert_widget = function (widget_string) {
    /* This is currently only used for post-file-upload insertion of {file:}
     * and {image:} wafls; other widgets call insert_text_at_cursor directly.
     * Also see {bz: 1116}: For file uploads, Wafl is inserted on its own line.
     *
     * Changed use spaces mainly for signals, but it shouldn't break {bz: 1116}.
     */
    this.insert_text_at_cursor(widget_string + ' ', { assert_preceding_wordbreak: true });
}

proto.insert_text_at_cursor = function(text, opts) {
    var t = this.area;
    var do_insert_from_parts = function (pre, mid, post) {
        if (opts && opts.assert_preceding_wordbreak && /\w$/.test(pre)) {
            return pre + ' ' + mid + post;
        }
        else {
            return pre + mid + post;
        }
    };

    if (this.old_range) {
        this.old_range.text = text;
        return;
    }


    if (Wikiwyg.is_ie && typeof(this.start) != 'undefined' && typeof(this.finish) != 'undefined') {
        t.value = do_insert_from_parts(this.start, text, this.finish);
        return false;
    }

    var selection_start = this.getSelectionStart();
    var selection_end = this.getSelectionEnd();

    if (selection_start == null) {
        selection_start = selection_end;
        if (selection_start == null) {
            return false
        }
    }

    var before = t.value.substr(0, selection_start);
    var after = t.value.substr(selection_end, t.value.length);
    t.value = do_insert_from_parts(before, text, after);

    this.area.focus();
    var end = selection_end + text.length;
    this.setSelectionRange(end, end);
}

proto.insert_text = function (text) {
    this.area.value = text + this.area.value;
}

proto.set_text_and_selection = function(text, start, end) {
    this.area.value = text;
    this.setSelectionRange(start, end);
}

proto.add_markup_words = function(markup_start, markup_finish, example) {
    if (this.toggle_same_format(markup_start, markup_finish)) {
        this.selection_end = this.selection_end -
            (markup_start.length + markup_finish.length);
        markup_start = '';
        markup_finish = '';
    }
    if (this.sel.length == 0) {
        if (example)
            this.sel = example;
        var text = this.start + markup_start + this.sel +
            markup_finish + this.finish;
        var start = this.selection_start + markup_start.length;
        var end = this.selection_end + markup_start.length + this.sel.length;
        this.set_text_and_selection(text, start, end);
    } else {
        var text = this.start + markup_start + this.sel +
            markup_finish + this.finish;
        var start = this.selection_start;
        var end = this.selection_end + markup_start.length +
            markup_finish.length;
        this.set_text_and_selection(text, start, end);
    }
    this.area.focus();
}

// XXX - A lot of this is hardcoded.
proto.add_markup_lines = function(markup_start) {
    var already_set_re = new RegExp( '^' + this.clean_regexp(markup_start), 'gm');
    var other_markup_re = /^(\^+|\=+|\*+|#+|>+|    )/gm;

    var match;
    // if paragraph, reduce everything.
    if (! markup_start.length) {
        this.sel = this.sel.replace(other_markup_re, '');
        this.sel = this.sel.replace(/^\ +/gm, '');
    }
    // if pre and not all indented, indent
    else if ((markup_start == '    ') && this.sel.match(/^\S/m))
        this.sel = this.sel.replace(/^/gm, markup_start);
    // if not requesting heading and already this style, kill this style
    else if (
        (! markup_start.match(/[\=\^]/)) &&
        this.sel.match(already_set_re)
    ) {
        this.sel = this.sel.replace(already_set_re, '');
        if (markup_start != '    ')
            this.sel = this.sel.replace(/^ */gm, '');
    }
    // if some other style, switch to new style
    else if (match = this.sel.match(other_markup_re))
        // if pre, just indent
        if (markup_start == '    ')
            this.sel = this.sel.replace(/^/gm, markup_start);
        // if heading, just change it
        else if (markup_start.match(/[\=\^]/))
            this.sel = this.sel.replace(other_markup_re, markup_start);
        // else try to change based on level
        else
            this.sel = this.sel.replace(
                other_markup_re,
                function(match) {
                    return markup_start.times(match.length);
                }
            );
    // if something selected, use this style
    else if (this.sel.length > 0)
        this.sel = this.sel.replace(/^(.*\S+)/gm, markup_start + ' $1');
    // just add the markup
    else
        this.sel = markup_start + ' ';

    var text = this.start + this.sel + this.finish;
    var start = this.selection_start;
    var end = this.selection_start + this.sel.length;
    this.set_text_and_selection(text, start, end);

    // Here we cancel the selection and allow the user to keep typing
    // (instead of replacing the freshly-inserted-markup by typing.)
    this.setSelectionRange(this.getSelectionEnd(), this.getSelectionEnd());

    this.area.focus();
}

// XXX - A lot of this is hardcoded.
proto.bound_markup_lines = function(markup_array) {
    var markup_start = markup_array[1];
    var markup_finish = markup_array[2];
    var already_start = new RegExp('^' + this.clean_regexp(markup_start), 'gm');
    var already_finish = new RegExp(this.clean_regexp(markup_finish) + '$', 'gm');
    var other_start = /^(\^+|\=+|\*+|#+|>+) */gm;
    var other_finish = /( +(\^+|\=+))?$/gm;

    var match;
    if (this.sel.match(already_start)) {
        this.sel = this.sel.replace(already_start, '');
        this.sel = this.sel.replace(already_finish, '');
    }
    else if (match = this.sel.match(other_start)) {
        this.sel = this.sel.replace(other_start, markup_start);
        this.sel = this.sel.replace(other_finish, markup_finish);
    }
    // if something selected, use this style
    else if (this.sel.length > 0) {
        this.sel = this.sel.replace(
            /^(.*\S+)/gm,
            markup_start + '$1' + markup_finish
        );
    }
    // just add the markup
    else
        this.sel = markup_start + markup_finish;

    var text = this.start + this.sel + this.finish;
    var start = this.selection_start;
    var end = this.selection_start + this.sel.length;
    this.set_text_and_selection(text, start, end);

    // Here we cancel the selection and allow the user to keep typing
    // (instead of replacing the freshly-inserted-markup by typing.)
    this.setSelectionRange(this.getSelectionEnd(), this.getSelectionEnd());

    this.area.focus();
}

proto.markup_bound_line = function(markup_array) {
    var scroll_top = this.area.scrollTop;
    if (this.get_lines())
        this.bound_markup_lines(markup_array);
    this.area.scrollTop = scroll_top;
}

proto.markup_start_line = function(markup_array) {
    var markup_start = markup_array[1];
    markup_start = markup_start.replace(/ +/, '');
    var scroll_top = this.area.scrollTop;
    if (this.get_lines())
        this.add_markup_lines(markup_start);
    this.area.scrollTop = scroll_top;
}

proto.markup_start_lines = function(markup_array) {
    var markup_start = markup_array[1];
    var scroll_top = this.area.scrollTop;
    if (this.get_lines())
        this.add_markup_lines(markup_start);
    this.area.scrollTop = scroll_top;
}

klass.make_do = function(style) {
    return function() {
        var markup = this.config.markupRules[style];
        var handler = markup[0];
        if (! this['markup_' + handler])
            die('No handler for markup: "' + handler + '"');
        this['markup_' + handler](markup);
    }
}

proto.do_bold = klass.make_do('bold');
proto.do_code = klass.make_do('code');
proto.do_italic = klass.make_do('italic');
proto.do_underline = klass.make_do('underline');
proto.do_strike = klass.make_do('strike');
proto.do_p = klass.make_do('p');
proto.do_pre = klass.make_do('pre');
proto.do_h1 = klass.make_do('h1');
proto.do_h2 = klass.make_do('h2');
proto.do_h3 = klass.make_do('h3');
proto.do_h4 = klass.make_do('h4');
proto.do_h5 = klass.make_do('h5');
proto.do_h6 = klass.make_do('h6');
proto.do_ordered = klass.make_do('ordered');
proto.do_unordered = klass.make_do('unordered');
proto.do_hr = klass.make_do('hr');
proto.do_link = klass.make_do('link');

proto.add_section_link = function() {
    var section = jQuery('#section-link-text').val();

    if (!section) {
        this.set_add_a_link_error( "Please fill in the section field for section links." );
        return false;
    } 

    var wafl = this.create_link_wafl(false, false, false, section);
    this.insert_text_at_cursor(wafl);

    return true;
}

proto.add_wiki_link = function(widget_element, dummy_widget) {
    var label     = jQuery('#wiki-link-text').val(); 
    var workspace = jQuery('#st-widget-workspace_id').val() || "";
    var page_name = jQuery('#st-widget-page_title').val();
    var section   = jQuery('#wiki-link-section').val();
    var workspace_id = dummy_widget.title_and_id.workspace_id.id || workspace.replace(/\s+/g, '');

    if (!page_name) {
        this.set_add_a_link_error( "Please fill in the Page field for wiki links." );
        return false;
    }

    var wikitext = "";
    if (!section && (!workspace || workspace == Socialtext.wiki_id)) {  // simple wikitext
        wikitext = "[" + page_name + "]";
        if (label) {
            wikitext = "\"" + label + "\"" + wikitext;
        }
    } else { // wafl
        wikitext = this.create_link_wafl(label, workspace_id, page_name , section);
    }
    this.insert_text_at_cursor(wikitext);

    return true;
}

proto.add_web_link = function() {
    var url       = jQuery('#web-link-destination').val();
    var url_text  = jQuery('#web-link-text').val();

    if (!this.valid_web_link(url)) {
        this.set_add_a_link_error("Please fill in a Link destination for web links.");
        return false;
    }

    this.make_web_link(url, url_text);
}

proto.valid_web_link = function(url) {
    return (url.length && url.match(/^(http|https|ftp|irc|mailto|file):/));
}

proto.make_web_link = function(url, url_text) {
    var wikitext;
    if (url_text) {
        wikitext = "\"" + url_text + "\"<" + url + ">";
    } else {
        wikitext = url;
    }
    this.insert_text_at_cursor(wikitext + ' ');

    return true;
}

proto.get_selection_text = function() {
    if (Wikiwyg.is_ie) {
        return this.sel;
    }

    var t = this.area;
    var selection_start = this.getSelectionStart();
    var selection_end   = this.getSelectionEnd();

    if (selection_start != null) {
        return t.value.substr(selection_start, selection_end - selection_start);
    } else {
        return "";
    }
}

proto.selection_mangle = function(method) {
    var scroll_top = this.area.scrollTop;
    if (! this.get_lines()) {
        this.area.scrollTop = scroll_top;
        return;
    }

    if (method(this)) {
        var text = this.start + this.sel + this.finish;
        var start = this.selection_start;
        var end = this.selection_start + this.sel.length;
        this.set_text_and_selection(text, start, end);
    }
    this.area.focus();
}

proto.do_indent = function() {
    this.selection_mangle(
        function(that) {
            if (that.sel == '') return false;
            that.sel = that.sel.replace(/^(([\*\-\#])+(?=\s))/gm, '$2$1');
            that.sel = that.sel.replace(/^([\>\=])/gm, '$1$1');
            that.sel = that.sel.replace(/^([^\>\*\-\#\=\r\n])/gm, '> $1');
            that.sel = that.sel.replace(/^\={7,}/gm, '======');
            return true;
        }
    )
}

proto.do_outdent = function() {
    this.selection_mangle(
        function(that) {
            if (that.sel == '') return false;
            that.sel = that.sel.replace(/^([\>\*\-\#\=] ?)/gm, '');
            return true;
        }
    )
}

proto.do_unlink = function() {
    this.selection_mangle(
        function(that) {
            that.sel = that.kill_linkedness(that.sel);
            return true;
        }
    );
}

// TODO - generalize this to allow Wikitext dialects that don't use "[foo]"
proto.kill_linkedness = function(str) {
    while (str.match(/\[.*\]/))
        str = str.replace(/\[(.*?)\]/, '$1');
    str = str.replace(/^(.*)\]/, '] $1');
    str = str.replace(/\[(.*)$/, '$1 [');
    return str;
}

proto.markup_line_alone = function(markup_array) {
    var t = this.area;
    var scroll_top = t.scrollTop;
    var selection_start = this.getSelectionStart();
    var selection_end = this.getSelectionEnd();
    if (selection_start == null) {
        selection_start = selection_end;
    }

    var text = t.value;
    this.selection_start = this.find_right(text, selection_start, /\r?\n/);
    this.selection_end = this.selection_start;
    this.setSelectionRange(this.selection_start, this.selection_start);
    t.focus();

    var markup = markup_array[1];
    this.start = t.value.substr(0, this.selection_start);
    this.finish = t.value.substr(this.selection_end, t.value.length);
    var text = this.start + '\n' + markup + this.finish;
    var start = this.selection_start + markup.length + 1;
    var end = this.selection_end + markup.length + 1;
    this.set_text_and_selection(text, start, end);
    t.scrollTop = scroll_top;
}

// Adapted from http://tim.mackey.ie/CleanWordHTMLUsingRegularExpressions.aspx
proto.strip_msword_gunk = function(html) {
    return html.
        replace(
            /<SPAN\s+style="[^"]*\bmso-list:\s+Ignore\b[^"]*">[\w\W]*?<\/SPAN>/ig, function(m) {
                return '<!--[SocialtextBulletBegin]-->' + m + '<!--[SocialtextBulletEnd]-->';
            }
        ).
        replace(
            /(<P[^>]*style="[^>"]*mso-list:\s*l\d[^>"]*"[^>]* class="?)MsoNormal\b/ig,
            '$1MsoListParagraphCxSpMiddle'
        ).
        replace(
            /(<P[^>]* class="?)MsoNormal\b([^>]*>\s*<!--\[if\s+!supportLists\]-->)/ig,
            '$1MsoListParagraphCxSpMiddle$2'
        ).
        replace(
            /<!--\[if\s+!supportLists\]-->([\w\W]*?)<!(--)?\[endif\]-->/ig, function(m, $1) {
                return '<!--[SocialtextBulletBegin]-->' + $1 + '<!--[SocialtextBulletEnd]-->';
            }
        ).
        replace(
            /<(span|\w:\w+)[^>]*>(\s*&nbsp;\s*)+<\/\1>/gi,
            function(m) {
                return m.match(/ugly-ie-css-hack/) ? m : '&nbsp;';
            }
        ).
        replace(
            /<(span|\w:\w+)[^>]*><font[^>]*>(\s*&nbsp;\s*)+<\/font><\/\1>/gi,
            function(m) {
                return m.match(/ugly-ie-css-hack/) ? m : '&nbsp;';
            }
        ).
        replace(/<!(--)?\[if\s[\w\W]*?<!(--)?\[endif\]-->/gi, '').
        replace(/<\/?(xml|st\d+:\w+|[ovwxp]:\w+)[^>]*>/gi, '');
}

proto.normalizeDomStructure = function(dom) {
    this.normalize_styled_blocks(dom, 'p');
    this.normalize_styled_lists(dom, 'ol');
    this.normalize_styled_lists(dom, 'ul');
    this.normalize_styled_blocks(dom, 'li');
    this.normalize_span_whitespace(dom, 'span');
    this.normalize_empty_link_tags(dom);
}

proto.normalize_empty_link_tags = function(dom) {
    // Remove <a ...><!-- wiki-rename-link ... --></a>
    jQuery('a', dom).each(function () {
        if( this.childNodes.length == 1 &&
            this.childNodes[0].nodeType == 8 // comment node
            ) {
            this.parentNode.removeChild(this)
        }
    });
}

proto.normalize_span_whitespace = function(dom,tag ) {
    var grep = function(element) {
        return Boolean(element.getAttribute('style'));
    }

    var elements = this.array_elements_by_tag_name(dom, tag, grep);
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var node = element.firstChild;
        while (node) {
            if (node.nodeType == 3) {
                node.nodeValue = node.nodeValue.replace(/^\n+/,"");
                break;
            }
            node = node.nextSibling;
        }
        var node = element.lastChild;
        while (node) {
            if (node.nodeType == 3) {
                node.nodeValue = node.nodeValue.replace(/\n+$/,"");
                break;
            }
            node = node.previousSibling;
        }
    }
}

proto.normalize_styled_blocks = function(dom, tag) {
    var elements = this.array_elements_by_tag_name(dom, tag);
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var style = element.getAttribute('style');
        if (!style || this.style_is_bogus(style)) continue;
        element.removeAttribute('style');
        element.innerHTML =
            '<span style="' + style + '">' + element.innerHTML + '</span>';
    }
}

proto.style_is_bogus = function(style) {
    var attributes = [ 'line-through', 'bold', 'italic', 'underline' ];
    for (var i = 0; i < attributes.length; i++) {
        if (this.check_style_for_attribute(style, attributes[i]))
            return false;
    }
    return true;
}

proto.normalize_styled_lists = function(dom, tag) {
    var elements = this.array_elements_by_tag_name(dom, tag);
    for (var i = 0; i < elements.length; i++) {
        var element = elements[i];
        var style = element.getAttribute('style');
        if (!style) continue;
        element.removeAttribute('style');

        var items = element.getElementsByTagName('li');
        for (var j = 0; j < items.length; j++) {
            items[j].innerHTML =
                '<span style="' + style + '">' + items[j].innerHTML + '</span>';
        }
    }
}

proto.array_elements_by_tag_name = function(dom, tag, grep) {
    var result = dom.getElementsByTagName(tag);
    var elements = [];
    for (var i = 0; i < result.length; i++) {
        if (grep && ! grep(result[i]))
            continue;
        elements.push(result[i]);
    }
    return elements;
}

proto.normalizeDomWhitespace = function(dom) {
    var tags = ['span', 'strong', 'em', 'strike', 'del', 'tt'];
    for (var ii = 0; ii < tags.length; ii++) {
        var elements = dom.getElementsByTagName(tags[ii]);
        for (var i = 0; i < elements.length; i++) {
            this.normalizePhraseWhitespace(elements[i]);
        }
    }
    this.normalizeNewlines(dom, ['br', 'blockquote'], 'nextSibling');
    this.normalizeNewlines(dom, ['p', 'div', 'blockquote'], 'firstChild');
}

proto.normalizeNewlines = function(dom, tags, relation) {
    for (var ii = 0; ii < tags.length; ii++) {
        var nodes = dom.getElementsByTagName(tags[ii]);
        for (var jj = 0; jj < nodes.length; jj++) {
            var next_node = nodes[jj][relation];
            if (next_node && next_node.nodeType == '3') {
                next_node.nodeValue = next_node.nodeValue.replace(/^\n/, '');
            }
        }
    }
}

proto.normalizePhraseWhitespace = function(element) {
    if (this.elementHasComment(element)) return;

    if (element.innerHTML == '') {
        /* An empty phrase markup should not cause whitespaces: {bz: 1690} */
        element.parentNode.removeChild(element);
        return;
    }

    var first_node = this.getFirstTextNode(element);
    var prev_node = this.getPreviousTextNode(element);
    var last_node = this.getLastTextNode(element);
    var next_node = this.getNextTextNode(element);

    // This if() here is for a special condition on firefox.
    // When a bold span is the last visible thing in the dom,
    // Firefox puts an extra <br> in right before </span> when user
    // press space, while normally it put &nbsp;.

    if(Wikiwyg.is_gecko && element.tagName == 'SPAN') {
        var tmp = element.innerHTML;
        element.innerHTML = tmp.replace(/<br>$/i, '');
    }

    if (this.destroyPhraseMarkup(element)) return;

    if (first_node && first_node.nodeValue.match(/^ /)) {
        first_node.nodeValue = first_node.nodeValue.replace(/^ +/, '');
        if (prev_node && ! prev_node.nodeValue.match(/ $/))
            prev_node.nodeValue = prev_node.nodeValue + ' ';
    }

    if (last_node && last_node.nodeValue.match(/ $/)) {
        last_node.nodeValue = last_node.nodeValue.replace(/ $/, '');
        if (next_node && ! next_node.nodeValue.match(/^ /))
            next_node.nodeValue = ' ' + next_node.nodeValue;
    }
}

proto.elementHasComment = function(element) {
    var node = element.lastChild;
    return node && (node.nodeType == 8);
}

proto.end_is_no_good = function(element) {
    var last_node = this.getLastTextNode(element);
    var next_node = this.getNextTextNode(element);

    for (var n = element; n && n.nodeType != 3; n = n.lastChild) {
        if (n.nodeType == 8) return false;
    }

    if (! last_node) return true;
    if (last_node.nodeValue.match(/ $/)) return false;
    if (! next_node || next_node.nodeValue == '\n') return false;
    return ! next_node.nodeValue.match(Wikiwyg.Wikitext.phrase_end_re);
}

proto.destroyElement = function(element) {
    try {
        var range = element.ownerDocument.createRange();
        range.selectNode(element);
        var docfrag = range.createContextualFragment( element.innerHTML );
        element.parentNode.replaceChild(docfrag, element);
        return true;
    }
    catch (e) {
        return false;
    }
}

proto.getFirstTextNode = function(element) {
    for (node = element; node && node.nodeType != 3; node = node.firstChild) {
    }
    return node;
}

proto.getLastTextNode = function(element) {
    for (node = element; node && node.nodeType != 3; node = node.lastChild) {
    }
    return node;
}

proto.getPreviousTextNode = function(element) {
    var node = element.previousSibling;
    if (node && node.nodeType != 3)
        node = null;
    return node;
}

proto.getNextTextNode = function(element) {
    var node = element.nextSibling;
    if (node && node.nodeType != 3)
        node = null;
    return node;
}

proto.skip = function() { return ''; }
proto.pass = function(element) {
    return element.wikitext;
}
proto.handle_undefined = proto.skip;

proto.format_abbr = proto.pass;
proto.format_acronym = proto.pass;
proto.format_address = proto.pass;
proto.format_applet = proto.skip;
proto.format_area = proto.skip;
proto.format_basefont = proto.skip;
proto.format_base = proto.skip;
proto.format_bgsound = proto.skip;
proto.format_big = proto.pass;
proto.format_blink = proto.pass;
proto.format_body = proto.pass;
proto.format_button = proto.skip;
proto.format_caption = proto.pass;
proto.format_center = proto.pass;
proto.format_cite = proto.pass;
proto.format_col = proto.pass;
proto.format_colgroup = proto.pass;
proto.format_dd = proto.pass;
proto.format_dfn = proto.pass;
proto.format_dl = proto.pass;
proto.format_dt = proto.pass;
proto.format_embed = proto.skip;
proto.format_field = proto.skip;
proto.format_fieldset = proto.skip;
proto.format_font = proto.pass;
proto.format_form = proto.skip;
proto.format_frame = proto.skip;
proto.format_frameset = proto.skip;
proto.format_head = proto.skip;
proto.format_html = proto.pass;
proto.format_iframe = proto.pass;
proto.format_input = proto.skip;
proto.format_ins = proto.pass;
proto.format_isindex = proto.skip;
proto.format_label = proto.skip;
proto.format_legend = proto.skip;
proto.format_link = proto.skip;
proto.format_map = proto.skip;
proto.format_marquee = proto.skip;
proto.format_meta = proto.skip;
proto.format_multicol = proto.pass;
proto.format_nobr = proto.skip;
proto.format_noembed = proto.skip;
proto.format_noframes = proto.skip;
proto.format_nolayer = proto.skip;
proto.format_noscript = proto.skip;
proto.format_nowrap = proto.skip;
proto.format_object = proto.skip;
proto.format_optgroup = proto.skip;
proto.format_option = proto.skip;
proto.format_param = proto.skip;
proto.format_select = proto.skip;
proto.format_small = proto.pass;
proto.format_spacer = proto.skip;
proto.format_style = proto.skip;
proto.format_script = proto.skip;
proto.format_sub = proto.pass;
proto.format_submit = proto.skip;
proto.format_sup = proto.pass;
proto.format_textarea = proto.skip;
proto.format_tfoot = proto.pass;
proto.format_thead = proto.pass;
proto.format_wiki = proto.pass;
proto.format_www = proto.skip;

proto.check_style_for_attribute = function(style, attribute) {
    var string = this.squish_style_object_into_string(style);
    return string.match("\\b" + attribute + "\\b");
}

proto._for_interesting_attributes = function(cb) {
    cb('fontWeight',     'font-weight');
    cb('fontStyle',      'font-style');
    cb('textDecoration', 'text-decoration');
}

proto.squish_style_object_into_string = function(style) {
    if (! style) return;
    if (typeof style == 'string') return style;
    var string = '';
    this._for_interesting_attributes(function(js, css){
        if (style[js])
            string += css + ': ' + style[js] + '; ';
    });
    return string;
}

proto.href_is_wiki_link = function(href) {
    if (! this.looks_like_a_url(href))
        return true;
    if (! href.match(/\?/))
        return false;
    if (href.match(/\/static\//) && href.match(/\/skin\/js-test\//))
        href = location.href;
    var no_arg_input   = href.split('?')[0];
    var no_arg_current = location.href.split('?')[0];
    if (no_arg_current == location.href)
        no_arg_current =
          location.href.replace(new RegExp(location.hash), '');
    return no_arg_input == no_arg_current;
}

proto.looks_like_a_url = function(string) {
    return string.match(/^(http|https|ftp|irc|mailto|file):/);
}

proto.setSelectionRange = function (startPos, endPos) {
    this.area.setSelectionRange(startPos, endPos);
}

proto.getSelectionStart = function () {
    return this.area.selectionStart;
}

proto.getSelectionEnd = function () {
    return this.area.selectionEnd;
}


/*==============================================================================
Support for Internet Explorer in Wikiwyg.Wikitext
 =============================================================================*/
if (Wikiwyg.is_ie) {

proto.setHeightOf = function() {
    // XXX hardcode this until we can keep window from jumping after button
    // events.
    this.textarea.style.height = '200px';
}

proto.initializeObject = function() {
    var self = this;
    this.initialize_object();
    if (!this.config.javascriptLocation)
        throw new Error("Missing javascriptLocation config option!");

    jQuery(this.area).bind('beforedeactivate', function () {
        self.old_range = document.selection.createRange();
    });
}

var selectionStart = 0;
var selectionEnd = 0;

proto.setSelectionRange = function (startPos, endPos) {
    var element = this.area;
    var objRange = element.createTextRange();
    objRange.collapse(true);
    objRange.move("character", startPos);

    charLength = endPos - startPos;
    for (var i=1; i<=charLength; i++)
        objRange.expand("character");

    objRange.select();
}

proto.getSelectionStart = function() {
    this.getSelectionRange("start");
    return selectionStart;
}

proto.getSelectionEnd = function() {
    var element = this.area;
    this.getSelectionRange("end");
    element.value = element.value.replace(/\x01/g, '');
    return selectionEnd;
}

proto.getSelectionRange = function (type) {
    var element = this.area;
    var sRange = element.document.selection.createRange();
    if (sRange.text.length == 0) {
        var pos = element.value.indexOf('\x01');
        if (pos == -1) {
            element.focus();
            sRange = element.document.selection.createRange();
            sRange.text = '\x01';
            element.focus();
            selectionStart = null;
            selectionEnd = null;
        }
        else {
            element.value = element.value.replace(/\x01/, '');
            selectionStart = pos;
            selectionEnd = pos;
        }
        return;
    }

    var sRange2 = sRange.duplicate();
    var iRange = element.document.body.createTextRange();
    iRange.moveToElementText(element);
    var coord = 0;
    var fin = 0;

    while (fin == 0) {
        len = iRange.text.length;
        move = Math.floor(len / 2);
        _move = iRange.moveStart("character", move);
        where = iRange.compareEndPoints("StartToStart", sRange2);
        if (where == 1) {
            iRange.moveStart("character", -_move);
            iRange.moveEnd("character", -len+move);
        }
        else if (where == -1) {
            coord = coord + move;
        }
        else {
            coord = coord + move;
            fin = 1;
        }
        if (move == 0) {
            while (iRange.compareEndPoints("StartToStart", sRange2) < 0) {
                iRange.moveStart("character", 1);
                coord++;
            }
            fin = 2;
        }
    }
    selectionStart = coord;
    selectionEnd = coord + (sRange.text.replace(/\r/g, "")).length;
}

} // end of global if
/*==============================================================================
Socialtext Wikitext subclass.
 =============================================================================*/
// proto = new Subclass(WW_ADVANCED_MODE, 'Wikiwyg.Wikitext');

/* Begin Widget */
eval(WW_ADVANCED_MODE).prototype.setup_widgets = function() {
    var widgets_list = Wikiwyg.Widgets.widgets;
    var widget_data = Wikiwyg.Widgets.widget;
    var p = eval(this.classname).prototype;
    for (var i = 0; i < widgets_list.length; i++) {
        var widget = widgets_list[i];
        p.markupRules['widget_' + widget] =
            widget_data[widget].markup ||
            ['bound_phrase', '{' + widget + ': ', '}'];
        p['do_widget_' + widget] = Wikiwyg.Wikitext.make_do('widget_' + widget);
    }
}

proto.destroyPhraseMarkup = function(element) {
    if (this.contain_widget_image(element))
        return false;
    if (this.start_is_no_good(element) || this.end_is_no_good(element)) {
        return this.destroyElement(element);
    }
    return false;
}

proto.contain_widget_image = function(element) {
    for(var ii = 0; ii < element.childNodes.length; ii++ ) {
        var e = element.childNodes[ii]
        if ( e.nodeType == 1 ) {
            if ( e.nodeName == 'IMG' ) {
                if ( /^st-widget-/.test(e.getAttribute('alt')) )
                    return true;
            }
        }
    }
}

proto.markup_bound_phrase = function(markup_array) {
    var markup_start = markup_array[1];

    // Hack: This line exists to turn "{link2: }" into "{link: }"
    markup_start = markup_start.replace(/\d+: $/, ': ');

    var markup_finish = markup_array[2];
    var scroll_top = this.area.scrollTop;

    // Hack: Here we handle "{link2_*}" variants...
    if (markup_start == '{link2_hyperlink: ') {
        // Turns "{link2_hyperlink: }" into "<http://...>"
        markup_start = '<http://';
        markup_finish = '>';
    }
    else if (markup_start == '{link2_section: ') {
        // Turns "{link2_section: }" into "{link: }"
        markup_start = '{link: ';
    }

    if (markup_finish == 'undefined')
        markup_finish = markup_start;
    if (this.get_words())
        this.add_markup_words(markup_start, markup_finish, null);
    this.area.scrollTop = scroll_top;
}
/* End of Widget */

proto.markupRules = {
    italic: ['bound_phrase', '_', '_'],
    underline: ['bound_phrase', '', ''],
    h1: ['start_line', '^ '],
    h2: ['start_line', '^^ '],
    h3: ['start_line', '^^^ '],
    h4: ['start_line', '^^^^ '],
    h5: ['start_line', '^^^^^ '],
    h6: ['start_line', '^^^^^^ '],
    www: ['bound_phrase', '"', '"<http://...>'],
    attach: ['bound_phrase', '{file: ', '}'],
    image: ['bound_phrase', '{image: ', '}']
}

for (var ii in proto.markupRules) {
    proto.config.markupRules[ii] = proto.markupRules[ii]
}

proto.canonicalText = function() {
    var wikitext = this.getTextArea();
    if (wikitext[wikitext.length - 1] != '\n')
        wikitext += '\n';
    return this.convert_tsv_sections(wikitext);
}

proto.convert_tsv_sections = function(text) {
    var self = this;
    return text.replace(
        /^tsv:\s*\n((.*(?:\t| {2,}).*\n)+)/gim,
        function(s) { return self.detab_table(s) }
    );
}

proto.detab_table = function(text) {
    return text.
        replace(/\r/g, '').
        replace(/^tsv:\s*\n/, '').
        replace(/(\t| {2,})/g, '|').
        replace(/^/gm, '|').
        replace(/\n/g, '|\n').
        replace(/\|$/, '');
}

proto.enableThis = function() {
    this.wikiwyg.set_edit_tips_span_display();

    Wikiwyg.Mode.prototype.enableThis.call(this);
    this.textarea.style.width = Wikiwyg.is_ie ? '98%' : '99%';
    this.setHeightOfEditor();
    this.enable_keybindings();

    try {
        this.textarea.focus();

        if (Wikiwyg.is_gecko) {
            this.textarea.selectionStart = 0;
            this.textarea.selectionEnd = 0;
        }
    } catch (e) {};

    if (jQuery('#contentRight').is(':visible')) {
        jQuery('#st-page-maincontent').css('marginRight', '240px');
    }


}

proto.toNormalizedHtml = function(func) {
    return this.toHtml(func);
}

proto.toHtml = function(func, onError) {
    var wikitext = this.wikiwyg.current_wikitext = this.canonicalText();
    this.convertWikitextToHtml(wikitext, func, onError);
}

proto.fromHtml = function(html) {
    if (Wikiwyg.is_safari) {
        if (this.wikiwyg.current_wikitext)
            return this.setTextArea(this.wikiwyg.current_wikitext);
        if (jQuery('#st-raw-wikitext-textarea').size()) {
            return this.setTextArea(jQuery('#st-raw-wikitext-textarea').val());
        }
    }

    this.setTextArea('Loading...');
    var self = this;
    this.convertHtmlToWikitext(
        html,
        function(value) { self.setTextArea(value) }
    );
}

proto.disableThis = function() {
    this.wikiwyg.set_edit_tips_span_display();
    Wikiwyg.Mode.prototype.disableThis.call(this);
}

proto.setHeightOfEditor = function() {
    this.textarea.style.height = this.get_edit_height() + 'px';
}

proto.do_www = Wikiwyg.Wikitext.make_do('www');
proto.do_attach = Wikiwyg.Wikitext.make_do('attach');
proto.do_image = Wikiwyg.Wikitext.make_do('image');

proto.convertWikitextToHtml = function(wikitext, func, onError) {
    // TODO: This could be as simple as:
    //    func((new Document.Parser.Wikitext()).parse(wikitext, new Document.Emitter.HTML()));
    // But we need to ensure newer wikitext features, such has (sortable) tables,
    // are supported in the Document.Parser library first.

    var uri = location.pathname;
    var postdata = 'action=wikiwyg_wikitext_to_html;content=' +
        encodeURIComponent(wikitext);

    var isSuccess = false;
    jQuery.ajax({
        url: uri,
        async: false,
        type: 'POST',
        data: {
            action: 'wikiwyg_wikitext_to_html',
            page_name: jQuery('#st-newpage-pagename-edit, #st-page-editing-pagename').val(),
            content: wikitext
        },
        success: function(_data, _status, xhr) {
            if (xhr.responseText && /\S/.test(xhr.responseText)) {
                isSuccess = true;
                func(xhr.responseText);
            }
        }
    });

    if (!isSuccess) {
        alert(loc("Operation failed due to server error; please try again later."));
        if (onError) { onError(xhr); }
    }
}

proto.href_is_really_a_wiki_link = function(href) {
    var query = href.split('?')[1];
    if (!query) return false;
    return ((! query.match(/=/)) || query.match(/action=display\b/));
}

proto.href_label_similar = function(elem, href, label) {
    var id_from_href  = nlw_name_to_id(href);
    var id_from_label = nlw_name_to_id(label);
    var id_from_attr  = nlw_name_to_id(jQuery(elem).attr('wiki_page') || "");
    return ((id_from_href == id_from_label) || id_from_attr == id_from_label);
}

proto.make_table_wikitext = function(rows, columns) {
    var text = '';
    for (var i = 0; i < rows; i++) {
        var row = ['|'];
        for (var j = 0; j < columns; j++)
            row.push('|');
        text += row.join(' ') + '\n';
    }
    return text;
}

proto.do_table = function() {
    var result = this.prompt_for_table_dimensions();
    if (! result) return false;
    this.markup_line_alone([
        "a table",
        this.make_table_wikitext(result[0], result[1])
    ]);
}

proto.start_is_no_good = function(element) {
    var first_node = this.getFirstTextNode(element);
    var prev_node = this.getPreviousTextNode(element);

    if (! first_node) return true;
    if (first_node.nodeValue.match(/^ /)) return false;
    if (! prev_node) return false;
    if (prev_node.nodeValue.match(/^\n?[\xa0\ ]?/)) return false;
    if (prev_node.nodeValue == '\n') return false;
    return ! prev_node.nodeValue.match(/[\( "]$/);
}

/* Depth.js code */
if (! window.Page) {
    Page = {
        page_title: 'foo',
        wiki_title: 'bar'
    };
}

proto._is_block_level_node = function(node) {
    return (
        node &&
        node.nodeName &&
        node.nodeName.match(/^(?:UL|LI|OL|P|H\d+|HR|TABLE|TD|TR|TH|THEAD|TBODY|BLOCKQUOTE)$/)
    );
}

// Turn up MS-Office list-as-paragraphs into actual lists.
proto.build_msoffice_list = function(top) {
    var self = this;
    return (function ($) {
        var $top = $(top);
        var firstHtml = $top.html();

        if (!firstHtml.match(/<!--\[SocialtextBulletBegin\]-->[\w\W]*?<!--\[SocialtextBulletEnd\]-->/)) {
            return;
        }

        firstHtml = firstHtml.replace(
            /<!--\[SocialtextBulletBegin\]-->(?:<\w[^>]*>)*([\w\W]*?)<!--\[SocialtextBulletEnd\]-->/, ''
        );
        var bulletText = RegExp.$1;
        var listType = bulletText.match(/^\w+\./) ? 'ol' : 'ul';

        var cur = top;
        var newHtml = '<li>' + firstHtml + '</li>';
        var toRemove = [];
        while (cur = $(cur).next(
            'p.ListParagraphCxSpMiddle, p.ListParagraphCxSpLast,' +
            'p.MsoListParagraphCxSpMiddle, p.MsoListParagraphCxSpLast'
        )[0]) {
            var $cur = $(cur);
            if ($cur.hasClass('_st_walked')) continue;
            if (parseInt($cur.css('text-indent') || '0') == 0 && ($cur.text().search(/\S/) == -1)) {
                toRemove.push($cur);
                continue;
            }

            var topIndent = self._css_to_px($top.css('margin-left')) || 0;
            var curIndent = self._css_to_px($cur.css('margin-left')) || 0;

            if (curIndent < topIndent) {
                /* Outdent -- We're outta here. */
                break;
            }
            else if (curIndent > topIndent) {
                /* Nest some more! */
                newHtml += self.build_msoffice_list(cur);
            }
            else {
                newHtml += '<li>' + $cur.html().replace(
                    /<!--\[SocialtextBulletBegin\]-->[\w\W]*?<!--\[SocialtextBulletEnd\]-->/, ''
                ) + '</li>';
            }

            $cur.addClass('_st_walked');
            toRemove.push($cur);
        }

        for (var i = 0; i < toRemove.length; i++) {
            toRemove[i].remove();
        }

        return '<'+listType+'>'+newHtml+'</'+listType+'>';
    })(jQuery);
}

proto.convert_html_to_wikitext = function(html, isWholeDocument) {
    var self = this;
    if (html == '') return '';
    html = html.replace(/^\s*<div(?:\s*\/|><\/div)>/, '');
    html = this.strip_msword_gunk(html);

    (function ($) {
        var dom = document.createElement("div");
        dom.innerHTML = html;

        /* Turn visual LIs (bullet chars) into real LIs */
        var cur;
        while (cur = $(dom).find(
            'p.ListParagraphCxSpFirst:first, p.MsoListParagraphCxSpFirst:first, p.MsoListParagraph:first, p.ListParagraph:first'
        )[0]) {
            $(cur).replaceWith( self.build_msoffice_list(cur) );
        }
        $(dom).find('._st_walked').removeClass('_st_walked');

        /* Turn visual BRs (P[margin-bottom < 1px]) into real BRs */
        var foundVisualBR;
        do {
            var paragraphs = dom.getElementsByTagName('p');
            var len = paragraphs.length;
            if (!len) break;

            foundVisualBR = false;

            for (var i = 0; i < len; i++) {
                var cur = paragraphs[i];
                if (cur.className.indexOf('st_walked') >= 0) continue;

                if (self._css_to_px(cur.style.marginBottom) < 1) {
                    /* It's a pseudo-BR; turn it into BR and start over. */
                    var next = self._get_next_node(cur);
                    if (next && next.nodeType == 1 && next.nodeName == 'P') {
                        cur.style.marginBottom = next.style.marginBottom;

                        var $next = $(next);
                        $(cur).append('<br />' + $next.html());
                        $next.remove();

                        foundVisualBR = true;
                        break;
                    }
                }

                cur.className += (cur.className ? ' ' : '') + 'st_walked';
            }
        } while (foundVisualBR);

        // {bz: 4738}: Don't run _format_one_line on top-level tables, HRs and PREs.
        $(dom).find('td, hr, pre')
            .parents('span, a, h1, h2, h3, h4, h5, h6, b, strong, i, em, strike, del, s, tt, code, kbd, samp, var, u')
            .addClass('_st_format_div');

        $(dom).find('._st_walked').removeClass('_st_walked');

        // This needs to be done by hand for IE.
        // jQuery().replaceWith considered dangerous in IE.
        // It was causing stack overflow.
        if ($.browser.msie) {
            var elems = dom.getElementsByTagName('div');
            for (var i = 0, l = elems.length; i < l; i++) {
                if (elems[i].className != 'wiki') continue;
                var div = document.createElement('div');
                div.innerHTML = elems[i].innerHTML;
                elems[i].parentNode.replaceChild(
                    div,
                    elems[i]
                );
            }
            html = dom.innerHTML;
        }
        else {
            var $dom = $(dom);

            $dom
            .find("div.wiki").each(function() { 
                var html = $(this).html();
                if (/<br\b[^>]*>\s*$/i.test(html)) {
                    $(this).replaceWith( html );
                }
                else {
                    $(this).replaceWith( html + '<br />');
                }
            });

        // Try to find an user-pasted paragraph. With extra gecko-introduced \n
        // characters in there, which we need to remove.
            var cleanup_newlines = function() {
                if (this.nodeType == 3) {
                    if (this.previousSibling && this.previousSibling.nodeType == 1 && this.previousSibling.nodeName != 'BR' ) {
                        if (self._is_block_level_node(this.previousSibling)) {
                            this.nodeValue = this.nodeValue.replace(/^\n/, '');
                        }
                        else {
                            this.nodeValue = this.nodeValue.replace(/^\n/, ' ');
                        }
                    }
                    else {
                        this.nodeValue = this.nodeValue.replace(/^\n/, '');
                    }

                    if (this.nextSibling && this.nextSibling.nodeType == 1 && this.nextSibling.nodeName != 'BR' ) {
                        if (self._is_block_level_node(this.nextSibling)) {
                            this.nodeValue = this.nodeValue.replace(/\n$/, '');
                        }
                        else {
                            this.nodeValue = this.nodeValue.replace(/\n$/, ' ');
                        }
                    }
                    else {
                        this.nodeValue = this.nodeValue.replace(/\n$/, '');
                    }

                    this.nodeValue = this.nodeValue.replace(/\n/g, ' ');
                }
                else if ( $(this).is(':not(pre,plain)') ) {
                    $(this).contents().not('iframe').each(cleanup_newlines);
                }
            }

            if (isWholeDocument) {
                var contents = $dom.find('div.wiki').contents();
                if (contents.length == 0) {
                    $dom.find('iframe').remove();
                    contents = $dom.contents();
                }

                if (contents.length > 0) {
                    for (var i = 0; i < contents.length; i++) {
                        var firstNode = contents[i];
                        if (firstNode.nodeType == 1 && firstNode.innerHTML == '') continue;
                        if (firstNode.nodeType == 3) {
                            firstNode.nodeValue = firstNode.nodeValue.replace(/^\n/, '');
                        }
                        break;
                    }

                    for (var i = contents.length-1; i >= 0; i--) {
                        var lastNode = contents[i];
                        if (lastNode.nodeType == 1 && lastNode.innerHTML == '') continue;
                        if (lastNode.nodeType == 3) {
                            lastNode.nodeValue = lastNode.nodeValue.replace(/\n$/, '');
                        }
                        break;
                    }

                    contents.each(cleanup_newlines);
                }
            }
            else {
                /* Probably within js-test or paste. */
                $dom.contents().each(cleanup_newlines);
            }
            html = $dom.html();
        }
    })(jQuery);

    // XXX debugging stuff
//     if (String(location).match(/\?.*html$/))
//         YYY(html);

    this.copyhtml = html;
    var dom = document.createElement('div');
    dom.innerHTML = html;
    this.output = [];
    this.list_type = [];
    this.indent_level = 0;
    this.no_collapse_text = false;
    this.depth = 0;

    this.normalizeDomWhitespace(dom);
    this.normalizeDomStructure(dom);

//     if (String(location).match(/\?.*html2$/))
//         YYY(dom.innerHTML);

    this.dom = dom;

    // XXX debugging stuff
//     dom_copy = copyDom(dom);
//     if (String(location).match(/\?.*dump$/))
//         throw yyy(dom_copy);

    return this.walk(dom).replace(/[\xa0\s\n]*$/, '\n').replace(/\r/g, '');
//     if (String(location).match(/\?.*dump2$/))
//         throw yyy(copyDom(dom));
}

proto.walk = function(elem) {
    this.depth++;
    if (!elem) return '';

    for (var part = elem.firstChild; part; part = part.nextSibling) {
        if (part.nodeType == 1) {
            if (this.no_descend(part)) continue;
            part.wikitext = this.walk(part);
        }
    }

    this.wikitext = '';

    var fixups = [];
    for (var part = elem.firstChild; part; ) {

        if (part.nodeType == 3) {
            if (
                !(
                    part.nodeValue.match(/[^\n]/) &&
                    (! part.nodeValue.match(/^\n[\n\ \t]*$/))
                ) ||
                (
                    part.nodeValue.match(/^\s+$/) &&
                    part.previousSibling &&
                    part.previousSibling.nodeName == 'BR' &&
                    part.previousSibling.previousSibling &&
                    part.previousSibling.previousSibling.nodeName == 'BR'
                )
            ) {
                var node = part;
                part = part.nextSibling;
                node.parentNode.removeChild(node);
                continue;
            }
        }

        var method = 'format_' + part.nodeName.toLowerCase();
        if (method != 'format_blockquote' && part.is_indented)
            method = 'format_indent';

        // {bz: 4738}: Don't run _format_one_line on top-level TABLEs, HRs and PREs.
        if (/\b_st_format_div\b/.test(part.className)) {
            method = 'format_div';
        }

//         window.XXX_method = method = method.replace(/#/, '');
        method = method.replace(/#/, '');
        try {
            var text = this[method](part);
            if (part.fixup) {
                text = '\x07' + text + '\x07';
                fixups.push([part.fixup, part]);
            }

            if (!text) {
                part = part.nextSibling;
                continue;
            }

            if (this.wikitext && this.wikitext != '\n') {
                for (var node = part; node; node = node.firstChild) {
                    if (node.top_level_block) {
                        // *** Hotspot - Optimizing by hand. ***
                        // this.wikitext = this.wikitext.replace(/ *\n?\n?$/, '\n\n');
                        var len = this.wikitext.length;

                        if (this.wikitext.charAt(len-1) == '\n') len--;
                        if (this.wikitext.charAt(len-1) == '\n') len--;
                        while (this.wikitext.charAt(len-1) == ' ') len--;

                        if (len == this.wikitext.length) {
                            this.wikitext += '\n\n';
                        }
                        else {
                            this.wikitext = this.wikitext.substr(0, len) + '\n\n';
                        }

                        break;
                    }

                    if (this._is_block_level_node(node)) {
                        break;
                    }
                }
            }

            if (part.widget_on_widget) {
// This isn't required anymore after [Story: Preserve white space].
//                this.wikitext = this.wikitext.replace(/\n*$/, '\n');
            }

            this.assert_trailing_space(part, text);
            this.wikitext += text;
        }
        catch(e) {
//             alert(method + ' ' + e.message);
//             delete(e.stack);
//             var error = yyy({
//                 'method': method,
//                 'e': e,
//                 'wikitext': this.wikitext
//             });
//             var dom_dump = yyy(dom_copy);
//             throw("Depth First Formatting Error:\n" + error + dom_dump);
        }
        part = part.nextSibling;
    }

    for (var i = 0; i < fixups.length; i++) {
        var fixup = fixups[i];
        this[fixup[0]](fixup[1]);
    }

    this.depth--;
    if (!(this.wikitext.length && this.wikitext.match(/\S/))) return '';
    return this.wikitext;
}

proto.assert_trailing_space = function(part, text) {
    if ((! part.requires_preceding_space) && (
            (! part.previousSibling) 
         || (! part.previousSibling.requires_trailing_space)
         || (part.nodeName == 'BR') // BR now counts as trailing space
        )
    ) return;

    if (this.wikitext.match(/ $/)) return;

    if (this.wikitext.match(/\n$/)) {
        if (part.previousSibling &&
            part.previousSibling.nodeName == 'BR'
        ) return;
        this.wikitext = this.wikitext.replace(/\n$/, '');
    }

    if (! text.match(/^\s/))
        this.wikitext += ' ';
}

proto._css_to_px = function(val) {
    if (val.match(/^-?([\.\d]+)px/)) {
        return Number(RegExp.$1);
    }
    else if (val.match(/^-?([\.\d]+)in/)) {
        return Number(RegExp.$1) * 80;
    }
    else if (val.match(/^-?([\.\d]+)cm/)) {
        return Number(RegExp.$1) * 28;
    }
    else if (val.match(/^-?([\.\d]+)em/)) {
        return Number(RegExp.$1) * 10;
    }
    else if (val.match(/^-?([\.\d]+)ex/)) {
        return Number(RegExp.$1) * 6;
    }
    else if (val.match(/^-?([\.\d]+)pt/)) {
        return Number(RegExp.$1) * 4 / 3;
    }
    return undefined;
}

proto.no_descend = function(elem) {
    if (elem.nodeName == 'BLOCKQUOTE')
        elem.is_indented = true;
    else if (elem.nodeName.match(/^(P|DIV)$/)) {
        var indent = this._css_to_px(elem.style.marginLeft);
        if (indent != undefined) {
            elem.is_indented = indent;
        }
    }

    return Boolean(
        (
            elem.nodeName.match(/^(DIV|SPAN)$/) && 
            elem.className.match(/^(nlw_phrase|wafl_block)$/)
        ) ||
        (elem.nodeName == 'A' &&
        elem.lastChild &&
        elem.lastChild.nodeType == 8) ||
        (elem.nodeName == 'A') ||
        (
            (elem.nodeName == 'SPAN') &&
            this.get_wiki_comment(elem)
        )
    );
}

proto.check_start_of_block = function(elem) {
    var prev = elem.previousSibling;
    var next = elem.nextSibling;

    if (this.wikitext &&
        prev &&
        prev.top_level_block &&
        ! /\n\n$/.test(this.wikitext) &&
        ! ((elem.nodeType == 3) && (!/\S/.test(elem.nodeValue)) &&
            /* If we are on an empty text node, and the BRs following us makes
             * up for "\n\n" required by start-of-block, don't add another \n.*/
            (next && next.nodeName == 'BR') && (
                /\n$/.test(this.wikitext)
                || next.nextSibling && next.nextSibling.nodeName == 'BR'
            )
        )
    ) this.wikitext += '\n';
}

proto._get_next_node = function(elem) {
    if (!elem) { return elem; }

    if (elem.nextSibling) {
        /* The next node is also whitespace -- look further */
        if (elem.nextSibling.nodeType == 3 && elem.nextSibling.nodeValue.match(/^[\xa0\s]*$/)) {
            return this._get_next_node(elem.nextSibling);
        }
        return elem.nextSibling;
    }
    return this._get_next_node(elem.parentNode);
}

proto.format_text = function(elem) {
    if (elem.previousSibling &&
        elem.previousSibling.nodeName == 'P' &&
        elem.previousSibling.wikitext == ''
    ) {
        elem.top_level_block = true;
    }

    this.check_start_of_block(elem);
    var text = elem.nodeValue.
        replace(/^\n+/, '').
        replace(/[\xa0 ]+/g, ' ');

    if (text.match(/^[\xa0\s]+$/)) {
        var next = this._get_next_node(elem);
        if (!next) return '';
        if (next.nodeType == 1
            && (next.nodeName == 'BR' || this._is_block_level_node(next))) return '';
    }

    if (text.match(/^\s+/) && elem.previousSibling && elem.previousSibling.nodeType == 1 && elem.previousSibling.nodeName == 'BR') {
        text = text.replace(/^\s+/, '');
    }

    if (text.match(/\s+$/) && elem.nextSibling && elem.nextSibling.nodeType == 1 && elem.nextSibling.nodeName == 'BR') {
        text = text.replace(/\s+$/, '');
    }

    text = text.replace(/\xa0 /g,' ');
    text = text.replace(/\xa0/g,' ');
    return text;
}

proto.format_div = function(elem) {
    if (elem.className == 'nlw_phrase') {
        elem.top_level_block = true;
        return this.handle_nlw_phrase(elem);
    }
    if (elem.className == 'wafl_block')
        return this.handle_wafl_block(elem);
    var text = elem.wikitext;
    return text.
        replace(/^\s+$/, '').
        replace(/\n*$/, '\n');
}

proto.handle_nlw_phrase = function(elem) {
    this.check_start_of_block(elem);

    // XXX Maybe we should use get_wiki_comment.
    var comment = elem.lastChild;
    var text = Wikiwyg.htmlUnescape(comment.nodeValue).
        replace(/^\ wiki: ([\s\S]*?)\ ?$/, '$1').
        replace(/\n*$/, '').
        replace(/-=/g, '-').
        replace(/==/g, '=');
    elem.is_widget = true;
    var prev = elem.previousSibling;
    if (prev && prev.nodeName == 'BR' &&
        prev.previousSibling &&
        prev.previousSibling.is_widget
    ) elem.widget_on_widget = true;
    return this.handle_include(text, elem);
}

proto.handle_wafl_block = function(elem) {
    var comment = elem.lastChild;
    if (! comment) return;
    var text = comment.data;
    text = text.replace(/^ wiki:\s+/, '').
                replace(/-=/g, '-').
                replace(/==/g, '=');
    elem.top_level_block = true;
    return text;
}

proto.format_p = function(elem) {
    if (elem.className == 'padding' && ! this.wikitext) {
        if (Wikiwyg.is_ie) return '\n';
        return;
    }

    var text = elem.wikitext;
    elem.top_level_block = true;
    if (!text) {
        if (Wikiwyg.is_ie && elem == elem.parentNode.lastChild)
            return '\n';
        return;
    }
    // XXX Somehow an include wafl at the beginning of the text makes the
    // formatter print a P with a single space. Should fix that some day.
    if (text == ' ') return;

    return text + '\n';
}

proto.format_img = function(elem) {
    var widget = elem.getAttribute('alt');
    if (/^st-widget-/.test(widget)) {
        widget = widget.replace(/^st-widget-/, '');
        if (Wikiwyg.is_ie) widget = Wikiwyg.htmlUnescape( widget );
        if (widget.match(/^\.\w+\n/))
            elem.top_level_block = true;
        else
            elem.is_widget = true;

        this.check_start_of_block(elem);

        var text = widget
            .replace(/-=/g, '-')
            .replace(/==/g, '=');
        var prev = elem.previousSibling;
        var requires_preceding_space = false;

        if (!text.match(/\{\{.*\}\}/)) {
            if (!elem.top_level_block)
                elem.requires_trailing_space = true;
            if (prev &&
                !(prev.nodeType == 1 && prev.nodeName == 'BR') &&
                !prev.top_level_block) {
                if (prev.nodeType == 3 && Wikiwyg.is_ie) {
                    elem.requires_preceding_space = true;
                } else {
                    prev.requires_trailing_space = true;
                }
            }
        }

        text = this.handle_include(text, elem);

        if (widget.match(/^\.\w+\n/))
            text = text.replace(/\n*$/, '\n');

        // Dirty hack for {{{ ... }}} wikitext
        if (Wikiwyg.is_ie) {
            if (!text.match(/\{\{\{.*\}\}/))
                elem.requires_trailing_space = true;
        }

        if (prev && prev.nodeName == 'BR' &&
            prev.previousSibling &&
            prev.previousSibling.is_widget
        ) elem.widget_on_widget = true;
        return text;
    }
    var uri = elem.getAttribute('src');
    if (uri) {
        this.check_start_of_block(elem);
        return(uri);
    }
//     throw('unhandled image ' + elem.innerHTML);
}

proto.handle_include = function(text, elem) {
    if (text.match(/^{include:/)) {
        if (!this.wikitext || this.wikitext.match(/\n$/)) {
            var next = elem.nextSibling;
            if (next) {
                if (next.nodeType == 3 &&
                    next.nodeValue.match(/\S/)
                ) next.nodeValue = next.nodeValue.replace(/^\s*/, '');
                if (next.nodeType == 1)
                    next.wikitext = next.wikitext.replace(/^\s*/, '');
            }
        }
        this.is_include = true;
        elem.requires_trailing_space = null;
    }
    return text;
}

proto._format_one_line = function(elem) {
    var style = this.squish_style_object_into_string(elem.style);

    /* If the style is not interesting, we pretend it's not there, instead
     * of reducing it to a single line. -- {bz: 1704}
     */
    if (!style || style == '') {
        if ((elem.parentNode.nodeName == 'P')
         && (elem.parentNode.className == 'MsoNormal')
        ) {
            /* However, MS-Office <p class="MsoNormal"><span>...</span></p> 
             * chunks do need to be squished into a single line.
             * See js-test/wikiwyg/t/wordpaste.t.js for details.
             */
        }
        else {
            return elem.wikitext;
        }
    }


    // It has line-level style markups; we're forced to make it a single line.
    elem.wikitext = elem.wikitext.replace(/\n/g, ' ').replace(/  */g, ' ');

    if (style.match(/font-weight: bold;/))
        elem.wikitext = this.format_b(elem);
    if (style.match(/font-style: italic;/))
        elem.wikitext = this.format_i(elem);
    if (style.match(/text-decoration: line-through;/))
        elem.wikitext = this.format_strike(elem);
    return elem.wikitext;
}

proto.format_span = function(elem) {
    if (
        (elem.className == 'nlw_phrase') ||
        this.get_wiki_comment(elem)
    ) return this.handle_nlw_phrase(elem);

    return this._format_one_line(elem);
}

proto.format_indent = function(elem) {
    var px = elem.is_indented;
    while (px > 0) {
        elem.wikitext = this.format_blockquote(elem);
        px -= 40;
    }
    return elem.wikitext;
}

proto.format_blockquote = function(elem) {
    if ( ! 
        (
            elem.parentNode.is_indented || 
            (elem.previousSibling && elem.previousSibling.is_indented)
        )
    ) elem.top_level_block = true;
    else {
        this.wikitext = this.wikitext.replace(/ $/,'');
        if (this.wikitext && ! this.wikitext.match(/\n$/))
            this.wikitext += '\n';
    }
    return elem.wikitext.
        replace(/^[>]/mg, '>>').
        replace(/^([^>])/mg, '> $1').
        replace(/ *$/mg, '').
        replace(/\n*$/, '\n');
}

proto.format_li = function(elem) {
    return '\x07' +
        elem.wikitext.
            replace(/^\xa0$/, '').
            replace(/^\s*/, '').
            replace(/\n+/g, ' ').
            replace(/  +/, ' ').
            replace(/ *$/, '')
            + '\n';
}

proto.format_ul = function(elem) {
    if (! elem.parentNode.nodeName.match(/^(UL|OL)$/))
        elem.top_level_block = true;
    var text = elem.wikitext.
        replace(/^([*]+)( |$)/mg, '*$1$2').
        replace(/^([#]+)( |$)/mg, '#$1$2').
        replace(/^\x07$/mg, '*').
        replace(/^\x07(?=.)/mg, '* ');
    return text;
}

proto.format_ol = function(elem) {
    if (! elem.parentNode.nodeName.match(/^(UL|OL)$/))
        elem.top_level_block = true;
    var text = elem.wikitext.
        replace(/^([*]+)( |$)/mg, '*$1$2').
        replace(/^([#]+)( |$)/mg, '#$1$2').
        replace(/^\x07$/mg, '#').
        replace(/^\x07(?=.)/mg, '# ');
    return text;
}

proto.format_table = function(elem) {
    elem.top_level_block = true;
    var options = jQuery(elem).attr('options');
    return (options ? '|| ' + options + '\n' : '') + elem.wikitext;
}

proto.format_tr = function(elem) {
    return elem.wikitext + '|\n';
}

proto.format_td = function(elem) {
    if (
        elem.firstChild &&
        elem.firstChild.nodeName.match(/^(H[123456])$/)
    ) {
        if (elem.wikitext != '') {
            elem.wikitext = elem.wikitext.replace(/\n?$/, '\n');
        }
        return '| ' + elem.wikitext;
    }

    if (
        elem.firstChild &&
        elem.firstChild.nodeName.match(/^(OL|UL|BLOCKQUOTE)$/)
    ) {
        elem.wikitext = '\n' + elem.wikitext.replace(/\n$/, ' ');
        return '| ' + elem.wikitext;
    }

    if (elem.wikitext.match(/\n/) ||
        (elem.firstChild && elem.firstChild.top_level_block)
    ) {
        elem.wikitext = elem.wikitext.replace(/\s?\n?$/, ' ');
        return '| ' + elem.wikitext;
    }
    else {
        var style = this.squish_style_object_into_string(
            elem.getAttribute('style')
        );
        if (style && style.match(/font-weight: bold;/))
            elem.wikitext = this.format_b(elem);
        if (style && style.match(/font-style: italic;/))
            elem.wikitext = this.format_i(elem);
        if (style && style.match(/text-decoration: line-through;/))
            elem.wikitext = this.format_strike(elem);
    }

    return '| ' + elem.wikitext + ' ';
}

proto.format_th = proto.format_td;

proto.format_tbody = function(elem) {
    return elem.wikitext;
}

for (var i = 1; i <= 6; i++) {
    var padding = ' ';
    for (var j = 1; j <= i; j++) {
        padding = '^' + padding;
    }
    (function(p){
        proto['format_h'+i] = function(elem) {
            elem.top_level_block = true;
            var text = this._format_one_line(elem);
            if (text == '') return '';
            text = p + text;
            return text.replace(/\n*$/, '\n');
        };
    })(padding);
}

proto.format_pre = function(elem) {
    var data = Wikiwyg.htmlUnescape(elem.innerHTML);
    data = data.replace(/<br>/g, '\n')
               .replace(/\r?\n$/, '')
               .replace(/^&nbsp;$/, '\n');
    elem.top_level_block = true;
    return '.pre\n' + data + '\n.pre\n';
}

proto.format_a = function(elem) {
    if (elem.innerHTML == '') {
        /* An empty anchor should not render into <> or []: {bz: 1691} */
        return '';
    }

    /* {bz: 176}: For <a><span style="..."></span></a>, merge the inner tag's style into A's. */
    if (elem.childNodes.length == 1 && elem.childNodes[0].nodeType == 1) {
        var additional_styles = elem.childNodes[0].getAttribute("style");
        if (additional_styles) {
            if ((additional_styles.constructor+'').match('String')) {
                elem.setAttribute('style', elem.getAttribute('style') + ';' + additional_styles);
            }
            else {
                this._for_interesting_attributes(function(js){
                    if (additional_styles[js]) {
                        elem.style[js] = additional_styles[js];
                    }
                });
            }
        }
    }

    this.check_start_of_block(elem);
    var label = elem.innerHTML;
    label = label.replace(/<[^>]*>/g, ' '); /* 1: Strip tags */
    label = Wikiwyg.htmlUnescape(label);    /* 2: Unescape entities */
    label = label.replace(/\s+/g, ' ')      /* 3: Trim spaces */
                 .replace(/^\s+/, '') 
                 .replace(/\s+$/, '');

    var href = elem.getAttribute('href');

    if (! href) href = ''; // Necessary for <a name="xyz"></a>'s
    var link = this.make_wikitext_link(label, href, elem);

    // For [...] links, we need to ensure there are surrounding spaces
    // because it won't take effect when put adjacent to word characters.
    if (link.match(/^\[/)) {
        // Turns "foo[bar]" into "foo [bar]"
        var prev_node = this.getPreviousTextNode(elem);
        if (prev_node && prev_node.nodeValue.match(/\w$/)) {
            link = ' ' + link;
        }

        // Turns "[bar]baz" into "[bar] baz"
        var next_node = this.getNextTextNode(elem);
        if (next_node && next_node.nodeValue.match(/^\w/)) {
            link = link + ' ';
        }
    }

    elem.fixup = 'strip_ears';

    elem.wikitext = link;

    return this._format_one_line(elem);
}

// Remove < > (ears) from links if possible
proto.strip_ears = function(elem) {
    var self = this;
    this.wikitext = this.wikitext.replace(
        /(^|[\s\S])\x07([^\x07]*)\x07([\s\S]|$)/, function($0, $1, $2, $3) {
            var link = $2;
            if (link.match(/\s/))
                return $1 + link + $3;
            if (self.wikitext.match(/>\x07$/)) {
                if (self.is_italic(elem.parentNode))
                    return $1 + link;
            }
            if (
                (! ($1.match(/\S/) || $3.match(/\S/))) ||
                ($1 == "'" && ! $3.match(/\S/))
            ) link = link.replace(/^<(.*)>$/, '$1');
            return $1 + link + $3;
        }
    );
}

proto.is_italic = function(elem) {
    var self = this;
    return (elem &&
        (
            elem.nodeName == 'I' ||
            elem.nodeName == 'EM' ||
            (
                elem.nodeName == 'SPAN' &&
                (function(elem) {
                    var style = '';
                    try {
                        style = self.squish_style_object_into_string(
                            elem.getAttribute('style')
                        )
                    } catch (e) {};
                    return /font-style: italic;/.test(style);
                })(elem)
            )
        )
    );
}

proto.elem_is_wiki_link = function (elem) {
    var href = elem.getAttribute('href') || ''
    return jQuery(elem).attr('wiki_page')
        || (
            this.href_is_wiki_link(href)
            && this.href_is_really_a_wiki_link(href)
          );
}

proto.make_wikitext_link = function(label, href, elem) {
    var mailto = href.match(/^mailto:(.*)/);

    if (this.elem_is_wiki_link(elem)) {
        return this.handle_wiki_link(label, href, elem);
    }
    else if (mailto) {
        var address =
            (jQuery.browser.msie && jQuery.browser.version == 6)
            ? mailto[1]
            : mailto[1].replace(/\%25/g, '%');

        if (address == label)
            return address;
        else
            return '"' + label + '"<' + href + '>';
    }
    else {
        if (href == label)
            return '<' + href + '>';
        else if (this.looks_like_a_url(label)) {
            return '<' + label + '>';
        }
        else {
            return '"' + label + '"<' + href + '>';
        }
    }
}

proto.handle_wiki_link = function(label, href, elem) {
    var href_orig = href;
    href = href.replace(/\baction=display;is_incipient=1;page_name=/, '');
    href = href.replace(/.*\?/, '');
    href = decodeURIComponent(href);
    href = href.replace(/_/g, ' ');
    // XXX more conversion/normalization poo
    // We don't yet have a smart way to get to page->Subject->metadata
    // from page->id
    var wiki_page = jQuery(elem).attr('wiki_page');

    if (label == href_orig && (label.indexOf('=') == -1)) {
        return '[' + (wiki_page || href) + ']';
    }
    else if (this.href_label_similar(elem, href, label)) {
        return '[' + (wiki_page || label) + ']';
    }
    else {
        return '"' + label + '"[' + (wiki_page || href) + ']';
    }
}

proto.COMMENT_NODE_TYPE = 8;
proto.get_wiki_comment = function(elem) {
    for (var node = elem.firstChild; node; node = node.nextSibling) {
        if (node.nodeType == this.COMMENT_NODE_TYPE
            && node.data.match(/^\s*wiki/)
        ) {
            return node;
        }
    }
    return null;
}

proto.format_br = function(elem) {
    if (elem.style.pageBreakBefore == 'always') {
        return this.format_hr(elem);
    }

    if (Wikiwyg.is_ie) 
       this.wikitext = this.wikitext.replace(/\xA0/, "");
    return '\n';
}

proto.format_hr = function(elem) {
    if (this.has_parent(elem, 'LI')) return '';
    return '----\n';
}

proto.has_parent = function(elem, name) {
    while (elem = elem.parentNode) {
        if (elem.nodeName == name) return true;
    }
    return false;
}

// Build trivial bound_phrase formatters
;(function() {
    var build_bound_phrase_formatter = function(style) {
        return function(elem) {
            this.check_start_of_block(elem);
            var markup = this.config.markupRules[style];
            var markup_open = markup[1];
            var markup_close = markup[2] || markup_open;

            var wikitext = elem.wikitext;

            var prev_node = elem.previousSibling;
            if (prev_node && prev_node.nodeType == 3) { // Same as .getPreviousTextNode
                if (prev_node.nodeValue.match(/\w$/) && wikitext.match(/^\S/)) {
                    // If there is no room for markup at the front, discard the markup.
                    // Example: "x<b>y</b> z" should become "xy z", not "x*y* z".
                    return wikitext;
                }
                else if (prev_node.nodeValue.match(/\s$/)) {
                    // Strip whitespace at the front if there's already
                    // trailing whitespace from the previous node.
                    // Example: "x <b> y</b>" becomes "x <b>y</b>".
                    wikitext = wikitext.replace(/^\s+/, '');
                }
            }

            var next_node = elem.nextSibling;
            if (next_node && next_node.nodeType == 3) { // Same as .getNextTextNode
                if (next_node.nodeValue.match(/^\w/) && wikitext.match(/\S$/)) {
                    // If there is no room for markup at the end, discard the markup.
                    // Example: "x <b>y</b>z" should become "x yz", not "x *y*z".
                    return wikitext;
                }
                else if (next_node.nodeValue.match(/^\s/)) {
                    // Strip whitespace at the end if there's already
                    // leading whitespace from the next node.
                    // Example: "x <b> y</b>" becomes "x <b>y</b>".
                    wikitext = wikitext.replace(/\s+$/, '');
                }
            }

            // Do not markup empty text: {bz: 4677}
            if (!(/\S/.test(wikitext))) {
                return wikitext;
            }

            // Finally, move whitespace outward so only non-whitespace
            // characters are put into markup.
            // Example: "x<b> y </b>z" becomes "x *y* z".
            return wikitext
                .replace(/^(\s*)/, "$1" + markup_open)
                .replace(/(\s*)$/, markup_close + "$1")
                .replace(/\n/g, ' ');
        }
    }

    // These tags are trivial ones.
    var style_of = {
        b: 'bold',
        strong: 'bold',
        i: 'italic',
        em: 'italic',
        strike: 'strike',
        del: 'strike',
        s: 'strike',
        tt: 'code',
        code: 'code',
        kbd: 'code',
        samp: 'code',
        'var': 'code',
        u: 'underline'
    };

    for(var tag in style_of) {
        proto[ "format_" + tag ] = build_bound_phrase_formatter( style_of[ tag ] );
    }
})();

;
// BEGIN Wikiwyg/DataValidator.js
proto = new Subclass('Wikiwyg.DataValidator');

proto.stopped = false;

proto.setup = function(div_id) {
    this.div = document.getElementById(div_id);
    this.setupTest();
}

proto.setupTest = function() {
    var self = this;
    Jemplate.Ajax.get(
        'index.cgi?action=wikiwyg_all_page_ids', 
        function(r) { self.showPageIds(r) }
    );
}

proto.showPageIds = function(page_list) {
    this.all_page_ids = page_list.split('\n');
    this.div.innerHTML =
        "<p>Total Number of pages : " + this.all_page_ids.length + '</p>';
    this.start_submit = Wikiwyg.createElementWithAttrs(
        'input', { type: "submit", value: "Run Tests" }, document);
    var self = this;
    this.start_submit.onclick = function() { self.runAllTests() };
    this.div.appendChild(this.start_submit);
}

proto.stopTests = function() {
    this.stopped = true;
    this.start_submit.onclick = null;
    this.start_submit.value = 'Testing Stopped';
}

proto.runAllTests = function() {
    var self = this;
    this.start_submit.onclick = function() { self.stopTests() };
    this.start_submit.value = 'Stop Tests';
    var run_all = function(session_id) {
        self.session_id = session_id;
        self.initProgressBar();

        self.current_test_number = 0;
        self.runPageTest();
    }
    Jemplate.Ajax.get('index.cgi?action=wikiwyg_start_validation', run_all);
}

proto.initProgressBar = function() {
    this.remaining_tests = this.all_page_ids.length;
    this.current_page_id_span = document.createElement("span");
    this.remaining_tests_span = document.createElement("span");
    this.progress_bar = document.createElement("p");
    var a = document.createElement('span');
    a.appendChild(document.createTextNode('Remaining tests: '));
    var b = document.createElement('span');
    b.appendChild(document.createTextNode('. Running test for: '));
    this.progress_bar.appendChild(a);
    this.progress_bar.appendChild(this.remaining_tests_span);
    this.progress_bar.appendChild(b);
    this.progress_bar.appendChild(this.current_page_id_span);
    this.div.appendChild(this.progress_bar);
    var c = document.createElement('p');
    c.appendChild(document.createTextNode(
        'Results will be in /tmp/wikiwyg_data_validation/' + this.session_id
    ));
    this.div.appendChild(c);
}

proto.updateProgressBar = function() {
    this.current_page_id_span.innerHTML = this.page_id;
    this.remaining_tests_span.innerHTML = this.remaining_tests--;
}

proto.runPageTest = function() {
    if (this.stopped)
        return;
    this.page_id = this.all_page_ids[this.current_test_number];
    this.updateProgressBar();
    var self = this;
    Jemplate.Ajax.get(
        'index.cgi?action=wikiwyg_get_page_html2;page_id=' + this.page_id +
        ';session_id=' + this.session_id,
        function(r) { self.wikiwygRoundTrip(r) }
    );
}

proto.wikiwygRoundTrip = function(html) {
    var simple = wikiwyg.mode_objects[WW_SIMPLE_MODE];
    var self = this;
    simple.fromHtml(html);
    simple.toHtml( function(h) { self.sendBackWikitext(h) } );
}

proto.sendBackWikitext = function(html) {
    var advanced = wikiwyg.mode_objects[WW_ADVANCED_MODE];
    var wikitext = advanced.convert_html_to_wikitext(html);
    var uri = location.pathname;
    var postdata = 'action=wikiwyg_save_validation_result;session_id=' +
        this.session_id + ';page_id=' + this.page_id + ';content=' +
        encodeURIComponent(wikitext);
    var self = this;
    var already_run = false;
    var func = function(who_cares) {
        if (already_run) return;
        already_run = true;
        self.current_test_number++;
        if (self.current_test_number < self.all_page_ids.length) {
            self.runPageTest();
        }
        else {
            self.page_id = '';
            self.updateProgressBar();
        }
    }
    // If not done in 5 seconds, we need to move on. This happens in IE.
    setTimeout(func, 5000);
    Jemplate.Ajax.post(uri, postdata, func);
}
;
// BEGIN wikiwyg.js
if (Socialtext.S3) {
    jQuery('#bootstrap-loader').hide();

    setup_wikiwyg();
    window.wikiwyg.start_nlw_wikiwyg();

    $("#st-edit-pagetools-expand").click(function() {
        Socialtext.ui_expand_toggle();
        $(window).trigger("resize");

        // This hack cause IE to redraw itself, improving the expanded mode
        // view.
        if ($.browser.msie) {
            $('#st-edit-pagetools-expand').blur();
            $('#st-save-button-link').hide();
            setTimeout(function() {
                $('#st-save-button-link').show();
            }, 100);
        }
        else if (Wikiwyg.is_gecko) {
            setTimeout(function() {
                if (window.wikiwyg.current_mode && window.wikiwyg.current_mode.get_edit_document) {
                    window.wikiwyg.current_mode.get_edit_document()
                        .execCommand("enableObjectResizing", false, false);
                    window.wikiwyg.current_mode.get_edit_document()
                        .execCommand("enableInlineTableEditing", false, false);
                }
            }, 100);
        }

        return false;
    });
}
;
// BEGIN lib/Document/Emitter.js
Class('Document.Emitter', function() {

var proto = this.prototype;
proto.className = 'Document.Emitter';

proto.instantiate = function() {
    return eval('new ' + this.className + '()');
}

proto.init = function() {
    this.output = '';
}

proto.content = function() {
    return this.output;
}

proto.insert = function(receiver) {
    this.output += receiver.output;
}

});
;
// BEGIN lib/Document/Emitter/HTML.js
Class('Document.Emitter.HTML(Document.Emitter)', function() {

var proto = this.prototype;
proto.className = 'Document.Emitter.HTML';

proto.content = function() {
    return this.output;
}

proto.begin_node = function(node) {
    var tag = node.type;
    switch (tag) {
        case 'asis': case 'line': return;
        case 'br': case 'hr': {
            this.output += '<'+tag+' />';
            return;
        }
        case 'html': {
            var onload = "if (typeof(ss) != 'undefined' && ss.editor) { var recalc = function () { try { ss.editor.DoPositionCalculations() } catch (e) { setTimeout(recalc, 500) } }; recalc() } if (!window.image_dimension_cache) window.image_dimension_cache = {};window.image_dimension_cache['https://www2.socialtext.net/data/wafl/Raw%20HTML%20section.%20Edit%20in%20Wiki%20Text%20mode.?uneditable=1'] = [ this.offsetWidth, this.offsetHeight ]; this.style.width = this.offsetWidth + 'px'; this.style.height = this.offsetHeight + 'px'";
            this.output += '<img alt="st-widget-'+node._html.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/>/, '&gt;')+'" src="https://www2.socialtext.net/data/wafl/Raw%20HTML%20section.%20Edit%20in%20Wiki%20Text%20mode.?uneditable=1" title="Raw HTML section. Edit in Wiki Text mode." onload="'+onload+'" />';
            return;
        }
        case 'waflparagraph': case 'waflphrase': case 'im': {
            var onload = "if (typeof(ss) != 'undefined' && ss.editor) { var recalc = function () { try { ss.editor.DoPositionCalculations() } catch (e) { setTimeout(recalc, 500) } }; recalc() } if (!window.image_dimension_cache) window.image_dimension_cache = {};window.image_dimension_cache['https://www2.socialtext.net/data/wafl/"+node._label.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "\\'").replace(/\\/g, "\\\\")+"'] = [ this.offsetWidth, this.offsetHeight ]; this.style.width = this.offsetWidth + 'px'; this.style.height = this.offsetHeight + 'px'";

            if ((!Document.Emitter.HTML.renderImageAsNormalWAFL) && node._wafl.match(/^image:\s*(\S+)(?:\s+size=(\w+))?/)) {
                var imageName = RegExp.$1;
                var width = RegExp.$2;
                switch (width) {
                    case 'small':  { width = '100'; break; }
                    case 'medium': { width = '300'; break; }
                    case 'large':  { width = '600'; break; }
                }
                if (width && width.search(/^[.\d]+$/) == 0) {
                    width = ' width="'+width+'"';
                }
                if ((typeof $ != 'undefined') && $('#st-attachment-listing').size()) {
                    var found = null;
                    $('#st-attachment-listing a').each(function(){
                        var $_ = $(this);
                        if ($_.text() == imageName) {
                            found = '<img alt="st-widget-{'+node._wafl.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/>/, '&gt;')+'}" src="' + $_.attr('href') + '" onload="'+onload+'"'+width+' />';
                            return false;
                        }
                    });
                    if (found) {
                        this.output += found;
                        return;
                    }
                }
            }
            this.output += '<img alt="st-widget-{'+node._wafl.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/>/, '&gt;')+'}" src="https://www2.socialtext.net/data/wafl/'+encodeURIComponent(node._label).replace(/%2F/g, '/')+'" onload="'+onload+'" />';
            return;
        }
        case 'a': case 'wikilink': {
            this.output += '<a href="'+encodeURI(node._href)+'">';
            return;
        }
        case 'file': {
            this.output += '<a title="(network resource)" href="'+encodeURI(node._href)+'">';
            return;
        }
        case 'table': {
            var cls = 'formatter_table';

            if (node._sort) { cls += ' sort' }
            if (!node._border) { cls += ' borderless' }

            this.output += '<table '
                         + (node._border ? 'border="1" ' : '')
                         + 'style="border-collapse:collapse" '
                         + 'options="'+node._options+'" '
                         + 'class="'+cls+'"'
                         + ">\n";
            return;
        }
        case 'ul': case 'ol': case 'table': case 'tr': {
            this.output += '<'+tag+">\n";
            return;
        }
        default: {
            this.output += '<'+tag+'>';
            return;
        }
    }
}

proto.end_node = function(node) {
    var tag = node.type;
    switch (tag) {
        case 'asis': case 'br': case 'hr': case 'html': case 'waflparagraph': case 'waflphrase': case 'im': return;
        case 'line': {
            this.output += '<br />';
            return;
        }
        case 'file': case 'wikilink': {
            this.output += '</a>';
            return;
        }
        default: {
            if (tag.search(/^(?:p|ul|ol|li|h\d|table|tr|td)$/) == 0) {
                this.output += '</'+tag+">\n";
            }
            else {
                this.output += '</'+tag+'>';
            }
            return;
        }
    }
    return;
}

var FFFC = new RegExp(String.fromCharCode(0xFFFC), 'g');
proto.text_node = function(text, type) {
    if (/[&<>"']/.test(text)) {
        this.output += text
            .replace(/&/g, '&amp;')
            .replace(/>/g, '&gt;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&#34;')
            .replace(/'/g, '&#39;')
            .replace(FFFC, '<br />');
    }
    else {
        this.output += text.replace(FFFC, '<br />');
    }
}

});
;
// BEGIN lib/Document/Parser.js
Class('Document.Parser', function() {

var proto = this.prototype;

proto.className = 'Document.Parser';

proto.init = function() {}

proto.parse = function(input, receiver) {
    if (typeof input != 'string') return '';
    this.input = (input.search(/\n$/) == -1) ? input+"\n" : input;
    if (receiver) this.receiver = receiver;
    this.receiver.init();
    this.grammar = this.create_grammar();
    this.parse_blocks('top');
    return this.receiver.content();
}

proto.create_grammar = function() {
    throw "Please define create_grammar in a derived class of Document.Parser.";
};

//------------------------------------------------------------------------------
// Parse input into a series of blocks. With each iteration the parser must
// match a block at position 0 of the text, and remove that block from the
// input reparse it further. This continues until there is no input left.
//------------------------------------------------------------------------------
proto.parse_blocks = function(container_type) {
    var types = this.grammar[container_type].blocks; // Document.contains[container_type];
    if (!types) return;
    while (this.input.length) {
        var length = this.input.length;
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var matched = this.find_match('matched_block', type);
            if (matched) {
                this.input = this.input.substr(matched.end);
                this.handle_match(type, matched);
                break;
            }
        }
        if (this.input.length >= length)
            throw this.classname + ': Reduction error for:\n' + this.input +
            '\n' + JSON.stringify(this);
    }
    return;
}

proto.handle_match = function(type, match) {
    var grammar = this.grammar[type];
    var parse = grammar.blocks ? 'parse_blocks' : 'parse_phrases';
    // console.log("Subparsing " + parse + '(' + type + '): ');
    // console.log(match);
    this.subparse(parse, match, type, grammar.filter);
}

proto.find_match = function(matched_func, type) {
    var rule = this.grammar[type];
    var re = rule.match;
    if (!re) throw 'no regexp for type: ' + type;
    var text_to_match = this.input;
    if (rule.pre_match) {
        text_to_match = rule.pre_match(text_to_match);
    }
    var capture = text_to_match.match(re);
    if (capture) {
        // console.log("Found match " + type + " - " + matched_func);
        var match = this[matched_func].call(this, capture, this.grammar[type].lookbehind);
        match.type = this.grammar[type].type || type;
        if (rule.post_match) {
            match.text = rule.post_match(match.text);
        }
        return match;
    }
    return;
};

//------------------------------------------------------------------------------
// This code parses a chunk into interleaved pieces of plain text and
// phrases. It repeatedly tries to match every possible phrase and
// then takes the match closest to the start. Everything before a
// match is written as text. Matched phrases are subparsed according
// to their rules. This continues until the input is all eaten.
//------------------------------------------------------------------------------
proto.parse_phrases = function(container_type) {
    var types = this.grammar[container_type].phrases;
    if (!types) { this.receiver.text_node(this.input || ''); return }
    // console.log("INPUT: " + this.input);
    while (this.input.length) {
        var match = null;
        for (var i = 0; i < types.length; i++) {
            var type = types[i];
            var matched = this.find_match('matched_phrase', type);
            if (! matched) continue;

            if (!match || (matched.begin < match.begin)) {
                match = matched;
                if (match.begin == 0) break;
            }
        }
        if (!match) {
            // console.log("NO MATCH: " + this.input);
            this.receiver.text_node(this.input || '');
            break;
        }
        if (match.begin != 0) {
            // console.log("MATCH OFFSET:" + this.input + " (" + match.type + ")" + match.begin);
            this.receiver.text_node(this.input.substr(0, match.begin) || '');
            }
        this.input = this.input.substr(match.end);
        this.handle_match(match.type, match);
    }
    return;
}

proto.subparse = function(func, match, type, filter) {
    /* The call could cause side effects to the match object. */
    match.type = this.grammar[type].type;
    if (match.type == null) match.type = type;

    var filtered_text = filter ? filter(match) : null;

    if (match.type) this.receiver.begin_node(match);

    var parser = new Document.Parser.Wikitext();

    parser.input = (filtered_text == null) ? match.text : filtered_text;
    parser.grammar = this.grammar;
    parser.receiver = this.receiver.instantiate();
    // console.log("SEEDED: (" + type + ")" + parser.input);
    parser[func].call(parser, type);
    this.receiver.insert(parser.receiver);

    if (match.type) this.receiver.end_node(match);
}

//------------------------------------------------------------------------------
// Helper functions
//
// These are the odds and ends called by the code above.
//------------------------------------------------------------------------------

/* Blocks has no lookbehinds, so:
 * All match begins at 0. The first capture is text; the next ones are various parts.
 */
proto.matched_block = function(capture) {
    return {
        begin: capture.index,
        text: capture[1],
        end: capture[0].length,
        1: capture[2],
        2: capture[3],
        3: capture[4]
    };
}

/* The first capture in a Phrases is the lookbehind. So:
 */
proto.matched_phrase = function(capture, lookbehind) {
    if (lookbehind) {
        var text = capture[2];
        var begin = this.input.indexOf(capture[1]);
        return {
            text: text,
            begin: begin,
            end: (begin + capture[1].length),
            1: RegExp.$2,
            2: RegExp.$3,
            3: RegExp.$4
        };
    }

    return {
        begin: capture.index,
        text: capture[1],
        end: capture.index + capture[0].length,
        1: capture[2],
        2: capture[3],
        3: capture[4]
    };
}

});
;
// BEGIN lib/Document/Parser/Wikitext.js
Class('Document.Parser.Wikitext(Document.Parser)', function() {

var proto = this.prototype;
proto.className = 'Document.Parser.Wikitext';

proto.init = function() {}

proto.create_grammar = function() {
    var all_blocks = ['pre', 'html', 'hr', 'hx', 'waflparagraph', 'ul', 'ol', 'blockquote', 'table', 'p', 'empty', 'else'];

    // Phrase TODO: im
    var all_phrases = ['waflphrase', 'asis', 'wikilink', 'wikilink2', 'a', 'im', 'mail', 'file', 'tt', 'b', 'i', 'del', 'a'];

    var re_huggy = function(brace1, brace2) {
        var preAlphaNum = '\\w';
        if (brace1 == '-') { preAlphaNum += ':;'; }
        brace2 = '\\' + (brace2 || brace1);
        brace1 = '\\' + brace1;
        return {
            match: new RegExp('(?:^|[^'+brace1+preAlphaNum+'])('+brace1+'(?=\\S)(?!'+brace2+')(.*?[^\\s'+brace2+'])'+brace2+'(?=[^'+brace2+'\\w]|$))'),
            phrases: (brace1 == '\\`') ? null : all_phrases,
            lookbehind: true
        };
    };

    var im_types = {
        yahoo: 'yahoo',
        ymsgr: 'yahoo',
        callto: 'callto',
        callme: 'callto',
        skype: 'callto',
        aim: 'aim'
    };

    var im_label = {
        aim: "AIM: %1",
        yahoo: "Yahoo: %1",
        callto: "Skype: %1"
    };

    var im_re = '(\\b(';
    for (var key in im_types) {
        im_re += key + '|';
    }
    im_re = im_re.replace(/\|$/, ')\\:([^\\s\\>\\)]+))');

    var re_list = function(bullet, filter_out) {
        var exclusion = new RegExp('(^|\n)' + filter_out + '\ *', 'g');
        return {
            match: new RegExp(
                "^(" + bullet + "+\ .*\n" +
                "(?:[\*\-\+\#]+\ .*\n)*" +
                ")(?:\s*\n)?"
            ),
            blocks: ['ul', 'ol', 'subl', 'li'],
            filter: function(node) {
                return node.text.replace(exclusion, '$1');
            }
        };
    };

    var _escape_pipes = function(input) {
        // Escape | in {{...}} sections with 0xFFFC (Object Replacement) characters,
        // so the "td" parser won't get confused when parsing "| {{...|...}} |".
        return input.replace(/{{(.*?)}}/g, function(match, text){
            return '{{'+text.replace(/\|/g, String.fromCharCode(0xFFFC))+'}}';
        });
    };

    var FFFC = new RegExp(String.fromCharCode(0xFFFC), 'g');
    var _unescape_pipes = function(output) {
        // Unescape 0xFFFC back to |.
        return output.replace(/{{(.*?)}}/g, function(match, text) {
            return '{{'+text.replace(FFFC, '|')+'}}';
        });
    };

    return {
        _all_blocks: all_blocks,
        _all_phrases: all_phrases,
        top: { blocks: all_blocks },
        ol: re_list('#', '[*#]'),
        ul: re_list('[-+*]', '[-+*#]'),
        blockquote: {
            match: /^((?:>[^\n]*\n)+)(?:\s*\n)?/,
            blocks: ['blockquote', 'line'],
            filter: function(node) { return node.text.replace(/(^|\n)>\ ?/g, '$1') }
        },
        line: {
            match: /([^\n]*)\n/,
            phrases: all_phrases
        },
        subl: {
            type: 'li',
            match: /^(([^\n]*)\n[*#]+\ [^\n]*\n(?:[*#]+\ [^\n]*\n)*)(?:\s*\n)?/,
            blocks: ['ul', 'ol', 'li2']
        },
        li: {
            match: /([^\n]*)\n/,
            phrases: all_phrases
        },
        li2: {
            type: '', // Do not emit begin/end node; just reparse
            match: /([^\n]*)\n/,
            phrases: all_phrases
        },
        html: {
            match: /^(\.html\ *\n(?:[^\n]*\n)*?\.html)\ *\n(?:\s*\n)?/,
            filter: function(node) {
                node._html = node.text;
                return '';
            }
        },
        pre: { match: /^\.pre\ *\n((?:[^\n]*\n)*?)\.pre\ *\n(?:\s*\n)?/ },
        hr: { match: /^--+(?:\s*\n)?/ },
        table: {
            match: /^((?:\|\| *([^\|\n]+?) *\n)?(((\|.*\| \n(?=\|))|(\|.*\|  +\n)|(?:\|.*?\|\n))+))/,
            blocks: ['tr'],
            filter: function(node) {
                node._options = node['1'] || '';
                node._border = true;
                node._sort = false;

                var opts = node._options.match(/([^\s:=]+[:=]\s*\S*)/g) || [];
                for (var i = 0; i < opts.length; i++) {
                    var match = opts[i].match(/^([^\s:=]+)[:=]\s*(\S*)/),
                        key = match['1'],
                        val = match['2'];
                    node['_'+key] = ((val != 'off') && (val != 'false'));
                }

                return node['2'];
            }
        },

        tr: {
            match: /^((?:(?:^|\n)\|.*?\|(?:\n| \n(?=\|)|  +\n)))/,
            blocks: ['td_multi_line_block', 'td_single_line_block', 'td_phrase', 'td_final'],
            filter: function(node) { return node.text.replace(/\s+$/, '') }
        },

        td_multi_line_block: {
            pre_match: _escape_pipes,
            match: /\|[ \t]*\n?(\s*?[^|]*?\n[^|]*?)[ \t]*(?=\|)/,
            post_match: _unescape_pipes,
            blocks: ['pre', 'html', 'hr', 'hx', 'waflparagraph', 'ol', 'ul', 'blockquote', 'p', 'empty', 'else'],
            filter: function(node) {
                node.type = 'td';
                return node.text.replace(/\n?$/, '\n');
            }
        },

        td_single_line_block: {
            pre_match: _escape_pipes,
            match: /\|[ \t]*\n?((?:\*+|#+|>+|\^+)\s[^|]*?)[ \t]*(?=\|)/,
            post_match: _unescape_pipes,
            blocks: ['hx', 'ol', 'ul'],
            filter: function(node) {
                node.type = 'td';
                return node.text + '\n';
            }
        },

        td_phrase: {
            pre_match: _escape_pipes,
            match: /\|[ \t]*\n?(\s*?[^|]*?)[ \t]*(?=\|)/,
            post_match: _unescape_pipes,
            phrases: all_phrases,
            filter: function(node) {
                node.type = 'td';
                return node.text;
            }
        },

        td_final: {
            match: /^\s*\|\s*/,
            filter: function(node) { node.type = '' }
        },

        hx: {
            match: /^((\^+) *([^\n]*?)(\s+=+)?\s*?\n+)/,
            phrases: all_phrases,
            filter: function(node) {
                node.type = 'h' + node['1'].length;
                return node[2];
            }
        },
        p: {
            match: /^((?:(?!(?:(?:\^+|\#+|\*+|\-+) |\>|\.\w+\s*\n|\{[^\}\n]+\}\s*\n))[^\n]*\S[^\n]*\n)+(?:(?=^|\n)\s*\n)*)/,
            phrases: all_phrases,
            filter: function(node) { return node.text.replace(/\n$/, '').replace(/\n/g, String.fromCharCode(0xFFFC)+'\n'); }
        },
        empty: {
            match: /^(\s*\n)/,
            filter: function(node) { node.type = '' }
        },
        'else': {
            match: /^(([^\n]*)\n)/,
            phrases: [],
            filter: function(node) {
                node.type = 'p';
            }
        },
        waflparagraph: {
            match: /^(?:"[^"]+")?\{([\w-]+(?=[\:\ \}])(?:\s*:)?\x20*[^\n}]*?\x20*)\}[\ \t]*\n(?:\s*\n)?/,
            filter: function(node) {
                node._wafl = node._label = node.text;
                // node._function = node._wafl.replace(/[: ].*/, '');;
                // node._options = node._wafl.replace(/^[^: ]*[: ]?/, '');
                return '';
            }
        },
        waflphrase: {
            match: /(?:^|[\s\-])((?:"([^\n]+?)")?\{([\w-]+(?=[\:\ \}])(?:\s*:)?\x20*[^\n]*?\x20*)\}(?=[\W_]|$))/,
            filter: function(node) {
                node._wafl = node[2];
                node._label = node[1] || node._wafl;
                // node._function = node._wafl.replace(/[: ].*/, '');;
                // node._options = node._wafl.replace(/^[^: ]*[: ]?/, '');
                return '';
            },
            lookbehind: true
        },
        asis: {
            match: /(\{\{([^\n]*?)\}\}(\}*))/,
            filter: function(node) {
                node.type = '';
                return(node[1] + node[2]);
            }
        },
        wikilink: {
            match: /(?:^|[_\W])(\[()(?=[^\s\[\]])(.*?)\](?=[_\W]|$))/,
            filter: function(node) {
                node._href = '?' + node[2];
                return(node.text || node[2]);
            },
            lookbehind: true
        },
        wikilink2: {
            type: 'wikilink',
            match: /(?:"([^"]*)"\s*)(\[(?=[^\s\[\]])(.*?)\](?=[_\W]|$))/,
            filter: function(node) {
                node._href = '?' + node[2];
                return(node[1] || node[2]);
            }
        },
        a: {
            match: /((?:"([^"]*)"\s*)?<?((?:http|https|ftp|irc|file):(?:\/\/)?[\;\/\?\:\@\&\=\+\$\,\[\]\#A-Za-z0-9\-\_\.\!\~\*\'\(\)%]+[A-Za-z0-9\/#])>?)/,
            filter: function(node) {
                node._href = node[2];
                return(node[1] || node[2]);
            }
        },
        file: {
            match: /((?:"([^"]*)")?<(\\\\[^\s\>\)]+)>)/,
            filter: function(node) {
                var href = node[2].replace(/^\\\\/, '');
                node._href = "file://" + href.replace(/\\/g, '/');
                return(node['1'] || href);
            }
        },
        im: {
            match: (new RegExp(im_re)),
            filter: function(node) {
                node._wafl = node[1] + ': ' + node[2];
                node._label = (im_label[im_types[node[1]]] || '%1').replace(/%1/g, node[2]);
                return '';
            }
        },
        mail: {
            match: /([\w+%\-\.]+@(?:[\w\-]+\.)+[\w\-]+)/,
            filter: function(node) {
                node.type = 'a';
                node._href = "mailto:" + node.text.replace(/%/g, '%25');
            }
        },
        tt: re_huggy('`'), // Special-cased in re_huggy above to disallow subphrases
        b: re_huggy('*'),
        i: re_huggy('_'),
        del: re_huggy('-')
    };
};

});
;
