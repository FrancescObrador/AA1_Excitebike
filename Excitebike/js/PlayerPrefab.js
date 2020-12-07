
class Player extends Phaser.GameObjects.Sprite {
    
    constructor(scene, positionX, positionY){
		super(scene, positionX, positionY, 'pilotTurnLeft');

        this.setOrigin(.5,1);
        
        this.acceleration = 0.01;
        this.speed = 0;
        this.maxSpeed = 1.5;

        scene.physics.add.existing(this);
    }  
}
