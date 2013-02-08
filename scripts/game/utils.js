SQUARE_WIDTH = S_W = 60;
ARENA_WIDTH = 24;
ARENA_HEIGHT = 16;

A_W = ARENA_WIDTH * SQUARE_WIDTH;
A_H = ARENA_HEIGHT * SQUARE_WIDTH;

W_O = WIDTH_OFFSET = 2;
H_O = HEIGHT_OFFSET = 3;

CENTER =
{
    x : A_W / 2 + S_W / 2,
    y : A_H / 2 + S_W / 2
}

PAUSED = false;
SPEED = 1;

LOADED = false;
NUM_LOADED = 0;
NUM_TO_LOAD = 0;

MUTE = false;
LASER_SOUND_ON = false;

HELP_HIDDEN = false;

GATTLING = 'GATTLING';
MISSILE = 'MISSILE';
LASER = 'LASER';

ROBOT = 'ROBOT';
SPIDER = 'SPIDER';

CURRENT_SQUARE = null;
SELECTED_SQUARE = null;

COLORS = {
    red : 0xFF0000,
    green : 0x00FF00,
    blue : 0x0000FF,
    select : 0x2ca22f,
    grid : 0x095e0b,
    dark_blue : 0x0e0e63
}

START = [7, 0];
DESTINATION = [7, 23];

PI = Math.PI;

MESH = '__AssociatedMesh';
TOP = '__TowerTopMesh';

DEBUG = null;

// Logging which will dissappear from other browsers?
log = function() {
    if(window.console && window.console.log)
    {
        console.log.apply( console, arguments );
    }
};


function AssertException(message) { this.message = message; }
AssertException.prototype.toString = function () {
  return 'AssertException: ' + this.message;
}

function assert(exp, message) {
  if (!exp) {
    throw new AssertException(message);
  }
}