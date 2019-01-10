/** 
 * Cargo ship, transport resources from port to port.
 *
 * @author Matthew Page <work@mjp.co>
 * @extends Sprite
 * @property {number} worldX - The X position in the world
 * @property {number} worldY - The Y position in the world
 * @property {number} discoveryDistance - How far into the world can you see (world map)
 * @property {Port} dockedAt - If we are in dock the Port instance
 * @property {ResourceContainer} resources - Our resources (gold, wood etC)
 */
class CargoShip extends Sprite {
	constructor(game, world, worldMap, id) {
		/* Sprite(game, id, posX, posY, width, height, velocity, direction, hitPoints) */
		super(game, id, game.width/2-(48/2), game.height/2-(91/2), 48, 91, 3, 90, 25);
		
		this.world = world;
		this.worldMap = worldMap;
		this.makeDomElement('player1');
		this.domElement = document.getElementById(id);
		this.dockedAt = false;
		this.resources = new ResourceContainer(this);
		this.resources.add('gold', Math.floor(Math.random()*500));
		this.resources.add('wood', Math.floor(Math.random()*500));
		this.resources.add('gunpowder', Math.floor(Math.random()*500));
		
		this.direction = Math.floor(Math.random()*360);
		
		/* Start in the middle of the map (hope it's water) */
		this.worldX = 200+Math.floor(this.world.width/2)*this.world.blockSize;
		this.worldY = Math.floor(this.world.height/2)*this.world.blockSize;
		
		this.destination = false;
		this.pickRandomDestination();
		
		this.courseCorrection = false;
		this.courseCorrectionDuration = 0;

		this.lightSource = new LightSource(25);
		
		this.headForDestination();
		
				//console.log(this);
	}
	/**
	 * Pick random destination port
	 *
	 */
	pickRandomDestination() {
		this.destination = this.world.ports[Math.floor(Math.random()*this.world.ports.length)];
		this.headForDestination();
	}
	/**
	 * Head for destination - turn towards the destination port
	 *
	 */
	headForDestination() {
		
/*
		function calcAngleDegrees(x, y) {
  let b = Math.atan2(y, x) * 180 / Math.PI + 90;
  if(b<0) b=360+b;
  return b;
}
		
		*/
		
  		let b = Math.atan2(this.destination.gridY-this.gridY, this.destination.gridX-this.gridX) * 180 / Math.PI + 90;
		  if(b<0) b=360+b;
		this.direction = b;

	/*
		
		lng - x
		lat - y
		
        let dLon = (this.destination.gridX-this.gridX);
        let y = Math.sin(dLon) * Math.cos(this.destination.gridY);
        let x = Math.cos(this.gridY)*Math.sin(this.destination.gridY) - Math.sin(this.gridY)*Math.cos(this.destination.gridY)*Math.cos(dLon);
        let brng = (Math.atan2(y, x))* 180 / Math.PI;
		let b = 360 - ((brng + 360) % 360);
		b -= 270;
		if(b<0) b=360+b;
        this.direction = b;*/
//		console.log(`Heading ${b}`);
   /*       var dLon = (lng2-lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        var brng = this._toDeg(Math.atan2(y, x));
        return 360 - ((brng + 360) % 360); */
		
	}
	/**
	 * Get the grid X position 
	 */
	get gridX() {
		return Math.floor(this.worldX / this.world.blockSize);	
	}
	/**
	 * Get the grid Y position 
	 */
	get gridY() {
		return Math.floor(this.worldY / this.world.blockSize);	
	}
	/**
	 * Dock at port - called from the update collision detection
	 *
	 * @method dockAtPort
	 * @param {number} gridX - The world grid x position
	 * @param {number} gridY - The world grid y position
	 */
	dockAtPort(gridX, gridY) {
		/* get the port */
		this.world.ports.forEach( (port) => {
			if(port.gridX == gridX && port.gridY == gridY) {
				this.dockedAt = port;
				let a = document.getElementById('portDockScreen');
				/* Show the port welcome screen */
				a.style.display = 'block';
				a.innerHTML = port.htmlWelcome;
				return true;
			}
		});
	}
	/**
	 * Set sail from a port, hide the port welcome screen
	 *
	 * @method leavePort
	 */
	leavePort() {
		this.dockedAt = false;
		let a = document.getElementById('portDockScreen');
		a.style.display = 'none';
		this.direction += 180;
		if(this.direction > 359) this.direction = this.direction-360;
		return true;	
	}
	/**
	 * Get the keydown and keyup from the main script calls
	 *
	 * @method receiveCommand
	 * @param {string} type - Keydown or Keydown
	 * @param {string} command - Right, Left, Up or Fire
	 */
	receiveCommand(type, command) {	
		if(type=='keydown') {
			if(command=='right') {
				this.keyRight = true;
				this.keyLeft = false;
			}
			if(command=='left') {
				this.keyRight = false;
				this.keyLeft = true;
			}
			if(command=='up') {
				this.keyMove = true;
			}
			if(command=='fire') return true;
		}
		else if(type=='keyup') {
			if(command=='right') {
				this.keyRight = false;
			}
			if(command=='left') {
				this.keyLeft = false;
			}
			if(command=='up') {
				this.keyMove = false;
			}
		}
	}
	/**
	 * Main update loop, redraw the sprite, discover new areas of the map
	 *
	 * @method update
	 */
	update() {
		if(this.isActive) {
			this.move();
			this.draw();
			this.domElement.style.transform = "rotate("+this.direction+"deg)";
			this.worldMap.discoverCirlceGrid(Math.floor(this.worldX/this.world.blockSize), 
											 Math.floor(this.worldY/this.world.blockSize), this.discoveryDistance);
		}
	}
	draw() {
		if(this.isActive) {
			//this.domElement.style.left = `${Math.round(this.posX)}px`;
			//this.domElement.style.top = `${Math.round(this.posY)}px`;
			this.domElement.style.width = `${Math.round(this.width)}px`;
			this.domElement.style.height = `${Math.round(this.height)}px`;
		}
	}
	/**
	 * Overide Sprite default move() method, base movement on the current keyState
	 * Store the new location after moving, then check the block you are moving
	 * into is Ocean - collision detection
	 *
	 * Note. Doesn't actually move the ship sprite, but moves the position the world.
	 * Player ship always remains in the center of the screen
	 *
	 * @method move
	 */
	move() {

		if(this.courseCorrection) {
			this.courseCorrectionDuration -= 1;
			if(this.courseCorrectionDuration<1) {
				this.headForDestination();
				this.courseCorrection = false;
			}
		}

		let worldX = this.worldX;
		let worldY = this.worldY;

		/* Do the movement calculation */
		if(this.direction >= 0 && this.direction <= 90) {
			worldX += this.velocity * Math.sin(this.direction*Math.PI/180);
			worldY -= this.velocity * Math.cos(this.direction*Math.PI/180);
		} else if(this.direction > 90 && this.direction <= 180) {
			worldX += this.velocity * Math.cos((this.direction-90)*Math.PI/180);
			worldY += this.velocity * Math.sin((this.direction-90)*Math.PI/180);
		} else if(this.direction > 180 && this.direction <= 270) {
			worldX -= this.velocity * Math.sin((this.direction-180)*Math.PI/180);
			worldY += this.velocity * Math.cos((this.direction-180)*Math.PI/180);
		} else if(this.direction > 270 && this.direction <=360) {
			worldX -= this.velocity * Math.cos((this.direction-270)*Math.PI/180);
			worldY -= this.velocity * Math.sin((this.direction-270)*Math.PI/180);
		}
		if(this.world.isOceanAt(worldX, worldY)) {

			/* Detect the edge of the world */
			if(worldX < this.game.width/2) worldX = Math.floor(this.game.width/2);
			if(worldY < this.game.height/2) worldY = Math.floor(this.game.height/2);
			if(worldX > this.world.width*this.world.blockSize) worldX = this.world.width*this.world.blockSize;
			if(worldY > this.world.height*this.world.blockSize) worldY = this.world.height*this.world.blockSize;

			/* Move to the new position */
			this.worldX = worldX;
			this.worldY = worldY;
		} else {
			
			/* Do course correction */
			this.courseCorrection = true;
			this.courseCorrectionDuration = 90;

			this.direction += 10;
			if(this.direction>360) this.direction = this.direction - 360;
			this.direction = Math.floor(Math.random()*360);
			

			/* Detect port */
			let block = this.world.getBlockAt(worldX, worldY);

			// if port - dock with it / show welcome / etc..
			if(block==5) {
				this.dockAtPort(Math.floor(worldX/this.world.blockSize), Math.floor(worldY/this.world.blockSize));
				//console.log(`Ship docked at ${this.dockedAt.name} destination ${this.destination.name}`);
				this.pickRandomDestination();
				this.leavePort();
				this.headForDestination();
				//console.log(`New destination ${this.destination.name}`);
			}

		}
	}
}
