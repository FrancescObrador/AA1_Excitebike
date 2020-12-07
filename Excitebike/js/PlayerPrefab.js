
class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, positionX, positionY){
		super(scene, positionX, positionY, 'player');
		scene.add.existing(this);
        //this.setOrigin(.5,1);
    }  
}
