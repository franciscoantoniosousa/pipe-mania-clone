# Pipe Mania Clone

This is a browser-based puzzle game inspired by the classic *Pipe Mania*. The objective is to connect a series of pipes to guide flowing water from the start point to the end point. Players place different types of pipe pieces on a grid, with the goal of creating a continuous path for the water to travel through.

## Features
- **Grid-based gameplay**: The game area consists of a 9x7 grid.
- **Random blocked cells**: Some cells are blocked, and pipes cannot be placed in those areas.
- **Unlimited pipe pieces**: Players can place different types of pipes, such as straight, curved, and cross pipes.
- **Water flow simulation**: Water flows from the starting point after a short delay, filling the pipes.
- **Win condition**: Successfully create a continuous path of pipes that meets a minimum required length.
- **Lose condition**: The water either reaches the end of the path or encounters a dead-end without completing the required path length.

## Game Mechanics
- **Grid size**: 9x7 grid where players can place pipes.
- **Pipe pieces**: Players can place straight, curved, and cross pipe pieces on the grid. These pieces can't be rotated.
- **Starting point**: A randomly selected cell (not in the last row) where the water begins to flow.
- **Water flow**: Each pipe segment fills with water over time.
- **Win/loss conditions**: The player wins by creating a continuous path before the water reaches the end, and loses if the water flows out of the pipeline or hits a dead-end.

## Deployed Version
You can play the game online at the following link:

[Pipe Mania Clone (Deployed)](https://rainbow-cuchufli-c9343a.netlify.app/)

## Technologies Used
- JavaScript (ES6+)
- HTML5
- Webpack (for bundling)
- Netlify (for deployment)

## Contributing
Feel free to fork this project and submit issues or pull requests if you have suggestions or improvements.
