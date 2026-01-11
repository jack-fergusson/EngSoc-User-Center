const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(
  "/authentication",
  createProxyMiddleware({
    target: "http://authentication-service:3001",
    changeOrigin: true,
  })
);

app.use(
  "/auth",
  createProxyMiddleware({
    target: "http://auth-service:4001",
    changeOrigin: true,
  })
);

app.use(
  "/event",
  createProxyMiddleware({
    target: "http://event-service:4002",
    changeOrigin: true,
  })
);

const PORT = 4000;
app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));
