const createProxyMiddleware = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://172.10.18.179:80",
      changeOrigin: true,
      pathRewrite: {
        "^/api": ""
      },
    })
  );
};