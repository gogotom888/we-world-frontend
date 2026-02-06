# 🚀 GCP Cloud Run 部署檢查清單

## ✅ 第一階段：前置準備

### 1. 安裝工具
- [ ] Google Cloud SDK
  - 下載：https://cloud.google.com/sdk/docs/install
  - 安裝後執行：`gcloud init`
- [x] Docker（已安裝 v29.1.3）
- [x] Node.js（已安裝 v24.12.0）

### 2. GCP 設定
- [ ] 註冊 GCP 帳號（有 $300 免費額度）
- [ ] 建立新專案
- [ ] 記錄專案 ID：___________________

### 3. 資料庫設定（Supabase - 推薦）
- [ ] 註冊 Supabase：https://supabase.com/
- [ ] 建立新專案
- [ ] 取得資料庫連線字串
- [ ] 填入 `backend-strapi/.env.production` 中的 `DATABASE_URL`

### 4. 環境變數
- [x] 已生成安全密鑰（在 `.env.production`）
- [ ] 已填入資料庫連線字串

---

## ✅ 第二階段：資料庫遷移

### 安裝 PostgreSQL 驅動
```bash
cd backend-strapi
npm install pg --save
```

- [ ] 已安裝 pg 套件

### 修改資料庫配置
檔案：`backend-strapi/config/database.js`

- [ ] 已修改為 PostgreSQL 配置

---

## ✅ 第三階段：本地測試

### 測試 Docker 建置
```bash
cd backend-strapi
docker build -t strapi-test .
```

- [ ] Docker 映像建置成功

### 本地運行測試
```bash
docker run -p 1337:1337 --env-file .env.production strapi-test
```

- [ ] 可以訪問 http://localhost:1337/api
- [ ] 可以登入後台 http://localhost:1337/admin

---

## ✅ 第四階段：部署到 Cloud Run

### 修改部署腳本
檔案：`deploy-cloudrun.sh`

```bash
PROJECT_ID="your-gcp-project-id"  # 填入您的專案 ID
```

- [ ] 已修改專案 ID

### 執行部署
```bash
chmod +x deploy-cloudrun.sh
./deploy-cloudrun.sh
```

或手動部署：
```bash
# 1. 設定專案
gcloud config set project your-project-id

# 2. 啟用 API
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com

# 3. 建置映像
cd backend-strapi
gcloud builds submit --tag gcr.io/your-project-id/strapi-backend

# 4. 部署
gcloud run deploy strapi-backend \
  --image gcr.io/your-project-id/strapi-backend \
  --platform managed \
  --region asia-east1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --port 1337
```

- [ ] 部署成功
- [ ] 記錄服務 URL：___________________

### 設定環境變數
```bash
gcloud run services update strapi-backend \
  --region asia-east1 \
  --update-env-vars DATABASE_URL="postgresql://..." \
  --update-env-vars APP_KEYS="..." \
  --update-env-vars API_TOKEN_SALT="..." \
  --update-env-vars ADMIN_JWT_SECRET="..." \
  --update-env-vars JWT_SECRET="..." \
  --update-env-vars TRANSFER_TOKEN_SALT="..."
```

- [ ] 已設定所有環境變數

---

## ✅ 第五階段：驗證部署

### 測試 API
```bash
curl https://your-service-url.a.run.app/api
```

- [ ] API 正常回應

### 測試後台
- [ ] 可以訪問管理後台
- [ ] 可以登入
- [ ] 資料正常顯示

---

## ✅ 第六階段：設定媒體上傳（可選）

### 建立 Storage Bucket
```bash
gsutil mb -l asia-east1 gs://your-media-bucket
gsutil iam ch allUsers:objectViewer gs://your-media-bucket
```

- [ ] Bucket 已建立

### 安裝 GCS 插件
```bash
cd backend-strapi
npm install @strapi/provider-upload-gcs
```

- [ ] 已安裝插件
- [ ] 已設定 `config/plugins.js`

---

## ✅ 第七階段：前端部署

### 建置前端
```bash
# 修改 API 端點
echo "VITE_API_URL=https://your-service-url.a.run.app" > .env.production

# 建置
npm run build
```

- [ ] 已修改 API 端點
- [ ] 建置成功（生成 dist/）

### 部署到 Cloud Storage
```bash
# 建立 Bucket
gsutil mb -l asia-east1 gs://your-website-frontend

# 設定靜態網站
gsutil web set -m index.html -e index.html gs://your-website-frontend

# 設定公開讀取
gsutil iam ch allUsers:objectViewer gs://your-website-frontend

# 上傳檔案
gsutil -m rsync -r dist/ gs://your-website-frontend
```

- [ ] 前端已部署
- [ ] 記錄網站 URL：___________________

---

## 📋 最終檢查

- [ ] ✅ 後端 API 正常運行
- [ ] ✅ 前端網站可訪問
- [ ] ✅ 前後端連接正常
- [ ] ✅ 資料庫連線正常
- [ ] ✅ 管理後台可登入
- [ ] ✅ 媒體上傳功能正常

---

## 🎯 快速指令參考

### 查看日誌
```bash
gcloud run services logs tail strapi-backend --region asia-east1
```

### 更新部署
```bash
cd backend-strapi
gcloud builds submit --tag gcr.io/your-project-id/strapi-backend
gcloud run deploy strapi-backend \
  --image gcr.io/your-project-id/strapi-backend \
  --region asia-east1
```

### 更新環境變數
```bash
gcloud run services update strapi-backend \
  --region asia-east1 \
  --update-env-vars KEY=VALUE
```

### 查看服務狀態
```bash
gcloud run services describe strapi-backend --region asia-east1
```

---

## 💰 成本監控

- 免費額度：200 萬次請求/月
- 當前使用量：___ 次請求
- 預估月費用：$___

---

## 🆘 遇到問題？

1. 查看日誌：`gcloud run services logs tail strapi-backend --region asia-east1`
2. 檢查環境變數：`gcloud run services describe strapi-backend --region asia-east1`
3. 參考完整指南：`DEPLOYMENT_CLOUDRUN.md`

---

完成日期：___/___/___
部署者：___________
