
var camera, scene, renderer, raycaster;
// var mesh;
var objects;
var mouse = new THREE.Vector2();
var INTERSECTED,SELECTED;
var radius = 100, theta = 0;
var suck = { kek2 : 200};
var menu;
var menuOn = false;
var mainObject,plane,offset;
var distanceThreshold = 60;
var pulseCounter = 0;
var pulseTime = .5;

var menuObjects = [];

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
    objects.push(mainObject);
    scene.add(mainObject.obj);

    plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
        new THREE.MeshBasicMaterial( { visible: false } )
    );
    scene.add( plane );

    scene.fog = new THREE.FogExp2( 0x3F284F, 0.0045); //p1

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xDAD8A7);

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    document.addEventListener( 'touchmove', onDocumentTouchMove, false );
    document.addEventListener("touchstart", reset2,false);
    document.addEventListener("mousedown", reset,false);
    document.addEventListener("touchend", function(){SELECTED = null;mousedown = false},false);
    document.addEventListener("mouseup", function(){SELECTED = null;mousedown = false},false);
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
function tweenTo(obj,x,y,scale,startScale,onComplete)
{
    new TWEEN.Tween(obj.obj.position)
        .to({x: x, y: y}, 300)
        .easing(TWEEN.Easing.Cubic.In)
        .onComplete(onComplete)
        .start();
    var col = {scale:startScale};
    new TWEEN.Tween(col)
        .to({scale:scale}, 300)
        .onUpdate(
            function()
                {
                    obj.obj.scale.set(this.scale, this.scale, this.scale);
                })
        .start();
}
function triggerMenu(menuID){
        menuOn = true;
        var menuFunc = function(mainAttr,settingsCB)
        {
            tweenTo(mainObject,0,0,50,50,function(){
                var numColors = menu.rows[menuID].length;
                var settings = menu.settingsFromObject(mainObject);
                for(var i = 0; i < numColors; i++)
                {
                    var obj;
                    var angle = Math.PI*2 * i/numColors;
                    if(i == mainAttr)
                    {
                        obj = mainObject;
                    }
                    else
                    {
                        obj = menu.copyObject(mainObject);
                        // settings.color = i;
                        settingsCB(settings,i);
                        menu.transformTo(obj,settings);
                        scene.add(obj.obj);
                    }
                    menuObjects.push(obj);
                    objects.push(obj);
                    var addFunc = function(k)
                    {
                        menuObjects[k].obj.clickFunc = function()
                        {
                            for(var j = 0; j < menuObjects.length; j++)
                            {
                                if(j == k)
                                {
                                    mainObject = menuObjects[j];
                                    tweenTo(menuObjects[j],0,0,50,20,function()
                                        {
                                            menuObjects = [];
                                            objects = [mainObject];
                                            menuOn = false;
                                        });
                                }
                                else
                                {
                                    var angle = Math.PI*2 * k/menuObjects.length;
                                    tweenTo(menuObjects[j],Math.cos(angle)*60,Math.sin(angle)*60,.1,20,(function(l)
                                        {
                                            return function(){scene.remove(menuObjects[l])};
                                        })(j));
                                }
                                menuObjects[j].obj.clickFunc = null;
                            }
                        }
                    };
                    addFunc(i);
                    tweenTo(obj,Math.cos(angle)*60,Math.sin(angle)*60,20,50,function(){});
                }
            });
        }
        if(menuID == 0)
        {
            menuFunc(mainObject.color,function(s,i){s.color = i});
        }
        if(menuID == 1)
        {
            menuFunc(mainObject.shape,function(s,i){s.shape = i});
        }
        if(menuID == 2)
        {
            menuFunc(mainObject.mutation,function(s,i){s.mutation = i});
        }
        if(menuID == 3)
        {
            menuFunc(mainObject.pulse,function(s,i){s.pulse = i});
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
        if(!menuOn)
        {
            mainObject.obj.position.x *= .9;
            mainObject.obj.position.y *= .9;
        }
    }
    else
    {
        var intersects = raycaster.intersectObject( plane );
        if ( intersects.length > 0 ) {
            var p = intersects[ 0 ].point.sub( offset );
            p.z = SELECTED.position.z;
            SELECTED.position.copy(p);
        }
        if(SELECTED.position.x < -distanceThreshold)
        {
            triggerMenu(3);
            mousedown = false;
            SELECTED = null;
        }
        if(SELECTED.position.x > distanceThreshold)
        {
            triggerMenu(2);
            mousedown = false;
            SELECTED = null;
        }
        if(SELECTED.position.y < -distanceThreshold) ///down
        {
            triggerMenu(1);
            mousedown = false;
            SELECTED = null;
        }
        if(SELECTED.position.y > distanceThreshold)
        {
            triggerMenu(0);
            mousedown = false;
            SELECTED = null;
        }
    }
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
        var i = 0;
        while(i < intersects.length && intersects[i].object.nonIntersect){i++;}
        if ( i < intersects.length && INTERSECTED != intersects[ i ].object ) {
            INTERSECTED = intersects[ i ].object;
        }
    } else {
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

    pulseCounter += 1/60;
    if(pulseCounter > pulseTime)
    {
        pulseCounter -= pulseTime;
        for(var i=0; i < objects.length; i++)
        {
            objects[i].pulseFunc(objects[i]);

        }
    }
    
    renderer.render( scene, camera );
}
function reset()
{
    if(!menuOn)
    {
        mousedown = true;
    }
    if(INTERSECTED.clickFunc)
    {
        INTERSECTED.clickFunc();
    }
}