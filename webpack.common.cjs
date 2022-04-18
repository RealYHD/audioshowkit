const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {

    entry: {
        audioshowkit: path.resolve("./src/audioshowkitlib.js"),
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
        ]
    },
    output: {
        filename: "[name].js",
        path: path.resolve("./dist"),
        library: ["[name]"],
        clean: true
    },
    plugins: [
        new ESLintPlugin()
    ]
};