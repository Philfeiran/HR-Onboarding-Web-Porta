import dotenv from "dotenv";
import path from "path";

//改成使用其他包来验证环境变量

// 根据NODE_ENV加载对应的环境配置文件
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env.development';

dotenv.config({ path: path.join(process.cwd(), 'config', envFile) });

export const config = {
  port: process.env.PORT,


  //Database
  dbConnectionString: process.env.MONGODB_URI,
  dbUserCollectionName: process.env.USER_COLLECTION_NAME,
  dbUserDatabaseName: process.env.USER_DATABASE_NAME,


  employeeCollectionName: process.env.EMPLOYEE_COLLECTION_NAME,
  employeeDatabaseName: process.env.EMPLOYEE_DATABASE_NAME,


  registrationCollectionName: process.env.EMPLOYEE_registration_COLLECTION_NAME,

  // Housing
  housingCollectionName: process.env.HOUSING_COLLECTION_NAME,
  housingDatabaseName: process.env.HOUSING_DATABASE_NAME,
  facilityReportsCollectionName: process.env.FACILITY_REPORTS_COLLECTION_NAME,


  //JWT token
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRES_IN,

  //Password
  passwordSaltRounds: process.env.BCRYPT_SALT_ROUNDS,


  //EmailJS
  emailjsServiceId: process.env.EMAILJS_SERVICE_ID,
  emailjsTemplateId: process.env.EMAILJS_TEMPLATE_ID,
  emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY,
  emailjsPrivateKey: process.env.EMAILJS_PRIVATE_KEY,

  //Frontend URL
  frontendUrl: process.env.FRONTEND_URL,


  //AWS_SERVICE
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_REGION,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,

  // awsBucketUrl: process.env.AWS_BUCKET_URL,
  // awsBucketRegion: process.env.AWS_BUCKET_REGION,
};

// 验证必需的配置
if (!config.dbConnectionString) {
  throw new Error('MONGODB_URI environment variable is not set');
}

if (!config.dbUserCollectionName) {
  throw new Error('USER_COLLECTION_NAME environment variable is not set');
}

if (!config.dbUserDatabaseName) {
  throw new Error('USER_DATABASE_NAME environment variable is not set');
}

if (!config.jwtSecret) {
  throw new Error('JWT_SECRET environment variable is not set');
}

if (!config.jwtExpiration) {
  throw new Error('JWT_EXPIRATION_IN environment variable is not set');
}

if (!config.passwordSaltRounds) {
  throw new Error('BCRYPT_SALT_ROUNDS environment variable is not set');
}

// 验证员工相关配置
if (!config.employeeCollectionName) {
  throw new Error('EMPLOYEE_COLLECTION_NAME environment variable is not set');
}

if (!config.employeeDatabaseName) {
  throw new Error('EMPLOYEE_DATABASE_NAME environment variable is not set');
}

// 验证 AWS 相关配置
if (!config.awsAccessKeyId) {
  throw new Error('AWS_ACCESS_KEY_ID environment variable is not set');
}

if (!config.awsSecretAccessKey) {
  throw new Error('AWS_SECRET_ACCESS_KEY environment variable is not set');
}

if (!config.awsRegion) {
  throw new Error('AWS_REGION environment variable is not set');
}

if (!config.AWS_BUCKET_NAME) {
  throw new Error('AWS_BUCKET_NAME environment variable is not set');
}