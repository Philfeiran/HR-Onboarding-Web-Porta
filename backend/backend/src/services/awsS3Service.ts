import { S3Client, 
    ListBucketsCommand, 
    ListObjectsV2Command, 
    GetObjectCommand, 
    PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config/loadConfig";


//Create S3 instance
export const s3Client = new S3Client({
    region: config.awsRegion as string,              
    credentials: {
      accessKeyId: config.awsAccessKeyId as string,      
      secretAccessKey: config.awsSecretAccessKey as string,
    }
});


export async function listBuckets() {
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);
    console.log("Buckets:", response.Buckets);
    return response.Buckets;
}


export async function listObjects() {
    const command = new ListObjectsV2Command({ Bucket: config.AWS_BUCKET_NAME as string });
    const response = await s3Client.send(command);
    console.log(`Objects in ${config.AWS_BUCKET_NAME as string}:`, response.Contents);
    return response.Contents;
}


//检查sub folder是否存在
export async function hasSubfolder(prefix: string): Promise<boolean> {
    const command = new ListObjectsV2Command({ Bucket: config.AWS_BUCKET_NAME as string, Prefix: prefix, MaxKeys: 1 });
    const res = await s3Client.send(command);
    // 如果 Contents 数组非空，则表示至少有一个对象以该前缀开头（文件夹已“存在”） [oai_citation:4‡Stack Overflow](https://stackoverflow.com/questions/52757849/check-if-a-folder-exists-on-s3-using-node-js-aws-sdk?utm_source=chatgpt.com)
    return !!(res.Contents && res.Contents.length > 0);
}




//创建子文件夹
export async function createSubfolder(prefix: string): Promise<void> {
    // 上传一个 Size = 0、Key='prefix/' 的空对象以创建“文件夹” 
    const cmd = new PutObjectCommand({ Bucket: config.AWS_BUCKET_NAME as string, Key: prefix, Body: "" });
    await s3Client.send(cmd);
}

//上传文件
export async function uploadFile(
    prefix: string,
    fileName: string,
    body: Buffer | Uint8Array | Blob | string
  ): Promise<void> {
    const key = `${prefix}${fileName}`;
    const cmd = new PutObjectCommand({ Bucket: config.AWS_BUCKET_NAME as string, Key: key, Body: body });
    // 执行上传，将文件放到 subfolder/fileName [oai_citation:6‡AWS 文档](https://docs.aws.amazon.com/goto/SdkForJavaScriptV3/s3-2006-03-01/PutObject?utm_source=chatgpt.com)
    await s3Client.send(cmd);
  }


  
// 6. 下载（Get）对象
export async function getObject(bucketName: string, key: string) {
const command = new GetObjectCommand({ Bucket: bucketName, Key: key });
const response = await s3Client.send(command);

// 将 response.Body （Node.js: ReadableStream）转为字符串示例
const streamToString = async (stream: any) => {
    const chunks: Uint8Array[] = [];
    for await (let chunk of stream) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
    }
    return Buffer.concat(chunks).toString("utf-8");
};

const bodyContents = await streamToString(response.Body);
console.log("File content:", bodyContents);
return bodyContents;
}
  
// 7. 上传（Put）对象
export async function putObject(bucketName: string, key: string, body: string | Uint8Array) {
const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: "text/plain"
});
const response = await s3Client.send(command);
console.log(`Uploaded ${key} to ${bucketName}`, response);
return response;
}


export async function getFileUrl(key: string): Promise<string> {
    // ResponseContentDisposition: 'inline' 可以让浏览器尝试内嵌显示
    const cmd = new GetObjectCommand({
      Bucket: config.AWS_BUCKET_NAME!,
      Key: key,
      ResponseContentDisposition: "inline"
    });
    // expiresIn 单位是秒，这里设置 URL 在一小时内有效
    const url = await getSignedUrl(s3Client, cmd, { expiresIn: 3600 });
    return url;
  }

// 根据用户名获取文件夹下所有文件
export async function listUserFiles(username: string): Promise<any[]> {
    const prefix = `${username}/`;
    const command = new ListObjectsV2Command({ 
        Bucket: config.AWS_BUCKET_NAME as string, 
        Prefix: prefix 
    });
    const response = await s3Client.send(command);
    console.log(response.Contents);

    const all = response.Contents?.filter(item =>
        item.Key && !item.Key.endsWith("/")
      ) || [];

      if (!response.Contents || response.Contents.length === 0) {
        return [];
    }


    const filesWithUrl = await Promise.all(all.map(async (item) => {
        const url = await getFileUrl(item.Key!);
        return {
            ...item,
            url
        };
    }));

    console.log(filesWithUrl);
    
    return filesWithUrl;



    
}