import json
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime

# --- 1. 读取 JSON 文件 ---
with open('data/employee.json', 'r', encoding='utf-8') as f:
    employees = json.load(f)

# --- 2. 转换字段类型 ---
for emp in employees:
    # userId 转 ObjectId
    if 'userId' in emp and emp['userId']:
        emp['userId'] = ObjectId(emp['userId'])
    # dob 转 datetime
    if 'dob' in emp:
        emp['dob'] = datetime.fromisoformat(emp['dob'])
    # visa 内的日期
    visa = emp.get('visa', {})
    for date_key in ('startDate', 'endDate'):
        if date_key in visa and visa[date_key]:
            visa[date_key] = datetime.fromisoformat(visa[date_key])
    # createdAt/updatedAt 转 datetime
    for tkey in ('createdAt', 'updatedAt'):
        if tkey in emp and emp[tkey]:
            # 把末尾的 Z 换成 +00:00，兼容 fromisoformat
            iso = emp[tkey].replace('Z', '+00:00')
            emp[tkey] = datetime.fromisoformat(iso)

# --- 3. 连接 MongoDB 并插入 ---
client = MongoClient("")
db = client["EmployeeDatabase"]           # ← 替换为你的数据库名
collection = db["EmployeeCollection"]

result = collection.insert_many(employees)
print(f"Inserted document IDs: {result.inserted_ids}")