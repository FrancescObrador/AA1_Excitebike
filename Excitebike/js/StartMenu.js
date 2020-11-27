class StartMenu extends Phaser.Scene{
	constructor(){
		 super({key: 'StartMenu'});
	}
	preload(){
		var ruta = "assets/img/";
		this.load.image('startScreen', ruta + "initialScreen.jpg");
		this.load.image('cursor', ruta + "cursor.png");
		
	}

	create(){

		this.menu = this.add.image(0, 0, 'startScreen').setScale(0.25).setOrigin(0);
		
		// CUrsor setup
		this.cursorPositions =  new Array(125 , 145, 160);
		this.cursorState = 0;
		this.cursorUpdated = true;
		this.cursor = this.add.image(config.width/3, this.cursorPositions[this.cursorState], 'cursor').setScale(0.25).setOrigin(0);
		
		this.cursors = this.input.keyboard.createCursorKeys();

		this.cursors.up.on('up', this.CursorUp, this);
		this.cursors.down.on('down', this.CursorDown, this);

	}
	
	update(){
	
	}

	CursorUp()
	{
		if(this.cursorState == 0) return;
		
		this.cursorState -= 1;
		this.cursor.y = this.cursorPositions[this.cursorState];
	}

	CursorDown()
	{
		if(this.cursorState == this.cursorPositions.length -1) return;
		
		this.cursorState +=1;
		this.cursor.y = this.cursorPositions[this.cursorState];
	}
}
