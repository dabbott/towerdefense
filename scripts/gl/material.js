Material = {
    _materials : {}
};

Material.set = function( name, mat ) {
    
    if (this._materials[name])
    {
        log( 'This material already exists in the materials list', name, mat );
    }
    
    this._materials[name] = mat;
    
    return mat;
    
};

Material.get = function( name ) {
    
    return this._materials[name];
    
};

Material.set('red', new THREE.MeshPhongMaterial({
    color: COLORS.red,
    opacity: 0.5
}));

Material.set('blue', new THREE.MeshPhongMaterial({color: COLORS.blue}));

Material.set('sand', new THREE.MeshLambertMaterial({
    map : THREE.ImageUtils.loadTexture( 'images/textures/sandpaper.jpg' )
}));

Material.set('redSand', new THREE.MeshLambertMaterial( {
    color: 0x660000,
    reflectivity: 0.25,
    combine: THREE.MultiplyOperation,
    map : THREE.ImageUtils.loadTexture( 'images/textures/sandpaper.jpg' )
}));

Material.set('x-wall', new THREE.MeshLambertMaterial( {
    map : THREE.ImageUtils.loadTexture( 'images/textures/wall.jpg' )
}));

Material.set('greenGlobe', new THREE.MeshLambertMaterial( {
    color: 0x22FF33,
    reflectivity: 0.25,
    combine: THREE.MultiplyOperation,
    map : THREE.ImageUtils.loadTexture( 'images/textures/earth.jpg' )
}));