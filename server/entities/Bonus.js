'use strict'
class Bonus {
	constructor (data) {
		this.type = 'bonus';
		this.position = {x: data.x, y: data.y};
		this.id = data.id;
		this.color = data.color;
	}

	setup(state){
		this.state = state;
	}

	update(){

	}

	toJSON () {
		return {
			type: this.type,
			color: this.color,
			position: this.position
		}
	}
}
module.exports = Bonus
