// player
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add player to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.RUN_SIZE = {x: 52, y: 75};
        this.JUMP_SIZE = {x: 52, y: 70};
        this.body.setSize(this.RUN_SIZE.x, this.RUN_SIZE.y);
        this.body.setCollideWorldBounds(true);
        this.body.setFriction(0);

        // properties
        this.ACCELERATION = 1500;
        this.JUMP_VELOCITY = -1000;
        scene.physics.world.gravity.y = 2600;

        // initialize state machine
        scene.pFSM = new StateMachine('runState', {
            runState: new RunState(),
            jumpState: new JumpState()
        }, [scene, this]);

        this.FOOTSTEP_SOUNDS = ['foot_1_sfx', 'foot_2_sfx', 'foot_3_sfx', 'foot_4_sfx'];
        this.footstepTime = 375 // in ms; 8 fps / 3 frames = 8/3 footsteps/sec; 1 sec / (8/3) = 3/8 seconds
    }

    startFootsteps(scene) {
        if (scene.pFSM.state == 'runState' && !scene.gameOver) {
            // play random footstep sound
            let footstep = Phaser.Math.Between(0, 3);
            scene.sound.play(this.FOOTSTEP_SOUNDS[footstep], {volume: 0.1});
        }
        // timer for footsteps
        scene.time.delayedCall(this.footstepTime, () => {
            if (scene.pFSM.state == 'runState' && !scene.gameOver) {
                this.startFootsteps(scene);
            }
        });
    }

}

// player state classes

class RunState extends State {
    enter(scene, player) {
        player.anims.play('run');
        player.startFootsteps(scene);
        player.y -= player.RUN_SIZE.y - player.JUMP_SIZE.y + 1;
        player.body.setSize(player.RUN_SIZE.x, player.RUN_SIZE.y);
    }
    execute(scene, player) {
        if (Phaser.Input.Keyboard.JustDown(keySPACE) || Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.stateMachine.transition('jumpState');
            return;
        }
    }
}

class JumpState extends State {
    enter(scene, player) {
        player.anims.play('jump');
        scene.sound.play('jump_sfx', {volume: 0.2});
        player.body.setSize(player.JUMP_SIZE.x, player.JUMP_SIZE.y);
        player.setVelocity(0, player.JUMP_VELOCITY);
    }
    execute(scene, player) {
        // if on ground, go back to run state
        if (player.body.touching.down) {
            this.stateMachine.transition('runState');
            return;
        }
    }
}