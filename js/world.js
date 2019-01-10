/** 
 * The game world and map. Made up of 16 x 16 blocks stored in blockMap
 * Coords - 0,0 is top left
 * 
 * 0 = Water
 * 1 = Land
 * 2 = Beach
 * 5 = Port
 *
 * @todo - 3D noise map, make mountains
 * @todo - Make beaches more natural, coves and inlets
 *
 * @author Matthew Page <work@mjp.co>
 * @class
 *
 * @property {Array[][]} blockMap - The multi-dimensional array of all the game world blocks.
 */
class World {
	/** 
	 * Make a new world, fill the blockMap and then call the map maker routines.
	 * 
	 * @param {number} width - Width of the world in blocks.
	 * @param {number} height - Height of the world in blocks.
	 * @param {number} blockSize - Size of each block (pixels on screen).
	 */
	constructor(game, width, height, blockSize) {
		this.game = game;
		this.width = width;
		this.height = height;
		this.blockSize = blockSize;
		this.blockMap = [];
		this.ports = [];
		this.makeBlockArray();
		this.makeNoiseMap();

	}
	/**
	 * Main update loop.
	 *
	 * @method update
	 */
	update() {

	}
	/**
	 * Make the Ports on the coastline. Keep making random ones until
	 * there are enough on the coast. Check at least one neighbouring block 
	 * is ocean. 
	 *
	 * @todo This could fail, or take a long time if there is not enough coastline..
	 *
	 * @method makePorts
	 * @param {number} n - Number of ports to create
	 */
	makePorts(n) {
		while(this.ports.length < n) {
			let gridX = Math.floor(Math.random() * this.width);
			let gridY = Math.floor(Math.random() * this.height);
			/* Is it beach? */
			if(this.getBlockAtGrid(gridX, gridY)==2) {
				/* Does it have ocean as a neighbour */
				if( this.isOceanAtGrid(gridX+1, gridY) || this.isOceanAtGrid(gridX, gridY+1) || 
				   this.isOceanAtGrid(gridX-1, gridY) || this.isOceanAtGrid(gridX, gridY-1) ) {
					/* Update the blockMap and create the port */
					this.blockMap[gridY][gridX] = 5;
					this.ports.push(new Port(this.game, gridX, gridY));
				}
			}
		}
	}
	/**
	 * Make a Perlin Noise map for the islands. Use the value to 
	 * determine ocean, beach or land.
	 *
	 * @method makeNoiseMap
	 */
	makeNoiseMap() {
		noise.seed(Math.random());
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				var value = Math.abs(noise.perlin2(x/100, y/100));
				value *= 256;
				if(value > 75 && value < 80) {
					this.blockMap[y][x] = 2; // Beach
				} else if(value > 75 && value < 120) {
					this.blockMap[y][x] = 1; // Land
				} else if(value > 120) {
					this.blockMap[y][x] = 3; // Inner land?
				} else {
					this.blockMap[y][x] = 0; // Ocean
				}
			}
		}	
	}
	/**
	 * Return the value of the block at gridX , gridY
	 *
	 * @method getBlockAtGrid
	 * @param {number} gridX - The X position in the blockMap array.
	 * @param {number} gridY - The Y position in the blockMap array.
	 * @returns {boolean}
	 */
	getBlockAtGrid(gridX,gridY) {
		if(gridX < 0 || gridX > this.width || gridY < 0 || gridY > this.height) {
			return 0;
		} else {
			return (this.blockMap[gridY][gridX]);
		}
	}	
	/**
	 * Return the value of the block at worldX, worldY
	 *
	 * @method getBlockAt
	 * @param {number} x - The X position in the world.
	 * @param {number} y - The Y position in the world.
	 * @returns {boolean}
	 */
	getBlockAt(x,y) {
		let gridX = Math.floor(x/this.blockSize);
		let gridY = Math.floor(y/this.blockSize);
		return (this.getBlockAtGrid(gridX, gridY));
	}
	/**
	 * Is the block at the grid X, Y ocean or not
	 *
	 * @method isOceanAtGrid
	 * @param {number} gridX - The X position in the blockMap array.
	 * @param {number} gridY - The Y position in the blockMap array.
	 * @returns {boolean}
	 */
	isOceanAtGrid(gridX,gridY) {
		if(gridX < 0 || gridX >= this.width || gridY < 0 || gridY >= this.height) {
			return true;
		} else if(this.blockMap[gridY][gridX] == 0) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * Is the block at the grid X, Y land or not
	 *
	 * @method isLandAtGrid
	 * @param {number} gridX - The X position in the blockMap array.
	 * @param {number} gridY - The Y position in the blockMap array.
	 * @returns {boolean}
	 */
	isLandAtGrid(gridX,gridY) {
		return !this.isOceanAt(gridX,gridY);
	}
	/**
	 * Is the Pixel at x, y Ocean of not, used for collision detection
	 * with ships.
	 *
	 * @method isOceanAt
	 * @param {number} gridX - The X world pixel position.
	 * @param {number} gridY - The Y world pixel position.
	 * @returns {boolean}
	 */
	isOceanAt(x,y) {
		let gridX = Math.floor(x/this.blockSize);
		let gridY = Math.floor(y/this.blockSize);
		return (this.isOceanAtGrid(gridX,gridY));
	}
	/**
	 * Is the Pixel at x, y Land of not
	 *
	 * @method isLandAt
	 * @param {number} gridX - The X world pixel position.
	 * @param {number} gridY - The Y world pixel position.
	 * @returns {boolean}
	 */
	isLandAt(x,y) {
		return !this.isOceanAt(x,y);
	}
	/**
	 * Make the empty world blockMap array, just water, water everywhere...
	 *
	 * @method makeBlockArray
	 */
	makeBlockArray() {
		for(let y = 0; y < this.height; y++) {
			this.blockMap[y] = [];
			for(let x = 0; x < this.width; x++) {
				this.blockMap[y][x] = 0;
			}
		}
	}
}