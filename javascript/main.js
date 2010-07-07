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
