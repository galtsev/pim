

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
    list_tags: function() {
        var tag_dict = {}
        Object.keys(bm.state).forEach(function(ar){
            bm.state[ar].tags.forEach(function(tag){
                tag_dict[tag] = getnz(tag_dict[tag],0)+1
            })
        })
        return tag_dict
    },
    list_bookmarks: function() {
        return valuesList(bm.state).filter(function(b){return isSubset(b.tags, session.selected_tags)})
    },
    get_log: function() {
        return store.get_log()
    },
    rebuild_state: function() {
        bm.state = {}
        bm.start_batch()
        store.get_log().then(function(arr){
            for (var obj of arr) {
                bm.eh[obj.et].bind(bm)(obj)
            }
        }).then(function(){bm.end_batch()}).then(ok("rebuild state complete"))
        // for (obj of store.log) {
        //     bm.eh[obj.et].bind(bm)(obj)
        // }
    },
    clear: function() {
        store.clear()
        bm.state = {}
        bm.trigger('update')
    }
}


commands.gendata = function() {
    bm.start_batch()
    this.create("http://linux.org.ru", "linux org ru", ["social","linux","doc"])
    this.create("http://bash.im", "bash", ["social"])
    this.create("http://python.org", "python.org", ["python","doc"])
    this.create("https://golang.org/doc/", "golang docs", ["golang","doc"])
    // var self = this
    // eachValue(bm.state, function(obj){
    //     var ar = obj.ar
    //     if (obj.title=="bash") {
    //         this.add_tag(ar, "social")
    //     } else if (obj.title=="python.org") {
    //         this.add_tag(ar, "doc")
    //         this.add_tag(ar, "python")
    //     } else if (obj.title=="golang docs") {
    //         this.add_tag(ar, "golang")
    //         this.add_tag(ar, "doc")
    //     }
    // }.bind(this))
    bm.end_batch()
    console.log("complete")
}.bind(commands)

var session = {
    selected_tags: new Set(['pin'])
}