import THREE     from 'three.js';
import TweenLite from 'gsap';
const glslify = require('glslify');

class SymbolGenerator {

  constructor(n = 10) {

    this.rotations = [ 0, Math.PI/4, -Math.PI/4, Math.PI/2, -Math.PI/2 ];
    this.colors1 = [
        new THREE.Color( 0.372, 0.725, 0.313 ),
        new THREE.Color( 0.372, 0.725, 0.313 ),
        new THREE.Color( 0.921, 0.137, 0.156 ),
        new THREE.Color( 0.392, 0.176, 0.549 ),
        new THREE.Color( 0.988, 0.83, 0.889 ),
        new THREE.Color( 0.921, 0.137, 0.156 )
    ]

    this.colors2 = [
        new THREE.Color( 0.392, 0.784, 0.901 ),
        new THREE.Color( 1, 1, 0.156 ),
        new THREE.Color( 1, 1, 0.156 ),
        new THREE.Color( 0.392, 0.784, 0.901 ),
        new THREE.Color( 0.392, 0.176, 0.549 ),
        new THREE.Color( 0.988, 0.83, 0.889 )
    ]

    this.geometries = []
    this.maxElements = 50

    this.container = new THREE.Object3D();

    this.frameCount = 0;
    this.gFreq = 120;

    this.material = new THREE.ShaderMaterial({
        vertexShader: glslify('./shader/symbol.vert'),
        fragmentShader: glslify('./shader/symbol.frag'),
        side: THREE.DoubleSide,
        uniforms: {
            time       : {type: 'f', value: 0},
            progress   : {type: 'f', value: 0},
            resolution : {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
            color1     : {type: 'c', value: null},
            color2     : {type: 'c', value: null},
            mode       : {type: 'i', value: 1},
            rotation   : {type: 'f', value: 0},
        }
    });

    for (var i = 1; i < n + 1; i++) {
        this.loadGeometry(i)
    };
  }

  loadGeometry ( k ) {
    let onLoaded = ( geo, materials ) =>
    {
        geo.computeVertexNormals()

        let bgeo = new THREE.BufferGeometry()
        bgeo.fromGeometry(geo)

        this.geometries.push(geo)

        let mat = new THREE.ShaderMaterial({
            vertexShader: glslify('./shader/symbol.vert'),
            fragmentShader: glslify('./shader/symbol.frag'),
            side: THREE.DoubleSide,
            uniforms: {   
                time       : {type: 'f', value: 0},
                progress   : {type: 'f', value: 0},
                resolution : {type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
                color1     : {type: 'c', value: new THREE.Color( 0.372, 0.725, 0.313 )},
                color2     : {type: 'c', value: new THREE.Color( 0.392, 0.784, 0.901 )},
                mode       : {type: 'i', value: 1},
                rotation   : {type: 'f', value: 0},
            }
        })
    }

    let nn = k < 10 ? "0" + k : k;
    let loader = new THREE.JSONLoader()
    loader.load("static/obj/symbol"+nn+".js", onLoaded);
  }

  generate()
  {
    if(this.geometries.length == 0) return;
    if(this.container.children.length >= this.maxElements) return ;

    // ### attributes ###
    let stageScl = window.innerWidth > window.innerHeight ? 1 : .3;
    let scl = (1 + Math.round( 3 * Math.random() )) * stageScl;
    let rot = this.rotations[ Math.round( Math.random() * ( this.rotations.length - 1 ) ) ]
    let ci = Math.round( Math.random() * ( this.colors1.length - 1 ) )
    let inverseColors = Math.random() < .5

    // # create copy of same shader program but with custom uniforms
    let mat = this.material.clone()
    mat.uniforms.color1.value = !inverseColors ? this.colors1[ci] : this.colors2[ci];
    mat.uniforms.color2.value = !inverseColors ? this.colors2[ci] : this.colors1[ci];
    mat.uniforms.rotation.value = -rot
    mat.uniforms.progress.value = 0
    mat.uniforms.mode.value = Math.round( Math.random() )

    let geo = this.geometries[ Math.round( Math.random() * ( this.geometries.length - 1 ) ) ]

    let mesh = new THREE.Mesh(geo, mat);
    this.container.add(mesh);
    mesh.scale.set(scl, scl, scl);
    mesh.rotation.z = rot;
    mesh.position.set(-window.innerWidth/2 + window.innerWidth * Math.random(), -window.innerHeight/2 + window.innerHeight * Math.random(), -1);

    let goToDeath = () => {
        console.log('go to death')
        window.setTimeout( onComplete, 500 );
    }

    let kill = () => {
        this.container.remove(mesh);
    }

    let onComplete = () => {
        TweenLite.to(mat.uniforms.progress, 6 + 6 * Math.random(), { value: 2, onComplete: kill })
    }

    TweenLite.to(mat.uniforms.progress, 4 + Math.random() * 3, { value: 1, onComplete: onComplete });
  }

  update( time ) 
  {
      if (this.frameCount % this.gFreq == 0) this.generate();
      this.frameCount++;

      for(let mesh of this.container.children){
        mesh.material.uniforms.time.value = time ;
      }
  }
}

export default SymbolGenerator;
