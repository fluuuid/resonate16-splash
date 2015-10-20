import THREE    from 'three.js'; 
import dat      from 'dat-gui' ;
import Stats    from 'stats-js' ;
import UtilsP   from 'utils-perf';
import TweenMax from 'gsap';

// const OrbitControls = require('three-orbit-controls')(THREE);
// const GoL          = require('gof-gpu');
const objLoaders   = require('../utils/OBJLoader')(THREE);

class InteractiveLayer {
  constructor(args) 
  {
    this.wireframe         = false;
    this.radius            = 100;
    this.displacementPower = 2;
    this.showTexture       = false;
    // this.showGameOfLife    = true;
    // this.planeSize         = 150;

    this.startStats();
    this.startGUI();

    this.renderer  = null;
    this.camera    = null;
    this.scene     = null;
    this.counter   = 0;
    this.clock     = new THREE.Clock();
    this.mouse     = new THREE.Vector2(0, 0);
    this.prevMouse = new THREE.Vector2(0, 0);
    this.power     = 0;
    this.grid      = [];

    this.HEIGHT = this.getHeaderHight();
    this.boxes = [];

    this.createRender();
    this.createScene();
    this.addObjects();

    this.onResize();
    this.update();

    window.onresize = this.onResize.bind(this);
    window.onmousemove = this.onMouseMove.bind(this);
  }

  startStats()
  {
    this.stats = new Stats(); 
    this.stats.domElement.style.position = 'absolute';
    this.stats.domElement.style.top = 0;
    this.stats.domElement.style.display = 'none';
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
    // this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / this.HEIGHT, 0.01, 4000 );
    // this.camera.position.set(0, 0, 600);

    this.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 );
    this.camera.position.set(0, 0, 1);

    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.maxDistance = 500;

