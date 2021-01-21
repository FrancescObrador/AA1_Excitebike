class Prefab extends Phaser.GameObjects.Sprite{
    
    constructor(scene, positionX, positionY){
		super(scene, positionX, positionY, 'sprite');
		scene.add.existing(this);
        this.setOrigin(.5,1);
    }  
}
