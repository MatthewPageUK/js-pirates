/** 
 * Pirates Game - main game code, loop, event handler 
 *
 * @author Matthew Page <work@mjp.co>
 * @class PirateGame
 * @extends
 * @property {World} world - The game world instance.
 * @property {WorldMap} worldMap - The world map, discovered map
 * @property {Viewport} viewport - The viewport we draw the world on to (canvas)
 * @property {Player} player - The player ship
 */
class PirateGame {
	/**
	 * Create the new game 
	 */
	constructor() {
		
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		this.isPaused = false;
		this.domElement = document.getElementById('game');
		/* www.fantasynamegenerators.com */
		this.namePorts = ['Scuttle Cove','Full Moon Cove','Red Water Cove','Gunpowder Anchorage','Devil Lagoon','Isle of Rumrunners','Anchorage of Privateers','Port of Hazard','Sanctuary of Grog','Lagoon of Marauders','Seaweed Cave','Maroon Retreat','Demon Cave','Quartermaster Haven','Crocodile Lagoon','Cavern of Mermaids','Retreat of Demons','Atoll of Sharks','Atoll of Last Words','Reef of the Tempest','Newhaven Harbor','Ocean Fall Harbor','South Point Landing','Silvercreek Landing','The Harbor Of Hingpar','The Harbor Of Summercouche','The Harbor Of Eplem','Huntinglow Piers','Chamtawa Port','Leomond Harbor','Eastport Wharf','Marblerock Landing','New Hope Port','Main Brook Piers','The Harbor Of Macaline','The Piers Of Beaugami','The Harbor Of Galsay','Bridgetrie Harbor','Wesnigan Piers','Hampgus Wharf','Heaven Beach Harbor','Candlelight Piers','Dry River Harbor','Greenport Wharf','The Landing Of Caulet','The Port Of Buxland','The Harbor Of Innistos','Brudermis Port','Gibmond Port','Browncroft Port'];

		this.world = new World(this, 1000,1000,8);	
		this.worldMap = new WorldMap(this, this.world);
		this.worldClock = new WorldClock(this, "March 3, 1682 19:00:00", 25);
		this.sun = new Sun(this, this.world, this.worldClock, 4, 22);
		
		this.player = new Player(this, this.world, this.worldMap, "player1");
		this.world.makePorts(35);
		this.cargoShips = [];
		for(let x=1; x<20; x++) {
			this.cargoShips.push(new CargoShip(this, this.world, this.worldMap, `cargo${x}`));
		}
		this.viewport = new Viewport(this, this.world, this.player);

		
		this.shippingScreen = new ShippingScreen(this, this.world, this.world.worldMap, 'shipscreen1');

		this.updateCounter = 0;
		
		document.addEventListener("keydown", this, false);
		document.addEventListener("keyup", this, false);	
		this.update();		
	}
	/**
	 * Handle the incoming DOM events (keyup and keydown). Pass relevant 
	 * key events to the PlayerShip instance
	 *
	 * @method handleEvent
	 * @param {Event} e - The DOM event instance
	 * @returns {boolean} False, prevent the browser processing these events.
	 */
	handleEvent(e) {
		switch(e.key) {
			case "ArrowDown" :
				e.preventDefault();
				this.player.receiveCommand(e.type, 'down');
				break;
			case "ArrowUp" :
				e.preventDefault();
				this.player.receiveCommand(e.type, 'up');
				break;
			case "ArrowLeft" :
				e.preventDefault();
				this.player.receiveCommand(e.type, 'left');
				break;
			case "ArrowRight" :
				e.preventDefault();
				this.player.receiveCommand(e.type, 'right');
				break;
			case " " :
				e.preventDefault();
				this.player.receiveCommand(e.type, 'fire');	
				break;
		}
		return false;
	}
	/**
	 * Main game loop, called repeatedly from requestAnimationFrame
	 *
	 * @method update
	 */
	update() {
		if(this.updateCounter % 60 == 0) {
			// Once per 60 updates
			this.shippingScreen.update();
		}
		if(!this.isPaused) {
			this.world.update();
			this.worldClock.update();
			this.player.update();	
			this.viewport.update();
			this.worldMap.update();
			this.cargoShips.forEach((ship)=>{
				ship.update();
			});
			
		}
		this.updateCounter += 1;
		/* Request this method be called again ... loop forever */
		window.requestAnimationFrame(() => this.update());
	}
	/**
	 * Toggle the pause status
	 *
	 * @method pauseToggle
	 */
	pauseToggle() {
		this.isPaused = (this.isPaused)?false:true;	
	}
}