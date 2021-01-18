
class Enemy {
    static animsCreated = false;

    constructor(scene, newLine){

        this.currScene = scene;
        this.accelerationRate = 2.5;

        this.gravity = 10;
        this.speedX = 0;
        this.speedY = 30;
        this.jumpStr = 2;
        this.maxSpeedXReduced = 100;
        this.maxSpeedXNormal = 200;
        this.maxSpeedXBoost = 250;
        this.maxSpeedX = this.maxSpeedXNormal;
        this.currentLine = newLine;
       
        this.isTurning = false;
        this.isOnAir = false;
        this.isFalling = false;
        this.isOnRamp = false;
        this.isOnRampError = 0.25;
        this.isSpeedReduced = false;

        this.isOnCrush = false;
        
        this.lines = [162,150,138,125,116];
        this.linesX = [70,86 ,102,117];
        this.minY = this.lines[this.currentLine];
        this.OriginalXPos = this.linesX[this.currentLine];
        this.sprite = this.currScene.physics.add.sprite(this.OriginalXPos, this.lines[this.currentLine],'enemy_pilotStanding');
        if(!this.animsCreated)this.createAnims();
        this.sprite.anims.play('enemy_moving',false);       
        this.tiltCounter = 0;
        this.frontTiltCounter = -1;
        this.wheeliesTiltCounter = -1;
        this.wheeliesCounter = -1;
        this.isOnWheelies;
        this.yPos = this.sprite.y;
          
        this.PressA = false;
        this.PressB = false;
        this.PressForward = false;
        this.mapPosition = this.linesX[this.currentLine];
        this.isActive = true;
        this.rnd = new Phaser.Math.RandomDataGenerator(config.seed);
        this.maxSpeedXNormalBase = this.rnd.between(190,210); //velocitat base random

        this.freeLine = false;
        this.confirmedFreeLine = false;
    } 

    static loadAssets(scene){
        var ruta = 'assets/img/enemy_purple/';
        scene.load.image('enemy_motorbike',ruta + 'motorbike.png');
        scene.load.spritesheet('enemy_pilotLoop', ruta + 'pilot_loop.png', {frameWidth: 98/4, frameHeight: 24});
        scene.load.spritesheet('enemy_pilotGetUp', ruta + 'pilot_get_up.png', {frameWidth: 77/3, frameHeight: 21});
        scene.load.spritesheet('enemy_pilotMoving', ruta + 'pilot_moving.png',{frameWidth: 40/2, frameHeight: 21});
        scene.load.spritesheet('enemy_pilotRunning', ruta + 'pilot_running.png',{frameWidth: 28/2, frameHeight: 16});
        scene.load.image('enemy_pilotTurnLeft',ruta + 'pilot_turning_left.png');
        scene.load.image('enemy_pilotTurnRight',ruta + 'pilot_turning_right.png');
        scene.load.image('enemy_pilotStanding',ruta + 'pilot_standing.png');
        scene.load.image('enemy_pilot_front_tilt_0',ruta + 'pilot_front_tilt_0.png');
        scene.load.image('enemy_pilot_front_tilt_1',ruta + 'pilot_front_tilt_1.png');
        scene.load.image('enemy_pilot_front_tilt_2',ruta + 'pilot_front_tilt_2.png');
        scene.load.image('enemy_pilot_front_tilt_3',ruta + 'pilot_front_tilt_3.png');
        scene.load.image('enemy_pilot_wheelies_0',ruta + 'pilot_wheelies_0.png');
        scene.load.image('enemy_pilot_wheelies_1',ruta + 'pilot_wheelies_1.png');
        scene.load.image('enemy_pilot_wheelies_2',ruta + 'pilot_wheelies_2.png');
        scene.load.image('enemy_pilot_wheelies_3',ruta + 'pilot_wheelies_3.png');
        scene.load.image('enemy_pilot_wheelies_4',ruta + 'pilot_wheelies_4.png');
        scene.load.image('enemy_pilot_wheelies_5',ruta + 'pilot_wheelies_5.png');
        this.minY = 0;

    }

