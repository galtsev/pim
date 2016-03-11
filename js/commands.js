"use strict"

function Commands(store, bm, session) {
    var commands = {
        create: function(url, title, tags) {
            var ar = uid()
            var obj = {et:"cr", ar:ar, url:url, title:title}
            store.put(obj)
            for (var tag of tags) {
                store.put({et:'tag', ar:ar, tag:tag})
            }
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
            console.log('start rebuild')
            bm.batch(()=>{
                bm.clear()
                .then(store.get_log.bind(store))
                .then(events=>processSeq(events,bm.process_event.bind(bm)))
            }).then(ok("rebuild complete"))
            .catch(showErr)
        },
        clear: function() {
            store.clear()
            bm.clear()
            bm.trigger('update')
        },
        refresh: function() {
            bm.trigger('update')
        },
        gendata: function() {
            commands.create("http://linux.org.ru", "linux org ru", ["social","linux","doc"])
            commands.create("http://bash.im", "bash", ["social"])
            commands.create("http://python.org", "python.org", ["python","doc"])
            commands.create("https://golang.org/doc/", "golang docs", ["golang","doc"])
        }
    }

    return commands
}
