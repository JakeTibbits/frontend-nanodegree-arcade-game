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

  holdIt(){
    let keepSpeed = this.speed;
    this.speed = 0;
    return keepSpeed;
  }
  restart(oldSpeed){
    this.speed = oldSpeed;
  }
}

// Enemies our player must avoid
class Enemy extends Entity {
  constructor(sprite, x, y, width, height, speed, rules){
    super(sprite, x, y, width, height, speed);
    this.rules = rules;
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
        this.setStats();
      }
      this.doCollision(this.checkCollision());
      //console.log("Enemy Position: X"+this.x+" Y"+this.y);
  };

  doCollision(collide){
    if(collide === true){
      player.loseLife();
    }
  }

  setSize(probability){
    const enemySizes = {
      'regular' : {
        'sprite' : 'images/enemy-bug.png',
        'width' : 75,
        'height' : 55
      },
      'toxic' : {
        'sprite' : 'images/enemy-toxic.png',
        'width' : 80,
        'height' : 75
      }
    }

    if(Math.floor((Math.random() * 10) + 1) > probability){
      this.sprite = enemySizes['regular']['sprite'];
      this.width = enemySizes['regular']['width'];
      this.height = enemySizes['regular']['height'];
    } else {
      this.sprite = enemySizes['toxic']['sprite'];
      this.width = enemySizes['toxic']['width'];
      this.height = enemySizes['toxic']['height'];
    }
    //console.log('setSize: sprite: '+ this.sprite+ ' width: '+this.width+' height: '+this.height);
  }

  setX(){
    const xPositions = {
      a: -100,
      b: -200,
      c: -300
    }
    const random = Math.floor(Math.random() * 100) + 1;
    //console.log('setX: '+random);
    if(random >= 1 && random <50){
      this.x = xPositions['a'];
    }
    if(random >= 50 && random<90){
      this.x = xPositions['b'];
    }
    if(random >=85 && random<101){
      this.x = xPositions['c'];
    }
  }

  setSpeed(high, low){
    this.speed = Math.floor(Math.random() * high) + low;
    //console.log('setSpeed: '+this.speed);
  }

  setStats(){
    this.setSize(this.rules['toxicChance'] * 10);
    this.setX();
    this.setSpeed(this.rules['speed']['high'], this.rules['speed']['low']);
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
        this.x -= this.speed * 1.25;
      }
    }

    else if(key == 'right'){
      if(this.x + this.speed < 420){
        this.x += this.speed * 1.25;
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
    this.resetPlayer();
    if(this.lives>1){ this.lives--; setLives(); } else {   this.y = -10.1; pauseGame('loseGame'); }

  };

  //win level
  winLevel(){
    this.y = -10.1;
    if(player.level <= 4){
      pauseGame('winLevel');
    } else {
      pauseGame('winGame');
    }
  };

  resetPlayer(newGame = null){
    this.x = playerStart['x'];
    this.y = playerStart['y'];
    this.speed = playerStart['speed'];
    if(newGame){
      this.level = 1;
      this.lives = 3;
      setLives();
    }
  }



}

const playerStart = { x: 200, y: 400, speed:82 };

// Now instantiate your objects.
// Place the player object in a variable called player
const newPlayer = new Player('images/char-boy.png', playerStart['x'], playerStart['y'], 60, 70, playerStart['speed'], 3, 1);
const player = newPlayer;

let allEnemies;

