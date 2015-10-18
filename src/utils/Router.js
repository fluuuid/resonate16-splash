import page from 'page';

class Router  {
  constructor(args) {
    page('/', this.home);
    page();
  }

  home()
  {
    console.log('home router');
  }
}

export default Router;