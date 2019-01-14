module.exports = {
   mode: 'development',
   entry: './app/Main.js',
   output: {
      path: __dirname + '/',
      filename: 'bundle.js'
   },
   module: {
      rules: [
         {
            loader: 'babel-loader',
            test: /\.js$/,
            exclude: /node_modules/
         }
      ]
   },
   devServer: {
      port: 7777
   }
};
