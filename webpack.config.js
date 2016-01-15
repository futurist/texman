var path = require('path');

module.exports = {
    entry: {
        app: './script/app.js',
        formlist: './script/formlist.js',
        // m_j2c: './script/m_j2c.js',
    },
    output: {
        path: __dirname,
        filename: '[name].js'
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

