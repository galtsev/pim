"use strict"

function Bookmarks(store) {
    riot.observable(this)
    this.store = store
    this.state = {}
    this.batch = false
    store.on("event", this.process_event.bind(this))
}

_.extend(Bookmarks.prototype, {
    start_batch: function() {
        this.batch = true
    },
    end_batch: function() {
        this.batch = false
        this.trigger('update')
    },
    list_tags: function() {
        var self = this
        return new Promise(function(resolve, reject){
            var tag_dict = {}
            Object.keys(self.state).forEach(function(ar){
                self.state[ar].tags.forEach(function(tag){
                    tag_dict[tag] = getnz(tag_dict[tag],0)+1
                })
            })
            resolve(tag_dict)
        })
    },
    list_bookmarks: function(selected_tags) {
        return Promise.resolve(valuesList(this.state).filter(function(b){return isSubset(b.tags, selected_tags)}))
    },
    clear: function() {
        this.state = {}
    },
    process_event: function(e) {
        this.eh[e.et].bind(this)(e)
        if (!this.batch) {
            this.trigger('update')
        }
    },
    get_bookmark: function(ar) {
        var o = this.state[ar]
        return Promise.resolve( {
            ar: o.ar,
            url: o.url,
            title: o.title,
            tags: o.tags.slice()
        })
    },


    eh: {
        cr: function(obj){
            this.state[obj.ar]  = {ar:obj.ar, url:obj.url, title: obj.title, tags:[]}
        },
        rm: function(obj){
            delete this.state[obj.ar]
        },
        ed: function(obj){
            this.state[obj.ar].title = obj.title
        },
        tag: function(obj){
            appendUnique(this.state[obj.ar].tags, obj.tag)
        },
        untag: function(obj) {
            var bookmark = this.state[obj.ar]
            bookmark.tags = _.without(bookmark.tags, obj.tag)
        }
    }
})

