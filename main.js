
var Store = function() {
    riot.observable(this)
    this.log = []
    this.state = {}
    this.last_id = 1
    this.event_handlers = {}
}

Store.prototype.put = function(obj) {
    this.last_id+=1
    obj.id = this.last_id
    this.log.push(obj)
    this.event_handlers[obj.et].call(this, obj)
    this.trigger('update')
}

Store.prototype.create = function(url, title) {
    var obj = {
        et: "cr",
        ar: uid(),
        url: url,
        title: title
    }
    this.put(obj)
}

Store.prototype.delete = function(ar) {
    var obj = {
        et: "rm",
        ar: ar
    }
    this.put(obj)
}

Store.prototype.edit_title = function(ar, title) {
    this.put({et:"ed", ar:ar, title:title})
}

Store.prototype.add_tag = function(ar, tag) {
    this.put({et:"tag", ar: ar, tag:tag})
}

Store.prototype.del_tag = function(ar, tag) {
    this.put({et:"untag", ar: ar, tag:tag})
}

Store.prototype.gendata = function() {
    this.create("http://linux.org.ru", "linux org ru")
    this.create("http://bash.im", "bash")
    this.create("http://python.org", "python.org")
    this.create("https://golang.org/doc/", "golang docs")
    var self = this
    Object.keys(this.state).forEach(function(ar){
        var obj = self.state[ar]
        if (obj.title=="bash") {
            self.add_tag(ar, "social")
        } else if (obj.title=="python.org") {
            self.add_tag(ar, "dev")
            self.add_tag(ar, "python")
        } else if (obj.title=="golang docs") {
            self.add_tag(ar, "golang")
            self.add_tag(ar, "doc")
        }
    })
}


store = new Store()

store.event_handlers["cr"] = function(obj){
    this.state[obj.ar] = _.clone(obj)
}

store.event_handlers["rm"] = function(obj){
    delete this.state[obj.ar]
}

store.event_handlers["ed"] = function(obj){
    this.state[obj.ar].title = obj.title
}

store.event_handlers["tag"] = function(obj){
    bm = this.state[obj.ar]
    tags = "tags" in bm ? bm.tags : {}
    tags[obj.tag] = 1
    bm.tags = tags
}

store.event_handlers["untag"] = function(obj) {
    delete this.state[obj.ar].tags[obj.tag]
}

var updateListener = {
    init: function() {
        var update_cb = this.update.bind(this)
        this.on('mount', function() {store.on('update', update_cb)})
        this.on('unmount', function() {store.off('update', update_cb)})
    }
}

function uid() {
    return Math.trunc((Math.random()*0x100000000)).toString(16)
}