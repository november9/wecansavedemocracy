module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        }
      }, {
        test: /\.css$/,
        loader: ["style-loader", "css-loader"]
      }, {
        include: /\.json$/,
        loader: ['json-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: "file-loader?name=../[path][name].[ext]"
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  },
  devtool: 'cheap-module-eval-source-map'
};
