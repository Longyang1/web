const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  // assetsDir: 'static',
  configureWebpack: config => {
    config.resolve.alias['vue$'] = 'vue/dist/vue.esm.js';
    if (process.env.NODE_ENV === 'production') {
      // 生产环境
      config.plugins.push(
          new CompressionWebpackPlugin({
              filename: '[path].gz[query]', // 提示示compression-webpack-plugin@3.0.0的话asset改为filename
              algorithm: 'gzip',
              test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
              threshold: 10240,
              minRatio: 0.8
          })
      );
    } else {
      // 开发环境

    }
  },
  chainWebpack: config => {
    // 移除 prefetch 插件
    config.plugins.delete('prefetch');
  },
  parallel: require('os').cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  devServer: {
    // 设置代理
    hot: true, //热加载
    host: '0.0.0.0', //ip地址
    port: 8080, //端口
    https: false, //false关闭https，true为开启
    open: true, //自动打开浏览器
    proxy: {
      '/api': {
        //本地
        // target: 'http://192.168.1.116:7000/', //设置你调用的接口域名和端口号 别忘了加http
        target: 'http://localhost:7000/', //设置你调用的接口域名和端口号 别忘了加http
        // 如果要代理 websockets
        // ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      }
    }
  }
}
