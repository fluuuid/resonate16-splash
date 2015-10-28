import THREE from 'three.js';

class Logo
{

    constructor(generator)
    {
        this.ready = false
        this.generator = generator;
        this.container = new THREE.Object3D();
        let scl = this.generator.grid.cellSize * 4 / 100
        this.container.scale.set( scl, scl, scl)
        this.container.rotation.z = -Math.PI/4
        this.container.position.set( scl * 2.5, 0, -2)
        let loader = new THREE.JSONLoader()
        loader.load( "static/obj/logo-icon-01.js", this.onLoaded.bind(this));
        loader.load( "static/obj/logo-icon-02.js", this.onLoaded2.bind(this));
        loader.load( "static/obj/logo-icon-03.js", this.onLoaded3.bind(this));
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
        mat.uniforms.gradientMode.value = 0

        this.logo1 = new THREE.Mesh(bgeo, mat)
        this.logo1.visible = false
        this.container.add( this.logo1 )

        //TweenLite.to( mat.uniforms.progress, 6, { value: 1 })
    }

    onLoaded2 ( geo, materials ) {
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
        mat.uniforms.gradientMode.value = 1

        this.logo2 = new THREE.Mesh(bgeo, mat)
        this.logo2.visible = false
        this.container.add( this.logo2 )

        //TweenLite.to( mat.uniforms.progress, 6, { value: 1 })
    }

    onLoaded3 ( geo, materials ) {
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
        mat.uniforms.gradientMode.value = 1

        this.logo3 = new THREE.Mesh(bgeo, mat)
        this.logo3.visible = false
        this.container.add( this.logo3 )

        //TweenLite.to( mat.uniforms.progress, 6, { value: 1 })
    }

    onMouseMove ( e ) {
        if(!this.ready) return;
        let mx =  ( e.clientX / window.innerWidth ) * 2 - 1
        let my = -( e.clientY / window.innerHeight ) * 2 + 1
        
        let m = new THREE.Vector2 (mx * window.innerWidth, my * window.innerHeight)
        let s = this.logo1.scale.x * 100

        let intersect = m.x > -s * .85 && m.x < s * .85 && m.y > -s && m.y < s

        if(intersect && !this.intersected)
        {
            let col1 = this.generator.colors1
            let col2 = this.generator.colors2
            let ci = Math.round( Math.random() * ( col1.length-1 ) )
            let ci2 = (ci + 1) % col1.length
            let ci3 = (ci + 2) % col1.length
            this.logo1.material.uniforms.mode.value = Math.round (Math.random())
            this.logo2.material.uniforms.mode.value = Math.round (Math.random())
            this.logo3.material.uniforms.mode.value = Math.round (Math.random())
            TweenLite.to (this.logo1.material.uniforms.wobbling, 1, { value: 1 })
            TweenLite.to (this.logo2.material.uniforms.wobbling, 1, { value: 1 })
            TweenLite.to (this.logo3.material.uniforms.wobbling, 1, { value: 1 })
            TweenLite.to (this.logo1.material.uniforms.color1.value, 1, { r: col1[ci].r, g: col1[ci].g, b: col1[ci].b })
            TweenLite.to (this.logo1.material.uniforms.color2.value, 1, { r: col2[ci].r, g: col2[ci].g, b: col2[ci].b })
            TweenLite.to (this.logo2.material.uniforms.color1.value, 1, { r: col1[ci2].r, g: col1[ci2].g, b: col1[ci2].b })
            TweenLite.to (this.logo2.material.uniforms.color2.value, 1, { r: col2[ci2].r, g: col2[ci2].g, b: col2[ci2].b })
            TweenLite.to (this.logo3.material.uniforms.color1.value, 1, { r: col1[ci3].r, g: col1[ci3].g, b: col1[ci3].b })
            TweenLite.to (this.logo3.material.uniforms.color2.value, 1, { r: col2[ci3].r, g: col2[ci3].g, b: col2[ci3].b })
            this.intersected = true
        } else if( this.intersected && !intersect ){
            // #TweenLite.killTweensOf( this.logo.material.uniforms.progress )
            // #this.logo.material.uniforms.progress.value = 0
            // #TweenLite.to (this.logo.material.uniforms.progress, 6, { value: 1 })
            TweenLite.to (this.logo1.material.uniforms.wobbling, 1, { value: .2 })
            TweenLite.to (this.logo2.material.uniforms.wobbling, 1, { value: .2 })
            TweenLite.to (this.logo3.material.uniforms.wobbling, 1, { value: .2 })
            TweenLite.to (this.logo1.material.uniforms.color1.value, 1, { r: 1, g: 1, b: 1 })
            TweenLite.to (this.logo1.material.uniforms.color2.value, 1, { r: 1, g: 1, b: 1 })
            TweenLite.to (this.logo2.material.uniforms.color1.value, 1, { r: 1, g: 1, b: 1 })
            TweenLite.to (this.logo2.material.uniforms.color2.value, 1, { r: 1, g: 1, b: 1 })
            TweenLite.to (this.logo3.material.uniforms.color1.value, 1, { r: 1, g: 1, b: 1 })
            TweenLite.to (this.logo3.material.uniforms.color2.value, 1, { r: 1, g: 1, b: 1 })
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