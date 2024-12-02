import {GameManager} from './game-manager.js'
import {Cell} from './cell';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const countdownElement = document.querySelector('#timeElement');
const distanceElement = document.querySelector('#distanceElement');
const scoreElement = document.querySelector('#scoreElement');

const gameGridRows = 7;
const gameGridColumns = 9;

canvas.width = innerWidth;
canvas.height = innerHeight;

// UI area offset
const uiOffsetY = -160;
const uiOffsetX = -160;
// Offset of the next pipe queue
const uiCoordsOffsetX = 2;

// fields
const gameManager = new GameManager();

// Game Loop
function gameLoop() {
  requestAnimationFrame(gameLoop);
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw player position
  gameManager.update();
}

gameLoop();
window.addEventListener('mousedown', (mouse) => {
  if (gameManager.gameStarted && gameManager.isGameOver === false) {
    gameManager.setPipePosition(mouse.clientX + uiOffsetX, mouse.clientY + uiOffsetY);
    return;
  }
  // Click anywhere on screen to restart the game
    console.log('Started Game on Click!');
    gameManager.restartGame(false);
});
window.addEventListener('mousemove', (mouse) => {
  if (gameManager.gameStarted) {
    let newPlayerPositionX = Math.floor((mouse.clientX + uiOffsetX) / Cell.cellWidth);
    let newPlayerPositionY = Math.floor(
        (mouse.clientY + uiOffsetY) / Cell.cellHeight,
    );
    if (
        newPlayerPositionX >= uiCoordsOffsetX &&
        newPlayerPositionX < gameGridColumns + uiCoordsOffsetX
    ) {
      if (newPlayerPositionY >= 0 && newPlayerPositionY < gameGridRows) {
        //console.log("Hovering different cell");
        gameManager.player.position.x = newPlayerPositionX;
        gameManager.player.position.y = newPlayerPositionY;
        gameManager.player.moved = true;
      }
    }
  }

  if (gameManager.isGameOver === false && gameManager.gameStarted === false) {
    scoreElement.innerHTML = '';
    distanceElement.innerHTML = '';
    countdownElement.innerHTML = 'Press Anywhere to start the game!';
  }
});
window.addEventListener('resize',  () => {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  // Resize all cells
  gameManager.gameGrid.forEach(cell => cell.resize(newWidth, newHeight));

  // Redraw the updated cells
  context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  gameManager.gameGrid.forEach(cell => cell.draw()); // Redraw each resized cell
});