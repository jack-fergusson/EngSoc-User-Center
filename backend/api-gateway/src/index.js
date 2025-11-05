import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();
app.use(cors());

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
// Add more services as you build them

const PORT = 4000;
app.listen(PORT, () => console.log(`API Gateway running on ${PORT}`));
