/** 
 * The world date and time system, runs faster than real time
 *
 * @author Matthew Page <work@mjp.co>
 * @class WorldClock
 *
 * @property {date} worldTime - The Date object holding the current game date and time.
 */
class WorldClock {
	/** 
	 * Make a new clock for the world.
	 * 
	 * @param {PiratesGame} game - The current game instance.
	 * @param {string} start - The date / time string to start at 'March 3, 1682 09:00:00'.
	 * @param {number} blockSize - Size of each block (pixels on screen).
	 */
	constructor(game, start) {
		this.game = game;		
		this.worldTime = new Date(start);
		this.domElement = document.getElementById('worldTime');
	}
	/**
	 * Main update loop, handle the world time
	 *
	 * @method update
	 */
	update() {
		/* 1 second per frame */
		this.worldTime = new Date(this.worldTime.getTime()+1000*100);
		let am = (this.worldTime.getHours()>11)?"pm":"am";
		this.domElement.innerHTML = `${this.worldTime.toDateString()}<br>${this.worldTime.getHours()}:${this.worldTime.getMinutes()} ${am}`;
	}
}