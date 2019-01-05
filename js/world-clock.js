/** 
 * The world date and time system, runs faster than real time
 *
 * @author Matthew Page <work@mjp.co>
 * @class WorldClock
 *
 * @property {date} worldTime - The Date object holding the current game date and time.
 * @property {number} sunset - Hour the sunsets.
 * @property {number} sunrise - Hour the sunrises.
 */
class WorldClock {
	/** 
	 * Make a new clock for the world.
	 * 
	 * @param {PiratesGame} game - The current game instance.
	 * @param {string} start - The date / time string to start at 'March 3, 1682 09:00:00'.
	 */
	constructor(game, start) {
		this.game = game;		
		this.worldTime = new Date(start);
		this.domElement = document.getElementById('worldTime');
		this.sunset = 20;
		this.sunrise = 6;
	}
	/**
	 * Main update loop, handle the world time
	 *
	 * @method update
	 */
	update() {
		/* 50 second per frame */
		this.worldTime = new Date(this.worldTime.getTime()+1000*50);
		this.domElement.innerHTML = this.HTML;
	}
	/**
	 * Get the HTML for the on screen display
	 *
	 * @method get HTML
	 */
	get HTML() {
		let am = (this.worldTime.getHours()>11)?"pm":"am";
		return `${this.worldTime.toDateString()}<br>${this.worldTime.getHours()}:${this.worldTime.getMinutes()} ${am}<br>Sunlight ${this.sunlight}`;
	}
	/**
	 * Get the strength of the sunlight
	 *
	 * @todo Sort this mess out :)
	 * @todo Make this a non-linear change, sin wave?
	 *
	 * @method get sunlight
	 * @returns {number} Strength of light 0-100
	 */
	get sunlight() {
		if(this.worldTime.getHours() > this.sunset || this.worldTime.getHours() < this.sunrise) {
			return 0;
		} else if(this.worldTime.getHours() == 12) {
			return 100;
		} else if(this.worldTime.getHours() < 12) {
			return Math.floor((100/(12-this.sunrise))*(this.worldTime.getHours()-this.sunrise)+(((100/60)*this.worldTime.getMinutes())*((100/(12-this.sunrise))/100)));
		} else if(this.worldTime.getHours() > 12) {
			return Math.floor((100/(this.sunset-13))*(this.sunset-this.worldTime.getHours())-(((100/60)*this.worldTime.getMinutes())*((100/(this.sunset-13))/100)));
		}
	}
}