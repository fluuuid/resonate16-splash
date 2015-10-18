import eve from 'dom-events';

class Menu  {
  constructor(args) 
  {
    this.el = document.querySelector('nav');
    this.buttons = this.el.querySelectorAll('a');

    // console.log(this.buttons);

    for (var i = 0; i < this.buttons.length; i++) {
        eve.on(this.buttons[i], 'click', this.onClickMenu.bind(this));
    };
  }

  onClickMenu(e)
  {
    // console.log(e);
    // e.preventDefault();
  }
}

export default Menu;