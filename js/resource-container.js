/** 
 * A resource container, ports and ships have these for 
 * holding and managing resources
 *
 * @author Matthew Page <work@mjp.co>
 * @class ResourceContainer
 * @property {array} resources - Array of resources in this container
 */
class ResourceContainer {
	/**
	 * Create a new resource container
	 *
	 * @param {Player | Port} owner - Owner of this resource container
	 */
	constructor(owner) {
		this.resources = [];
		this.resources['gold'] = 0;
		this.resources['wood'] = 0;
		this.resources['gunpowder'] = 0;
	}
	/**
	 * Checks if supplied 'type' is a valid resource type
	 *
	 * @method isResource
	 * @param {string} type - Type of resource
	 * @returns {boolean}
	 */
	isResource(type) {
		return(!isNaN(this.resources[type]));
	}
	/**
	 * Get the quantity of resource 'type'
	 *
	 * @method quantity
	 * @param {string} type - Type of resource
	 * @returns {number}
	 */
	quantity(type) {
		if(this.isResource(type)) {
	 		return this.resources[type];
		} else {
			return false;
		}
	}
	/**
	 * Add resources to this container
	 *
	 * @method add
	 * @param {string} type - Type of resource
	 * @param {number} quantity - Quantity of resource added
	 * @returns {boolean}
	 */
	add(type, quantity) {	
		if(this.isResource(type)) {
			this.resources[type] += quantity;
			return true;
		} else {
			return false;
		}
	}
	/**
	 * Remove resources from this container
	 *
	 * @method remove
	 * @param {string} type - Type of resource
	 * @param {number} quantity - Quantity of resource remove
	 * @returns {boolean}
	 */
	remove(type, quantity) {
		if(this.isResource(type)) {
			this.resources[type] -= quantity;
			if(this.resources[type] < 0) this.resources[type] = 0;
			return true;
		} else {
			return false;
		}
	}
}

