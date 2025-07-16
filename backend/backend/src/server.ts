// src/app.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRouter";
import employeeRoutes from "./routes/employeeRouter";
import registrationRoutes from "./routes/registrationRoutes";
import uploadRouter from "./routes/uploadRouter";
// import { connectDB } from './db/dbService';
import { config } from "./config/loadConfig";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 请求日志中间件
// app.use((req, res, next) => {
//   const timestamp = new Date().toISOString();
//   const method = req.method;
//   const url = req.originalUrl;
//   const userAgent = req.get('User-Agent') || 'Unknown';

//   console.log(`[${timestamp}] ${method} ${url} - ${userAgent}`);

//   // 记录响应完成时间
//   const start = Date.now();
//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     console.log(`[${timestamp}] ${method} ${url} - ${res.statusCode} - ${duration}ms`);
//   });

//   next();
// });

app.use(
  cors({
    origin: "http://localhost:5173", // 只能列出确切的域名
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);

app.use("/api/registration", registrationRoutes);
app.use("/api/upload", uploadRouter);

// 错误处理中间件
app.use((err: any, req: any, res: any, next: any) => {
  res.status(400).json({ message: err.message });
});

if (require.main === module) {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${config.port}`);
  });
}

export default app;
