/** 
 * A port / trading post on the coast. Your ship can dock at ports to
 * trade items
 *
 * @author Matthew Page <work@mjp.co>
 * @class Port
 * @extends
 */

class Port {
	/**
	 * Create a new port
	 *
	 * @param {number} gridX - The world grid position this port is in
	 * @param {number} gridY - The world grid position this port is in
	 */
	constructor(game, gridX, gridY) {
		this.game = game;
		let index = Math.floor(Math.random()*this.game.namePorts.length);
		this.name = this.game.namePorts[index];
		this.game.namePorts.splice(index, 1);
		this.gridX = gridX;
		this.gridY = gridY;
	}
	/**
	 * Get the HTML for the port docking welcome screen
	 *
	 * @mathod htmlWelcome
	 * @returns {string} The HTML string for the welcome screen.
	 */	
	get htmlWelcome() {
		let html = "";
		html += `<h1>${this.name}</h1>`;
		html += `<a class="button" href="#" onclick="myGame.player.leavePort(); return false;">Set sail</a>`;
		return html;
	}
	
}
