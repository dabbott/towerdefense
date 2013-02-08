/**
 * Function generation object
 */
Generate = {};

/**
 * Generate an animator for objects
 * @param {Object} morph
 * @param {Object} skin
 * @param {Number} limit Frame limit for the animation
 */
Generate.morph = function( morph, skin, limit ) {
    
    var t = 0;
    
    var f = function() {
        
        // Reset current frame
        if ( t > limit ) {
            t = 0;
        }
        
        // Alternate through skin morphs
        if ( skin ) {
            
            for ( var i = 0; i < skin.morphTargetInfluences.length; i++ ) {
                skin.morphTargetInfluences[ i ] = 0;
                
            }
            
            skin.morphTargetInfluences[ Math.floor( t ) ] = 1;
            
            t += 0.2;
        }
        
        // Alternate through geometry morphs
        if ( morph ) {
            
            for ( var i = 0; i < morph.morphTargetInfluences.length; i++ ) {
                
                morph.morphTargetInfluences[ i ] = 0;
                
            }
            
            morph.morphTargetInfluences[ Math.floor( t ) ] = 1;
            
            t += 0.2;
        }
        
    };
    
    Idle.add( f );
    
    return f;
    
}