const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const countdownElement = document.querySelector("#timeElement");
const distanceElement = document.querySelector("#distanceElement");
const scoreElement = document.querySelector("#scoreElement");

const gameGridRows = 7;
const gameGridColumns = 9;
const uiOffsetY = -40;

canvas.width = innerWidth;
canvas.height = innerHeight;
// UI area offset

const images = [
  "", // 0
  "./images/4-connector.png", // 1
  "./images/bottom-left-curve.png", // 2
  "./images/bottom-right-curve.png", // 3
  "./images/top-left-curve.png", // 4
  "./images/top-right-curve.png", // 5
  "./images/horizontal.png", // 6
  "./images/vertical.png", // 7
  "./images/blocked-pipe.png", // 8
  "./images/start-to-right.png", // 9
  "./images/start-to-left.png", // 10
  "./images/start-to-bottom.png", // 11
  "./images/start-to-top.png", // 12
  "./images/background.png", // 13
];

// Helper functions
function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Enum
const Direction = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
};

// Classes
class Cell {
  static cellWidth = 40;
  static cellHeight = 40;

  constructor({ position, src, type }) {
    this.position = position;
    this.width = 38;
    this.height = 38;
    this.type = type;
    const image = new Image();
    image.src = src;
    //console.log(this.image.src);
    image.onload = () => {
      this.image = image;
    };
  }

