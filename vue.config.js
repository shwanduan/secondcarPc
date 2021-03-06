module.exports = {
  devServer: {
    port: 8080 // 端口号配置
  },
  configureWebpack: {
    externals: {
      'AMap': 'AMap' // 高德地图配置
    },
  },
  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/css/global.scss";'
      }
    }
  }
}
