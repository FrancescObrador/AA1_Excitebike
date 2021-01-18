var config = {
    type: Phaser.AUTO,
    width: 256, 
    height: 240, 
    scene: [StartMenu, GamePlay, EndgameMenu],  
	antialias: false,
    render:{pixelArt:true},
	scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
	physics:{
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
			debug: false
        }
    },
};

var juego = new Phaser.Game(config);
var customDeltaTime = 1;
var framerate = 60; 