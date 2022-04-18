export default {
    entry: {
        audioshowkit: "./src/audioshowkit.js"
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    output: {
        filename: "[name].js",
        path: "./dist"
    }
};