    this.scene = new THREE.Scene();
  }

  addObjects()
  {
    // var gridHelper = new THREE.GridHelper( 100, 10 );        
    // this.scene.add( gridHelper );

    this.shapeMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: .3});

    this.material = new THREE.ShaderMaterial( {

      uniforms: {
        time              : {type: 'f', value: 0},
        color             : {type: 'c', value: new THREE.Color(0xffffff) },
        power             : {type: 'f', value: 0},
        radius            : {type: 'f', value: this.radius},
        displacementPower : {type: 'f', value: this.radius},
        mouse             : {type: 'v2', value: new THREE.Vector2(0,0)},
        showTexture       : {type: 'i', value: Number(this.showTexture)},
        texture1          : {type: 't', value: THREE.ImageUtils.loadTexture('static/textures/tex6.png')},
      },
      wireframe      : true,
      vertexShader   : document.getElementById( 'vs' ).textContent,
      fragmentShader : document.getElementById( 'fs' ).textContent

    } );

    // this.addPlanes();

    this.loader = new THREE.OBJLoader();
    this.loader.load('static/r.obj', this.onLoaded.bind(this));

    
  }

  onLoaded(obj)
  {
    let tempDae = obj;

    tempDae.traverse( function ( child ) {

      if ( child instanceof THREE.Mesh ) {

          this.objectMesh = child;

          this.objectMesh.geometry.computeFaceNormals();

          this.objectMesh.material = this.material;
          this.objectMesh.position.x = 40;
          this.objectMesh.position.y = -40;
      }

    }.bind(this) );

    this.scene.add(this.objectMesh);
  }

  // addPlanes()
  // {
  //   if(this.golContainer) this.removeAll();
  //   this.golContainer = new THREE.Object3D();

  //   let vmax = Math.max(window.innerWidth, window.innerHeight);
  //   let vmin = Math.min(window.innerWidth, window.innerHeight);

  //   let boxSize = (vmax / vmin) * this.planeSize >> 0;
  //   let resX = UtilsP.round(vmax / boxSize);
  //   let offset = (boxSize + (boxSize * (this.planeSize / 10000)))
  //   let totalWidth = offset * resX / 2;

  //   this.world = new GoL(resX);
  //   this.boxes = [];
  //   let counter = 0;

  //   this.geo = new THREE.PlaneBufferGeometry(boxSize, boxSize);

  //   for (var x = 0; x < resX; x++) {
  //       for (var y = 0; y < resX; y++) {
  //           var b = new THREE.Mesh(this.geo, this.shapeMaterial);
  //           b.position.x = totalWidth - (x * offset);
  //           b.position.y = totalWidth - (y * offset);
  //           this.golContainer.add(b)
  //           this.boxes.push(b);
  //           counter++;
  //       }
  //   };

  //   this.scene.add(this.golContainer);
  // }

  // removeAll()
  // {
  //   for (var i = this.boxes.length - 1; i >= 0; i--) {
  //       this.golContainer.remove(this.boxes[i]);
  //   };

  //   this.scene.remove(this.golContainer);
  // }

  startGUI()
  {
    var gui = new dat.GUI()
    gui.add(this, 'wireframe');

    // gui.add(this, 'showGameOfLife').onChange(this.addPlanes.bind(this));
    // gui.add(this, 'planeSize', 50, 300).onChange(this.addPlanes.bind(this));
    gui.add(this, 'showTexture');

    gui.add(this, 'radius', 1, 500);
    gui.add(this, 'displacementPower', 1, 10);
  }

  update()
  {
    this.stats.begin();

    this.material.wireframe                  = this.wireframe;
    this.material.uniforms.time.value        = this.clock.getElapsedTime();
    this.material.uniforms.mouse.value       = this.mouse;
    this.material.uniforms.power.value       = this.power;
    this.material.uniforms.radius.value      = this.radius;
    this.material.uniforms.showTexture.value = Number(this.showTexture);
    this.material.uniforms.displacementPower.value = this.displacementPower;
    
    this.material.needsUpdate = true;

    // this.activeGOL = [];

    // if(this.world.started && this.showGameOfLife)
    // {
    //   if(this.counter % 60 == 0)
    //   {
    //     let howManyActive = [];
    //     this.grid = this.world.update();
    //     // +=4 as you just need the first value of the GoL 255 or 0
    //     for (let i = 0; i < this.grid.length; i+=4) {
    //         let line = this.grid[i];
    //         // line[a] element true/false
    //         let lineBoxes = this.boxes[(i/4) >> 0];
    //         if(line == 255) 
    //         {
    //           howManyActive.push(i);
    //           let xx = lineBoxes.position.x;
    //           let yy = lineBoxes.position.y;

    //           this.activeGOL.push(new THREE.Vector2(xx, yy));
    //         }
    //         lineBoxes.visible = line == 255;
    //     }

    //     this.material.uniforms.points.value = this.activeGOL

    //     if((howManyActive.length / 4) >> 0 < 2)
    //     {
    //       this.world.init();
    //     }
    //   }

    //   this.counter++;
    // } else {
    //   this.removeAll();
    // }

    this.renderer.render(this.scene, this.camera);

    this.stats.end()

    this.mouse.x = this.mouse.y = 10000.;

    requestAnimationFrame(this.update.bind(this));
  }

  getHeaderHight()
  {
    return window.innerHeight;
  }

  onMouseMove(e)
  {
    let currentMouse = new THREE.Vector2(e.clientX, e.clientY);

    this.power = this.prevMouse.distanceTo(currentMouse);

    this.mouse.x = e.clientX - (window.innerWidth / 2);
    this.mouse.y = (window.innerHeight / 2) - e.clientY ;

    this.prevMouse = new THREE.Vector2(e.clientX, e.clientY);
  }

  onResize()
  {
    this.HEIGHT = this.getHeaderHight();

    this.renderer.setSize(window.innerWidth, this.HEIGHT);

    this.camera.left = window.innerWidth / - 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = window.innerHeight / - 2;

    this.camera.updateProjectionMatrix();
    // this.camera.aspect = window.innerWidth / this.HEIGHT;
    // this.camera.updateProjectionMatrix();
  }
}

export default InteractiveLayer;