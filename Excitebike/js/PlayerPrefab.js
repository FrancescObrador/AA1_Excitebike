
class Player {
    
    constructor(scene, positionX, positionY){

        
        
        this.acceleration = 0.01;
        this.speed = 0;
        this.maxSpeed = 1.5;

        //scene.add.existing(this);
        this.sprite = scene.physics.add.sprite(positionX, positionY,'motorbike');
        //this.sprite.setOrigin(0.5,0.5);
    } 
    preUpdate(){

    } 
}
