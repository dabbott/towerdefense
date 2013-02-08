Geometry = {
    
    arena : null,
    
    scene : null, // Reference to scene.. set this manually
    
    _add : [],
    _remove : [],
    
    _geoms : {}

};

Geometry.load = function( filename, name, callback ) {
    
    name = name || filename;
    callback = callback || log;
    
    var scope = this;
    
    Loader.load( filename, function(obj) {
        
        scope.set( name, obj );
        
        callback( obj );
        
    });
    
};

Geometry.set = function( name, geom ) {
    
    if (this._geoms[name])
    {
        log( 'This geometry already exists in the geoms list', name, geom );
    }
    
    this._geoms[name] = geom;
    
    return geom;
    
};

Geometry.get = function( name ) {
    
    return this._geoms[name];
    
};

Geometry.add = function( mesh ){
    
    this._add.push( mesh );
    
};

Geometry.remove = function( mesh ){
    
    this._remove.push( mesh );
    
};

Geometry.updateScene = function(){
    
    var add = this._add;
    var remove = this._remove;
    
    for (var i = 0; i < remove.length; i++)
    {
        this.scene.remove( remove[i] );
    }
    
    remove.length = 0;
    
    for (var i = 0; i < add.length; i++)
    {
        this.scene.add( add[i] );
    }
    
    add.length = 0;
    
};

Geometry.getSquarePosition = function( coord ) {
    
    var r = coord[0];
    var c = coord[1];
    
    return new THREE.Vector3( c * S_W, r * S_W, 0 );
    
};

Geometry.addEnemy = function( enemy ) {
    
    //var geom = Geometry.get( enemy.geometry );
    //var mat = Material.get( enemy.material );
    //var mesh = new THREE.Mesh( geom, mat );
    
    var mesh = Loader.get( enemy.model );
    
    mesh.anim = Animate.add( mesh.children[1], {
        'normal' : new Keyframe(0, 39, 1)
    });
    
    mesh.position = this.getSquarePosition( [7, 0] );
    mesh.position.z = S_W / 2;
    
    Geometry.scene.add( mesh );
    
    return mesh;
    
};

Geometry.applyDamage = function( arena, enemies, towers, delta )
{
    
    //var h = [];
    //
    //for (var id in enemies )
    //{
    //        
    //    var enemy = enemies[id];
    //    
    //    h.push( id );
    //    h.push( Math.floor( enemy.health ));
    //    
    //}
    //
    //log( h );
    
    for (var id in towers)
    {
        
        var tower = towers[id];
        
        tower.busy = Math.max(tower.busy - delta, 0);
         
        if (tower.busy > 0)
        {
            
            if ('laser' == tower.attack && tower.laser)
            {
                
                var laser = tower.laser;
                
                if ( (laser.duration > 0) && (laser.enemy.health > 0) )
                {
                    
                    Geometry.scene.remove( laser.line );
                    
                    laser.line = Geometry.createLightning( laser.source, laser.target );
                    laser.line.position = laser.source;
                    
                    Geometry.scene.add(laser.line);
                    
                    laser.enemy.damage( laser.damage * delta );
                    //log(tower.id, laser.duration, laser.enemy.health, laser.enemy.id, laser.damage);
                    
                    laser.duration -= delta;
                    
                }
                else
                {
                    
                    if (tower.sound)
                    {
                        
                        LASER_SOUND_ON = false;
                        
                        tower.sound.pause();
                        
                        tower.sound = null;
                        
                    }
                    
                    Geometry.scene.remove(laser.line);
                    
                    tower.laser = null;
                    
                }
                
                
                
            }
                
            continue;
        
        }
            
        for (var id in enemies )
        {
                
            var enemy = enemies[id];
            
            if (! enemy)
            {
                continue;
            }
            
            var coord = arena.normalToFull( tower.coord );
            
            var t = new THREE.Vector2( coord[1] * S_W,
                                       coord[0] * S_W);
            
            var e = new THREE.Vector2( enemy[MESH].position.x,
                                       enemy[MESH].position.y);
            
            var dist = e.distanceTo( t );
            
            // Minimum distance is (usually) 60, the size of a square.
            if (dist < tower.range)
            {
                
                if ('gattling' == tower.attack)
                {
                    
                    var dir = new THREE.Vector2( t.x - e.x, t.y - e.y );
                    dir.normalize();
                    
                    if (tower[TOP])
                    {
                        
                        SoundPlayer.play( 'gattling.ogg' );
                        
                        var theta = Math.atan( dir.y / dir.x );
                        
                        if (dir.x < 0)
                        {
                            
                            theta -= PI;
                            
                        }
                        
                        tower[TOP].rotation.z = theta;
                        
                        var blast = Loader.get( 'blast' );
                        
                        blast.position.x = t.x - dir.x * 45;
                        blast.position.y = t.y - dir.y * 45;
                        blast.rotation.z = theta;
                        
                        BLASTS.add( blast );
                        
                        enemy.damage( tower.damage );
                        
                    }
                    
                }
                else if ('missile' == tower.attack)
                {
                    
                    var dir = new THREE.Vector2( t.x - e.x, t.y - e.y );
                    dir.normalize();
                    
                    if (tower[TOP])
                    {
                        
                        var theta = Math.atan( dir.y / dir.x );
                        
                        if (dir.x < 0)
                        {
                            
                            theta -= PI;
                            
                        }
                        
                        tower[TOP].rotation.z = theta;
                        
                        SoundPlayer.play( 'missile.ogg' );
                        
                        Geometry.createProjectile( arena, tower, enemy );  
                        
                    }
                    
                }
                else if ('laser' == tower.attack)
                {
                    
                    var coord = arena.normalToFull( tower.coord );
                    var source = new THREE.Vector3( coord[1] * S_W, coord[0] * S_W, 80 );
                    
                    var target = enemy[MESH].position;
                    
                    var line = Geometry.createLightning( source, target );
                    line.position = source;
                    
                    var duration = 500;
                    var damage = tower.damage / duration;
                    
                    tower.laser = {
                        enemy : enemy,
                        line : line,
                        source : source,
                        target : target,
                        duration : duration,
                        damage: damage
                    };
                    
                    
                    
                    if ( (! MUTE) && (! LASER_SOUND_ON))
                    {
                        
                        LASER_SOUND_ON = true;
                        
                        var sound = new Audio( "sounds/laser.ogg" );
                        
                        sound.play();
                        
                        tower.sound = sound;
                        
                    }
                    
                    Geometry.scene.add( line );
                    
                }
                
                tower.busy = tower.cooldown;
                
                break;
                
            }
            
        }
        
    }
    
};

