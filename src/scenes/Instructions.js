class Instructions extends Phaser.Scene {
    constructor() {
        super("instructionsScene");
    }

    create() {
        // display menu text
        this.add.bitmapText(50, 50, 'main_font', 'INSTRUCTIONS', 25);

        // this.add.bitmapText(50, 90, 'main_font', 'SPACE or UP : jump', 20);
        // this.add.bitmapText(50, 130, 'main_font', 'LEFT : increase speed', 20);

        // this.add.bitmapText(50, 200, 'main_font', 'increasing your speed requires energy.', 15);
        // this.add.bitmapText(50, 230, 'main_font', 'you slow down over time,', 15);
        // this.add.bitmapText(50, 260, 'main_font', 'but also gain energy over time.', 15);

        // this.add.bitmapText(50, 290, 'main_font', 'things might disappear from sight,', 15);
        // this.add.bitmapText(50, 320, 'main_font', 'but they are still there.', 15);
        // this.add.bitmapText(50, 350, 'main_font', 'you have to keep up,', 15);
        // this.add.bitmapText(50, 380, 'main_font', "or you will be left behind.", 15);

        // this.add.bitmapText(50, 440, 'main_font', "press  SPACE  to return to menu", 15);

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
        // display instructions text
        this.add.text(50, 100, 'SPACE / UP  -  jump\nLEFT        -  increase speed', textConfig);
        this.add.text(50, 160, `you've fallen out of sync. things might disappear from sight, but they are still there.\n\n[obstacles will disappear at their own speed (the pace of the bunny-ghost), which will increase over time. Your speed will decrease if left alone, but you can use energy to increase your speed and keep up with the spot at which things disappear. don't fall too far behind.]`, textConfig);
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