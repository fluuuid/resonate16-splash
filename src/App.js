import InteractiveLayer from './view/InteractiveLayer';
import Router           from './utils/Router';
import Scroller         from './utils/Scroller';
import Detector         from './utils/Detector';
import Menu             from './view/Menu';
import Gallery          from './view/Gallery';

class App
{
    constructor(args) {
        this.scroller    = new Scroller();
        this.menu        = new Menu();

        if(Detector.webgl)
        {
            this.interactive = new InteractiveLayer();
        } else {
            let containerCanvas = document.querySelector( '.canvas-container' );
            containerCanvas.innerHTML = '<img src="static/logo.svg">';
        }

        this.router      = new Router();
        this.gallery     = new Gallery();

        setTimeout(this.router.start.bind(this.router), 1000);
    }
}

export default App;