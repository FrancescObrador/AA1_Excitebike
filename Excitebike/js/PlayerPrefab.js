
class Player {
    static animsCreated = false;

    constructor(scene, newLine){

        this.currScene = scene;
        this.accelerationRate = 0.01;
        this.speedX = 0;
        this.speedY = 30;
        this.maxSpeedXNormal = 1.5;
        this.maxSpeedXBoost = 2.5;
        this.maxSpeedX = this.maxSpeedXNormal;
        this.currentLine = newLine;
        this.isTurning = false;
        this.isOnAir = false;
        this.lines = [162,150,138,125];
        this.linesX = [70,86 ,102,117];
        this.OriginalXPos = this.linesX[this.currentLine];
        this.sprite = this.currScene.physics.add.sprite(this.OriginalXPos, this.lines[this.currentLine],'pilotStanding');
        if(!this.animsCreated)this.createAnims();
        this.sprite.anims.play('moving',false);
        this.baseHeat = 0.25;
        this.currentHeat = this.baseHeat;       
    } 

    customUpdate(inputs){

        if(this.currentHeat > this.baseHeat) this.currentHeat -= this.accelerationRate * 0.1;

        if (inputs.A_Key.isDown){ 
            this.maxSpeedX = this.maxSpeedXNormal;   
            this.speedX += this.accelerationRate;
        
            //TODO no entenc per que no funciona aixo xddd
            if (parseInt(this.currentHeat) < 0.5) {
                this.currentHeat += this.accelerationRate * 0.1;
            }
            console.clear();
            console.log(this.currentHeat);
        }
        else if(inputs.B_Key.isDown){
            this.speedX += this.accelerationRate;
            this.maxSpeedX = this.maxSpeedXBoost;
            if(this.currentHeat < 1) this.currentHeat += this.accelerationRate;
        }
        else if(this.speedX > 0) {
            this.speedX -= this.accelerationRate;
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
        else{
            
        }
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
