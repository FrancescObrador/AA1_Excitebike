class gameState extends Phaser.Scene{
	constructor(){
		//Llamamos al constructor de la escena
	 	super({key: 'gameState'});
	}
	preload(){
		
	}
	create(){
		this.inputs = new InputManager(this);
		this.DEBUG_TEXT = this.add.text(0,0,'Debug',{fontFamily: 'Arial', fontSize: '10px', color: '#f3ff00'});
	}
	
	update(){
		this.inputs.update();
	}
}
