Game = function(){
   
    this.arena = new Arena();
    
    this.player = new Player();
	
	this.level = 1;
	this.enemies = {};
	this.started = false;
	this.over = false;
	this.numEnemies = 0;
	this.enemiesCreated = 0;
    
    this.currentTower = 'GATTLING';
};

Game.prototype.startGame = function ()
{
	if (this.started == false)
	{
		this.started = true;
		this.runLevel();
	}
}

Game.prototype.createEnemy = function ()
{
    // TODO, balance...
	var e = new Enemy( SPIDER, {'health' : ENEMY[SPIDER].health * ( 1 + this.level / 3 )} );
	
	e.path = this.arena.aStar( START, DESTINATION );
	e.advance();
	
	var mesh = Geometry.addEnemy( e );
	e[MESH] = mesh;
	
	var id = _.uniqueId('enemy_');
	this.enemies[id] = e;
	this.createdEnemies++;
    
    e.id = id;
};

Game.prototype.runLevel = function ()
{
	this.numEnemies = this.level * 2 + 3;
	this.createdEnemies = 0;
	
	this.createEnemy();
	Idle.newTimer(1000, this.createEnemy, this, this.numEnemies - 1);
	this.checkTimer = Idle.newTimer(10, this.checkEnemies, this);
}

Game.prototype.checkEnemies = function ()
{
	var size = 0;
	
	for (var id in this.enemies)
	{
		var enemy = this.enemies[id];
		if (enemy.finished || enemy.health <= 0)
		{
			if (enemy.finished)
			{
				this.player.lives = Math.max(this.player.lives - enemy.lives, 0);
				if (this.player.lives <= 0)
					this.over = true;
			}
            else
            {
                this.player.money += 5;
            }
			
			this.destroyEnemy(enemy);
			delete this.enemies[id];
		} else
		{
			size++;
		}
	}
	
	if (size == 0 && this.createdEnemies == this.numEnemies)
	{
		Idle.deleteTimer(this.checkTimer);
		
		if (this.over == false)
		{
			this.level++;
			Idle.newTimer(5000, this.runLevel, this, 1);
		}
	}
}

Game.prototype.destroyEnemy = function( e )
{
    Geometry.createExplosion( e[MESH].position );
    
    Animate.remove( e[MESH].anim );
    
    e.kill();
    
    var parent = e[MESH].parent;
    
    if (parent instanceof THREE.Scene)
    {
        
        parent.remove( e[MESH] );
        
    }
    else
    {
        
        log('ERROR: enemy parent is', parent, 'instead of scene.');
        
    }
    
};

Game.prototype.computeEnemyPaths = function()
{
    
    // For each enemy
    for (var id in this.enemies)
    {
        // If enemy exists
        if (this.enemies[id])
        {
            // Recompute enemy path
            this.arena.computeEnemyPath(this.enemies[id]);
        }
    }
    
};