import {MongoClient,Db,Collection,Document} from 'mongodb';
import { config } from '../config/loadConfig';

let client: MongoClient;

// export async function getDb(){
//     if(!client){
//         client = new MongoClient(config.dbConnectionString!);
//         await client.connect();
//     }
//     return client.db(config.dbUserDatabaseName);
// }

export async function getCollection<T extends Document>(
    dbName: string,
    collName: string
  ): Promise<Collection<T>> {
    
    // 第一次会创建 client 并 connect，之后复用同一个连接
    if (!client) {
      client = new MongoClient(config.dbConnectionString!);
      await client.connect();
    }
    const db = client.db(dbName);      // 根据传入的 dbName 选库
    return db.collection<T>(collName);
  }