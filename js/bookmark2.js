"use strict"

class Bookmarks {
    constructor(db) {
        riot.observable(this)
        this.db = db
        this.in_batch = false
    }

    batch(batch_fn) {
        this.in_batch = true
        return this.db.transaction('rw', [db.bm, db.log], batch_fn)
        .then(()=>{
            this.in_batch=false
            this.trigger('update')
        })
    }
    list_tags() {
        var tag_dict = {}
        return this.db.bm.each(function(b){
            b.tags.forEach(function(tag){
                tag_dict[tag] = getnz(tag_dict[tag],0)+1
            })
        }).then(()=>tag_dict)
    }
    list_bookmarks(selected_tags) {
        return this.db.bm.filter(function(b){return isSubset(b.tags, selected_tags)}).toArray()
    }
    clear() {
        return this.db.bm.clear()
    }
    process_event(e) {
        return Bookmarks.eh[e.et].bind(this)(e)
    }
    get_bookmark(ar) {
        return this.db.bm.get(ar)
    }
}


Bookmarks.eh = {
        cr(obj){
            return this.db.bm.add({ar:obj.ar, url: obj.url, title: obj.title, tags:[]})
        },
        rm(obj){
            return this.db.bm.delete(obj.ar)
        },
        ed(obj){
            return this.db.bm.update(obj.ar, {title:obj.title})
        },
        tag(obj){
            return this.db.bm.get(obj.ar).then(function(b){
                appendUnique(b.tags, obj.tag)
                return this.db.bm.put(b)
            }.bind(this))
        },
        untag(obj) {
            return this.db.bm.get(obj.ar).then(function(b){
                b.tags = _.without(b.tags, obj.tag)
                return this.db.bm.put(b)
            }.bind(this))
        }
}

