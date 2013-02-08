/**
 * Creates a new enemy
 *
 * @constructor
 * @this {Enemy}
 * @param {String} type The type of this tower
 * @param {Array} path The initial path for this enemy
 * @param {Object} args Each key in this object is added to the enemy
 */
Enemy = function( type, args )
{
    
    _.defaults(this, ENEMY[type]);
    
    for (key in args)
    {
        this[key] = args[key];
    };
    
    //this.direction = [0, 0];
    
    this.finished = false;

    
};

Enemy.prototype.kill = function()
{
	
	this.health = 0;
	
}

/**
 * Deal damage to this enemy
 *
 * @param {Number} damage Amount of damage
 */
Enemy.prototype.damage = function( amt )
{
    
    if (this.health > amt)
    {
        
        this.health -= amt;
        
    }
    else
    {
        
        this.health = 0;
        
    };
    
};

/**
 * Advance this enemy on it's path
 */
Enemy.prototype.advance = function()
{
    
    if (this.path.length >= 1)
    {
        var prev = this.next || [START[0], START[1]];
        var n = this.path.splice(0, 1).pop();
        this.next = [n.x, n.y];
        
        this.direction = [this.next[0] - prev[0],
                          this.next[1] - prev[1]];
        
        return true;
    }
	
	this.finished = true;
    
    return false;
    
};

Enemy.prototype.setPath = function( path )
{
    
    this.path = path;
    this.finished = false;
    this.advance();
    
};

ENEMY = {
    
    SPIDER : {
        name : 'Spider',
		model : 'spider',
        speed : 8,
        health : 50,
		lives : 1,
		money : 5
    }
    
};