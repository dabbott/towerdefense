Modernizr.load([
	{
		load : ["scripts/lib/jquery-1.6.4.js",
				"scripts/lib/underscore.js",
				"scripts/lib/aStar.js"]
	},
	{
		test : Modernizr.webgl,
		yep  : ["scripts/lib/Three.js",
				"scripts/lib/RequestAnimationFrame.js"],
		callback : function( testResult, key, index ) {
			if (index === "1" && !testResult)
			{
				fail();
			}
		}
	},
	{
		load : ["scripts/sound.js",
				
				"scripts/game/utils.js",
				"scripts/game/arena.js",
				"scripts/game/tower.js",
				"scripts/game/player.js",
				"scripts/game/enemy.js",
				"scripts/game/game.js",
				"scripts/game/ui.js",
				
				"scripts/gl/animate.js",
				"scripts/gl/geometry.js",
				"scripts/gl/loader.js",
				"scripts/gl/material.js",
				"scripts/gl/generate.js",
				"scripts/gl/idle.js"],
		
		complete : function() {
			startGame();
		}
	}
]);

function startGame(){
	
	g = new Game();
	
	ready();
	
};

function fail() {

	//$(".test").html("Your browser doesn't seem to support WebGL...");

};

function loading()
{

	UI.updateInfo( 'text', 'Loaded ' + NUM_LOADED + ' of ' + NUM_TO_LOAD + ' models...');
	
	if (NUM_LOADED == NUM_TO_LOAD)
	{
		
		LOADED = true;
		
		UI.updateInfo( 'text', "Press 's' to start the game.");
		
	}

}

