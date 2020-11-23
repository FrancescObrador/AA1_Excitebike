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
		
		console.clear();
		console.log("aDown",this.inputs.A_Key.isDown);
		console.log("bDown",this.inputs.B_Key.isDown);
		console.log("upDown",this.inputs.Up_Key.isDown);
		console.log("downDown",this.inputs.Down_Key.isDown);
		console.log("leftDown",this.inputs.Left_Key.isDown);
		console.log("rightDown",this.inputs.Right_Key.isDown);
	}

}
