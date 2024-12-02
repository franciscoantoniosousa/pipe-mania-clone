const path = require('path');

module.exports = {
  entry: './src/index.js',  // Entry file (your main JS file)
  output: {
    filename: 'bundle.js',  // Output bundled JS file
    path: path.resolve(__dirname, 'dist'),  // Output directory
  },
  module: {
    rules: [
      // Rule to handle JS files (transpile with Babel)
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      // Rule to handle image files
      {
        test: /\.(png|jpe?g|gif|svg)$/i,  // Match image files
        type: 'asset/resource',  // Use Webpack's built-in asset/resource type for image handling
        generator: {
          filename: 'images/[name][hash][ext]',  // Output images into the 'images' folder with hash in name
        },
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'),  // Serve from the 'dist' folder
    },
    port: 8080,  // Server port
    open: true,  // Open browser automatically
    hot: true,  // Enable hot module replacement
  },
  mode: 'development',  // Development mode for easier debugging
};
