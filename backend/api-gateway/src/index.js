const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const cors = require("cors");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  "/authentication",
  createProxyMiddleware({
    target: "http://authentication-service:3001",
    changeOrigin: true,
    on: {
      proxyRes: (proxyRes, req, res) => {
        // Set the Access-Control-Allow-Origin header on the proxy response
        // to the origin of the client's request to allow specific origins

        // const clientOrigin = req.headers.origin;
        const clientOrigin = "http://localhost:3000";
        if (clientOrigin) {
          res.header("Access-Control-Allow-Origin", clientOrigin);
        }
        res.header("Access-Control-Allow-Credentials", "true"); // Optional: for handling credentials
      },
    },
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
