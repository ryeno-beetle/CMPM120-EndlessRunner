class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    create() {
        // place tile sprite
        this.bg = this.add.tileSprite(0, 0, 640, 480, 'bg').setOrigin(0, 0);
        
        // define keys
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        // vars
        this.gameOver = false;
        this.speed = 100 // in frames per second;
        this.spawnTimeMin = 2000; // in ms
        this.spawnTimeMax = 3000;

        this.obstacleKeys = ['bed', 'pillows', 'bear', 'bunny']; // arr of keys for obstacles
        this.obstacleGroup = this.add.group(); // group for obstacles
        

        // make player exist!
        this.p = new Player(this, config.width / 2, config.height - 200, 'thing', 0);

        // make floor exist?
        this.floor = this.physics.add.sprite(0, config.height - 60, 'floor').setOrigin(0);
        this.floor.alpha = 0; // we don't actually want this to be visible, we just need a constant collider box
        this.floor.body.setImmovable(true);
        this.floor.body.setAllowGravity(false);

        // make player and floor collide
        this.physics.add.collider(this.p, this.floor);

        // start spawn timer loop for obstacles
        this.spawnObstacleTimer();

        // EVENTS
    }

    update(time, delta) {

        console.log(this.obstacleGroup.getChildren());
        // move bg (and convert px/s to px/frame)
        this.bg.tilePositionX -= this.speed * (delta / 1000);
        
        // check obstacle position (we should handle this in obstacle class If That Feels Like Working)
        let obstacleArr = this.obstacleGroup.getChildren();
        for (let i = 0; i < obstacleArr.length; i++) {
            // destroy if it's off screen
            if (obstacleArr[i].x > config.width) {
                obstacleArr[i].destroy();
            }
        }

        // check key input for restart
        if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart();
        }
        this.pFSM.step();
    }

    spawnObstacleTimer() {
        console.log('spawn called!');
        let spawnTime = Phaser.Math.Between(this.spawnTimeMin, this.spawnTimeMax);
        let obstacleIndex = Phaser.Math.Between(0, this.obstacleKeys.length - 1);
        this.clock = this.time.delayedCall(spawnTime, () => {
            let obs = new Obstacle(this, 0, 0, this.obstacleKeys[obstacleIndex]).setOrigin(0);
            obs.setX( - obs.width - 10); // off the left side
            obs.setY(config.height - obs.height - 50);
            obs.setVelocityX(this.speed);
            this.obstacleGroup.add(obs);
            this.physics.add.collider(this.p, obs, () => {
                if (this.p.body.touching.left) {
                    // player hit obstacle
                    console.log("AAAA");
                }
                // player has hit an obstacle
                console.log('ow');
            })
            this.spawnObstacleTimer();
        }, null, this);
    }
}