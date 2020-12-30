class EndgameMenu extends Phaser.Scene{
	constructor(){
		 super({key: 'EndgameMenu'});
	}

	init(data)
	{
		this.yourTime = data.time;
	}

	preload(){
		var ruta = "assets/img/Ranking/";
		this.load.image('screen', ruta + "RankingScreen.png");
		this.load.image('podium1', ruta + "podium_1.png");
		this.load.image('podium2', ruta + "podium_2.png");
		this.load.image('podium3', ruta + "podium_3.png");
		this.load.image('podium4', ruta + "podium_4.png");
		this.load.spritesheet('winner', ruta + 'winner.png', {frameWidth: 16/2, frameHeight: 16});

		this.textColor = "0x5ce430";	// Bright green

		this.bestTimes = "1:16:00";	//Excitebike times
		this.bestTimesInFloat = [76, 86, 96, 106, 116, 126, 136, 146, 156, 166, 176, 186]; 	// rank times

		this.position = "#";

		for(var i = 1; i <= this.bestTimesInFloat.length; i++){
			if(this.yourTime <= this.bestTimesInFloat[i-1]){
				this.position += i.toString();
				//this.loadPodium(i);
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
		
		this.bestTimeText = this.add.bitmapText(config.width/1.45, config.height/1.95, 'nesFont', this.bestTimes, 8).setOrigin(0.5); 
		this.bestTimeText.tint = this.textColor;
		
		this.yourTimeText = this.add.bitmapText(config.width/1.45, config.height/1.7, 'nesFont', this.yourTime, 8).setOrigin(0.5); 
		this.rankingText = this.add.bitmapText(config.width/1.45, config.height/1.55, 'nesFont', this.position, 8).setOrigin(0.5); 

		// Podium
		this.pilot = this.add.sprite(config.width/2, config.height/4.25, 'winner').setOrigin(1, 0);
		
		this.anims.create({
            key: 'winnerAnim',
            frames: this.anims.generateFrameNumbers('winner', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
		});
		
		this.pilot.play('winnerAnim');

		var pos = parseInt(this.position.charAt(1));
		this.loadPodium(pos)
	}
	
	update(){
	
	}

	loadStartMenu()
	{
		this.scene.start("StartMenu");
	}

	loadPodium(podiumPos) {
		switch(podiumPos){
			case 1: 
				this.podium = this.add.sprite(config.width/2, config.height/4.25, 'podium1').setOrigin(0.65, 0);
				break;
			case 2:
				this.podium = this.add.sprite(config.width/2, config.height/4.25, 'podium2').setOrigin(0.65, 0);
				this.pilot.setPosition(this.pilot.x - 8, this.pilot.y + 8);
				break;
			case 3:
				this.podium = this.add.sprite(config.width/2, config.height/4.25, 'podium3').setOrigin(0.65, 0);
				this.pilot.setPosition(this.pilot.x + 8, this.pilot.y + 8);
				break;
			default:
				this.podium = this.add.sprite(config.width/2, config.height/4.25, 'podium4').setOrigin(0.65, 0);
				this.pilot.setActive(false);
				break;
		}
		this.podium.depth = 1;
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
