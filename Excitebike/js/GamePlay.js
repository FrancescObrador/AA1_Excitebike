class GamePlay extends Phaser.Scene{
    constructor(){
        super({key: 'GamePlay'});
   }

    preload(){
        var ruta = 'assets/img/';
        this.load.image('backGround', ruta + 'gamePlayBG.png');
        ruta += 'pilot/';
        this.load.image('motorbike',ruta + 'motorbike.png');
        this.load.spritesheet('pilotLoop', ruta + 'pilot_loop.png', {frameWidth: 98/4, frameHeight: 24});
        this.load.spritesheet('pilotFrontTilt', ruta + 'pilot_front_tilt.png', {frameWidth: 92/4, frameHeight: 25});
        this.load.spritesheet('pilotWheelies', ruta + 'pilot_wheelies.png', {frameWidth: 138/6, frameHeight: 26});
        this.load.spritesheet('pilotGetUp', ruta + 'pilot_get_up', {frameWidth: 77/3, frameHeight: 21});
        this.load.spritesheet('pilotMoving', ruta + 'pilot_moving.png',{frameWidth: 40/2, frameHeight: 21});
        this.load.spritesheet('pilotRunning', ruta + 'pilot_running',{frameWidth: 28/2, frameHeight: 16});
        this.load.image('pilotTurnLeft',ruta + 'pilot_turning_left');
        this.load.image('pilotTurnRight',ruta + 'pilot_turning_right');

    }
    create(){
        this.menu = this.add.image(0, 0, 'backGround').setScale(0.25).setOrigin(0);

        this.pilot = this.add.sprite(128,20,'motorbike').setOrigin(0.5);
        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNumbers('pilotRunning', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        this.inputs = new InputManager(this);
    }
    update(){
        if(this.inputs.A_Key.isDown){
            this.pilot.anims.play('running', true);
        }
    }
}

