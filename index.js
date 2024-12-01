const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const game_grid_rows = 7;
const game_grid_columns = 9;
const ui_offset_y = - 40;

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
  Right: 3
}
// Classes
class Cell {
  static cell_width = 40;
  static cell_height = 40;

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
    this.next_pipes = [];
    this.gameStarted = false;
    this.currentPipe ={
      x: 0,
      y: 0,
      lastDirection: Direction.Up,
      type: 0 // image id to know the type of pipe
    }
  }

  addPipe() {
    let next_pipe_id = randomIntFromInterval(1, 7);
    this.next_pipes.push(next_pipe_id);
    console.log("Number of pipes", this.next_pipes.length);

    if(this.gameStarted){
      game_grid[11] = new Cell({
        position: {
          x: 0,
          y: Cell.cell_height,
        },
        src: images[this.next_pipes[3]],
        type: this.next_pipes[3]
      });
      game_grid[22] = new Cell({
        position: {
          x: 0,
          y: Cell.cell_height * 2,
        },
        src: images[this.next_pipes[2]],
        type: this.next_pipes[2]
      });
      game_grid[33] = new Cell({
        position: {
          x: 0,
          y: Cell.cell_height * 3,
        },
        src: images[this.next_pipes[1]],
        type: this.next_pipes[1]
      });
      game_grid[44] = new Cell({
        position: {
          x: 0,
          y: Cell.cell_height * 4,
        },
        src: images[this.next_pipes[0]],
        type: this.next_pipes[0]
      });
    }
  }
  getNextPipeInStream(){
    // get the current pipe type
    
    // get the current pipe direction
    
    // advance water to current pipe
    
    // Check score
    
    // check game over condition
  }
  setPipePosition(mouse_x, mouse_y) {
    // get the player coords in the grid
    let new_player_positionX = Math.floor(mouse_x / Cell.cell_width);
    let new_player_positionY = Math.floor(mouse_y / Cell.cell_height);
    // check if the mouse click was within the gamming area
    if (
      new_player_positionX >= 2  &&
      new_player_positionX < game_grid_columns + 2
    ) {
      if (
        new_player_positionY >= 0  &&
        new_player_positionY < game_grid_rows
      ) {
        // check if this coord can be played, not a bloc pipe nor starting pipe
        for (let index = 8; index <= 12; index++) {
          if (this.grid[new_player_positionY][new_player_positionX] === index) {
            console.log(
              "Cannot place pipe in this position, its a blocked pipe or starting pipe"
            );
            return;
          }
        }

        // set this grid value to be the next_pipe
        this.grid[new_player_positionY][new_player_positionX] =
          this.next_pipes.shift();
        // generate a new random pipe and add it to the queue
        this.addPipe();
        //  set the game_grid with the new cell (This should be overiden and not a new instance, cant find a proper way to this in js)
        let pressed_cell_id =
          new_player_positionY * (game_grid_columns + 2) + new_player_positionX;
        game_grid[pressed_cell_id] = new Cell({
          position: {
            x: Cell.cell_width * new_player_positionX,
            y: Cell.cell_height * new_player_positionY,
          },
          src: images[this.grid[new_player_positionY][new_player_positionX]],
          type: this.grid[new_player_positionY][new_player_positionX]
        });

        console.log(
          "Pipe was played on coords:",
          new_player_positionY,
          new_player_positionX
        );
      }
    }
  }
  startGame() {
    // set grid
    console.log("Initialize");
    // set blocked cells - image id - 8 - set a random number of blocks between 1 - 4
    const number_blocked_cells = randomIntFromInterval(0, 4);
    for (let index = 0; index < number_blocked_cells; index++) {
      // -1 since its id 0
      let row_position = randomIntFromInterval(0, game_grid_rows -1);
      let column_position = randomIntFromInterval(2, game_grid_columns + 1);
      this.grid[row_position][column_position] = 8;
      console.log("blocked_cell", row_position, column_position);
    }

    // set the starting point - random number between 9 - 12 (starting point image id's)
    let initial_pipe_type = randomIntFromInterval(9, 12);
    let initial_is_set = false;
    while (initial_is_set === false) {
      // -2 because starting position cannot be initialized in the last row
      let row_position = randomIntFromInterval(0, game_grid_rows - 2);
      let column_position = randomIntFromInterval(2, game_grid_columns + 1);
      // check if the position for the starting pipe does not have a blocked cell bellow
      if (this.grid[row_position + 1][column_position] !== 8) {
        //if pipe is facing right, x cannot be game_grid_column - 1
        //if pipe is facing left, x cannot be 0
        //if pipe is facing up, y cannot be 0
        //no blocked cell can be in the direction of the water flow
        let can_set_starting_pipe = false;
        switch (initial_pipe_type) {
          case 9:
            let next_column_id = column_position + 1;
            console.log("next column: ", next_column_id);
            // water flow direction is not out of map or a blocked cell
            if (next_column_id < game_grid_columns + 2) {
              if (this.grid[row_position][next_column_id] !== 8) {
                can_set_starting_pipe = true;
              }
            }
            break;

          case 10:
            let previous_column_id = column_position - 1;
            // water flow direction is not out of map or a blocked cell
            if (previous_column_id >= 2) {
              if (this.grid[row_position][previous_column_id] !== 8) {
                can_set_starting_pipe = true;
              }
            }
            break;
          case 11:
            let bellow_row_id = row_position + 1;
            // water flow direction is not out of map or a blocked cell
            if (bellow_row_id > 0) {
              if (this.grid[bellow_row_id][column_position] !== 8) {
                can_set_starting_pipe = true;
              }
            }
            break;
          case 12:
            let above_row_id = row_position - 1;
            // water flow direction is not out of map or a blocked cell
            if (above_row_id >= 0) {
              if (this.grid[above_row_id][column_position] !== 8) {
                can_set_starting_pipe = true;
              }
            }
            break;
        }
        // set starting pipe if possible
        if (can_set_starting_pipe) {
          this.grid[row_position][column_position] = initial_pipe_type;
          this.currentPipe.y = row_position;
          this.currentPipe.x = column_position;
          this.currentPipe.type = initial_pipe_type;
          switch (initial_pipe_type){
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
            initial_pipe_type,
            ". was set on position: ",
            row_position,
            column_position
          );
          initial_is_set = true;
        } else {
          console.log(
            "pipe type: ",
            initial_pipe_type,
            "could not place pipe here:",
            column_position,
            row_position,
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
  }
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
    this.width = Cell.cell_width;
    this.height = Cell.cell_height;
    this.moved = false;
  }

  draw() {
    context.lineWidth = 3;
    context.strokeStyle = "red";
    // position is a coordinate, multiply by the cell size, -1 in width and height to center with the grid
    context.strokeRect(
      this.position.x * Cell.cell_width - 1,
      this.position.y * Cell.cell_height - 1,
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
// game_grid
const game_manager = new GameManager();
const game_grid = [];
game_manager.startGame();

// set each cell pipe_type /  or empty cell
game_manager.grid.forEach((row, current_row) => {
  row.forEach((column, current_column) => {
    game_grid.push(
      new Cell({
        position: {
          x: Cell.cell_width * current_column,
          y: Cell.cell_height * current_row,
        },
        src: images[column],
        type: column
      })
    );
  });
});

// Game Loop
function game_loop() {
  requestAnimationFrame(game_loop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw player position
  game_manager.update();
  // draw the cells
  for (const cell in game_grid) {
    game_grid[cell].draw();
  }
}

game_loop();

window.addEventListener("keydown", ({ key }) => {
  console.log(key);
  switch (key) {
    case "w":
      if (game_manager.player.position.y - 1 >= 0) {
        game_manager.player.position.y -= 1;
      }
      break;
    case "s":
      if (game_manager.player.position.y + 1 < game_grid_rows) {
        game_manager.player.position.y += 1;
      }
      break;
    case "a":
      if (game_manager.player.position.x - 1 >= 0) {
        game_manager.player.position.x -= 1;
      }
      break;
    case "d":
      if (game_manager.player.position.x + 1 < game_grid_columns) {
        game_manager.player.position.x += 1;
      }
      break;
  }
});

window.addEventListener("mousedown", (mouse) => {
  game_manager.setPipePosition(mouse.clientX, mouse.clientY + ui_offset_y);
});

window.addEventListener("mousemove", (mouse) => {
  let new_player_positionX = Math.floor((mouse.clientX) / Cell.cell_width);
  let new_player_positionY = Math.floor((mouse.clientY + ui_offset_y) / Cell.cell_height);
  if (
    new_player_positionX >= + 2 &&
    new_player_positionX < game_grid_columns + 2
  ) {
    if (
      new_player_positionY >= 0 &&
      new_player_positionY < game_grid_rows
    ) {
      //console.log("Hovering different cell");
      game_manager.player.position.x = new_player_positionX;
      game_manager.player.position.y = new_player_positionY;
      game_manager.player.moved = true;
    }
  }
});
