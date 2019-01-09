/** 
 * A world map, a resampled, graphical version of the 
 * World.blockMap array.
 *
 * @author Matthew Page <work@mjp.co>
 * @class
 * @extends
 */
class WorldMap {
	constructor(game, world) {
		this.game = game;
		this.world = world;
		this.discoveredMap = [];
		this.domElement = document.getElementById("worldmap");
		this.domElementPosition = document.getElementById("worldmapPosition");
		this.paper = this.domElement.getContext("2d");
		this.makeBlockArray();
	}
	/**
	 * Make the empty world blockMap array
	 *
	 * @method makeBlockArray
	 */
	makeBlockArray() {
		for(let y = 0; y < this.world.height; y++) {
			this.discoveredMap[y] = [];
			for(let x = 0; x < this.world.width; x++) {
				this.discoveredMap[y][x] = 0;
			}
		}
	}
	/**
	 * Is the block at the grid X, Y position discovered yet.
	 *
	 * @method isDiscoveredAtGrid
	 * @param {number} gridX - The X position in the discoveredMap array.
	 * @param {number} gridY - The Y position in the discoveredMap array.
	 * @returns {boolean}
	 */
	isDiscoveredAtGrid(gridX,gridY) {
		if(gridX < 0 || gridX >= this.world.width || gridY < 0 || gridY >= this.world.height) return false;
		return (this.discoveredMap[gridY][gridX] == 1);
	}

	/**
	 * Discover all the blocks within a circle around the x, y grid
	 *
	 * @method discoverCirlceGrid
	 * @param {number} x - Grid X center of circle.
	 * @param {number} y - Grid Y center of circle.
	 * @param {number} r - Radius of circle.
	 */
	discoverCirlceGrid(x, y, r) {
		for(let gridY = y-r; gridY <= y+r; gridY++) {
			for(let gridX = x-r; gridX <= x+r; gridX++) {
				/* Check if point is in the circle - pythag */
   				if ( (gridX - x) * (gridX - x) + (gridY - y) * (gridY - y) <= r * r ) {
					this.discoverGrid(gridX,gridY);
				}
			}
		}
	}
	/**
	 * Set block at the grid X, Y position to discovered.
	 *
	 * @method discoverGrid
	 * @param {number} gridX - The X position in the discoveredMap array.
	 * @param {number} gridY - The Y position in the discoveredMap array.
	 * @returns {boolean}
	 */
	discoverGrid(gridX,gridY) {
		if(gridX < 0 || gridX >= this.world.width || gridY < 0 || gridY >= this.world.height) return false;
		this.discoveredMap[gridY][gridX] = 1;
		return true;
	}
	/**
	 * Update the on screen map graphic
	 *
	 * @method update
	 */
	update() {
		this.paper.clearRect(0, 0, 1100, 1100);
		/* Loop through whole world, skip 10 */
		for(let y = 0; y < this.world.height; y+=10) {
			for(let x = 0; x < this.world.width; x+=10) {
				if(this.isDiscoveredAtGrid(x,y)) {
					switch(this.world.getBlockAtGrid(x,y)) {
						case 1 :
							this.paper.fillStyle = "peru";
							this.paper.fillRect(x/10, y/10, 1, 1);
							break;
						case 2 :
							this.paper.fillStyle = "peru";
							this.paper.fillRect(x/10, y/10, 1, 1);	
							break;
						default :
							//console.log(this.world.blockMap[y][x]);
							break;
					}
				}
			}
		}
		
		/* Port positions */
		this.world.ports.forEach((port) => {
			this.paper.fillStyle = "black";
			this.paper.fillRect(port.gridX/10, port.gridY/10, 2, 2);	
		});

		/* Cargo ship positions */
		this.game.cargoShips.forEach((ship) => {
			this.paper.fillStyle = "green";
			this.paper.fillRect(ship.gridX/10, ship.gridY/10, 2, 2);	
		});

		/* Player position and discovery circle */
		this.paper.fillStyle = "red";
		this.paper.fillRect(this.game.player.worldX / 10 / this.world.blockSize, this.game.player.worldY / 10 / this.world.blockSize, 2, 2);

		this.paper.beginPath();
		this.paper.arc(this.game.player.worldX / 10 / this.world.blockSize, this.game.player.worldY / 10 / this.world.blockSize, 10, 0, 2 * Math.PI);
		this.paper.lineWidth = 1;
		this.paper.strokeStyle = 'tan';
		this.paper.stroke();
		
		/* Position */
		this.domElementPosition.textContent = `FPS : ${Math.floor(this.game.viewport.fps)} Lat : ${this.game.player.worldX.toFixed(2)} Lng : ${this.game.player.worldY.toFixed(2)}`;
		
	}
}