class gameplay extends Phaser.Scene{
	constructor(){
		//Llamamos al constructor de la escena
	 	super({key: 'gameplay'});
	}
	preload(){
		var rutaImg = 'assets/img/';
		this.load.image('bg', rutaImg + 'TestFondo.png');        	
		this.load.image('kirb', rutaImg + 'testChar.png');        	
		// Acordarse de cargar timers y esas cosas con su offset
	}
	create(){
		this.bg = this.add.tileSprite(0, 0, config.width, config.height, 'bg').setOrigin(0);
		this.speed = 1.15; // Probablemente limitar a 1-1.5
		this.kirbTest = this.add.sprite(35,175,'kirb').setOrigin(0.5).setScale(1);
	}
	
	update(){
		// Acceder a la velocidad(Hardcodearla por ahora hasta tener el player)
		this.bg.tilePositionX += this.speed; // scroll   
		this.kirbTest.rotation = this.kirbTest.rotation + 0.05;
	}
}
