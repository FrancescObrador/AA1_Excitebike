class GamePlay extends Phaser.Scene{
    constructor(){
        super({key: 'GamePlay'});
   }

    preload(){
        var ruta = 'assets/img/';
        this.load.image('backGround', ruta + 'Track_1_Base.png');
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

    }
    create(){
        this.backGround = this.add.tileSprite(0, 0, 256, 240, 'backGround').setOrigin(0).setScale(1);

        this.pilot = this.physics.add.sprite(128,20,'motorbike').setOrigin(0.5);
        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('pilotRunning', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'moving',
            frames: this.anims.generateFrameNumbers('pilotMoving', { start: 0, end: 1 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'loop',
            frames: this.anims.generateFrameNumbers('pilotLoop', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'getUp',
            frames: this.anims.generateFrameNumbers('pilotGetUp', { start: 0, end: 2 }),
            frameRate: 5,
            repeat: -1
        });
        this.pilot.anims.play('moving', true);
        
        this.pilot.acceleration = 0;
        this.pilot.maxAcceleration = 1;
        this.pilot.speed = 0;
        this.pilot.maxSpeed = 2;
        
        
        this.inputs = new InputManager(this);
    }
    update(){
        if (this.inputs.A_Key.isDown) this.pilot.acceleration = this.pilot.maxAcceleration;
        else this.pilot.acceleration = -this.pilot.maxAcceleration;
        
        this.pilot.body.setAccelerationX(this.pilot.acceleration);
        if(this.pilot.body.velocity.x < 0){
            this.pilot.setAccelerationX(0);
            this.pilot.setVelocityX(0);
        } 
        else if(this.pilot.body.velocity.x > this.pilot.maxSpeed) {
            this.pilot.setAccelerationX(0);
            this.pilot.setVelocityX(this.pilot.maxSpeed);
        }

        this.backGround.tilePositionX += this.pilot.body.velocity.x; // scroll  
         
         
    }
}

