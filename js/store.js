
function connect(db_name) {
    var db = new Dexie(db_name)
    db.version(1).stores({log:"++id"})
    db.open()
    return db
}

var store = riot.observable()

_.extend(store, {
    //log: [],
    db: connect('bookmarks'),
    last_id: 1,
    put: function(obj) {
        this.db.log.add(obj)
        this.trigger('event', obj)
    },
    get_log: function() {
        return this.db.log.toArray()
    },
    clear: function() {
        this.db.log.clear()
    }
})

