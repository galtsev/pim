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
        if (!s.has(v)) {
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