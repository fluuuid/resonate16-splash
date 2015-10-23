import THREE from "three.js";
import Utils from 'utils-perf';

class Paper {
  constructor(geo, material) {
    this.mult    = Utils.random(10, 100);
    this.scale   = Utils.random(.1, 1);
    this.calc    = Utils.coin ? Math.sin : Math.cos;
    this.multNeg = Utils.coinN();

    this.mesh = new THREE.Mesh(geo, material);
    this.mesh.scale.set(this.scale, this.scale, this.scale);

    this.mesh.position.y = window.innerHeight / 2 + 50;
    this.mesh.position.x = Utils.random(-window.innerWidth / 2, window.innerWidth / 2);
    this.mesh.position.z = Utils.random(-20, -10);
  }

  update(dt, time)
  {
    this.mesh.position.x += this.calc(time) * this.mult / 200 * this.multNeg;
    this.mesh.position.y -= dt * this.mult;
    
    this.mesh.rotation.x += this.mult / 20 * Math.PI / 180;
    this.mesh.rotation.y += this.mult / 50 * Math.PI / 180;
    this.mesh.rotation.z += this.mult / 20 * Math.PI / 180;

    if(this.mesh.position.y < -window.innerHeight / 2 - 50)
    {
        this.mesh.position.y = window.innerHeight / 2
    }
    
  }
}

export default Paper;