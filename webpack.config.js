const path = require('path');
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  devtool: "cheap-module-source-map",
  entry: path.resolve(__dirname, './client/src/index.jsx'),
  output: {
    path: path.resolve(__dirname, './client/dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js[x]?/s,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react',
                     ['@babel/preset-env', 
                          {
                          "targets": {
                            "browsers": [
                                ">0.25%",
                                "not ie 11",
                              "not op_mini all"
                              ]
                            }
                          }
                        ]
                      ],
            plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-transform-runtime"]
          }
        }
      },
      {
        test: /\.(scss|css)$/,
        loaders: ['style-loader', 'css-loader'],
      },
      { 
        test: /\.(png|woff|woff2|jpg|eot|ttf|jpeg)$/, 
        loader: ['url-loader?limit=100000'], 
      },
        {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  node: {
    fs: 'empty'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
    modules: [
      'node_modules'
    ]   
  }
  
};