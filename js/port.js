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
	constructor(gridX, gridY) {
		
		this.gridX = gridX;
		this.gridY = gridY;
		
		console.log(`New port at ${gridX} ${gridY}`);
	
	}
	
}
