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
        this.load.xml('obsts', 'assets/map1Info.xml');
    }
    create(){

        

        var list = this.cache.xml.get('obsts');
        var obstacles = list.getElementsByTagName('obstacle');
        for (var i = 0; i < obstacles.length; ++i)
        {
            var item = obstacles[i];
            var type = item.getAttribute('type');
            var position = item.getAttribute('position');
            var height = item.getAttribute('height');
            console.log(String(type) + ' ' + String(position) + ' ' + String(height));
            // TODO llamar al constructor de obstaculos con el tipo y las posiciones
        }

        this.backGround = this.add.image(0, 0, 'backGround').setOrigin(0).setScale(1);

        this.pilot = this.physics.add.sprite(config.width/2, 125, 'pilotLoop').setOrigin(0.5);
       
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
        
        this.pilot.acceleration = 0.01;
        this.pilot.speed = 0;
        this.pilot.maxSpeed = 1.5;
        
        this.inputs = new InputManager(this);

        // y positions of the 4 lines
        this.lines = [125, 138, 150, 162];
        this.currentLine = 0;
        this.pilot.isOnTween = false;
        
    }


    update(){
        
        if (this.inputs.A_Key.isDown && this.pilot.speed < this.pilot.maxSpeed ){    
            this.pilot.speed += this.pilot.acceleration;
        } 
        else if(this.pilot.speed > 0) {
            this.pilot.speed -= this.pilot.acceleration;
        }
    
        if(!this.pilot.isOnTween) {
            if(this.inputs.Up_Key.isDown && this.currentLine > 0){
                this.currentLine--;
                this.physics.moveTo(this.pilot, config.width/2, this.lines[this.currentLine]);
                this.pilot.isOnTween = true;
                this.pilot.setTexture('pilotTurnLeft');
            } 
            else if(this.inputs.Down_Key.isDown && this.currentLine < this.lines.length-1){
                this.currentLine++;
                this.physics.moveTo(this.pilot, config.width/2, this.lines[this.currentLine]);
                this.pilot.isOnTween = true;
                this.pilot.setTexture('pilotTurnRight')
            }
        }
        else{

            if(this.pilot.y == this.lines[this.currentLine]){
                this.pilot.body.stop();
                this.pilot.isOnTween = false;
            }
            
        }

        this.backGround.x -= this.pilot.speed; // scroll  
         
         
    }
    
}

