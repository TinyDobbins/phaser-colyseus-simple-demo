'use strict'
const Player = require('../entities/Player.js')
const Bonus = require('../entities/Bonus.js')

const uniqid = require('uniqid')

//const EntityMap = require('EntityMap')

class StateHandler {
	constructor (clock, mode, vIsPrivate) {
		this.players = {};
		this.entities = {};

		this.clock = clock;

		// example of timer setTimeout
		// this.clock.setTimeout( () => {console.log('end timer in this room');}, 5000);

		// example of timer setInterval
		this.clock.setInterval( () => {
			this.addBonus();
		}, 5000);
	}

	addBonus () {
		let obj = new Bonus({
			id: uniqid(),
			color: 0x00FF00,
			x: this.getRandomInt(100,700),
			y: this.getRandomInt(100,500)
		});

		this.addEntity(obj);
	}

	createPlayer (client, options) {
		let entityId = client.id;
		let hero = this.createHero({
			id: client.id
		})
		this.players[entityId] = hero;
		this.addEntity(hero);
	}

	removePlayer (client) {
		let entityId = client.id;
		this.removeEntity(this.players[entityId])
		delete this.players[entityId];
	}

	getPlayer (client) {
		return this.players[client.id];
	}

	createHero (data) {
		let hero = new Player({
			id: data.id,
			color: Math.floor(Math.random() * 0xffffff),
			x: this.getRandomInt(100,700),
			y: this.getRandomInt(100,500)
		});
		return hero;
	}

	removeEntity (entity) {
		delete this.entities[entity.id];
	}

	addEntity (instance) {
		if (instance.setup) instance.setup(this);
		this.entities[ instance.id ] = instance;
	}

	dispose(){
		for(let id in this.entities) {
			delete this.entities[id];
		}
		this.entities = {};
		this.clock.stop();
	}

	update() {
		this.clock.tick();

		for(let id in this.entities) {
			let entity = this.entities[id];
			if (entity.update) entity.update();
		}
	}

	getRandomInt (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	toJSON () {
		return {
			entities: this.entities
		};
	}
}
module.exports = StateHandler
