import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
    entry: {
        audioshowkit: path.resolve("./src/audioshowkit.js"),
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
            template: path.resolve("./src/demo/index.html"),
            filename: "demo.html"
        })
    ]
};