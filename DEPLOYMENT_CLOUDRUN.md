# GCP Cloud Run 部署完整指南

## 🎯 為什麼選擇 Cloud Run？

✅ **完全無伺服器** - 不需要管理伺服器
✅ **按用量計費** - 沒流量就不收費
✅ **自動擴展** - 自動處理流量高峰
✅ **免費額度充足**：
- 每月 200 萬次請求
- 360,000 GB-秒記憶體
- 180,000 vCPU-秒
✅ **內建 HTTPS** - 自動 SSL 憑證
✅ **快速部署** - 幾分鐘即可上線

---

## 📦 部署架構

```
前端（React）     → Cloud Storage + Cloud CDN
       ↓
後端（Strapi）    → Cloud Run（容器化）
       ↓
資料庫           → Cloud SQL PostgreSQL（或 Supabase 免費版）
       ↓
媒體檔案         → Cloud Storage
```

---

## 🚀 部署步驟

### 第一階段：準備工作

#### 1. 註冊 GCP 帳號

1. 前往 https://cloud.google.com/
2. 註冊帳號（需信用卡，但有 $300 免費額度）
3. 建立新專案

#### 2. 安裝 Google Cloud SDK

**Windows**：
```bash
# 下載安裝器
https://cloud.google.com/sdk/docs/install

# 安裝後初始化
gcloud init
gcloud auth login
```

**Mac/Linux**：
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

#### 3. 選擇資料庫方案

**選項 A：使用 Supabase（推薦新手）**
- ✅ 完全免費
- ✅ 500MB 資料庫
- ✅ 自動備份
- ✅ 無需信用卡
- 前往 https://supabase.com/ 註冊

**選項 B：Cloud SQL**
- ⚠️ 最便宜方案約 $10/月
- ✅ 完全託管
- ✅ 自動備份
- ✅ 高可用性

---

### 第二階段：設定資料庫

#### 使用 Supabase（免費方案）

1. **建立 Supabase 專案**
   - 登入 https://supabase.com/
   - 建立新專案
   - 記錄連線資訊

2. **取得資料庫連線字串**
   - Settings → Database
   - Connection string (URI)
   - 範例：`postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres`

3. **安裝 PostgreSQL 驅動**
```bash
cd backend-strapi
npm install pg --save
```

4. **修改 Strapi 資料庫配置**

編輯 `backend-strapi/config/database.js`：
```javascript
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: {
        rejectUnauthorized: false
      }
    },
    pool: {
      min: 0,
      max: 10,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      idleTimeoutMillis: 30000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
    debug: false,
  },
});
```

#### 使用 Cloud SQL（付費方案）

1. **建立 Cloud SQL 執行個體**
```bash
gcloud sql instances create strapi-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=asia-east1
```

2. **建立資料庫**
```bash
gcloud sql databases create strapi \
  --instance=strapi-postgres
```

3. **設定 root 密碼**
```bash
gcloud sql users set-password root \
  --host=% \
  --instance=strapi-postgres \
  --password=your_secure_password
```

---

### 第三階段：部署後端到 Cloud Run

#### 1. 準備環境變數

建立 `.env.production`：
```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Database (Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# Secrets（請生成隨機字串）
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_random_salt
ADMIN_JWT_SECRET=your_admin_secret
JWT_SECRET=your_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_salt

# Cloud Storage（稍後設定）
GCS_BUCKET_NAME=your-media-bucket
GCS_PROJECT_ID=your-project-id
```

生成隨機密鑰：
```bash
# 在 backend-strapi 目錄
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 2. 本地測試 Docker

```bash
# 在專案根目錄
cd backend-strapi

# 建置映像
docker build -t strapi-test .

# 本地運行測試
docker run -p 1337:1337 --env-file .env.production strapi-test

# 測試 API
curl http://localhost:1337/api
```

#### 3. 部署到 Cloud Run

**方法 A：使用部署腳本**

1. 編輯 `deploy-cloudrun.sh`：
```bash
PROJECT_ID="your-gcp-project-id"  # 修改為您的專案 ID
```

2. 執行部署：
```bash
chmod +x deploy-cloudrun.sh
./deploy-cloudrun.sh
```

**方法 B：手動部署**

```bash
# 1. 設定專案
gcloud config set project your-project-id

