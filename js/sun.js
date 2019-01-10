/** 
 * A sun light effect, casts light onto the lightmap giving the effect
 * of day and night transitions.
 *
 * @author Matthew Page <work@mjp.co>
 * @property {PiratesGame} game - The current game instance.
 * @property {World} world - The game world instance.
 * @property {WorldClock} clock - The game world clock.
 * @property {number} sunset - Hour the sun sets (24 hour clock).
 * @property {number} sunrise - Hour the sun starts to rise (24 hour clock).
 * @property {number} dayLength - Length of the day in hours (sunset-sunrise).
 * @property {number} sunmid - Hour the sun is at it's mid point.
 */
class Sun {
	/** 
	 * Make a new sun.
	 * 
	 * @param {PiratesGame} game - The current game instance.
	 * @param {World} world - The game world instance.
	 * @param {WorldClock} clock - The game world clock.
	 * @param {number} sunset - Hour the sun sets (24 hour clock).
	 * @param {number} sunrise - Hour the sun starts to rise (24 hour clock).
	 */
	constructor(game, world, clock, sunrise, sunset) {
		this.game = game;	
		this.world = world;
		this.clock = clock;
		this.sunrise = sunrise;
		this.sunset = sunset;
		this.dayLength = this.sunset-this.sunrise;
		this.sunmid = Math.floor(this.dayLength/2)+this.sunrise;
	}
	/**
	 * Get the strength of the sunlight now based on the game clock
	 *
	 * @todo Sort this mess out :)
	 * @todo Make this a non-linear change, sin wave?
	 *
	 * @returns {number} Strength of light 0-100
	 */
	get sunlight() {
		if(this.clock.hour >= this.sunset || this.clock.hour < this.sunrise) {
			return 0;
		} else if(this.clock.hour == this.sunmid) {
			return 100;
		} else if(this.clock.hour < this.sunmid) {
			let light = Math.floor((100/(this.dayLength-this.sunrise))*(this.clock.hour-this.sunrise)+(((100/60)*this.clock.minute)*((100/(this.dayLength-this.sunrise))/100)));
			if(light>100) light = 100;
			if(light<0) light = 0;
			return light;
		} else if(this.clock.hour > this.sunmid) {
			let light = Math.floor((100/(this.sunset-this.dayLength))*(this.sunset-this.clock.hour)-(((100/60)*this.clock.minute)*((100/(this.sunset-this.dayLength))/100)));
			if(light<0) light = 0;
			if(light>100) light = 100;
			return light;
		}
	}
}