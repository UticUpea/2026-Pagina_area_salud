const { defineConfig } = require('@vue/cli-service')
// const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      fallback: {
        "crypto": false
      }
    }
  }
})