
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
                camera.position.z = 400;
                scene = new THREE.Scene();

                objects = []

                // for(var i = 0; i < 20; i++)
                // {
                //     for(var j = 0; j < 20; j++)
                //     {
                        var object = new Bun(new THREE.SphereGeometry( 5, 32, 32 ));
                        // object.obj.position.x = 40*i - 400;
                        // object.obj.position.y = 40*j - 400;
                        object.obj.position.z = Math.random() * 10 - 5;
                        scene.add(object.obj);
                        object.passes.push(motionPasses.expoPass);
                        object.passes.push(motionPasses.everyXDo(20,motionPasses.randomizeVerticesLength(.2)));
                        objects.push(object);
                        // object.randomizeVertices(2);
                //     }
                // }

                // scene.fog = new THREE.FogExp2( 0x2a363b, 0.0025 );
                // scene.fog = new THREE.FogExp2( 0xFF3D7F, 0.0055 ); //p1
                scene.fog = new THREE.FogExp2( 0x3FB8AF, 0.0035 ); //p1

                renderer = new THREE.WebGLRenderer();
                renderer.setPixelRatio( window.devicePixelRatio );
                renderer.setSize( window.innerWidth, window.innerHeight );
                // renderer.setClearColor( 0x3FB8AF);
                renderer.setClearColor( 0xDAD8A7);
                // renderer.setClearColor( 0x2a363b);
                document.body.appendChild( renderer.domElement );

                window.addEventListener( 'resize', onWindowResize, false );
                // document.addEventListener( 'mousemove', onDocumentMouseMove, false );
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
                // if ( intersects.length > 0 ) {
                //     var i = 0;
                //     while(i < intersects.length && intersects[i].object.isTitleMesh){i++;}
                //     // if ( i < intersects.length && INTERSECTED != intersects[ i ].object ) {
                //         // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                //         INTERSECTED = intersects[ i ].object;
                //         INTERSECTED.randomizeVertices(3);
                //         var colors = [0xe84a5f]
                //         // INTERSECTED.material.color = colors[Math.floor(Math.random()*colors.length)];
                //         INTERSECTED.material.color.setHex( 0x99b898 );
                //         var kek = INTERSECTED;
                //         var hsl = (new THREE.Color( 0x2a363b )).getHSL();
                //         suck.kek2 = 400;
                //         var hek = new TWEEN.Tween(mouse)
                //             .to({kek2:5}, 2)
                //             .easing(TWEEN.Easing.Quartic.In)
                //             .start();
                //         // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
                //         // INTERSECTED.material.emissive.setHex( 0xff0000 );
                //         // console.log('heh2');
                //     // }
                // // } else {
                // //     console.log('heh');
                //     // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
                //     // INTERSECTED = null;
                // }
                // mesh.rotation.x += 0.005;
                // mesh.rotation.y += 0.01;
                for(var object of objects)
                {
                    object.update();
                    // object.material.color.setHex( 0xe84a5f );

                }
                
                renderer.render( scene, camera );
            }
            function reset()
            {
                // for(var object of objects)
                // {
                //     // object.update();
                //     object.material.color.setHex( 0x2a363b );
                //     object.obj.position.z = Math.random() * 10 - 5;

                // }
                motionPasses.randomizeVertices(3)(objects[0]);
            }