# 2. 啟用 API
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# 3. 建置並推送映像
cd backend-strapi
gcloud builds submit --tag gcr.io/your-project-id/strapi-backend

# 4. 部署到 Cloud Run
gcloud run deploy strapi-backend \
  --image gcr.io/your-project-id/strapi-backend \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --port 1337 \
  --set-env-vars "NODE_ENV=production,HOST=0.0.0.0,PORT=1337"
```

#### 4. 設定環境變數（重要！）

```bash
# 一次設定所有環境變數
gcloud run services update strapi-backend \
  --region asia-east1 \
  --set-env-vars "DATABASE_URL=postgresql://..." \
  --set-env-vars "APP_KEYS=key1,key2,key3,key4" \
  --set-env-vars "API_TOKEN_SALT=your_salt" \
  --set-env-vars "ADMIN_JWT_SECRET=your_secret" \
  --set-env-vars "JWT_SECRET=your_jwt" \
  --set-env-vars "TRANSFER_TOKEN_SALT=your_transfer"
```

或使用 Cloud Console：
1. Cloud Run → 選擇服務 → 編輯並部署新修訂版本
2. 容器 → 環境變數 → 新增變數

#### 5. 獲取服務 URL

```bash
gcloud run services describe strapi-backend \
  --region asia-east1 \
  --format 'value(status.url)'
```

範例輸出：`https://strapi-backend-xxx-uc.a.run.app`

#### 6. 測試後端

```bash
curl https://strapi-backend-xxx.a.run.app/api
```

---

### 第四階段：設定媒體上傳（Cloud Storage）

#### 1. 建立 Storage Bucket

```bash
# 建立 Bucket
gsutil mb -l asia-east1 gs://your-media-bucket

# 設定公開讀取
gsutil iam ch allUsers:objectViewer gs://your-media-bucket

# 設定 CORS
echo '[
  {
    "origin": ["*"],
    "method": ["GET", "PUT", "POST", "DELETE"],
    "responseHeader": ["Content-Type"],
    "maxAgeSeconds": 3600
  }
]' > cors.json

gsutil cors set cors.json gs://your-media-bucket
```

#### 2. 建立服務帳戶

```bash
# 建立服務帳戶
gcloud iam service-accounts create strapi-storage \
  --display-name="Strapi Storage Account"

# 授予 Storage Admin 權限
gcloud projects add-iam-policy-binding your-project-id \
  --member="serviceAccount:strapi-storage@your-project-id.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

# 建立金鑰
gcloud iam service-accounts keys create gcs-key.json \
  --iam-account=strapi-storage@your-project-id.iam.gserviceaccount.com
```

#### 3. 安裝 Strapi GCS 插件

```bash
cd backend-strapi
npm install @strapi/provider-upload-gcs
```

#### 4. 設定上傳配置

建立 `backend-strapi/config/plugins.js`：
```javascript
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'gcs',
      providerOptions: {
        bucketName: env('GCS_BUCKET_NAME'),
        publicFiles: true,
        uniform: false,
        basePath: '',
        serviceAccount: env('GCS_SERVICE_ACCOUNT') 
          ? JSON.parse(env('GCS_SERVICE_ACCOUNT'))
          : undefined,
      },
    },
  },
});
```

#### 5. 更新 Cloud Run 環境變數

```bash
# 將 gcs-key.json 內容轉為單行
GCS_KEY=$(cat gcs-key.json | jq -c .)

gcloud run services update strapi-backend \
  --region asia-east1 \
  --set-env-vars "GCS_BUCKET_NAME=your-media-bucket" \
  --set-env-vars "GCS_SERVICE_ACCOUNT=${GCS_KEY}"
```

---

### 第五階段：部署前端

#### 選項 A：部署到 Cloud Storage（推薦）

1. **建置前端**
```bash
# 修改 API 端點
# .env.production
VITE_API_URL=https://strapi-backend-xxx.a.run.app

# 建置
npm run build
```

2. **建立 Storage Bucket**
```bash
gsutil mb -l asia-east1 gs://your-website-frontend
gsutil web set -m index.html -e index.html gs://your-website-frontend
gsutil iam ch allUsers:objectViewer gs://your-website-frontend
```

