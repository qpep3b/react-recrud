const path = require('path')

const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv')

const dotEnvFile = (env) => {
    if (env.production)
        return './.env.production'
    if (env.development)
        return './.env.development'
    return './.env'
}

module.exports = env => {
    const dotenvConfig = dotenv.config({path: dotEnvFile(env)})

    return {
        context: path.resolve(__dirname, 'src'),
        mode: env.development ? 'development' : 'production',
        entry: './App.tsx',
        output: {
            filename: '[name].[fullhash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        devServer: {
            port: 3000,
            hot: true,
            historyApiFallback: true,
        },
        plugins: [
            new HTMLWebpackPlugin({
                template: './index.html',
            }),
            new CleanWebpackPlugin(),
            new webpack.DefinePlugin({
                'process.env': JSON.stringify(dotenvConfig.parsed)
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.s[ac]ss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                        'sass-loader',
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                modules: true,
                            },
                        },
                    ]
                },
                {
                    test: /\.ttf$/,
                    use: ['file-loader']
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react',
                            ]
                        }
                    }
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                                '@babel/preset-react',
                            ]
                        }
                    }
                }
            ]
        },
    }
}
