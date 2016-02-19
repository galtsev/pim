
function getnz(a,b) {
    return a?a:b
}

function toArray(s) {
    var res = []
    for (e of s) {
        res.push(e)
    }
    return res
}

function uid() {
    return Math.trunc((Math.random()*0x100000000)).toString(16)
}

function eachValue(obj, fn) {
    for (k of Object.keys(obj)) {
        fn(obj[k])
    }
}

function valuesList(obj) {
    var res = []
    for (k of Object.keys(obj)) {
        res.push(obj[k])
    }
    return res
}

function isSubset(s, sub) {
    for (v of sub) {
        if (!s.has(v)) {
            return false
        }
    }
    return true
}