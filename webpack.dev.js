import merge from "webpack-merge";
import webpackCommon from "./webpack.common";

const devConfig = {
    mode: "development",
    devtools: "inline-source-map",

    devServer: {
        static: "./dist"
    }
};

export default merge(webpackCommon, devConfig);