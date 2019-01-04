/* HTML / DOM based Sprite class */

class Sprite {
	constructor(game, id, posX, posY, width, height, velocity, direction, hitPoints) {
		this.id = id;
		this.isActive = true;
		this.game = game;
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
		this.velocity = velocity;
		this.direction = direction;
		this.hitPoints = hitPoints;
		this.domElement = false;
	}
	/**
	 * Make the DOM element for this sprite inside the Game element.
	 *
	 * @method makeDomElement
	 * @param {string} css - CSS style to apply to the element.
	 * @returns {boolean}
	 */
	makeDomElement(css) {
		this.makeDomElementInside(this.game, css);
		return true;
	}
	/**
	 * Make the DOM element for this sprite inside the supplied element.
	 *
	 * @method makeDomElementInside
	 * @param {Sprite} parent - The parent sprite or object with a DOM element.
	 * @param {string} css - CSS style to apply to the element.
	 * @returns {boolean}
	 */
	makeDomElementInside(parent, css) {
		let div = document.createElement('div');
		div.id = this.id;
		div.setAttribute('class', css);
		parent.domElement.appendChild(div);	
		return true;
	}
	/**
	 * Remove this DOM element.
	 *
	 * @method destroyDomElement
	 * @returns {boolean}
	 */
	destroyDomElement() {
		this.domElement.parentNode.removeChild(this.domElement);
		return true;
	}
	/**
	 * Update loop, call the move() and draw() methods.
	 *
	 * @method update
	 * @returns {boolean}
	 */
	update() {
		if(this.isActive) {
			this.move();
			this.draw();
		}
		return true;
	}
	/**
	 * Move the sprite, overide this method in classes extending the Sprite class.
	 * Called on every game loop.
	 *
	 * @method move
	 * @returns {boolean}
	 */
	move() {
		// Overide this function in the parent class
		return true;
	}
	/**
	 * Update the DOM Element style properties to move the sprite
	 *
	 * @method
	 * @name draw
	 */
	draw() {
		if(this.isActive) {
			this.domElement.style.left = `${Math.round(this.posX)}px`;
			this.domElement.style.top = `${Math.round(this.posY)}px`;
			this.domElement.style.width = `${Math.round(this.width)}px`;
			this.domElement.style.height = `${Math.round(this.height)}px`;
		}
	}
	/**
	 * Detect collision between two sprites.
	 *
	 * @method detectCollisionWith
	 * @param {Sprite} sprite - The sprite we are checking for a collision with.
	 * @returns {boolean} True if collision
	 */
	detectCollisionWith(sprite) {
		return !(
			((this.posY + this.height) < (sprite.posY)) ||
			(this.posY > (sprite.posY + sprite.height)) ||
			((this.posX + this.width) < sprite.posX) ||
			(this.posX > (sprite.posX + sprite.width))
		);
	}
	/**
	 * Is the x, y game world point inside this sprite.
	 *
	 * @method inMe
	 * @param {number} x - The X position.
	 * @param {number} y - The Y position.
	 * @returns {boolean} True if inside
	 */
	inMe(x, y) {
		return ( x > this.posX && x < this.posX+this.width && y > this.posY && y < this.posY+this.height );
	}
	/**
	 * Receive damage on this sprite, what happens when hit points < 0 is handled
	 * by the class that extended the sprite class.
	 * If hit points < 0 returns True to indicate this was a kill (killstreak code)
	 *
	 * @method receiveDamage
	 * @param {number} damage - The amount of damage received.
	 * @returns {boolean} True if this was a kill shot
	 */
	receiveDamage(damage) {
		this.hitPoints -= damage;
		return (this.hitPoints<=0)?true:false;
	}
	/**
	 * Receive health
	 *
	 * @method receiveHealth
	 * @param {number} health - The amount of health / hit points received.
	 * @returns {boolean}
	 */
	receiveHealth(health) {
		this.hitPoints += health;	
		return true;
	}
}