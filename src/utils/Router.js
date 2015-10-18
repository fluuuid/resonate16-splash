import page from 'page';

class Router  {
  constructor() {

    this.getSectionTop();
    page();

  }

  getSectionTop()
  {
    this.sections = {};
    let s = document.querySelectorAll('[data-section]');
    for (var i = 0; i < s.length; i++) {
        let el = s[i];
        this.sections[el.dataset.section] = {el: el};
        page("/" + el.dataset.section, this.pageHandler.bind(this));
    };
  }

  pageHandler(e)
  {
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