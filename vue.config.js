module.exports = {
    lintOnSave: false,
    devServer: {
        // true 则热更新，false 则手动刷新，默认值为 true
        // inline: true,
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