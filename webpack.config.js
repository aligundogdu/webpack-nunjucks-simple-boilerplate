const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtraWatchWebpackPlugin = require('extra-watch-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NunjucksWebpackPlugin = require('nunjucks-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');
const nunjuckspages = require('./src/lib/nunjucks');

module.exports = env => {
    const devMode = !env || !env.production;
    return {
        mode: devMode ? 'development' : 'production',
        entry: {
            main: './src/main.js',
            vendor: './src/lib/vendor.js'
        },
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'assets/js/[name].js',
            library: 'MainModule',
        },
        module: {
            rules: [
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            '@babel/preset-env'
                        ]
                    }
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 8192
                            }
                        }
                    ]
                },
                {
                    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [{
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }]
                }
            ]
        },
        stats: {
            colors: true
        },
        devtool: 'source-map',
        plugins: [
            new NunjucksWebpackPlugin({
                templates: nunjuckspages
            }),
            new MiniCssExtractPlugin({
                filename: 'assets/css/[name].css'
            }),
            new BrowserSyncPlugin({
                host: 'localhost',
                port: 3000,
                server: {baseDir: ['dist']}
            }),
            new ExtraWatchWebpackPlugin({
                dirs: ['templates']
            }),
            new CopyWebpackPlugin([
                // copyUmodified is true because of https://github.com/webpack-contrib/copy-webpack-plugin/pull/360
                {from: 'assets/**/*', to: '.'}
            ], {copyUnmodified: true}),
            new CleanWebpackPlugin()
        ],
        optimization: {
            minimizer: [
                new UglifyJsPlugin({
                    sourceMap: true,
                    parallel: true
                }),
                new OptimizeCSSAssetsPlugin({
                    cssProcessorOptions: {
                        map: {
                            inline: false
                        }
                    }
                })
            ]
        }
    };

}
