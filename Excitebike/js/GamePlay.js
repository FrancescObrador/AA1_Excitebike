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
    }
    
    create(){
        

        this.backGround = this.add.image(0, 0, 'backGround').setOrigin(0).setScale(1);

        this.pilot = new Player(this,config.width/2,125);
        //this.pilot.sprite.anims.play('moving',false);
        
        this.inputs = new InputManager(this);

    }


    update(){

        this.pilot.customUpdate(this.inputs);
        this.backGround.x -= this.pilot.speedX; // scroll  
         
         
    }
}

