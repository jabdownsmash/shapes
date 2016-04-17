
var camera, scene, renderer, raycaster;
// var mesh;
var objects;
var mouse = new THREE.Vector2();
var INTERSECTED,SELECTED;
var radius = 100, theta = 0;
var suck = { kek2 : 200};
var menu;
var mainObject,plane,offset;
var distanceThreshold = 60;

var mousedown = false;
init();
animate();

function init() {

    raycaster = new THREE.Raycaster();

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 250;
    scene = new THREE.Scene();

    offset = new THREE.Vector3();

    objects = [];

    icons = [];

    menu = createMenu();
    mainObject = menu.generateObject();
    // mainObject.obj.clickFunc = function(){
    // }
    objects.push(mainObject);
    // mainObject.obj.position.z = 100;
    scene.add(mainObject.obj);
    // for(var i = 0; i < 4; i++)
    // {
    //     var object = menu.generateObject()
    //     objects.push(object);
    //     // object.obj.position.z = 100;
    //     object.obj.position.x = 10*i - 80;
    //     object.obj.position.y = 10*i - 80;
    //     scene.add(object.obj);
    // }
    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
        new THREE.MeshBasicMaterial( { visible: false } )
    );
    scene.add( plane );

    // for(var i = 0; i < 20; i++)
    // {
    //     for(var j = 0; j < 20; j++)
    //     {
            // var obj1 = new Bun(new THREE.SphereGeometry( 2, 10, 15 ));
            // obj1.obj.position.x = 100*(-1);
            // obj1.obj.position.y = 40*j - 400;
            // obj1.obj.position.z = Math.random() * 10 - 5;

            // var obj2 = menu.generateObject({})
            // scene.add(obj2.obj);
            // objects.push(obj2);
            // obj2.obj.position.x = 200;

            // var obj3 = menu.generateObject({})
            // scene.add(obj3.obj);
            // objects.push(obj3);
            // obj3.obj.position.y = -100;

            // shapePasses.quadExpandPass(1,.5,4,0)(obj1);

            // obj1.reset();
            // obj1.passes.push(motionPasses.expoPass);
            // obj1.passes.push(motionPasses.everyXDo(20,motionPasses.addRandomLength(.2)));
            // objects.push(obj1);

            // var object = new Bun(new THREE.TorusKnotGeometry( 1, .6, 10, 20 ));
            // object.obj.position.x = 100*1;
            // // object.obj.position.y = 40*j - 400;
            // // object.obj.position.z = Math.random() * 10 - 5;
            // scene.add(object.obj);
            // object.passes.push(motionPasses.expoPass);
            // // object.passes.push(motionPasses.everyXDo(20,motionPasses.addRandomLength(.2)));
            // mainObject.passes.push(motionPasses.everyXDo(20,function(object)
            //     {
            //         shapePasses.rotate(1,0,0)(object);
            //         shapePasses.translate(-3,0,0)(object);
            //         // shapePasses.linearExpandPass(.8,1.2,3,0)(object);
            //         shapePasses.translate(3,0,0)(object);
            //         shapePasses.rotate(-1,0,0)(object);
            //         shapePasses.rotate(.5,0,.6)(object);
            //         object.setTo(obj1);
            //     }));
            // objects.push(object);
            // object.originalGeom = obj1.originalGeom;
            // object.randomizeVertices(2);
            // obj1.setTo(object);
            // obj1.obj.geometry = new THREE.TorusKnotGeometry( 1, .6, 10, 20 );
            // obj1.addOriginalVertices();
            // obj1.obj.clickFunc = function(){
            //     object.setTo(obj1);
            //     console.log('fuck');
            // }
            // obj1.setTo(objet);
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
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    document.addEventListener("touchstart", reset2,false);
    document.addEventListener("mousedown", reset,false);
    document.addEventListener("touchend", function(){
                    // plane.position.copy( INTERSECTED.position );
                    SELECTED = null;mousedown = false},false);
    document.addEventListener("mouseup", function(){
                    // plane.position.copy( INTERSECTED.position );
                    SELECTED = null;mousedown = false},false);
}
function reset2(event){
    event.preventDefault();
    mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
    reset();

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
    console.log('keker');

    if ( SELECTED ) {
        var intersects = raycaster.intersectObject( plane );
        if ( intersects.length > 0 ) {
            var p = intersects[ 0 ].point.sub( offset );
            p.z = SELECTED.position.z;
            SELECTED.position.copy(p);
        }
        return;
    }
}
function onDocumentTouchMove( event ) {
    event.preventDefault();
    mouse.x = ( event.touches[0].clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.touches[0].clientY / window.innerHeight ) * 2 + 1;
}
function animate() {
    requestAnimationFrame( animate );
TWEEN.update();

    camera.updateMatrixWorld();
    raycaster.setFromCamera( mouse, camera );

    if ( !SELECTED ) {
        mainObject.obj.position.x *= .9;
        mainObject.obj.position.y *= .9;
    }
    else
    {
        var intersects = raycaster.intersectObject( plane );
        if ( intersects.length > 0 ) {
            var p = intersects[ 0 ].point.sub( offset );
            p.z = SELECTED.position.z;
            SELECTED.position.copy(p);
        }
    }
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        var i = 0;
        while(i < intersects.length && intersects[i].object.nonIntersect){i++;}
        if ( i < intersects.length && INTERSECTED != intersects[ i ].object ) {
            // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
            INTERSECTED = intersects[ i ].object;
            // INTERSECTED.randomizeVertices(3);
            // var colors = [0xe84a5f]
            // INTERSECTED.material.color = colors[Math.floor(Math.random()*colors.length)];
            // INTERSECTED.material.color.setHex( 0x99b898 );
            // var kek = INTERSECTED;
            // var hsl = (new THREE.Color( 0x2a363b )).getHSL();
            // var suck = {};
            // suck.kek2 = 400;
            // var hek = new TWEEN.Tween(suck)
            //     .to({kek2:5}, 2000)
            //     .easing(TWEEN.Easing.Quartic.In).onUpdate(function(){
            //     console.log(suck.kek2);
            // })
            //     .start();
            // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            // INTERSECTED.material.emissive.setHex( 0xff0000 );
            // console.log('heh2');
        }
    } else {
        // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = null;
    }
    if(mousedown && !SELECTED)
    {
        var intersects = raycaster.intersectObject( mainObject.obj );
        if(intersects.length > 0)
        {
            SELECTED = mainObject.obj;
            var intersects = raycaster.intersectObject( plane );
            if ( intersects.length > 0 ) {
                offset.copy( intersects[ 0 ].point ).sub( plane.position );
            }
        }
    }
    for(var i=0; i < objects.length; i++)
    {
        objects[i].update();

    }
    
    renderer.render( scene, camera );
}
function reset()
{
    mousedown = true;
    if(INTERSECTED.clickFunc)
    {
        INTERSECTED.clickFunc();
    }
        // mainObject.passes.push(motionPasses.everyXDo(20,motionPasses.addRandomLength(.2)));
    // for(var i = 0; i < objects.length; i++)
    // {
    //     // motionPasses.randomizeVertices(3)(objects[i]);
    //     var settings = {}
    //     // settings.shape = 0
    //     settings.shape = Math.floor(Math.random()*2) 
    //     settings.color = Math.floor(Math.random()*4) 
    //     // var kek = objects[i];
    //     // objects[i] = 
    //     menu.transformTo(objects[i],settings,scene.fog,renderer);
    //     objects[i].passes.push(motionPasses.everyXDo(20,motionPasses.addRandomLength(.2)));

    //     // scene.add(objects[i].obj);
    //     // (objects[i].pulseFunc(objects[i]));
    //     // scene.remove(kek.obj);
    // }
}