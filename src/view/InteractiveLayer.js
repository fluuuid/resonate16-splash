import THREE from 'three.js'; 
import dat   from 'dat-gui' ;
import Stats from 'stats-js' ;
import UtilsP from 'utils-perf';
import TweenMax from 'gsap';

// const OrbitControls = require('three-orbit-controls')(THREE);
const GoL = require('gof-gpu');

class InteractiveLayer {
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
    this.boxes = [];

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
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / this.HEIGHT, 0.01, 4000 );
    this.camera.position.set(0, 0, 600);
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.maxDistance = 500;

    this.scene = new THREE.Scene();
  }

  addObjects()
  {
    // var gridHelper = new THREE.GridHelper( 100, 10 );        
    // this.scene.add( gridHelper );

    this.texString1 = "static/textures/tex1.png";
    this.texString2 = "static/textures/tex2.png";
    this.texString3 = "static/textures/tex3.png";
    this.texString4 = "static/textures/tex4.png";
    this.texString5 = "static/textures/tex5.png";
    this.texString6 = "static/textures/tex6.png";

    this.material1 = new THREE.MeshBasicMaterial({transparent: true, map: THREE.ImageUtils.loadTexture(this.texString1)});
    this.material2 = new THREE.MeshBasicMaterial({transparent: true, map: THREE.ImageUtils.loadTexture(this.texString2)});
    this.material3 = new THREE.MeshBasicMaterial({transparent: true, map: THREE.ImageUtils.loadTexture(this.texString3)});
    this.material4 = new THREE.MeshBasicMaterial({transparent: true, map: THREE.ImageUtils.loadTexture(this.texString4)});
    this.material5 = new THREE.MeshBasicMaterial({transparent: true, map: THREE.ImageUtils.loadTexture(this.texString5)});
    this.material6 = new THREE.MeshBasicMaterial({transparent: true, map: THREE.ImageUtils.loadTexture(this.texString6)});

    this.mats = [this.material1, this.material2, this.material3, this.material4, this.material5, this.material6];

    this.addPlanes();
  }

  addPlanes()
  {
    this.removeAll();

    let vmax = Math.max(window.innerWidth, window.innerHeight);
    let vmin = Math.min(window.innerWidth, window.innerHeight);

    let boxSize = (vmax / vmin) * 22 >> 0;
    let resX = UtilsP.round(vmax / boxSize);
    let offset = (boxSize + (boxSize * .1))
    let totalWidth = offset * resX / 2;

    this.world = new GoL(resX);
    this.boxes = [];
    let counter = 0;

    this.geo = new THREE.PlaneBufferGeometry(boxSize, boxSize);

    for (var x = 0; x < resX; x++) {
        for (var y = 0; y < resX; y++) {
            var b = new THREE.Mesh(this.geo, this.mats[counter % (this.mats.length - 1)]);
            b.position.x = totalWidth - (x * offset);
            b.position.y = totalWidth - (y * offset);
            this.scene.add(b)
            this.boxes.push(b);
            counter++;
        }
    };
  }

  removeAll()
  {
    for (var i = this.boxes.length - 1; i >= 0; i--) {
        this.scene.remove(this.boxes[i]);
    };
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

    if(this.world.started)
    {
      if(this.counter % 15 == 0)
      {
        let howManyActive = [];
        var grid = this.world.update();
        // +=4 as you just need the first value of the GoL 255 or 0
        for (var i = 0; i < grid.length; i+=4) {
            var line = grid[i];
            // line[a] element true/false
            var lineBoxes = this.boxes[(i/4) >> 0];
            if(line == 255) howManyActive.push(i);
            lineBoxes.visible = line == 255;
            // TweenMax.to(lineBoxes.material, .3, {overwrite: 0, opacity:  ? 1 : 0, onUpdate : function(a){ a.needsUpdate = true; }, onUpdateParams: [lineBoxes.material]});
        }

        if((howManyActive.length / 4) >> 0 < 6)
        {
          this.world.init();
        }
      }

      this.counter++;
    }

    this.renderer.render(this.scene, this.camera);

    this.stats.end()
    requestAnimationFrame(this.update.bind(this));
  }

  getHeaderHight()
  {
    return window.innerHeight;
  }

  onResize()
  {
    this.HEIGHT = this.getHeaderHight();
    this.addPlanes();
    this.renderer.setSize(window.innerWidth, this.HEIGHT);
    this.camera.aspect = window.innerWidth / this.HEIGHT;
    this.camera.updateProjectionMatrix();
  }
}

export default InteractiveLayer;