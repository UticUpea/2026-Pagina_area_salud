const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  configureWebpack: {
    resolve: {
      fallback: {
        "crypto": false
      }
    }
  },

  // ✅ Headers para desarrollo local (npm run serve)
  devServer: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    },
    // 🚫 SIN proxy configuration
  }
})