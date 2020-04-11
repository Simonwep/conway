const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {WasmPackPlugin} = require('./config/WasmPackPlugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WorkerPlugin = require('worker-plugin');
const webpack = require('webpack');
const pkg = require('./package');
const path = require('path');

const dist = path.resolve(__dirname, 'dist');
const crate = path.resolve(__dirname, 'crate');
const src = path.resolve(__dirname, 'src');
const app = path.resolve(src, 'app');

module.exports = {
    mode: 'production',
    entry: './src/index.tsx',
    devtool: 'source-map',

    output: {
        path: dist,
        filename: 'js/[contenthash:8].bundle.js',
        publicPath: '/'
    },

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss'],
        alias: {
            'react': 'preact/compat',
            'react-dom': 'preact/compat'
        }
    },

    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                enforce: 'pre',
                test: /\.s[ac]ss$/,
                use: [
                    {
                        loader: 'sass-loader',
                        options: {
                            prependData: '@import "src/styles/_global.scss";'
                        }
                    }
                ]
            },
            {
                test: /\.module\.(scss|sass|css)$/,
                include: app,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: '[hash:base64:5]'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.(scss|sass|css)$/,
                exclude: app,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(js|ts|tsx)$/,
                include: src,
                use: [
                    'ts-loader'
                ]
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                sourceMap: true,
                terserOptions: {
                    mangle: true,
                    keep_classnames: true
                }
            }),

            new OptimizeCSSAssetsPlugin({})
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'env': {
                'NODE_ENV': JSON.stringify('production'),
                'VERSION': JSON.stringify(pkg.version)
            }
        }),

        // new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'public/index.html',
            inject: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            }
        }),

        new MiniCssExtractPlugin({
            filename: 'css/[name].[hash:6].css',
            chunkFilename: 'css/[name].[hash:6].css'
        }),

        new WasmPackPlugin({
            crate: crate,
            mode: 'production'
        }),

        new WorkerPlugin({
            globalObject: 'self'
        }),

        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true
        }),

        new CopyPlugin([{
            context: 'src',
            from: 'assets'
        }]),

        new CleanWebpackPlugin(),
        // new BundleAnalyzerPlugin()
    ]
};
