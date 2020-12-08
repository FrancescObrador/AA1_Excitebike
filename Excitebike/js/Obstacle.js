class Obstacle extends Phaser.GameObjects.Zone{
    
    constructor(scene, type, positionX, lane){
        // type defines the width and the hegiht
        var width = 0;
        var height = 0;
        var positionY = 0;
        var laneSize = 12;
        var allLanesSize = 48;

        switch(type){
            case "mud":
                width = 24;
                height = laneSize;
                break;
            case "speed":
                width = 16;
                height = laneSize;
                break;

            case "miniRamp":
                width = 16;
                height = laneSize *2;
                break;

            case "smallRamp":
                width = 40;
                height = allLanesSize;
            break;
            case "bigRamp":
                width = 72;
                height = allLanesSize;
                break;
            case "bigLeftRamp":
                width = 44;
                height = allLanesSize;
                break;
            case "BigRightRamp":
                width = 44;
                height = allLanesSize;
                break;
            case "longRamp":
                width = 72;
                height = allLanesSize;
                break;
            case "smallBump":
                width = 24;
                height = allLanesSize;
                break;
            case "grassPatchStart":
                width = 80;
                height = allLanesSize;
                break;
            case "endRamp":
                width = 96;
                height = allLanesSize;
                break;
            default:
                break;
        }
        
        switch(lane){
            case -1:
            case 0:
                positionY = 162;
            break; 
            case 1:
                positionY = 150;
            break;        
            case 2:
                positionY = 138;  
            break;            
            case 3: 
                positionY = 125;   
            break;
            default:
                break;
        }

        super(scene, positionX, positionY, width, height);
       
        scene.add.existing(this);
    }  
}
