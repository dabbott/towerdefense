Player = function(){
    
    this.money = 30;
    this.towers = {};
	this.lives = 100;
};

// Return new tower on success, null on failure
Player.prototype.buildTower = function( coord, type )
{
    
    var square = g.arena.square( coord );
    
    square.tower = new Tower( this, coord, type, 0 );
    
    square.tower.id = _.uniqueId('tower_');
    
    this.towers[square.tower.id] = square.tower;
    
    this.money -= square.tower.cost;
    
    return square.tower;
    
};

Player.prototype.sellTower = function( tower )
{
    
    var square = g.arena.square( tower.coord );
    
    square.tower = null;
    
    delete this.towers[tower.id];
    
    this.money += tower.sell;
    
};