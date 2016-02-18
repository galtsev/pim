<app>
    <div>Hello from dexie</div>
    <div>
        <a href="#add">add</a>
        <a href="#list">list</a>
        |
        <a onclick={gendata}>gen data</a>
    </div>
    <route_target/>
    <log_display/>

    gendata() {
        store.gendata()
    }
</app>


<route_target>
   var self = this
    var goto = function(page) {
        return function(arg) {
            riot.mount(self.root, page, {ar: arg})
        }
    }
    this.r = riot.route.create()
    this.r('add', goto('add_bm'))
    this.r('list', goto('list_bm'))
    this.r('edit/*', goto('edit_bm'))
    riot.route.start()
</route_target>


<add_bm>
    <div>
        <div> url: <input name="url" type="text" /> </div>
        <div> title: <input name="title" type="text" /> </div>
        <button onclick={process}>Create</button>
    </div>

    process(e) {
        store.create(this.url.value, this.title.value)
    }
</add_bm>


<list_bm>
    <table>
    <tr each={k,v in store.state}>
        <td><a href={v.url} target="_blank">{v.title}</a></td>
        <td><a onclick={del_item}>del</a></td>
        <td><a href="#edit/{v.ar}">edit</a></td>
        <td><span each={t,o in v.tags}>{t},</span><td>
    </tr>
    </table>

    this.mixin(updateListener)
    del_item(e) {
        store.delete(e.item.v.ar)
    }
</list_bm>

<edit_bm>
    <div>Edit page</div>
    <div>
        <div><a href="#list">Back to list</a></div>
        <div>url: {obj.url}</div>
        <div>
            <label>title:</label>
            <input type="text" name="title" value={obj.title} />
            <button onclick={update_title}>Update</button>
        </div>
        <div>
            <label>tag:</label>
            <input type="text" name="tag" />
            <button onclick={add_tag}>Add tag</button>
        </div>
        <div>
            delete tags: <a each={k,v in obj.tags} onclick={del_tag}>{k},</a>
        </div>

    </div>

    this.obj = store.state[this.opts.ar]
    update_title(e) {
        store.edit_title(this.opts.ar, this.title.value)
    }
    add_tag(e) {
        store.add_tag(this.opts.ar, this.tag.value)
    }
    del_tag(e) {
        store.del_tag(this.opts.ar, e.item.k)
    }

</edit_bm>


<log_display>
    <div each={event in store.log}>
        event: {JSON.stringify(event)}
    </div>

    this.mixin(updateListener)
</log_display>


<state_display>
    <div each={k,v in store.state}>
        bookmark: {k} : {JSON.stringify(v)} <a class="cmd" onclick={del_item}>del</a>
    </div>

    <style>
        a.cmd {
            cursor: pointer;
        }
    </style>

    this.mixin(updateListener)
    del_item(e) {
        store.delete(e.item.v.ar)
    }
</state_display>