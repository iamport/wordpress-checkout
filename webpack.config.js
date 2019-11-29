const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	entry: {
		'bundle.js': [
			path.resolve(__dirname, 'controller/require-babel-polyfill.js'),
			path.resolve(__dirname, 'controller/custom-fields.js'),
			path.resolve(__dirname, 'controller/postcode.js'),
			path.resolve(__dirname, 'model/custom-fields/button-fields.js'),
			path.resolve(__dirname, 'model/custom-fields/custom-types/text-fields.js'),
			path.resolve(__dirname, 'model/custom-fields/custom-types/address-fields.js'),
			path.resolve(__dirname, 'model/custom-fields/custom-types/radio-fields.js'),
			path.resolve(__dirname, 'model/custom-fields/custom-types/check-fields.js'),
			path.resolve(__dirname, 'model/custom-fields/custom-types/select-fields.js')
		],
		'bundle-main.js': [
			path.resolve(__dirname, 'controller/file-info.js')
		]
	},
	plugins: [
		new UglifyJSPlugin()
	],
	output: {
		filename: '[name]',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['babel-preset-env']
					}
				}
			}
		]
	}
}
