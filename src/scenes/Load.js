class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set load path
        this.load.path = 'assets/';
        // load assets now
        this.load.image('bg', 'room.png');
        //this.load.image('thing', 'thing.png');
        this.load.image('floor', 'floor.png');
        this.load.image('pillows', 'pillows.png');
        this.load.image('bed', 'bed.png');
        this.load.image('bear', 'bear.png');
        this.load.image('bunny', 'bunny.png');
        // load spritesheet
        this.load.spritesheet('thing', 'thing/thing_spritesheet.png', {
            frameWidth: 52,
            frameHeight: 75,
            startFrame: 0,
            endFrame: 5
        });
        // load bitmap font
        // original font from https://www.dafont.com/early-gameboy.font
        this.load.bitmapFont('main_font', 'fonts/early_gameboy_font.png', 'fonts/early_gameboy_font.xml')
    }

    create() {
        // animation config
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('thing', {start: 3, end: 5, first: 0}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('thing', {start: 0, end: 2, first: 0}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'stop',
            frames: this.anims.generateFrameNumbers('thing', {start: 3, end: 3, first: 0}),
            frameRate: 1,
            repeat: -1
        });
        // start menu
        this.scene.start('menuScene');
    }
}