    customUpdate(playerX,playerVX,dt){

        this.maxSpeedXNormal = this.rnd.between(this.maxSpeedXNormalBase-10,this.maxSpeedXNormalBase+10); //velocitat base + increment random

        this.sprite.x = this.linesX[1] - (playerX - this.mapPosition); //ajustar la seva posicio en pantalla per cuadrar amb visio del player

        if(this.sprite.x <= -100){

            this.mapPosition += (config.width + 200);
            this.maxSpeedXNormalBase = this.rnd.between(190,210);

            this.isOnAir = false;
            this.isFalling = false;
            this.isOnRamp = false;
            this.freeLine = true;
        }
        else if(this.sprite.x >= config.width + 100){

            this.mapPosition -= (config.width + 200);
            this.maxSpeedXNormalBase = this.rnd.between(190,210);

            this.isOnAir = false;
            this.isFalling = false;
            this.isOnRamp = false;
            this.freeLine = true;
        }
        if(this.confirmedFreeLine){

            this.minY = this.lines[this.currentLine];
            this.yPos = this.minY;
            this.sprite.y = this.minY;
            this.confirmedFreeLine = false;
            this.freeLine = false;
        }


        if(this.isActive){

        
            this.PressA = true;
            // Crash Handle
            if(this.isOnCrash) {
                this.handleCrash();
                return;
            }

            if (this.PressA){ 
                this.maxSpeedX = this.maxSpeedXNormal;   
                this.speedX += this.accelerationRate; 
            
            
            }
            else if(this.speedX > 0) {
                this.speedX -= this.accelerationRate;
            }
            
            if(this.currentLine == this.lines.length-1) this.isSpeedReduced = true;
            
            if(this.isSpeedReduced){
                this.maxSpeedX = this.maxSpeedXReduced;
            }
            
            if(this.speedX <= 0){ //si velocitat menor que 0 la posem a 0
                this.speedX = 0;
                this.sprite.setTexture('enemy_pilotStanding');
            }
            else if(this.speedX > this.maxSpeedX){ //sino " i la velocitat major que la maxima la posem a maxima
                this.speedX = this.maxSpeedX;
                
            }
            this.mapPosition += this.speedX * dt; 

            //Y velocity
            if(this.isFalling){ //jugador esta caient
                

                if(this.isOnRamp == true){
                    this.sprite.body.velocity.y += (this.gravity);

                    if(this.sprite.y >= this.lines[this.currentLine] - this.minY){
                        this.sprite.body.velocity.y = 0;
                        this.sprite.y = this.lines[this.currentLine]  - this.minY;
                    }
                }
                else if(this.sprite.y >= this.lines[this.currentLine]){ //si ha arribat a la linea on estava el frenem i resetejem booleanes
                    this.sprite.body.velocity.y = 0;
                    this.sprite.y = this.lines[this.currentLine];
                    this.isFalling = false;
                    this.isOnAir = false;
                    this.tiltCounter = 0;

                    if(this.frontTiltCounter >= 1){ //si esta tiltejada cap endevan crasheja o si esta molt proper a la rampa no

                        this.frontTiltCounter = -1;
                        this.wheeliesTiltCounter = -1;
                        this.wheeliesCounter = -1;
                        
                        // var aux = this.lines[this.currentLine] - this.minY - this.yPos;
                        // if(aux < 0){
                        //     aux *= -1;
                        // }
                        // if(aux <= this.isOnRampError){
                        //     console.log("alive");
                        // }
                        // else{
                        //     console.log("crashed");
                        //     this.isOnCrash;
                        // }
                        
                    }

                    else if(this.wheeliesTiltCounter >= 0){ //si esta fent wheelies reduim velocitat (cal revisar valors)
                        if(this.wheeliesTiltCounter >= 4){
                            if(this.speedX > this.maxSpeedXBoost){
                                this.speedX *= 0.3;
                            }
                            else{
                                this.speedX *= 0.4;
                            }
                            
                        }
                        else if(this.wheeliesTiltCounter >= 2){
                            if(this.speedX > this.maxSpeedXBoost){
                                this.speedX *= 0.5;
                            }
                            else{
                                this.speedX *= 0.6;
                            }
                            
                        }
                        else if(this.wheeliesTiltCounter >= 0){
                            if(this.speedX > this.maxSpeedXBoost){
                                this.speedX *= 0.8;
                            }
                            else{
                                this.speedX *= 0.9;
                            }
                        }
                        this.wheeliesCounter = this.wheeliesTiltCounter;
                    }
                    else{
                        this.frontTiltCounter = -1;
                        this.wheeliesTiltCounter = -1;
                        this.wheeliesCounter = -1;
                    }
                
                    

                }
                else{
                    this.sprite.body.velocity.y += (this.gravity); //sino simulem gravetat
                }

                
                if(this.frontTiltCounter >= 0){
                    this.sprite.setTexture('enemy_pilot_front_tilt_' + this.frontTiltCounter);
                }
                else if(this.wheeliesTiltCounter >= 0){
                    this.sprite.setTexture('enemy_pilot_wheelies_' + this.wheeliesTiltCounter);
                }
                    
            }
            else if(this.isOnAir){
                if(this.wheeliesTiltCounter >= 0){
                    this.sprite.setTexture('enemy_pilot_wheelies_' + this.wheeliesTiltCounter);
                }
            }
            else if(!this.isOnAir){ //sino esta al aire (aire comença quan pujem la rampa)
                if(!this.isTurning) { //sino estem cambiant de carril
                    
                    
                    if(this.wheeliesCounter >= 0){this.isOnWheelies = true;} 
                    else {this.isOnWheelies = false;}

                    if(this.isOnWheelies){
                        this.tiltCounter++; 
                        if(this.tiltCounter > 4){
                            this.tiltCounter = 0;
                            this.wheeliesCounter--;
                        }
                        

                        if(this.wheeliesCounter >= 0){
                            this.sprite.setTexture('enemy_pilot_wheelies_' + this.wheeliesCounter);
                        }
                    }
                    
                }
                

            }

            //FIX THIS SHIT - o potser no eh
            if(!this.isOnAir && !this.isTurning){
                this.sprite.y = this.lines[this.currentLine];
            
            }
            // NO eliminar
            this.yPos = this.sprite.y;
            this.expectedLine = this.lines[this.currentLine];
            this.isSpeedReduced = false;
            this.isOnRamp = false;

            this.sprite.depth = this.lines.length + 1 - this.currentLine;

        }
    }

