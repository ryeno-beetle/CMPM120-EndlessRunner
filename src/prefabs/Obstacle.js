// obstacles (bed/pillow)
class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, name) {
        super(scene, x, y, texture);

        this.name = name;

        // add player to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
        this.body.setFriction(0);

        this.disappeared = false;

        this.FSH_SOUNDS = ['fsh_1_sfx', 'fsh_2_sfx', 'fsh_3_sfx'];
    }

    playDisappearSound(scene) {
        let fsh = Phaser.Math.Between(0, 2);
        scene.sound.play(this.FSH_SOUNDS[fsh], {volume: 0.1});
    }
}