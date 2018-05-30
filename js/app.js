// Enemies and Characters share features - let's make a parent Class they can extend from
class Entity {
  constructor(sprite, x, y, width, height, speed) {
    // character image
    this.sprite = sprite;
    // horizontal position
    this.x = x;
    // vertical position
    this.y = y;
    //character sprite width
    this.width = width;
    //character sprite height
    this.height = height;
    // movement speed
    this.speed = speed;
  }
  //render the character image on the game canvas
  render(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  };

  checkCollision(){
    let collision = false;

    if ( ((this.x + this.width) > player.x)
    && ((player.x + player.width) > this.x)
    && ((player.y + player.height) > this.y)
    && ((this.y + this.height) > player.y) ) {
      collision = true;
    }
    return collision;
  };
}

// Enemies our player must avoid
class Enemy extends Entity {
  constructor(sprite, x, y, width, height, speed){
    super(sprite, x, y, width, height, speed);

  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      this.x += this.speed * dt;
      if(this.x > 505){
        this.x = -70;
      }
      this.doCollision(this.checkCollision());
      //console.log("Enemy Position: X"+this.x+" Y"+this.y);
  };

  doCollision(collide){
    if(collide === true){
      player.loseLevel();
    }
  }



}

// Player Character
class Player extends Entity {
  constructor(sprite, x, y, width, height, speed){
    super(sprite, x, y, width, height, speed);
    // Update the player's position
  }
  // parse arrow key presses into directional movement values
  handleInput(key) {

    let moveX = 0;
    let moveY = 0;

    if(key == 'left'){
      if(this.x - this.speed > -15){
        this.x -= this.speed;
      } else { this.x = -15;}
    }

    else if(key == 'right'){
      if(this.x + this.speed < 420){
        this.x += this.speed;
      } else { this.x = 420;}
    }

    else if(key == 'up'){
      if(this.y - this.speed > 10){
        this.y -= this.speed;
      } else { this.y = -10; player.gainLevel(); }
    }

    else if(key == 'down'){
      if(this.y + this.speed < 400){
        this.y += this.speed;
      } else { this.y = 400;}
    }

  };


  //update(){};

  //reset progress when collision occurs
  loseLevel(){
    this.x = startingPosition['x'];
    this.y = startingPosition['y'];
  };

  //win level
  gainLevel(){
    console.log('win');
    setTimeout(function(){
      console.log('time');
      player.x = startingPosition['x'];
      player.y = startingPosition['y'];
    }, 500);
  };

}

const startingPosition = { x: 205, y: 400 };
// Now instantiate your objects.
// Place the player object in a variable called player
const player = new Player('images/char-boy.png', startingPosition['x'], startingPosition['y'], 60, 70, 60);

const enemy1 = new Enemy('images/enemy-bug.png', -100, 65, 80, 60, 170);
const enemy2 = new Enemy('images/enemy-bug.png', -100, 148, 80, 60, 80);
const enemy3 = new Enemy('images/enemy-bug.png', -100, 230, 80, 60, 250);

// Place all enemy objects in an array called allEnemies
const allEnemies = [enemy1, enemy2, enemy3];





// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        ArrowLeft: 'left',
        ArrowUp: 'up',
        ArrowRight: 'right',
        ArrowDown: 'down',
        Escape: 'end'
    };

    player.handleInput(allowedKeys[e.key]);
});
