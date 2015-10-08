import THREE from 'three.js'; 
import dat   from 'dat-gui' ;
import Stats from 'stats-js' ;

const OrbitControls = require('three-orbit-controls')(THREE);

class Demo {
  constructor(args) 
  {
    this.startStats();
    this.startGUI();

    this.renderer = null;
    this.camera   = null;
    this.scene    = null;
    this.counter  = 0;
    this.clock    = new THREE.Clock();

    this.HEIGHT = this.getHeaderHight();

    this.createRender();
    this.createScene();
    this.addObjects();

    this.onResize();
    this.update();
  }

  startStats()
  {
    this.stats = new Stats(); 
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = 0;
    document.body.appendChild(this.stats.domElement);
  }

  createRender()
  {
    this.renderer = new THREE.WebGLRenderer( {
        antialias : true,
        clearColor: 0
    } );
    document.querySelector('header').appendChild(this.renderer.domElement)
  }

  createScene()
  {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / this.HEIGHT, 0.01, 4000 );
    this.camera.position.set(0, 45, 240);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.maxDistance = 500;

    this.scene = new THREE.Scene();
  }

  addObjects()
  {
    var gridHelper = new THREE.GridHelper( 100, 10 );        
    this.scene.add( gridHelper );
  }

  startGUI()
  {
    // var gui = new dat.GUI()
    // gui.add(camera.position, 'x', 0, 400)
    // gui.add(camera.position, 'y', 0, 400)
    // gui.add(camera.position, 'z', 0, 400)
  }

  update()
  {
    this.stats.begin();

    this.renderer.render(this.scene, this.camera);

    this.stats.end()
    requestAnimationFrame(this.update.bind(this));
  }

  getHeaderHight()
  {
    return window.innerHeight / 2;
  }

  onResize()
  {
    this.HEIGHT = this.getHeaderHight();
    this.renderer.setSize(window.innerWidth, this.HEIGHT);
    this.camera.aspect = window.innerWidth / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }
}

export default Demo;