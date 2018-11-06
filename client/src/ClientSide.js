ClientSide = function (game) {
	this.game = game;
	this.client = null;
	this.room = null;
	this.roomList = null;
	this.isSocketConnected = false;
	this.isRoomConnected = false;
};

ClientSide.prototype = {
	init: function(){
		var client = new Colyseus.Client('ws://localhost:80');

		client.onOpen.add(function (event) {
			console.log(client.id, "connected!")
			MainGame.SO.isSocketConnected = true;
			MainGame.SO.ourId = client.id;
		});

		client.onMessage.add(function (event) {
			 console.log("Client received message!", event);
		});

		client.onClose.add(function (event) {

		});

		this.client = client;
	},

	close: function(){
		if(!MainGame.SO.isSocketConnected) return;
		this.room = null;
		this.roomList = null;

		this.isRoomConnected = false;
		this.isSocketConnected = false;
		this.client.close();
	},

	initRoom: function(vNameRoom){
		if(this.isRoomConnected) return;

		this.room = this.client.join('GameRoom', {channel: vNameRoom});

		this.room.onError.add(function(error) {
			console.error(error)
		});

		this.room.onJoin.add(() => {
			this.isRoomConnected = true;
		});

		this.room.onLeave.add(() => {
			console.log("onLeave");
		});

		this.room.listen("entities/:id", (change) => {
			var entityId = change.path.id;

			// console.log(entityId, change);

			if (change.operation == "add") {
				MainGame.state.addEntity(entityId, change.value);
			}else if (change.operation == "remove") {
				MainGame.state.removeEntity(entityId);
			}
		});

		this.room.listen("entities/:id/position/:string", (change) => {
			var entityId = change.path.id;
			if (change.operation == "replace") {
				if (change.path.string === "x") {
					MainGame.state.moveEntity(entityId, Number(change.value), "");
				} else if (change.path.string === "y") {
					MainGame.state.moveEntity(entityId, "", Number(change.value));
				}
			}
		});

		/*
		this.room.listen("entities/:id/health", (change) => {

		});

		this.room.listen("levelTimer", (change) => {
			console.log(change.value);
		});
		//*/
	},

	sendCommand: function(vAction){
		this.room.send(['action', vAction]);
	},

	leaveRoom: function (vIsGoToMenu) {
		if (typeof vIsGoToMenu === 'undefined') vIsGoToMenu = true;
		console.log("leaveRoom!");

		this.isRoomConnected = false;
		if(this.room) this.room.leave();
		this.room = null;

		if(vIsGoToMenu) {
			MainGame.goToState('Menu');
		}
	},
};
