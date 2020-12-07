
class Player extends Phaser.GameObjects.Sprite {
    
    constructor(scene, positionX, positionY){
		super(scene, positionX, positionY, 'motorbike');

        this.setOrigin(0.5,0.5);
        
        this.acceleration = 0.01;
        this.speed = 0;
        this.maxSpeed = 1.5;

        scene.add.existing(this);
        scene.physics.add.existing(this);
    } 
    preUpdate(){

    } 
}