  draw() {
    if (this.image) {
      context.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    } else {
      context.fillStyle = "rgb(255,201,14)";
      context.fillRect(
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }
}

class GameManager {
  constructor() {
    this.grid = [
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    this.player = new Player({
      //  position is a coordinate in the grid
      position: {
        x: 5,
        y: 5,
      },
    });
    this.nextPipes = [];
    this.gameStarted = false;
    this.currentPipe = {
      x: 0,
      y: 0,
      lastDirection: Direction.Up,
      type: 0, // image id to know the type of pipe
    };

    this.score = 0;
    this.remainingDistance = 10;
    this.countdownTimer = 20;
  }

  addPipe() {
    let nextPipeId = randomIntFromInterval(1, 7);
    this.nextPipes.push(nextPipeId);
    console.log("Number of pipes", this.nextPipes.length);

    if (this.gameStarted) {
      gameGrid[11] = new Cell({
        position: {
          x: 0,
          y: Cell.cellHeight,
        },
        src: images[this.nextPipes[3]],
        type: this.nextPipes[3],
      });
      gameGrid[22] = new Cell({
        position: {
          x: 0,
          y: Cell.cellHeight * 2,
        },
        src: images[this.nextPipes[2]],
        type: this.nextPipes[2],
      });
      gameGrid[33] = new Cell({
        position: {
          x: 0,
          y: Cell.cellHeight * 3,
        },
        src: images[this.nextPipes[1]],
        type: this.nextPipes[1],
      });
      gameGrid[44] = new Cell({
        position: {
          x: 0,
          y: Cell.cellHeight * 4,
        },
        src: images[this.nextPipes[0]],
        type: this.nextPipes[0],
      });
    }
  }

  canReceiveWater(type, direction) {
    switch (type) {
      case 1: // 4 side pipe
        switch (direction) {
          case Direction.Down:
            this.currentPipe.lastDirection = Direction.Up;
            return true;
          case Direction.Up:
            this.currentPipe.lastDirection = Direction.Down;
            return true;
          case Direction.Left:
            this.currentPipe.lastDirection = Direction.Right;
            return true;
          case Direction.Right:
            this.currentPipe.lastDirection = Direction.Left;
            return true;
        }
        break;
      case 2: // bottom left curve
        switch (direction) {
          case Direction.Down:
          case Direction.Left:
            return false;
          case Direction.Up:
            this.currentPipe.lastDirection = Direction.Right;
            return true;
          case Direction.Right:
            this.currentPipe.lastDirection = Direction.Up;
            return true;
        }
        break;
      case 3: // bottom right curve
        switch (direction) {
          case Direction.Down:
          case Direction.Right:
            return false;
          case Direction.Up:
            this.currentPipe.lastDirection = Direction.Left;
            return true;
          case Direction.Left:
            this.currentPipe.lastDirection = Direction.Up;
            return true;
        }
        break;
      case 4: // top left curve
        switch (direction) {
          case Direction.Down:
            this.currentPipe.lastDirection = Direction.Right;
            return true;
          case Direction.Right:
            this.currentPipe.lastDirection = Direction.Down;
            return true;
          case Direction.Up:
          case Direction.Left:
            return false;
        }
        break;
      case 5: // top right curve
        switch (direction) {
          case Direction.Down:
            this.currentPipe.lastDirection = Direction.Left;
            return true;
          case Direction.Left:
            this.currentPipe.lastDirection = Direction.Down;
            return true;
          case Direction.Up:
          case Direction.Right:
            return false;
        }
        break;
      case 6: // horizontal
        switch (direction) {
          case Direction.Down:
          case Direction.Up:
            return false;
          case Direction.Left:
            this.currentPipe.lastDirection = Direction.Right;
            return true;
          case Direction.Right:
            this.currentPipe.lastDirection = Direction.Left;
            return true;
        }
        break;
      case 7: // vertical
        switch (direction) {
          case Direction.Down:
            this.currentPipe.lastDirection = Direction.Up;
            return true;
          case Direction.Up:
            this.currentPipe.lastDirection = Direction.Down;
            return true;
          case Direction.Left:
          case Direction.Right:
            return false;
        }
        break;
      // Blocked Pipe and starting positions cannot receive water
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
        return false;
    }
  }

  getNextPipeInStream() {
    // get the current pipe type
    let currentPipeType = this.grid[this.currentPipe.y][this.currentPipe.x];

    // check for game over condition based on current pipe coords and direction
    let isGameOver = false;
    switch (this.currentPipe.direction) {
      case Direction.Down:
        if (this.currentPipe.y + 1 >= gameGridRows) {
          isGameOver = true;
        }
        break;
      case Direction.Up:
        if (this.currentPipe.y - 1 < 0) {
          isGameOver = true;
        }
        break;
      case Direction.Left:
        if (this.currentPipe.x - 1 < 2) {
          isGameOver = true;
        }
        break;
      case Direction.Right:
        if (this.currentPipe.x + 1 >= gameGridColumns + 2) {
          isGameOver = true;
        }
        break;
    }

    if (isGameOver) {
      //this.gameOver();
      return;
    }

    // get the next pipe type
    let nextPipeType;
    let nextPipeCoords = {
      x: 0,
      y: 0,
    };

    switch (this.currentPipe.direction) {
      case Direction.Down:
        nextPipeType = this.grid[this.currentPipe.y + 1][this.currentPipe.x];
        nextPipeCoords.x = this.currentPipe.x;
        nextPipeCoords.y = this.currentPipe.y + 1;
        break;
      case Direction.Up:
        nextPipeType = this.grid[this.currentPipe.y - 1][this.currentPipe.x];
        nextPipeCoords.x = this.currentPipe.x;
        nextPipeCoords.y = this.currentPipe.y - 1;
        break;
      case Direction.Left:
        nextPipeType = this.grid[this.currentPipe.y][this.currentPipe.x - 1];
        nextPipeCoords.x = this.currentPipe.x - 1;
        nextPipeCoords.y = this.currentPipe.y;
        break;
      case Direction.Right:
        nextPipeType = this.grid[this.currentPipe.y][this.currentPipe.x + 1];
        nextPipeCoords.x = this.currentPipe.x + 1;
        nextPipeCoords.y = this.currentPipe.y;
        break;
    }

    /*check if water can flow to the next pipe.
     *return value will dictate game over condition, if it's not game over the direction of the next pipe is already
     *set through this function*/
    if (
      this.canReceiveWater(nextPipeType, this.currentPipe.lastDirection) ===
      false
    ) {
      console.log(
        "Game Over, the next pipe cannot receive water from the previous pipe)"
      );
      // this.gameOver();
    }

    // advance water to current pipe
    this.currentPipe.x = nextPipeCoords.x;
    this.currentPipe.y = nextPipeCoords.y;
    this.currentPipe.type = nextPipeType;
    this.currentPipe.direction = Direction.Down;

    // Check score
    this.score += 100;
    this.remainingDistance--;
  }

  setPipePosition(mouseX, mouseY) {
    // get the player coords in the grid
    let newPlayerPositionX = Math.floor(mouseX / Cell.cellWidth);
    let newPlayerPositionY = Math.floor(mouseY / Cell.cellHeight);
    // check if the mouse click was within the gamming area
    if (newPlayerPositionX >= 2 && newPlayerPositionX < gameGridColumns + 2) {
      if (newPlayerPositionY >= 0 && newPlayerPositionY < gameGridRows) {
        // check if this coord can be played, not a bloc pipe nor starting pipe
        for (let index = 8; index <= 12; index++) {
          if (this.grid[newPlayerPositionY][newPlayerPositionX] === index) {
            console.log(
              "Cannot place pipe in this position, its a blocked pipe or starting pipe"
            );
            return;
          }
        }

        // set this grid value to be the nextPipe
        this.grid[newPlayerPositionY][newPlayerPositionX] =
          this.nextPipes.shift();
        // generate a new random pipe and add it to the queue
        this.addPipe();
        //  set the gameGrid with the new cell (This should be overiden and not a new instance, cant find a proper way to this in js)
        let pressedCellId =
          newPlayerPositionY * (gameGridColumns + 2) + newPlayerPositionX;
        gameGrid[pressedCellId] = new Cell({
          position: {
            x: Cell.cellWidth * newPlayerPositionX,
            y: Cell.cellHeight * newPlayerPositionY,
          },
          src: images[this.grid[newPlayerPositionY][newPlayerPositionX]],
          type: this.grid[newPlayerPositionY][newPlayerPositionX],
        });

        console.log(
          "Pipe was played on coords:",
          newPlayerPositionY,
          newPlayerPositionX
        );
      }
    }
  }

  startCountdown() {
    const countdownTimer = setInterval(() => {
      console.log("countDown second");
      // Update the countdown display
      countdownElement.innerHTML = this.countdownTimer;
      if (this.countdownTimer <= 0) {
        // Stop the timer
        clearInterval(countdownTimer);
        // Start the game/water flow
        startWaterFlow();
      } else {
        // Decrease the countdown
        this.countdownTimer--;
      }
    }, 1000); // Run every 1 second
  }

  startGame() {
    // set grid
    console.log("Initialize");
    // set blocked cells - image id - 8 - set a random number of blocks between 1 - 4
    const numberBlockedCells = randomIntFromInterval(0, 4);
    for (let index = 0; index < numberBlockedCells; index++) {
      // -1 since its id 0
      let rowPosition = randomIntFromInterval(0, gameGridRows - 1);
      let columnPosition = randomIntFromInterval(2, gameGridColumns + 1);
      this.grid[rowPosition][columnPosition] = 8;
      console.log("blockedCell", rowPosition, columnPosition);
    }

    // set the starting point - random number between 9 - 12 (starting point image id's)
    let initialPipeType = randomIntFromInterval(9, 12);
    let initialIsSet = false;
    while (initialIsSet === false) {
      // -2 because starting position cannot be initialized in the last row
      let rowPosition = randomIntFromInterval(0, gameGridRows - 2);
      let columnPosition = randomIntFromInterval(2, gameGridColumns + 1);
      // check if the position for the starting pipe does not have a blocked cell bellow
      if (this.grid[rowPosition + 1][columnPosition] !== 8) {
        //if pipe is facing right, x cannot be gameGridColumn - 1
        //if pipe is facing left, x cannot be 0
        //if pipe is facing up, y cannot be 0
        //no blocked cell can be in the direction of the water flow
        let canSetStartingPipe = false;
        switch (initialPipeType) {
          case 9:
            let nextColumnId = columnPosition + 1;
            console.log("next column: ", nextColumnId);
            // water flow direction is not out of map or a blocked cell
            if (nextColumnId < gameGridColumns + 2) {
              if (this.grid[rowPosition][nextColumnId] !== 8) {
                canSetStartingPipe = true;
              }
            }
            break;

          case 10:
            let previousColumnId = columnPosition - 1;
            // water flow direction is not out of map or a blocked cell
            if (previousColumnId >= 2) {
              if (this.grid[rowPosition][previousColumnId] !== 8) {
                canSetStartingPipe = true;
              }
            }
            break;
          case 11:
            let bellowRowId = rowPosition + 1;
            // water flow direction is not out of map or a blocked cell
            if (bellowRowId > 0) {
              if (this.grid[bellowRowId][columnPosition] !== 8) {
                canSetStartingPipe = true;
              }
            }
            break;
          case 12:
            let aboveRowId = rowPosition - 1;
            // water flow direction is not out of map or a blocked cell
            if (aboveRowId >= 0) {
              if (this.grid[aboveRowId][columnPosition] !== 8) {
                canSetStartingPipe = true;
              }
            }
            break;
        }
        // set starting pipe if possible
        if (canSetStartingPipe) {
          this.grid[rowPosition][columnPosition] = initialPipeType;
          this.currentPipe.y = rowPosition;
          this.currentPipe.x = columnPosition;
          this.currentPipe.type = initialPipeType;
          switch (initialPipeType) {
            case 9:
              this.currentPipe.direction = Direction.Right;
              break;
            case 10:
              this.currentPipe.direction = Direction.Left;
              break;
            case 11:
              this.currentPipe.direction = Direction.Down;
              break;
            case 12:
              this.currentPipe.direction = Direction.Up;
              break;
          }
          console.log(
            "Starting pipe of type: ",
            initialPipeType,
            ". was set on position: ",
            rowPosition,
            columnPosition
          );
          initialIsSet = true;
        } else {
          console.log(
            "pipe type: ",
            initialPipeType,
            "could not place pipe here:",
            columnPosition,
            rowPosition,
            "water would flow out of the map"
          );
        }
      } else {
        // debug purpose to check if this ever happened
        console.log("Could not set initial pipe here");
      }
    }
    // generate the queue with 4 new blocks - image id's - 1 -7
    for (let index = 0; index < 4; index++) {
      this.addPipe();
    }

    this.gameStarted = true;
    // start water flow countdown
    this.startCountdown();
  }

  startWaterFlow() {}

  update() {
    if (this.gameStarted === false) {
      this.startGame();
    }
    // Update player position
    this.player.update();
  }
}

class Player {
  constructor({ position }) {
    this.position = position;
    this.width = Cell.cellWidth;
    this.height = Cell.cellHeight;
    this.moved = false;
  }

  draw() {
    context.lineWidth = 3;
    context.strokeStyle = "red";
    // position is a coordinate, multiply by the cell size, -1 in width and height to center with the grid
    context.strokeRect(
      this.position.x * Cell.cellWidth - 1,
      this.position.y * Cell.cellHeight - 1,
      this.width,
      this.height
    );
  }

  update() {
    if (this.moved) {
      this.moved = false;
    }
    this.draw();
  }
}

// fields
// gameGrid
const gameManager = new GameManager();
const gameGrid = [];
gameManager.startGame();

// set each cell pipeType /  or empty cell
gameManager.grid.forEach((row, currentRow) => {
  row.forEach((column, currentColumn) => {
    gameGrid.push(
      new Cell({
        position: {
          x: Cell.cellWidth * currentColumn,
          y: Cell.cellHeight * currentRow,
        },
        src: images[column],
        type: column,
      })
    );
  });
});

// Game Loop
function gameLoop() {
  requestAnimationFrame(gameLoop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw player position
  gameManager.update();
  // draw the cells
  for (const cell in gameGrid) {
    gameGrid[cell].draw();
  }
}

gameLoop();

window.addEventListener("keydown", ({ key }) => {
  console.log(key);
  switch (key) {
    case "w":
      if (gameManager.player.position.y - 1 >= 0) {
        gameManager.player.position.y -= 1;
      }
      break;
    case "s":
      if (gameManager.player.position.y + 1 < gameGridRows) {
        gameManager.player.position.y += 1;
      }
      break;
    case "a":
      if (gameManager.player.position.x - 1 >= 0) {
        gameManager.player.position.x -= 1;
      }
      break;
    case "d":
      if (gameManager.player.position.x + 1 < gameGridColumns) {
        gameManager.player.position.x += 1;
      }
      break;
  }
});

window.addEventListener("mousedown", (mouse) => {
  gameManager.setPipePosition(mouse.clientX, mouse.clientY + uiOffsetY);
});

window.addEventListener("mousemove", (mouse) => {
  let newPlayerPositionX = Math.floor(mouse.clientX / Cell.cellWidth);
  let newPlayerPositionY = Math.floor(
    (mouse.clientY + uiOffsetY) / Cell.cellHeight
  );
  if (newPlayerPositionX >= +2 && newPlayerPositionX < gameGridColumns + 2) {
    if (newPlayerPositionY >= 0 && newPlayerPositionY < gameGridRows) {
      //console.log("Hovering different cell");
      gameManager.player.position.x = newPlayerPositionX;
      gameManager.player.position.y = newPlayerPositionY;
      gameManager.player.moved = true;
    }
  }
});
