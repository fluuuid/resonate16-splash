var Grid, SymbolGenerator, glslify;

glslify = require('glslify');

import THREE from 'three.js';
Grid = require('./Grid');

SymbolGenerator = (function() {
  function SymbolGenerator(n) {
    var i, k, ref;
    if (n == null) {
      n = 10;
    }
    this.grid = new Grid(new THREE.Vector2(window.innerWidth, window.innerHeight));
    this.rotations = [0, Math.PI / 4, -Math.PI / 4, Math.PI / 2, -Math.PI / 2];
    this.colors1 = [new THREE.Color(0.372, 0.725, 0.313), new THREE.Color(0.372, 0.725, 0.313), new THREE.Color(0.921, 0.137, 0.156), new THREE.Color(0.392, 0.176, 0.549), new THREE.Color(0.988, 0.83, 0.889), new THREE.Color(0.921, 0.137, 0.156)];
    this.colors2 = [new THREE.Color(0.392, 0.784, 0.901), new THREE.Color(1, 1, 0.156), new THREE.Color(1, 1, 0.156), new THREE.Color(0.392, 0.784, 0.901), new THREE.Color(0.392, 0.176, 0.549), new THREE.Color(0.988, 0.83, 0.889)];
    console.warn = function() {};
    this.geometries = [];
    this.maxElements = 50;
    this.container = new THREE.Object3D();
    this.container.position.set(0, 0, -5);
    this.elements = [];
    this.frameCount = 0;
    this.gFreq = 60;
    this.material = new THREE.ShaderMaterial({
      vertexShader: glslify('./shader/symbol.vert'),
      fragmentShader: glslify('./shader/symbol.frag'),
      side: THREE.DoubleSide,
      uniforms: {
        time: {
          type: 'f',
          value: 0
        },
        progress: {
          type: 'f',
          value: 0
        },
        resolution: {
          type: 'v2',
          value: new THREE.Vector2(window.innerWidth, window.innerHeight)
        },
        color1: {
          type: 'c',
          value: null
        },
        color2: {
          type: 'c',
          value: null
        },
        mode: {
          type: 'i',
          value: 1
        },
        rotation: {
          type: 'f',
          value: 0
        },
        wobbling: {
          type: 'f',
          value: 1
        },
        gradientMode: {
          type: 'i',
          value: 0
        }
      }
    });
    for (k = i = 1, ref = n; i <= ref; k = i += 1) {
      this.loadGeometry(k);
    }
  }

  SymbolGenerator.prototype.loadGeometry = function(k) {
    var loader, nn, onLoaded;
    onLoaded = (function(_this) {
      return function(geo, materials) {
        var bgeo, mat;
        geo.computeVertexNormals();
        bgeo = new THREE.BufferGeometry();
        bgeo.fromGeometry(geo);
        _this.geometries.push(geo);
        return mat = new THREE.ShaderMaterial({
          vertexShader: glslify('./shader/symbol.vert'),
          fragmentShader: glslify('./shader/symbol.frag'),
          side: THREE.DoubleSide,
          uniforms: {
            time: {
              type: 'f',
              value: 0
            },
            progress: {
              type: 'f',
              value: 0
            },
            resolution: {
              type: 'v2',
              value: new THREE.Vector2(window.innerWidth, window.innerHeight)
            },
            color1: {
              type: 'c',
              value: new THREE.Color(0.372, 0.725, 0.313)
            },
            color2: {
              type: 'c',
              value: new THREE.Color(0.392, 0.784, 0.901)
            },
            mode: {
              type: 'i',
              value: 1
            },
            rotation: {
              type: 'f',
              value: 0
            }
          }
        });
      };
    })(this);
    nn = k < 10 ? "0" + k : "" + k;
    loader = new THREE.JSONLoader();
    return loader.load("assets/symbols/symbol" + nn + ".js", onLoaded);
  };

  SymbolGenerator.prototype.generate = function() {
    var ci, e, g, geo, gi, i, inverseColors, j, kill, len, len1, mat, mesh, onComplete, pos, ref, ref1, rot, s, scl;
    if (this.geometries.length === 0) {
      return;
    }
    if (this.container.children.length >= this.maxElements) {
      return;
    }

    /*return if @doit
            @doit = true
     */
    g = this.grid.selectCells();
    s = Math.sqrt(g.length);
    ref = this.elements;
    for (i = 0, len = ref.length; i < len; i++) {
      e = ref[i];
      ref1 = e.grid;
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        gi = ref1[j];
        if (g.indexOf(gi) > -1) {
          this.grid.unmarkCells(e.grid);
          this.killSoftly(e.mesh);
          this.grid.markCells(g);
          break;
        }
      }
    }

    /* attributes */
    scl = this.grid.cellSize * s / 100;
    rot = this.rotations[Math.round(Math.random() * (this.rotations.length - 1))];
    ci = Math.round(Math.random() * (this.colors1.length - 1));
    inverseColors = Math.random() < .5;
    mat = this.material.clone();
    mat.uniforms.color1.value = !inverseColors ? this.colors1[ci] : this.colors2[ci];
    mat.uniforms.color2.value = !inverseColors ? this.colors2[ci] : this.colors1[ci];
    mat.uniforms.rotation.value = -rot;
    mat.uniforms.progress.value = 0;
    mat.uniforms.mode.value = Math.round(Math.random());
    geo = this.geometries[Math.round(Math.random() * (this.geometries.length - 1))];
    mesh = new THREE.Mesh(geo, mat);
    this.container.add(mesh);
    mesh.scale.set(scl, scl, scl);
    mesh.rotation.z = rot;
    pos = this.grid.getCellPosition(g[0]);
    mesh.position.set(pos.x + 50 * scl, pos.y - 50 * scl, 0);

    /*mat.wireframeLinewidth = 20
            mat.wireframe = true
     */
    this.elements.push({
      mesh: mesh,
      grid: g
    });
    kill = (function(_this) {
      return function() {
        return _this.removeMesh(mesh);
      };
    })(this);
    onComplete = (function(_this) {
      return function() {
        _this.grid.unmarkCells(g);
        return TweenLite.to(mat.uniforms.progress, 6 + 6 * Math.random(), {
          value: 2,
          onComplete: kill
        });
      };
    })(this);
    return TweenLite.to(mat.uniforms.progress, 4 + Math.random() * 3, {
      value: 1,
      onComplete: onComplete
    });
  };

  SymbolGenerator.prototype.killSoftly = function(mesh) {
    var kill, mat;
    mat = mesh.material;
    TweenLite.killTweensOf(mat.uniforms.progress);
    kill = (function(_this) {
      return function() {
        return _this.removeMesh(mesh, false);
      };
    })(this);
    return TweenLite.to(mat.uniforms.progress, 2 + 2 * Math.random(), {
      value: 2,
      onComplete: kill
    });
  };

  SymbolGenerator.prototype.removeMesh = function(mesh) {
    var e, k, ref;
    ref = this.elements;
    for (k in ref) {
      e = ref[k];
      if (e.mesh === mesh) {
        this.container.remove(mesh);
        this.elements.splice(k, 1);
        return;
      }
    }
  };

  SymbolGenerator.prototype.update = function(time) {
    var i, len, mesh, ref, results;
    if (this.frameCount % this.gFreq === 0) {
      this.generate();
    }
    this.frameCount++;
    ref = this.container.children;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      mesh = ref[i];
      results.push(mesh.material.uniforms.time.value = time);
    }
    return results;
  };

  SymbolGenerator.prototype.setSize = function(w, h) {
    var e, i, len, ref;
    ref = this.elements;
    for (i = 0, len = ref.length; i < len; i++) {
      e = ref[i];
      this.killSoftly(e.mesh);
    }
    this.elements.splice(0, this.elements.length);
    return this.grid.setSize(w, h);
  };

  return SymbolGenerator;

})();

module.exports = SymbolGenerator;