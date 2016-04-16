var shapePasses =
    {
        translate : function ( x, y, z ) 
            {
                return function(obj) {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        var vertex = obj.originalGeom[i];
                        vertex.x += x;
                        vertex.y += y;
                        vertex.z += z;
                    }
                };
            },
        rotate : function ( x, y, z ) 
            {
                var m = new THREE.Matrix4();

                var m1 = new THREE.Matrix4();
                var m2 = new THREE.Matrix4();
                var m3 = new THREE.Matrix4();

                m1.makeRotationX( x );
                m2.makeRotationY( y );
                m3.makeRotationZ( z );

                m.multiplyMatrices( m1, m2 );
                m.multiply( m3 );

                return function(obj) {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        obj.originalGeom[i].applyMatrix4(m);
                    }
                };
            },
        linearExpandPass : function( startWidth , endWidth , height , offset)
            {
                return function(obj) {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        var vertex = obj.originalGeom[i];
                        var multiplier = startWidth + (endWidth - startWidth)*((vertex.y - offset)/height + 1/2);
                        vertex.x *= multiplier;
                        vertex.z *= multiplier;
                    }
                };
            },
        quadExpandPass : function( startWidth , endWidth , height , offset)
            {
                return function(obj) {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        var vertex = obj.originalGeom[i];
                        var multiplier = startWidth + (endWidth - startWidth)*((vertex.y - offset)/height + 1/2);
                        vertex.x *= multiplier*multiplier;
                        vertex.z *= multiplier*multiplier;
                    }
                };
            },
    };
var motionPasses = {

    everyXDo : function(changeEveryX, callback)
        {
            var animateCounter = 0;
            return function(obj)
                {
                    if(animateCounter++ > changeEveryX)
                    {
                        animateCounter = 0;
                        callback(obj);
                    }
                };
        },

    randomizeVertices : function(randWidth)
        {
            return function(obj)
                {
                    for(var i = 0; i < obj.obj.geometry.vertices.length; i++)
                    {
                        var vertex = obj.obj.geometry.vertices[i];
                        vertex.x = obj.originalGeom[i].x + Math.random()*randWidth - randWidth/2;
                        vertex.y = obj.originalGeom[i].y + Math.random()*randWidth - randWidth/2;
                        vertex.z = obj.originalGeom[i].z + Math.random()*randWidth - randWidth/2;
                    }
                    obj.obj.geometry.verticesNeedUpdate = true;
                };
        },

    randomizeVerticesLength : function(randLength)
        {
            return function(obj)
                {
                    for(var i = 0; i < obj.originalGeom.length; i++)
                    {
                        var rand = Math.random()*randLength;
                        obj.obj.geometry.vertices[i].x = obj.originalGeom[i].x + obj.originalGeom[i].x*rand;
                        obj.obj.geometry.vertices[i].y = obj.originalGeom[i].y + obj.originalGeom[i].y*rand;
                        obj.obj.geometry.vertices[i].z = obj.originalGeom[i].z + obj.originalGeom[i].z*rand;
                    }
                    obj.obj.geometry.verticesNeedUpdate = true;
                };
        },

    addRandom : function(randWidth)
        {
            return function(obj)
                {
                    for(var i = 0; i < obj.obj.geometry.vertices.length; i++)
                    {
                        var vertex = obj.obj.geometry.vertices[i];
                        vertex.x = vertex.x + Math.random()*randWidth - randWidth/2;
                        vertex.y = vertex.y + Math.random()*randWidth - randWidth/2;
                        vertex.z = vertex.z + Math.random()*randWidth - randWidth/2;
                    }
                    obj.obj.geometry.verticesNeedUpdate = true;
                };
        },

    addRandomLength : function(randLength)
        {
            return function(obj)
                {
                    for(var i = 0; i < obj.obj.geometry.vertices.length; i++)
                    {
                        var rand = Math.random()*randLength;
                        var vertex = obj.obj.geometry.vertices[i];
                        obj.obj.geometry.vertices[i].x = vertex.x + vertex.x*rand;
                        obj.obj.geometry.vertices[i].y = vertex.y + vertex.y*rand;
                        obj.obj.geometry.vertices[i].z = vertex.z + vertex.z*rand;
                    }
                    obj.obj.geometry.verticesNeedUpdate = true;
                };
        },

    expoPass : function(obj)
        {
            for(var i = 0; i < obj.originalGeom.length; i++)
            {
                obj.obj.geometry.vertices[i].x += (obj.originalGeom[i].x  - obj.obj.geometry.vertices[i].x)/6;
                obj.obj.geometry.vertices[i].y += (obj.originalGeom[i].y  - obj.obj.geometry.vertices[i].y)/6;
                obj.obj.geometry.vertices[i].z += (obj.originalGeom[i].z  - obj.obj.geometry.vertices[i].z)/6;
            }
            obj.obj.geometry.verticesNeedUpdate = true;
        },
    springPass : function(obj)
        {
            var speedModifier = 10;
            for(var i = 0; i < obj.originalGeom.length; i++)
            {
                obj.originalGeom[i].speed.x += (obj.originalGeom[i].x  - obj.obj.geometry.vertices[i].x)/speedModifier;
                obj.originalGeom[i].speed.y += (obj.originalGeom[i].y  - obj.obj.geometry.vertices[i].y)/speedModifier;
                obj.originalGeom[i].speed.z += (obj.originalGeom[i].z  - obj.obj.geometry.vertices[i].z)/speedModifier;

                obj.originalGeom[i].speed.x *= .9;
                obj.originalGeom[i].speed.y *= .9;
                obj.originalGeom[i].speed.z *= .9;

                obj.obj.geometry.vertices[i].x += obj.originalGeom[i].speed.x;
                obj.obj.geometry.vertices[i].y += obj.originalGeom[i].speed.y;
                obj.obj.geometry.vertices[i].z += obj.originalGeom[i].speed.z;

                if(Math.abs(obj.obj.geometry.vertices[i].x) < Math.abs(obj.originalGeom[i].x))
                {
                    obj.originalGeom[i].speed.x += (obj.originalGeom[i].x - obj.obj.geometry.vertices[i].x)/speedModifier;    
                }
                if(Math.abs(obj.obj.geometry.vertices[i].y) < Math.abs(obj.originalGeom[i].y))
                {
                    obj.originalGeom[i].speed.y += (obj.originalGeom[i].y - obj.obj.geometry.vertices[i].y)/speedModifier;    
                }
                if(Math.abs(obj.obj.geometry.vertices[i].z) < Math.abs(obj.originalGeom[i].z))
                {
                    obj.originalGeom[i].speed.z += (obj.originalGeom[i].z - obj.obj.geometry.vertices[i].z)/speedModifier;    
                }

            }
            obj.obj.geometry.verticesNeedUpdate = true;
        },
}