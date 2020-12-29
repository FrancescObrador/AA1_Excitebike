class EndgameMenu extends Phaser.Scene{
	constructor(){
		 super({key: 'EndgameMenu'});
	}

	preload(){
		var ruta = "assets/img/Ranking/";
		this.load.image('screen', ruta + "RankingScreen.png");

		this.textColor = "0x5ce430";

		this.bestTimes = ["1:16:00", "1:26:00", "1:36:00"];	//Excitebike times
		this.bestTimesInFloat = [76, 86, 96];				// Times equivalent

		this.yourTime = 76 // TODO Get the best time from the gameplay scene
		this.position = "#0";

		if(this.yourTime <= this.bestTimesInFloat[0])
		{
			this.position = "#1";
		}
		else if (this.yourTime > this.bestTimesInFloat[0] && this.yourTime <= this.bestTimesInFloat[1])
		{
			this.position = "#2";
		}
		else if (this.yourTime > this.bestTimesInFloat[1] && this.yourTime <= this.bestTimesInFloat[2])
		{
			this.position = "#3"
		}
		else 
		{
			// You loose
		}

		// Convert yourtime to string time

		this.load.bitmapFont('nesFont', 'assets/fonts/nes_font_0.png', 'assets/fonts/nes_font.xml');

		console.log("Resources loaded!");
	}

	create(){

		// Setup inputs
		this.inputs = new InputManager(this);
		this.inputs.A_Key.on('up', this.loadStartMenu, this);

		// Setup menu
		this.menu = this.add.image(0, 0, 'screen').setScale(1).setOrigin(0);
		if(this.position == "#1"){
			this.bestTimeText = this.add.bitmapText(config.width/1.45, config.height/1.95, 'nesFont', this.yourTime, 8).setOrigin(0.5); 
		}
		else{
			this.bestTimeText = this.add.bitmapText(config.width/1.45, config.height/1.95, 'nesFont', this.bestTimes[0], 8).setOrigin(0.5); 
		}
		this.bestTimeText.tint = this.textColor;
		
		this.yourTimeText = this.add.bitmapText(config.width/1.45, config.height/1.7, 'nesFont', this.yourTime, 8).setOrigin(0.5); 
		this.rankingText = this.add.bitmapText(config.width/1.45, config.height/1.55, 'nesFont', this.position, 8).setOrigin(0.5); 
	}
	
	update(){
	
	}

	loadStartMenu()
	{
		this.scene.start("StartMenu");
	}
}
