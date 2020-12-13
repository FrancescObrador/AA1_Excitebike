class Obstacle {
    constructor(scene, subType, positionX, lane){ // subtype defines the this.width and the hegiht
        this.type = "ramp"; // Default value
        this.x = positionX;
        this.y = 0;
        this.end = 0;
        this.width = 0;
        this.height = 0;
        this.currentLane = lane;

        this.isFinish = false;

        this.isAllLane = true;

        var laneSize = 12;
        var allLanesSize = 48;

        switch(subType){
            case "mud":
                this.width = 24;
                this.isAllLane = false;
                this.height = laneSize;
                this.type = "tramp";
                break;
            case "speed":
                this.width = 16;
                this.isAllLane = false;
                this.height = laneSize;
                this.type  = "booster";
                break;

            case "miniRamp":
                this.width = 16;
                this.isAllLane = false;
                this.height = laneSize *2;
                break;

            case "smallRamp":
                this.width = 40;
                this.height = allLanesSize;
                break;
            case "bigRamp":
                this.width = 72;
                this.height = allLanesSize;
                break;
            case "bigLeftRamp":
                this.width = 44;
                this.height = allLanesSize;
                break;
            case "bigRightRamp":
                this.width = 44;
                this.height = allLanesSize;
                break;
            case "longRamp":
                this.width = 72;
                this.height = allLanesSize;
                break;
            case "smallBump":
                this.width = 24;
                this.height = allLanesSize;
                break;
            case "grassPatchStart": 
                this.width = 80;
                this.height = allLanesSize;
                this.type  = "tramp";
                break;
            case "lapOne":
                this.width = 96;
                this.height = allLanesSize;
                break; 
            case "lapTwo":
                this.width = 96;
                this.height = allLanesSize;
                break; 
            case "finish":
                this.width = 96;
                this.height = allLanesSize;
                this.isFinish = true;
                break;
            default:
                break;
        }
        this.end = this.x + this.width;

        switch(this.currentLane){
            case -1:
                break;
            case 0:
                this.y = 162;
            break; 
            case 1:
                this.y = 150;
            break;        
            case 2:
                this.y = 138;  
            break;            
            case 3: 
            this.y = 125;   
            break;
            default:
                console.log("Error al crear obstáculo, linea no deseada"); // No entiendo esto
                break;
        }

        scene.add.existing(this);
    }  
}