    rampActivate(strength){
        if(this.isTurning){
            this.isTurning = false;
            this.sprite.body.stop();
        }

        this.isOnAir = true;
        this.isFalling = false;
        this.isOnRamp = true;
        this.sprite.body.velocity.y = -this.speedX * strength * this.jumpStr;
        
        if(strength > 0.78){
            this.wheeliesTiltCounter = 3;
        }
        else if(strength > 0.75){
            this.wheeliesTiltCounter = 2;
        }
        else if(strength > 0.48){
            this.wheeliesTiltCounter = 0;
        }

        if(this.wheeliesTiltCounter <= this.wheeliesCounter){
            this.wheeliesTiltCounter = this.wheeliesCounter;
        }
        else{
            this.wheeliesCounter = -1;
        }

    }
    rampDeactivate(height){
        this.isFalling = true;
        this.minY = height;
        this.isOnRamp = true;
    }

    createAnims(){
        this.animsCreated = true;
        this.currScene.anims.create({
            key: 'enemy_running',
            frames: this.currScene.anims.generateFrameNumbers('enemy_pilotRunning', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.currScene.anims.create({
            key: 'enemy_moving',
            frames: this.currScene.anims.generateFrameNumbers('enemy_pilotMoving', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.currScene.anims.create({
            key: 'enemy_loop',
            frames: this.currScene.anims.generateFrameNumbers('enemy_pilotLoop', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.currScene.anims.create({
            key: 'enemy_getUp',
            frames: this.currScene.anims.generateFrameNumbers('enemy_pilotGetUp', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });
    }

    crash() { // Generic Crash
        this.isOnCrash = true;
        this.currScene.physics.moveTo(this.sprite, this.OriginalXPos, this.lines[this.lines.length-1], this.speedY);
        this.speedX = 0;
        this.sprite.setTexture('enemy_pilotStanding');
    }

    handleCrash() { // Function to handle every type of Crash (Go-out sequence) 
        if( this.sprite.y <= this.lines[this.lines.length-1]){
            this.sprite.body.stop();
            this.currentLine = this.lines.length-1;
            
        }
    }


    preUpdate(){

    } 

    
}