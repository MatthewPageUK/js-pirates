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

		this.width = this.game.width;
		this.height = this.game.height;
		
		this.domElement = document.getElementById("viewport");
		this.paper = this.domElement.getContext("2d");
	
		this.update();
	}
		
	/**
	 * Update the viewport display, render the world into this viewport
	 *
	 * @method update
	 */
	update() {
		
		this.paper.clearRect(0, 0, 640, 480);
		this.paper.fillStyle = "green";
		
		/* Offset from grid edges, not on a block boundary - smooth movement */
		let offsetX = this.player.worldX % this.world.blockSize;
		let offsetY = this.player.worldY % this.world.blockSize;

		/* Get the start and end positions in the blockMap grid */
		let startX = Math.floor((this.player.worldX - (this.width/2)) / this.world.blockSize);
		let endX = Math.ceil(startX + 41);
		
		let startY = Math.floor((this.player.worldY - (this.height/2)) / this.world.blockSize);
		let endY = Math.ceil(startY + 31);

		/* Position of the block in the viewport */
		let vpX = 0;
		let vpY = 0;

		/* tmp */
		let img = new Image();
		img.src = 'gfx/port.png';
		
		/* Loop through the selected blocks and draw them on screen */
		for(let y = startY; y < endY; y++) {
			vpX = 0;
			for(let x = startX; x < endX; x++) {
				if(this.world.blockMap[y][x] == 1) {
					this.paper.fillStyle = "green";
					this.paper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
				}
				if(this.world.blockMap[y][x] == 2) {
					this.paper.fillStyle = "yellow";
					this.paper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
				}
				if(this.world.blockMap[y][x] == 5) {
						this.paper.drawImage(img, vpX-offsetX, vpY-offsetY);
				}
				vpX += this.world.blockSize;
			}
			vpY += this.world.blockSize;
		}
	}
}