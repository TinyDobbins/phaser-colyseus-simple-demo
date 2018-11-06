MainGame.Menu = function (game) {

};

MainGame.Menu.prototype = {
	create: function () {
		game.stage.backgroundColor = '#FFFFFF';

		MainGame.state = this;
		MainGame.stateName = 'Menu';

		this.layerMain = game.add.group();

		// MainGame.addButton(this, this.layerMain, 400, 200, this.clickConnect, 'Connect', 160, 40, 24);
		MainGame.addButton(this, this.layerMain, 400, 260, this.clickJoin, 'Join', 160, 40, 24);

		if(!MainGame.SO.isSocketConnected) this.clickConnect();

		MainGame.fadeOut();
	},

	clickConnect: function () {
		MainGame.SO.init();
	},

	clickJoin: function () {
		MainGame.goToState('Game');
	}
};
