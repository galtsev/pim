"use strict"

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
            bm.start_batch()
            console.log('start rebuild')
            bm.clear()
            .then(store.get_log.bind(store))
            .then(events=>processSeq(events,bm.process_event.bind(bm)))
            .then(()=>{
                bm.end_batch()
                bm.trigger('update')
                console.log("rebuild complete")
            })
            .catch(showErr)
        },
        clear: function() {
            store.clear()
            bm.clear()
            bm.trigger('update')
        },
        refresh: function() {
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
