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

[Pipe Mania Clone (Deployed)](https://pipe-mania-clone.netlify.app)

## Technologies Used
- JavaScript (ES6+)
- HTML5
- Webpack (for bundling)
- Netlify (for deployment)

## Contributing
Feel free to fork this project and submit issues or pull requests if you have suggestions or improvements.

# Running the Project Locally

To run the project locally on your machine, follow these steps:

## 1. Clone the Repository
First, clone the repository to your local machine using the following command:

```bash
git clone https://github.com/yourusername/your-repo-name.git
```

Replace `https://github.com/yourusername/your-repo-name.git` with the actual URL of your repository.

## 2. Switch to the `distributable` Branch
After cloning the repository, change to the `distributable` branch. This branch contains the latest production-ready code for local development.

```bash
cd your-repo-name
git checkout distributable
```

Replace `your-repo-name` with the actual folder name of the cloned repository.

## 3. Install Dependencies
If you haven't already installed the dependencies, you need to run the following command to install them:

```bash
npm install
```

This will install all the necessary packages specified in the `package.json` file, including Webpack and other dependencies.

## 4. Run the Development Server
Once the dependencies are installed, you can start the development server using Webpack by running:

```bash
npx webpack serve
```

This command will:
- Start the Webpack Dev Server on your local machine.
- Open the application in your default browser.
- Serve the app at `http://localhost:8080/` by default (you can change the port in the Webpack configuration if needed).

> **Note**: `npx` comes with npm (version 5.2.0 and above). If you're using an older version of npm, you may need to update npm first.

## 5. Access the Application
After running `npx webpack serve`, you should see output in your terminal indicating that the server is running. Open your browser and go to:

```
http://localhost:8080
```

You should see the application running locally on your machine.

---

## Troubleshooting
- **If you get an error saying `npx: command not found`**, ensure that you have `npm` installed correctly. You can install or update npm by running:
  
  ```bash
  npm install -g npm
  ```

- **If the server is not opening automatically in the browser**, manually open your browser and navigate to `http://localhost:8080`.
