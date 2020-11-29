// PRELOAD
        var rutaImg = 'assets/img/';
		this.load.image('image', rutaImg+'image.png');        	
       	this.load.spritesheet('sprite',rutaImg+'sprite.png',{frameWidth: 16, frameHeight: 24});

//CREATE
		this.image = this.add.tileSprite(0,0,128,256,'image').setOrigin(0);
        
        this.sprite = this.physics.add.sprite(config.width/2,config.height*.95,'sprite').setOrigin(0.5).setScale(1);
		
		this.anims.create({
            key: 'spriteAnim',
            frames: this.anims.generateFrameNumbers('sprite', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        
		this.sprite.anims.play('spriteAnim');
		
		this.cursors = this.input.keyboard.createCursorKeys();
        
        // add collisions with world bounds
		this.sprite.body.collideWorldBounds = true;
		
        
		this.Timer = this.time.addEvent({delay: 2000, callback: this.functionName, callbackScope: this, repeat: -1});
       
        // add Overlapment
        this.physics.add.overlap(this.group1, this.group2, this.functionName, null, this);

//UPDATE
    this.image.tilePositionY -=.25; // scroll       

            // get inputs and act
            if(this.cursors.left.isDown){            			
                this.sprite.anims.play('spriteAnim',true);
                this.sprite.body.velocity.x -=this.speed;
            } 
            else if(this.cursors.right.isDown){            
                this.nave.anims.play('right',true);           
                this.nave.body.velocity.x += this.speed;        
            } 

InstantiateObject(){
        
        // searches the first inactivated object 
		var object = this.group1.getFirst(false);
        
        if(!object){
            
            //crea una bala nueva
			console.log('create object'); 
			object = new  Prefab(posX, posY);
            this.group1.add(object));
            
		} else{
            
			//reset
            object.active = true;
            object.body.reset(this.nave.x, this.nave.body.top);
		
        }
	}

    
    functionName(collider1, collider2){
        console.log('function');
    }
 
	
	loadGroup(){
		this.group1 = this.physics.add.group();
    }


    // load a bitmap font
    this.load.bitmapFont('nesFont', 'assets/fonts/nes_font_0.png', 'assets/fonts/nes_font.xml');
    this.texto = this.add.bitmapText(10, 10, 'nesFont', "SELECTION A", 10);
