import express from 'express';
import multer from 'multer';
import { listBucketsController, uploadFileController, getUserFilesController } from '../controllers/awsS3Controller';
import { authenticate, requireHR, requireRole } from '../middleware/authMiddleware';

const router = express.Router();

// 配置multer用于文件上传
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 列出所有桶
router.get('/buckets', listBucketsController);

// 上传文件
router.post('/upload', upload.single('file'), uploadFileController);

// 获取用户文件列表
router.get('/user/:username/files', getUserFilesController);

export default router; 