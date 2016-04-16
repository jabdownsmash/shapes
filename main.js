
var camera, scene, renderer, raycaster;
// var mesh;
var objects;
var mouse = new THREE.Vector2();
var INTERSECTED;
var radius = 100, theta = 0;
var suck = { kek2 : 200};
init();
animate();

function init() {

    raycaster = new THREE.Raycaster();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 250;
    scene = new THREE.Scene();

    objects = [];

    icons = [];

    // for(var i = 0; i < 20; i++)
    // {
    //     for(var j = 0; j < 20; j++)
    //     {
            var obj1 = new Bun(new THREE.SphereGeometry( 2, 10, 15 ));
            obj1.obj.position.x = 100*(-1);
            // obj1.obj.position.y = 40*j - 400;
            // obj1.obj.position.z = Math.random() * 10 - 5;
            scene.add(obj1.obj);
            shapePasses.quadExpandPass(1,.5,4,0)(obj1);

            obj1.reset();
            obj1.passes.push(motionPasses.expoPass);
            obj1.passes.push(motionPasses.everyXDo(20,motionPasses.addRandomLength(.2)));
            objects.push(obj1);

            var object = new Bun(new THREE.TorusKnotGeometry( 1, .6, 10, 20 ));
            object.obj.position.x = 100*1;
            // object.obj.position.y = 40*j - 400;
            shapePasses.rotate(1,0,0)(object);
            shapePasses.translate(-3,0,0)(object);
            shapePasses.linearExpandPass(.8,1.2,3,0)(object);
            shapePasses.translate(3,0,0)(object);
            shapePasses.rotate(-1,0,0)(object);
            shapePasses.rotate(.5,0,.6)(object);
            object.reset();
            // object.obj.position.z = Math.random() * 10 - 5;
            scene.add(object.obj);
            object.passes.push(motionPasses.expoPass);
            // object.passes.push(motionPasses.everyXDo(20,motionPasses.addRandomLength(.2)));
            object.passes.push(motionPasses.everyXDo(20,function(object)
                {
                    shapePasses.rotate(1,0,0)(object);
                    shapePasses.translate(-3,0,0)(object);
                    // shapePasses.linearExpandPass(.8,1.2,3,0)(object);
                    shapePasses.translate(3,0,0)(object);
                    shapePasses.rotate(-1,0,0)(object);
                    shapePasses.rotate(.5,0,.6)(object);
                    object.setTo(obj1);
                }));
            objects.push(object);
            // object.originalGeom = obj1.originalGeom;
            // object.randomizeVertices(2);
            obj1.setTo(object);
    //     }
    // }

    // scene.fog = new THREE.FogExp2( 0x2a363b, 0.0025 );
    // scene.fog = new THREE.FogExp2( 0xFF3D7F, 0.0055 ); //p1
    scene.fog = new THREE.FogExp2( 0x3F284F, 0.0045); //p1

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    // renderer.setClearColor( 0x3FB8AF);
    renderer.setClearColor( 0xDAD8A7);
    // renderer.setClearColor( 0x2a363b);
    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener("click", reset,false);
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
function onDocumentMouseMove( event ) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
function animate() {
    requestAnimationFrame( animate );

    camera.updateMatrixWorld();
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        var i = 0;
        while(i < intersects.length && intersects[i].object.nonIntersect){i++;}
        if ( i < intersects.length && INTERSECTED != intersects[ i ].object ) {
            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ i ].object;
            INTERSECTED.randomizeVertices(3);
            // var colors = [0xe84a5f]
            // INTERSECTED.material.color = colors[Math.floor(Math.random()*colors.length)];
            INTERSECTED.material.color.setHex( 0x99b898 );
            var kek = INTERSECTED;
            var hsl = (new THREE.Color( 0x2a363b )).getHSL();
            suck.kek2 = 400;
            var hek = new TWEEN.Tween(mouse)
                .to({kek2:5}, 2)
                .easing(TWEEN.Easing.Quartic.In)
                .start();
            // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            // INTERSECTED.material.emissive.setHex( 0xff0000 );
            // console.log('heh2');
        }
    } else {
        // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }
    for(var object of objects)
    {
        object.update();

    }
    
    renderer.render( scene, camera );
}
function reset()
{
    for(var i = 0; i < objects.length; i++)
    {
        motionPasses.randomizeVertices(3)(objects[i]);
    }
}