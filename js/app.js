'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Enemies and Players share features - let's make a parent Class they can extend from
var Entity = function () {
  function Entity(sprite, x, y, width, height, speed) {
    _classCallCheck(this, Entity);

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


  _createClass(Entity, [{
    key: 'render',
    value: function render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    //check whether the entity collides with the Player character and return a boolean value

  }, {
    key: 'checkCollision',
    value: function checkCollision() {

      var collision = false;

      if (this.x + this.width > player.x && player.x + player.width > this.x && player.y + player.height > this.y && this.y + this.height > player.y) {
        collision = true;
      }
      return collision;
    }
  }, {
    key: 'holdIt',
    value: function holdIt() {
      //store the entity's current speed in a variable
      var keepSpeed = this.speed;
      //set speed to 0 to pause game progress
      this.speed = 0;
      //return the current speed for use on game resume
      return keepSpeed;
    }
  }, {
    key: 'restart',
    value: function restart(oldSpeed) {
      //reset the entity's speed to its previous value to unpause the game
      this.speed = oldSpeed;
    }
  }]);

  return Entity;
}();

// Enemies our player must avoid


var Enemy = function (_Entity) {
  _inherits(Enemy, _Entity);

  function Enemy(sprite, x, y, width, height, speed, rules) {
    _classCallCheck(this, Enemy);

    var _this = _possibleConstructorReturn(this, (Enemy.__proto__ || Object.getPrototypeOf(Enemy)).call(this, sprite, x, y, width, height, speed));

    _this.rules = rules;
    return _this;
  }
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks


  _createClass(Enemy, [{
    key: 'update',
    value: function update(dt) {
      // You should multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for
      // all computers.
      if (this.x < 505) {
        this.x += this.speed * dt;
      } else {
        this.setStats();
      }
      this.doCollision(this.checkCollision());
      //console.log("Enemy Position: X"+this.x+" Y"+this.y);
    }

    //if entity has collided with the player

  }, {
    key: 'doCollision',
    value: function doCollision(collide) {
      if (collide === true) {
        player.loseLife();
      }
    }

    //randomize which type of enemy will be spawned

  }, {
    key: 'setSize',
    value: function setSize(probability) {
      var enemySizes = {
        'regular': {
          'sprite': 'images/enemy-bug.png',
          'width': 75,
          'height': 55
        },
        'toxic': {
          'sprite': 'images/enemy-toxic.png',
          'width': 80,
          'height': 75
        }
      };

      if (Math.floor(Math.random() * 10 + 1) > probability) {
        this.sprite = enemySizes.regular.sprite;
        this.width = enemySizes.regular.width;
        this.height = enemySizes.regular.height;
      } else {
        this.sprite = enemySizes.toxic.sprite;
        this.width = enemySizes.toxic.width;
        this.height = enemySizes.toxic.height;
      }
      //console.log('setSize: sprite: '+ this.sprite+ ' width: '+this.width+' height: '+this.height);
    }

    //randomize how far from the start line the enemy will respawn

  }, {
    key: 'setX',
    value: function setX() {
      var xPositions = {
        a: -100,
        b: -225,
        c: -350
      };
      var random = Math.floor(Math.random() * 100) + 1;
      //console.log('setX: '+random);
      if (random >= 1 && random < 40) {
        this.x = xPositions.a;
      }
      if (random >= 40 && random < 75) {
        this.x = xPositions.b;
      }
      if (random >= 75 && random < 101) {
        this.x = xPositions.c;
      }
    }

    //randomize speed within a given range

  }, {
    key: 'setSpeed',
    value: function setSpeed(high, low) {
      this.speed = Math.floor(Math.random() * high) + low;
      //console.log('setSpeed: '+this.speed);
    }

    //respawn the enemy with new variables

  }, {
    key: 'setStats',
    value: function setStats() {
      this.setSize(this.rules.toxicChance * 10);
      this.setX();
      this.setSpeed(this.rules.speed.high, this.rules.speed.low);
    }
  }]);

  return Enemy;
}(Entity);

// Player Character


var Player = function (_Entity2) {
  _inherits(Player, _Entity2);

  function Player(sprite, x, y, width, height, speed, lives, level) {
    _classCallCheck(this, Player);

    // Update the player's position
    var _this2 = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this, sprite, x, y, width, height, speed));

    _this2.lives = lives;
    _this2.level = level;
    return _this2;
  }
  // parse arrow key presses into directional movement values


  _createClass(Player, [{
    key: 'handleInput',
    value: function handleInput(key) {

      if (key == 'left') {
        if (this.x - this.speed > -15) {
          this.x -= this.speed * 1.25;
        }
      } else if (key == 'right') {
        if (this.x + this.speed < 420) {
          this.x += this.speed * 1.25;
        }
      } else if (key == 'up') {
        if (this.y - this.speed > -10) {
          this.y -= this.speed;
        } else if (this.y == -10.1) {
          return;
        } else {
          this.y = -10;
        }
      } else if (key == 'down') {
        if (this.y + this.speed < 400) {
          this.y += this.speed;
        } else {
          this.y = 400;
        }
      }
    }

    //if player has reached water, win the level

  }, {
    key: 'update',
    value: function update() {
      if (this.y == -10) {
        this.winLevel();
      }
    }

    //reset progress when collision occurs

  }, {
    key: 'loseLife',
    value: function loseLife() {
      this.resetPlayer();
      if (this.lives > 1) {
        this.lives--;setLives();
      } else {
        this.y = -10.1;pauseGame('loseGame');
      }
    }

    //win level

  }, {
    key: 'winLevel',
    value: function winLevel() {
      this.y = -10.1;
      if (player.level <= 4) {
        pauseGame('winLevel');
      } else {
        pauseGame('winGame');
      }
    }

    //reset player to starting position

  }, {
    key: 'resetPlayer',
    value: function resetPlayer() {
      var newGame = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this.x = playerStart.x;
      this.y = playerStart.y;
      this.speed = playerStart.speed;

      //resey player to starting level and refill lives
      if (newGame) {
        this.level = 1;
        this.lives = 3;
        setLives();
      }
    }
  }]);

  return Player;
}(Entity);

