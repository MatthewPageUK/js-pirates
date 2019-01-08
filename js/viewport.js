/** 
 * A viewport on to the game world rendered on a canvas element
 *
 * @author Matthew Page <work@mjp.co>
 * @class
 * @extends
 * @property {number} width - Width of this viewport on screen
 * @property {number} height - Height of this viewport on screen
 * @property {number} worldX - Pixel X position in the world for the center of this viewport (players position)
 * @property {number} worldY - Pixel Y position in the world for the center of this viewport (players position)
 game
 world
 domElement
 paper - 2d context of the canvas element.
 */
class Viewport {
	constructor(game, world, player) {
		this.game = game;
		this.world = world;
		this.player = player;

		this.width = (Math.floor(this.game.width / this.world.blockSize) - ( Math.floor(this.game.width / this.world.blockSize) % 2))*this.world.blockSize;
		this.height = (Math.floor(this.game.height / this.world.blockSize) - ( Math.floor(this.game.height / this.world.blockSize) % 2))*this.world.blockSize;
		
		this.blocksWide = Math.ceil(this.width/this.world.blockSize);
		this.blocksHigh = Math.ceil(this.height/this.world.blockSize);
		
		this.domElement = document.getElementById("viewport");
		this.domElement.width = this.width;
		this.domElement.height = this.height;
		this.paper = this.domElement.getContext("2d");
		this.bufferCanvas = document.createElement("canvas");
		this.bufferCanvas.width = this.width;
		this.bufferCanvas.height = this.height;
		this.bufferCanvas.style.left = `${this.width}px`;
		this.bufferCanvasPaper = this.bufferCanvas.getContext("2d");
	
		this.update();
	}
		
	/**
	 * Update the viewport display, render the world into this viewport
	 *
	 * @method update
	 */
	update() {
		
		this.bufferCanvasPaper.clearRect(0, 0, this.width, this.height);
		this.bufferCanvasPaper.fillStyle = "green";
		
		/* Offset from grid edges, not on a block boundary - smooth movement */
		let offsetX = this.player.worldX % this.world.blockSize;
		let offsetY = this.player.worldY % this.world.blockSize;

		/* Get the start and end positions in the blockMap grid */
		let startX = this.player.gridX - (this.blocksWide/2);
		let endX = startX + this.blocksWide;
		
		let startY = this.player.gridY - (this.blocksHigh/2);
		let endY = startY + this.blocksWide;

		/* Position of the block in the viewport */
		let vpX = 0;
		let vpY = 0;

		/* tmp */
		let img = new Image();
		img.src = 'gfx/port.png';
		
		/* Change sea colour based on sunlight */
		let r = 100 * (this.game.worldClock.sunlight/100);
		let g = 149 * (this.game.worldClock.sunlight/100);
		let b = 237 * (this.game.worldClock.sunlight/100);
		this.domElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
		
		/* Loop through the selected blocks and draw them on screen */
		for(let y = startY; y < endY; y++) {
			vpX = 0;
			for(let x = startX; x < endX; x++) {
				
				/* Ship light */				
				let distFromShip = Math.sqrt( Math.pow(Math.abs(x-startX-(Math.round(this.width/this.world.blockSize)/2)),2) + Math.pow(Math.abs(y-startY-(Math.round(this.height/this.world.blockSize)/2)),2) );
				let shipLight = (7/100)*distFromShip*100;
				if(shipLight>100) shipLight=100;
				shipLight = 100-shipLight;
				shipLight = shipLight / 100;
				//console.log(distFromShip);
				/* Sunlight */
				let sunLight = this.game.worldClock.sunlight/100;
				let allLight = shipLight + sunLight;
				if(allLight > 1) allLight = 1;
	
				if(this.world.blockMap[y][x] == 0) {
					let r = Math.floor(100 * allLight);
					let g = Math.floor(149 * allLight);
					let b = Math.floor(237 * allLight);
					this.bufferCanvasPaper.fillStyle = `rgb(${r},${g},${b})`;
					this.bufferCanvasPaper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
				}
				if(this.world.blockMap[y][x] == 1) {
					let colour = Math.floor(128 * allLight);
					this.bufferCanvasPaper.fillStyle = `rgb(0, ${colour}, 0)`;
					this.bufferCanvasPaper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
				}
				if(this.world.blockMap[y][x] == 2) {
					let colour = Math.floor(255 * allLight);
					this.bufferCanvasPaper.fillStyle = `rgb(${colour}, ${colour}, 0)`;
					this.bufferCanvasPaper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
				}
				if(this.world.blockMap[y][x] == 5) {
						this.bufferCanvasPaper.drawImage(img, vpX-offsetX, vpY-offsetY);
				}
				vpX += this.world.blockSize;
			}
			vpY += this.world.blockSize;
		}
		this.paper.drawImage(this.bufferCanvas,0 ,0);
	}
}