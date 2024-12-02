import {images} from './resources';
import {Direction} from './eDirection';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
export class Cell {
  static cellWidth = 70;
  static cellHeight = 70;

  constructor({gameManager,position, src, type}) {
    this.position = position;
    this.width = 68;
    this.height = 68;
    this.gameManager = gameManager;

    const pipeImage = new Image();
    pipeImage.src = src;
    pipeImage.onload = () => {
      this.image = pipeImage;
    };

    const pipeWithWaterImage = new Image();
    pipeWithWaterImage.src = images[this.getPipeWithWaterImage(type)];
    pipeWithWaterImage.onload = () => {
      this.imageFilled = pipeWithWaterImage;
    };

    
    this.withWater = false;
    this.type = type;
    this.alreadyFilled = false;
  }

  getPipeWithWaterImage(type) {
    console.log('trying to get filled water pipe');
    switch (type) {
      case 1:
        if(this.alreadyFilled === false){
          this.alreadyFilled = true;
          if (this.gameManager.currentPipe.direction === Direction.Up || this.gameManager.currentPipe.direction === Direction.Down) {
            return 16;
          } else {
            return 15;
          }
        }
        return 14;
      case 2:
        return 17;
      case 3:
        return 18;
      case 4:
        return 19;
      case 5:
        return 20;
      case 6:
        return 21;
      case 7:
        return 22;
      case 9:
        return 23;
      case 10:
        return 24;
      case 11:
        return 25;
      case 12:
        return 26;
    }
  }

  draw() {
    const imageToDraw = this.withWater ? this.imageFilled : this.image;
    if (imageToDraw) {
      context.drawImage(
          imageToDraw,
          this.position.x,
          this.position.y,
          this.width,
          this.height
      );
    } else {
      context.fillStyle = 'rgb(255, 201, 14)';
      context.fillRect(
          this.position.x,
          this.position.y,
          this.width,
          this.height
      );
    }
  }
  resize(newWidth, newHeight) {
    // Tried to figure out how to dynamically change the graphic size when window is resized but was not successful    

    // const scaleX = newWidth / window.innerWidth;
    // const scaleY = newHeight / window.innerHeight;
    //
    // // Adjust cell width and height based on window size
    // this.width = scaleX * Cell.cellWidth;
    // this.height = scaleY * Cell.cellHeight;
    //
    // // Recalculate position (if necessary) based on the window size
    // this.position.x *= scaleX;
    // this.position.y *= scaleY;
  }
}

