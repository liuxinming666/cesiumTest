const CopyWebpackPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

module.exports = {
    // 基本路径
    publicPath: "./",
    // 输出文件目录
    outputDir: "dist",
    // eslint-loader 是否在保存的时候检查
    lintOnSave: false,
    devServer: {
        open: process.platform === "darwin",
        host: "0.0.0.0",
        port: 8080,
        https: false,
        hotOnly: false,
        proxy:{
            "/Access":{
                //target:"http://localhost:8081",
                target:"http://192.168.1.88:8119/",
                changeOrigin: true
            },
            "/Home":{
                target:"http://192.168.1.88:8119",
                changeOrigin: true
            },
            "/login":{
                target:"http://localhost:11111",
                changeOrigin: true
            },
            "/api":{
                target:"http://localhost:11111",
                changeOrigin: true
            }
        }
    },
    configureWebpack: {
        output: {
            sourcePrefix: ' '
        },
        amd: {
            toUrlUndefined: true
        },
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.esm.js',
                '@': path.resolve('src')
            }
        },
        plugins: [
        ],
        module: {
            unknownContextCritical: /^.\/.*$/,
            unknownContextCritical: false
        }
    }
};
