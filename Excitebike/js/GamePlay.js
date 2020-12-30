class GamePlay extends Phaser.Scene{
    constructor(){
        super({key: 'GamePlay'});
   }

    preload(){
        var ruta = 'assets/img/';
        this.load.image('backGround', ruta + 'excitebike_map_1.png');
        this.load.image('backGroundLap2', ruta + 'excitebike_map_1_2.png');
        this.load.image('backGroundLap3', ruta + 'excitebike_map_1_3.png');
        this.load.image('hud', ruta + 'HUD.png');

        ruta += 'pilot/';
        this.load.image('motorbike',ruta + 'motorbike.png');
        this.load.spritesheet('pilotLoop', ruta + 'pilot_loop.png', {frameWidth: 98/4, frameHeight: 24});
        this.load.spritesheet('pilotFrontTilt', ruta + 'pilot_front_tilt.png', {frameWidth: 92/4, frameHeight: 25}); //sa de fer depenent de input, no amb animacio
        this.load.spritesheet('pilotWheelies', ruta + 'pilot_wheelies.png', {frameWidth: 138/6, frameHeight: 26});//sa de fer depenent de input, no amb animacio
        this.load.spritesheet('pilotGetUp', ruta + 'pilot_get_up.png', {frameWidth: 77/3, frameHeight: 21});
        this.load.spritesheet('pilotMoving', ruta + 'pilot_moving.png',{frameWidth: 40/2, frameHeight: 21});
        this.load.spritesheet('pilotRunning', ruta + 'pilot_running.png',{frameWidth: 28/2, frameHeight: 16});
        this.load.image('pilotTurnLeft',ruta + 'pilot_turning_left.png');
        this.load.image('pilotTurnRight',ruta + 'pilot_turning_right.png');
        this.load.image('pilotStanding',ruta + 'pilot_standing.png');
        
        this.load.xml('obsts', 'assets/map1Info.xml');

        this.load.bitmapFont('nesFont', 'assets/fonts/nes_font_0.png', 'assets/fonts/nes_font.xml');

        console.log("resources loaded");
    }
    
    create(){

        // OBSTACLES XML
        var list = this.cache.xml.get('obsts');
        var obstacles = list.getElementsByTagName('obstacle');
        var myObstacles = new Array(obstacles.length);
      
        for (var i = 0; i < obstacles.length; ++i)
        {
            var item = obstacles[i];
            var type = item.getAttribute('type');
            var position = parseInt(item.getAttribute('position'), 10);
            var lane = parseInt(item.getAttribute('lane'), 10);
            
            myObstacles[i] = new Obstacle(this, type, position, lane); 

            // Laps ramps set
            if(myObstacles[i].isLap1) this.lap1 = myObstacles[i];
            if(myObstacles[i].isLap2) this.lap2 = myObstacles[i];
            if(myObstacles[i].isFinish) this.goal = myObstacles[i];
        }
        this.obstacles = myObstacles;

        this.lapMap1 = this.add.image(0, 0, 'backGround').setOrigin(0).setScale(1);
        this.lapMap2 = this.add.image(this.lapMap1.width, 0, 'backGroundLap2').setOrigin(0).setScale(1);
        this.lapMap3 = this.add.image(this.lapMap1.width + this.lapMap2.width, 0, 'backGroundLap3').setOrigin(0).setScale(1);
       
        this.backGround = this.add.container();
        this.backGround.add([this.lapMap1, this.lapMap2, this.lapMap3]);

        // PLAYER
        this.pilot = new Player(this, 1);
        
        this.pilotMapPosition = this.pilot.sprite.x;

        this.inputs = new InputManager(this);

        // HUD
        this.hud = this.add.image(config.width/2, config.height, 'hud').setOrigin(0.5, 1).setScale(1.1);

        // TEXT
        this.texto = this.add.bitmapText(config.width/2, config.height/3, 'nesFont', "", 10).setOrigin(0.5);
        this.texto.setCenterAlign();

        this.startTime = 5.0;
        this.lapOneTime = 0;
        this.lapTwoTime = 0;
        this.finalTime = 0;

        this.hudTimer = this.add.bitmapText(config.width/1.25, config.height - 22, 'nesFont', "", 10).setOrigin(0.5).setScale(0.75);

    }

    update(){

        this.pilot.customUpdate(this.inputs);

        if(this.pilotMapPosition >= this.goal.end)  // finish reached
        {
            this.physics.moveTo(this.pilot.sprite, config.width, this.pilot.sprite.y, this.pilot.speedY);
            this.delay = this.time.delayedCall(3000, this.loadRanking, [], this);
        } else {
            this.backGround.x -= this.pilot.speedX;     // container scroll  
            this.pilotMapPosition += this.pilot.speedX; // "real" pilot position
        }
        
        this.obstacles.forEach(obstacle => {
           var playerPos = Math.trunc(this.pilotMapPosition);
            if(this.isInside(playerPos, obstacle) ){
                console.log(playerPos);
                console.log("A " + obstacle.type + ": " + obstacle.x.toString() + " - " + obstacle.end.toString());
            }
        });
       
        //TIMER - sets the 3 variables in seconds - float
        this.timer = (this.game.getTime()/1000)- this.startTime;
        this.hudTimer.text = this.convertToTime(this.timer);
        
        if(this.pilotMapPosition >= this.lap1.end && this.lapOneTime == 0){
            this.lapOneTime = this.timer;
            this.texto.text = "Lap \n" + this.convertToTime(this.lapOneTime);
            this.lifespan = this.time.delayedCall(3000, this.eraseText, [], this);
        }
        if(this.pilotMapPosition >= this.lap2.end && this.lapTwoTime == 0){
            this.lapTwoTime = this.timer;
            this.texto.text = "Lap \n" + this.convertToTime(this.lapTwoTime);
            this.lifespan = this.time.delayedCall(3000, this.eraseText, [], this);
        }  
        if(this.pilotMapPosition >= this.goal.end && this.finalTime == 0){
            this.finalTime = this.timer;
            this.texto.text = "Lap \n" + this.convertToTime(this.finalTime);
            this.lifespan = this.time.delayedCall(3000, this.eraseText, [], this);
        } 
    }
    
    isInside(positionX, _obstacle)
    {
        if(positionX >= _obstacle.x && positionX <= _obstacle.end) {
            if (this.pilot.currentLine == _obstacle.currentLane || _obstacle.isAllLane) 
            return true;
        }
        return false;
    }

    eraseText()
    {
      this.texto.text = "";
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

    loadRanking()
    {
        this.scene.start("EndgameMenu", {time: this.finalTime});
        this.scene.stop("GamePlay");
    }
}