function setLevel(){

  const level = player.level;
  const levelMarker = document.getElementById('levelMarker');
  levelMarker.innerHTML = level;

  let enemyRules;

  if(level === 1){
    enemyRules = {
      'speed' : {
        'high' : 200,
        'low' : 100
      },
      'toxicChance' : 0
    };
  } else if(level === 2){
    enemyRules = {
      'speed' : {
        'high' : 280,
        'low' : 130
      },
      'toxicChance' : 0.1
    };
  } else if(level === 3){
    enemyRules = {
      'speed' : {
        'high' : 300,
        'low' : 160
      },
      'toxicChance' : 0.2
    };
  } else if(level === 4){
    enemyRules = {
      'speed' : {
        'high' : 340,
        'low' : 200
      },
      'toxicChance' : 0.3
    };
  } else if(level === 5){
    enemyRules = {
      'speed' : {
        'high' : 400,
        'low' : 250
      },
      'toxicChance' : 0.4
    }
  }

  setEnemies(enemyRules);

  /*enemy1 = new Enemy(enemySizes['regular']['sprite'], enemyStartPositions['y']['a'], 80, 60, 170);
  enemy2 = new Enemy('images/enemy-bug.png', enemyStartPositions['x']['a'], enemyStartPositions['y']['b'], 70, 60, 82);
  enemy3 = new Enemy('images/enemy-bug.png', enemyStartPositions['x']['a'], enemyStartPositions['y']['c'], 70, 60, 250);*/
  //allEnemies = [enemy1, enemy3, enemy2]

}
setLevel();

function setEnemies(rules){

  const yPositions = {
    top: 65,
    middle: 148,
    bottom: 230
  };


  let topRow = new Enemy(null, null, yPositions['top'], null, null, null, rules);
  let midRow = new Enemy(null, null, yPositions['middle'], null, null, null, rules);
  let btmRow = new Enemy(null, null, yPositions['bottom'], null, null, null, rules);

  allEnemies = [topRow, midRow, btmRow];

  for(const enemy of allEnemies){
    enemy.setStats();
  };



};


let pauseState = 0;

function pauseGame(type){
  //console.log('pause');
  enemy1Speed = allEnemies[0].holdIt();
  enemy2Speed = allEnemies[1].holdIt();
  enemy3Speed = allEnemies[2].holdIt();
  playerSpeed = player.holdIt();


  let pauseOverlay = document.getElementById(type);
  pauseOverlay.classList.remove('hidden');
  let newPauseOverlay= pauseOverlay.cloneNode(true);
  pauseOverlay.parentNode.replaceChild(newPauseOverlay, pauseOverlay);
  pauseOverlay = document.getElementById(type);
  pauseOverlay.classList.add('visible');

  if(type == 'userPause'){
    pauseState = [enemy1Speed, enemy2Speed, enemy3Speed, playerSpeed];
  } else if(type == 'winLevel' || type == 'winGame' || type == 'loseGame'){
    pauseState = type;
  }

}

function resumeGame(type){
  //console.log('resume');
  allEnemies[0].speed = pauseState[0];
  allEnemies[1].speed = pauseState[1];
  allEnemies[2].speed = pauseState[2];
  player.speed = pauseState[3];


  if(type == 'userResume'){
    pauseState = 0;
    modalId = 'userPause';
  } else if(type == 'newLevel') {
    modalId = 'winLevel';
    player.level++;
    player.resetPlayer();
    setLevel();
  } else if(type == 'winGame' || type == 'loseGame'){
    modalId = type;
    player.resetPlayer('newGame');
    setLevel();
  }

  let pauseOverlay = document.getElementById(modalId);
  pauseOverlay.classList.remove('visible');
  let newPauseOverlay= pauseOverlay.cloneNode(true);
  pauseOverlay.parentNode.replaceChild(newPauseOverlay, pauseOverlay);
  pauseOverlay = document.getElementById(modalId);
  pauseOverlay.classList.add('hidden');

}




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

    if(e.key == " " || e.key == 'spacebar'){

      if(pauseState === 0){
        pauseGame('userPause');
      } else if(pauseState === 'winLevel'){
        resumeGame('newLevel');
        pauseState = 0;
      } else if(pauseState === 'winGame' || pauseState === 'loseGame'){
        resumeGame(pauseState);
        //pauseState = 0;
      } else {
        resumeGame('userResume');
      }
    } else { player.handleInput(allowedKeys[e.key]); }


});
