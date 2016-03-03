

function Store(db) {
    riot.observable(this)
    this.db = db
    this.last_id = 1
}

_.extend(Store.prototype, {
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

