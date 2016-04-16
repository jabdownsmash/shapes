
createText = function()
{
    // create a canvas element
    var canvas1 = document.createElement('canvas');
    canvas1.width = 2000;
    var context1 = canvas1.getContext('2d');
    context1.font = "Bold 40px Arial";
    // fe ca a8
    context1.fillStyle = "rgba(254,202,168,0.95)";
    context1.fillText('workin on my but', 0, 100);
    
    // canvas contents will be used for a texture
    var texture1 = new THREE.Texture(canvas1) 
    texture1.needsUpdate = true;
      
    var material1 = new THREE.MeshBasicMaterial( {map: texture1, side:THREE.DoubleSide } );
    material1.transparent = true;

    var mesh1 = new THREE.Mesh(
        new THREE.PlaneGeometry(canvas1.width, canvas1.height),
        material1
      );
    return mesh1;
}