/** 
 * The Player, handles keys, movement etc.
 *
 * @author Matthew Page <work@mjp.co>
 * @class
 * @extends Sprite
 * @property {number} worldX - The X position in the world
 * @property {number} worldY - The Y position in the world
 * @property {number} discoveryDistance - How far into the world can you see (world map)
 */
class Player extends Sprite {
	constructor(game, world, worldMap, id) {
		/* Sprite(game, id, posX, posY, width, height, velocity, direction, hitPoints) */
		super(game, id, game.width/2-(48/2), game.height/2-(91/2), 48, 91, 5, 90, 25);
		
		this.world = world;
		this.worldMap = worldMap;
		this.domElement = document.getElementById(id);
		
		/* Start in the middle of the map */
		this.worldX = Math.floor(this.world.width/2)*this.world.blockSize;
		this.worldY = Math.floor(this.world.height/2)*this.world.blockSize;

		this.keyMove = false;
		this.keyLeft = false;
		this.keyRight = false;
		this.discoveryDistance = 100;
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
		if(this.keyRight)
		{
			this.direction += 2;
			if(this.direction > 360) this.direction = 0;
		}
		if(this.keyLeft)
		{
			this.direction -= 2;
			if(this.direction < 0) this.direction = 360;
		}
		if(this.keyMove)
		{

			let worldX = this.worldX;
			let worldY = this.worldY;
			
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
			}			
		}
	}
}
