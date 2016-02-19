
var bm = riot.observable()

_.extend(bm, {
    state: {},
    batch: false,
    start_batch: function() {
        this.batch = true
    },
    end_batch: function() {
        this.batch = false
        this.trigger('update')
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

store.on("event", function(e){
    bm.eh[e.et].bind(bm)(e)
    if (!bm.batch) {
        bm.trigger('update')
    }
})


var updateListener = {
    init: function() {
        var update_cb = this.update.bind(this)
        this.on('mount', function() {bm.on('update', update_cb)})
        this.on('unmount', function() {bm.off('update', update_cb)})
    }
}

