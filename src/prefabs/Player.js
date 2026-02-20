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
        this.MAX_JUMPS = 2;
        this.JUMP_VELOCITY = -700;
        this.JUMP_KEY_TIME = 150;
        scene.physics.world.gravity.y = 2600;
        this.jumps = 0;

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
        console.log('run');
        player.anims.play('run');
        player.y -= player.RUN_SIZE.y - player.JUMP_SIZE.y + 1;
        player.body.setSize(player.RUN_SIZE.x, player.RUN_SIZE.y);
        player.jumps = 0;
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
        console.log('jump');
        player.anims.play('jump');
        player.body.setSize(player.JUMP_SIZE.x, player.JUMP_SIZE.y);
        player.jumps ++;
        player.setVelocity(0, player.JUMP_VELOCITY);
    }
    execute(scene, player) {
        // jump higher for longer key hold time
        if(player.jumps < player.MAX_JUMPS && Phaser.Input.Keyboard.DownDuration(keySPACE, player.JUMP_KEY_TIME)) {
            player.setVelocity(0, player.JUMP_VELOCITY);
        }
        // jump again if we press space again!
        else if (player.jumps < player.MAX_JUMPS && Phaser.Input.Keyboard.JustDown(keySPACE)) {
            player.jumps ++;
            player.setVelocity(0, player.JUMP_VELOCITY);
        }
        // if on ground, go back to run state
        else if (player.body.touching.down) {
            this.stateMachine.transition('runState');
            return;
        }
    }
}