Geometry.createProjectile = function( arena, tower, enemy )
{
    
    var f;
    
    var speed = 0.2;
    
    var damage = tower.damage;

    // Tower location
    var coord = arena.normalToFull( tower.coord );
    var source = new THREE.Vector2( coord[1] * S_W, coord[0] * S_W );
    
    // Projectile object
    var proj = Loader.get( 'torpedo' );
    
    proj.position.x = source.x;
    proj.position.y = source.y;
    
    Geometry.scene.add( proj );
    
    f = Idle.add( function( delta )
    {
        
        var source = proj.position;
        var target = enemy[MESH].position;
        
        // Vector between enemy and projectile
        var path = new THREE.Vector3().sub(target, source);
        path.z = 0;

        // Vector to travel
        var dist = path.clone().normalize().multiplyScalar( speed * delta );
        
        // Rotate projectile
        var theta = Math.atan( dist.y / dist.x );
        
        if (dist.x > 0)
        {
            theta -= PI;
        }
        
        proj.rotation.z = theta;
        
        // If the target is dead, or if the projectile has reached the target
        if ( enemy.health <= 0 ||
            ( path.length() <= dist.length() ) ||
            ( path.length() <= 12 ))
        {
            
            // Remove the projectile and deal damage
            Geometry.createExplosion( target );
            Geometry.scene.remove( proj );
            Idle.remove( f );
            enemy.damage( damage );
            
            SoundPlayer.play( 'explosion.ogg' );
            
        }
        else
        {
            
            proj.position.x += dist.x;
            proj.position.y += dist.y;
            
        }
        
    });
    
    // Start the missile near the tip of the turret
    Idle.functions[f]( 180 );
    
};

