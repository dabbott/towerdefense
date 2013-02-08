Animate = {

    skins : {}
    
};

Animate.add = function( skin, keyframes )
{
    
    skin.keyframes = keyframes;
    
    skin.currentKeyframe = _.keys( keyframes )[0];
    
    skin.t = skin.keyframes[skin.currentKeyframe].start;
    
    var id = _.uniqueId('skin_');
    
    Animate.skins[id] = skin;
    
    return id;
    
};

Animate.remove = function( id )
{
    
    delete Animate.skins[id];
  
};

Animate.setKeyframe = function( id, name )
{
    
    var skin = Animate.skins[id]
    
    skin.currentKeyframe = name;
    
    var ckf = skin.keyframes[skin.currentKeyframe];
    
    skin.t = ckf.start;
    
};

Animate.run = function( delta )
{

    for (var id in Animate.skins)
    {
        
        var skin = Animate.skins[id];
        
        var ckf = skin.keyframes[skin.currentKeyframe];
        
        if ( skin.t > ckf.duration ) {
            
            skin.t = ckf.start;
            
        }
        
        // Alternate through skin morphs
        for ( var i = 0; i < skin.morphTargetInfluences.length; i++ ) {
            
            skin.morphTargetInfluences[ i ] = 0;
            
        }
        
        skin.morphTargetInfluences[ Math.floor( skin.t ) ] = 1;
        
        skin.t += (delta / 20) * ckf.speed;
        
    }
    
};

Keyframe = function( start, duration, speed ) {
    
    this.start = start;
    this.duration = duration;
    this.speed = speed || 1;
    
};