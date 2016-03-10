"use strict"

function getnz(a,b) {
    return a?a:b
}

function toArray(s) {
    var res = []
    for (var e of s) {
        res.push(e)
    }
    return res
}

function uid() {
    return Math.trunc((Math.random()*0x100000000)).toString(16)
}

function eachValue(obj, fn) {
    for (var k of Object.keys(obj)) {
        fn(obj[k])
    }
}

function valuesList(obj) {
    var res = []
    for (var k of Object.keys(obj)) {
        res.push(obj[k])
    }
    return res
}

function isSubset(s, sub) {
    for (var v of sub) {
        if (!_.contains(s,v)) {
            return false
        }
    }
    return true
}

function ok(msg) {
    return function() {
        console.log(msg)
    }
}

function appendUnique(arr, value) {
    if (!_.contains(arr, value)) {
        arr.push(value)
    }
}

function promisify(fn) {
    return new Promise((resolve,reject)=>resolve(fn()))
}

function showErr(msg) {
    console.log(msg)
}

function processSeq(iter, fn) {
    if (!('next' in iter)) {
        iter = iter[Symbol.iterator]()
    }
    return new Promise(function(resolve,reject){
        var sup = function() {
            var job = iter.next()
            if (job.done) {
                resolve(0)
            } else {
                fn(job.value).then(sup)
            }
        }
        sup()
    })
}

function thenDebug(data) {
    return new Promise((resolve,reject)=>{
        console.log(data)
        resolve(data)
    })
}

class SeqQueue {
    constructor() {
        riot.observable(this)
        this.queue = []
    }
    put(task) {
        this.queue.push(task)
        if (this.queue.length==1) {
            setTimeout(this.next.bind(this),0)
        }
    }
    next() {
        var task = this.queue.shift()
        if (!task) {
            this.trigger('drained')
            return
        }
        task(this.next.bind(this))
    }
}