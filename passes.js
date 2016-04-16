var shapePasses = {
    // linearExpandPass : function( startWidth , endWidth , height = 1 , offset = 0){
    //     return function(vertices) {
    //         for(var i = 0; i < vertices.length; i++)
    //         {
    //             var multiplier = startWidth + (endWidth - startWidth)*((vertices[i].y - offset)/height + 1/2);
    //             vertices[i].x *= multiplier;
    //             vertices[i].z *= multiplier;
    //         }
    //     };
    // },
    linearExpandPass : function( startWidth , endWidth , height , offset){
        return function(vertices) {
            for(var i = 0; i < vertices.length; i++)
            {
                var multiplier = startWidth + (endWidth - startWidth)*((vertices[i].y - offset)/height + 1/2);
                vertices[i].x *= multiplier;
                vertices[i].z *= multiplier;
            }
        };
    },
}
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
                        obj.obj.geometry.vertices[i].x = obj.originalGeom[i].x + obj.originalGeom[i].x*Math.random()*randLength;
                        obj.obj.geometry.vertices[i].y = obj.originalGeom[i].y + obj.originalGeom[i].y*Math.random()*randLength;
                        obj.obj.geometry.vertices[i].z = obj.originalGeom[i].z + obj.originalGeom[i].z*Math.random()*randLength;
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