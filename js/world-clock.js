/** 
 * The world date and time system, runs faster than real time. 
 *
 * @author Matthew Page <work@mjp.co>
 * @property {date} worldTime - The Date object holding the current game date and time.
 * @property {number} speed - The speed time moves in this game, seconds per frame update
 */
class WorldClock {
	/** 
	 * Make a new clock for the world.
	 * 
	 * @param {PiratesGame} game - The current game instance.
	 * @param {string} start - The date / time string to start at eg 'March 3, 1682 09:00:00'.
	 */
	constructor(game, start, speed) {
		this.game = game;		
		this.worldTime = new Date(start);
		this.domElement = document.getElementById('worldTime');
		this.speed = speed;
	}
	/**
	 * Main update loop, handle the world time. Creates a new Date object
	 * based on the new game world time.
	 *
	 */
	update() {
		/* 50 second per frame */
		this.worldTime = new Date(this.worldTime.getTime()+1000*this.speed);
		this.domElement.textContent = this.HTML;
	}
	/**
	 * Get the HTML for the on screen display
	 *
	 */
	get HTML() {
		return `${this.worldTime.toDateString()}<br>${this.hour}:${this.minute} ${this.meridiem}<br>Sunlight ${this.game.sun.sunlight}`;
	}
	/**
	 * Get the AM or PM (meridiem)
	 */
	get meridiem() {
		return (this.hour>11)?"pm":"am";
	}
	/**
	 * Get the Hour component of the time (24 hour)
	 */
	get hour() {
		return this.worldTime.getHours();
	}
	/**
	 * Get the Minutes component of the time
	 */
	get minute() {
		return (this.worldTime.getMinutes()<10)?`0${this.worldTime.getMinutes()}`:this.worldTime.getMinutes();
	}
}