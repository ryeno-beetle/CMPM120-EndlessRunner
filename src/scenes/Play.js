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
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        // vars
        this.gameOver = false;

        this.speed = 300; // in frames per second
        this.minSpeed = 50;
        this.maxSpeed = 350;

        this.obstacleSpeed = 300; // in fps
        this.obstacleFadePosition = 200; // in px
        this.maxObstacleFadePosition = 300;
        this.minObstacleFadePosition = 50;

        this.perFrameSpeedDec = 0.05; // fps
        this.perClickSpeedInc = 15;
        this.speedInc = 0.1;

        this.spawnTimeMin = 1000; // in ms
        this.spawnTimeMax = 2000;
        this.MIN_SPAWN_TIME_MIN = 10;
        this.MIN_SPAWN_TIME_MAX = 500;

        this.energy = 500;
        this.ENERGY_INC = 1; // per frame energy increase
        this.ENERGY_DEC = 100; // energy decrease every time player speeds up
        this.MAX_ENERGY = 500;

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

        // stopwatch ui
        this.stopwatchText = this.add.bitmapText(500, config.height - 20, 'main_font', 'TIME: 0', 15).setOrigin(0, 1).setDepth(UI_DEPTH / 2);

        // speed bar ui
        this.add.bitmapText(10, config.height - 20, 'main_font', 'SPEED:', 15).setOrigin(0, 1).setDepth(UI_DEPTH / 2);
        this.SPEED_BAR_FILL_UI_MAX_WIDTH = 100;
        this.speedBarUI = new Phaser.Geom.Rectangle(220, config.height - 40, -110, 30); // origin on the top right
        this.speedBarFillUI = new Phaser.Geom.Rectangle(215, config.height -  35, - this.SPEED_BAR_FILL_UI_MAX_WIDTH, 20); // fill bar, width represents current speed

        // energy bar ui
        this.add.bitmapText(245, config.height - 20, 'main_font', 'ENERGY:', 15).setOrigin(0, 1).setDepth(UI_DEPTH / 2);
        this.ENERGY_BAR_FILL_UI_MAX_WIDTH = 100;
        this.energyBarUI = new Phaser.Geom.Rectangle(470, config.height - 40, -110, 30); // origin on the top right
        this.energyBarFillUI = new Phaser.Geom.Rectangle(465, config.height -  35, - this.ENERGY_BAR_FILL_UI_MAX_WIDTH, 20); // fill bar, width represents current speed

        // add graphics and update bar ui
        this.graphics = this.add.graphics();
        this.updateBarUI();

        this.ghost = this.add.sprite(this.obstacleFadePosition, config.height/2, 'ghost_sheet');
        this.ghost.play('ghost');

        this.elapsedTime = 0;

        // EVENTS
    }

    update(time, delta) {
        if (!this.gameOver) {
            
            // stopwatch update
            this.elapsedTime += delta;
            this.stopwatchText.setText('TIME: ' + Math.floor(this.elapsedTime / 1000));

            // increase speed of game up to a certain point
            if (this.obstacleSpeed < 1000) {
                this.obstacleSpeed += this.speedInc; // in fps
                this.minSpeed += this.speedInc;
                this.maxSpeed += this.speedInc;
                if (this.spawnTimeMin > this.MIN_SPAWN_TIME_MIN) {this.spawnTimeMin -= this.speedInc;} else {console.log('min min spawn time reached');}
                if (this.spawnTimeMax > this.MIN_SPAWN_TIME_MAX) {this.spawnTimeMax -= this.speedInc;} else {console.log('min max spawn time reached');}
                // decrease the amount the speed increases by each frame
                this.speedInc -= this.speedInc * 0.0001;
            }

            // increase energy
            if (this.energy < this.MAX_ENERGY) {
                this.energy += this.ENERGY_INC;
            }

            // move bg and obstacle fade position (and convert px/s to px/frame)
            this.bg.tilePositionX -= this.speed * (delta / 1000);

            let deltaFadePos = (this.speed - this.obstacleSpeed) * (delta / 1000); // fade pos moves dif btwn player/obstacle speeds
            if ((deltaFadePos > 0 && this.obstacleFadePosition < this.maxObstacleFadePosition) || deltaFadePos < 0) { // took out case for minObstacleFadePosition: (deltaFadePos < 0 && this.obstacleFadePosition > this.minObstacleFadePosition)
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
                // play bye anim if it's past obstacle fade position
                if (obstacleArr[i].x + obstacleArr[i].width > this.obstacleFadePosition && !obstacleArr[i].disappeared) {
                    obstacleArr[i].anims.play(obstacleArr[i].name + "_bye");
                    obstacleArr[i].playDisappearSound(this);
                    obstacleArr[i].disappeared = true;

                }
                // destroy if it's off screen
                if (obstacleArr[i].x > config.width) {
                    obstacleArr[i].destroy();
                }
            }

            // check speed up key input
            if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
                if (this.speed < this.maxSpeed && this.energy > this.ENERGY_DEC) {
                    this.speed += this.perClickSpeedInc;
                    this.energy -= this.ENERGY_DEC;
                }
            }
            this.pFSM.step();

            // speed and energy bar ui update
            this.updateBarUI();
            // debug obstacle fade position ghost
            this.ghost.x = this.obstacleFadePosition;
        }
        // check reset key input
        if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.sound.play('tap_sfx', {volume: 0.2});
            this.scene.restart();
        }
        // check space key when game is over
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.scene.start('menuScene');
        }
    }

    updateBarUI() {
        this.graphics.clear();

        //update speed bar ui
        let fillWidth = (this.speed - this.minSpeed) / (this.maxSpeed - this.minSpeed); // current speed as a percentage
        this.speedBarFillUI.width = -fillWidth * this.SPEED_BAR_FILL_UI_MAX_WIDTH;

        this.graphics.fillStyle(UI_BG_COLOR);
        this.graphics.fillRectShape(this.speedBarUI);
        this.graphics.fillStyle(UI_COLOR);
        this.graphics.fillRectShape(this.speedBarFillUI);

        // update energy bar ui
        fillWidth = this.energy / this.MAX_ENERGY;
        this.energyBarFillUI.width = -fillWidth * this.ENERGY_BAR_FILL_UI_MAX_WIDTH;
        this.graphics.fillStyle(UI_BG_COLOR);
        this.graphics.fillRectShape(this.energyBarUI);
        this.graphics.fillStyle(UI_COLOR);
        this.graphics.fillRectShape(this.energyBarFillUI);
    }

    spawnObstacleTimer() {
        if (!this.gameOver) {
            let spawnTime = Phaser.Math.Between(this.spawnTimeMin, this.spawnTimeMax);
            let obstacleIndex = Phaser.Math.Between(0, this.obstacleKeys.length - 1);
            this.clock = this.time.delayedCall(spawnTime, () => {
                let obs = new Obstacle(this, 0, 0, this.obstacleKeys[obstacleIndex] + "_sheet", this.obstacleKeys[obstacleIndex]).setOrigin(0);
                obs.setX( - obs.width - 10); // off the left side
                obs.setY(config.height - obs.height - 50);
                obs.setVelocityX(this.speed);
                if (obs.x > this.obstacleFadePosition) {
                    // starting hidden
                    obs.anims.play('hidden');
                    obs.disappeared = true;
                }
                this.obstacleGroup.add(obs);
                this.physics.add.collider(this.p, obs, () => {
                    obs.anims.play(obs.name + "_still");
                    if (this.p.body.touching.left) {
                        // player hit obstacle
                        this.setGameOver()
                        obs.anims.play(obs.name + "_hi");
                        obs.on('animationcomplete', () => {this.showGameOverScreen()})
                    }
                })
                this.spawnObstacleTimer();
            }, null, this);
        }
    }

    setGameOver() {
        this.gameOver = true;
        // bam sound
        this.sound.play('bam_sfx', {volume: 0.5});
        // stop everything from moving
        this.p.anims.play('stop');
        this.speed = 0;
        this.p.setVelocity(0, 0);
        let obstacleArr = this.obstacleGroup.getChildren();
        for (let i = 0; i < obstacleArr.length; i++) {
            obstacleArr[i].setVelocity(0, 0);
        }
    }

    showGameOverScreen() {
        let rect = new Phaser.Geom.Rectangle(0, 0, config.width, config.height);
        let rect2 = new Phaser.Geom.Rectangle(0, 150, config.width, 200);
        this.graphics.fillStyle('0x120531', 0.5);
        this.graphics.fillRectShape(rect).setDepth(UI_DEPTH);
        this.graphics.fillStyle('0x120531', 0.9);
        this.graphics.fillRectShape(rect2).setDepth(UI_DEPTH);
        
        this.add.bitmapText(config.width / 2, config.height / 2 - 20, 'main_font', 'GAME OVER', 30).setOrigin(0.5).setDepth(UI_DEPTH);
        
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
        this.add.text(config.width / 2, config.height / 2 + 30, 'press  [R]  to restart', textConfig).setOrigin(0.5).setDepth(UI_DEPTH);
        this.add.text(config.width / 2, config.height / 2 + 60, 'or  [SPACE]  to return to menu', textConfig).setOrigin(0.5).setDepth(UI_DEPTH);
        //this.add.bitmapText(config.width / 2, config.height / 2 + 30, 'main_font', 'press R to restart', 20).setOrigin(0.5).setDepth(UI_DEPTH);
    }
}
