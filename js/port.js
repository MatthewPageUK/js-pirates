/** 
 * A port / trading post on the coast. Your ship can dock at ports to
 * trade items
 *
 * @author Matthew Page <work@mjp.co>
 * @class Port
 * @extends
 * @property {ResourceContainer} resources - Our resources (gold, wood etC)
 */

class Port {
	/**
	 * Create a new port with random resources
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

		this.resources = new ResourceContainer(this);
		this.resources.add('gold', Math.floor(Math.random()*1000));
		this.resources.add('wood', Math.floor(Math.random()*1000));
		this.resources.add('gunpowder', Math.floor(Math.random()*1000));	
		
		this.lightSource = new LightSource(25);
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
		/* Interesting - this suggests something wrong with my object model resources.resources is confusing */
		html += `<p class="resource">Gold - ${this.resources.quantity('gold')}</p>`;
		html += `<p class="resource">Wood - ${this.resources.quantity('wood')}</p>`;
		html += `<p class="resource">Gunpowder - ${this.resources.quantity('gunpowder')}</p>`;
		html += `<a class="button" href="#" onclick="myGame.player.leavePort(); return false;">Set sail</a>`;
		return html;
	}
	
}