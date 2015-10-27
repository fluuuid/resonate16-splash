import Wallop from "wallop";
import eve from 'dom-events';

class Gallery  {
  constructor() {

    let list = document.querySelector('div.Wallop-list');
    this.interval = 7000;

    this.buttons = document.querySelectorAll('.wallop-button');
    for (var i = 0; i < this.buttons.length; i++) {
        eve.on(this.buttons[i], 'click', this.clickGallery.bind(this));
        this.buttons[i]
    };

    let divContent = "";

    for (var i = 0; i < window.PHOTOS.length; i++) {
        divContent += "<div class='Wallop-item' style='background-image:url(\"static/gallery/" + window.PHOTOS[i] + "\");'></div>"
    };

    list.innerHTML = divContent;

    this.wallop = new Wallop(document.querySelector('.Wallop'));
    this.wallop.on('change', function(event){
        clearInterval(this.intervalLoopPhoto);
        this.intervalLoopPhoto = 0;
        this.intervalLoopPhoto = setInterval(this.wallop.next.bind(this.wallop), this.interval);
    }.bind(this))

    setTimeout(this.start.bind(this), 3000);
  }

  start()
  {
    let gallery = document.querySelector('.gallery');
    gallery.style.opacity = 1;
    this.intervalLoopPhoto = setInterval(this.wallop.next.bind(this.wallop), this.interval);
  }

  clickGallery(e)
  {
    // console.log(e.currentTarget.dataset.dir);
    switch(e.currentTarget.dataset.dir)
    {
        case "next":
            this.wallop.next();
            break;

        case "prev":
            this.wallop.previous();
            break;
    }
  }
}

export default Gallery;