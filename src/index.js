import InteractiveLayer from './view/InteractiveLayer';
import Router           from './utils/Router';
import Scroller         from './utils/Scroller';

const scroller         = new Scroller();
const router           = new Router();
const interactiveLayer = new InteractiveLayer();

window.onresize = interactiveLayer.onResize.bind(interactiveLayer);