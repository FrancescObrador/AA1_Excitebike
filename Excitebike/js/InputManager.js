const { Input } = require("phaser");

class InputManager{

    //PDF Instruccions
    //  A Button: This is the accelerator and brake. Press it and the bike accelerates, let go and the bike brakes operate
    //  B Button: This is the turbo.
    //  UpArrow: Turn handlebar to the left
    //  DownArrow: Turn handlebar to the right
    //  LeftArrow: Raise the front during a run or a jump
    //  RightArrow: Lower the front during a jump
    //  Select Button: move flag -> Arrows will do it instead
    //  Start Button: start game -> A Button will do it instead

    InputManager(scene){
        this.scene = scene;
        this.inputPlugin = new Phaser.Input.InputPlugin(this.scene);
        this.keyboardPlugin = new Phaser.Input.Keyboard.KeyboardPlugin(this.inputPlugin);

        this.A_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.B_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.Up_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.W);
        this.Down_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.S);
        this.Left_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.A);
        this.Right_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.D);

        this.A = false;
        this.A_Key.on('down',this.A_Down,this.scene);
        this.B = false;
        this.B_Key.on('down',this.B_Down,this.scene);
    }
    update(){
        

        
    }
    A_Down(){
        this.A = true;
        console.log("aaa");
    }
    B_Down(){
        this.B = true;
        console.log("bbb");
    }
}