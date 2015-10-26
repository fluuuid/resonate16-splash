import InteractiveLayer from './view/InteractiveLayer';
import Router           from './utils/Router';
import Scroller         from './utils/Scroller';
import Menu             from './view/Menu';
import Gallery          from './view/Gallery';

class App
{
    constructor(args) {
        this.scroller    = new Scroller();
        this.menu        = new Menu();
        this.interactive = new InteractiveLayer();
        this.router      = new Router();
        this.gallery     = new Gallery();

        setTimeout(this.router.start.bind(this.router), 1000);
    }
}

export default App;