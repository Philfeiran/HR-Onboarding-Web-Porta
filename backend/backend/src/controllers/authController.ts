import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { RegistrationModel } from "../models/registration.model";
import { RegistrationTokenStatus } from "../types/registration.types";
import { UserModel } from "../models/user.model";

export class AuthController {
  private authService: AuthService;
  private registrationModel: RegistrationModel;
  private userModel: UserModel;

  constructor(){
      this.authService = new AuthService();
      this.registrationModel = new RegistrationModel();
      this.userModel = new UserModel();
  }

  async checkEmailExists(req: Request, res: Response, next: NextFunction) {
      try {
          const { email } = req.body;
          
          if (!email) {
              return res.status(400).json({
                  error: "Missing email",
                  message: "邮箱为必填项"
              });
          }

          const emailExists = await this.userModel.checkEmailExists(email);
          
          res.status(200).json({
              exists: emailExists,
              message: emailExists ? "邮箱已存在" : "邮箱可用"
          });
      } catch (error) {
          console.error('Check email error:', error);
          res.status(500).json({
              error: "Internal server error",
              message: "服务器内部错误"
          });
      }
  }

  async checkUsernameExists(req: Request, res: Response, next: NextFunction) {
      try {
          const { userName } = req.body;
          
          if (!userName) {
              return res.status(400).json({
                  error: "Missing userName",
                  message: "用户名为必填项"
              });
          }

          const usernameExists = await this.userModel.checkUsernameExists(userName);
          
          res.status(200).json({
              exists: usernameExists,
              message: usernameExists ? "用户名已存在" : "用户名可用"
          });
      } catch (error) {
          console.error('Check username error:', error);
          res.status(500).json({
              error: "Internal server error",
              message: "服务器内部错误"
          });
      }
  }

  // 改成 前端同时还发送token，然后后端验证token是否有效，如果有效，则注册用户，设置token 为已使用，如果无效，则返回错误
  async registerUser(req:Request,res:Response,next:NextFunction){
      try{
          console.log(req.body);
          const {userName,email,password,url_token} = req.body;
          if (!userName || !email || !password||!url_token) {
              return res.status(400).json({
                  error: "Missing required fields",
                  message: "请提供用户名、邮箱、密码和角色"
              });
          }

          const tokenStatus:RegistrationTokenStatus = await this.registrationModel.verifyRegistration(url_token);
          if (tokenStatus === RegistrationTokenStatus.UNEXIST){
              return res.status(400).json({
                  error: "Invalid token",
                  message: "无效的token"
              });
          }else if (tokenStatus === RegistrationTokenStatus.ALREADY_USED){
              return res.status(400).json({
                  error: "Token already used",
                  message: "token已使用"
              });
          }else if (tokenStatus === RegistrationTokenStatus.EXPIRED){ 
              return res.status(400).json({
                  error: "Token expired",
                  message: "token已过期"
              });
          }
          
          // const tokenStatus = await registrationModel.verifyRegistration(url_token);
          const {user,token} = await this.authService.registerUser(userName,email,password,"Employee");

          //这里有必要catch么？
          await this.registrationModel.setRegistrationStatus(url_token);

          

          // console.log(user,token);
          res.status(201).json({user,token});
      }catch(error){
          // 处理具体的错误类型
          if(error instanceof Error){
              if(error.message === "User already exists"){
                  return res.status(409).json({
                      error: "User already exists",
                      message: "用户名或邮箱已被注册"
                  });
              }
          }
          
          // 数据库连接错误或其他服务器错误
          console.error('Registration error:', error);
          res.status(500).json({
              error: "Internal server error",
              message: "服务器内部错误"
          });
      }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, token } = await this.authService.loginUser(email, password);
      // console.log(user,token);
      res.cookie("token", token, {
        httpOnly: true,
        // ,secure:true
        maxAge: 3600000,
        sameSite: "lax",
      });

      res.status(200).json({ role: user.role, userName: user.userName, email: user.email });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "User not found") {
          return res.status(404).json({
            error: "User not found",
            message: "用户不存在",
          });
        }

        if (error.message === "Invalid password") {
          return res.status(401).json({
            error: "Invalid credentials",
            message: "密码错误",
          });
        }
      }

      console.error("Login error:", error);
      res.status(500).json({
        error: "Internal server error",
        message: "服务器内部错误",
      });
    }
  }

  async logoutUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
      res.status(200).json({ message: "Logged out" });
      return;
    } catch (error) {
      next(error);
      return;
    }
  }
}
