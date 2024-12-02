import {Cell} from './cell';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

export class Player {
  constructor({position}) {
    this.position = position;
    this.width = Cell.cellWidth;
    this.height = Cell.cellHeight;
    this.moved = false;
  }

  draw() {
    context.lineWidth = 3;
    context.strokeStyle = 'red';
    // position is a coordinate, multiply by the cell size, -1 in width and height to center with the grid
    context.strokeRect(
        this.position.x * Cell.cellWidth - 1,
        this.position.y * Cell.cellHeight - 1,
        this.width,
        this.height,
    );
  }

  update() {
    if (this.moved) {
      this.moved = false;
    }
    this.draw();
  }
}