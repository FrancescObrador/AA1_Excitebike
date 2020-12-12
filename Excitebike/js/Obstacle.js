class Obstacle {
    constructor(scene, subType, positionX, lane){ // subtype defines the width and the hegiht
        
        this.type = "ramp"; // Default value
        this.x = positionX;
        this.end;
        var width = 0;
        var height = 0;
        var positionY = 0;
        var laneSize = 12;
        var allLanesSize = 48;


        switch(subType){
            case "mud":
                width = 24;
                height = laneSize;
                this.type = "tramp";
                break;
            case "speed":
                width = 16;
                height = laneSize;
                this.type  = "booster";
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
                this.type  = "tramp";
                break;
            case "endRamp":
                width = 96;
                height = allLanesSize;
                break;
            default:
                break;
        }
        
        this.end = this.x + width;

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
       
        scene.add.existing(this);
    }  
}
