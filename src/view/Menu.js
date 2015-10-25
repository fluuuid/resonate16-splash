import eve from 'dom-events';

class Menu  {
  constructor(args) 
  {
    this.el      = document.querySelector('nav');
    this.active = this.el.dataset.active;
    this.buttons = this.el.querySelectorAll('a');
    this.burger  = this.el.querySelector('.burger');

    // console.log(this.buttons);

    for (var i = 0; i < this.buttons.length; i++) {
        eve.on(this.buttons[i], 'click', this.onClickBurger.bind(this));
    };

    eve.on(this.burger, 'click', this.onClickBurger.bind(this));
  }

  onClickBurger(e)
  {
    if(e.target.className != "header")
    {
      this.active = !this.active;
      this.el.dataset.active = this.active;
    }
  }
}

export default Menu;