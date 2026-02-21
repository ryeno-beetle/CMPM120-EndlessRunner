class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    create() {
        // display menu text
        this.add.bitmapText(config.width / 2, config.height / 2 - 40, 'main_font', 'ENDLESSLY ASYNC', 25).setOrigin(0.5);
        
        let textConfig = {
            fontFamily: 'long_text_font',
            fontSize: '15px',
            color: '#f0ffce',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5
            },
            lineSpacing: 5
        };
        this.add.text(config.width / 2, config.height / 2 + 30, 'press  [SPACE]  to start', textConfig).setOrigin(0.5);
        this.add.text(config.width / 2, config.height / 2 + 60, 'or  [I]  for instructions', textConfig).setOrigin(0.5);
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyI = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.I);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('tap_sfx', {volume: 0.2});
            this.scene.start('playScene');
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyI)) {
            this.sound.play('tap_sfx', {volume: 0.2});
            this.scene.start('instructionsScene');
        }
    }
}