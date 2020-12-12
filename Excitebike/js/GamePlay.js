class GamePlay extends Phaser.Scene{
    constructor(){
        super({key: 'GamePlay'});
   }

    preload(){
        var ruta = 'assets/img/';
        this.load.image('backGround', ruta + 'excitebike_map_1.png');
        ruta += 'pilot/';
        this.load.image('motorbike',ruta + 'motorbike.png');
        this.load.spritesheet('pilotLoop', ruta + 'pilot_loop.png', {frameWidth: 98/4, frameHeight: 24});
        this.load.spritesheet('pilotFrontTilt', ruta + 'pilot_front_tilt.png', {frameWidth: 92/4, frameHeight: 25}); //sa de fer depenent de input, no amb animacio
        this.load.spritesheet('pilotWheelies', ruta + 'pilot_wheelies.png', {frameWidth: 138/6, frameHeight: 26});//sa de fer depenent de input, no amb animacio
        this.load.spritesheet('pilotGetUp', ruta + 'pilot_get_up.png', {frameWidth: 77/3, frameHeight: 21});
        this.load.spritesheet('pilotMoving', ruta + 'pilot_moving.png',{frameWidth: 40/2, frameHeight: 21});
        this.load.spritesheet('pilotRunning', ruta + 'pilot_running.png',{frameWidth: 28/2, frameHeight: 16});
        this.load.image('pilotTurnLeft',ruta + 'pilot_turning_left.png');
        this.load.image('pilotTurnRight',ruta + 'pilot_turning_right.png');
        this.load.image('pilotStanding',ruta + 'pilot_standing.png');
        this.load.xml('obsts', 'assets/map1Info.xml');
    }
    
    create(){
        var list = this.cache.xml.get('obsts');
        var obstacles = list.getElementsByTagName('obstacle');
        var myObstacles = new Array(obstacles.length);
      
        for (var i = 0; i < obstacles.length; ++i)
        {
            var item = obstacles[i];
            var type = item.getAttribute('type');
            var position = item.getAttribute('position');
            var lane = item.getAttribute('lane');
            
            myObstacles[i] = new Obstacle(this, type, position, lane);
        }
        this.obstacles = myObstacles;

        this.backGround = this.add.image(0, 0, 'backGround').setOrigin(0).setScale(1);

        this.pilot = new Player(this,config.width/2,125);
        
        this.pilotMapPosition = this.backGround.x + this.pilot.sprite.x;

        this.inputs = new InputManager(this);
    }


    update(){

        this.pilot.customUpdate(this.inputs);
        this.backGround.x -= this.pilot.speedX; // scroll  
        this.pilotMapPosition += this.pilot.speedX;
         
       console.log(Math.trunc(this.pilotMapPosition));

        this.obstacles.forEach(obstacle => {
           var playerPos = Math.trunc(this.pilotMapPosition);
            if(this.isInside(playerPos, obstacle) ){
                if(obstacle.type == "tramp")
                {
                    console.log("a tramp!");
                }
            }
        });
    }
    
    isInside(positionX, _obstacle)
    {
        if(positionX >= _obstacle.x && positionX <= _obstacle.end) {

            if (this.pilot.currentLine == _obstacle.currentLane || _obstacle.isAllLane) return true;
        }

        return false;
    }

}

