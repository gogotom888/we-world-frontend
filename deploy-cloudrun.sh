#!/bin/bash

# GCP Cloud Run 部署腳本
# 使用方式: ./deploy-cloudrun.sh

set -e  # 遇到錯誤立即停止

echo "🚀 開始部署到 GCP Cloud Run..."

# 1. 設定變數
PROJECT_ID="gen-lang-client-0822572482"  # GCP 專案 ID
REGION="asia-east1"  # 台灣區域
SERVICE_NAME="strapi-backend"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

# Supabase 資料庫連線
DATABASE_URL="postgresql://postgres.znoqozexytcfdfgsxfys:Tdi27405969@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"

# Strapi 安全密鑰（從 .env.production 讀取）
APP_KEYS="r2omAP8btdf2TSjod8a6GA==,SrlAioRnbYz+/XWXJxCnmg==,z2RkvkwtL1edkGF3CClpog==,RyV3X7BcsbH/zv3CotQ8ug=="
API_TOKEN_SALT="IH00isP7tUutCFauG+ZyNHBLzpgKOnoktwfoA6eXk+I="
ADMIN_JWT_SECRET="VHw6tPWAdWJFMor8qFLwkM28KOU9E5saR76MTFnZVYI="
JWT_SECRET="Ztqp5mQQrDr0YiNu20jD02+E/4pNVYXQJXGVaBoUJ0k="
TRANSFER_TOKEN_SALT="MC7hk7v/wo7nLOYFVYRsm4p26SOs0uGlxAAyyHA7psA="

# 2. 確認已登入 GCP
echo "📋 檢查 GCP 認證..."
gcloud auth list

# 3. 設定專案
echo "📋 設定 GCP 專案..."
gcloud config set project ${PROJECT_ID}

# 4. 啟用必要的 API
echo "🔧 啟用必要的 GCP API..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com

# 5. 建置 Docker 映像
echo "🐳 建置 Docker 映像..."
cd backend-strapi
gcloud builds submit --tag ${IMAGE_NAME}

# 6. 部署到 Cloud Run
echo "🚀 部署到 Cloud Run..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --port 1337 \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "HOST=0.0.0.0" \
  --set-env-vars "PORT=1337" \
  --set-env-vars "DATABASE_CLIENT=postgres" \
  --set-env-vars "DATABASE_URL=${DATABASE_URL}" \
  --set-env-vars "APP_KEYS=${APP_KEYS}" \
  --set-env-vars "API_TOKEN_SALT=${API_TOKEN_SALT}" \
  --set-env-vars "ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}" \
  --set-env-vars "JWT_SECRET=${JWT_SECRET}" \
  --set-env-vars "TRANSFER_TOKEN_SALT=${TRANSFER_TOKEN_SALT}"

# 7. 獲取服務 URL
echo "✅ 部署完成！"
SERVICE_URL=$(gcloud run services describe ${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --format 'value(status.url)')

echo "🌐 您的 Strapi 後台 URL: ${SERVICE_URL}"
echo "🔑 管理後台: ${SERVICE_URL}/admin"
echo "📡 API 端點: ${SERVICE_URL}/api"

echo ""
echo "⚠️  重要：請記得設定環境變數："
echo "   - DATABASE_* (資料庫連線)"
echo "   - APP_KEYS, API_TOKEN_SALT, JWT_SECRET"
echo ""
echo "執行以下命令更新環境變數："
echo "gcloud run services update ${SERVICE_NAME} --region ${REGION} --update-env-vars KEY=VALUE"
