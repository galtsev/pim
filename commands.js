

var commands = {
    create: function(url, title) {
        store.put({et:"cr", ar:uid(), url:url, title:title})
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
    rebuild_state: function() {
        bm.state = {}
        bm.start_batch()
        for (obj of store.log) {
            bm.eh[obj.et].bind(bm)(obj)
        }
        bm.end_batch()
        console.log("complete")
    }
}


commands.gendata = function() {
    bm.start_batch()
    this.create("http://linux.org.ru", "linux org ru")
    this.create("http://bash.im", "bash")
    this.create("http://python.org", "python.org")
    this.create("https://golang.org/doc/", "golang docs")
    // var self = this
    eachValue(bm.state, function(obj){
        var ar = obj.ar
        if (obj.title=="bash") {
            this.add_tag(ar, "social")
        } else if (obj.title=="python.org") {
            this.add_tag(ar, "doc")
            this.add_tag(ar, "python")
        } else if (obj.title=="golang docs") {
            this.add_tag(ar, "golang")
            this.add_tag(ar, "doc")
        }
    }.bind(this))
    bm.end_batch()
}

var session = {
    selected_tags: new Set(['pin'])
}