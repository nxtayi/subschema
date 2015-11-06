require('es6-promise').polyfill();
var path = require('path');
var webpack = require('webpack');
var AUTOPREFIXER_LOADER = 'autoprefixer-loader?{browsers:[' +
    '"Android 2.3", "Android >= 4", "Chrome >= 20", "Firefox >= 24", ' +
    '"Explorer >= 8", "iOS >= 6", "Opera >= 12", "Safari >= 6"]}';
function config(filename, externals) {
    return {
        devtool: 'eval',
        entry: {
            subschema: './src/index.jsx'
        },
        devServer: {
            contentBase: path.join(__dirname, ".build"),
            info: true, //  --no-info option
            hot: true,
            inline: true,
            port: 8084
        },
        output: {
            path: path.join(__dirname, "dist"),
            filename: filename,
            libraryTarget: 'umd',
            library: 'Subschema'
        },
        externals: externals,
        resolve: {
            extensions: ['', '.js', '.jsx'],
            alias: {
                'subschema-styles': path.join(__dirname, 'src/styles'),
                'fbjs': path.join(__dirname, 'node_modules/fbjs')
            }
        },
        stats: {
            colors: true,
            reasons: true
        },
        module: {
            loaders: [
                {
                    test: /\.js(x)?$/,
                    excludes: /node_modules/,
                    //do this to prevent babel fromt tanslating everything.
                    loaders: ['babel-loader?stage=0']
                },
                {test: /\.(png|jpe?g|mpe?g[34]?|gif)$/, loader: 'url-loader?limit=100000'},
                {test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff"},
                {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream"},
                {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file"},
                //       {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml"},
                // Optionally extract less files
                // or any other compile-to-css language
                {
                    test: /\.css$/,
                    loader: 'style-loader!css-loader!' + AUTOPREFIXER_LOADER
                },
                {
                    test: /\.less$/,
                    loader: 'style!css!less-loader!' + AUTOPREFIXER_LOADER
                }
            ]
        },


        plugins: [
         //   new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),

            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
            }),
            function () {
                this.plugin("done", function (stats) {
                    stats = stats.toJson();
                    console.error(JSON.stringify({
                        assetsByChunkName: stats.assetsByChunkName
                    }));
                });
            }
        ]
    }

};

var configs = [
    config('subschema.js'),
    config('subschema-noreact.js',
        [{
            "react": {
                root: "React",
                commonjs2: "react",
                commonjs: "react",
                amd: "react"
            },
            './React':{
                root:"React",
                commonjs2: "react",
                commonjs: "react",
                amd: "react"
            },
            "react-dom": {
                root: "ReactDom",
                commonjs2: "react-dom",
                commonjs: "react-dom",
                amd: "react-dom"
            },
            "react-addons-css-transition-group": {
                "root": "ReactCSSTransitionGroup",
                "commonjs2": "react-addons-css-transition-group",
                "commonjs": "react-addons-css-transition-group",
                "amd": "react-addons-css-transition-group"
            },
            "fbjs": {
                "root": "fbjs",
                "commonjs2": "fbjs",
                "commonjs": "fbjs",
                "amd": "fbjs"
            }
        }]
    )];
module.exports = configs;