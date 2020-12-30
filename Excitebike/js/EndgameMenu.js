class EndgameMenu extends Phaser.Scene{
	constructor(){
		 super({key: 'EndgameMenu'});
	}

	init(data)
	{
		this.yourTime = data.time;
		console.clear()
	}

	preload(){
		var ruta = "assets/img/Ranking/";
		this.load.image('screen', ruta + "RankingScreen.png");

		this.textColor = "0x5ce430";	// Bright green

		this.bestTimes = ["1:16:00", "1:26:00", "1:36:00"];	//Excitebike times
		this.bestTimesInFloat = [76, 86, 96, 106, 116, 126, 136, 146, 156, 166, 176, 186]; 	// Times equivalent

		this.position = "#";

		for(var i = 0; i < this.bestTimesInFloat.length; i++){
			if(this.yourTime <= this.bestTimesInFloat[i]){
				this.position += (i+1).toString();
				break;
			}
		}

		this.yourTime = this.convertToTime(this.yourTime);

		this.load.bitmapFont('nesFont', 'assets/fonts/nes_font_0.png', 'assets/fonts/nes_font.xml');

		console.log("Resources loaded!");
	}

	create(){

		// Setup inputs
		this.inputs = new InputManager(this);
		this.inputs.A_Key.on('up', this.loadStartMenu, this);

		// Setup menu
		this.menu = this.add.image(0, 0, 'screen').setScale(1).setOrigin(0);
		
		this.bestTimeText = this.add.bitmapText(config.width/1.45, config.height/1.95, 'nesFont', this.bestTimes[0], 8).setOrigin(0.5); 
		this.bestTimeText.tint = this.textColor;
		
		this.yourTimeText = this.add.bitmapText(config.width/1.45, config.height/1.7, 'nesFont', this.yourTime, 8).setOrigin(0.5); 
		this.rankingText = this.add.bitmapText(config.width/1.45, config.height/1.55, 'nesFont', this.position, 8).setOrigin(0.5); 
	}
	
	update(){
	
	}

	loadStartMenu()
	{
		//this.scene.start("StartMenu");
	}

	convertToTime(time)
    {
		 //Convert seconds into minutes and seconds
		 var minutes = Math.floor(time / 60);
		 var seconds = Math.floor(time) - (60 * minutes);
		 var millis = ((time - Math.floor(time)) * 100).toFixed(0);
 
		 //Display minutes, add a 0 to the start if less than 10
		 var result = (minutes < 10) ? "0" + minutes : minutes; 
 
		 //Display seconds, add a 0 to the start if less than 10
		 result += (seconds < 10) ? ":0" + seconds : ":" + seconds; 

		 //Display millis, add a 0 to the start if less than 10
		 result += (millis < 10)? ":0" + millis : ":" + millis;

		 return result
    }
}
