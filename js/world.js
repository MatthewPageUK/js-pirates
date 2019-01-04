/** 
 * The game world and map. Made up of 16 x 16 blocks stored in blockMap
 * Coords - 0,0 is top left
 * 
 * 0 = Water
 * 1 = Land
 * 2 = Beach
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
	constructor(width, height, blockSize) {
		this.width = width;
		this.height = height;
		this.blockSize = blockSize;
		this.blockMap = [];
		this.makeBlockArray();
		this.makeNoiseMap();
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
				} else if(value > 75) {
					this.blockMap[y][x] = 1; // Land
				} else {
					this.blockMap[y][x] = 0; // Ocean
				}
			}
		}	
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
		if(gridX < 0 || gridX > 999 || gridY < 0 || gridY > 999) return true;
		return (this.blockMap[gridY][gridX] == 0);
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