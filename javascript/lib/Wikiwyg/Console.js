
(function($){

    Wikiwyg.Console = function() {
        this.init();
    };

    Wikiwyg.Console.prototype = {
        init: function() {
            var self = this;

            $("<div></div>").attr("id", "wikiwyg-console")
            .css({ position: 'absolute', top: 10, right: 10, height: 400, width: 400, display: 'none', background: '#999' })
            .appendTo(document.body);
            $("#wikiwyg-console").html("<textarea></textarea>");
            $("#wikiwyg-console textarea").css({ height: 400, width: '100%' })
            .bind("focus", function() {
                self.editing = true;

            })
            .bind("blur", function() {
                self.editing = false;

                self.update_wysiwyg();
            });
        },

        update_wysiwyg: function() {
            var html = $("#wikiwyg-console textarea").val();
            if (wikiwyg.current_mode.get_edit_document)
                wikiwyg.current_mode.get_edit_document().body.innerHTML = html;
        },

        toggle: function() {
            $("#wikiwyg-console").toggle();
        },

        show: function() {
            $("#wikiwyg-console").show();
        },

        hide: function() {
            $("#wikiwyg-console").hide();
        },

        refresh: function() {
            if (wikiwyg.current_mode.get_edit_document)
                $("#wikiwyg-console").find("textarea").val( wikiwyg.current_mode.get_edit_document().body.innerHTML );
        }
    };

})(jQuery);


jQuery(function($) {
    window.wikiwyg_console =  new Wikiwyg.Console();

    var console_button = $("<a href=\"#\" id=\"wikiwyg-console-starter\">Console</a>");
    console_button.css({ display: 'block', position: 'absolute', top:0, left:0 });
    $(document.body).append(console_button);

    $("#wikiwyg-console-starter").one("click", function() {
        wikiwyg_console.show();

        wikiwyg_console.refresh_interval = setInterval(function() {
            if (!wikiwyg_console.editing)
                wikiwyg_console.refresh();
        }, 1000);

        $(this).bind("click", function() {
            wikiwyg_console.toggle();
        });
    });
});


