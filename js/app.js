// Enemies our player must avoid
var Enemy = function(x, y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    // initial x position
    this.x = x;
    // initial y position
    this.y = y;
    //
    this.speed = 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if(this.x > 505){
      this.x = -70;
    }
};

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y) {
    //player-character image
    this.sprite = 'images/char-boy.png';
    // initial x position
    this.x = x;
    // initial y position
    this.y = y;
    // movement speed
    this.speed = 50;
};
// Update the player's position
Player.prototype.update = function(moveX, moveY) {
    if(moveX){ this.x = (this.x + moveX); }
    if(moveY){ this.y = (this.y + moveY); }
};
// Draw the player on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// Handle player input
Player.prototype.handleInput = function(key) {

  var moveX = 0;
  var moveY = 0;

  if(key == 'left'){
    moveX = -this.speed;
  } else if(key == 'right'){
    moveX = this.speed;
  } else if(key == 'up'){
    moveY = -this.speed;
  } else if(key == 'down'){
    moveY= this.speed;
  }

  player.update(moveX, moveY);

};



// Now instantiate your objects.
// Place the player object in a variable called player
var player = new Player(220, 450);

var enemy1 = new Enemy(0,50);

// Place all enemy objects in an array called allEnemies
var allEnemies = [enemy1];





// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
