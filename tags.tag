<app>
    <div>Hello from dexie</div>
    <div>
        <a href="#add">add</a>
        <a href="#list">list</a>
        |
        <a onclick={commands.gendata}>gen data</a>
        |
        <a onclick={commands.rebuild_state}>rebuild state</a>
        |
        <a onclick={commands.clear}>Clear</a>
        |
        <a onclick={update}>Refresh</a>
    </div>
    <hr/>
    <route_target/>
    <hr/>
    <log_display/>

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
    riot.route.start(true)
</route_target>


<add_bm>
    <div>
        <div> url: <input name="url" type="text" /> </div>
        <div> title: <input name="title" type="text" /> </div>
        <button onclick={process}>Create</button>
    </div>

    process(e) {
        commands.create(this.url.value, this.title.value)
    }
</add_bm>


<list_bm>
    <div>
        <span each={tag,cnt in commands.list_tags()}><a onclick={add_tag_filter}>{tag}:{cnt}</a>, </span>
    </div>
    <div>
        Fitered by tags:
        <a each={tag in toArray(session.selected_tags)} onclick={remove_tag_filter}>{tag}, </a>
        <a onclick={clear_filter}>Clear filters</a>
    </div>
    <table>
    <tr each={v in commands.list_bookmarks()}>
        <td><a href={v.url} target="_blank">{v.title}</a></td>
        <td><a onclick={del_item}>del</a></td>
        <td><a href="#edit/{v.ar}">edit</a></td>
        <td><span each={t in toArray(v.tags)}>{t},</span><td>
    </tr>
    </table>

    this.mixin(updateListener)
    del_item(e) {
        commands.delete(e.item.v.ar)
    }
    add_tag_filter(e) {
        session.selected_tags.add(e.item.tag)
    }
    remove_tag_filter(e) {
        session.selected_tags.delete(e.item.tag)
    }
    clear_filter(e) {
        session.selected_tags = new Set()
    }
    update_req(){
        this.update()
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
            delete tags: <a each={t in toArray(obj.tags)} onclick={del_tag}>{t}, </a>
        </div>

    </div>

    this.obj = bm.state[this.opts.ar]
    update_title(e) {
        commands.edit_title(this.opts.ar, this.title.value)
    }
    add_tag(e) {
        commands.add_tag(this.opts.ar, this.tag.value)
        this.tag.value = ''
    }
    del_tag(e) {
        commands.del_tag(this.opts.ar, e.item.t)
    }

</edit_bm>


<log_display>
    <div each={event in log}>
        event: {JSON.stringify(event)}
    </div>

    this.mixin(updateListener)
    this.log = []
    update_req(){
        commands.get_log().then(function(arr){
            this.log = arr
            this.update()
        }.bind(this))
    }
</log_display>

