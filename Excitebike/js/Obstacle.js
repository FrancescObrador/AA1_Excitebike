class Obstacle {
    constructor(scene, subType, positionX, lane){ // subtype defines the this.width and the hegiht
        this.type = "ramp"; // Default value
        this.x = positionX;
        this.y = 0;
        this.halfPoint = 0;
        this.end = 0;
        this.width = 0;
        this.height = 0;
        this.currentLane = lane;

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
                this.halfPoint = 19;

                break;

            case "smallRamp":
                this.width = 40;
                this.height = allLanesSize;
                this.halfPoint = 19;
                break;
            case "bigRamp":
                this.width = 72;
                this.height = allLanesSize;
                this.halfPoint = this.width/2;
                break;
            case "bigLeftRamp":
                this.width = 44;
                this.height = allLanesSize;
                this.halfPoint = 26;
                break;
            case "bigRightRamp":
                this.width = 44;
                this.height = allLanesSize;
                this.halfPoint = 15;

                break;
            case "longRamp":
                this.width = 72;
                this.height = allLanesSize;
                break;
            case "smallBump":
                this.width = 24;
                this.height = allLanesSize;
                this.halfPoint = 12;
                break;
            case "grassPatchStart": 
                this.width = 80;
                this.height = allLanesSize;
                this.type  = "tramp";
                break;
            case "endRamp":
                this.width = 96;
                this.height = allLanesSize;
                break;
            default:
                break;
        }
        this.end = this.x + this.width;
        this.halfPoint += this.x;

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

    actOnPlayer(player,x_player){
        switch(this.type){
            case "tramp":
                break;
            case "booster":
                break;
            case "ramp":
                if(x_player >= this.x && x_player <= this.halfPoint) {
                    player.rampActivate();
                }
                else{
                    player.rampDeactivate();
                }
                
                break;
            default:
                break;
        }
    }
}
