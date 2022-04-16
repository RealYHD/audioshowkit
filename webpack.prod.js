import { merge } from "webpack-merge";
import webpackCommon from "./webpack.common.js";


const prodConfig = {
    mode: "production",
};

export default merge(webpackCommon, prodConfig);