class gameState extends Phaser.Scene{
	constructor(){
		//Llamamos al constructor de la escena
	 	super({key: 'gameState'});
	}
	preload(){
		
	}
	create(){
        this.inputs = new InputManager(this);
	}
	
	update(){
		this.inputs.update();
	}
}
