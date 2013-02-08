SoundPlayer = {
    
    sounds : {},
    queue : {},
    timer : {}
    
};

SoundPlayer.add = function( name )
{
    
    SoundPlayer.sounds[name] = "sounds/" + name;
    
};

SoundPlayer.play = function( name )
{
    
    if (! SoundPlayer.sounds[name])
    {
        
        SoundPlayer.add( name );
        
        SoundPlayer.timer[name] = 0;
        
    }
    
    SoundPlayer.queue[name] = true;
    
};

SoundPlayer.run = function( delta )
{
    
    delta = delta / SPEED;
    
    for (name in SoundPlayer.queue)
    {
        
        if ( SoundPlayer.timer[name] == 0 && (! MUTE) )
        {
            
            var a = new Audio( SoundPlayer.sounds[name] );
            
            a.play();
            
            delete SoundPlayer.queue[name];
            
            SoundPlayer.timer[name] = 200;
            
            // This sound is overpowering, so limit it more.
            if (name == 'explosion.ogg')
            {
                
                SoundPlayer.timer[name] = 400;
                
            }
            
        }
        else
        {
            
            SoundPlayer.timer[name] = Math.max( 0, SoundPlayer.timer[name] - delta );
            
        }
        
    }
    
};