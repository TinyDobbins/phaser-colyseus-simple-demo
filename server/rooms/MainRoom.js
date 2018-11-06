'use strict'
var Room = require('colyseus').Room
var StateHandler = require('./StateHandler.js')

const TICK_RATE = 20;

class MainRoom extends Room {
	onInit (options) {
		this.maxClients = 2;

		this.patchRate = 1000 / TICK_RATE; // sync state every 50ms
		this.setPatchRate(this.patchRate)

		this.channel = options.channel;

		this.setState(new StateHandler(this.clock));

		this.setSimulationInterval(() => this.state.update())
	}

	requestJoin(options) {
		console.log('MainRoom:requestJoin',options);
		return ((this.channel == options.channel) && (this.clients.length < this.maxClients));
	}

	onJoin (client, options) {
		console.log('MainRoom:requestJoin',client.id,options);
		this.state.createPlayer(client, options);
	}

	onLeave (client) {
		console.log('MainRoom:onLeave',client.id);
		this.state.removePlayer(client);
	}

	onMessage (client, data) {
		console.log("MainRoom:onMessage:", client.id, data);
		let key = data[0];
		let value = data[1];
		let hero = this.state.getPlayer(client);

		if(key == 'action'){
			hero.setAction(value);
		}
	}

	tick () {
		this.state.update();
	}

	onDispose () {
		clearInterval(this.tickInterval);
		this.state.dispose();
	}
}
module.exports = MainRoom
