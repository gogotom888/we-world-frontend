const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const fetch = require('node-fetch');

const STRAPI_URL = 'https://strapi-backend-mfti2u6crq-de.a.run.app';
const LOCAL_UPLOADS_PATH = path.join(__dirname, 'backend-strapi', 'public', 'uploads');

// 從環境變數或手動輸入取得 API Token
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || 'YOUR_STRAPI_API_TOKEN_HERE';

async function uploadImage(filePath, fileName) {
  const formData = new FormData();
  formData.append('files', fs.createReadStream(filePath), fileName);

  try {
    const response = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log(`✅ 上傳成功: ${fileName} (ID: ${data[0].id})`);
    return data[0];
  } catch (error) {
    console.error(`❌ 上傳失敗 ${fileName}:`, error.message);
    return null;
  }
}

async function uploadAllImages() {
  console.log('🚀 開始批次上傳圖片...\n');

  if (!fs.existsSync(LOCAL_UPLOADS_PATH)) {
    console.error(`❌ 找不到本地上傳目錄: ${LOCAL_UPLOADS_PATH}`);
    return;
  }

  if (STRAPI_TOKEN === 'YOUR_STRAPI_API_TOKEN_HERE') {
    console.error('❌ 請先設定 STRAPI_TOKEN');
    console.log('\n取得 Token 步驟：');
    console.log('1. 登入 Strapi Admin: ' + STRAPI_URL + '/admin');
    console.log('2. Settings → API Tokens → Create new API Token');
    console.log('3. Name: Upload Script');
    console.log('4. Token type: Full access');
    console.log('5. 複製 Token 並設定環境變數：');
    console.log('   set STRAPI_TOKEN=your_token_here');
    console.log('   node upload-images.js\n');
    return;
  }

  const files = fs.readdirSync(LOCAL_UPLOADS_PATH, { recursive: true });
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
  });

  console.log(`📁 找到 ${imageFiles.length} 個圖片檔案\n`);

  const uploadedImages = [];
  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const filePath = path.join(LOCAL_UPLOADS_PATH, file);
    const fileName = path.basename(file);
    
    console.log(`[${i + 1}/${imageFiles.length}] 上傳: ${fileName}`);
    
    const result = await uploadImage(filePath, fileName);
    if (result) {
      uploadedImages.push({
        fileName,
        id: result.id,
        url: result.url
      });
    }
    
    // 避免請求過快
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✅ 上傳完成！成功: ${uploadedImages.length}/${imageFiles.length}`);
  
  // 儲存結果
  fs.writeFileSync(
    path.join(__dirname, 'uploaded-images.json'),
    JSON.stringify(uploadedImages, null, 2)
  );
  console.log('\n📄 上傳結果已儲存至: uploaded-images.json');
}

uploadAllImages().catch(console.error);
