// BEGIN jemplate_wikiwyg/st_page_editing_toolbar
Jemplate.templateMap['st_page_editing_toolbar'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<div id="st-page-editing-toolbar">\n <div class="wikiwyg_toolbar" id="wikiwyg_toolbar" style="display: block;">\n  <div class="other_buttons">\n  <img class="wikiwyg_button" id="wikiwyg_button_bold" alt="';
//line 4 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.bold' ]]);
output += '" title="';
//line 4 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.bold' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/bold.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_italic" alt="';
//line 5 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.italic' ]]);
output += '" title="';
//line 5 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.italic' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/italic.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_strike" alt="';
//line 6 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.strike-through' ]]);
output += '" title="';
//line 6 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.strike-through' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/strike.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_h1" alt="';
//line 8 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.h1' ]]);
output += '" title="';
//line 8 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.h1' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/h1.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_h2" alt="';
//line 9 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.h2' ]]);
output += '" title="';
//line 9 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.h2' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/h2.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_h3" alt="';
//line 10 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.h3' ]]);
output += '" title="';
//line 10 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.h3' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/h3.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_h4" alt="';
//line 11 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.h4' ]]);
output += '" title="';
//line 11 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.h4' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/h4.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_p" alt="';
//line 12 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.p' ]]);
output += '" title="';
//line 12 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.p' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/p.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_ordered" alt="';
//line 14 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.ol' ]]);
output += '" title="';
//line 14 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.ol' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/ordered.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_unordered" alt="';
//line 15 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.ul' ]]);
output += '" title="';
//line 15 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.ul' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/unordered.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_outdent" alt="';
//line 16 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.outdent' ]]);
output += '" title="';
//line 16 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.outdent' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/outdent.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_indent" alt="';
//line 17 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.indent' ]]);
output += '" title="';
//line 17 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.indent' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/indent.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_link" alt="';
//line 19 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.link' ]]);
output += '" title="';
//line 19 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.link' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/link.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_image" alt="';
//line 20 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.image' ]]);
output += '" title="';
//line 20 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.image' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/image.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_widget" alt="';
//line 21 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.widget' ]]);
output += '" title="';
//line 21 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.widget' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/widget.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_video" alt="';
//line 22 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.video' ]]);
output += '" title="';
//line 22 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.video' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/video.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_table" alt="';
//line 24 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.new-table' ]]);
output += '" title="';
//line 24 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.new-table' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/table.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_table-settings" alt="';
//line 25 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.table-settings' ]]);
output += '" title="';
//line 25 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.table-settings' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/table-settings.png"/><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n />\n  </div>\n  <div class="table_buttons disabled">\n   <img class="wikiwyg_button" id="wikiwyg_button_add-row-below" alt="';
//line 29 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.add-row-below-current-row' ]]);
output += '" title="';
//line 29 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.add-row-below-current-row' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/add-row-below.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_add-row-above" alt="';
//line 30 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.add-row-above-current-row' ]]);
output += '" title="';
//line 30 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.add-row-above-current-row' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/add-row-above.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_move-row-down" alt="';
//line 31 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.move-row-down' ]]);
output += '" title="';
//line 31 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.move-row-down' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/move-row-down.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_move-row-up" alt="';
//line 32 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.move-row-up' ]]);
output += '" title="';
//line 32 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.move-row-up' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/move-row-up.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_del-row" alt="';
//line 33 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.delete-table-row' ]]);
output += '" title="';
//line 33 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.delete-table-row' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/del-row.png"\n /><img class="wikiwyg_separator" alt=" | " title="" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/separator.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_add-col-left" alt="';
//line 35 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.add-column-left' ]]);
output += '" title="';
//line 35 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.add-column-left' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/add-col-left.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_add-col-right" alt="';
//line 36 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.add-column-right' ]]);
output += '" title="';
//line 36 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.add-column-right' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/add-col-right.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_move-col-left" alt="';
//line 37 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.move-column-left' ]]);
output += '" title="';
//line 37 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.move-column-left' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/move-col-left.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_move-col-right" alt="';
//line 38 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.move-column-right' ]]);
output += '" title="';
//line 38 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.move-column-right' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/move-col-right.png"\n /><img class="wikiwyg_button" id="wikiwyg_button_del-col" alt="';
//line 39 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.delete-table-column' ]]);
output += '" title="';
//line 39 "st_page_editing_toolbar"
output += stash.get(['loc', [ 'wikiwyg.delete-table-column' ]]);
output += '" src="/static/3.4.0.1/skin/s2/images/wikiwyg_icons/del-col.png"\n />\n  </div>\n </div>\n';
//line 43 "st_page_editing_toolbar"
output += context.include('insert_menu');
output += '\n</div>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate_wikiwyg/insert_menu
Jemplate.templateMap['insert_menu'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += ' <div id="st-page-editing-widget-menu">\n  <ul id="st-editing-insert-menu">\n   <li><a onclick="return false" href="#">';
//line 3 "insert_menu"
output += stash.get(['loc', [ 'do.insert' ]]);
output += '</a>\n    <ul>\n     <li><a do="do_widget_image" onclick="return false;" href="#">';
//line 5 "insert_menu"
output += stash.get(['loc', [ 'insert.image' ]]);
output += '</a></li>\n     <li><a do="do_widget_video" onclick="return false;" href="#">';
//line 6 "insert_menu"
output += stash.get(['loc', [ 'insert.video' ]]);
output += '</a></li>\n     <li><a do="do_table" onclick="return false;" href="#">';
//line 7 "insert_menu"
output += stash.get(['loc', [ 'insert.table' ]]);
output += '</a></li>\n     <li><a do="do_hr" onclick="return false;" href="#">';
//line 8 "insert_menu"
output += stash.get(['loc', [ 'insert.hr' ]]);
output += '</a></li>\n     <li><a onclick="return false" href="#" class="daddy">';
//line 9 "insert_menu"
output += stash.get(['loc', [ 'insert.link-to' ]]);
output += '</a>\n      <ul>\n       <li><a do="do_widget_file" onclick="return false;" href="#">';
//line 11 "insert_menu"
output += stash.get(['loc', [ 'insert.file' ]]);
output += '</a></li>\n       <li><a do="do_widget_link2_section" onclick="return false;" href="#">';
//line 12 "insert_menu"
output += stash.get(['loc', [ 'insert.link2-section' ]]);
output += '</a></li>\n       <li><a do="do_widget_link2" onclick="return false;" href="#">';
//line 13 "insert_menu"
output += stash.get(['loc', [ 'insert.link2' ]]);
output += '</a></li>\n       <li><a do="do_widget_blog" onclick="return false;" href="#">';
//line 14 "insert_menu"
output += stash.get(['loc', [ 'insert.blog' ]]);
output += '</a></li>\n       <li><a do="do_widget_tag" onclick="return false;" href="#">';
//line 15 "insert_menu"
output += stash.get(['loc', [ 'insert.tag' ]]);
output += '</a></li>\n       <li><a do="do_widget_link2_hyperlink" onclick="return false;" href="#">';
//line 16 "insert_menu"
output += stash.get(['loc', [ 'insert.link2-hyperlink' ]]);
output += '</a></li>\n      </ul>\n     </li>\n     <li>\n      <a onclick="return false" href="#" class="daddy">';
//line 20 "insert_menu"
output += stash.get(['loc', [ 'insert.from-wikis' ]]);
output += '</a>\n      <ul>\n       <li><a do="do_widget_include" onclick="return false;" href="#">';
//line 22 "insert_menu"
output += stash.get(['loc', [ 'insert.include' ]]);
output += '</a></li>\n       <li><a do="do_widget_ss" onclick="return false;" href="#">';
//line 23 "insert_menu"
output += stash.get(['loc', [ 'insert.ss' ]]);
output += '</a></li>\n       <li><a do="do_widget_tag_list" onclick="return false;" href="#">';
//line 24 "insert_menu"
output += stash.get(['loc', [ 'insert.tag-list' ]]);
output += '</a></li>\n       <li><a do="do_widget_recent_changes" onclick="return false;" href="#">';
//line 25 "insert_menu"
output += stash.get(['loc', [ 'insert.recent-changes' ]]);
output += '</a></li>\n       <li><a do="do_widget_blog_list" onclick="return false;" href="#">';
//line 26 "insert_menu"
output += stash.get(['loc', [ 'insert.blog-list' ]]);
output += '</a></li>\n       <li><a do="do_widget_search" onclick="return false;" href="#">';
//line 27 "insert_menu"
output += stash.get(['loc', [ 'insert.search' ]]);
output += '</a></li>\n      </ul>\n     </li>\n     <li><a onclick="return false" href="#" class="daddy">';
//line 30 "insert_menu"
output += stash.get(['loc', [ 'insert.from-the-web' ]]);
output += '</a>\n      <ul>\n       <li><a do="do_widget_googlesearch" onclick="return false;" href="#">';
//line 32 "insert_menu"
output += stash.get(['loc', [ 'insert.googlesearch' ]]);
output += '</a></li>\n       <li><a do="do_widget_fetchrss" onclick="return false;" href="#">';
//line 33 "insert_menu"
output += stash.get(['loc', [ 'insert.fetchrss' ]]);
output += '</a></li>\n       <li><a do="do_widget_fetchatom" onclick="return false;" href="#">';
//line 34 "insert_menu"
output += stash.get(['loc', [ 'insert.atom-feed-items' ]]);
output += '</a></li>\n      </ul>\n     </li>\n     <li><a onclick="return false" href="#" class="daddy">';
//line 37 "insert_menu"
output += stash.get(['loc', [ 'insert.organizing-your-page' ]]);
output += '</a>\n      <ul>\n       <li><a do="do_widget_toc" onclick="return false;" href="#">';
//line 39 "insert_menu"
output += stash.get(['loc', [ 'insert.toc' ]]);
output += '</a></li>\n       <li><a do="do_widget_section" onclick="return false;" href="#">';
//line 40 "insert_menu"
output += stash.get(['loc', [ 'insert.section' ]]);
output += '</a></li>\n      </ul>\n     </li>\n     <li><a onclick="return false" href="#" class="daddy">';
//line 43 "insert_menu"
output += stash.get(['loc', [ 'insert.communicating' ]]);
output += '</a>\n      <ul>\n      <li><a do="do_widget_skype" onclick="return false;" href="#">';
//line 45 "insert_menu"
output += stash.get(['loc', [ 'insert.skype' ]]);
output += '</a></li>\n      <li><a do="do_widget_aim" onclick="return false;" href="#">';
//line 46 "insert_menu"
output += stash.get(['loc', [ 'insert.aim' ]]);
output += '</a></li>\n      <li><a do="do_widget_yahoo" onclick="return false;" href="#">';
//line 47 "insert_menu"
output += stash.get(['loc', [ 'insert.yahoo' ]]);
output += '</a></li>\n     </ul>\n    </li>\n    <li><a onclick="return false" href="#" class="daddy">';
//line 50 "insert_menu"
output += stash.get(['loc', [ 'insert.name-and-date' ]]);
output += '</a>\n     <ul>\n      <li><a do="do_widget_user" onclick="return false;" href="#">';
//line 52 "insert_menu"
output += stash.get(['loc', [ 'insert.user' ]]);
output += '</a></li>\n      <li><a do="do_widget_date" onclick="return false;" href="#">';
//line 53 "insert_menu"
output += stash.get(['loc', [ 'insert.date' ]]);
output += '</a></li>\n     </ul>\n    </li>\n    <li><a do="do_opensocial_gallery" onclick="return false;" href="#">';
//line 56 "insert_menu"
output += stash.get(['loc', [ 'insert.widget' ]]);
output += '</a></li>\n    <li><a do="do_widget_pre" onclick="return false;" href="#">';
//line 57 "insert_menu"
output += stash.get(['loc', [ 'insert.pre' ]]);
output += '</a></li>\n    <li><a do="do_widget_asis" onclick="return false;" href="#">';
//line 58 "insert_menu"
output += stash.get(['loc', [ 'insert.asis' ]]);
output += '</a></li>';
//line 61 "insert_menu"
if (stash.get(['hub', 0, 'current_workspace', 0, 'allows_html_wafl', 0])) {
output += '    <li><a do="do_widget_html" onclick="return false;" href="#">';
//line 60 "insert_menu"
output += stash.get(['loc', [ 'insert.html' ]]);
output += '</a></li>';
}

output += '    <li><a do="do_widget_code" onclick="return false;" href="#">';
//line 62 "insert_menu"
output += stash.get(['loc', [ 'insert.code' ]]);
output += '</a></li>\n   </ul>\n  </li>\n </ul>\n <div style="clear: both;" id="menu-style-reset"/>\n </div>\n';
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
output += stash.get(['loc', [ 'do.save' ]]);
output += '</a>\n                </li>\n                <li class="flexButton">\n                    <a class="genericOrangeButton" id="st-preview-button-link" href="#">';
//line 11 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.preview' ]]);
output += '</a>\n                </li>\n                <li class="flexButton">\n                    <a class="genericOrangeButton" id="st-cancel-button-link" href="#">';
//line 14 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.cancel' ]]);
output += '</a></li>\n                </li>\n            </ul>\n\n            <ul class="editModeSwitcher">\n                <li><a href="#" id="st-mode-wysiwyg-button" onclick="return false;">';
//line 19 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.rich-text' ]]);
output += '</a></li>\n                <li><a href="#" id="st-mode-wikitext-button" onclick="return false;">';
//line 20 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.wiki-text' ]]);
output += '</a>\n                    <a href="#" id="st-edit-tips">(?)</a>\n                </li>\n            </ul>\n        </div><!-- st-editing-tools-edit END -->\n\n        <div id="bootstrap-loader">\n            ';
//line 27 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.loading' ]]);
output += '\n            <img src="/static/skin/common/images/ajax-loader.gif">\n        </div>\n\n        ';
//line 31 "edit_wikiwyg"
output += context.include('element/edit_summary.html.tt2');
output += '\n\n\n        <div id="controlsRight">\n            <ul class="level1">\n                ';
//line 40 "edit_wikiwyg"
if (stash.get('ui_is_expanded')) {
output += '\n                <li><a href="#" title="';
//line 37 "edit_wikiwyg"
output += stash.get(['loc', [ 'info.normal-view' ]]);
output += '" id="st-edit-pagetools-expand">';
//line 37 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.normal' ]]);
output += '</a></li>\n                ';
}
else {
output += '\n                <li><a href="#" title="';
//line 39 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.expand-view' ]]);
output += '" id="st-edit-pagetools-expand">';
//line 39 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.expand' ]]);
output += '</a></li>\n                ';
}

output += '\n            </ul>\n        </div><!-- controlsRight END -->\n    </div><!-- controls END -->\n    <div id="st-edit-mode-view">\n        <div id="contentContainer">\n\n           <div id="contentTitle">\n                ';
//line 59 "edit_wikiwyg"
if (stash.get('is_new') && ! stash.get('is_incipient')) {
output += '\n                    <h2 id="st-editing-title" class="tableTitle">\n                        ';
//line 50 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.editing:' ]]);
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
output += stash.get(['loc', [ 'edit.editing=page', stash.get(['page', 0, 'display_title', 0]) ]]);
output += '">\n                        ';
//line 55 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.editing:' ]]);
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
output += stash.get(['loc', [ 'info.edit-upload' ]]);
output += '">';
//line 72 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.upload' ]]);
output += '</a>\n                                    </div>\n\n                                    <div id="st-page-editing-tagbutton">\n                                        <a id="st-edit-mode-tagbutton" class="button" href="#" title="';
//line 76 "edit_wikiwyg"
output += stash.get(['loc', [ 'info.edit-add-tag' ]]);
output += '">';
//line 76 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.add-tags' ]]);
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
output += stash.get(['loc', [ 'do.add-tags' ]]);
output += '</div>\n        <p id="st-tagqueue-tagprompt">\n            ';
//line 113 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.tag-prompt:' ]]);
output += ' <input id="st-tagqueue-field" class="st-tagqueue-input" type="text" name="tagfield"/>\n        </p>\n        <div class="list" id="st-tagqueue-list" style="display: none">\n            <span class="st-tagqueue-listlabel">\n                ';
//line 117 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.tag-queue:' ]]);
output += '\n            </span>\n        </div>\n        <div class="buttons" id="st-tagqueue-buttons">\n            <input type="button" id="st-tagqueue-close" \n                   value="';
//line 122 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.close' ]]);
output += '" />\n            <input type="submit" id="st-tagqueue-addbutton"\n                   value="';
//line 124 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.add-tag' ]]);
output += '" />\n        </div>\n    </form>\n</div>\n\n<div class="lightbox" id="st-newpage-duplicate-interface">\n    <form onsubmit="return false;">\n        <div class="title" id="st-newpage-duplicate-title">';
//line 131 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.page-exists' ]]);
output += '</div>\n        <br />\n        <p class="st-newpage-duplicate-prompt">';
//line 133 "edit_wikiwyg"
output += stash.get(['loc', [ 'info.page-exists:' ]]);
output += '</p>\n        <p class="st-newpage-duplicate-option"><label><input type="radio" name="st-newpage-duplicate-option" id="st-newpage-duplicate-option-different" value="different"/> ';
//line 134 "edit_wikiwyg"
output += stash.get(['loc', [ 'page.save-with-another-name:' ]]);
output += '</label> <input id="st-newpage-duplicate-pagename" size="40" type="text" name="pagename"/></p>\n        <p class="st-newpage-duplicate-option"><label><input type="radio" name="st-newpage-duplicate-option" id="st-newpage-duplicate-option-suggest" value="suggest"/> ';
//line 135 "edit_wikiwyg"
output += stash.get(['loc', [ 'page.save-with-name' ]]);
output += '</label></p>\n        <p class="st-newpage-duplicate-option"><label><input type="radio" name="st-newpage-duplicate-option" id="st-newpage-duplicate-option-append" value="append"/> ';
//line 136 "edit_wikiwyg"
output += stash.get(['loc', [ 'edit.append-to-page:' ]]);
output += ' "<span id="st-newpage-duplicate-appendname">XXX</span>"</label></p>\n        <div id="st-newpage-duplicate-buttons" style="float: right">\n            <ul class="widgetButton" style="float:left; padding:10px">\n                <li class="flexButton">\n                    <a class="submit genericOrangeButton" id="st-newpage-duplicate-okbutton" href="#">\n                        ';
//line 141 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.ok' ]]);
output += '\n                    </a>\n                </li>\n            </ul>\n            <ul class="widgetButton" style="float:left; padding:10px">\n                <li class="flexButton">\n                    <a class="close genericOrangeButton" id="st-newpage-duplicate-cancelbutton" href="#">\n                        ';
//line 148 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.cancel' ]]);
output += '\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </form>\n</div>\n\n<div id="st-newpage-save" class="lightbox">\n    <form id="st-newpage-save-form">\n    <div id="st-newpage-save-interface">\n        <div class="title" id="st-newpage-save-title">';
//line 159 "edit_wikiwyg"
output += stash.get(['loc', [ 'page.save-as' ]]);
output += '</div>\n        <p id="st-newpage-save-prompt">';
//line 160 "edit_wikiwyg"
output += stash.get(['loc', [ 'info.new-page-name' ]]);
output += '</p>\n        <p id="st-newpage-save-field-pagename">\n            ';
//line 162 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-title:' ]]);
output += ' <input id="st-newpage-save-pagename" size="45" type="text" name="pagename"/>\n        </p>\n        <p id="st-newpage-save-tip">';
//line 164 "edit_wikiwyg"
output += stash.get(['loc', [ 'info.new-page-title' ]]);
output += '</p>\n        <div class="buttons" id="st-newpage-save-buttons">\n            <table width="100%" border="0">\n            <tr>\n            <td align="right"><input type="button" id="st-newpage-save-cancelbutton" value="';
//line 168 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.cancel' ]]);
output += '"/></td>\n            <td width="70px" align="right"><input type="submit" id="st-newpage-save-savebutton" value="';
//line 169 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.save' ]]);
output += '" /></td>\n            </tr>\n            </table>\n        </div>\n    </div>\n    </form>\n</div>\n\n<div style="overflow-y:scroll;height:400px" id="st-ref-card" class="lightbox">\n    <div class="buttons">\n        <input id="st-ref-card-close" class="close" type="button" value="';
//line 179 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.close' ]]);
output += '"/>\n    </div>\n    <table class="st-refcard-table">\n        <tr class="st-refcard-table-row">\n            <th>';
//line 183 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.to-get-this' ]]);
output += ' </th>\n            <th>';
//line 184 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.type-this' ]]);
output += '</th>\n        </tr>\n        <tr class="st-refcard-table-row">\n            <td><b>';
//line 187 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.bold-words' ]]);
output += '</b></td>\n            <td>*';
//line 188 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.*bold-words*' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><i>';
//line 191 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.italic-words' ]]);
output += '</i></td>\n            <td>';
//line 192 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard._italic-words_' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><del>';
//line 195 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.strikeout' ]]);
output += '</del></td>\n            <td>-';
//line 196 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.-strikeout-' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><tt>';
//line 199 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.monospace' ]]);
output += '</tt></td>\n            <td>`';
//line 200 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.`monospace`' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>\n                <table class="formatter_table"><tbody>\n                    <tr>\n                        <td>';
//line 206 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.table' ]]);
output += '</td>\n                        <td>';
//line 207 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.value' ]]);
output += '</td>\n                    </tr>\n                    <tr>\n                        <td>';
//line 210 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.dinette' ]]);
output += '</td>\n                        <td>';
//line 211 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.$75' ]]);
output += '</td>\n                    </tr>\n                </table>\n            </td>\n            <td>';
//line 215 "edit_wikiwyg"
output += '| ' + stash.get(['loc', [ 'refcard.table' ]]) + ' | ' + stash.get(['loc', [ 'refcard.value' ]]) + ' |<br>| ' + stash.get(['loc', [ 'refcard.dinette' ]]) + ' | ' + stash.get(['loc', [ 'refcard.$75' ]]) + ' |<br>';
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><blockquote>';
//line 218 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.indented-lines' ]]);
output += '</blockquote></td>\n            <td>&gt;indented<br>&gt;lines</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="Page%20Link" title="';
//line 222 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-link' ]]);
output += '" target="_blank">';
//line 222 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-link' ]]);
output += '</a></td>\n            <td>[';
//line 223 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-link' ]]);
output += ']</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="Page%20Link" title="';
//line 226 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-name' ]]);
output += '" target="_blank">';
//line 226 "edit_wikiwyg"
output += stash.get(['loc', [ 'wafl.link-text' ]]);
output += '</a></td>\n            <td>"';
//line 227 "edit_wikiwyg"
output += stash.get(['loc', [ 'wafl.link-text' ]]);
output += '" [';
//line 227 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-name' ]]);
output += ']</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><u>';
//line 230 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-link' ]]);
output += '</u> ';
//line 230 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.to-different-workspace' ]]);
output += '</td>\n            <td>{link: different-workspace [';
//line 231 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-link' ]]);
output += ']}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>';
//line 234 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-section-name' ]]);
output += '</td>\n            <td>{section: ';
//line 235 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-section-name' ]]);
output += '}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><u>';
//line 238 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.link-to-section' ]]);
output += '</u> ';
//line 238 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.in-same-page' ]]);
output += '</td>\n            <td>{link: ';
//line 239 "edit_wikiwyg"
output += stash.get(['loc', [ 'wafl.section' ]]);
output += '} ';
//line 239 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.headings-are-sections' ]]);
output += '</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><u>';
//line 242 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.link-to-section' ]]);
output += '</u> ';
//line 242 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.of-different-page' ]]);
output += '</td>\n            <td>{link: [';
//line 243 "edit_wikiwyg"
output += stash.get(['loc', [ 'refcard.page-name' ]]);
output += '] ';
//line 243 "edit_wikiwyg"
output += stash.get(['loc', [ 'wafl.section' ]]);
output += '}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><u>Link to section</u> of a page in another workspace</td>\n            <td>{link: another workspace [Page Title] Section}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="http://www.socialtext.com/" title="[external link]" target="_blank">http://www.socialtext.com/</a></td>\n            <td>http://www.socialtext.com/</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="mailto:info@socialtext.com/" title="[email link]">info@socialtext.com</a></td>\n            <td>info@socialtext.com</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="http://www.socialtext.com/" title="[external link]" target="_blank">Socialtext Home Page</a></td>\n            <td>"Socialtext Home Page"&lt;http://www.socialtext.com&gt;</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="mailto:info@socialtext.com/" title="[email link]">Socialtext Email</a></td>\n            <td>"Socialtext Email"&lt;mailto:info@socialtext.com&gt;</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><img src="/static/skin/s2/images/logo-bar-12.gif" alt="[external image]" border="0"></td>\n            <td>&lt;http://www.socialtext.com/images/socialtext-140.gif&gt;</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><hr></td>\n            <td>----</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><ul><li> item 1 <ul><li> subitem 1 </li></ul></li><li> item 2 </li></ul></td>\n            <td>* item 1<br>** subitem 1<br>* item 2</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><ol><li> item 1 <ol><li> subitem 1 </li></ol></li><li> item 2 </li></ol></td>\n            <td># item 1<br>## subitem 1<br># item 2</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h1>heading 1</h1></td>\n            <td>^ heading 1</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h2>heading 2</h2></td>\n            <td>^^ heading 2</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h3>heading 3</h3></td>\n            <td>^^^ heading 3</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h4>heading 4</h4></td>\n            <td>^^^^ heading 4</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h5>heading 5</h5></td>\n            <td>^^^^^ heading 5</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><h6>heading 6</h6></td>\n            <td>^^^^^^ heading 6</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><img src="/static/skin/s2/images/logo-bar-12.gif" alt=" [image attachment]" border="0"></td>\n            <td>{image: logo-bar-12.gif} (image attached to page)</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><img src="/static/skin/s2/images/logo-bar-12.gif" alt="[image attachment]" border="0"></td>\n            <td>{image: workspace [page name] logo-bar-12.gif} (image attached to a page in another workspace)</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="./proposal.pdf">proposal.pdf</a> on this page</td>\n            <td>{file: proposal.pdf} on this page</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><a href="./proposal.pdf">proposal.pdf</a> on <u>page name</u></td>\n            <td>{file: [page name] proposal.pdf} - [page name]</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>My Blog blog</td>\n            <td>{blog: My Blog}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>Meeting notes category</td>\n            <td>{category: Meeting Notes}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>Yahoo user yahoouser presence</td>\n            <td>Yahoo user ymsgr:yahoouser presence</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>AOL user aimuser presence</td>\n            <td>AOL user aim:aimuser presence</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>Block of HTML</td>\n            <td>.html<br>&lt;img src="http://mysite.com/offsite.jpg"&gt;<br>.html</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>Block of text with no *special* punctuation</td>\n            <td>.pre<br>Block of text with no *special* punctuation<br>.pre</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td><sup>&#x2122;</sup></td>\n            <td>{tm}</td>\n        </tr> \n        <tr class="st-refcard-table-row">\n            <td>*this text is not bold*</td>\n            <td>{{*this text is not bold*}}</td>\n        </tr> \n    </table>\n</div>\n\n<div id="st-table-settings" class="lightbox">\n    <span class="title">';
//line 357 "edit_wikiwyg"
output += stash.get(['loc', [ 'table.edit' ]]);
output += '</span>\n    <input type="checkbox" name="sort" />\n    <label for="sort">';
//line 359 "edit_wikiwyg"
output += stash.get(['loc', [ 'table.table-sortable' ]]);
output += '</label>\n\n    <br/>\n\n    <input type="checkbox" name="border" />\n    <label for="border">';
//line 364 "edit_wikiwyg"
output += stash.get(['loc', [ 'table.show-cell-borders' ]]);
output += '</label>\n\n    <div>\n        <ul class="widgetButton" style="float:left; padding:10px">\n            <li class="flexButton">\n                <a class="submit genericOrangeButton" id="table-info-save" href="#">\n                    ';
//line 370 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.save' ]]);
output += '\n                </a>\n            </li>\n        </ul>\n        <ul class="widgetButton" style="float:left; padding:10px">\n            <li class="flexButton">\n                <a class="close genericOrangeButton" id="table-info-cancel" href="#">\n                    ';
//line 377 "edit_wikiwyg"
output += stash.get(['loc', [ 'do.cancel' ]]);
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

// BEGIN jemplate_wikiwyg/element/insert_widget_menu
Jemplate.templateMap['element/insert_widget_menu'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<ul>\n  <li class="main">Insert\n    <ul>\n      <li do="do_widget_image">Image</li>\n      <li do="do_widget_video">Video</li>\n      <li do="do_table">Table</li>\n      <li do="do_hr">Horizontal&nbsp;Line</li>\n      <li>Link\n        <ul>\n          <li do="do_widget_link2">Wiki&nbsp;Link</li>\n          <li do="do_widget_link2">Web&nbsp;Link</li>\n          <li do="do_widget_link2">Section&nbsp;Link</li>\n          <li do="do_widget_tag">Tag&nbsp;Link</li>\n          <li do="do_widget_blog">Blog&nbsp;Link</li>\n          <li do="do_widget_file">Attachment&nbsp;Link</li>\n        </ul>\n      </li>\n      <li>Content&nbsp;Block\n        <ul>\n          <li do="do_widget_toc">Table&nbsp;of&nbsp;contents</li>\n          <li do="do_widget_include">Page&nbsp;Include</li>\n          <li do="do_widget_ss">Spreadsheet&nbsp;Include</li>\n          <li do="do_widget_recent_changes">Recent&nbsp;Changes</li>\n          <li do="do_widget_blog_list">Blog&nbsp;List</li>\n          <li do="do_widget_tag_list">Tag&nbsp;List</li>\n          <li do="do_widget_search">Search&nbsp;Results</li>\n          <li do="do_widget_googlesearch">Google&nbsp;Search</li>\n        </ul>\n      </li>\n      <li>Field\n        <ul>\n          <li do="do_widget_user">Username</li>\n          <li do="do_widget_date">Local&nbsp;Date&nbsp;and&nbsp;Time</li>\n        </ul>\n      </li>\n      <li>IM&nbsp;Link\n        <ul>\n          <li do="do_widget_aim">AIM</li>\n          <li do="do_widget_yahoo">Yahoo!</li>\n          <li do="do_widget_skype">Skype</li>\n        </ul>\n      </li>\n      <li>External&nbsp;Feed\n        <ul>\n          <li do="do_widget_fetchrss">RSS</li>\n          <li do="do_widget_fetchatom">ATOM</li>\n          <li do="do_widget_technorati">Technorati</li>\n        </ul>\n      </li>\n    </ul>\n  </li>\n</ul>\n\n';
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
output += stash.get(['loc', [ 'edit.summarize' ]]);
output += '</label>\n                <input type="text" id="st-edit-summary-text-area" maxlength="250" class="input">\n            </div>\n            ';
//line 16 "element/edit_summary.html.tt2"
if (stash.get(['plugins_enabled', 0, 'grep', [ 'signals' ], 'size', 0]) && stash.get(['plugins_enabled_for_current_workspace_account', 0, 'grep', [ 'signals' ], 'size', 0])) {
output += '            <div class="signal">\n                <div class="preview" style="display: none;">Your Signal will appear as:<div id="st-edit-summary-signal-preview" class="text"></div></div>\n                <input id="st-edit-summary-signal-checkbox" type="checkbox" /><label for="st-edit-summary-signal-checkbox">';
//line 11 "element/edit_summary.html.tt2"
output += stash.get(['loc', [ 'edit.signal-to' ]]);
output += '</label>\n                <input id="st-edit-summary-signal-to" type="hidden" />\n                <span class="select" id="signal_network">...</span>\n                <img id="signal_network_warning" src="/static/skin/common/images/warning-icon.png" style="margin-right: -20px; position: relative; display: none" title="';
//line 14 "element/edit_summary.html.tt2"
output += stash.get(['loc', [ 'info.edit-summary-signal-visibility' ]]);
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
// BEGIN jemplate/opensocial-setup.html
Jemplate.templateMap['opensocial-setup.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<div id="st-widget-opensocial-setup" class="lightbox">\n    <span id="st-widget-opensocial-setup-title" class="title">';
//line 2 "opensocial-setup.html"
output += stash.get(['loc', [ 'widget.edit' ]]);
output += '</span>\n    <div id="st-widget-opensocial-setup-widgets" style="margin-top: 5px; padding: 5px; border: 1px solid #ccc; width: 600px; height: 400px; overflow: hidden; background: #f0f0f0">\n    </div>\n    <div id="st-widget-opensocial-setup-width" style="padding-top: 10px; float: left; height: 35px">\n        ';
//line 6 "opensocial-setup.html"
output += stash.get(['loc', [ 'widget.width:' ]]);
output += '\n        <select id="st-widget-opensocial-setup-width-options" name="st-widget-opensocial-setup-width-options">\n            <option value="300">';
//line 8 "opensocial-setup.html"
output += stash.get(['loc', [ 'widget.300px' ]]);
output += '</option>\n            <option value="450">';
//line 9 "opensocial-setup.html"
output += stash.get(['loc', [ 'widget.450px' ]]);
output += '</option>\n            <option value="600" selected>';
//line 10 "opensocial-setup.html"
output += stash.get(['loc', [ 'widget.600px' ]]);
output += '</option>\n            <option value="100%" selected>';
//line 11 "opensocial-setup.html"
output += stash.get(['loc', [ 'widget.100%' ]]);
output += '</option>\n        </select>\n    </div>\n    <div style="float: right" id="st-widget-opensocial-setup-buttons">\n        <ul class="widgetButton" style="float:left; padding:10px">\n            <li class="flexButton">\n                <a class="save genericOrangeButton" id="st-widget-opensocial-setup-save" href="#">\n                    ';
//line 18 "opensocial-setup.html"
output += stash.get(['loc', [ 'do.save' ]]);
output += '\n                </a>\n            </li>\n        </ul>\n        <ul class="widgetButton" style="float:left; padding:10px">\n            <li class="flexButton">\n                <a class="close genericOrangeButton" id="st-widget-opensocial-setup-cancel" href="#">\n                    ';
//line 25 "opensocial-setup.html"
output += stash.get(['loc', [ 'do.cancel' ]]);
output += '\n                </a>\n            </li>\n        </ul>\n    </div>\n</div>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate/opensocial-gallery.html
Jemplate.templateMap['opensocial-gallery.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<div id="st-widget-opensocial-gallery" class="lightbox">\n    <span id="st-widget-opensocial-gallery-title" class="title">';
//line 2 "opensocial-gallery.html"
output += stash.get(['loc', [ 'widget.insert' ]]);
output += '</span>\n    <!-- TODO: Select width? -->\n    <div id="st-widget-opensocial-gallery-widgets" style="margin-top: 5px; padding: 5px; border: 1px solid #ccc; width: 600px; height: 400px; overflow: auto; background: #f0f0f0">\n    </div>\n    <div style="float: right">\n        <ul class="widgetButton" style="float:left; padding:10px">\n            <li class="flexButton">\n                <a class="close genericOrangeButton" id="st-widget-opensocial-gallery-cancel" href="#">\n                    ';
//line 10 "opensocial-gallery.html"
output += stash.get(['loc', [ 'do.cancel' ]]);
output += '\n                </a>\n            </li>\n        </ul>\n    </div>\n</div>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

// BEGIN jemplate/add-a-block.html
Jemplate.templateMap['add-a-block.html'] = function(context) {
    if (! context) throw('Jemplate function called without context\n');
    var stash = context.stash;
    var output = '';

    try {
output += '<div id="st-widget-block-dialog" class="lightbox">\n    <span id="st-widget-block-title" class="title"></span>\n    <form id="add-a-block-form" action="#" onsubmit="return false">\n        <p>\n            <span id="st-widget-block-prompt" style="font-style: italic"></span>\n        </p>\n        <fieldset style="margin-top: 5px; padding: 5px; border: 1px solid #ccc; width: 480px">\n            <legend style="padding: 3px">';
//line 8 "add-a-block.html"
output += stash.get(['loc', [ 'wafl.content' ]]);
output += '</legend>\n            <textarea id="st-widget-block-content" wrap="soft" style="font-family: monaco, consolas, \'droid sans mono\', monospace; width: 470px; height: 240px; font-size: 11px"></textarea>\n        </fieldset>\n        <div id="st-widget-block-syntax-div" style="padding-top: 5px; float: left; display: none">\n            ';
//line 12 "add-a-block.html"
output += stash.get(['loc', [ 'code.syntax-highlight-as:' ]]);
output += '\n            <select id="st-widget-block-syntax" name="st-widget-block-syntax" style="display: none">\n            </select>\n            <select id="st-widget-block-syntax-options" name="st-widget-block-syntax-options" style="display: none">\n                <option value="">';
//line 16 "add-a-block.html"
output += stash.get(['loc', [ 'code.plain-text' ]]);
output += '</option>\n                <option data-alias="actionscript3" value="as3">';
//line 17 "add-a-block.html"
output += stash.get(['loc', [ 'code.actionscript3' ]]);
output += '</option>\n                <option value="actionscript3">';
//line 18 "add-a-block.html"
output += stash.get(['loc', [ 'code.actionscript3' ]]);
output += '</option>\n                <option data-alias="shell" value="bash">';
//line 19 "add-a-block.html"
output += stash.get(['loc', [ 'code.bash' ]]);
output += '</option>\n                <option value="c">';
//line 20 "add-a-block.html"
output += stash.get(['loc', [ 'code.c' ]]);
output += '</option>\n                <option value="csharp">';
//line 21 "add-a-block.html"
output += stash.get(['loc', [ 'code.c#' ]]);
output += '</option>\n                <option value="cpp">';
//line 22 "add-a-block.html"
output += stash.get(['loc', [ 'code.c++' ]]);
output += '</option>\n                <option data-alias="coldfusion" value="cf">';
//line 23 "add-a-block.html"
output += stash.get(['loc', [ 'code.coldfusion' ]]);
output += '</option>\n                <option value="coldfusion">';
//line 24 "add-a-block.html"
output += stash.get(['loc', [ 'code.coldfusion' ]]);
output += '</option>\n                <option value="css">';
//line 25 "add-a-block.html"
output += stash.get(['loc', [ 'code.css' ]]);
output += '</option>\n                <option data-alias="pascal" value="delphi">';
//line 26 "add-a-block.html"
output += stash.get(['loc', [ 'code.delphi' ]]);
output += '</option>\n                <option value="diff">';
//line 27 "add-a-block.html"
output += stash.get(['loc', [ 'code.diff' ]]);
output += '</option>\n                <option value="erlang">';
//line 28 "add-a-block.html"
output += stash.get(['loc', [ 'code.erlang' ]]);
output += '</option>\n                <option value="groovy">';
//line 29 "add-a-block.html"
output += stash.get(['loc', [ 'code.groovy' ]]);
output += '</option>\n                <option value="html">';
//line 30 "add-a-block.html"
output += stash.get(['loc', [ 'code.html' ]]);
output += '</option>\n                <option value="java">';
//line 31 "add-a-block.html"
output += stash.get(['loc', [ 'code.java' ]]);
output += '</option>\n                <option value="javafx">';
//line 32 "add-a-block.html"
output += stash.get(['loc', [ 'code.javafx' ]]);
output += '</option>\n                <option data-alias="javascript" value="js">';
//line 33 "add-a-block.html"
output += stash.get(['loc', [ 'code.javascript' ]]);
output += '</option>\n                <option value="javascript">';
//line 34 "add-a-block.html"
output += stash.get(['loc', [ 'code.javascript' ]]);
output += '</option>\n                <option value="json">';
//line 35 "add-a-block.html"
output += stash.get(['loc', [ 'code.json' ]]);
output += '</option>\n                <option value="pascal">';
//line 36 "add-a-block.html"
output += stash.get(['loc', [ 'code.pascal' ]]);
output += '</option>\n                <option data-alias="diff" value="patch">';
//line 37 "add-a-block.html"
output += stash.get(['loc', [ 'code.patch' ]]);
output += '</option>\n                <option value="perl">';
//line 38 "add-a-block.html"
output += stash.get(['loc', [ 'code.perl' ]]);
output += '</option>\n                <option value="php">';
//line 39 "add-a-block.html"
output += stash.get(['loc', [ 'code.php' ]]);
output += '</option>\n                <option value="powershell">';
//line 40 "add-a-block.html"
output += stash.get(['loc', [ 'code.powershell' ]]);
output += '</option>\n                <option data-alias="python" value="py">';
//line 41 "add-a-block.html"
output += stash.get(['loc', [ 'code.python' ]]);
output += '</option>\n                <option value="python">';
//line 42 "add-a-block.html"
output += stash.get(['loc', [ 'code.python' ]]);
output += '</option>\n                <option value="ruby">';
//line 43 "add-a-block.html"
output += stash.get(['loc', [ 'code.ruby' ]]);
output += '</option>\n                <option value="scala">';
//line 44 "add-a-block.html"
output += stash.get(['loc', [ 'code.scala' ]]);
output += '</option>\n                <option value="shell">';
//line 45 "add-a-block.html"
output += stash.get(['loc', [ 'code.shell' ]]);
output += '</option>\n                <option value="sql">';
//line 46 "add-a-block.html"
output += stash.get(['loc', [ 'code.sql' ]]);
output += '</option>\n                <option value="vb">';
//line 47 "add-a-block.html"
output += stash.get(['loc', [ 'code.visualbasic' ]]);
output += '</option>\n                <option data-alias="html" value="xhtml">';
//line 48 "add-a-block.html"
output += stash.get(['loc', [ 'code.xhtml' ]]);
output += '</option>\n                <option value="xml">';
//line 49 "add-a-block.html"
output += stash.get(['loc', [ 'code.xml' ]]);
output += '</option>\n                <option data-alias="xml" value="xslt">';
//line 50 "add-a-block.html"
output += stash.get(['loc', [ 'code.xslt' ]]);
output += '</option>\n                <option value="yaml">';
//line 51 "add-a-block.html"
output += stash.get(['loc', [ 'code.yaml' ]]);
output += '</option>\n            </select>\n        </div>\n        <div style="float: right">\n            <ul class="widgetButton" style="float:left; padding:10px">\n                <li class="flexButton">\n                    <a class="save genericOrangeButton" id="st-widget-block-save" href="#">\n                        ';
//line 58 "add-a-block.html"
output += stash.get(['loc', [ 'do.save' ]]);
output += '\n                    </a>\n                </li>\n            </ul>\n            <ul class="widgetButton" style="float:left; padding:10px">\n                <li class="flexButton">\n                    <a class="close genericOrangeButton" id="st-widget-block-cancel" href="#">\n                        ';
//line 65 "add-a-block.html"
output += stash.get(['loc', [ 'do.cancel' ]]);
output += '\n                    </a>\n                </li>\n            </ul>\n        </div>\n    </form>\n</div>\n';
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
output += stash.get(['loc', [ 'table.create' ]]);
output += '</span>\n<form action="#" onsubmit="return false">\n<table class="table-create">\n    <tr>\n        <td class="row-col-label">\n            ';
//line 6 "table-create.html"
output += stash.get(['loc', [ 'table.rows:' ]]);
output += '&nbsp;\n        </td>\n        <td class="row-value">\n            <input name="rows" type="text" value="5">\n        </td>\n    </tr>\n\n    <tr>\n        <td class="row-col-label">\n            ';
//line 15 "table-create.html"
output += stash.get(['loc', [ 'table.columns:' ]]);
output += '&nbsp;\n        </td>\n        <td class="col-value">\n            <input name="columns" type="text" value="3">\n        </td>\n    </tr>\n\n    <tr>\n        <td></td>\n        <td>\n            <input type="checkbox" name="sort" disabled="true" />\n            <label for="sort">';
//line 26 "table-create.html"
output += stash.get(['loc', [ 'table.table-sortable' ]]);
output += '</label>\n        </td>\n    </tr>\n    <tr>\n        <td></td>\n        <td>\n            <input type="checkbox" name="border" checked="checked" />\n            <label for="border">';
//line 33 "table-create.html"
output += stash.get(['loc', [ 'table.show-cell-borders' ]]);
output += '</label>\n        </td>\n    </tr>\n\n    <tr>\n        <td colspan="2">\n            <div>\n                <ul class="widgetButton" style="float:left; padding:10px">\n                    <li class="flexButton">\n                        <a class="save genericOrangeButton" id="table-info-save" href="#">\n                            ';
//line 43 "table-create.html"
output += stash.get(['loc', [ 'do.save' ]]);
output += '\n                        </a>\n                    </li>\n                </ul>\n                <ul class="widgetButton" style="float:left; padding:10px">\n                    <li class="flexButton">\n                        <a class="close genericOrangeButton" id="table-info-cancel" href="#">\n                            ';
//line 50 "table-create.html"
output += stash.get(['loc', [ 'do.cancel' ]]);
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
output += stash.get(['loc', [ 'table.current-row:' ]]);
output += '&nbsp;\n        </td>\n        <td class="row-col-value">\n            <span class="row-number"></span>\n            (<span class="row-head"></span>)\n        </td>\n    </tr>\n\n    <tr>\n        <td class="row-col-label two">\n            ';
//line 15 "table-options.html"
output += stash.get(['loc', [ 'table.current-column:' ]]);
output += '&nbsp;\n        </td>\n        <td class="row-col-value">\n            <span class="col-number"></span>\n            (<span class="col-head"></span>)\n        </td>\n    </tr>\n\n    <tr>\n        <td class="row options">\n            <ul>\n                <li><a href="#" class="add row above">';
//line 26 "table-options.html"
output += stash.get(['loc', [ 'table.add-row-above' ]]);
output += '</a></li>\n                <li><a href="#" class="add row below">';
//line 27 "table-options.html"
output += stash.get(['loc', [ 'table.add-row-below' ]]);
output += '</a></li>\n                <li>&nbsp;</li>\n                <li><a href="#" class="move row up">';
//line 29 "table-options.html"
output += stash.get(['loc', [ 'table.move-row-up' ]]);
output += '</a></li>\n                <li><a href="#" class="move row down">';
//line 30 "table-options.html"
output += stash.get(['loc', [ 'table.move-row-down' ]]);
output += '</a></li>\n                <li>&nbsp;</li>\n                <li><a href="#" class="delete row">';
//line 32 "table-options.html"
output += stash.get(['loc', [ 'table.delete-row' ]]);
output += '</a></li>\n\n            </ul>\n        </td>\n\n        <td class="column options">\n            <ul>\n                <li><a href="#" class="add column left">';
//line 39 "table-options.html"
output += stash.get(['loc', [ 'table.add-column-left' ]]);
output += '</a></li>\n                <li><a href="#" class="add column right">';
//line 40 "table-options.html"
output += stash.get(['loc', [ 'table.add-column-right' ]]);
output += '</a></li>\n                <li>&nbsp;</li>\n                <li><a href="#" class="move column left">';
//line 42 "table-options.html"
output += stash.get(['loc', [ 'table.move-column-left' ]]);
output += '</a></li>\n                <li><a href="#" class="move column right">';
//line 43 "table-options.html"
output += stash.get(['loc', [ 'table.move-column-right' ]]);
output += '</a></li>\n                <li>&nbsp;</li>\n                <li><a href="#" class="delete column">';
//line 45 "table-options.html"
output += stash.get(['loc', [ 'table.delete-column' ]]);
output += '</a></li>\n            </ul>\n\n        </td>\n    </tr>\n    <tr>\n        <td colspan="2">\n            <div class="buttons">\n                <input name="save" type="submit" value=';
//line 53 "table-options.html"
output += stash.get(['loc', [ 'do.save' ]]);
output += ' />\n                <input name="cancel" type="reset" value=';
//line 54 "table-options.html"
output += stash.get(['loc', [ 'do.cancel' ]]);
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
output += stash.get(['loc', [ 'link.add' ]]);
output += '</span>\n  <form id="add-a-link-form">\n   <p class="heads-up">';
//line 4 "add-a-link.html"
output += stash.get(['loc', [ 'link.mandatory-indicator' ]]);
output += ' <span class="heads-up-indicator">*</span></p>\n\n   <div id="add-wiki-link-section">\n    <div class="add-a-link-subheader">\n      <input type="radio" class="editfield" checked="checked"\n             name="add-link-type" id="add-wiki-link" />\n      <label for="add-wiki-link" class="label">';
//line 10 "add-a-link.html"
output += stash.get(['loc', [ 'link.wiki-link' ]]);
output += '</label>\n    </div>\n    <div class="add-a-link-set">\n     <div>\n         <label for="wiki-link-text" class="editlabel">';
//line 14 "add-a-link.html"
output += stash.get(['loc', [ 'link.text:' ]]);
output += '</label>\n         <input type="text" size="25" class="editfield" \n                name="wiki-link-text" id="wiki-link-text" />\n     </div>\n     <div>\n        <label for="wiki-link-workspace" class="editlabel">';
//line 19 "add-a-link.html"
output += stash.get(['loc', [ 'link.wiki:' ]]);
output += '</label>\n        <input type="text" size="25" class="editfield" \n               name="wiki-link-workspace" id="st-widget-workspace_id"/>\n        <span class="additional-info">';
//line 22 "add-a-link.html"
output += stash.get(['loc', [ 'link.if-not-current' ]]);
output += '</span>\n     </div>\n     <div>\n         <label for="wiki-link-page" class="editlabel">';
//line 25 "add-a-link.html"
output += stash.get(['loc', [ 'link.page:' ]]);
output += ' <span class="heads-up-indicator">*</span></label>\n        <input type="text" size="25" class="editfield" \n               name="wiki-link-page" id="st-widget-page_title" />\n     </div>\n     <div>\n        <label for="wiki-link-section" class="editlabel">';
//line 30 "add-a-link.html"
output += stash.get(['loc', [ 'link.section:' ]]);
output += '</label>\n        <input type="text" size="25" class="editfield" \n               name="wiki-link-section" id="wiki-link-section" />\n     </div>\n    </div>\n   </div>\n\n  <div id="add-web-link-section">\n   <div class="add-a-link-subheader">\n       <input type="radio" class="editfield" \n             name="add-link-type" id="add-web-link" />\n       <label for="add-web-link" class="label">';
//line 41 "add-a-link.html"
output += stash.get(['loc', [ 'link.web-link' ]]);
output += '</label>\n   </div>\n   <div class="add-a-link-set">\n    <div>\n        <label for="web-link-text" class="editlabel">';
//line 45 "add-a-link.html"
output += stash.get(['loc', [ 'link.text:' ]]);
output += '</label>\n        <input type="text" size="25" class="editfield" \n               name="web-link-text" id="web-link-text" />\n    </div>\n    <div>\n        <label for="web-link-destination" class="editlabel">';
//line 50 "add-a-link.html"
output += stash.get(['loc', [ 'link.destination:' ]]);
output += ' <span class="heads-up-indicator">*</span></label>\n        <input type="text" size="25" class="editfield" value="http://"\n               name="web-link-destination" id="web-link-destination" />\n    </div>\n   </div>\n  </div>\n\n  <div id="add-section-link-section">\n   <div class="add-a-link-subheader">\n       <input type="radio" class="editfield" \n             name="add-link-type" id="add-section-link" />\n       <label for="add-section-link" class="label">';
//line 61 "add-a-link.html"
output += stash.get(['loc', [ 'link.section-in-this-page' ]]);
output += '</label>\n   </div>\n   <div class="add-a-link-set">\n    <div>\n        <label for="section-link-text" class="editlabel">';
//line 65 "add-a-link.html"
output += stash.get(['loc', [ 'link.section:' ]]);
output += ' <span class="heads-up-indicator">*</span></label>\n        <input type="text" size="25" class="editfield" \n               name="section-link-text" id="section-link-text" />\n    </div>\n   </div>\n  </div>\n\n  <div id="add-a-link-error" class="widget_edit_error_msg"></div>\n  <div class="buttons">\n    <input id="st-widget-link-savebutton" type="submit" value=';
//line 74 "add-a-link.html"
output += stash.get(['loc', [ 'do.save' ]]);
output += ' />\n    <input id="st-widget-link-cancelbutton" type="reset" value=';
//line 75 "add-a-link.html"
output += stash.get(['loc', [ 'do.cancel' ]]);
output += ' />\n  </div>\n </form>\n</div>\n';
    }
    catch(e) {
        var error = context.set_error(e, output);
        throw(error);
    }

    return output;
}

;
