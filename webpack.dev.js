import { merge } from "webpack-merge";
import path from "path";
import webpackCommon from "./webpack.common.js";


const devConfig = {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: path.resolve("./dist"),
        open: true
    }
};

export default merge(webpackCommon, devConfig);