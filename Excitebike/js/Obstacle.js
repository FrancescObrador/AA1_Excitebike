class Obstacle extends Phaser.GameObjects.Zone{
    
    constructor(scene, _width, _height, _positionX, _positionY){
        // type defines the width and the hegiht
        var width = _width;
        var height = _height;

        super(scene, _positionX, _positionY, width, height);
       
        scene.add.existing(this);
        //this.type = _type;
    }  
}
