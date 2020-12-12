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
            //console.log(String(type) + ' ' + String(position) + ' ' + String(lane));
            
            myObstacles[i] = new Obstacle(this, type, position, lane);
        }

        this.obstacles = myObstacles;

        this.backGround = this.add.image(0, 0, 'backGround').setOrigin(0).setScale(1);

        this.pilot = new Player(this,config.width/2,125);
        //this.pilot.sprite.anims.play('moving',false);
        this.pilotMapPosition = this.backGround.x + this.pilot.x;
        
        this.pilot.acceleration = 0.01;
        this.pilot.speed = 0;
        this.pilot.maxSpeed = 1.5;
        
        this.inputs = new InputManager(this);

        // y positions of the 4 lines
        this.lines = [125, 138, 150, 162];
        this.currentLine = 0;
        this.pilot.isOnTween = false;
        
        this.ramp = new Obstacle(this, "mud", 10, 1);
     
    }


    update(){

        this.pilot.customUpdate(this.inputs);
        this.backGround.x -= this.pilot.speedX; // scroll  
        this.pilotMapPosition += this.pilot.speed;
         
       console.log(Math.trunc(this.pilotMapPosition));

        this.obstacles.forEach(obstacle => {
           var playerPos = Math.trunc(this.pilotMapPosition);
            if(playerPos >= obstacle.x && playerPos < obstacle.end){
                if(obstacle.type == "tramp")
                {
                    console.log("a tramp!");
                }
            }
        });
    }
    
}

