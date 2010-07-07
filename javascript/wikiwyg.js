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
