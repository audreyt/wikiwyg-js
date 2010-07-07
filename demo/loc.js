function loc() {
    if (typeof LocalizedStrings == 'undefined')
        LocalizedStrings = {};

    var locale = Socialtext.loc_lang;
    var dict = LocalizedStrings[locale] || new Array;
    var str = arguments[0] || "";
    var l10n = dict[str];
    var nstr = "";

    if (!l10n) {
        /* If the hash-lookup failed, convert " into \\\" and try again. */
        nstr = str.replace(/\"/g, "\\\"");
        l10n = dict[nstr];
        if (!l10n) {
            /* If the hash-lookup failed, convert [_1] into %1 and try again. */
            nstr = nstr.replace(/\[_(\d+)\]/g, "%$1");
            l10n = dict[nstr] || str;
        }
    }

    l10n = l10n.replace(/\\\"/g, "\"");

    /* Convert both %1 and [_1] style vars into the given arguments */
    for (var i = 1; i < arguments.length; i++) {
        var rx = new RegExp("\\[_" + i + "\\]", "g");
        var rx2 = new RegExp("%" + i + "", "g");
        l10n = l10n.replace(rx, arguments[i]);
        l10n = l10n.replace(rx2, arguments[i]);

        var quant = new RegExp("\\[quant,_" + i + ",([^\\],]+)(?:,([^\\]]+))?\\]");
        while (quant.exec(l10n)) {
            if (arguments[i] && arguments[i] == 1) {
                l10n = l10n.replace(quant, RegExp.$1);
            }
            else {
                l10n = l10n.replace(quant, RegExp.$2 || RegExp.$1 + 's');
            }
        }
    }

    return l10n;
}
