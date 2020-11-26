class StartMenu extends Phaser.Scene{
	constructor(){
		//Llamamos al constructor de la escena
		 super({key: 'StartMenu'});
	}
	preload(){

		this.load.bitmapFont('nesFont', 'assets/fonts/nes_font_0.png', 'assets/fonts/nes_font.xml');

	}

	create(){


		this.texto = this.add.bitmapText(10, 10, 'nesFont', "SELECTION A", 10);
	}
	
	update(){
		
	}

}
