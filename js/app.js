// Enemies and Players share features - let's make a parent Class they can extend from
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
  constructor(sprite, x, y, width, height, speed, delay){
    super(sprite, x, y, width, height, speed);
    this.delay = delay;
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      if(this.x < 505){
        this.x += this.speed * dt;
      } else {
        this.x=-100;
      }
      this.doCollision(this.checkCollision());
      //console.log("Enemy Position: X"+this.x+" Y"+this.y);
  };

  doCollision(collide){
    if(collide === true){
      player.loseLife();
    }
  }



}

// Player Character
class Player extends Entity {
  constructor(sprite, x, y, width, height, speed, lives, level){
    super(sprite, x, y, width, height, speed);
    // Update the player's position
    this.lives = lives;
    this.level = level;
  }
  // parse arrow key presses into directional movement values
  handleInput(key) {

    if(key == 'left'){
      if(this.x - this.speed > -15){
        this.x -= this.speed + 20;
      }
    }

    else if(key == 'right'){
      if(this.x + this.speed < 420){
        this.x += this.speed + 20;
      }
    }

    else if(key == 'up'){
      if(this.y - this.speed > -10){
        this.y -= this.speed;
      } else if(this.y == -10.1){
        return;
      } else { this.y = -10; }
    }

    else if(key == 'down'){
      if(this.y + this.speed < 400){
        this.y += this.speed;
      } else { this.y = 400;}
    }

  };

  update(){
    if(this.y == -10){
      this.winLevel();
    }
  };


  //reset progress when collision occurs
  loseLife(){
    this.x = playerStartPosition['x'];
    this.y = playerStartPosition['y'];
    if(this.lives>1){ this.lives--; setLives(); } else { this.loseGame(); }

  };

  //win level
  winLevel(){
    this.y = -10.1;
    allEnemies = [];
    setTimeout(function(){
      if(player.level <= 4){
        player.level++;
        setLevel();
        player.x = playerStartPosition['x'];
        player.y = playerStartPosition['y'];
      } else {
        player.winGame()
      }

    }, 500);
  };

  loseGame(){ alert('you lose!'); };

  winGame(){ alert('you win!'); };

}

const playerStartPosition = { x: 200, y: 400 };
const enemyStartPositions = {
  x: {
    a: -100,
    b: -250,
    c: -400
  },
  y:{
    a: 65,
    b: 148,
    c: 230
  }
};
const enemySpeeds = {
  'slow' : 80,
  'medium' : 170,
  'fast' : 250,
  'hyper' : 350,
}
const enemyDelays = {
  'short' : 100,
  'medium' : 1500,
  'long' : 3000,
}
const enemySizes = {
  'regular' : {
    'sprite' : 'images/enemy-bug.png',
    'width' : 75,
    'height' : 55
  },
  'toxic' : {
    'sprite' : 'images/enemy-toxic.png',
    'width' : 80,
    'height' : 90
  }
}
// Now instantiate your objects.
// Place the player object in a variable called player
const player = new Player('images/char-boy.png', playerStartPosition['x'], playerStartPosition['y'], 60, 70, 82, 3, 1);

let allEnemies = [];


  const enemy1 = new Enemy('regular', enemyStartPositions['y']['a'], 80, 60, 170);
  const enemy2 = new Enemy('images/enemy-bug.png', enemyStartPositions['x']['a'], enemyStartPositions['y']['b'], 80, 60, 82);
  const enemy3 = new Enemy('images/enemy-bug.png', enemyStartPositions['x']['a'], enemyStartPositions['y']['c'], 80, 60, 250);


function setLevel(){
  const levelMarker = document.getElementById('levelMarker');
  levelMarker.innerHTML = player.level;
}
setLevel();


function setLives(){
  const livesList = document.getElementById('livesList');
  const life = '<li class="life"></li>';

  let lives = '';
  for(let playerLives = player.lives; playerLives > 0; playerLives--){
    lives = lives + life;
  }

  livesList.innerHTML = lives;
}

setLives();






// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    const allowedKeys = {
        ArrowLeft: 'left',
        'a': 'left',
        ArrowUp: 'up',
        'w': 'up',
        ArrowRight: 'right',
        'd': 'right',
        ArrowDown: 'down',
        's': 'down',
    };

    player.handleInput(allowedKeys[e.key]);
});
