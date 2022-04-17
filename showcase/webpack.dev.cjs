const path = require("path");
const { merge } = require("webpack-merge");
const webpackCommon = require("./webpack.common.cjs");


const devConfig = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: path.resolve("./dist"),
        open: true,
        hot: true
    }
};

module.exports = merge(webpackCommon, devConfig);