const { join } = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const { HotModuleReplacementPlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
// const DotenvPlugin = require('dotenv-webpack');
const isDevelopment = process.env.NODE_ENV === 'development'
const DotenvFlowPlugin = require('dotenv-flow-webpack');
console.log(`Running in the "${process.env.NODE_ENV}" mode.`);
module.exports = {
	entry: join(__dirname, 'src', 'index.js'),
	output: {
		path: join(__dirname, 'publish'),
		filename: 'app.min.js',
		publicPath: '/' 
	},
	devServer: {
		historyApiFallback: true,
		hot: true,
		overlay: true
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}, {
				test: /.vue$/,
				loader: 'vue-loader'
			},
			// Styles: Inject CSS into the head
            {
                test: /\.(s*)[a|c]ss$/,
                use: [
                    "vue-style-loader",
                    'style-loader',
                    {loader: 'css-loader', options: {sourceMap: false, importLoaders: 1}},
                    {loader: 'postcss-loader', options: {sourceMap: false}},
                    {loader: 'sass-loader', options: {sourceMap: false}},
                ]
            },
			// {
			// 	test: /\.s[ac]ss$/i,
			// 	use: [
			// 		// Creates `style` nodes from JS strings
			// 		"style-loader",
			// 		// Translates CSS into CommonJS
			// 		"css-loader",
			// 		// Compiles Sass to CSS
			// 		"sass-loader",
			// 	],
			// },
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]?[hash]',

					esModule: false
				}
			},
			{
				test: /\.(config)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					esModule: false
				}
			}
		]
	},

	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
	plugins: [
		new HotModuleReplacementPlugin(),
		new VueLoaderPlugin(),
		new DotenvFlowPlugin({
			path: './src'
		}),
		new HTMLWebpackPlugin({
			showErrors: true,
			cache: false,
			template: join(__dirname, 'src', 'index.html'),
			inject: true
		}),

	]
};