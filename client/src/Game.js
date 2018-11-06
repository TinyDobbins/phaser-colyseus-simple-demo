MainGame.Game = function (game) {

};

MainGame.Game.prototype = {
	create: function () {
		MainGame.state = this;
		MainGame.stateName = 'ScreenGame';

		this.layerBack = game.add.group();
		this.layerMain = game.add.group();

		MainGame.addButton(this, this.layerMain, 700, 40, this.clickExit, 'Exit', 160, 40, 24);

		MainGame.fadeOut();

		MainGame.SO.initRoom('room1');

		this.entities = [];

		this.cursors = game.input.keyboard.createCursorKeys();
		this.isCanMove = true;
		this.isPlayerAdded = false;
	},

	movePlayer: function(vDirection){
		MainGame.SO.sendCommand(vDirection);
		game.time.events.add(50, this.canMoveAgain, this);
		this.isCanMove = false;
	},

	canMoveAgain: function () {
		this.isCanMove = true;
	},

	update: function () {
		if(this.isCanMove && this.isPlayerAdded){
			if (this.cursors.up.isDown){
				this.movePlayer("moveUp");
			}else if (this.cursors.down.isDown){
				this.movePlayer("moveDown");
			}
			if (this.cursors.left.isDown){
				this.movePlayer("moveLeft");
			}else if (this.cursors.right.isDown){
				this.movePlayer("moveRight");
			}
		}
	},

	addEntity: function(vEntityId, vData){
		if(this.entities[vEntityId]) return;
		var posX = vData.position.x;
		var posY = vData.position.y;

		var obj;
		if(vData.type == 'hero') {
			obj = this.layerMain.add(game.add.sprite(posX, posY, 'ss_main', 'circle_0000'));

			if(vEntityId == MainGame.SO.ourId){
				this.isPlayerAdded = true;
			}
		}else if(vData.type == 'bonus'){
			obj = this.layerBack.add(game.add.sprite(posX, posY, 'ss_main', 'box_0000'));
		}
		obj.anchor.setTo(0.5);
		obj.tint = vData.color;

		this.entities[vEntityId] = obj;
	},

	removeEntity: function(vEntityId){
		var obj = this.entities[vEntityId];
		obj.destroy();
		delete this.entities[vEntityId];
	},

	moveEntity: function(vEntityId, vX, vY){
		var obj = this.entities[vEntityId];
		if(vX != "") obj.x = vX;
		if(vY != "") obj.y = vY;
	},

	clickExit: function(){
		MainGame.SO.leaveRoom();
	}
};
