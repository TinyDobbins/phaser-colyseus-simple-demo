var game;

window.onload = function () {
	setTimeout(function() {
		window.scrollTo(0, 1);
		initGameStates();
	}, 100);
}

var MainGame = {
	Config: {GAME_WIDTH:800, GAME_HEIGHT:600},
	isDebug: false,
	title: "title_game_v1",
	state: null,
	stateName: "",
	orientation:1,//0 - PORTRAIT, 1 - LANDSCAPE
	orientated: false,
	GAME_TEXT: null,
	TEXT_FILE: null,
	onDesktop:false,
	fadeColor: 0x000000,
	textFPS: null,
	showFPS: false,
	isPaused: false,
	isGoAway:false,
	isMusicMuted: false,
	isMusicPlaying:-1,
	nextState:'',
	firstLoad: true,
	firstTime: true,
	firstGo: true,
	isMuteSound: false,
	isMuteMusic: false,


	initSettings: function () {
		game.input.maxPointers = 1;
		game.stage.disableVisibilityChange = true;//

		game.load.crossOrigin = "anonymous";

		game.camera.onFadeComplete.add(MainGame.changeState, this);
		MainGame.worldX = game.world.centerX;
		MainGame.worldY = game.world.centerY;

		MainGame.loadSaves();

		MainGame.midX = Math.ceil(MainGame.Config.GAME_WIDTH / 2);

		if(game.device.desktop){
			game.canvas.oncontextmenu = function (e) { e.preventDefault(); }

			window.addEventListener("keydown", function(e) {
			    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			        e.preventDefault();
			    }
			}, false);
		}

		window.scrollTo(0, 1);

		MainGame.SO = new ClientSide(this.game);
	},

	continueGame: function () {
		game.state.start('Menu');
	},

	addButton: function (link, vLayer, vX, vY, onClick, vText, vW, vH, vSize) {
		if (typeof vW === 'undefined') vW = 200;
		if (typeof vH === 'undefined') vH = 80;
		if (typeof vSize === 'undefined') vSize = 36;
		var btn = MainGame.addFill(vLayer, 0x333333, 0.5, vW, vH, vX-vW/2, vY-vH/2);
		btn.inputEnabled = true;
		btn.events.onInputDown.add(onClick, link);
		if(vText!='') btn.text = MainGame.addText(vX, vY, vText, vLayer, vSize, '#FFFFFF', 0.5, 0.5);
		return btn;
	},

	addText: function (vX, vY, vText, vLayer, vSize, vColor, vAnchorX, vAnchorY) {
		if (typeof vLayer === 'undefined') vLayer = '';
		if (typeof vSize === 'undefined') vSize = 40;
		if (typeof vColor === 'undefined') vColor = 0x000000;
		if (typeof vAnchorX === 'undefined') vAnchorX = 0;
		if (typeof vAnchorY === 'undefined') vAnchorY = 0;

		var text;
		if(vLayer!=''){
			text = vLayer.add(game.add.bitmapText(vX, vY, 'bmf_riffic', vText, vSize));
		}else{
			text = game.add.bitmapText(vX, vY, 'bmf_riffic', vText, vSize);
		}
		text.anchor.setTo(vAnchorX, vAnchorY);
		text.fontSize = vSize;
		text.tint = vColor;
		return text;
	},

	updateTextWidth: function (vText, vMaxWidth){
		var _txtWidth = vText.width;
		var scale = 1;
		if(_txtWidth > vMaxWidth) {
			scale = vMaxWidth/_txtWidth;
			vText.scale.setTo(scale);
		}
		return scale;
	},

	addPanelka: function (vLayer, vX, vY, vW, vH, vColorF, vColorB, vLine){
		if (typeof vColorF === 'undefined') vColorF = 0x000000;
		if (typeof vColorB === 'undefined') vColorB = 0xffffff;
		if (typeof vLine === 'undefined') vLine = 4;
		var graphics = vLayer.add(game.add.graphics(vX, vY));
		graphics.lineStyle(vLine, vColorB, 0.6);
		graphics.beginFill(vColorF, 0.7);
		graphics.drawRect(0, 0, vW, vH);
		graphics.endFill();
		return graphics;
	},

	loadSaves: function () {

	},

	saveSaves: function (vNum) {

	},

	clearSaves: function () {

	},

	clearGame: function () {
		game.tweens.removeAll();
	},

	goToState: function (pNextState) {
		MainGame.isFadeGame = false;
		MainGame.clearGame();
		game.camera.fade(MainGame.fadeColor, 200);
		MainGame.nextState = pNextState;
	},

	changeState: function () {
		if(!MainGame.isFadeGame) game.state.start(MainGame.nextState);
	},

	fadeOut: function () {
		game.camera.flash(MainGame.fadeColor, 200);
	},

	resizeGame: function () {
		var ratio = window.innerWidth/window.innerHeight;
		var standardWidth = MainGame.Config.GAME_WIDTH;
		var standardHeight = MainGame.Config.GAME_HEIGHT;
		var maxWidth = 1400;
		var standardRatio = standardWidth/standardHeight;

		/*if(game.device.desktop){
			if(window.innerWidth > 800){
				game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
			}else {
				game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
			}
			maxWidth = 800;
		}*/

		if (ratio > standardRatio) {
			game.scale.setGameSize( Math.min(maxWidth, Math.ceil(standardHeight*ratio)) ,standardHeight);
			MainGame.deltaX = Math.abs(Math.ceil((game.width-800)*-0.5));

			if(MainGame.stateName != 'ScreenGame') {
				game.world.setBounds(Math.ceil((game.width-standardWidth)*-0.5),0,game.width,game.height);
			}else{
				var dX = Math.ceil((game.width-800)*-0.5);
				game.world.setBounds(dX, 0, MainGame.state.level_width-dX*2, 600);
				game.camera.bounds.width = MainGame.state.level_width+MainGame.deltaX;
			}
		}else {
			game.scale.setGameSize(standardWidth, standardHeight);
			MainGame.deltaX = 0;

			if(MainGame.stateName != 'ScreenGame') {
				game.world.setBounds(0,0,Math.ceil((game.height-standardHeight)*-0.5),game.height);
			}else{
				game.world.setBounds(0, 0, MainGame.state.level_width, 600);
				game.camera.bounds.width = MainGame.state.level_width+MainGame.deltaX;
			}
		}

		window.scrollTo(0, 1);
	},

	muteSounds: function (btn) {
		game.add.tween(btn.scale).to({x: 0.9, y: 0.9}, 200, Phaser.Easing.Cubic.Out, true);
		game.add.tween(btn.scale).to({x: 1, y: 1}, 200, Phaser.Easing.Cubic.Out, true, 260);
		if(game.sound.mute) {
			btn.frameName = 'btn_sound_0000';
		}else{
			btn.frameName = 'btn_sound_0001';
		}
		game.sound.mute = !game.sound.mute;
		MainGame.isMusicMuted = game.sound.mute;
	},

	playMusic: function (num) {

	},

	stopMusic: function () {

	},

	playSound: function (vNum) {
		if(MainGame.isMuteSound) return;
		if(game.device.webAudio) {
			MainGame["s_sounds"+vNum].play();
		}
	},

	showFps: function (vX, vY) {
		if (typeof vX === 'undefined') vX = 20;
		if (typeof vY === 'undefined') vY = 20;
		game.time.advancedTiming = true;
		MainGame.textFPS = game.add.text(vX, vY, "FPS", {
			font: "20px Arial",
			fill: "#FFFFFF",
			align: "center"
		});
		MainGame.textFPS.fixedToCamera = true;
	},

	addFill: function (vLayer, vColor, vAlpha, vW, vH,posX,posY) {
		if (typeof vAlpha === 'undefined') vAlpha = 1;
		if (typeof posX === 'undefined') posX = 0;
		if (typeof posY === 'undefined') posY = 0;
		if (typeof vW === 'undefined') {
			vW = game.width;
			posX = -vW/2;
		}
		if (typeof vH === 'undefined') {
			vH = game.height;
		}
		var bg = vLayer.add(game.add.graphics(posX, posY));
		bg.beginFill(vColor, vAlpha);
		bg.drawRect(0, 0, vW, vH);
		bg.endFill();
		return bg;
	}
};

