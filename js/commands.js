
function Commands(store, bm, session) {
    var commands = {
        create: function(url, title, tags) {
            var ar = uid()
            var obj = {et:"cr", ar:ar, url:url, title:title}
            store.put(obj)
            if (tags) {
                for (var tag of tags) {
                    store.put({et:'tag', ar:ar, tag:tag})
                }
            }
            return obj
        },
        delete: function(ar) {
            store.put({et:"rm",ar:ar})
        },
        edit_title: function(ar, title) {
            store.put({et:"ed", ar:ar, title:title})
        },
        add_tag: function(ar, tag) {
            store.put({et:"tag", ar: ar, tag:tag})
        },
        del_tag: function(ar, tag) {
            store.put({et:"untag", ar: ar, tag:tag})
        },
        get_log: function() {
            return store.get_log()
        },
        rebuild_state: function() {
            bm.clear()
            bm.start_batch()
            store.get_log().then(function(arr){
                for (var obj of arr) {
                    bm.process_event(obj)
                }
            }).then(function(){bm.end_batch()}).then(ok("rebuild state complete"))
        },
        clear: function() {
            store.clear()
            bm.clear()
            bm.trigger('update')
        }
    }

    commands.gendata = function() {
            bm.start_batch()
            this.create("http://linux.org.ru", "linux org ru", ["social","linux","doc"])
            this.create("http://bash.im", "bash", ["social"])
            this.create("http://python.org", "python.org", ["python","doc"])
            this.create("https://golang.org/doc/", "golang docs", ["golang","doc"])
            bm.end_batch()
            console.log("complete")
    }.bind(commands)
    return commands
}
