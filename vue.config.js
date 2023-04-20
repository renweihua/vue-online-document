module.exports = {
    lintOnSave: false,
    devServer: {
        proxy:{
            '/api': {
                target: "http://laravel-online-document.local.com:8090/api/",
                // target: "http://localhost:1000",
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                  '^/api': '/', // rewrite path
                },
            },
        }
    },
}