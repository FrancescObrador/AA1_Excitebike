class GamePlay extends Phaser.Scene{
    constructor(){
        super({key: 'GamePlay'});
   }

    preload(){
        var ruta = 'assets/img/';
        this.load.image('backGround', ruta + 'excitebike_map_1.png');
        this.load.image('backGroundLap2', ruta + 'excitebike_map_1_2.png');
        this.load.image('backGroundLap2', ruta + 'excitebike_map_1_3.png');

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
            var position = parseInt(item.getAttribute('position'), 10);
            var lane = parseInt(item.getAttribute('lane'), 10);
            
            myObstacles[i] = new Obstacle(this, type, position, lane); // Aquí hay un bug extraño, no pilla los obstáculos
        }
        this.obstacles = myObstacles;

        
        this.lap1 = this.add.image(0, 0, 'backGround').setOrigin(0).setScale(1);
        this.lap2 = this.add.image(this.lap1.width, 0, 'backGroundLap2').setOrigin(0).setScale(1);
        this.lap2 = this.add.image(this.lap1.width + this.lap2.width, 0, 'backGroundLap3').setOrigin(0).setScale(1);
       
        this.backGround = this.add.container();
        this.backGround.add([this.lap1, this.lap2, this.lap3]);

        this.pilot = new Player(this,1 );
        
        this.pilotMapPosition = this.pilot.sprite.x;

        this.inputs = new InputManager(this);

    }


    update(){

        this.pilot.customUpdate(this.inputs);

        this.backGround.x -= this.pilot.speedX; // container scroll  
        this.pilotMapPosition += this.pilot.speedX;
         
        this.obstacles.forEach(obstacle => {
           var playerPos = Math.trunc(this.pilotMapPosition);
            if(this.isInside(playerPos, obstacle) ){

                console.log(playerPos);
                console.log("A " + obstacle.type + ": " + obstacle.x.toString() + " - " + obstacle.end.toString());


            }
        });
        
    }
    
    isInside(positionX, _obstacle)
    {
        if(positionX >= _obstacle.x && positionX <= _obstacle.end) {

            if (this.pilot.currentLine == _obstacle.currentLane || _obstacle.isAllLane) 
            return true;
        }

        return false;
    }

}

