import merge from "webpack-merge";
import webpackCommon from "./webpack.common";

devConfig = {
    mode: "development",
    devtools: "inline-source-map",

    devServer: {
        static: "./dist"
    }
}

export default merge(webpackCommon, devConfig);