// player
class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        // add player to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // this.body.setSize(this.width, this.height);
        this.body.setCollideWorldBounds(true);

        // properties that don't exist yet

        // initialize state machine
        scene.pFSM = new StateMachine('runState', {
            runState: new RunState(),
            jumpState: new JumpState()
        }, [scene, this]);
    }
}

// player state classes

class RunState extends State {
    enter(scene, player) {
        player.anims.play('run');
    }
    execute(scene, player) {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.stateMachine.transition('jumpState');
            return;
        }
    }
}

class JumpState extends State {
    enter(scene, player) {
        player.anims.play('jump');
    }
    execute(scene, player) {
        if (Phaser.Input.Keyboard.JustDown(keySPACE)) {
            // for now just go back to running if space is pressed again
            this.stateMachine.transition('runState');
            return;
        }
    }
}