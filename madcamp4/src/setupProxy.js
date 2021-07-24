const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://192.249.18.171:80',
      changeOrigin: true,
    })
  );
};