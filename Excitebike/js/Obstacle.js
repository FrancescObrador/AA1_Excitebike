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
        this.midPartSize = 8;
        this.currentLane = lane;
        
        this.isLap1 = false;
        this.isLap2 = false;
        this.isFinish = false;
        
        this.isAllLane = true;
        this.obstSubType = subType;
        
        var laneSize = 12;
        var allLanesSize = 48;

        switch(this.obstSubType){
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
                this.width = 32;
                this.isAllLane = false;
                this.height = laneSize;
                this.maxHeight = 15;
                this.halfPoint = 16; 
                this.midPartSize = 0;
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
                this.halfPoint = 32;
                this.maxHeight = 32;
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
                this.halfPoint = 32;
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
                this.halfPoint = 25; 
                this.midPartSize = 48;
                this.maxHeight = 25;
                break; 
            case "lapTwo":
                this.width = 96;
                this.height = allLanesSize;
                this.isLap2 = true;
                this.halfPoint = 25; 
                this.midPartSize = 48;
                this.maxHeight = 25;
                break; 
            case "finish":
                this.width = 96;
                this.height = allLanesSize;
                this.isFinish = true;
                this.halfPoint = 25; 
                this.midPartSize = 48;
                this.maxHeight = 25;
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
    actOnEnemy(enemy,x_enemy, y_enemy, y_expected, index){
        switch(this.type){
            case "tramp":
                enemy.isSpeedReduced = true;
                break;
            case "booster":
                //enemy.currentHeat = 0;
                break;
            case "ramp":
                if(x_enemy >= this.x && x_enemy < this.halfPoint) {
                    if( y_enemy >= y_expected - this.maxHeight){
                        let catete_H = this.halfPoint - this.x;
                        let catete_V = this.maxHeight;
                        let angle = 0;
                        if(catete_H != 0){
                            angle = Math.atan(catete_V / catete_H);
                        }
                        enemy.rampActivate(angle);
                    }else{
                        if(this.subType == "miniRamp"){
                            enemy.rampDeactivate(0);
                        }else{
                            enemy.rampDeactivate(this.maxHeight);
                        }
                    }
                }
                else if(this.subType == "miniRamp"){
                    console.log("HE");
                    enemy.rampDeactivate(0);
                }
                else if(x_enemy >= this.halfPoint && (x_enemy <= this.halfPoint + this.midPartSize)){
                    enemy.rampDeactivate(this.maxHeight);
                }
                else{
                    let catete_V = this.maxHeight;
                    let catete_H = this.end - this.halfPoint - this.midPartSize; 
                    let playerDist = this.end - x_enemy;
                    if(playerDist > 0){
                        let ratio = playerDist / catete_H;
                        catete_V *= ratio;
                    }else{
                        catete_V = 0
                    }

                    enemy.rampDeactivate(catete_V); 
                }
                
                break;
            default:
                break;
        }
    }
    actOnPlayer(player,x_player, y_player, y_expected, index){
        switch(this.type){
            case "tramp":
                player.isSpeedReduced = true;
                break;
            case "booster":
                player.currentHeat = 0;
                break;
            case "ramp":
                if(x_player >= this.x && x_player < this.halfPoint) {
                    if( y_player >= y_expected - this.maxHeight){
                        let catete_H = this.halfPoint - this.x;
                        let catete_V = this.maxHeight;
                        let angle = 0;
                        if(catete_H != 0){
                            angle = Math.atan(catete_V / catete_H);
                        }
                        player.rampActivate(angle);
                    }else{
                        if(this.subType == "miniRamp"){
                            player.rampDeactivate(0);
                        }else{
                            player.rampDeactivate(this.maxHeight);
                        }
                    }
                }
                else if(this.subType == "miniRamp"){
                    console.log("HE");
                    player.rampDeactivate(0);
                }
                else if(x_player >= this.halfPoint && (x_player <= this.halfPoint + this.midPartSize)){
                    player.rampDeactivate(this.maxHeight);
                }
                else{
                    let catete_V = this.maxHeight;
                    let catete_H = this.end - this.halfPoint - this.midPartSize; 
                    let playerDist = this.end - x_player;
                    if(playerDist > 0){
                        let ratio = playerDist / catete_H;
                        catete_V *= ratio;
                    }else{
                        catete_V = 0
                    }

                    player.rampDeactivate(catete_V); 
                }
                
                break;
            default:
                break;
        }
    }
}
