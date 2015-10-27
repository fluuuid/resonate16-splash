import THREE from 'three.js';

class Logo
{
    constructor(generator)
    {
        this.generator = generator;
        this.container = new THREE.Object3D();
        let loader = new THREE.JSONLoader()
        loader.load( "static/obj/logo-icon.js", this.onLoaded.bind(this));
    }

    onLoaded ( geo, materials ) {
        geo.computeVertexNormals()

        let bgeo = new THREE.BufferGeometry()
        bgeo.fromGeometry(geo);
        bgeo.computeBoundingBox()
        bgeo.computeBoundingSphere()

        let mat = this.generator.material.clone()
        mat.uniforms.color1.value = new THREE.Color( 1, 1, 1 )
        mat.uniforms.color2.value = new THREE.Color( 1, 1, 1 )
        mat.uniforms.mode.value = 1
        mat.uniforms.progress.value = 0
        mat.uniforms.wobbling.value = 0.2
        mat.uniforms.rotation.value = Math.PI/4

        this.logo = new THREE.Mesh(bgeo, mat)
        let scl = this.generator.grid.cellSize * 4 / 100
        this.logo.scale.set( scl, scl, scl)
        this.logo.rotation.z = -Math.PI/4
        this.logo.position.set( scl * 2.5, 0, -2)
        this.container.add( this.logo)

        TweenLite.to( mat.uniforms.progress, 6, { value: 1 })
    }

    onMouseMove ( e ) {
        if(!this.logo) return;
        let mx =  ( e.clientX / window.innerWidth ) * 2 - 1
        let my = -( e.clientY / window.innerHeight ) * 2 + 1
        
        let m = new THREE.Vector2 (mx * window.innerWidth, my * window.innerHeight)
        let s = this.logo.scale.x * 100

        let intersect = m.x > -s * .85 && m.x < s * .85 && m.y > -s && m.y < s

        if(intersect && !this.intersected)
        {
            let col1 = this.generator.colors1
            let col2 = this.generator.colors2
            let ci = Math.round( Math.random() * ( col1.length-1 ) )
            this.logo.material.uniforms.mode.value = Math.round (Math.random())
            // #TweenLite.killTweensOf( this.logo.material.uniforms.progress )
            TweenLite.to (this.logo.material.uniforms.wobbling, 1, { value: 1 })
            // #TweenLite.to (this.logo.material.uniforms.progress, 1, { value: 1.5 })
            TweenLite.to (this.logo.material.uniforms.color1.value, 1, { r: col1[ci].r, g: col1[ci].g, b: col1[ci].b })
            TweenLite.to (this.logo.material.uniforms.color2.value, 1, { r: col2[ci].r, g: col2[ci].g, b: col2[ci].b })
            this.intersected = true
        } else if( this.intersected && !intersect ){
            // #TweenLite.killTweensOf( this.logo.material.uniforms.progress )
            // #this.logo.material.uniforms.progress.value = 0
            // #TweenLite.to (this.logo.material.uniforms.progress, 6, { value: 1 })
            TweenLite.to (this.logo.material.uniforms.wobbling, 1, { value: .2 })
            TweenLite.to (this.logo.material.uniforms.color1.value, 1, { r: 1, g: 1, b: 1 })
            TweenLite.to (this.logo.material.uniforms.color2.value, 1, { r: 1, g: 1, b: 1 })
            this.intersected = false
        }
    }

    // if !Main.isMobile()
    //     window.addEventListener "mousemove", onMouseMove, false

    // window.renderer = this.renderer

    // if window.addEventListener
    //     window.addEventListener 'resize', ( e ) =>
    //         this.resize()
    //     , false
    // else if window.attachEvent
    //     window.attachEvent 'resize', ( e ) =>
    //         this.resize()
    //     , false

    // #this.gui = new dat.GUI()

    // # debug options
    // onKeyDown = ( e ) =>
    //     #console.log e.keyCode
    //     switch e.keyCode
    //         when 71 # g
    //             this.generator.grid.active = !this.generator.grid.active

    // window.addEventListener "keydown", onKeyDown, false
}

export default Logo;