/**
 * A light map, grid array (x,y) of values from 0 - 100
 * Higher the value the brighter the light is.
 *
 * @property {number} width - Width of this map in game blocks
 * @property {number} height - Height of this map in game blocks
 * @property {array} light - The light map array storing the light values
 */
class LightMap {
	/**
	 * Create a new light map
	 *
	 * @param {number} width - Width of this map in game blocks
	 * @param {number} height - Height of this map in game blocks
	 */
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.light = [];
		this.makeDarkness();
	}
	/**
	 * Make the default dark array
	 */
	makeDarkness() {
		this.light = [];
		for(let y = 0; y < this.height; y++) {
			this.light[y] = [];
			for(let x = 0; x < this.width; x++) {
				this.light[y][x] = 0;
			}
		}
	}
	/**
	 * Apply the light at grid x,y to the RGB values
	 *
	 * @param {number} x - The X position in the light map
	 * @param {number} y - The Y position in the light map
	 * @param {number} r - Red (0-255)
	 * @param {number} b - Blue (0-255)
	 * @param {number} g - Green (0-255)
	 * @returns {string} - HTML style rgb(10,10,10)
	 */
	applyLightToRGB(x, y, r, g, b) {
		r = r * (this.lightAtGrid(x, y)/100);
		g = g * (this.lightAtGrid(x, y)/100);
		b = b * (this.lightAtGrid(x, y)/100);
		return `rgb(${r}, ${g}, ${b})`;
	}
	/**
	 * Get the amount of light at grid X, Y
	 *
	 * @param {number} x - The grid X position
	 * @param {number} y - The grid Y position
	 * @returns {number} Amount of light (0-100)
	 */
	lightAtGrid(x,y) {
		return this.light[y][x];	
	}
	/**
	 * Merge this light map with another
	 * @todo Tidy this up...
	 *
	 * @param {number} cx - The position to merge to the new lightmap in
	 * @param {number} cy - The position to merge to the new lightmap in
	 * @param {LightMap} lightmap - The lightmap being merged 
	 */
	mergeWith(cx, cy, lightmap) {
		let w = Math.round(lightmap.width / 2);
		let h = Math.round(lightmap.height / 2);
		for(let y = 0; y < lightmap.height; y++) {
			for(let x = 0; x < lightmap.width; x++) {
				if(y-h+cy < this.height && x-w+cx < this.width && x-w+cx >= 0 && y-h+cy >= 0) {
					
					/* Combine by selecting the Max of the two values */
					this.light[y-h+cy][x-w+cx] = Math.max(lightmap.lightAtGrid(x, y), this.light[y-h+cy][x-w+cx]);
					
					/* Combine by adding the two values and constraining to 100
					this.light[y-h+cy][x-w+cx] += lightmap.lightAtGrid(x, y);
					if(this.light[y-h+cy][x-w+cx] > 100) this.light[y-h+cy][x-w+cx] = 100;
					*/
					
				}
			}
		}
	}
	
}