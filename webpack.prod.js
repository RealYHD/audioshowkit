import merge from "webpack-merge";
import webpackCommon from "./webpack.common";

const prodConfig = {
    mode: "production",
    output: {
        filename: "[name].js",
        path: "./public"
    }
};

export default merge(webpackCommon, prodConfig);