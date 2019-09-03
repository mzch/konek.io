const path = require('path');


const config = {
    entry: './public/js/emitter.js',
    output: {
        path: path.resolve(__dirname, 'public/js'),
        filename: 'bundle.js',
    },

    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: [ 
                    'style-loader', 
                    'css-loader', 
                    // 'less-loader'
                ],
            }
            
        ]
    },

};

module.exports = config;