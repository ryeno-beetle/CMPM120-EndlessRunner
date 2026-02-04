class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // place tile sprite
        this.sky = this.add.tileSprite(0, 0, 640, 480, 'sky').setOrigin(0, 0);
        // define keys
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // game over flag
        this.gameOver = false

        // make player exist!
        this.p = new Player(this, config.width / 2, config.height - 50, 'run', 0);
        
        // EVENTS
    }

    update() {
        // check key input for restart
        if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart();
        }
        this.pFSM.step()
        //console.log(this.p); 
    }
}