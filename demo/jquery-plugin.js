(function ($) {

$.poll = function (test, callback, interval, maximum) {
    if (! (test && callback)) {
        throw("usage: jQuery.poll(test_func, callback [, interval_ms, maximum_ms])");
    }
    if (! interval) interval = 250; 
    if (! maximum) maximum = 30000;

    setTimeout(
        function() {
            if (id) {
                clearInterval(id);
                // throw("jQuery.poll failed");
            }
        }, maximum
    );

    var id = setInterval(function() {
        if (test()) { 
            clearInterval(id);
            id = 0;
            callback();
        }
    }, interval);
};

})(jQuery);
