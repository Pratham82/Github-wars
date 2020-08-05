const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const webpack = require("webpack");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "bundle.js",
		publicPath: "/",
	},
	module: {
		rules: [
			{ test: /\.svg$/, use: "svg-inline-loader" },
			{ test: /\.css$/, use: ["style-loader", "css-loader"] },
			{ test: /\.js$/, use: "babel-loader" },
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/index.html",
		}),
	],
	mode: process.env.NODE_ENV === "production" ? "production" : "development",
	devServer: {
		historyApiFallback: true,
	},
};
