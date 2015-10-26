import Wallop from "wallop";

class Gallery  {
  constructor() {

    let list = document.querySelector('.Wallop-list');

    for (var i = 0; i < window.PHOTOS.length; i++) {
        let div = document.createElement('div');
        div.className = 'Wallop-item'
        div.style.backgroundImage = 'url("static/gallery/'+window.PHOTOS[i]+'")'
        list.appendChild(div);
    };

    let wallop = new Wallop(document.querySelector('.Wallop'));
  }
}

export default Gallery;