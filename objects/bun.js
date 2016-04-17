
Bun = function(geom,color)
{
    this.material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } ); //p1
    // this.material = new THREE.MeshBasicMaterial( { color: 0x3FB8AF } ); //p1
    var object = new THREE.Mesh( geom, this.material );
    // var object = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );

    this.obj = object;

    this.passes = [];

    var kek = this;

    this.addOriginalVertices();
    geom.uvsNeedUpdate = true;
    this.obj.scale.set(50,50,50);
    var self = this;
    // this.pulse = function(){if(self.pulseFunc){self.pulseFunc(self)};};
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

Bun.prototype.setTo = function(other)
{
    var vertices = this.obj.geometry.vertices;
    var otherVertices = other.obj.geometry.vertices;
    for(var i = 0; i < vertices.length; i++)
    {
        var j = i;
        j = Math.min(otherVertices.length - 1,i);
        vertices[i].copy(otherVertices[j]);
    }
}

Bun.prototype.update = function()
{
    for(var i = 0; i < this.passes.length; i++)
    {
        this.passes[i](this);
    }
}

Bun.prototype.reset = function()
{
    for(var i = 0; i < this.originalGeom.length;i++)
    {
        this.obj.geometry.vertices[i].set(this.originalGeom[i].x,this.originalGeom[i].y,this.originalGeom[i].z);
    }
}