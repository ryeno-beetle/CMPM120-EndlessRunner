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
        // load spritesheets
        this.load.spritesheet('thing', 'thing/thing_spritesheet.png', {
            frameWidth: 52,
            frameHeight: 75,
            startFrame: 0,
            endFrame: 5
        });
        this.load.spritesheet('bed_sheet', 'bed_bye/bed_bye_spritesheet.png', {
            frameWidth: 192,
            frameHeight: 102,
            startFrame: 0,
            endFrame: 12
        });
        this.load.spritesheet('pillows_sheet', 'pillows_bye/pillows_bye_spritesheet.png', {
            frameWidth: 96,
            frameHeight: 52,
            startFrame: 0,
            endFrame: 9
        });
        this.load.spritesheet('bear_sheet', 'bear_bye/bear_bye_spritesheet.png', {
            frameWidth: 78,
            frameHeight: 98,
            startFrame: 0,
            endFrame: 11
        });
        this.load.spritesheet('bunny_sheet', 'bunny_bye/bunny_bye_spritesheet.png', {
            frameWidth: 68,
            frameHeight: 34,
            startFrame: 0,
            endFrame: 9
        });
        this.load.spritesheet('ghost_sheet', 'ghost/ghost_spritesheet.png', {
            frameWidth: 47,
            frameHeight: 68,
            startFrame: 0,
            endFrame: 3
        });

        // load bitmap font
        this.load.bitmapFont('main_font', 'fonts/early_gameboy_font.png', 'fonts/early_gameboy_font.xml')
        // load normal font
        this.load.font('long_text_font', 'fonts/dogica.ttf', 'truetype');

        // load audio sfx
        this.load.audio('foot_1_sfx', '/sfx/foot_1.wav');
        this.load.audio('foot_2_sfx', '/sfx/foot_2.wav');
        this.load.audio('foot_3_sfx', '/sfx/foot_3.wav');
        this.load.audio('foot_4_sfx', '/sfx/foot_4.wav');
        this.load.audio('fsh_1_sfx', '/sfx/fsh_1.wav');
        this.load.audio('fsh_2_sfx', '/sfx/fsh_2.wav');
        this.load.audio('fsh_3_sfx', '/sfx/fsh_3.wav');
        this.load.audio('bam_sfx', '/sfx/bam.wav');
        this.load.audio('tap_sfx', '/sfx/tap.wav');
        this.load.audio('jump_sfx', '/sfx/jump.wav');

        this.load.audio('music', 'song.wav');
    }

    create() {
        let bye_fr = 8;
        let hi_fr = 32;
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

        // bed
        this.anims.create({
            key: 'bed_bye',
            frames: this.anims.generateFrameNumbers('bed_sheet', {start: 0, end: 12, first: 0}),
            frameRate: bye_fr,
        });
        this.anims.create({
            key: 'bed_hi',
            frames: this.anims.generateFrameNumbers('bed_sheet', {start: 11, end: 0, first: 12}),
            frameRate: hi_fr,
        });
        this.anims.create({
            key: 'bed_still',
            frames: this.anims.generateFrameNumbers('bed_sheet', {start: 0, end: 0, first: 0}),
            frameRate: 1,
            repeat: -1
        });

        // pillows
        this.anims.create({
            key: 'pillows_bye',
            frames: this.anims.generateFrameNumbers('pillows_sheet', {start: 0, end: 9, first: 0}),
            frameRate: bye_fr,
        });
        this.anims.create({
            key: 'pillows_hi',
            frames: this.anims.generateFrameNumbers('pillows_sheet', {start: 8, end: 0, first: 9}),
            frameRate: hi_fr,
        });
        this.anims.create({
            key: 'pillows_still',
            frames: this.anims.generateFrameNumbers('pillows_sheet', {start: 0, end: 0, first: 0}),
            frameRate: 1,
            repeat: -1
        });

        // bear
        this.anims.create({
            key: 'bear_bye',
            frames: this.anims.generateFrameNumbers('bear_sheet', {start: 0, end: 11, first: 0}),
            frameRate: bye_fr,
        });
        this.anims.create({
            key: 'bear_hi',
            frames: this.anims.generateFrameNumbers('bear_sheet', {start: 10, end: 0, first: 11}),
            frameRate: hi_fr,
        });
        this.anims.create({
            key: 'bear_still',
            frames: this.anims.generateFrameNumbers('bear_sheet', {start: 0, end: 0, first: 0}),
            frameRate: 1,
            repeat: -1
        });

        // bunny
        this.anims.create({
            key: 'bunny_bye',
            frames: this.anims.generateFrameNumbers('bunny_sheet', {start: 0, end: 9, first: 0}),
            frameRate: bye_fr,
        });
        this.anims.create({
            key: 'bunny_hi',
            frames: this.anims.generateFrameNumbers('bunny_sheet', {start: 8, end: 0, first: 9}),
            frameRate: hi_fr,
        });
        this.anims.create({
            key: 'bunny_still',
            frames: this.anims.generateFrameNumbers('bunny_sheet', {start: 0, end: 0, first: 0}),
            frameRate: 1,
            repeat: -1
        });

        // hidden anim
        this.anims.create({
            key: 'hidden',
            frames: this.anims.generateFrameNumbers('bunny_sheet', {start: 9, end: 9, first: 9}),
            frameRate: 1,
            repeat: -1
        });

        // ghost
        this.anims.create({
            key: 'ghost',
            frames: this.anims.generateFrameNumbers('ghost_sheet', {start: 0, end: 3, first: 0}),
            frameRate: 8,
            repeat: -1
        });


        // start menu
        this.scene.start('menuScene');
    }
}