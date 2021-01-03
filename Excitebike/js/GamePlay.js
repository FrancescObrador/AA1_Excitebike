class GamePlay extends Phaser.Scene{
    constructor(){
        super({key: 'GamePlay'});
   }

    preload(){
        var ruta = 'assets/img/';
        this.load.image('backGround', ruta + 'excitebike_map_1.png');
        
        Player.loadAssets(this);
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

        this.backGround = this.add.image(0, 0, 'backGround').setOrigin(0).setScale(1);

        this.pilot = new Player(this,1 );
        
        this.pilotMapPosition = this.backGround.x + this.pilot.sprite.x;

        this.inputs = new InputManager(this);

    }


    update(){

        this.pilot.customUpdate(this.inputs);
        this.backGround.x -= this.pilot.speedX; // scroll  
        this.pilotMapPosition += this.pilot.speedX;
         
        this.obstacles.forEach(obstacle => {
           var playerPos = Math.trunc(this.pilotMapPosition);
            if(this.isInside(playerPos, obstacle) ){

                //console.log(playerPos);
                //console.log("A " + obstacle.type + ": " + obstacle.x.toString() + " - " + obstacle.end.toString());
                obstacle.actOnPlayer(this.pilot,playerPos, this.pilot.yPos, this.pilot.expectedLine);

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

