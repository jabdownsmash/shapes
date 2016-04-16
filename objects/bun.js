
Bun = function(geom)
{
    this.material = new THREE.MeshBasicMaterial( { color: 0xFF3D7F } ); //p1
    // this.material = new THREE.MeshBasicMaterial( { color: 0x3FB8AF } ); //p1
    var object = new THREE.Mesh( geom, this.material );
    // var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );


    object.scale.set(50,50,50);
    this.obj = object;

    this.passes = [];

    var kek = this;

    this.addOriginalVertices();
}

Bun.prototype.constructor = Bun

Bun.prototype.addOriginalVertices = function()
{
    this.originalGeom = [];
    for(var i = 0; i < this.obj.geometry.vertices.length; i++)
    {
        var vertex = this.obj.geometry.vertices[i];
        var v3 = new THREE.Vector3(vertex.x,vertex.y,vertex.z);
        v3.speed = {x:0,y:0,z:0};
        this.originalGeom.push(v3);
    }
}

Bun.prototype.update = function()
{
    for(var i = 0; i < this.passes.length; i++)
    {
        this.passes[i](this);
    }
}