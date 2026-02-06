# AWS 免費層部署指南

## 前置準備

### 1. 註冊 AWS 帳號
- 註冊 AWS 免費帳號（需信用卡驗證）
- 免費層有效期：12 個月

### 2. 修改 Strapi 資料庫配置

#### 安裝 PostgreSQL 驅動
```bash
cd backend-strapi
npm install pg --save
```

#### 修改資料庫配置
編輯 `backend-strapi/config/database.js`：

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'postgres'),
    connection: {
      host: env('DATABASE_HOST', 'localhost'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'strapi'),
      user: env('DATABASE_USERNAME', 'strapi'),
      password: env('DATABASE_PASSWORD', ''),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
      },
    },
    debug: false,
  },
});
```

### 3. 設定環境變數

#### 本地測試 `.env`
```env
# Server
HOST=0.0.0.0
PORT=1337

# Database (PostgreSQL)
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your_password

# Admin JWT
ADMIN_JWT_SECRET=your_random_secret_key

# API Token
API_TOKEN_SALT=your_random_salt

# App Keys
APP_KEYS=key1,key2,key3,key4
JWT_SECRET=your_jwt_secret
```

---

## AWS 部署步驟

### 階段 1：後端部署（EC2 + RDS）

#### 1.1 建立 RDS PostgreSQL 資料庫

1. 登入 AWS Console → RDS
2. 建立資料庫：
   - 引擎：PostgreSQL 15
   - 範本：**免費方案**
   - 執行個體：**db.t3.micro**（或 db.t2.micro）
   - 儲存空間：20GB
   - 公開存取：是（部署期間）
3. 記錄連線資訊：
   - 端點（Endpoint）
   - 連接埠：5432
   - 資料庫名稱
   - 使用者名稱
   - 密碼

#### 1.2 建立 EC2 執行個體

1. 登入 AWS Console → EC2
2. 啟動執行個體：
   - AMI：**Ubuntu 22.04 LTS**
   - 執行個體類型：**t2.micro**（免費層）
   - 安全群組設定：
     - SSH (22)：您的 IP
     - HTTP (80)：0.0.0.0/0
     - HTTPS (443)：0.0.0.0/0
     - Custom TCP (1337)：0.0.0.0/0（Strapi API）
3. 建立或選擇金鑰對（.pem 檔案）

#### 1.3 連線到 EC2 並安裝環境

```bash
# 連線到 EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# 更新系統
sudo apt update && sudo apt upgrade -y

# 安裝 Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 安裝 PM2（進程管理器）
sudo npm install -g pm2

# 安裝 PostgreSQL 客戶端
sudo apt install -y postgresql-client

# 驗證版本
node -v  # v20.x.x
npm -v   # 10.x.x
```

#### 1.4 上傳 Strapi 程式碼

**方法 1：使用 Git**
```bash
# 在 EC2 上
cd /home/ubuntu
git clone https://github.com/your-repo/your-project.git
cd your-project/backend-strapi
npm install --production
```

**方法 2：使用 SCP**
```bash
# 在本機
scp -i your-key.pem -r backend-strapi ubuntu@your-ec2-ip:/home/ubuntu/
```

#### 1.5 設定環境變數

```bash
# 在 EC2 上
cd /home/ubuntu/backend-strapi
nano .env
```

填入 RDS 連線資訊：
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_token_salt
ADMIN_JWT_SECRET=your_admin_secret
JWT_SECRET=your_jwt_secret

# RDS PostgreSQL
DATABASE_CLIENT=postgres
DATABASE_HOST=your-rds-endpoint.rds.amazonaws.com
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your_rds_password
DATABASE_SSL=false

NODE_ENV=production
```

#### 1.6 初始化資料庫並啟動

```bash
# 建立 Strapi
npm run build

# 使用 PM2 啟動
pm2 start npm --name "strapi" -- start
pm2 save
pm2 startup

# 查看日誌
pm2 logs strapi
```

#### 1.7 測試 API
```bash
curl http://your-ec2-ip:1337/api
```

---

### 階段 2：前端部署（S3 + CloudFront）

