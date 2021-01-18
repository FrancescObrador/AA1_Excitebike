class GamePlay extends Phaser.Scene{
    constructor(){
        super({key: 'GamePlay'});   
    }
    init(levelWithEnemies){
        this.hasEnemies = levelWithEnemies;
    }
    preload(){
        var ruta = 'assets/img/';
        this.load.image('backGround', ruta + 'excitebike_map_1.png'); 
        this.load.image('backGroundLap2', ruta + 'excitebike_map_1_2.png'); 
        this.load.image('backGroundLap3', ruta + 'excitebike_map_1_3.png'); 
        this.load.image('hud', ruta + 'HUD.png'); 

		ruta = 'assets/sounds/';
        this.load.audio('start_beep', ruta + 'start_beep.wav');

        

        Player.loadAssets(this);
        Enemy.loadAssets(this);

        this.load.xml('obsts', 'assets/map1Info.xml');

        this.load.bitmapFont('nesFont', 'assets/fonts/nes_font_0.png', 'assets/fonts/nes_font.xml');

        console.log("resources loaded");
    }
    
    create(){

        this.soundsTable = {};
        this.soundsTable['start_counter'] = this.sound.add('start_beep');
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
        
        //ENEMIES

        //this.enemy = new Enemy(this, 0);
        this.enemies = [];
        if(this.hasEnemies == true){
            this.enemies.push(new Enemy(this, 0));
            this.enemies.push(new Enemy(this, 2));
            this.enemies.push(new Enemy(this, 3));
        }
        // HUD
        this.hud = this.add.image(config.width/2, config.height, 'hud').setOrigin(0.5, 1).setScale(1.1);

        // TEXT
        this.texto = this.add.bitmapText(config.width/2, config.height/3, 'nesFont', "", 10).setOrigin(0.5);
        this.texto.setCenterAlign();

        this.startTime = 5.0;
        this.lapOneTime = 0;
        this.lapTwoTime = 0;
        this.finalTime = 0;

        // HUD
        this.countdownTime = 10.0;
        this.timer = 0;
        this.hudTimer = this.add.bitmapText(config.width/1.25, config.height - 22, 'nesFont', "", 10).setOrigin(0.5).setScale(0.75);

        this.overheatText = this.add.bitmapText(config.width/2, config.height/3, 'nesFont', "OVERHEATH", 10).setOrigin(0.5); 
        this.overheatText.visible = false; 
        this.isGoLaunched = false; 

        this.overHeatUI = this.createBar(config.width/2 - 16, config.height - 26, 35, 9, 0xe85800);
        this.setBarValue(this.overHeatUI, this.pilot.currentHeat);
        
        this.isPaused = false; 
        this.ChangePauseState();
        this.isInforcedPause = true;
        this.inputs.P_Key.on('up', this.ChangePauseState, this); 

        this.beepHasPlayed = false;
        this.endCallMade = false;
    } 
 
    ChangePauseState(){ 
        this.isPaused = !this.isPaused; 
        this.pilot.sprite.active = !this.isPaused; 
    }

    update(){
        console.clear();
        customDeltaTime = 1.0 / juego.loop.actualFps;

        if(this.isInforcedPause){
            this.timer += customDeltaTime;
            console.log(this.timer);
            if(this.timer >= 8.0 && !this.beepHasPlayed) {
                this.beepHasPlayed = true;
                this.soundsTable['start_counter'].play();
            }
            if(this.timer >= this.countdownTime) {
                this.isInforcedPause = false;
                this.ChangePauseState();
                this.timer = 0;
            }
        }

        if(!this.isPaused && !this.isInforcedPause){
            this.timer += customDeltaTime;
            this.pilot.customUpdate(this.inputs);
 
            this.enemies.forEach(enemy => {
                enemy.customUpdate(this.pilotMapPosition,this.pilot.speedX, customDeltaTime);

                if(this.physics.overlap(this.pilot.sprite, enemy.sprite)){
                    if(this.pilot.currentLine == enemy.currentLine){
                        this.pilot.crash();
                    }
                }
            });

            this.setBarValue(this.overHeatUI, this.pilot.currentHeat);
    
            this.overHeatTextHandler(); 
    
            if(this.pilotMapPosition >= this.goal.end && !this.endCallMade)  // finish reached
            {
                this.pilot.playCustomSong(this.pilot.PlayerState.RUNNING);
                this.pilot.hasFinished = true;
                //this.physics.moveTo(this.pilot.sprite, config.width, this.pilot.sprite.y, this.pilot.speedY);
                this.delay = this.time.delayedCall(3000, this.loadRanking, [], this);
                this.endCallMade = true;
            } else if(this.pilotMapPosition >= this.goal.end && this.endCallMade) {
                this.pilot.sprite.x += this.pilot.speedX * customDeltaTime;
            }else{
                this.backGround.x -= (this.pilot.speedX * customDeltaTime);     // container scroll  
                this.pilotMapPosition += (this.pilot.speedX * customDeltaTime); // "real" pilot position
        
                
                this.obstacles.forEach(obstacle => {
                    var playerPos = Math.trunc(this.pilotMapPosition);
                    if(this.isInside(playerPos, obstacle, false, null) ){
                        obstacle.actOnPlayer(this.pilot,playerPos, this.pilot.yPos, this.pilot.expectedLine, obstacle);
                    }
                    for(var i = 0; i< this.enemies.length;i++){
                        var enemyPos = Math.trunc(this.enemies[i].mapPosition);
                        if(this.isInside(enemyPos, obstacle, true, this.enemies[i]) ){
                            obstacle.actOnEnemy(this.enemies[i],enemyPos, this.enemies[i].yPos,this.enemies[i].expectedLine, obstacle);
                        }
                    }
                });
            
                this.timerManager();
            }
        }
        this.pilot.soundsManager();
    }
    
    isInside(positionX, _obstacle, isEnemy, enemy)
    {
        if(positionX >= _obstacle.x && positionX <= _obstacle.end) {
            if(_obstacle.obstSubType == "miniRamp"){
                if(enemy == null){
                    if (this.pilot.currentLine == _obstacle.currentLane || this.pilot.currentLine == _obstacle.currentLane + 1 ||this.pilot.currentLine == _obstacle.currentLane + 2 ) 
                        return true;
                }else{
                    if (enemy.currentLine == _obstacle.currentLane || enemy.currentLine == _obstacle.currentLane + 1 || enemy.currentLine == _obstacle.currentLane + 2 ) 
                        return true;
                }
            }
            if(enemy == null){
                if (this.pilot.currentLine == _obstacle.currentLane || _obstacle.isAllLane) 
                    return true;
            }else{
                if (enemy.currentLine == _obstacle.currentLane || _obstacle.isAllLane) 
                    return true;
            }
        }
        return false;
    }

    eraseText()
    {
      this.texto.text = "";
    }

    timerManager(){
        //TIMER - sets the 3 variables in seconds - float
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

    createBar(x, y, w, h, color){
		//draw the bar
		let bar = this.add.graphics();
            
        //color the bar
        bar.fillStyle(color, 1);
            
        //fill the bar with a rectangle
        bar.fillRect(0, 0, w, h);
                    
        //position the bar
        bar.x = x;
        bar.y = y;
            
        //Bar done
        return bar;
	}
	
	setBarValue(bar, value){
		 //scale the bar
		 bar.scaleX = value;
    }
    
    overHeatTextHandler() { 
        if(this.pilot.isOverHeated){ 
            this.overheatText.visible = !!(parseInt(((this.timer%1)*10)%2)); // this returns alternatively true or fasle every 0.1 seconds 
            if (!this.isGoLaunched) { 
                this.isGoLaunched = true; 
                this.time.delayedCall(2700, ()=> {this.overheatText.text = "GO"; this.isGoLaunched = false;}, [], this); 
            } 
        } else{ 
            this.overheatText.text = "OVERHEAT";
            this.overheatText.visible = this.pilot.isOverHeated; 
        } 
    } 
 

}

