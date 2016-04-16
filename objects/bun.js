
Bun = function()
{
    this.originalGeom = [];
    var geom = new THREE.Geometry(); 
    var vertices = [[-.5,-.5,-.5],[-.5,.5,-.5],[-.5,.5,.5],[-.5,-.5,.5],
                    [.5,-.5,-.5],[.5,.5,-.5],[.5,.5,.5],[.5,-.5,.5]];

    for(var vertex of vertices)
    {
        geom.vertices.push(new THREE.Vector3(vertex[0],vertex[1],vertex[2]));
        var v3 = new THREE.Vector3(vertex[0],vertex[1],vertex[2]);
        v3.speed = {x:0,y:0,z:0}
        this.originalGeom.push(v3);
    }

    geom.faces.push( new THREE.Face3( 0, 2, 1 ) );
    geom.faces.push( new THREE.Face3( 0, 3, 2 ) );

    geom.faces.push( new THREE.Face3( 4, 5, 6 ) );
    geom.faces.push( new THREE.Face3( 4, 6, 7 ) );

    geom.faces.push( new THREE.Face3( 0, 1, 4 ) );
    geom.faces.push( new THREE.Face3( 1, 5, 4 ) );

    geom.faces.push( new THREE.Face3( 1, 2, 5 ) );
    geom.faces.push( new THREE.Face3( 2, 6, 5 ) );

    geom.faces.push( new THREE.Face3( 2, 3, 6 ) );
    geom.faces.push( new THREE.Face3( 3, 7, 6 ) );

    geom.faces.push( new THREE.Face3( 3, 4, 7 ) );
    geom.faces.push( new THREE.Face3( 3, 0, 4 ) );
    // geom.faces.push( new THREE.Face3( 0, 2, 1 ) );
    geom.computeFaceNormals();
    // function assignUVs(geometry) {

    geom.faceVertexUvs[0] = [];

    geom.faces.forEach(function(face) {

        var components = ['x', 'y', 'z'].sort(function(a, b) {
            return Math.abs(face.normal[a]) > Math.abs(face.normal[b]);
        });

        var v1 = geom.vertices[face.a];
        var v2 = geom.vertices[face.b];
        var v3 = geom.vertices[face.c];

        geom.faceVertexUvs[0].push([
            new THREE.Vector2(v1[components[0]], v1[components[1]]),
            new THREE.Vector2(v2[components[0]], v2[components[1]]),
            new THREE.Vector2(v3[components[0]], v3[components[1]])
        ]);

    });

    // geom.uvsNeedUpdate = true;
// }


    var texture = new THREE.TextureLoader().load( 'assets/crate.gif' );
    texture.repeat.set(.5,.5);
    texture.wrapS = texture.wrapT = THREE.MirroredRepeatWrapping;
    // var material = new THREE.MeshPhongMaterial( { map: texture } );
    this.material = new THREE.MeshBasicMaterial( { color: 0x2a363b } );
    var object = new THREE.Mesh( geom, this.material );
    // var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );


    object.scale.set(50,50,50);
    this.obj = object;

    this.animateCounter = 0;
    this.changeEveryX = 80;
    this.passes = [];

    var kek = this;

    object.randomizeVertices = function(x)
    {
        kek.randomizeVertices(x);
    };
}

Bun.prototype.constructor = Bun

Bun.prototype.randomizeVertices = function(randWidth)
{
    for(var i = 0; i < this.originalGeom.length; i++)
    {
        this.obj.geometry.vertices[i].x = this.originalGeom[i].x + Math.random()*randWidth - randWidth/2;
        this.obj.geometry.vertices[i].y = this.originalGeom[i].y + Math.random()*randWidth - randWidth/2;
        this.obj.geometry.vertices[i].z = this.originalGeom[i].z + Math.random()*randWidth - randWidth/2;
    }
}

Bun.prototype.randomizeVerticesLength = function(randLength)
{
    for(var i = 0; i < this.originalGeom.length; i++)
    {
        this.obj.geometry.vertices[i].x = this.originalGeom[i].x + this.originalGeom[i].x*Math.random()*randLength;
        this.obj.geometry.vertices[i].y = this.originalGeom[i].y + this.originalGeom[i].y*Math.random()*randLength;
        this.obj.geometry.vertices[i].z = this.originalGeom[i].z + this.originalGeom[i].z*Math.random()*randLength;
    }
}

Bun.prototype.update = function()
{
    //'hand drawn' shaky vertices
    if(this.animateCounter++ > this.changeEveryX)
    {
        this.animateCounter = 0;
        // this.randomizeVertices(300)
        // this.randomizeVerticesLength(5.5)
    }

    for(var i = 0; i < this.passes.length; i++)
    {
        this.passes[i](this);
    }

    //tween back to original
    // for(var i = 0; i < this.originalGeom.length; i++)
    // {
    //     this.obj.geometry.vertices[i].x += (this.originalGeom[i].x  - this.obj.geometry.vertices[i].x)/6;
    //     this.obj.geometry.vertices[i].y += (this.originalGeom[i].y  - this.obj.geometry.vertices[i].y)/6;
    //     this.obj.geometry.vertices[i].z += (this.originalGeom[i].z  - this.obj.geometry.vertices[i].z)/6;
    // }

    //mario 64 style rubberiness, faked with individual bounce tweens
    // this.obj.rotation.x += 0.005;
    // this.obj.rotation.y += 0.01;
}