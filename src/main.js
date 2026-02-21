// rye donaldson
// endlessly async
// time estimate: 30 hrs ??

/* creative tilt justification:

technically interesting: I used a lot of math to compare the speeds of the player/the point obstacles disappear at,
    and I also used delta time to convert between px/frame and px/sec so that arcade physics velocity and manual movement
    of the tilesprite background would match up properly, which took some time to figure out. 

something new with the endless runner form: I've been doing a lot of reading on queer theory and queer games since coming to
    college, and so I really wanted to try and 'queer' the endless runner form by disrupting the norms surrounding it. 
    Usually in endless runners, the obstacles disappear after leaving the screen, and so instead I experimented with having 
    them (visually) disappear before the player actually gets to them. This also let me connect ideas of queer/crip time - 
    the player is cast 'out of sync', or out of normative time, made to feel behind and anxious to catch up, but never quite 
    being able to, a feeling many queer/disabled people have.
*/
'use strict'

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        },
    },
    scene: [Load, Menu, Instructions, Credits, Play]
}

let game = new Phaser.Game(config);

// reserve keyboard bindings
let keyRESET, keyLEFT, keyUP, keyRIGHT, keySPACE;

// global constants
let UI_DEPTH = 100;

let UI_BG_COLOR = '0x120531';
let UI_COLOR = '0xf0ffce';