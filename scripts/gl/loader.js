/**
 * Global file loader class to keep track of all object loads
 */
Loader = {};

/**
 * Load a model file
 *
 * @this {Loader}
 * @param {name} Name to access the file.
 * @param {filename} Filename to load.
 * @param {callback} Function to call with model as argument, once loaded.
 */
Loader.load = function( name, filename, callback )
{
	
    callback = callback || log;
	
	var ext = filename.split('.').pop().toLowerCase();
	
	switch(ext)
	{
		case 'js':
			this.loadJSON( filename, callback );
			break;
		case 'dae':
			this.loadCollada( name, filename, callback );
			break;
		default:
			log('Unrecognized file extension.');
			return false;
	}
	
	return true;
	
};

//Loader.loadJSON = function( filename, callback ) {
//    
//    var loader = new THREE.JSONLoader( true );
//    
//    loader.load({
//        model : filename,
//		callback : function( obj ) {
//			
//			Loader[filename] = obj;
//            callback( obj );
//			
//        }
//    });
//    
//};

Loader.loadCollada = function( name, filename, callback )
{
    
	NUM_TO_LOAD ++;
	
    var loader = new THREE.ColladaLoader( true );
    
    loader.load( filename, function( collada ) {
        
		Loader[filename] = Loader[name] = collada;
		
		NUM_LOADED ++;
		
		callback( collada );
        
    });
    
};

Loader.get = function( name )
{
	
	return THREE.SceneUtils.cloneObject( Loader[name].scene );
	
};

Loader.getCollada = function( name )
{
	
	return Loader[name];
	
};
