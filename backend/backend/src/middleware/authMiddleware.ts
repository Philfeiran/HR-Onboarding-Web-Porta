import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import HttpStatusCodes from '../common/constants/HttpStatusCodes';

// 扩展 Request 类型以包含用户信息
declare global {
    namespace Express {
        interface Request {
            user?: {
                userName: string;
                role: "HR" | "Employee";
            };
        }
    }
}

export class AuthMiddleware {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    // 鉴权中间件
    authenticate = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 从 cookie 中获取 token
            const token = req.cookies?.token;
            console.log("token",token);
            
            if (!token) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                    error: "Access denied",
                    message: "未提供身份验证令牌"
                });
            }

            // 验证 token
            const decoded = await this.authService.verifyToken(token);
            
            // 将用户信息添加到 request 对象
            req.user = decoded;
            
            next();
        } catch (error) {
            console.error('Auth middleware error:', error);
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: "Invalid token",
                message: "身份验证令牌无效或已过期"
            });
        }
    };

    // 角色验证中间件
    requireRole = (requiredRole: "HR" | "Employee") => {
        return (req: Request, res: Response, next: NextFunction) => {
            if (!req.user) {
                return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                    error: "Access denied",
                    message: "用户未认证"
                });
            }
            
            if (req.user.role !== requiredRole) {
                return res.status(HttpStatusCodes.FORBIDDEN).json({
                    error: "Forbidden",
                    message: `需要${requiredRole}角色权限`
                });
            }

            next();
        };
    };

    // HR 权限验证中间件
    requireHR = (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: "Access denied",
                message: "用户未认证"
            });
        }

        if (req.user.role !== "HR") {
            return res.status(HttpStatusCodes.FORBIDDEN).json({
                error: "Forbidden",
                message: "需要HR权限"
            });
        }

        next();
    };

    // Employee 权限验证中间件
    requireEmployee = (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(HttpStatusCodes.UNAUTHORIZED).json({
                error: "Access denied",
                message: "用户未认证"
            });
        }

        if (req.user.role !== "Employee") {
            return res.status(HttpStatusCodes.FORBIDDEN).json({
                error: "Forbidden",
                message: "需要Employee权限"
            });
        }

        next();
    };
}

// 创建中间件实例
const authMiddleware = new AuthMiddleware();

// 导出中间件函数
export const authenticate = authMiddleware.authenticate;
export const requireRole = authMiddleware.requireRole;
export const requireHR = authMiddleware.requireHR; 