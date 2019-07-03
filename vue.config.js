const PATH = require('path')

module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                '/': PATH.resolve(__dirname),
                src: PATH.resolve(__dirname, 'src'),
                views: PATH.resolve(__dirname, 'views'),
                pages: PATH.resolve('views', 'pages'),
                layouts: PATH.resolve('views', 'layouts'),
                components: PATH.resolve(__dirname, 'components'),
            },
        },
    },
    pluginOptions: {},
}
