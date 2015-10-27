import THREE from 'three.js';

var Grid;

Grid = (function() {
  function Grid(rect) {
    var k, l, ref;
    this.defineGrid(rect);
    this.generateGeometry();
    this.material = new THREE.PointsMaterial({
      size: this.cellSize * .98,
      sizeAttenuation: false,
      vertexColors: THREE.VertexColors
    });
    this.mesh = new THREE.Points(this.geometry, this.material);
    this.mesh.position.set(0, 0, -1);
    this.active = false;
    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);
    this.cells = [];
    for (k = l = 0, ref = this.nCells; 0 <= ref ? l < ref : l > ref; k = 0 <= ref ? ++l : --l) {
      this.cells.push(false);
    }
  }

  Grid.prototype.generateGeometry = function() {
    var c, center, hs, i, j, k, l, n, nv, p, pi, ref, ref1, x, y;
    this.geometry = new THREE.BufferGeometry();
    nv = this.nCells;
    center = new THREE.Vector2(this.nCols * this.cellSize / 2, this.nRows * this.cellSize / 2);
    p = new Float32Array(nv * 3);
    c = new Float32Array(nv * 3);
    k = 0;
    hs = this.cellSize / 2;
    this.color = new THREE.Color(0x222222);
    for (i = l = 0, ref = this.nRows; 0 <= ref ? l < ref : l > ref; i = 0 <= ref ? ++l : --l) {
      for (j = n = 0, ref1 = this.nCols; 0 <= ref1 ? n < ref1 : n > ref1; j = 0 <= ref1 ? ++n : --n) {
        pi = k * 3;
        x = -center.x + j * this.cellSize + hs;
        y = -center.y + i * this.cellSize + hs;
        p[pi + 0] = x;
        p[pi + 1] = -y;
        p[pi + 2] = 0;
        c[pi + 0] = this.color.r;
        c[pi + 1] = this.color.g;
        c[pi + 2] = this.color.b;
        k++;
      }
    }
    this.geometry.addAttribute("position", new THREE.BufferAttribute(p, 3));
    return this.geometry.addAttribute("color", new THREE.BufferAttribute(c, 3));
  };

  Grid.prototype.defineGrid = function(rect) {
    var s;
    s = 10;
    this.cellSize = 100;
    this.nCols = Math.floor(rect.x / this.cellSize);
    this.nRows = Math.floor(rect.y / this.cellSize);
    while (this.nCols < s || this.nRows < s) {
      this.cellSize *= .99;
      this.nCols = Math.floor(rect.x / this.cellSize);
      this.nRows = Math.floor(rect.y / this.cellSize);
    }
    this.dx = rect.x - this.nCols * this.cellSize;
    this.dy = rect.y - this.nRows * this.cellSize;
    this.nCells = this.nCols * this.nRows;
    return console.log("Grid Settings: { cellSize: " + this.cellSize + ", nRows: " + this.nRows + ", nCols: " + this.nCols + " }");
  };

  Grid.prototype.setSize = function(w, h) {
    var k, l, ref, results;
    this.geometry.dispose();
    this.geometry = null;
    this.defineGrid(new THREE.Vector2(w, h));
    this.generateGeometry();
    this.mesh.geometry = this.geometry;
    this.material.size = this.cellSize * .98;
    this.cells = [];
    results = [];
    for (k = l = 0, ref = this.nCells; 0 <= ref ? l < ref : l > ref; k = 0 <= ref ? ++l : --l) {
      results.push(this.cells.push(false));
    }
    return results;
  };

  Grid.prototype.selectCells = function() {
    var ci, cpos, k, k2, l, m, maxC, maxR, n, r, ref, ref1, rpos, s;
    ci = Math.round(Math.random() * (this.nCells - 1));
    cpos = ci % this.nCols;
    rpos = Math.floor(ci / this.nCols);
    maxC = Math.min(4, this.nCols - cpos);
    maxR = Math.min(4, this.nRows - rpos);
    m = Math.min(maxC, maxR);
    s = 1 + Math.round(Math.random() * (m - 1));
    r = [ci];
    this.markCell(ci);
    for (k = l = 1, ref = s; l < ref; k = l += 1) {
      this.markCell(ci + k);
      r.push(ci + k);
      for (k2 = n = 0, ref1 = s; 0 <= ref1 ? n < ref1 : n > ref1; k2 = 0 <= ref1 ? ++n : --n) {
        this.markCell(ci + k * this.nCols + k2);
        r.push(ci + k * this.nCols + k2);
      }
    }
    return r;
  };

  Grid.prototype.markCell = function(ci) {
    var cindex, cols;
    cols = this.geometry.attributes.color;
    cindex = ci * 3;
    cols.array[cindex + 0] = .8;
    cols.array[cindex + 1] = .2;
    cols.array[cindex + 2] = .2;
    cols.needsUpdate = true;
    return this.cells[ci] = true;
  };

  Grid.prototype.unmarkCell = function(ci) {
    var cindex, cols;
    cols = this.geometry.attributes.color;
    cindex = ci * 3;
    cols.array[cindex + 0] = this.color.r;
    cols.array[cindex + 1] = this.color.g;
    cols.array[cindex + 2] = this.color.b;
    cols.needsUpdate = true;
    return this.cells[ci] = false;
  };

  Grid.prototype.unmarkCells = function(ca) {
    var ci, l, len, results;
    results = [];
    for (l = 0, len = ca.length; l < len; l++) {
      ci = ca[l];
      results.push(this.unmarkCell(ci));
    }
    return results;
  };

  Grid.prototype.markCells = function(ca) {
    var ci, l, len, results;
    results = [];
    for (l = 0, len = ca.length; l < len; l++) {
      ci = ca[l];
      results.push(this.markCell(ci));
    }
    return results;
  };

  Grid.prototype.getCellPosition = function(ci) {
    var center, cpos, rpos, x, y;
    cpos = ci % this.nCols;
    rpos = Math.floor(ci / this.nCols);
    center = new THREE.Vector2(this.nCols * this.cellSize / 2, this.nRows * this.cellSize / 2);
    x = -center.x + cpos * this.cellSize;
    y = -center.y + rpos * this.cellSize;
    return new THREE.Vector2(x, -y);
  };

  return Grid;

})();

module.exports = Grid;