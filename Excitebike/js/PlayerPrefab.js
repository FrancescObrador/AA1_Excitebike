
class Player {
    static animsCreated = false;

    constructor(scene, positionX, positionY){

        this.currScene = scene;
        this.acceleration = 0.01;
        this.speedX = 0;
        this.speedY = 30;
        this.maxSpeedX = 1.5;
        this.currentLine = 0;
        this.isOnTween = false;

        this.lines = [125, 138, 150, 162];

        this.sprite = this.currScene.physics.add.sprite(positionX, positionY,'motorbike');
        if(!this.animsCreated)this.createAnims();
        
    } 

    customUpdate(inputs){
        if (inputs.A_Key.isDown && this.speedX < this.maxSpeedX ){    
            this.speedX += this.acceleration;
        } 
        else if(this.speedX > 0) {
            this.speedX -= this.acceleration;
        }
    
        if(!this.isOnTween) {
            if(inputs.Up_Key.isDown && this.currentLine > 0){
                this.currentLine--;
                this.currScene.physics.moveTo(this.sprite, config.width/2, this.lines[this.currentLine], this.speedY);
                this.isOnTween = true;
                
                this.turningRight = false;
            } 
            else if(inputs.Down_Key.isDown && this.currentLine < this.lines.length-1){
                this.currentLine++;
                this.currScene.physics.moveTo(this.sprite, config.width/2, this.lines[this.currentLine], this.speedY);
                this.isOnTween = true;
                
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
                this.isOnTween = false;
            }
            else if(!this.turningRight && this.sprite.y <= this.lines[this.currentLine]){
                this.sprite.body.stop();
                this.isOnTween = false;
            }
            
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
