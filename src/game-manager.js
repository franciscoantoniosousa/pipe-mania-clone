import {randomIntFromInterval} from './helper';
import {Player} from './player';
import {Cell} from './cell';
import {Direction} from './eDirection';
import {images} from './resources';

const countdownElement = document.querySelector('#timeElement');
const distanceElement = document.querySelector('#distanceElement');
const scoreElement = document.querySelector('#scoreElement');

const gameGridRows = 7;
const gameGridColumns = 9;
// Offset of the next pipe queue
const uiCoordsOffsetX = 2;

export class GameManager {
  constructor() {

    this.countdownTimer = 20;
    this.currentPipe = {
      x: 0,
      y: 0,
      direction: Direction.Up,
    };
    this.gameGrid = [];
    this.gameStarted = false;
    this.grid = [
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.loadingNextLevel = false;
    this.player = new Player({
      //  position is a coordinate in the grid
      position: {
        x: 5,
        y: 5,
      }
    });
    this.nextPipes = [];
    this.remainingDistance = randomIntFromInterval(4, 20);
    this.score = 0;
    this.stopCountDown = false;
    this.updateQueue = false;
    this.isGameOver = false;
  }

  addPipe() {
    let nextPipeId = randomIntFromInterval(1, 7);
    this.nextPipes.push(nextPipeId);
    console.log('Number of pipes', this.nextPipes.length);
    this.updateQueue = true;
  }

  canReceiveWater(type, direction) {
    console.log('Direction', direction, ' Type', type);
    switch (type) {
      case 1: // 4 side pipe
        switch (direction) {
          case Direction.Down:
            this.currentPipe.direction = Direction.Down;
            return true;
          case Direction.Up:
            this.currentPipe.direction = Direction.Up;
            return true;
          case Direction.Left:
            this.currentPipe.direction = Direction.Left;
            return true;
          case Direction.Right:
            this.currentPipe.direction = Direction.Right;
            return true;
        }
        break;
      case 2: // bottom left curve
        switch (direction) {
          case Direction.Up:
          case Direction.Right:
            return false;
          case Direction.Down:
            this.currentPipe.direction = Direction.Right;
            return true;
          case Direction.Left:
            this.currentPipe.direction = Direction.Up;
            return true;
        }
        break;
      case 3: // bottom right curve
        switch (direction) {
          case Direction.Up:
          case Direction.Left:
            return false;
          case Direction.Down:
            this.currentPipe.direction = Direction.Left;
            return true;
          case Direction.Right:
            this.currentPipe.direction = Direction.Up;
            return true;
        }
        break;
      case 4: // top left curve
        switch (direction) {
          case Direction.Up:
            this.currentPipe.direction = Direction.Right;
            return true;
          case Direction.Left:
            this.currentPipe.direction = Direction.Down;
            return true;
          case Direction.Down:
          case Direction.Right:
            return false;
        }
        break;
      case 5: // top right curve
        switch (direction) {
          case Direction.Up:
            this.currentPipe.direction = Direction.Left;
            return true;
          case Direction.Right:
            this.currentPipe.direction = Direction.Down;
            return true;
          case Direction.Down:
          case Direction.Left:
            return false;
        }
        break;
      case 6: // horizontal
        switch (direction) {
          case Direction.Down:
          case Direction.Up:
            return false;
          case Direction.Left:
            this.currentPipe.direction = Direction.Left;
            return true;
          case Direction.Right:
            this.currentPipe.direction = Direction.Right;
            return true;
        }
        break;
      case 7: // vertical
        switch (direction) {
          case Direction.Down:
            this.currentPipe.direction = Direction.Down;
            return true;
          case Direction.Up:
            this.currentPipe.direction = Direction.Up;
            return true;
          case Direction.Left:
          case Direction.Right:
            return false;
        }
        break;
        // Blocked Pipe and starting positions cannot receive water
      case 8:
        console.log('Clogged Pipe');
        return false;
      case 9:
      case 10:
      case 11:
      case 12:
        console.log('Starting Pipe');
        return false;
      default:
        console.log('There is no pipe on this cell');
        return false;
    }
  }

  drawPipeQueue() {
    console.log('New Pipe in queue drawn');
    this.gameGrid[11] = new Cell({
      position: {
        x: 0,
        y: Cell.cellHeight,
      },
      src: images[this.nextPipes[3]],
      type: this.nextPipes[3],
      gameManager: this,
    });
    this.gameGrid[22] = new Cell({
      position: {
        x: 0,
        y: Cell.cellHeight * 2,
      },
      src: images[this.nextPipes[2]],
      type: this.nextPipes[2],
      gameManager: this,
    });
    this.gameGrid[33] = new Cell({
      position: {
        x: 0,
        y: Cell.cellHeight * 3,
      },
      src: images[this.nextPipes[1]],
      type: this.nextPipes[1],
      gameManager: this,
    });
    this.gameGrid[44] = new Cell({
      position: {
        x: 0,
        y: Cell.cellHeight * 4,
      },
      src: images[this.nextPipes[0]],
      type: this.nextPipes[0],
      gameManager: this,
    });
    this.updateQueue = false;
  }

  gameOver() {
    scoreElement.innerHTML = '';
    distanceElement.innerHTML = '';
    countdownElement.innerHTML = 'GAME OVER! Press Anywhere to restart the game!';
  }

  getNextPipeInStream() {
    console.log('trying to fill next pipe');
    // get the current pipe type
    let currentPipeGridId = this.currentPipe.y * 11 + this.currentPipe.x;
    const currentPipe = this.gameGrid[currentPipeGridId];
    currentPipe.withWater = true;
    // check for game over condition based on current pipe coords and direction
    switch (this.currentPipe.direction) {
      case Direction.Down:
        if (this.currentPipe.y + 1 >= gameGridRows) {
          this.isGameOver = true;
        }
        break;
      case Direction.Up:
        if (this.currentPipe.y - 1 < 0) {
          this.isGameOver = true;
        }
        break;
      case Direction.Left:
        if (this.currentPipe.x - 1 < uiCoordsOffsetX) {
          this.isGameOver = true;
        }
        break;
      case Direction.Right:
        if (this.currentPipe.x + 1 >= gameGridColumns + uiCoordsOffsetX) {
          this.isGameOver = true;
        }
        break;
    }
    console.log('Check if current pipe is sending water out of the game grid:',
        this.isGameOver);

    if (this.isGameOver && this.loadingNextLevel === false) {
      console.log('Game over, sent water out of grid');
      this.gameOver();
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

    console.log('next pipe coords: ', nextPipeCoords.x, nextPipeCoords.y);

    /*check if water can flow to the next pipe.
     *return value will dictate game over condition, if it's not game over the direction of the next pipe is already
     *set through this function*/
    if (this.canReceiveWater(nextPipeType, this.currentPipe.direction) === false) {
      this.isGameOver = true;
      if (this.loadingNextLevel === false) {
        console.log(
            'Game Over, the next pipe cannot receive water from the previous pipe', this.isGameOver);
        this.gameOver();
      }
      return;
    }
    console.log('Next Pipe was filled with water!!!');
    // advance water to current pipe
    this.currentPipe.x = nextPipeCoords.x;
    this.currentPipe.y = nextPipeCoords.y;

    // Check score
    this.score += 100;
    this.remainingDistance--;
    scoreElement.innerHTML = `Score: ${this.score}`;
    distanceElement.innerHTML = `Distance: ${this.remainingDistance}`;

    // Go to next level if the user completes the required distance
    if (this.remainingDistance <= 0 && this.loadingNextLevel === false) {
      this.stopCountDown = true;
      this.nextLevel();
    }
  }

  nextLevel() {
    console.log('Next Level');
    // go through all the remaining aligned pipes to give score to the user, if it reaches a dead end avoid a game over
    this.loadingNextLevel = true;
    // Get next pipe to score until its "game over"
    while (this.isGameOver === false) {
      this.getNextPipeInStream();
    }
    // reset "game over"
    this.isGameOver = false;

    // subtract score for every pipe not used in the pipe stream
    this.gameGrid.forEach((currentPipe)=>{
      if(currentPipe.type >= 1 && currentPipe.type <= 7){
        if(currentPipe.withWater === false){
          console.log('Penalized 50 for not using a pipe');
          this.score -= 50;
        }
      }
    })
    // Small Countdown coroutine to give the user some feedback
    scoreElement.innerHTML = '';
    distanceElement.innerHTML = '';

    const countdownTimer = setInterval(() => {
      console.log('countDown: ', this.countdownTimer);
      // Update the countdown display
      countdownElement.innerHTML = `Going to next level in: ${this.countdownTimer}`;
      if (this.countdownTimer <= 0) {
        // Stop the timer
        clearInterval(countdownTimer);
        this.restartGame(true);
      } else {
        // Decrease the countdown
        this.countdownTimer--;
      }
    }, 1000); // Run every 1 second

  }

  restartGame(keepScore) {
    this.countdownTimer = 20;
    this.currentPipe = {
      x: 0,
      y: 0,
      direction: Direction.Up,
    };
    this.gameGrid = [];
    this.gameStarted = false;
    this.grid = [
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    this.loadingNextLevel = false;
    this.player = new Player({
      //  position is a coordinate in the grid
      position: {
        x: 5,
        y: 5,
      },
    });
    this.nextPipes = [];
    this.remainingDistance = randomIntFromInterval(4, 20);
    if (keepScore === false) {
      this.score = 0;
    }
    this.stopCountDown = false;
    this.updateQueue = false;
    this.isGameOver = false;
    this.startGame();
  }

  setPipePosition(mouseX, mouseY) {
    // get the player coords in the grid
    let newPlayerPositionX = Math.floor(mouseX / Cell.cellWidth);
    let newPlayerPositionY = Math.floor(mouseY / Cell.cellHeight);
    // check if the mouse click was within the gaming area
    if (
        newPlayerPositionX >= uiCoordsOffsetX &&
        newPlayerPositionX < gameGridColumns + uiCoordsOffsetX
    ) {
      if (newPlayerPositionY >= 0 && newPlayerPositionY < gameGridRows) {
        // check if this coord can be played, not a bloc pipe nor starting pipe
        for (let index = 8; index <= 12; index++) {
          if (this.grid[newPlayerPositionY][newPlayerPositionX] === index) {
            console.log(
                'Cannot place pipe in this position, its a blocked pipe or starting pipe',
            );
            return;
          }
        }

        // set this grid value to be the nextPipe
        this.grid[newPlayerPositionY][newPlayerPositionX] =
            this.nextPipes.shift();
        // generate a new random pipe and add it to the queue
        this.addPipe();
        //  set the gameGrid with the new cell (This should be overriden and not a new instance, cant find a proper way to this in js)
        let pressedCellId =
            newPlayerPositionY * (gameGridColumns + uiCoordsOffsetX) +
            newPlayerPositionX;

        this.gameGrid[pressedCellId] = new Cell({
          position: {
            x: Cell.cellWidth * newPlayerPositionX,
            y: Cell.cellHeight * newPlayerPositionY,
          },
          src: images[this.grid[newPlayerPositionY][newPlayerPositionX]],
          type: this.grid[newPlayerPositionY][newPlayerPositionX],
          gameManager: this,
        });

        console.log(
            'Pipe was played on coords:',
            newPlayerPositionY,
            newPlayerPositionX,
        );
      }
    }
  }

  startCountdown() {
    const countdownTimer = setInterval(() => {
      if(this.isGameOver){
        clearInterval(countdownTimer);
        return;
      }
      console.log('countDown: ', this.countdownTimer);
      // Update the countdown display
      countdownElement.innerHTML = `Time Left: ${this.countdownTimer}`;
      if (this.countdownTimer <= 0) {
        // Stop the timer
        clearInterval(countdownTimer);
        // Start the game/water flow
        this.startWaterFlow();
      } else {
        // Decrease the countdown
        this.countdownTimer--;
      }
    }, 1000); // Run every 1 second
  }

  startGame() {
    scoreElement.innerHTML = `Score: ${this.score}`;
    distanceElement.innerHTML = `Distance: ${this.remainingDistance}`;
    countdownElement.innerHTML = `Time Left: ${this.countdownTimer}`;
    this.stopCountDown = false;

    // set grid
    console.log('Initialize');
    // set blocked cells - image id - 8 - set a random number of blocks between 1 - 4
    const numberBlockedCells = randomIntFromInterval(0, 4);
    for (let index = 0; index < numberBlockedCells; index++) {
      // -1 since its id 0
      let rowPosition = randomIntFromInterval(0, gameGridRows - 1);
      let columnPosition = randomIntFromInterval(
          uiCoordsOffsetX,
          gameGridColumns + 1,
      );
      this.grid[rowPosition][columnPosition] = 8;
      console.log('blockedCell', rowPosition, columnPosition);
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
            console.log('next column: ', nextColumnId);
            // water flow direction is not out of map or a blocked cell
            if (nextColumnId < gameGridColumns + uiCoordsOffsetX) {
              if (this.grid[rowPosition][nextColumnId] !== 8) {

                canSetStartingPipe = true;
              }
            }
            break;

          case 10:
            let previousColumnId = columnPosition - 1;
            // water flow direction is not out of map or a blocked cell
            if (previousColumnId >= uiCoordsOffsetX) {
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
              'Starting pipe of type: ',
              initialPipeType,
              '. was set on position: ',
              rowPosition,
              columnPosition,
              'with starting direction: ',
              this.currentPipe.direction,
          );
          initialIsSet = true;
        } else {
          console.log(
              'pipe type: ',
              initialPipeType,
              'could not place pipe here:',
              columnPosition,
              rowPosition,
              'water would flow out of the map',
          );
        }
      } else {
        // debug purpose to check if this ever happened
        console.log('Could not set initial pipe here');
      }
    }
    // generate the queue with 4 new blocks - image id's - 1 -7
    for (let index = 0; index < 4; index++) {
      this.addPipe();
    }

    this.gameStarted = true;

    // set each cell pipeType /  or empty cell
    this.grid.forEach((row, currentRow) => {
      row.forEach((column, currentColumn) => {
        this.gameGrid.push(
            new Cell({
              position: {
                x: Cell.cellWidth * currentColumn,
                y: Cell.cellHeight * currentRow,
              },
              src: images[column],
              type: column,
              gameManager: this,
            }),
        );
      });
    });
    // start water flow countdown
    this.startCountdown();
  }

  startWaterFlow() {
    console.log('StartWaterFlow');

    // set the next pipe to be filled     
    const countdownTimer = setInterval(() => {
      if(this.isGameOver){
        clearInterval(countdownTimer);
        return;
      }
      console.log('water flow countDown: ', this.countdownTimer);
      // Update the countdown display
      countdownElement.innerHTML = `Time Left: ${this.countdownTimer}`;
      if (this.isGameOver || this.stopCountDown) {
        console.log('Game Over, stop water flow timer');
        clearInterval(countdownTimer);
        return;
      }
      if (this.countdownTimer <= 0) {
        // restart the timer
        this.countdownTimer = 3;
        // Start the game/water flow
        this.getNextPipeInStream();
      } else {
        // Decrease the countdown
        this.countdownTimer--;
      }
    }, 500); // Run every 1 second
  }

  update() {
    if (this.gameStarted === false) {
      return;
    }
    // Update player position
    this.player.update();
    if (this.gameStarted && this.updateQueue) {
      this.drawPipeQueue();
    }
    // draw the cells
    for (const cell in this.gameGrid) {
      this.gameGrid[cell].draw();
    }
  }
}