const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    proxy({
      // target: 'http://172.10.18.179:80',
      target: 'http://172.10.18.171:80',
      changeOrigin: true,
    })
  );
};