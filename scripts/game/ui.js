UI = {};

UI.init = function( game )
{
	
	UI.game = game;
	UI.player = game.player;
	UI.status = "";
	
	Idle.add( UI.display );
	
	// Select gattling tower
	$( '.button' ).first().children().addClass( 'active' );
	
};

UI.updateInfo = function( title, value )
{
	
	$( '#' + title ).html( value );
	
};

UI.display = function ()
{

	UI.updateInfo( 'enemies', UI.game.numEnemies );
	UI.updateInfo( 'level', UI.game.level );
	UI.updateInfo( 'lives', UI.player.lives );
	UI.updateInfo( 'money', UI.player.money );
	
};

UI.showDialog = function( tower, x, y )
{
	
	var sell = $( '#sell' );
	sell.unbind( 'click' );
	sell.unbind( 'mouseenter mouseleave' );
	
	var upgrade = $( '#upgrade' );
	upgrade.unbind( 'click' );
	upgrade.unbind( 'mouseenter mouseleave' );
	
	var upgradeCost = tower.upgradeCost;
	var sellAmt = tower.sell;
	
	if (tower.canUpgrade())
	{
		
		// Set background
		upgrade.css( 'background-image',
							 'url("images/buttons/upgrade' + upgradeCost + '.jpg")');
		
		// Set mouseover function
		upgrade.hover(
			function()
			{
				$( '#upgrade' ).css( 'background-image',
									 'url("images/buttons/upgrade' + upgradeCost + 'hover.jpg")')
			},
			function()
			{
				
				$( '#upgrade' ).css( 'background-image',
									 'url("images/buttons/upgrade' + upgradeCost + '.jpg")')
			});
		
		// Upgrade click handler
		upgrade.click( function() {
		
			var hidden = $( '#dialog' ).css('display');

			if (hidden != 'none')
			{
				
				tower.upgrade();
				
				UI.hideDialog();
				
			}
			
			return false;
			
		});
	}
	else
	{
		
		// Set background to 'x'
		upgrade.css( 'background-image', 'url("images/buttons/x.jpg")');
		
	}
	
	// Set background
	sell.css( 'background-image',
					  'url("images/buttons/sell' + sellAmt + '.jpg")');
	
	// Set mouseover function
	sell.hover(
		function()
		{
			sell.css( 'background-image',
							  'url("images/buttons/sell' + sellAmt + 'hover.jpg")');
		},
		function()
		{
			
			sell.css( 'background-image',
							  'url("images/buttons/sell' + sellAmt + '.jpg")');
		});
	
	sell.click( function() {
		
		var hidden = $( '#dialog' ).css('display');

		if (hidden != 'none')
		{
			
			tower.player.sellTower( tower );
			
			Geometry.removeTower( tower );
			
			g.computeEnemyPaths();
			
			updatePath();
			
			UI.hideDialog();
			
		}
		
		return false;
		
	});
	
	var dialog = $( '#dialog' );
	
	dialog.css( 'top', x - 70 );
	dialog.css( 'left', y - 60 );
	
	dialog.css( 'display', 'block' );
};

UI.hideDialog = function()
{
	
	var dialog = $( '#dialog' );
	
	dialog.css( 'display', 'none' );
	
};

$( '.button' ).click( function( event ) {
	
	var button = $( this );
	
	var name = button.attr( 'id' );
	
	// Make sure only one button is active at a time
	$( '.button').children().removeClass('active');
	
	// Set this button to active
	button.children().addClass('active');
	
	UI.game.currentTower = name.toUpperCase();
	
	return false;
	
});