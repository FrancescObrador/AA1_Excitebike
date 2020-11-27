class StartMenu extends Phaser.Scene{
	constructor(){
		 super({key: 'StartMenu'});
	}
	preload(){

		this.load.image('startScreen', "assets/img/initialScreen.png");

	}

	create(){

		this.menu = this.add.image(0, 0, 'startScreen').setScale(0.25).setOrigin(0);
		
	}
	
	update(){
		
	}
}
