import TweenMax       from 'gsap';
const ScrollToPlugin = require('gsap/src/uncompressed/plugins/ScrollToPlugin');

class Scroller  {

  constructor(args) {
    this.delay    = 800;
    this.minDelay = .3;
    this.maxDelay = 1;
  }

  calculateDelay(target)
  {
    let a = Math.abs(((target - window.pageYOffset) * this.delay) / window.innerHeight) / 1000;
    return Math.min(this.maxDelay, Math.max(this.minDelay, a));
  }

  scrollTo(Y)
  {
    TweenMax.to(window, this.calculateDelay(Y), {
        scrollTo: {x: 0, y: Y},
        ease: Power2.easeInOut,
        onComplete: () => {
            console.log('onScrollComplete');
        }
    });
  }

}

export default Scroller;