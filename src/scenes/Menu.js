class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load imgs/tile sprites
        this.load.image('fish', './assets/fish.png');
        this.load.image('sky', './assets/sky.png');
        // load spritesheet
        this.load.spritesheet('om', './assets/puppycat_om_spritesheet.png', {
            frameWidth: 54,
            frameHeight: 72,
            startFrame: 0,
            endFrame: 7
        });
        //load atlas
        this.load.atlas('puppycat_flail', './assets/puppycat_flail_spritesheet.png', './assets/puppycat_flail.json');
    }

    create() {
        // animation config
        if (!this.anims.exists('om')) {
            this.anims.create({
                key: 'om',
                frames: this.anims.generateFrameNumbers('om', {start: 0, end: 6, first: 0}),
                frameRate: 10
            });
            this.anims.create({
                key: 'jump',
                frames: this.anims.generateFrameNumbers('om', {start: 3, end: 6, first: 3}),
                frameRate: 10,
                repeat: -1
            })
            this.anims.create({
                key: 'run',
                frames: this.anims.generateFrameNames('puppycat_flail'),
                frameRate: 10,
                repeat: -1
            })
        }

        // menu config
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#bc3c54',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        };
        // display menu text
        this.add.text(game.config.width / 2, game.config.height / 2, '[ENDLESS RUNNER]', menuConfig).setOrigin(0.5);
        menuConfig.fontSize = '24px';
        this.add.text(game.config.width / 2, game.config.height / 4 * 3, '[press space to start]', menuConfig).setOrigin(0.5);
        // define keys
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('playScene');
        }
    }
}