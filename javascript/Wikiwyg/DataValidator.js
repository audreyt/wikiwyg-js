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
