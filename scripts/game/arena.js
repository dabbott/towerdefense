Arena = function(){

    // Dimensions of entire arena
    this.fullW = 24;
    this.fullH = 16;
    
    // Dimensions of buildable area
    this.w = 20;
    this.h = 10;
    
    // Coordinates stored as row, column
    // (0, 0) is at the top left
    for (var r = 0; r < this.h; r++)
    {
        
        // Rows
        this[r] = [];
        
        for (var c = 0; c < this.w; c++)
        {   
            this[r][c] = {
                tower : null,
                coord : [r, c]
            };
        }
        
    }
    
    this.full = [];
    for (var r = 0; r < this.fullH; r++)
    {
        
        // Rows
        this.full[r] = [];
        
        for (var c = 0; c < this.fullW; c++)
        {
            ref = this.fullToNormal([r, c]);
            if (ref != null)
            {
                this.full[r][c] = this[ref[0]][ref[1]];
            }
            else
            {
                this.full[r][c] = {
                    tower : ((r == 7 || r == 8) &&
                             (c == 0 || c == 1 || c == 22 || c == 23)) ? null : true
                };
            }
        }
        
    }
   
};

// Convert coordinates from the full arena to the buildable area
Arena.prototype.fullToNormal = function( coord ){
    
    var r = coord[0];
    var c = coord[1];
    
    if (r < 3 || r > 12 || c < 2 || c > 21)
    {
        return null;
    }

    return [r-3, c-2];
    
};

// Converts coordinates from the buildable area to the full arena
Arena.prototype.normalToFull = function ( coord ){
    
    return [coord[0]+3, coord[1]+2];
    
}

Arena.prototype.square = function( coord ){
   
    return this[coord[0]][coord[1]];
   
};

Arena.prototype.tower = function( coord ){
   
    return this.getSquare(coord).tower;
   
};

// aStar on the full arena. If this is slow we can do it on the smaller arena.
Arena.prototype.aStar = function( start, destination, test )
{
    // Normal case
    if (test == null)
    {
        return aStar(start, destination, this.full, this.fullH, this.fullW);
    }
    else // Test what would happen if a tower were added at square test
    {
        var tested = false;
        
        test = this.normalToFull(test);
        
        var square = this.full[test[0]][test[1]];
        
        // Temporarily alter the square
        if (square.tower == null)
        {
            tested = true;
            square.tower = true;
        }
        
        var result =  aStar(start, destination, this.full, this.fullH, this.fullW);
        
        // Restore square to null if it was tested
        if (tested)
        {
            square.tower = null;
        }
        
        return result;
    }
    
};

Arena.prototype.computeEnemyPath = function( enemy ) {
    
    if (! enemy)
    {
        for (var i = 0; i < this.enemies.length; i++) {
            
            this.enemies[i].setPath( this.aStar( this.enemies[i].next || START, DESTINATION ) );
            
        }
    }
    else
    {
        
        enemy.setPath( this.aStar( enemy.next || START, DESTINATION ) );
        
    }
    
};