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
		
		this.width = 640;
		this.height = 480;
		this.isPaused = false;
		this.domElement = document.getElementById('game');
	
		this.world = new World(1000,1000,16);	
		this.worldMap = new WorldMap(this, this.world);
		this.player = new Player(this, this.world, this.worldMap, "player1");
		this.viewport = new Viewport(this, this.world, this.player);

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
		if(!this.isPaused) {
			this.player.update();	
			this.viewport.update();
			this.worldMap.update();
		}
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