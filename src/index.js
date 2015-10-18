import InteractiveLayer from './view/InteractiveLayer';
import Router           from './utils/Router';
import Scroller         from './utils/Scroller';
import Menu             from './view/Menu';

class App
{
    constructor()
    {
        this.scroller    = new Scroller();        
        this.menu        = new Menu();            
        this.interactive = new InteractiveLayer();
        this.router      = new Router();        
    }
}

window.APP = new App();