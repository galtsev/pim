"use strict"

function Bookmarks(store, db) {
    riot.observable(this)
    this.store = store
    //this.state = {}
    this.db = db
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
        var tag_dict = {}
        return this.db.bm.each(function(b){
            b.tags.forEach(function(tag){
                tag_dict[tag] = getnz(tag_dict[tag],0)+1
            }).then(function(v){return tag_dict})
        })

        // var self = this
        // return new Promise(function(resolve, reject){
        //     var tag_dict = {}
        //     Object.keys(self.state).forEach(function(ar){
        //         self.state[ar].tags.forEach(function(tag){
        //             tag_dict[tag] = getnz(tag_dict[tag],0)+1
        //         })
        //     })
        //     resolve(tag_dict)
        // })
    },
    list_bookmarks: function(selected_tags) {
        return this.db.bm.filter(function(b){return isSubset(b.tags, selected_tags)}).toArray()
        // var self = this
        // return new Promise(function(resolve, reject){
        //     resolve(valuesList(self.state).filter(function(b){return isSubset(b.tags, selected_tags)}))
        // })
    },
    clear: function() {
        return this.db.bm.clear()
    },
    process_event: function(e) {
        this.eh[e.et].bind(this)(e).then(function(){
            if (!this.batch) {
                this.trigger('update')
            }
        }.bind(this))
    },
    get_bookmark: function(ar) {
        return this.db.bm.get(ar)
        // var o = this.state[ar]
        // var res = {
        //     ar: o.ar,
        //     url: o.url,
        //     title: o.title,
        //     tags: o.tags.slice()
        // }
        // return new Promise(function(resolve, reject) {
        //     resolve(res)
        // })
    },


    eh: {
        cr: function(obj){
            return this.db.bm.add({ar:obj.ar, url: obj.url, title: obj.title, tags:[]})
            //this.state[obj.ar]  = {ar:obj.ar, url:obj.url, title: obj.title, tags:[]}
        },
        rm: function(obj){
            return this.db.bm.delete(obj.ar)
            //delete this.state[obj.ar]
        },
        ed: function(obj){
            return this.db.bm.update(obj.ar, {title:obj.title})
            //this.state[obj.ar].title = obj.title
        },
        tag: function(obj){
            return this.db.bm.get(obj.ar).then(function(b){
                appendUnique(b.tags, obj.tag)
                return this.db.bm.put(b)
            }.bind(this))
            //appendUnique(this.state[obj.ar].tags, obj.tag)
        },
        untag: function(obj) {
            return this.db.bm.get(obj.ar).then(function(b){
                b.tags = _.without(b.tags, obj.tag)
                return this.db.bm.put(b)
            }.bind(this))
            // var bookmark = this.state[obj.ar]
            // bookmark.tags = _.without(bookmark.tags, obj.tag)
        }
    }
})

