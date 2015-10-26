import Wallop from "wallop";

class Gallery  {
  constructor() {

    let list = document.querySelector('.Wallop-list');
    this.interval = 7000;

    for (var i = 0; i < window.PHOTOS.length; i++) {
        let div = document.createElement('div');
        div.className = 'Wallop-item'
        div.style.backgroundImage = 'url("static/gallery/'+window.PHOTOS[i]+'")'
        list.appendChild(div);
    };

    this.wallop = new Wallop(document.querySelector('.Wallop'));
    this.wallop.on('change', function(event){
        clearInterval(this.intervalLoopPhoto);
        this.intervalLoopPhoto = 0;
        this.intervalLoopPhoto = setInterval(this.wallop.next.bind(this.wallop), this.interval);
    }.bind(this))

    this.intervalLoopPhoto = setInterval(this.wallop.next.bind(this.wallop), this.interval);
  }
}

export default Gallery;