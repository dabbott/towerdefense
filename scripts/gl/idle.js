/**
 * Idle animation loop to animate according to elapsed time
 */
Idle = {
  
  functions : {},
  
  timers : {}
    
};

/**
 * Add a function to the idle loop
 */
Idle.add = function( f ) {
    
    var id = _.uniqueId('function_');
    
    this.functions[id] = f;
    
    return id;
    
};

/**
 * Remove a function from the idle loop
 * @returns {Boolean} Success if function existed in Idle Loop.
 */
Idle.remove = function( id ) {
    
    if (this.functions[id])
    {
        
        delete this.functions[id];
        
        return true;
        
    }
    else
    {
        
        return false;    
        
    }
    
};

/**
 * Add a function to the idle loop
 * @param {Number} delta Time passed since last execution
 */
Idle.run = function( delta ) {
    
    for (var id in this.functions)
    {
        
        var f = this.functions[id];
        
        f( delta );
        
        if (f.remove)
        {
            delete this.functions[id];
        }
        
        
    }
    
    for (var id in this.timers)
    {
        
        if (this.timers[id].tick( delta ))
        {
            this.deleteTimer( id );
        }
        
    }
    
}

/**
 * Add a timer to execute a function
 * @param {Number} wait Time between executions
 * @param {Function} callback Callback function
 * @param {Object} scope Scope will be set to 'this'
 * @param {Number} repeat Number of times to execute
 * @returns {Number} id Unique id for this timer
 */
Idle.newTimer = function( wait, callback, scope, repeat ) {
    
    var t = new Timer( wait, repeat );
    
    t.setCallback( callback, scope );
    
    this.timers[t.id] = t;
    
    return t.id;
    
}

Idle.timerExists = function ( id )
{
	if (this.timers[id])
	{
		return true;
	}
	
	return false;
}

/**
 * Add a timer to execute a function
 * @param {Number} id Timer id to delete
 * @returns {Boolean} result True if the timer existed
 */
Idle.deleteTimer = function( id )
{
    
    if (this.timers[id])
    {
        
        delete this.timers[id];
        
        return true;
        
    }
    else
    {
        return false;
    }
    
}

// Timer (only to be used by Idle class for now)
/* -------------------------------------------------------------------------- */

Timer = function( wait, repeat ) {
    
    this.callback = _.identity();
    
    this.id = _.uniqueId('timer_');
    
    this.time = 0;
    
    this.repeat = repeat;
    
    this.wait = wait;

}

Timer.prototype.setCallback = function( f, scope ) {
    
    this.callback = f;
    
    this.scope = scope;
    
}

Timer.prototype.tick = function( delta ) {
    
    this.time += delta;
    
    if (this.time >= this.wait)
    {
    
        this.callback.call( this.scope );
        
        this.time -= this.wait;
        
        if (this.repeat)
        {
            
            this.repeat -= 1;
            
            if (this.repeat <= 0)
            {
                return true;
            }   
        }
    }
    
    return false;
    
}