3. **上傳檔案**
```bash
gsutil -m rsync -r dist/ gs://your-website-frontend
```

4. **設定 Cloud CDN（可選）**
- Cloud Console → Network Services → Cloud CDN
- 建立負載平衡器
- 後端設定為 Storage Bucket

#### 選項 B：部署到 Firebase Hosting（更簡單）

```bash
# 安裝 Firebase CLI
npm install -g firebase-tools

# 登入
firebase login

# 初始化
firebase init hosting

# 部署
firebase deploy --only hosting
```

---

### 第六階段：設定自訂域名（可選）

#### 1. 在 Cloud Run 新增域名

```bash
gcloud run domain-mappings create \
  --service strapi-backend \
  --domain api.yourdomain.com \
  --region asia-east1
```

#### 2. 新增 DNS 記錄

根據 Cloud Run 提供的指示，在域名 DNS 設定中新增：
- A 記錄
- AAAA 記錄（IPv6）

#### 3. 等待 SSL 憑證簽發（約 15 分鐘）

---

## 💰 成本估算

### 免費額度（每月）
- **Cloud Run**：
  - 200 萬次請求（免費）
  - 360,000 GB-秒（免費）
  - 180,000 vCPU-秒（免費）
- **Cloud Storage**：
  - 5GB 儲存（免費）
- **Supabase**：
  - 500MB PostgreSQL（免費）
  - 1GB 檔案儲存（免費）

### 超過免費額度後
- Cloud Run：~$0.00002 / 請求
- Cloud Storage：$0.026 / GB
- Cloud SQL（如使用）：~$10/月起

### 預估月費用（中小型網站）
- 流量 < 200 萬次：**$0**
- 流量 500 萬次：~$5-10/月
- 流量 1000 萬次：~$15-20/月

---

## 🔧 常見問題

### Q1: Cloud Run 會自動休眠嗎？
A: 會，但重新啟動很快（< 1 秒）。可設定最小執行個體數避免冷啟動。

### Q2: 如何查看日誌？
```bash
gcloud run services logs tail strapi-backend --region asia-east1
```

或在 Cloud Console → Cloud Run → 日誌

### Q3: 如何更新部署？
```bash
# 重新建置並部署
cd backend-strapi
gcloud builds submit --tag gcr.io/your-project-id/strapi-backend
gcloud run deploy strapi-backend --image gcr.io/your-project-id/strapi-backend --region asia-east1
```

### Q4: 資料庫如何備份？
- **Supabase**：自動備份
- **Cloud SQL**：自動每日備份

### Q5: 如何設定 CI/CD？
使用 Cloud Build + GitHub：
1. 連接 GitHub repository
2. 建立 `cloudbuild.yaml`
3. 每次 push 自動部署

---

## 📋 檢查清單

部署前：
- [ ] GCP 帳號已建立
- [ ] Cloud SDK 已安裝
- [ ] 資料庫已設定（Supabase 或 Cloud SQL）
- [ ] 環境變數已準備
- [ ] Docker 映像可本地運行

部署後：
- [ ] Cloud Run 服務正常運行
- [ ] API 端點可訪問
- [ ] 後台可登入
- [ ] 媒體上傳功能正常
- [ ] 前端已部署並連接後端

---

## 🎯 快速開始

```bash
# 1. 複製環境變數範本
cp backend-strapi/.env.example backend-strapi/.env.production

# 2. 編輯環境變數（填入資料庫連線等）
nano backend-strapi/.env.production

# 3. 本地測試 Docker
cd backend-strapi
docker build -t strapi-test .
docker run -p 1337:1337 --env-file .env.production strapi-test

# 4. 部署到 Cloud Run
chmod +x ../deploy-cloudrun.sh
../deploy-cloudrun.sh

# 5. 設定環境變數
gcloud run services update strapi-backend \
  --region asia-east1 \
  --update-env-vars DATABASE_URL=postgresql://...

# 6. 測試
curl https://your-service-url.a.run.app/api
```

---

## 🚀 需要協助？

我可以幫您：
1. 生成隨機密鑰
2. 建立 Cloud Build CI/CD 配置
3. 優化 Docker 映像大小
4. 設定自動備份
5. 監控和告警設定