#### 2.1 修改前端 API 端點

編輯 `vite.config.ts`：
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://your-ec2-ip:1337',  // 改為 EC2 IP
        changeOrigin: true,
      },
    },
  },
  // 生產環境 API 設定
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify('http://your-ec2-ip:1337'),
  },
});
```

或使用環境變數：
```bash
# .env.production
VITE_API_URL=http://your-ec2-ip:1337
```

#### 2.2 建置前端

```bash
# 在本機
npm run build
# 產生 dist/ 資料夾
```

#### 2.3 建立 S3 Bucket

1. 登入 AWS Console → S3
2. 建立儲存貯體：
   - 名稱：`your-website-name`
   - 區域：選擇最近的區域
   - 取消勾選「封鎖所有公開存取」
3. 上傳 `dist/` 資料夾內容到 S3

#### 2.4 設定靜態網站託管

1. S3 Bucket → 屬性 → 靜態網站託管
2. 啟用靜態網站託管
3. 索引文件：`index.html`
4. 錯誤文件：`index.html`（SPA 必須）

#### 2.5 設定 Bucket 政策

Bucket → 許可 → Bucket 政策：
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-website-name/*"
    }
  ]
}
```

#### 2.6 建立 CloudFront 分發（可選，加速訪問）

1. CloudFront → 建立分發
2. 來源：選擇 S3 Bucket
3. 預設根物件：`index.html`
4. 錯誤頁面設定：
   - 404 → `/index.html` (200)
   - 403 → `/index.html` (200)

---

### 階段 3：設定 S3 媒體上傳（Strapi）

#### 3.1 安裝 Strapi AWS S3 插件

```bash
cd backend-strapi
npm install @strapi/provider-upload-aws-s3
```

#### 3.2 建立 S3 Bucket（媒體檔案）

1. S3 → 建立儲存貯體：`your-media-bucket`
2. 設定 CORS：
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"]
  }
]
```

#### 3.3 建立 IAM 使用者

1. IAM → 使用者 → 建立使用者
2. 附加政策：`AmazonS3FullAccess`
3. 建立存取金鑰（Access Key）

#### 3.4 設定 Strapi 上傳配置

編輯 `backend-strapi/config/plugins.js`：
```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: env('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env('AWS_ACCESS_SECRET'),
        region: env('AWS_REGION'),
        params: {
          Bucket: env('AWS_BUCKET_NAME'),
        },
      },
    },
  },
});
```

`.env` 添加：
```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_ACCESS_SECRET=your_secret_key
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-media-bucket
```

---

## 成本預估

### AWS 免費層（12 個月）
- EC2 t2.micro：750 小時/月（**免費**）
- RDS db.t2.micro：750 小時/月（**免費**）
- S3：5GB 儲存 + 20,000 GET + 2,000 PUT（**免費**）
- CloudFront：50GB 資料傳輸（**免費**）

### 超過免費層後（估計）
- EC2 t2.micro：~$8-10/月
- RDS db.t2.micro：~$15/月
- S3：~$0.5/月（100GB）
- 總計：~$25-30/月

---

## 替代方案比較

| 平台 | 優點 | 缺點 | 成本 |
|------|------|------|------|
| **AWS** | 完整服務、12個月免費 | 配置複雜 | $0（12個月）→ $25/月 |
| **GCP** | e2-micro 永久免費 | Cloud SQL 付費 | ~$15/月 |
| **Railway** | 自動部署、簡單 | 額度有限 | $5 免費額度/月 |
| **Render** | 完全免費方案 | 性能限制、冷啟動 | $0 |
| **Vercel** | 前端免費、快速 | 後端需付費 | 前端 $0 |

---

## 推薦順序

1. **新手推薦**：Railway（最簡單）
2. **長期免費**：GCP e2-micro（永久免費）
3. **完整功能**：AWS（12 個月免費，功能最完整）
4. **極低預算**：Render 免費層 + Vercel

---

## 需要協助？

我可以幫您：
1. 生成完整的部署腳本
2. 建立 CI/CD 自動部署
3. 設定域名和 SSL 憑證
4. 優化效能和成本
