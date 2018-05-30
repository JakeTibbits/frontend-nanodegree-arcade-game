// Enemies and Characters share features - let's make a parent Class they can extend from
class Character {
  constructor(sprite, x, y, speed) {
    // character image
    this.sprite = sprite;
    // horizontal position
    this.x = x;
    // vertical position
    this.y = y;
    // movement speed
    this.speed = speed;
  }
  //render the character image on the game canvas
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };
}

// Enemies our player must avoid
class Enemy extends Character {
  constructor(sprite, x, y, speed){
    super(sprite, x, y, speed);
  }
  update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      this.x += this.speed * dt;
      if(this.x > 505){
        this.x = -70;
      }
  };
}

// Player Character
class Player extends Character {
  constructor(sprite, x, y, speed){
    super(sprite, x, y, speed);
    // Update the player's position
  }
  update(moveX, moveY) {
      if(moveX){ this.x = (this.x + moveX); }
      if(moveY){ this.y = (this.y + moveY); }
  };
  handleInput(key) {

    let moveX = 0;
    let moveY = 0;

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
}



// Now instantiate your objects.
// Place the player object in a variable called player
const player = new Player('images/char-boy.png', 220, 450, 50);

const enemy1 = new Enemy('images/enemy-bug.png', -50, 100, 100);

// Place all enemy objects in an array called allEnemies
const allEnemies = [enemy1];





// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
