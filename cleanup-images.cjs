const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const STRAPI_URL = 'https://strapi-backend-mfti2u6crq-de.a.run.app';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// 載入上傳結果
const uploadedImages = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'uploaded-images.json'), 'utf-8')
);

// 規則：刪除以下類型的圖片
const shouldDelete = (fileName) => {
  // 刪除縮圖（thumbnail 和 small 開頭）
  if (fileName.startsWith('thumbnail_') || fileName.startsWith('small_')) {
    return true;
  }
  
  // 保留產品圖片（數字開頭的產品編號圖片）
  if (/^\d+_/.test(fileName)) {
    return false;
  }
  
  // 保留其他重要圖片（logo, banner 等）
  if (fileName.includes('logo') || fileName.includes('banner')) {
    return false;
  }
  
  return false; // 預設保留
};

async function deleteImage(imageId, fileName) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/upload/files/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${STRAPI_TOKEN}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log(`✅ 刪除: ${fileName} (ID: ${imageId})`);
    return true;
  } catch (error) {
    console.error(`❌ 刪除失敗 ${fileName}:`, error.message);
    return false;
  }
}

async function cleanupImages() {
  console.log('🧹 開始清理未使用的圖片...\n');

  if (STRAPI_TOKEN === 'YOUR_STRAPI_API_TOKEN_HERE' || !STRAPI_TOKEN) {
    console.error('❌ 請設定 STRAPI_TOKEN');
    return;
  }

  const toDelete = uploadedImages.filter(img => shouldDelete(img.fileName));
  const toKeep = uploadedImages.filter(img => !shouldDelete(img.fileName));

  console.log(`📊 統計：`);
  console.log(`  - 總共上傳: ${uploadedImages.length} 個檔案`);
  console.log(`  - 保留: ${toKeep.length} 個`);
  console.log(`  - 刪除: ${toDelete.length} 個\n`);

  if (toDelete.length === 0) {
    console.log('✅ 沒有需要刪除的檔案');
    return;
  }

  console.log('🗑️  開始刪除...\n');
  
  let deleted = 0;
  for (let i = 0; i < toDelete.length; i++) {
    const img = toDelete[i];
    console.log(`[${i + 1}/${toDelete.length}] 處理: ${img.fileName}`);
    
    const success = await deleteImage(img.id, img.fileName);
    if (success) deleted++;
    
    // 避免請求過快
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n✅ 清理完成！成功刪除: ${deleted}/${toDelete.length}`);
  
  // 儲存保留的圖片清單
  fs.writeFileSync(
    path.join(__dirname, 'kept-images.json'),
    JSON.stringify(toKeep, null, 2)
  );
  console.log('📄 保留的圖片清單已儲存至: kept-images.json');
}

cleanupImages().catch(console.error);
