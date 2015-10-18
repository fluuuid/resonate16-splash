import page from 'page';

class Router  {

  start()
  {
    page.base(window.location.port == "" ? "/dist" : "");
    page("/", this.pageHandler.bind(this));
    page(this.pageHandler.bind(this));
    page();
  }

  pageHandler(e)
  {
    if(e.path == '/')
    {
        window.APP.scroller.scrollTo(0);
        return;
    }

    let type = window.innerWidth < 700 ? "mobile" : "desktop";
    let path = e.path.split('/').join("");
    let el = document.querySelector('[data-section="'+path+'"]:not([data-type="'+type+'"])')
    let menuHeight = window.APP.menu.el.offsetHeight;
    let paddingTop = 10;
    let offsetDiv = el.offsetTop;
    window.APP.scroller.scrollTo(offsetDiv - menuHeight - paddingTop);
  }
}

export default Router;