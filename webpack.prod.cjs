const { merge } = require("webpack-merge");
const webpackCommon = require("./webpack.common.cjs");


const prodConfig = {
    mode: "production",
};

module.exports = merge(webpackCommon, prodConfig);