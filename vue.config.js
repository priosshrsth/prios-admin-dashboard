const PATH = require('path')

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '@': PATH.resolve(__dirname),
                src: PATH.resolve(__dirname, 'src'),
                views: PATH.resolve(__dirname, 'views'),
                pages: PATH.resolve(__dirname, 'views'),
                layouts: PATH.resolve(__dirname, 'views'),
                components: PATH.resolve(__dirname, 'components')
            }
        }
    },
    pluginOptions: {}
}
