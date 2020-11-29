class GamePlay extends Phaser.Scene{
    constructor(){
        super({key: 'GamePlay'});
   }

   preload(){
    var ruta = "assets/img/";
    this.load.image('backGround', ruta + "gamePlayBG.png");

    }
    create(){
        this.menu = this.add.image(0, 0, 'backGround').setScale(0.25).setOrigin(0);
    }
}

