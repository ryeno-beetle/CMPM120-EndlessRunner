class Load extends Phaser.Scene {
    constructor() {
        super('loadScene');
    }

    preload() {
        // set load path
        this.load.path = 'assets/';
        // load assets now
        this.load.image('bg', 'room.png');
        this.load.image('thing', 'thing.png');
        this.load.image('floor', 'floor.png');
        this.load.image('pillows', 'pillows.png');
        this.load.image('bed', 'bed.png');
        this.load.image('bear', 'bear.png');
        this.load.image('bunny', 'bunny.png');
    }

    create() {
        // start menu
        this.scene.start('menuScene');
    }
}