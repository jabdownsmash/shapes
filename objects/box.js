
createBox = function()
{
    var texture = new THREE.TextureLoader().load( 'assets/crate.gif' );
    var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    var material = new THREE.MeshPhongMaterial( { map: texture } );
    // mesh = new THREE.Mesh( geometry);
    mesh = new THREE.Mesh( geometry, material );
    return mesh;
}