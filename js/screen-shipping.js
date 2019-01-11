/** 
 * Shipping screen.
 *
 * @author Matthew Page <work@mjp.co>
 * @extends Sprite
 xxxxxxxxxxxxxx
 * @property {number} worldX - The X position in the world
 * @property {number} worldY - The Y position in the world
 * @property {number} discoveryDistance - How far into the world can you see (world map)
 * @property {Port} dockedAt - If we are in dock the Port instance
 * @property {ResourceContainer} resources - Our resources (gold, wood etC)
 */
class ShippingScreen extends Sprite {
	constructor(game, world, worldMap, id) {
		/* Sprite(game, id, posX, posY, width, height, velocity, direction, hitPoints) */
		super(game, id, 350, 50, 480, 450, 0, 90, 1);
		
		this.world = world;
		this.worldMap = worldMap;
		this.makeDomElement('shippingScreen');
		this.domElement = document.getElementById(this.id);
		this.isActive = false;
	}
	/**
	 * Main update loop, redraw the sprite, discover new areas of the map
	 *
	 * @method update
	 */
	update() {
		this.draw();
	}
	draw() {
		if(this.isActive) {
			this.domElement.style.left = `${Math.round(this.posX)}px`;
			this.domElement.style.top = `${Math.round(this.posY)}px`;
			this.domElement.style.width = `${Math.round(this.width)}px`;
			this.domElement.style.height = `${Math.round(this.height)}px`;
			this.domElement.style.display = 'block';
			let html = "<table><tr><td>Ship</td><td>X</td><td>Y</td><td>Destination</td><td>Gold</td><td>Wood</td><td>Gunpowder</td>";
			this.game.cargoShips.forEach((ship)=>{
				html += `<tr><td>${ship.id}</td><td>${Math.floor(ship.worldX)}</td><td>${Math.floor(ship.worldY)}</td><td>${ship.destination.name}</td>
						<td>${ship.resources.quantity('gold')}</td>
<td>${ship.resources.quantity('wood')}</td>
<td>${ship.resources.quantity('gunpowder')}</td>
						</tr>`;
			});
			html += "</table><button onclick='myGame.shippingScreen.isActive = false'>Close</button>";
			this.domElement.innerHTML = html;
			
		} else {
			this.domElement.style.display = 'none';	
		}
	}
}
