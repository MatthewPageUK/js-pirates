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
		this.lightMap = new LightMap(this.blocksWide, this.blocksHigh);
		this.fps = 0;
		this.lastFrame = false;
		this.update();
	}
	/**
	 * Update the viewport display, render the world into this viewport
	 *
	 * @method update
	 */
	update() {

		if(!this.lastFrame) {
			this.lastFrame = Date.now();
			this.fps = 0;
		}
		let delta = (Date.now() - this.lastFrame)/1000;
		this.lastFrame = Date.now();
		this.fps = 1/delta;

		this.paper.clearRect(0, 0, this.width, this.height);
		this.paper.fillStyle = "green";
		
		/* Offset from grid edges, not on a block boundary - smooth movement */
		let offsetX = this.player.worldX % this.world.blockSize;
		let offsetY = this.player.worldY % this.world.blockSize;

		/* Get the start and end positions in the blockMap grid */
		let startX = this.player.gridX - (this.blocksWide/2);
		let endX = startX + this.blocksWide;
		
		let startY = this.player.gridY - (this.blocksHigh/2);
		let endY = startY + this.blocksHigh;

		/* Position of the block in the viewport */
		let vpX = 0;
		let vpY = 0;

		/* tmp */
		let img = new Image();
		img.src = 'gfx/port.png';
		
		let sunlight = this.game.sun.sunlight;
		
		/* Change sea colour based on sunlight */
		let r = Math.floor(100 * sunlight/100);
		let g = Math.floor(149 * sunlight/100);
		let b = Math.floor(237 * sunlight/100);
		this.domElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
		
		/* Light map - populate with sunlight */
		for(let ly = 0; ly < this.lightMap.height; ly++) {
			for(let lx=0; lx < this.lightMap.width; lx++) {
				this.lightMap.light[ly][lx] = sunlight;
			}
		}

		/* Player light */
		this.lightMap.mergeWith(Math.floor(this.blocksWide/2), Math.floor(this.blocksHigh/2), this.player.lightSource.lightMap);

		
		/* Cargo Ship light */
		this.game.cargoShips.forEach( (ship) => {
			/* Is the ship in the viewport ? */
			if(ship.gridX > startX && ship.gridX < endX && ship.gridY > startY && ship.gridY < endY) {
				/* Merge the ship light source - light map with the viewport light map */
				//console.log(ship.lightSource);
				this.lightMap.mergeWith(ship.gridX-startX,ship.gridY-startY,ship.lightSource.lightMap);
			}
		});
		
		/* Port lights */
		this.game.world.ports.forEach( (port) => {
			/* Is the ship in the viewport ? */
			if(port.gridX > startX && port.gridX < endX && port.gridY > startY && port.gridY < endY) {
				/* Merge the ship light source - light map with the viewport light map */
				//console.log(ship.lightSource);
				this.lightMap.mergeWith(port.gridX-startX,port.gridY-startY,port.lightSource.lightMap);
			}
		});
		
		/* Loop through the selected blocks and draw them on screen */
		let ly = 0;
		for(let y = startY; y < endY; y++) {
			vpX = 0;
			let lx = 0;
			for(let x = startX; x < endX; x++) {
	
				if(this.world.blockMap[y][x] == 0) {
					/* Only paint ocean if it has a different light to the standard sunlight */
					if(sunlight != this.lightMap.lightAtGrid(lx, ly)) {		
						this.paper.fillStyle = this.lightMap.applyLightToRGB(lx, ly, 100, 149, 237);
						this.paper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
					}
				}
				if(this.world.blockMap[y][x] == 1) {
					this.paper.fillStyle = this.lightMap.applyLightToRGB(lx, ly, 0, 128, 0);
					this.paper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
				}
				if(this.world.blockMap[y][x] == 2) {
					this.paper.fillStyle = this.lightMap.applyLightToRGB(lx, ly, 255, 255, 0);
					this.paper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
				}
				if(this.world.blockMap[y][x] == 3) {
					this.paper.fillStyle = this.lightMap.applyLightToRGB(lx, ly, 128, 255, 128);
					this.paper.fillRect(vpX-offsetX, vpY-offsetY, this.world.blockSize+1, this.world.blockSize+1);
				}
				if(this.world.blockMap[y][x] == 5) {
						this.paper.drawImage(img, vpX-offsetX, vpY-offsetY);
				}
				vpX += this.world.blockSize;
				
				lx += 1;
			}
			vpY += this.world.blockSize;
			ly += 1;
		}

		/* Cargo ships on screen */
		this.game.cargoShips.forEach( (ship) => {
			
			if(ship.gridX > startX && ship.gridX < endX && ship.gridY > startY && ship.gridY < endY) {
				ship.domElement.style.display = "block";
				ship.domElement.style.left = Math.round(((ship.gridX - startX) * this.world.blockSize)-(ship.width/2))+"px";
				ship.domElement.style.top = Math.round(((ship.gridY - startY) * this.world.blockSize)-(ship.height/2))+"px";
			} else {
				ship.domElement.style.display = "none";
			}
			
		});

		/* Ports on screen */
		this.game.world.ports.forEach( (port) => {
			
			if(port.gridX > startX && port.gridX < endX && port.gridY > startY && port.gridY < endY) {
				port.domElement.style.display = "block";
				port.domElement.style.left = Math.round(((port.gridX - startX) * this.world.blockSize)+(16)-offsetX)+"px";
				port.domElement.style.top = Math.round(((port.gridY - startY) * this.world.blockSize)-(port.height/2)-offsetY)+"px";
				//port.domElement.style.left = (port.worldX - (startX*this.world.blockSize) - offsetX)+"px";
				//port.domElement.style.top = (port.worldY - (startY*this.world.blockSize) - offsetY)+"px";
			} else {
				port.domElement.style.display = "none";
			}
			
		});
		
		
	}
}