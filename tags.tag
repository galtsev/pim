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
        <a onclick={commands.refresh}>Refresh</a>
    </div>
    <hr/>
    <route_target/>
    <hr/>

</app>


<route_target>
   var self = this
    var goto = function(page) {
        return function(arg) {
            riot.mount(self.root, page, {ar: arg})
            commands.refresh()
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
        <div> tags: <input name="atags" type="text" /></div>
        <button onclick={process}>Create</button>
    </div>

    process(e) {
        var tags = this.atags.value.split(',').map(function(v){return v.trim()}).filter(function(v){return v})
        commands.create(this.url.value, this.title.value, tags)
    }
</add_bm>

<tag_list>
    <span>
        <span each={tag in opts.tags}><a onclick={do_click}>{tag}</a>, </span>
    </span>

    do_click(e) {
        opts.onclick(e.item.tag)
    }
</tag_list>


<list_bm>
    <div>
        <span each={tag,cnt in all_tags}><a onclick={add_tag_filter}>{tag}:{cnt}</a>, </span>
    </div>
    <div>
        Fitered by tags:
        <tag_list tags={toArray(session.selected_tags)} onclick={remove_tag_filter} />
        |
        <a onclick={clear_filter}>Clear filters</a>
    </div>
    <table>
    <tr each={v in all_bookmarks}>
        <td><a href={v.url} target="_blank">{v.title}</a></td>
        <td><a onclick={del_item}>del</a></td>
        <td><a href="#edit/{v.ar}">edit</a></td>
        <td><span each={t in v.tags}>{t},</span><td>
    </tr>
    </table>

    this.all_tags = {}
    this.all_bookmarks = []
    this.mixin(updateListener)
    del_item(e) {
        commands.delete(e.item.v.ar)
    }
    add_tag_filter(e) {
        session.selected_tags.add(e.item.tag)
        this.update_req()
    }
    remove_tag_filter(tag) {
        session.selected_tags.delete(tag)
        this.update_req()
    }
    clear_filter(e) {
        session.selected_tags = new Set()
        this.update_req()
    }
    update_req(){
        var self = this
        Promise.all([
            bm.list_bookmarks(session.selected_tags),
            bm.list_tags()
        ]).then(([bookmarks, tags])=>{
            this.all_bookmarks = bookmarks
            this.all_tags = tags
            self.update()
        })
    }
    this.on('mount', ()=>this.update_req())
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
            delete tags: 
            <tag_list tags={obj.tags} onclick={del_tag} />
        </div>

    </div>

    //this.obj = this.opts
    this.obj = {}
    this.on('mount', function() {
        bm.get_bookmark(this.opts.ar)
        .then((o)=>this.update({obj:o}))
    })
    update_title(e) {
        commands.edit_title(this.obj.ar, this.title.value)
    }
    add_tag(e) {
        var t = this.tag.value.trim()
        if (t && !_.contains(this.obj.tags,t)) {
            commands.add_tag(this.obj.ar, t)
            this.obj.tags.push(t)
        }
        this.tag.value = ''
    }
    del_tag(tag) {
        commands.del_tag(this.obj.ar, tag)
        this.obj.tags = _.without(this.obj.tags,tag)
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

