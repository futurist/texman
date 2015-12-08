var path = require('path');

module.exports = {
    entry: './script/app.js',
    output: {
        path: __dirname,
        filename: 'app.js'
    },
    module: {
        loaders: [
            { 
                test: path.join(__dirname, 'script'),
                // include:[ path.join(__dirname, 'script') ],
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query:{
                    cacheDirectory:true,
                    presets: ['es2015'],
                    // plugins: ['transform-runtime']
                }
            }
        ]
    }
}