var MyMath = {
	getRandomInt: function (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},

	getRandomBool: function () {
		return Math.random() < 0.5 ? true : false;
	},

	shuffleArr: function (o) {
		for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
		return o;
	},

	distanceTwoPoints: function (x1, x2, y1, y2) {
		var dx = x1-x2;
		var dy = y1-y2;
		return dx * dx + dy * dy;
	},

	isPointInRectangle: function (vX, vY, ax, ay, bx, by) {
		return (ax <= vX && vX <= bx && ay <= vY && vY <= by);
	},

	parseQuery: function (qstr) {
		var query = {};
		var a = qstr.substr(1).split('&');
		for (var i = 0; i < a.length; i++) {
			var b = a[i].split('=');
			query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
		}
		return query;
	},

	lerp: function(in_Src, in_Dst, in_Ratio) {
		return (in_Src * (1 - in_Ratio)) + (in_Dst * in_Ratio);
	}
	//Phaser.Utils.chanceRoll(35)
};

function initGameStates(){
	game = new Phaser.Game(MainGame.Config.GAME_WIDTH, MainGame.Config.GAME_HEIGHT, Phaser.AUTO, 'game-container');//AUTO  CANVAS

	game.state.add('Boot', MainGame.Boot, true);
	game.state.add('Preloader', MainGame.Preloader);
	game.state.add('Menu', MainGame.Menu);
	game.state.add('Game', MainGame.Game);
}

function trace(a) {console.log(a);}
