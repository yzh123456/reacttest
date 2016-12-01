/**
 * webpack 支持 amd cmd commonjs 三种代码书写规范
 * 
 * webpack -w -d 监听文件变化后自动编译 且 不压缩
 * 
 * webpack -p 编译时压缩文件
 * 
 * */

var path = require("path");
var webpack = require("webpack");
//指定编译源码目录地址
var staticRoot = path.resolve(__dirname, "./src");
//指定编译后输出目录
var outputPath = path.resolve(__dirname, "./output");

module.exports = {
	//开启控制台调试  在控制台能看到源码
	devtool : "source-map", 
    entry: {
        //入口文件
        // key 为输出时的名字
        // value 时本地物理文件
        // react 基础
        bookingList : staticRoot + '/bookingList/js/app.js' //需要打包的文件
       
    },
    output: {
        path: outputPath, //输出目录
        publicPath: staticRoot,        //引用目录  本地物理路径
        filename: '[name].build.js',   //输出名称
        sourceMapFilename: '[file].map'  //Source Map
    },
    module: {
        loaders: [
            {
                test: /\.js[x]?$/,        //检测以什么结尾的文件
                exclude: /node_modules/,  //排除某文件夹
                loader: ['babel'],        //使用什么模块来编译
                //配置
                query: {
                    presets: [
                        "es2015",
                        "react",
                        "stage-2"
                    ],
                    plugins: [
                        'transform-runtime',
                        'transform-es2015-classes'
                    ]
                }
            }
        ]
    },
    //配合模块使用
    resolve: {
        //注意：配置的路径必须是绝对路径
        //模块之间依赖
        //在什么目录下去寻找依赖文件
        root: [ staticRoot ],
        //配置别名
        alias: [],
        //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.jsx'],
    },
    plugins: [
        //提前加载模块
        //在使用中可以不在使用 var xxx = require("xxxx");
        new webpack.ProvidePlugin({
            'React': 'react',
            'ReactDOM': 'react-dom',
        })
    ]
};