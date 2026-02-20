// obstacles (bed/pillow)
class Obstacle extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);

        // add player to existing scene
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
        this.body.setFriction(0);

        this.disappeared = false;
    }
}