Geometry.createLightning = function( source, target )
{
    
    var displacement = 3;
    var nDivs = 14 + Math.floor(Math.random() * 10);
    var nSubs = 3;
    
    var line_material = new THREE.LineBasicMaterial( { color: (0xaaaaaa + 0x55 * Math.random()), opacity: 1 } ),
    geometry = new THREE.Geometry();
    
    var i = new THREE.Vector2( source.x, source.y );
    var f = new THREE.Vector2( target.x, target.y );
    
    dir = new THREE.Vector2();
    dir.sub(f, i).normalize();

    var n1 = new THREE.Vector2(-dir.y, dir.x);
    var n2 = new THREE.Vector2(dir.y, -dir.x);
    
    var dist = i.distanceTo( f );
    
    var div = dist / nDivs;
    var sub = div / nSubs;
    
    var zdist = target.z - source.z;
    var zdiv = zdist / nDivs;
    var zsub = zdiv / nSubs;
    
    for (var i = 0; i < nDivs; i++)
    {
        
        var p = [];
        var v = [];
        var z = [];
        
        for (var j = 0; j < nSubs + 1; j++)
        {
            p[j] = i * div + j * sub;
            z[j] = i * zdiv + j * zsub;
            v[j] = new THREE.Vector2( p[j] * dir.x, p[j] * dir.y );
        }

        var r1 = Math.pow(Math.random() * displacement, 2);
        var r2 = Math.pow(Math.random() * displacement, 2);
    
        v[1].addSelf( n1.clone().multiplyScalar(r1) );
        v[2].addSelf( n2.clone().multiplyScalar(r2) );
        
        for (var j = 0; j < nSubs; j++)
        {
            geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( v[j].x , v[j].y , z[j] ) ) );
            geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( v[j+1].x , v[j+1].y , z[j+1] ) ) );
        }

    }
    
    var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
    
    return line;
    
};

