/**
 * Creates an instance of Tower
 *
 * @constructor
 * @this {Tower}
 * @param {player} player The owner of this tower.
 * @param {array} coord The coord of this tower in the arena.
 * @param {string} type The type of this tower.
 * @param {number} level The current level of this tower.
 */
Tower = function( player, coord, type, level ){
    
    // Add all default values to this tower instance
    _.defaults(this, TOWER[type][level]);
    
    this.player = player; // Reference to current player, though we might not need this
    this.type = type;
    this.level = level;
    this.coord = coord; // Coordinate on game board
    
    this.busy = 0;

};

Tower.prototype.canUpgrade = function()
{
    
    var max = TOWER[this.type].length;
    
    return (this.level < max - 1);
    
};

Tower.prototype.upgrade = function()
{
    
    if (this.canUpgrade())
    {
        
        this.level++;
        
        _.extend( this, TOWER[this.type][this.level] );
        
        Geometry.upgradeTower( this );
        
    }

};

// Default tower values
TOWER = {
    
    GATTLING : [
        {
            name : 'Gattling Tower',
            damage : 6,
            range : 180,
            cooldown : 1000, // Milliseconds?
            cost : 5,
            top : 'gattling',
            attack : 'gattling',
            upgradeCost : 3,
            sell : 3
        },
        {
            damage : 8,
            range : 200,
            cooldown : 1000,
            sell : 4
        },
        {
            damage : 10,
            range : 220,
            cooldown : 1000,
            sell : 6
        }
    ],
    
    MISSILE : [
        {
            damage : 70,
            range : 300,
            cooldown : 4000,
            cost : 15,
            top : 'missile',
            attack : 'missile',
            upgradeCost : 10,
            sell : 6
        },
        {
            damage : 40,
            //range : 300,
            cooldown : 500,
            sell : 10,
            top : 'missile2'
        }
    ],
    
    LASER : [
        {
            damage : 200,
            range : 250,
            cooldown : 3000,
            cost : 45,
            top : 'laser',
            attack : 'laser',
            upgradeCost : 10,
            sell : 6
        },
        {
            damage : 250,
            range : 250,
            cooldown : 2000,
            top : 'laser2',
            attack : 'laser',
            sell : 10
        }
    ]
    
};