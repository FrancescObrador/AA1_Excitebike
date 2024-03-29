const screens = {
	START: 1,
	TRACKS: 2,
	DESIGN: 3
}

class StartMenu extends Phaser.Scene{
	

	constructor(){
		 super({key: 'StartMenu'});
	}

	preload(){
		var ruta = "assets/img/";
		this.load.image('initialScreen', ruta + "initialScreen.jpg");
		this.load.image('tracksScreen', ruta + "tracksScreen.jpg");
		this.load.image('designScreen', ruta + "designScreen.png" )

		this.load.image('cursor', ruta + "cursor.png");


		ruta = 'assets/sounds/';
        this.load.audio('cursor_move', ruta + 'move_cursor.wav');
        this.load.audio('title_screen', ruta + 'title_screen.wav');
        this.load.audio('start_engines', ruta + 'start_your_engines.wav');
	}

	create(){

		this.soundsTable = {};
        this.soundsTable['cursor'] = this.sound.add('cursor_move');
        this.soundsTable['mainMusic'] = this.sound.add('title_screen', {loop: true});
        this.soundsTable['startEngines'] = this.sound.add('start_engines');
		// Setup inputs
		this.inputs = new InputManager(this);
		this.inputs.Up_Key.on('up', this.CursorUp, this);
		this.inputs.Down_Key.on('up', this.CursorDown, this);
		this.inputs.Left_Key.on('up', this.CursorLeft, this);
		this.inputs.Right_Key.on('up', this.CursorRight, this);
		this.inputs.A_Key.on('up', this.LoadModeScreen, this);
		this.inputs.B_Key.on('up', this.LoadStartScreen, this);

		// Setup start screen
		this.cursorPositions = new Array(0);
		this.cursor = this.add.image(0, this.cursorPositions[0], 'cursor').setScale(0.25).setOrigin(0);
		this.LoadStartScreen();
		this.game.sound.stopAll();
		this.soundsTable['mainMusic'].play(); // No se porque no suena en el momento

		this.hasEnemies = false;
	}
	
	update(){
	
	}


	LoadStartScreen()
	{
		console.log("loading start screen");
		
		this.menu = this.add.image(0, 0, 'initialScreen').setScale(0.25).setOrigin(0);
		
		this.cursorPositions =  [128, 144, 160]; // no tocar
		this.cursorState = 0;
		this.cursor.setPosition(config.width/3, this.cursorPositions[this.cursorState]);

		this.cursor.depth = 1;
		this.cursor.setVisible(true); 

		this.currentScreen = screens.START;

	}

	LoadModeScreen()
	{
		if(this.currentScreen == screens.START){
			if(this.cursorState == 0 || this.cursorState == 1){
				console.log("loading tracks screen");

				if(this.cursorState == 1) this.hasEnemies = true;

				this.menu = this.add.image(0, 0, 'tracksScreen').setOrigin(0);
				
				this.cursorPositions = [72, 96 ,120, 144, 168]; // no tocar
				this.cursorState = 0;
				this.cursor.setPosition(this.cursorPositions[this.cursorState], config.height/1.45);
				
				this.cursor.depth = 1;
		
				this.currentScreen = screens.TRACKS;
			}
			else {
				console.log("loading design screen");
				this.menu = this.add.image(0, 0, 'designScreen').setScale(0.25).setOrigin(0);
				this.cursor.setVisible(false);

				this.currentScreen = screens.DESIGN;
			}
		}
		else if (this.currentScreen == screens.TRACKS){
			this.scene.start("GamePlay", this.hasEnemies);
			this.soundsTable['mainMusic'].stop();
			this.soundsTable['startEngines'].play();
			this.scene.stop("StartMenu");
		}
	}

	CursorUp()
	{
		if(this.currentScreen == screens.START){
			if(this.cursorState == 0) return;
			this.soundsTable['cursor'].play();
			this.cursorState -= 1;
			this.cursor.y = this.cursorPositions[this.cursorState];
		}
	}

	CursorDown()
	{
		if(this.currentScreen == screens.START){
			if(this.cursorState == this.cursorPositions.length -1) return;
			this.soundsTable['cursor'].play();
			this.cursorState +=1;
			this.cursor.y = this.cursorPositions[this.cursorState];
		}
	}

	CursorRight()
	{
		if(this.currentScreen == screens.TRACKS){
			if(this.cursorState == this.cursorPositions.length -1) return;
			this.soundsTable['cursor'].play();
			this.cursorState +=1;
			this.cursor.x = this.cursorPositions[this.cursorState];
		}
	}

	CursorLeft()
	{
		if(this.currentScreen == screens.TRACKS){
			if(this.cursorState == 0) return;
			this.soundsTable['cursor'].play();
			this.cursorState -= 1;
			this.cursor.x = this.cursorPositions[this.cursorState];
		}
	}
}
