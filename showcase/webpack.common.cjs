const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        audioshowkitshowcase: path.resolve("./src/js/main.js"),
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve("./dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve("./src/index.html"),
        }),
        new CopyPlugin({
            patterns: [
                { from: "audio/*.mp3", to: "./" }
            ]
        })
    ]
};