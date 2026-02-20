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
        this.speed = 200; // in frames per second
        this.minSpeed = 50;
        this.maxSpeed = 350;
        this.spawnTimeMin = 2000; // in ms
        this.spawnTimeMax = 3000;
        this.obstacleSpeed = 300; // in fps
        this.obstacleFadePosition = 200; // in px
        this.maxObstacleFadePosition = 300;
        this.minObstacleFadePosition = 50;
        this.perFrameSpeedDec = 0.05; // fps
        this.perClickSpeedInc = 15;
        this.gameOver = false;

        this.obstacleKeys = ['bed', 'pillows', 'bear', 'bunny']; // arr of keys for obstacles
        this.obstacleGroup = this.add.group(); // group for obstacles
        

        // make player exist!
        this.p = new Player(this, 3 * config.width / 4, config.height - 200, 'run', 0);

        // make floor exist?
        this.floor = this.physics.add.sprite(0, config.height - 60, 'floor').setOrigin(0);
        this.floor.alpha = 0; // we don't actually want this to be visible, we just need a constant collider box
        this.floor.body.setImmovable(true);
        this.floor.body.setAllowGravity(false);

        // make player and floor collide
        this.physics.add.collider(this.p, this.floor);

        // start spawn timer loop for obstacles
        this.spawnObstacleTimer();

        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '20px',
            backgroundColor: '#FFFFFF',
            color: '#bc3c54',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        };
        this.stopwatchText = this.add.text(10, 10, '0', textConfig);

        // speed bar ui
        this.speedBarUI = new Phaser.Geom.Rectangle(120, config.height - 40, -110, 30); // origin on the top right
        let fillWidth = (this.maxSpeed - this.speed) / (this.maxSpeed - this.minSpeed); // current speed as a percentage
        console.log("fill width: " + fillWidth);
        this.speedBarFillUIMaxWidth = 100;
        this.speedBarFillUI = new Phaser.Geom.Rectangle(115, config.height -  35, -fillWidth * this.speedBarFillUIMaxWidth, 20); // fill bar, width represents current speed
        console.log("speed bar width: " + (-fillWidth * this.speedBarFillUIMaxWidth));

        this.graphics = this.add.graphics();
        this.graphics.fillStyle('0x120531');
        this.graphics.fillRectShape(this.speedBarUI);
        this.graphics.fillStyle('0xf0ffce');
        this.graphics.fillRectShape(this.speedBarFillUI);

        // EVENTS
    }

    update(time, delta) {
        if (!this.gameOver) {
            // stopwatch update
            // TODO: change to use bitmap text
            this.stopwatchText.setText(Math.floor(time / 1000));

            // increase overall speed of game up to a certain point
            let speedInc = 0.1;
            if (this.speed < 1000) {
                //this.speed += speedInc; // in frames per second
                //this.spawnTimeMin = 2000; // in ms
                //this.spawnTimeMax = 3000;
                this.obstacleSpeed += speedInc; // in fps
                this.minSpeed += speedInc;
                this.maxSpeed += speedInc;
            }

            // move bg and obstacle fade position (and convert px/s to px/frame)
            this.bg.tilePositionX -= this.speed * (delta / 1000);

            let deltaFadePos = (this.speed - this.obstacleSpeed) * (delta / 1000); // fade pos moves dif btwn player/obstacle speeds
            if ((deltaFadePos > 0 && this.obstacleFadePosition < this.maxObstacleFadePosition)
                || (deltaFadePos < 0 && this.obstacleFadePosition > this.minObstacleFadePosition)) {
                this.obstacleFadePosition += deltaFadePos;
            }

            // decrease player speed
            if (this.speed > this.minSpeed) {
                this.speed -= this.perFrameSpeedDec;
            }
            
            // check obstacle position (we should handle this in obstacle class If That Feels Like Working)
            let obstacleArr = this.obstacleGroup.getChildren();
            for (let i = 0; i < obstacleArr.length; i++) {
                // change obstacle speed
                obstacleArr[i].setVelocityX(this.speed);
                // fade if its past obstacle fade position
                if (obstacleArr[i].x + obstacleArr[i].width > this.obstacleFadePosition && !obstacleArr[i].disappeared) {
                    obstacleArr[i].alpha = 0.1;
                    obstacleArr[i].disappeared = true;
                }
                // destroy if it's off screen
                if (obstacleArr[i].x > config.width) {
                    obstacleArr[i].destroy();
                }
            }

            // check key input
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                if (this.speed < this.maxSpeed && this.speed > this.minSpeed) {
                    this.speed += this.perClickSpeedInc;
                }
            }
            this.pFSM.step();

            // speed bar ui update
            this.updateSpeedBarUI();
        }
        // check reset key input
        if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.restart();
        }
    }

    updateSpeedBarUI() {
        this.graphics.clear();

        let fillWidth = (this.speed - this.minSpeed) / (this.maxSpeed - this.minSpeed); // current speed as a percentage
        this.speedBarFillUI.width = -fillWidth * this.speedBarFillUIMaxWidth;

        this.graphics.fillStyle('0x120531');
        this.graphics.fillRectShape(this.speedBarUI);
        this.graphics.fillStyle('0xf0ffce');
        this.graphics.fillRectShape(this.speedBarFillUI);
    }

    spawnObstacleTimer() {
        if (!this.gameOver) {
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
                        obs.alpha = 1;
                        this.setGameOver();
                    }
                    // player has hit an obstacle
                    console.log('ow');
                })
                this.spawnObstacleTimer();
            }, null, this);
        }
    }

    setGameOver() {
        this.gameOver = true;
        // stop everything from moving
        this.p.anims.play('stop');
        this.speed = 0;
        this.p.setVelocity(0, 0);
        let obstacleArr = this.obstacleGroup.getChildren();
        for (let i = 0; i < obstacleArr.length; i++) {
            obstacleArr[i].setVelocity(0, 0);
        }
        let rect = new Phaser.Geom.Rectangle(0, 0, config.width, config.height);
        let rect2 = new Phaser.Geom.Rectangle(0, 150, config.width, 200);
        this.graphics.fillStyle('0x120531', 0.5);
        this.graphics.fillRectShape(rect).setDepth(100);
        this.graphics.fillStyle('0x120531', 0.9);
        this.graphics.fillRectShape(rect2).setDepth(100);
        this.add.bitmapText(config.width / 2, config.height / 2 - 20, 'main_font', 'GAME OVER', 30).setOrigin(0.5).setDepth(100);
        this.add.bitmapText(config.width / 2, config.height / 2 + 30, 'main_font', "press R to restart", 20).setOrigin(0.5).setDepth(100);
    }
}
