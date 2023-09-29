const path = require("path");
const webpack = require("webpack");
const CircularDependencyPlugin = require('circular-dependency-plugin'); // Import the circular-dependency-plugin

const use = [{ loader: "babel-loader" }];

const env = process.env.NODE_ENV || 'development';
if (env !== 'development') console.error("NODE_ENV is", env, "but needs to be 'development' when the server runs");

module.exports = {
    context: path.resolve(__dirname, "app"),
    mode: 'development',
    devtool: 'source-map',
    entry: {
        'only-dev-server': 'webpack/hot/only-dev-server',
        main: "./client/main.js",
        item: "./vtest/item.jsx"
    },
    output: {
        path: path.join(__dirname, "assets/webpack"),
        filename: "[name].js"
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                include: /(.*profile.*)/,
                use,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use,
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use,
            }
        ]
    },
    resolve: {
        extensions: ['.*', '.js', '.jsx'],
        fallback: {
            fs: false,
            "path": require.resolve("path-browserify")
        }
    },
    node: false,
    devServer: {
        static: {
            publicPath: '/assets/webpack/',
        },
        host: '0.0.0.0',
        port: 3011,
        devMiddleware: {
            index: false,
        },
        proxy: {
            context: () => true,
            target: 'http://localhost:3012'
        }
    },
    plugins: [
        new webpack.IgnorePlugin({ resourceRegExp: /clustered|dateFile|file|fileSync|gelf|hipchat|logFacesAppender|loggly|logstashUDP|mailgun|multiprocess|slack|smtp/ }, /(.*log4js.*)/),
        new webpack.IgnorePlugin({ resourceRegExp: /nodemailer/ }),
        new webpack.NormalModuleReplacementPlugin(/.+models\/.+/, resource => {
            resource.request = "../models/client-side-model";
        }),
        new webpack.HotModuleReplacementPlugin(),
        // Add CircularDependencyPlugin below this comment
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
        })
        // CircularDependencyPlugin added above this comment
    ]
};
