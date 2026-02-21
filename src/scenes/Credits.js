class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene");
    }

    create() {
        // display credits text
        this.add.bitmapText(50, 50, 'main_font', 'CREDITS', 25);

        // text config
        let textConfig = {
            fontFamily: 'long_text_font',
            fontSize: '15px',
            color: '#f0ffce',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5
            },
            wordWrap: {
                width: config.width - 100
            },
            lineSpacing: 5
        };
        this.add.text(50, 100, 'all art and sound by me !', textConfig);
        this.add.text(50, 160, `main font: early gameboy by jimmy campbell (dafont.com/early-gameboy.font)\n\nsub font: dogica by roberto mocci (dafont.com/dogica.font)`, textConfig);
        textConfig.fontSize = 13;
        this.add.text(50, 430, 'press SPACE to return to menu', textConfig);
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play('tap_sfx', {volume: 0.2});
            this.scene.start('menuScene');
        }
    }
}