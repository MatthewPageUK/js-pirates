/**
 * A light source used by ports and ships to give off a nice glow
 * at night.
 * Brightness is really the maximum grid blocks the light extends
 * but sounds nicer than maxGridBlocksExtended
 *
 * @property {number} brightness - Brightness of the light
 * @property {LightMap} lightMap - The lightmap for this source
 * @property {number} cx - The center of this light grid
 * @property {number} cy - The center of this light grid
 *
 */
class LightSource {
	/**
	 * Create a new light source
	 *
	 * @param {number} brightness - Brightness of this light
	 */
	constructor(brightness) {
		this.brightness = brightness;
		this.lightMap = new LightMap((this.brightness*2)+1,(this.brightness*2)+1);	
		this.cx = Math.floor(this.lightMap.width/2);
		this.cy = Math.floor(this.lightMap.height/2);
		this.turnOn();
	}
	/**
	 * Make the lightmap for this source based on it's properties
	 *
	 */
	turnOn() {	
		this.lightMap.makeDarkness();
		for(let y = 0; y < this.lightMap.height; y++) {
			for(let x = 0; x < this.lightMap.width; x++) {				
				/* Calculate distance from center (light source) */
				let distFromSource = Math.sqrt( Math.pow(Math.abs(this.cx-x),2) + Math.pow(Math.abs(this.cy-y),2) );
				/* How much light is here ? */
				let distPercent = (100/this.brightness)*distFromSource;
				let percOfLight = 100 - distPercent;
				this.lightMap.light[y][x] = (percOfLight>0)?Math.floor(percOfLight):0;
			}
		}
		//console.log(this.lightMap.light);
	}
	/**
	 * Black out the light map
	 *
	 */
	turnOff() {
		this.lightMap.makeDarkness();
	}
}