
function Bookmarks(store) {
    riot.observable(this)
    this.store = store
    this.state = {}
    this.batch = false
    var self = this
    store.on("event", this.process_event.bind(self))
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
        var tag_dict = {}
        Object.keys(this.state).forEach(function(ar){
            this.state[ar].tags.forEach(function(tag){
                tag_dict[tag] = getnz(tag_dict[tag],0)+1
            })
        })
        return tag_dict
    },
    list_bookmarks: function(selected_tags) {
        return valuesList(this.state).filter(function(b){return isSubset(b.tags, selected_tags)})
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
        return this.state[ar]
    },


    eh: {
        cr: function(obj){
            this.state[obj.ar]  = {ar:obj.ar, url:obj.url, title: obj.title, tags:new Set()}
        },
        rm: function(obj){
            delete this.state[obj.ar]
        },
        ed: function(obj){
            this.state[obj.ar].title = obj.title
        },
        tag: function(obj){
            this.state[obj.ar].tags.add(obj.tag)
        },
        untag: function(obj) {
            this.state[obj.ar].tags.delete(obj.tag)
        }
    }
})

