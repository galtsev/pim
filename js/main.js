"use strict"

function connect(db_name) {
    var db = new Dexie(db_name)
    db.version(1).stores({log:"++id"})
    db.version(2).stores({log:"++id",bm:"ar"})
    db.open()
    return db
}

var session = {
    selected_tags: new Set()
}

var db = connect('bookmarks')


var store = new Store(db)

var bm = new Bookmarks(db)

var event_queue = new SeqQueue()

store.on('event', obj=> event_queue.put(done=> bm.process_event(obj).then(done)))

event_queue.on('drained', ()=>bm.trigger('update'))

var commands = Commands(store, bm, session)

var updateListener = {
    init: function() {
        var update_cb = function(){this.update_req()}.bind(this)
        this.on('mount', function() {bm.on('update', update_cb)})
        this.on('unmount', function() {bm.off('update', update_cb)})
    }
}
