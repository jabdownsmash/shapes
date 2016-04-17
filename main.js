
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
var pulseTime = beatLength;

var menuObjects = [];
var playing = false;

var angles = []

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

    scene.fog = new THREE.FogExp2( menu.rows[0][0].mgColor, fogD); //p1

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( menu.rows[0][0].bgColor);

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
function tweenTo(obj,x,y,time,scale,startScale,onComplete)
{
    new TWEEN.Tween(obj.obj.position)
        .to({x: x, y: y}, time)
        .easing(TWEEN.Easing.Cubic.Out)
        .onComplete(onComplete)
        .start();
    var col = {scale:startScale};
    new TWEEN.Tween(col)
        .to({scale:scale}, time)
        .onUpdate(
            function()
                {
                    obj.obj.scale.set(this.scale, this.scale, this.scale);
                })
        .start();
}
function triggerMenu(menuID){
        menuOn = true;
        toggle();
        var menuFunc = function(mainAttr,settingsCB)
        {
            // tweenTo(mainObject,0,0,300,50,50,function(){
                var numColors = menu.rows[menuID].length;
                var settings = menu.settingsFromObject(mainObject);
                for(var i = 0; i < numColors; i++)
                {
                    var obj;
                    var angle = (Math.PI*2 * (i - mainAttr))/numColors + (menuID)*Math.PI/2;
                    var size = 20;
                    if(i == mainAttr)
                    {
                        obj = mainObject;
                        size = 30;
                    }
                    else
                    {
                        obj = menu.copyObject(mainObject);
                        // settings.color = i;
                        obj.obj.position.x = mainObject.obj.position.x;
                        obj.obj.position.y = mainObject.obj.position.y;
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
                            var newObj = mainObject;
                            for(var j = 0; j < menuObjects.length; j++)
                            {
                                if(j == k)
                                {
                                    // mainObject = menuObjects[j];
                                    if(menuObjects[j] === mainObject)
                                    {
                                        tweenTo(menuObjects[j],0,0,100*j + 300,50,30,function()
                                            {
                                                menuObjects = [];
                                                objects = [mainObject];
                                                menuOn = false;
                                            });
                                    }
                                    else
                                    {
                                        newObj = menuObjects[j];
                                        tweenTo(menuObjects[j],mainObject.obj.position.x,mainObject.obj.position.y,100*j + 300,.1,20,(function(o)
                                            {
                                                return function()
                                                    {
                                                        menu.transformTo(mainObject,newObj,scene.fog,renderer);
                                                        tweenTo(mainObject,0,0,300,50,30,function()
                                                            {
                                                            });
                                                        scene.remove(o.obj)
                                                        menuObjects = [];
                                                        objects = [mainObject];
                                                        menuOn = false;
                                                    };
                                            })(menuObjects[j]));
                                    }
                                }
                                else if( !(menuObjects[j] === mainObject))
                                {
                                    tweenTo(menuObjects[j],menuObjects[j].obj.position.x,menuObjects[j].obj.position.y,100*j + 300,.1,20,(function(o)
                                        {
                                            return function(){scene.remove(o.obj)};
                                        })(menuObjects[j]));
                                }
                                menuObjects[j].obj.clickFunc = null;
                            }
                            channels[menuID].switchTo(k - 1);
                        }
                    };
                    addFunc(i);
                    tweenTo(obj,Math.cos(angle)*80,Math.sin(angle)*80,300,size,50,function(){});
                }
            // });
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
var start = null;
var currentTime = 0;
var previousTime = 0;
function animate(timestamp) {
    requestAnimationFrame( animate );
    var dt = 0;
    if(timestamp)
    {
        if (!start) start = timestamp;
        currentTime = timestamp - start;
        dt = currentTime - previousTime;
        previousTime = currentTime;
    }
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
            triggerMenu(2);
            mousedown = false;
            SELECTED = null;
        }
        else if(SELECTED.position.x > distanceThreshold)
        {
            triggerMenu(0);
            mousedown = false;
            SELECTED = null;
        }
        else if(SELECTED.position.y < -distanceThreshold) ///down
        {
            triggerMenu(3);
            mousedown = false;
            SELECTED = null;
        }
        else if(SELECTED.position.y > distanceThreshold)
        {
            triggerMenu(1);
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
        objects[i].obj.rotation.y += dt/1000;
    }

    pulseCounter += dt;
    if(pulseCounter > pulseTime)
    {
        for(var i = 0; i < channels.length; i++)
        {
            channels[i].sync(currentTime);
            // if(currentTime % (beatLength*16) < beatLength)
            // {
            // //     channels[i].switchTo(channels[i].currentSound + 1);
            // }
        }
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