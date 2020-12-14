
class Player {
    static animsCreated = false;

    constructor(scene, newLine){

        this.currScene = scene;
        this.accelerationRate = 0.01;
        this.gravity = 50;
        this.speedX = 0;
        this.speedY = 30;
        this.maxSpeedX = 2.5;
        this.currentLine = newLine;
        this.isTurning = false;
        this.isOnAir = false;
        this.isFalling = false;
        this.lines = [162,150,138,125];
        this.linesX = [70,86 ,102,117];
        this.OriginalXPos = this.linesX[this.currentLine];
        this.sprite = this.currScene.physics.add.sprite(this.OriginalXPos, this.lines[this.currentLine],'pilotStanding');
        if(!this.animsCreated)this.createAnims();
        this.sprite.anims.play('moving',false);       
    } 

    static loadAssets(scene){
        var ruta = 'assets/img/pilot/';
        scene.load.image('motorbike',ruta + 'motorbike.png');
        scene.load.spritesheet('pilotLoop', ruta + 'pilot_loop.png', {frameWidth: 98/4, frameHeight: 24});
        scene.load.spritesheet('pilotFrontTilt', ruta + 'pilot_front_tilt.png', {frameWidth: 92/4, frameHeight: 25}); //sa de fer depenent de input, no amb animacio
        scene.load.spritesheet('pilotWheelies', ruta + 'pilot_wheelies.png', {frameWidth: 138/6, frameHeight: 26});//sa de fer depenent de input, no amb animacio
        scene.load.spritesheet('pilotGetUp', ruta + 'pilot_get_up.png', {frameWidth: 77/3, frameHeight: 21});
        scene.load.spritesheet('pilotMoving', ruta + 'pilot_moving.png',{frameWidth: 40/2, frameHeight: 21});
        scene.load.spritesheet('pilotRunning', ruta + 'pilot_running.png',{frameWidth: 28/2, frameHeight: 16});
        scene.load.image('pilotTurnLeft',ruta + 'pilot_turning_left.png');
        scene.load.image('pilotTurnRight',ruta + 'pilot_turning_right.png');
        scene.load.image('pilotStanding',ruta + 'pilot_standing.png');
    }

    customUpdate(inputs){
        console.clear();
        console.log(this.currentLine);
        console.log(this.sprite.y);
        if (inputs.A_Key.isDown){    
            this.speedX += this.accelerationRate;
        } 
        else if(this.speedX > 0) {
            //this.speedX -= this.accelerationRate;
            this.speedX = 0;
        }
        if(this.speedX < 0){
            this.speedX = 0;
        }else if(this.speedX > this.maxSpeedX){
            this.speedX = this.maxSpeedX;
        }
        if(this.speedX <= 0){
            this.speedX = 0;
            this.sprite.setTexture('pilotStanding');
        }
        if(!this.isOnAir){
            if(!this.isTurning) {
                if(inputs.Up_Key.isDown && this.currentLine < this.lines.length-1){
                    this.currentLine++;
                    this.currScene.physics.moveTo(this.sprite, this.OriginalXPos, this.lines[this.currentLine], this.speedY);
                    this.isTurning = true;
                    
                    this.turningRight = false;
                } 
                else if(inputs.Down_Key.isDown && this.currentLine > 0 ){
                    this.currentLine--;
                    this.currScene.physics.moveTo(this.sprite, this.OriginalXPos, this.lines[this.currentLine], this.speedY);
                    this.isTurning = true;
                    this.turningRight = true;
                }
            }
            else {
                if(this.turningRight){
                    this.sprite.setTexture('pilotTurnRight');
                }
                else{
                    this.sprite.setTexture('pilotTurnLeft');
                }
                if(this.turningRight && this.sprite.y >= this.lines[this.currentLine]){
                    this.sprite.body.stop();
                    this.isTurning = false;
                }
                else if(!this.turningRight && this.sprite.y <= this.lines[this.currentLine]){
                    this.sprite.body.stop();
                    this.isTurning = false;
                    
                }
                //aqui podrem fer una iteracio quan acabi el gir
                if(!this.isTurning){
                    
                }
                
            }
        }
        else if(this.isFalling){
            this.sprite.body.velocity.y += this.gravity;
            if(this.sprite.y >= this.lines[this.currentLine]){
                this.sprite.body.stop();
                this.sprite.y = this.lines[this.currentLine];
                this.isFalling = false;
                this.isOnAir = false;
            }
        }
    }

    rampActivate(){
        this.isOnAir = true;

        this.sprite.body.velocity.y = -this.speedX * 100;
        console.clear();
        console.log("Ramp - Activate");
    }
    rampDeactivate(){
        this.isFalling = true;
        console.clear();
        console.log("Ramp - Deactivate");
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
            frameRate: 5,
            repeat: -1
        });
        this.currScene.anims.create({
            key: 'getUp',
            frames: this.currScene.anims.generateFrameNumbers('pilotGetUp', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });
    }

    preUpdate(){

    } 
}
