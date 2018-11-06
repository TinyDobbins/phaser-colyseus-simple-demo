'use strict'
class Player {
	constructor (data) {
		this.type = 'hero';
		this.position = {x: data.x, y: data.y};
		this.id = data.id;
		this.color = data.color;
	}

	setup(state){
		this.state = state;
	}

	setAction(vValue){
		switch (vValue) {
			case "moveUp":
				this.position.y -= 10;
			break;
			case "moveDown":
				this.position.y += 10;
			break;
			case "moveLeft":
				this.position.x -= 10;
			break;
			case "moveRight":
				this.position.x += 10;
			break;
		}
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
module.exports = Player
