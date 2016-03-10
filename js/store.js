"use strict"


class Store {
    constructor(db) {
        riot.observable(this)
        this.db = db
        this.last_id = 1
    }
    put(obj) {
        this.db.log.add(obj)
        this.trigger('event', obj)
    }
    get_log() {
        return this.db.log.toArray()
    }
    clear() {
        this.db.log.clear()
    }
}