//set the player starting position and speed


var playerStart = { x: 200, y: 400, speed: 82 };

// Now instantiate your objects.
// Place the player object in a variable called player
var newPlayer = new Player('images/char-boy.png', playerStart.x, playerStart.y, 60, 70, playerStart.speed, 3, 1);
var player = newPlayer;

var allEnemies = void 0;

//function to populate the level with varying dificulties of enemies depending on player level
function setLevel() {

  var level = player.level;
  var levelMarker = document.getElementById('levelMarker');
  levelMarker.innerHTML = level;

  var enemyRules = void 0;

  if (level === 1) {
    enemyRules = {
      'speed': {
        'high': 200,
        'low': 100
      },
      'toxicChance': 0
    };
  } else if (level === 2) {
    enemyRules = {
      'speed': {
        'high': 280,
        'low': 130
      },
      'toxicChance': 0.1
    };
  } else if (level === 3) {
    enemyRules = {
      'speed': {
        'high': 300,
        'low': 160
      },
      'toxicChance': 0.2
    };
  } else if (level === 4) {
    enemyRules = {
      'speed': {
        'high': 340,
        'low': 200
      },
      'toxicChance': 0.3
    };
  } else if (level === 5) {
    enemyRules = {
      'speed': {
        'high': 400,
        'low': 250
      },
      'toxicChance': 0.4
    };
  }

  setEnemies(enemyRules);
}
setLevel();

//function to add an enemy to each row of the game canvas
function setEnemies(rules) {

  var yPositions = {
    top: 65,
    middle: 148,
    bottom: 230
  };

  var topRow = new Enemy(null, null, yPositions.top, null, null, null, rules);
  var midRow = new Enemy(null, null, yPositions.middle, null, null, null, rules);
  var btmRow = new Enemy(null, null, yPositions.bottom, null, null, null, rules);

  allEnemies = [topRow, midRow, btmRow];

  //randomize speed, size and position of enemies
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = allEnemies[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var enemy = _step.value;

      enemy.setStats();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

var pauseState = 0;

//function to record the current game state and pause
function pauseGame(type) {
  //console.log('pause');
  var enemy1Speed = allEnemies[0].holdIt();
  var enemy2Speed = allEnemies[1].holdIt();
  var enemy3Speed = allEnemies[2].holdIt();
  var playerSpeed = player.holdIt();

  var pauseOverlay = document.getElementById(type);
  pauseOverlay.classList.remove('hidden');
  var newPauseOverlay = pauseOverlay.cloneNode(true);
  pauseOverlay.parentNode.replaceChild(newPauseOverlay, pauseOverlay);
  pauseOverlay = document.getElementById(type);
  pauseOverlay.classList.add('visible');

  if (type == 'userPause') {
    pauseState = [enemy1Speed, enemy2Speed, enemy3Speed, playerSpeed];
  } else if (type == 'winLevel' || type == 'winGame' || type == 'loseGame') {
    pauseState = type;
  }
}

//funtion to resume the game using the recorded game state
function resumeGame(type) {
  //console.log('resume');
  allEnemies[0].speed = pauseState[0];
  allEnemies[1].speed = pauseState[1];
  allEnemies[2].speed = pauseState[2];
  player.speed = pauseState[3];
  var modalId = void 0;

  if (type == 'userResume') {
    pauseState = 0;
    modalId = 'userPause';
  } else if (type == 'newLevel') {
    modalId = 'winLevel';
    player.level++;
    player.resetPlayer();
    setLevel();
  } else if (type == 'winGame' || type == 'loseGame') {
    modalId = type;
    player.resetPlayer('newGame');
    setLevel();
  }

  var pauseOverlay = document.getElementById(modalId);
  pauseOverlay.classList.remove('visible');
  var newPauseOverlay = pauseOverlay.cloneNode(true);
  pauseOverlay.parentNode.replaceChild(newPauseOverlay, pauseOverlay);
  pauseOverlay = document.getElementById(modalId);
  pauseOverlay.classList.add('hidden');
}

//output heart graphics for number of lives left
function setLives() {
  var livesList = document.getElementById('livesList');
  var life = '<li class="life"></li>';

  var lives = '';
  for (var playerLives = player.lives; playerLives > 0; playerLives--) {
    lives = lives + life;
  }

  livesList.innerHTML = lives;
}

setLives();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    ArrowLeft: 'left',
    'a': 'left',
    ArrowUp: 'up',
    'w': 'up',
    ArrowRight: 'right',
    'd': 'right',
    ArrowDown: 'down',
    's': 'down'
  };

  //add listener  for spacebar to pause/resume game
  if (e.key == " " || e.key == 'spacebar') {

    if (pauseState === 0) {
      pauseGame('userPause');
    } else if (pauseState === 'winLevel') {
      resumeGame('newLevel');
      pauseState = 0;
    } else if (pauseState === 'winGame' || pauseState === 'loseGame') {
      resumeGame(pauseState);
      //pauseState = 0;
    } else {
      resumeGame('userResume');
    }
  } else {
    player.handleInput(allowedKeys[e.key]);
  }
});
