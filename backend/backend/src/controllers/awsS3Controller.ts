import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { s3Client
    ,listBuckets
    ,listObjects
    ,hasSubfolder
    ,createSubfolder
    ,uploadFile
    ,listUserFiles
 } 
    from "../services/awsS3Service";

// 扩展Request类型以包含file属性
interface FileRequest extends Request {
    file?: Express.Multer.File;
}


export async function listBucketsController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const buckets = await listObjects();
        res.status(200).json(buckets);
    } catch (error) {
        next(error);
    }
}


export async function uploadFileController(req: FileRequest, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username } = req.body;
        const file = req.file;

        // 检查是否有必要的参数
        if (!username || !file) {
            res.status(400).json({ error: "用户名和文件都是必需的" });
            return;
        }

        // 检查用户文件夹是否存在
        const exists = await hasSubfolder(`${username}/`);

        // 如果文件夹不存在，先创建
        if (!exists) {
            await createSubfolder(`${username}/`);
        }

        // 上传文件到用户文件夹
        await uploadFile(`${username}/`, file.originalname, file.buffer);

        res.status(200).json({ message: "文件上传成功" });
    } catch (error) {
        next(error);
    }
}

// 获取用户文件列表
export async function getUserFilesController(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { username } = req.params;

        if (!username) {
            res.status(400).json({ error: "用户名是必需的" });
            return;
        }

        const files = await listUserFiles(username);
        res.status(200).json({
            message: "获取文件列表成功",
            files: files
        });
    } catch (error) {
        next(error);
    }
}