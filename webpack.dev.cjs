const path = require("path");
const { merge } = require("webpack-merge");
const webpackCommon = require("./webpack.common.cjs");


const devConfig = {
    mode: "development",
    devtool: "eval-source-map",
    watchOptions: {
        ignored: "./tutorials/**"
    }
};

module.exports = merge(webpackCommon, devConfig);