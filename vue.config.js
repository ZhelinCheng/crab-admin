/**
 * Created by ChengZheLin on 2019/8/10.
 * Features:
 */

'use strict'

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: ' https://www.easy-mock.com/mock/5d4e6f921be3176b8245512a',
        changeOrigin: true
      }
    }
  }
}