Geometry.createExplosion = function ( vec ) {
    
    var source = vec.clone();
    
    var numParticles = 100;
    var particles = new THREE.Geometry(); 
    var particleMaterial = new THREE.ParticleBasicMaterial({
        //color: 0xFF2255,
        size: 5,
        map: THREE.ImageUtils.loadTexture(
            "images/textures/particle.png"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.5
        
    });
    
    // Cube is 60 x 60 x 60
    var maxDist = 120;
    
    var sX = source.x;
    var sY = source.y;
    var sZ = source.z;
    
    // Create the particles
    for (var i = 0; i < numParticles; i++)
    {
        
        // Create at the source position
        var particle = new THREE.Vertex(new THREE.Vector3(sX, sY, sZ));
        
        // Generate a random velocity
        var range = 1.0;
        var offset = 0.5;
        var vX = Math.random() * range - offset;
        var vY = Math.random() * range - offset;
        var vZ = Math.random() * range - offset;
        
        particle.velocity = new THREE.Vector3(vX, vY, vZ);
        
        particles.vertices.push(particle);
        
    }
    
    var particleSystem = new THREE.ParticleSystem(particles, particleMaterial);
    particleSystem.sortParticles = true;
    Geometry.scene.add(particleSystem);
    
    // Create the idle function
    var f = Idle.add( function ( delta ) {
        
        delta /= 16;
        
        for (var i = 0; i < numParticles; i++)
        {
            var particle = particles.vertices[i];
            
            // Check to see if the particle has traveled far enough
            var dist = particle.position.distanceTo( source );
            if (dist > maxDist)
            {
                // Remove the particle system
                Geometry.scene.remove(particleSystem);
                Idle.remove(f);
                return;
            }
            
            // Update the position
            particle.position.addSelf( particle.velocity.clone().multiplyScalar( delta ) );
        }
        
        particleSystem.geometry.__dirtyVertices = true;
        
        particleMaterial.opacity -= 0.01 * delta;
        
    });
    
};

Geometry.moveEnemies = function( enemies, delta ) {

    // For each enemy
    for (var id in enemies )
    {

        var e = enemies[id];
        
        // If this enemy has not reached the end it has a mesh and a path
        if (e.finished || ! (e[MESH] && e.next))
        {
            continue;
        }
    	
        // Calculate the distance to move
        var dist = e.speed * delta / 100;
        
        while (dist > 0 )
        {
            var mesh = e[MESH];
            var adv = true;
            var newPos;
            
            // Destination in world coordinates
            var dest = [e.next[1] * S_W, e.next[0] * S_W];
            
            // Traveling right
            if (mesh.position.x < dest[0])
            {
                
                mesh.rotation.z = PI / 2;
                
                newPos = mesh.position.x + dist;
                
                // If we overshot the distance
                if (newPos > dest[0])
                {
                    mesh.position.x = dest[0];
                    dist = newPos - dest[0];
                    adv = e.advance();
                }
                else
                {
                    mesh.position.x = newPos;
                    dist = 0;
                }
            }
            else if (mesh.position.x > dest[0])
            {
                
                mesh.rotation.z = 3 * PI / 2;
                
                newPos = mesh.position.x - dist;
                
                // If we overshot the distance
                if (newPos < dest[0])
                {
                    mesh.position.x = dest[0];
                    dist = dest[0] - newPos;
                    adv = e.advance();
                }
                else
                {
                    mesh.position.x = newPos;
                    dist = 0;
                }
            }
            else if (mesh.position.y < dest[1])
            {
                
                mesh.rotation.z = PI;
                
                newPos = mesh.position.y + dist;
                
                // If we overshot the distance
                if (newPos > dest[1])
                {
                    mesh.position.y = dest[1];
                    dist = newPos - dest[1];
                    adv = e.advance();
                }
                else
                {
                    mesh.position.y = newPos;
                    dist = 0;
                }
            }
            else if (mesh.position.y > dest[1])
            {
                
                mesh.rotation.z = 0;
                
                newPos = mesh.position.y - dist;
                
                // If we overshot the distance
                if (newPos < dest[1])
                {
                    mesh.position.y = dest[1];
                    dist = dest[1] - newPos;
                    adv = e.advance();
                }
                else
                {
                    mesh.position.y = newPos;
                    dist = 0;
                }
            }
            else
            {
                adv = e.advance();
            }
            
            if (! adv)
            {
                break;
            }
        } // end while
    };// end for

};

Geometry.createArenaGeometry = function( arena ){

    this.arena = [];

    for (var r = 0; r < arena.fullH; r++)
    {
        this.arena[r] = [];
        
        for (var c = 0; c < arena.fullW; c++)
        {
            var position = new THREE.Vector3(S_W * c, S_W * r, 0);
            var material = new THREE.MeshBasicMaterial({
                color: 0x003300
            });
            
            if (! arena.fullToNormal([r, c]))
            {
                material.opacity = 0;
            }
            
            var geom = new THREE.CubeGeometry(S_W, S_W, 0.001, 1, 1, 1);
            var square = new THREE.Mesh(geom, material);
            square.position = position;
            
            //var squareModel = Loader.get( 'square' );
            //squareModel.position = position.clone();
            //Geometry.scene.add( squareModel );
            
            // Location in game... null if outside buildable area
            square.coord = arena.fullToNormal([r, c]);
            square.fullCoord = [r, c];
            
            this.arena[r][c] = square;
        }
    }
    
};

Geometry.addTower = function( arena, coord /* normal */ ){
    
    var w = S_W;
    var fcoord = arena.normalToFull( coord );
    
    var position = new THREE.Vector3( w * fcoord[1], w * fcoord[0], 0 );
    
    var tower = arena.square( coord ).tower;
    
    var obj = new THREE.Object3D();
    
    var base = Loader.get( 'base' );
    var top = Loader.get( tower.top );
    
    obj.add( base );
    obj.add( top );
    
    obj.position.x = position.x;
    obj.position.y = position.y;
    
    tower[MESH] = obj;
    tower[TOP] = top;
    
    // TODO Does this do anything?
    //this.arena[fcoord[0]][fcoord[1]].tower = obj
    
    this.add( obj );
    
};

Geometry.upgradeTower = function( tower )
{
    
    var rotation = tower[TOP].rotation.clone();
    
    tower[MESH].remove( tower[TOP] );
    
    tower[TOP] = Loader.get( tower.top );
    
    tower[MESH].add( tower[TOP] );
    
    tower[TOP].rotation = rotation;
    
};

Geometry.removeTower = function( tower )
{
  
    this.remove( tower[MESH] );
    
    //this.arena[fcoord[0]][fcoord[1]].tower = null;
    
};

Geometry.set('x-wall', new THREE.PlaneGeometry(A_W, A_H / 2, 1, 1));
Geometry.get('x-wall').w = A_W;
Geometry.get('x-wall').h = A_H / 2;

Geometry.set('y-wall', new THREE.PlaneGeometry(A_H, A_H / 2, 1, 1));
Geometry.get('y-wall').w = A_H;
Geometry.get('y-wall').h = A_H / 2;

Geometry.set( 'cube', new THREE.CubeGeometry(S_W, S_W, S_W * 2, 1, 1, 1));

Geometry.set( 'sphere', new THREE.SphereGeometry(29, 10, 10) );

Geometry.set( 'robot', new THREE.CubeGeometry(S_W, S_W, S_W, 1, 1, 1));

Geometry.set( 'robotsmall', new THREE.CubeGeometry(30, 30, 30, 1, 1, 1));