function ready() {
	
	objects = [];
	
	init();
	animate();
	
	$( '#dialog' ).click( function() {
		
		UI.hideDialog();
		
		return false;
		
	});
	
	// Click handler
	$( 'canvas' ).mousedown(function(event) {
		switch (event.which) {
			case 1: // Left button
				
				UI.hideDialog();
				
				SELECTED_SQUARE = CURRENT_SQUARE;
				
				if (SELECTED_SQUARE)
				{
					
					var tower = g.arena.square( SELECTED_SQUARE ).tower;
					
					if (tower)
					{
						
						UI.showDialog( tower, mouse.y, mouse.x );
						
					}
					else if (g.currentTower &&
							 g.arena.aStar(START, DESTINATION, SELECTED_SQUARE).length > 0)
					{
						
						var tower = g.player.buildTower( SELECTED_SQUARE, g.currentTower )
						
						geometry.addTower( g.arena, SELECTED_SQUARE );
						
						updatePath();
						
						g.computeEnemyPaths();
						
					}
					
					SELECTED_SQUARE = null;
					
				}

				break;
			case 2: // Middle button
				break;
			case 3: // Right button
				UI.hideDialog();
				break;
		}
		
	});
	
	// Keypress handler
	$(document).keydown( function( event ) {
		switch(event.which)
		{
			case 27: // Escape
			    UI.hideDialog();
				break;
			case 37: // Key left
			    //if (camera.position.x > -60)
				    camera.position.x -= S_W / 2;
				break;
			case 39: // Key right
			    //if (camera.position.x < 1400)
				    camera.position.x += S_W / 2;
				break;
			case 38: // Key up
                //if (camera.position.y < 800)
                    camera.position.y += S_W / 2;
				break;
			case 40: // Key down
                //if (camera.position.y > 0)
                    camera.position.y -= S_W / 2;
				break;
			case 73: // 'i' - Zoom in
			    //if (camera.position.z > 100) // don't wan't to zoom past plane
				    camera.position.z /= 1.4; //-= SQUARE_WIDTH;
				break;
			case 79: // 'o' - Zoom out
			    //if (camera.position.z < 1400)
				    camera.position.z *= 1.4; //+= SQUARE_WIDTH;
				break;
			case 77: // 'm' - Mute
			    MUTE = ! MUTE;
				break;
			case 84: // 't' - Pause/play theme
			    if ( theme.paused )
				{
					theme.play();
				}
				else
				{
					theme.pause();
				}
				break;
			case 80: // 'p' - Pause game
                PAUSED = ! PAUSED;
    			break;
			case 82: // 'R' - Reset camera
                resetCameraPosition(camera);
    			break;
			case 83: // 's' - Start game
				g.startGame();
				$( '#status' ).fadeOut( 1000 );
				break;

			case 88: // 'x'
                if (OBJ)
				{
					OBJ.rotation.x += PI / 2;
				}
    			break;
			case 89: // 'y'
                if (OBJ)
				{
					OBJ.rotation.y += PI / 2;
				}
    			break;
			case 90: // 'z'
                if (OBJ)
				{
					OBJ.rotation.z += PI / 2;
				}
    			break;
			case 72: // 'h'
				HELP_HIDDEN = ! HELP_HIDDEN;
				
				if (HELP_HIDDEN)
				{
					$( '#keys' ).fadeOut( 1000 );
					$( '#how' ).fadeOut( 1000 );
				}
				else
				{
					$( '#keys' ).fadeIn( 1000 );
					$( '#how' ).fadeIn( 1000 );
				}
			default:
		}
		
		// User pressed a number key. Adjust speed.
		if (event.which >= 49 && event.which <= 57)
		{
			
			SPEED = event.which - 48;
			
			log( 'SPEED', SPEED );
			
		}
		
		if (!_.isNull(DEBUG))
		{
			log(event.which);
		}
	});
	
	function resetCameraPosition(camera) {
		
		camera.rotation.x = 0.27;
	    camera.position.x = g.arena.fullW/2 * S_W;
		camera.position.y = ( g.arena.fullH/2 * S_W ) * Math.sin( camera.rotation.x ) ;
		camera.position.z = 700;
		
		camera.rotation.x = 0;
		camera.position.x = g.arena.fullW/2 * S_W - S_W/2
		camera.position.y = ( g.arena.fullH/2 * S_W ) - S_W/2;
		
	}
	
	function init() {
		
		theme = new Audio( 'sounds/theme.ogg' );
		$(theme).attr( 'loop', 'loop' );
		theme.play();
		
		container = document.createElement('div');
		document.body.appendChild(container);
				
		camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
		resetCameraPosition( camera );

		scene = new THREE.Scene();
		scene.add(camera);
		
		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		
		container.appendChild( renderer.domElement );
		
		mouse2d = new THREE.Vector3(0, 0, 1);
		mouse = new THREE.Vector2(0, 0);
	
		$(renderer.domElement).mousemove(function(event) {
			event.preventDefault();
			
			mouse.x = event.clientX;
			mouse.y = event.clientY;
			
			mouse2d.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse2d.y = -(event.clientY / window.innerHeight) * 2 + 1;
			mouse2d.z = 0.5;
		})
		
		CUBES = [];
		
		ASTAR = [];
		
		// Add arena geometry to scene
		geometry = Geometry;
		Geometry.scene = scene;
		geometry.createArenaGeometry( g.arena );
		
		for (var r = 0; r < geometry.arena.length; r++)
		{
			for (var c = 0; c < geometry.arena[r].length; c++)
			{

				var square = geometry.arena[r][c];
				
				scene.add(square);
				
				//THREE.Collisions.colliders.push(square.collider);
				
				CUBES.push(square);
				
				square.material.wireframe = true;
			}
		}
		
		updatePath();
		
		window.onresize = function(){
			
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
			
            renderer.setSize( window.innerWidth, window.innerHeight );
			
        }
		
		pointLight = new THREE.PointLight( 0x3f2fd8, 4 );
		pointLight.position.set( CENTER.x, CENTER.y, 1000 );
		scene.add( pointLight );
		
		pointLight2 = new THREE.PointLight( 0xff2fd8, 1 );
		pointLight2.position.set( CENTER.x, CENTER.y, 500 );
		scene.add( pointLight2 );
		
		Idle.add( function( delta ) {
			
			var time = new Date().getTime();

			pointLight.position.x = Math.sin( time * 0.0004 ) * CENTER.x * 2;
			pointLight.position.y = Math.cos( time * 0.0004 ) * CENTER.y * 2;
			
			pointLight2.position.x = - Math.cos( time * 0.0003 ) * CENTER.x;
			pointLight2.position.y = Math.sin( time * 0.0003 ) * CENTER.y;
			
		});
		
		Loader.load( 'base', 'models/gattling/base.dae', function colladaReady( collada ) {
			
			var dae = collada.scene;
			
			dae.scale.x = dae.scale.y = dae.scale.z = 20;
			
			dae.position.z = S_W / 2;
			
		});
		
		Loader.load( 'gattling', 'models/gattling/gattling.dae', function colladaReady( collada ) {
			
			var dae = collada.scene;
			
			dae.scale.x = dae.scale.y = dae.scale.z = 20;
			
			dae.position.z = S_W / 2 + 10;
			
		});
		
		Loader.load( 'laser', 'models/laser/laser.dae', function colladaReady( collada ) {
			var dae = collada.scene;
			dae.scale.x = dae.scale.y = dae.scale.z = 1.2;	
			dae.rotation.z = PI / 4;			
			dae.position.z = 58;
		});
		
		Loader.load( 'laser2', 'models/laser/laser2.dae', function colladaReady( collada ) {
			var dae = collada.scene;
			dae.scale.x = dae.scale.y = dae.scale.z = 1.2;	
			dae.rotation.z = PI / 4;			
			dae.position.z = 58;
		});
		
		Loader.load( 'missile', 'models/missile/missile.dae', function colladaReady( collada ) {
			var dae = collada.scene;
			dae.position.z = 58;
		});
		
		Loader.load( 'missile2', 'models/missile/missile2.dae', function colladaReady( collada ) {
			var dae = collada.scene;
			dae.position.z = 58;
		});
		
		Loader.load( 'torpedo', 'models/torpedo.dae', function colladaReady( collada ) {
			
			var dae = collada.scene;
			
			dae.scale.x = 2;
			
			dae.scale.y = 1;
			dae.scale.z = 1;
			
			dae.position.z = S_W / 2 + 20;
			
		});
		
		Loader.load( 'blast', 'models/blast/blast.dae', function colladaReady( collada ) {
			
			var dae = collada.scene;
			
			dae.position.z = 58;
			
			dae.children[1].material.transparent = true;
			
		});
		
		
		BLASTS = new THREE.Object3D();
		
		BLASTS.empty = function()
		{
			
			for (var i = 0; i < BLASTS.children.length; i++)
			{
				
				BLASTS.remove( BLASTS.children[i] );
				
			}
			
		}
		
		scene.add( BLASTS );
		
		Loader.load( 'spider', 'models/spider/spider.dae', function colladaReady( collada ) {
			
			var dae = collada.scene;
			
			dae.scale.x = dae.scale.y = dae.scale.z = 0.6;
			
		});
		

		
		// Idle loop setup
		
		var time = new Date();
		elapsed = time.getTime();
		
		Idle.add( render );
		
		Idle.add( Animate.run );
		
		Idle.add( function( delta ) {
			
			Geometry.moveEnemies( g.enemies, delta );
			
		});
		
		Idle.add( function( delta ) {
			
			BLASTS.empty(); // Ugly, but couldn't get it working a better way.
			
			Geometry.applyDamage( g.arena, g.enemies, g.player.towers, delta );
			
		});
		
		Idle.add( SoundPlayer.run );
		
		projector = new THREE.Projector();
		
		UI.init( g );
		
	}
	
	function animate( time ) {
		
		requestAnimationFrame( animate );
		
		var delta = Math.min( time - elapsed, 60 );
		elapsed = time;
		
		if ( ! _.isNaN(delta) && LOADED )
		{
			
			if (! PAUSED)
			{
				Idle.run( delta * SPEED );
			}
			else if (PAUSED)
			{
				render();
			}
			
		}
		else
		{
			loading();
		}
		
	};
	
	function render( time ) {
		
		geometry.updateScene();
		
		var vector = mouse2d.clone();
		projector.unprojectVector( vector, camera );

		var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

		var intersects = ray.intersectObjects( CUBES );
		
		for (var i = 0; i < CUBES.length; i++)
		{
			// This square is selected, so do nothing
			if (CUBES[i].coord && SELECTED_SQUARE &&
				( CUBES[i].coord[0] == SELECTED_SQUARE[0] ) &&
				( CUBES[i].coord[1] == SELECTED_SQUARE[1] ))
			{
			}
			// Reset colors of all other squares
			else
			{
				var mat = CUBES[i].material;
				mat.color.setHex(COLORS.grid);
				mat.wireframe = true;
			}
		}
		
		// Color raycast hits
		if (intersects.length > 0) {
			for (var i = 0; i < intersects.length; i++) {
				
				var square = intersects[i].object;
				
				CURRENT_SQUARE = square.coord;
				
				var mat = square.material;
				
				mat.wireframe = false;
				
				// If you can build here, green, else red
				// TODO: Don't allow blocking enemies
				var color;
				if (CURRENT_SQUARE &&
					g.arena.aStar(START, DESTINATION, CURRENT_SQUARE).length > 0)
				{
					color = COLORS.select;
				}
				else
				{
					color = COLORS.red;
				}
				mat.color.setHex(color)
			}
		}
		else
		{
			CURRENT_SQUARE = null;
		}
		
		renderer.render( scene, camera );
		
	}
	
};

// TODO, Clearly not the proper place for this, but it is used by UI class also
function updatePath() {
	ASTAR.length = 0;
	var list = g.arena.aStar(START, DESTINATION);
	for (var i = 0; i < list.length; i++)
	{
		ASTAR.push(list[i]);
	}
	if (DEBUG)
	{
		log(ASTAR);
	}
}