
var store = riot.observable()

_.extend(store, {
    log: [],
    last_id: 1,
    put: function(obj) {
        obj.id = this.last_id++
        this.log.push(obj)
        this.trigger('event', obj)
    },
})

