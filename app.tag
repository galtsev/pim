<app>
    <div>
        <a href="#">Home</a>
        |
        <a href="#bm">Bookmarks</a>
        |
        <a href="#notes">Notes</a>
        |
        <a href="#about">About</a>
    </div>
    <hr/>
    <app-route />
</app>

<app-route>
    var self = this
    var goto = function(page) {
        return function(arg) {
            riot.mount(self.root, page, {ar: arg})
        }
    }
    this.r = riot.route.create()
    this.r('', goto('home'))
    this.r('bm', goto('bm-app'))
    this.r('about', goto('about'))
    riot.route.start(true)
</app-route>

<home>
    <h2>Here is home screen for PIM</h2>
</home>

<about>
    <h2>PIM - store for your personal information</h2>
</about>
