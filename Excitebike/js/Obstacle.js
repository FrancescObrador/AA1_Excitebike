class Obstacle {
    constructor(scene, subType, positionX, lane){ // subtype defines the this.width and the hegiht
        this.type = "ramp"; // Default value
        this.x = positionX;
        this.y = 0;
        this.halfPoint = 0;
        this.end = 0;
        this.width = 0;
        this.height = 0;
        this.maxHeight = 0;
        this.currentLane = lane;

        this.isLap1 = false;
        this.isLap2 = false;
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
                this.halfPoint = 16;
                this.halfPoint = 15;
                break;

            case "smallRamp":
                this.width = 40;
                this.height = allLanesSize;
                this.halfPoint = 19;
                this.maxHeight = 18;
                break;
            case "bigRamp":
                this.width = 72;
                this.height = allLanesSize;
                this.halfPoint = this.width/2;
                this.maxHeight = 34;
                break;
            case "bigLeftRamp":
                this.width = 44;
                this.height = allLanesSize;
                this.halfPoint = 26;
                this.maxHeight = 26;
                break;
            case "bigRightRamp":
                this.width = 44;
                this.height = allLanesSize;
                this.halfPoint = 15;
                this.maxHeight = 26;
                break;
            case "longRamp":
                this.width = 72;
                this.height = allLanesSize;
                this.halfPoint = 36;
                this.maxHeight = 17;
                break;
            case "smallBump":
                this.width = 24;
                this.height = allLanesSize;
                this.halfPoint = 12;
                this.maxHeight = 10;
                break;
            case "grassPatchStart": 
                this.width = 80;
                this.height = allLanesSize;
                this.type  = "tramp";
                break;
            case "lapOne":
                this.width = 96;
                this.height = allLanesSize;
                this.isLap1 = true;
                 this.halfPoint = 47; // TODO -> Pensar si bajarlo a 25
                this.maxHeight = 32;
                break; 
            case "lapTwo":
                this.width = 96;
                this.height = allLanesSize;
                this.isLap2 = true;
                 this.halfPoint = 47; // TODO -> Pensar si bajarlo a 25
                this.maxHeight = 32;
                break; 
            case "finish":
                this.width = 96;
                this.height = allLanesSize;
                this.isFinish = true;
                this.halfPoint = 47; // TODO -> Pensar si bajarlo a 25
                this.maxHeight = 32;
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

    actOnPlayer(player,x_player, y_player, y_expected){
        switch(this.type){
            case "tramp":
                break;
            case "booster":
                break;
            case "ramp":
                if(x_player >= this.x && x_player <= this.halfPoint&&
                    y_player >= y_expected - this.maxHeight) {
                        console.log("___");
                        console.log(y_player);
                        console.log(y_expected + this.maxHeight);
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
