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

  devServer: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self' * 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: *; style-src 'self' 'unsafe-inline' *; img-src 'self' data: https: blob: *; font-src 'self' data: https: *; connect-src 'self' ws: wss: https://apiadministrador.upea.bo https://api.upea.bo https://www.youtube.com https://i.ytimg.com https://*.googleapis.com *; frame-src 'self' blob: https://www.youtube.com https://www.youtube-nocookie.com https://youtu.be https://player.vimeo.com https://vimeo.com https://drive.google.com *; media-src 'self' blob: https: *; worker-src 'self' blob: *; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
    },
  }
})