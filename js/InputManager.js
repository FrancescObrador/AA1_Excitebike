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
    //  Ctrl K->C comentar
    //  Ctrl K->U descomentar

    constructor(scene){

        this.inputPlugin = new Phaser.Input.InputPlugin(scene);
        
        this.keyboardPlugin = new Phaser.Input.Keyboard.KeyboardPlugin(this.inputPlugin);

        this.A_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.B_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.Up_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.W);
        this.Down_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.S);
        this.Left_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.A);
        this.Right_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin,Phaser.Input.Keyboard.KeyCodes.D);
        this.P_Key = new Phaser.Input.Keyboard.Key(this.keyboardPlugin, Phaser.Input.Keyboard.KeyCodes.P); 
 
        scene.input.keyboard.addKey(this.A_Key); 
        scene.input.keyboard.addKey(this.B_Key); 
        scene.input.keyboard.addKey(this.Up_Key); 
        scene.input.keyboard.addKey(this.Down_Key); 
        scene.input.keyboard.addKey(this.Left_Key); 
        scene.input.keyboard.addKey(this.Right_Key); 
        scene.input.keyboard.addKey(this.P_Key); 
    }

}