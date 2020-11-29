const screens = {
	START: 1,
	TRACKS: 2
}

class StartMenu extends Phaser.Scene{
	

	constructor(){
		 super({key: 'StartMenu'});
	}

	preload(){
		var ruta = "assets/img/";
		this.load.image('startScreen', ruta + "initialScreen.jpg");
		this.load.image('tracksScreen', ruta + "tracksScreen.jpg");

		this.load.image('cursor', ruta + "cursor.png");
	}

	create(){

		// Setup inputs
		this.inputs = new InputManager(this);
		this.inputs.Up_Key.on('up', this.CursorUp, this);
		this.inputs.Down_Key.on('up', this.CursorDown, this);
		this.inputs.Left_Key.on('up', this.CursorLeft, this);
		this.inputs.Right_Key.on('up', this.CursorRight, this);
		this.inputs.A_Key.on('up', this.LoadTracksScreen, this);
		//this.inputs.B_Key.on('up', , this);

		// Setup start screen
		this.cursorPositions = new Array(0);
		this.cursor = this.add.image(0, this.cursorPositions[0], 'cursor').setScale(0.25).setOrigin(0);
		this.LoadStartScreen();
	}
	
	update(){
	
	}


	LoadStartScreen()
	{
		console.log("loading start screen");
		this.menu = this.add.image(0, 0, 'startScreen').setScale(0.25).setOrigin(0);
		
		this.cursorPositions =  [125, 145, 160];
		this.cursorState = 0;
		this.cursor.setPosition(config.width/3, this.cursorPositions[this.cursorState]);

		this.cursor.depth = 1;

		this.currentScreen = screens.START;
	}

	LoadTracksScreen()
	{
		console.log("loading tracks screen");
		this.menu = this.add.image(0, 0, 'tracksScreen').setOrigin(0);
		
		this.cursorPositions = [75, 95 ,120, 145, 170];
		this.cursorState = 0;
		this.cursor.setPosition(this.cursorPositions[this.cursorState], config.height/1.45);
		
		this.cursor.depth = 1;

		this.currentScreen = screens.TRACKS;
	}

	CursorUp()
	{
		if(this.currentScreen == screens.START){
			if(this.cursorState == 0) return;
		
			this.cursorState -= 1;
			this.cursor.y = this.cursorPositions[this.cursorState];
		}
	}

	CursorDown()
	{
		if(this.currentScreen == screens.START){
			if(this.cursorState == this.cursorPositions.length -1) return;
			
			this.cursorState +=1;
			this.cursor.y = this.cursorPositions[this.cursorState];
		}
	}

	CursorRight()
	{
		if(this.currentScreen == screens.TRACKS){
			if(this.cursorState == this.cursorPositions.length -1) return;
			
			this.cursorState +=1;
			this.cursor.x = this.cursorPositions[this.cursorState];
		}
	}

	CursorLeft()
	{
		if(this.currentScreen == screens.TRACKS){
			if(this.cursorState == 0) return;
			
			this.cursorState -= 1;
			this.cursor.x = this.cursorPositions[this.cursorState];
		}
	}
}
