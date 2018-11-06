MainGame.Preloader = function (game) {
	this.background = null;
	this.preloadBar = null;
	this.ready = false;
};

MainGame.Preloader.prototype = {
	preload: function () {
		var width = Math.ceil(200/2);
		this.background = game.add.sprite(MainGame.worldX-width, MainGame.worldY, 'preloader_back');
	    this.preloadBar = game.add.sprite(MainGame.worldX-width, MainGame.worldY, 'preloader_bar');
	    game.load.setPreloadSprite(this.preloadBar);

		game.load.atlasJSONHash('ss_main', 'assets/spritesheets/ss_main.png?r='+MyMath.getRandomInt(0,99), 'assets/spritesheets/ss_main.json?r='+MyMath.getRandomInt(0,99));

		game.load.bitmapFont('bmf_riffic', 'assets/fonts/riffic50.png', 'assets/fonts/riffic50.fnt');
	},

	create: function () {
		/*
		MainGame.s_musicM = game.add.audio('s_musicM', 0.4);
		if (game.device.webAudio) {
				MainGame.s_sounds2 = game.add.audio('02_start_music', 0.4);
		}
		//*/
	},

	update: function () {
		if (!this.ready) {
			this.ready = true;
			MainGame.continueGame();
		}
	}
};
