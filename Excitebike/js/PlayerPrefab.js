class Player {
    static animsCreated = false;
    static soundsCreated = true;

    
    PlayerState = {
        STOPED: "STOPPED",
        RUNNING: "RUNNING",
        SLOWING_DOWN: "SLOWING DOWN",
        CRASHED: "CRASH",
        RUNNING_BOOST: "BOOST",
        REDUCED_SPEED: "REDUCED SPEED"
    };
    constructor(scene, newLine){

        this.state = this.PlayerState.STOPED;
        this.prevState = this.PlayerState.RUNNING;
        this.currScene = scene;
        this.accelerationRate = 2.5;
        this.overheatRate = 0.1;
        this.gravity = 10;
        this.speedX = 0;
        this.speedY = 30;
        this.jumpStr = 2;
        this.maxSpeedXReduced = 100;
        this.maxSpeedXNormal = 200;
        this.maxSpeedXBoost = 10000;
        this.isOnRampError = 0.25;
        this.maxSpeedX = this.maxSpeedXNormal;
        this.currentLine = newLine;
        
        // States
        this.hasFinished = false;
        this.isTurning = false;
        this.isOnAir = false;
        this.isFalling = false;
        this.isOnRamp = false;
        this.isSpeedReduced = false;
        this.isOverheated = false;
        this.isOnCrush = false;
        this.crashHandled = false;
        this.isOnWheelies;
        
        this.lines = [162,150,138,125,116];
        this.linesX = [70,86 ,102,117];
        this.minY = this.lines[this.currentLine];
        this.OriginalXPos = this.linesX[this.currentLine];
        this.sprite = this.currScene.physics.add.sprite(this.OriginalXPos, this.lines[this.currentLine],'pilotStanding');
        if(!this.animsCreated) this.createAnims();
        if(!this.soundsCreated) this.createSounds();
        this.sprite.anims.play('moving',false);       
        this.tiltCounter = 0;
        this.frontTiltCounter = -1;
        this.wheeliesTiltCounter = -1;
        this.wheeliesCounter = -1;
        this.yPos = this.sprite.y;
        
        this.baseHeat = 0.25;
        this.currentHeat = this.baseHeat;    
        
        this.lastTiltFront = false;
        this.justLanded = false;
    } 

    static loadAssets(scene){
        var ruta = 'assets/img/pilot/';
        scene.load.image('motorbike',ruta + 'motorbike.png');
        scene.load.spritesheet('pilotLoop', ruta + 'pilot_loop_f.png', {frameWidth: 98/4, frameHeight: 24});
        scene.load.spritesheet('pilotGetUp', ruta + 'pilot_get_up.png', {frameWidth: 77/3, frameHeight: 21});
        scene.load.spritesheet('pilotMoving', ruta + 'pilot_moving.png',{frameWidth: 40/2, frameHeight: 21});
        scene.load.spritesheet('pilotRunning', ruta + 'pilot_running.png',{frameWidth: 28/2, frameHeight: 16});
        scene.load.image('pilotTurnLeft',ruta + 'pilot_turning_left.png');
        scene.load.image('pilotTurnRight',ruta + 'pilot_turning_right.png');
        scene.load.image('pilotStanding',ruta + 'pilot_standing.png');
        scene.load.image('pilot_front_tilt_0',ruta + 'pilot_front_tilt_0.png');
        scene.load.image('pilot_front_tilt_1',ruta + 'pilot_front_tilt_1.png');
        scene.load.image('pilot_front_tilt_2',ruta + 'pilot_front_tilt_2.png');
        scene.load.image('pilot_front_tilt_3',ruta + 'pilot_front_tilt_3.png');
        scene.load.image('pilot_wheelies_0',ruta + 'pilot_wheelies_0.png');
        scene.load.image('pilot_wheelies_1',ruta + 'pilot_wheelies_1.png');
        scene.load.image('pilot_wheelies_2',ruta + 'pilot_wheelies_2.png');
        scene.load.image('pilot_wheelies_3',ruta + 'pilot_wheelies_3.png');
        scene.load.image('pilot_wheelies_4',ruta + 'pilot_wheelies_4.png');
        scene.load.image('pilot_wheelies_5',ruta + 'pilot_wheelies_5.png');
        scene.load.spritesheet('pilot_bike_fall', ruta + 'pilot_bike_fall.png', {frameWidth: 60, frameHeight: 50});
        this.minY = 0;

        ruta = 'assets/sounds/';
        scene.load.audio('sfx_acc_normal', ruta + 'pilot_acc_normal.wav');
        scene.load.audio('sfx_acc_boost', ruta + 'pilot_acc_boost.wav'); 
        scene.load.audio('sfx_acc_reduced', ruta + 'pilot_acc_reduced.wav');
        scene.load.audio('sfx_acc_none', ruta + 'pilot_acc_none.wav'); 
        scene.load.audio('sfx_crash', ruta + 'pilot_crash.wav');
        scene.load.audio('sfx_jump_normal', ruta + 'pilot_jump_normal.wav');
        scene.load.audio('sfx_jump_super', ruta + 'pilot_jump_super.wav');

    }

    customUpdate(inputs){

        if(this.currentHeat > this.baseHeat) this.currentHeat -= this.overheatRate/2 * customDeltaTime;

        if(this.currentHeat == 1){
            //TODO Implement "Crash"
            // Overheat Handle
            this.isOverHeated = true;
            this.crash();
        }
        
        // Crash Handle
        if(this.isOnCrash) {
            this.handleCrash();
            return;
        }
        // Darle prioridad al boost para poder pulsar espacio + shift en el modo boost
        if(inputs.B_Key.isDown){
            this.state = this.PlayerState.RUNNING_BOOST;
            this.speedX += this.accelerationRate;
            this.maxSpeedX = this.maxSpeedXBoost;
            if(this.currentHeat < 1) this.currentHeat += this.overheatRate*1.5 * customDeltaTime;
        } else if (inputs.A_Key.isDown){ 
            this.maxSpeedX = this.maxSpeedXNormal;   
            this.speedX += this.accelerationRate;
            this.state = this.PlayerState.RUNNING;
            if (this.currentHeat < 0.5 && !this.isOnAir && !this.isOnRamp) {
                this.currentHeat += this.overheatRate * customDeltaTime;
            }
        }
        else if(inputs.B_Key.isDown){
            this.speedX += this.accelerationRate;
            this.maxSpeedX = this.maxSpeedXBoost;
            if(this.currentHeat < 1) this.currentHeat += this.overheatRate*1.5 * customDeltaTime;
        }
        else if(this.speedX > 0) {
            this.speedX -= this.accelerationRate;
            this.state = this.PlayerState.SLOWING_DOWN;
        }
        
        if(this.currentLine == this.lines.length-1) this.isSpeedReduced = true;
        
        if(this.isSpeedReduced){
            this.maxSpeedX = this.maxSpeedXReduced;
            this.state = this.PlayerState.REDUCED_SPEED;
        }
        
        if(this.speedX <= 0){ //si velocitat menor que 0 la posem a 0
            this.speedX = 0;
            this.state = this.PlayerState.STOPED;
            this.sprite.setTexture('pilotStanding');
        }
        else if(this.speedX > this.maxSpeedX){ //sino " i la velocitat major que la maxima la posem a maxima
            this.speedX = this.maxSpeedX;
        }
        
        //Y velocity
        if(this.isFalling){ //jugador esta caient
            if(this.isOnRamp == true){
                this.sprite.body.velocity.y += (this.gravity);
                if(this.sprite.y >= this.lines[this.currentLine] - this.minY){
                    
                    if(this.sprite.body.velocity.y >= 50.0){
                        if(this.sprite.body.velocity.y <= 200.0){
                            this.soundsTable['jump_normal'].play();
                            console.log("Normal");
                        } else{
                            this.soundsTable['jump_super'].play();
                            console.log("super");
                        }
                    }
                    this.sprite.body.velocity.y = 0;
                    this.sprite.y = this.lines[this.currentLine]  - this.minY;
                }
            }
            else if(this.sprite.y >= this.lines[this.currentLine]){ //si ha arribat a la linea on estava el frenem i resetejem booleanes
                
                if(this.sprite.body.velocity.y >= 50.0){
                    if(this.sprite.body.velocity.y <= 200.0){
                        this.soundsTable['jump_normal'].play();
                        console.log("Normal");
                    } else{
                        this.soundsTable['jump_super'].play();
                        console.log("super");
                    }
                }

                this.sprite.body.velocity.y = 0;
                this.sprite.y = this.lines[this.currentLine];
                this.isFalling = false;
                this.isOnAir = false;
                this.tiltCounter = 0;
                this.justLanded = true;

                if(this.frontTiltCounter >= 1){ //si esta tiltejada cap endevan crasheja o si esta molt proper a la rampa no

                    this.frontTiltCounter = -1;
                    this.wheeliesTiltCounter = -1;
                    this.wheeliesCounter = -1;
                    
                    var aux = this.lines[this.currentLine] - this.minY - this.yPos;
                    if(aux < 0){
                        aux *= -1;
                    }
                    if(aux <= this.isOnRampError){
                        console.log("alive");
                    }
                    else{
                        this.crash();
                    }
                    
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
                    else if(this.wheeliesTiltCounter >= 1){
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

            if((inputs.Right_Key.isDown && inputs.Left_Key.isDown) || (inputs.Right_Key.isUp && inputs.Left_Key.isUp)){ //si estan las dues apretades o cap
                this.tiltCounter = 0;
            }
            else if(inputs.Right_Key.isDown){ //si apretem dreta
                if(!this.lastTiltFront) this.tiltCounter = 0;
                this.lastTiltFront = true;
                this.tiltCounter++;
                if(this.tiltCounter > 2){ //podem controlar lo rapid que fa la transicio d'sprite, ho controlem amb frames
                    this.tiltCounter = 0;

                    if(this.wheeliesTiltCounter < 0){ //si no esta fent wheelies
                        this.frontTiltCounter++;
                        if(this.frontTiltCounter > 3){
                            this.frontTiltCounter = 3;
                        }
                    }
                    this.wheeliesTiltCounter--;
                    if(this.wheeliesTiltCounter < -1){
                        this.wheeliesTiltCounter = -1;
                    }
                }
            }
            else if(inputs.Left_Key.isDown){ //si apretem esquerra
                if(this.lastTiltFront) this.tiltCounter = 0;
                this.lastTiltFront = false;
                this.tiltCounter++;
                if(this.tiltCounter > 2){ //podem controlar lo rapid que fa la transicio d'sprite, ho controlem amb frames
                    this.tiltCounter = 0;

                    if(this.frontTiltCounter <0){ //si no esta fent front tilt
                        this.wheeliesTiltCounter++;
                        if(this.wheeliesTiltCounter > 5){
                            this.wheeliesTiltCounter = 5;
                        }
                    }
                    this.frontTiltCounter--;
                    if(this.frontTiltCounter < -1){
                        this.frontTiltCounter = -1;
                    }
                }
            }
            if(this.frontTiltCounter >= 0){
                this.sprite.setTexture('pilot_front_tilt_' + this.frontTiltCounter);
            }
            else if(this.wheeliesTiltCounter >= 0){
                this.sprite.setTexture('pilot_wheelies_' + this.wheeliesTiltCounter);
            }
            else{
                //console.log("standing");
            }
                
        }
        else if(this.isOnAir){
            if(this.wheeliesTiltCounter >= 0){
                this.sprite.setTexture('pilot_wheelies_' + this.wheeliesTiltCounter);
            }
        }
        else if(!this.isOnAir){ //sino esta al aire (aire comença quan pujem la rampa)
            if(!this.isTurning) { //sino estem cambiant de carril
                
                if(this.wheeliesCounter < 0){ //sino esta fent wheelies
                    if(inputs.Up_Key.isDown && this.currentLine < this.lines.length-1){ //si volem cambiar de carril i es viable - Esquerra
                        this.currentLine++;
                        this.currScene.physics.moveTo(this.sprite, this.OriginalXPos, this.lines[this.currentLine], this.speedY);
                        this.isTurning = true;
                        
                        this.turningRight = false;
                    } 
                    else if(inputs.Down_Key.isDown && this.currentLine > 0 ){ //si volem cambiar de carril i es viable - Dreta
                        this.currentLine--;
                        this.currScene.physics.moveTo(this.sprite, this.OriginalXPos, this.lines[this.currentLine], this.speedY);
                        this.isTurning = true;
                        this.turningRight = true;
                    }
                }
                //WHEELIES
                if(this.wheeliesCounter >= 0){this.isOnWheelies = true;} 
                else {
                    this.isOnWheelies = false;
                    this.justLanded = false;
                }

                if(this.speedX >= (this.maxSpeedX * 0.95) && !this.justLanded){
                    if((inputs.Right_Key.isDown && inputs.Left_Key.isDown) || (inputs.Right_Key.isUp && inputs.Left_Key.isUp)){ //si estan las dues apretades o cap
                        this.tiltCounter = 0;
                    }
                    else if(inputs.Left_Key.isDown){
                        this.tiltCounter++;
                        if(this.tiltCounter > 2){ //podem controlar lo rapid que fa la transicio d'sprite, ho controlem amb frames
                            this.tiltCounter = 0;
    
                            this.wheeliesCounter++;
                            if(this.wheeliesCounter > 5){
                                this.wheeliesCounter = 5;
                            }
                        }
                    }
                    else if(inputs.Right_Key.isDown){
                        this.tiltCounter++; 
                        if(this.tiltCounter > 2){ //podem controlar lo rapid que fa la transicio d'sprite, ho controlem amb frames
                            this.tiltCounter = 0;
    
                            this.wheeliesCounter--;
                            if(this.wheeliesCounter < -1){
                                this.wheeliesCounter = -1;
                            }
                        }
                    }
                    if(this.wheeliesCounter >= 0){
                        this.sprite.setTexture('pilot_wheelies_' + this.wheeliesCounter);
                    }
                }
                else if(this.isOnWheelies){
                    this.tiltCounter++; 
                    if(this.tiltCounter > 4){
                        this.tiltCounter = 0;
                        this.wheeliesCounter--;
                    }
                    

                    if(this.wheeliesCounter >= 0){
                        this.sprite.setTexture('pilot_wheelies_' + this.wheeliesCounter);
                    }
                }
                
            }
            else { //si esta cambiant de carril
                if(this.turningRight){ //si esta girant dreta
                    this.sprite.setTexture('pilotTurnRight');
                }
                else{ //si esta girant esquerra
                    this.sprite.setTexture('pilotTurnLeft');
                }
                if(this.turningRight && this.sprite.y >= this.lines[this.currentLine]){ //si arriba al carril de destí - Dreta
                    this.sprite.body.stop();
                    this.isTurning = false;

                }
                else if(!this.turningRight && this.sprite.y <= this.lines[this.currentLine]){ //si arriba al carril de destí - Esquerra
                    this.sprite.body.stop();
                    this.isTurning = false;

                    
                }
                //aqui podrem fer una iteracio quan acabi el gir
                if(!this.isTurning){      
                }
            }
        }
        if(!this.isOnAir && !this.isTurning){
            this.sprite.y = this.lines[this.currentLine];
        }
        // NO eliminar
        this.yPos = this.sprite.y;
        this.expectedLine = this.lines[this.currentLine];
        this.isSpeedReduced = false;
        this.isOnRamp = false;
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
            key: 'running',
            frames: this.currScene.anims.generateFrameNumbers('pilotRunning', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.currScene.anims.create({
            key: 'moving',
            frames: this.currScene.anims.generateFrameNumbers('pilotMoving', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.currScene.anims.create({
            key: 'loop',
            frames: this.currScene.anims.generateFrameNumbers('pilotLoop', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.currScene.anims.create({
            key: 'getUp',
            frames: this.currScene.anims.generateFrameNumbers('pilotGetUp', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });
        this.currScene.anims.create({
            key: 'bike_fall',
            frames: this.currScene.anims.generateFrameNumbers('pilot_bike_fall', { start: 0, end: 8 }),
            frameRate: 4,
            repeat: 0
        });
       
    }

    crash() { // Generic Crash
        this.isOnCrash = true;
        this.crashHandled = false;
        this.currScene.physics.moveTo(this.sprite, this.OriginalXPos, this.lines[this.lines.length-1], this.speedY);
        this.speedX = 0;
        this.state = this.PlayerState.CRASHED;
        if(this.isOverHeated) {
            this.sprite.setTexture('pilotStanding');
        } else {
            this.sprite.anims.play('loop', true);
        }
    }

    handleCrash() { // Function to handle every type of Crash (Go-out sequence) Overheat, Fall Crash and Bike-bike crash
        
        if( this.sprite.y <= this.lines[this.lines.length-1] && !this.crashHandled){
            this.crashHandled = true;
            this.sprite.body.stop();
            this.currentLine = this.lines.length-1;
           
            if(this.isOverHeated){
                this.currScene.time.delayedCall(3000, ()=> { 
                    this.isOverHeated = false; 
                    this.isOnCrash = false;
                }, [], this);
            } else {
                this.sprite.anims.play('bike_fall', true);
                this.sprite.y = 100;

                this.currScene.time.delayedCall(1500, ()=> {
                    this.isOnCrash = false;
                    this.sprite.anims.play('moving', true);
                }, [], this);
            }
        }
    }

    overheatDelay(){
        this.isOnCrash = false;
        this.isOverHeated = false; 
    }

    createSounds(){
        this.soundsCreated = true;

        this.soundsTable = {};
        this.soundsTable['acc_normal'] = juego.sound.add('sfx_acc_normal', {loop: true});
        this.soundsTable['acc_boost'] = juego.sound.add('sfx_acc_boost', {loop: true});
        this.soundsTable['acc_reduced'] = juego.sound.add('sfx_acc_reduced', {loop: true});
        this.soundsTable['acc_none'] = juego.sound.add('sfx_acc_none', {loop: true});
        this.soundsTable['jump_normal'] = juego.sound.add('sfx_jump_normal');
        this.soundsTable['jump_super'] = juego.sound.add('sfx_jump_super');
        this.soundsTable['crash'] = juego.sound.add('sfx_crash');

       
    }

    soundsManager(){

        if(this.prevState != this.state){ // Just switched state
            this.soundsTable['acc_normal'].stop();
            this.soundsTable['acc_boost'].stop();
            this.soundsTable['acc_reduced'].stop();
            this.soundsTable['acc_none'].stop();
            this.soundsTable['crash'].stop();
            switch(this.state){
                case this.PlayerState.STOPED:
                    this.soundsTable['acc_none'].play();
                    break;
                case this.PlayerState.RUNNING:
                    this.soundsTable['acc_normal'].play();
                    break;
                case this.PlayerState.SLOWING_DOWN:
                    this.soundsTable['acc_reduced'].play();
                    break;
                case this.PlayerState.CRASHED:
                    this.soundsTable['crash'].play();
                    break;
                case this.PlayerState.RUNNING_BOOST:
                    this.soundsTable['acc_boost'].play();
                    break;
                case this.PlayerState.REDUCED_SPEED:
                    this.soundsTable['acc_reduced'].play();
                    break;
            }
            this.prevState = this.state;
        }

    }


    playCustomSong(state){
        this.soundsTable['acc_normal'].stop();
        this.soundsTable['acc_boost'].stop();
        this.soundsTable['acc_reduced'].stop();
        this.soundsTable['acc_none'].stop();
        this.soundsTable['crash'].stop();
        switch(this.state){
            case this.PlayerState.STOPED:
                this.soundsTable['acc_none'].play();
                break;
            case this.PlayerState.RUNNING:
                this.soundsTable['acc_normal'].play();
                break;
            case this.PlayerState.SLOWING_DOWN:
                this.soundsTable['acc_reduced'].play();
                break;
            case this.PlayerState.CRASHED:
                this.soundsTable['crash'].play();
                break;
            case this.PlayerState.RUNNING_BOOST:
                this.soundsTable['acc_boost'].play();
                break;
            case this.PlayerState.REDUCED_SPEED:
                this.soundsTable['acc_reduced'].play();
                break;
        }
    }
    preUpdate(){

    } 

    
}