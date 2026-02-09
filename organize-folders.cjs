const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const STRAPI_URL = 'https://strapi-backend-mfti2u6crq-de.a.run.app';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

// 定義資料夾結構（根據產品類型）
const FOLDER_STRUCTURE = {
  'Product Images': {
    'Laser': ['10001', '10002', '10003'], // 雷射產品
    'CNC': ['10004', '10005', '10006'],   // CNC 產品
    'Anodizing': ['10007', '10008'],      // 陽極處理
    'Other': ['10009', '10010']           // 其他
  },
  'Banners': [],
  'Logos': [],
  'General': []
};

/**
 * 獲取或創建資料夾
 */
async function getOrCreateFolder(folderName, parentId = null) {
  try {
    // 查詢資料夾是否存在
    let query = `filters[name][$eq]=${encodeURIComponent(folderName)}`;
    if (parentId) {
      query += `&filters[parent][id][$eq]=${parentId}`;
    } else {
      query += `&filters[parent][$null]=true`;
    }

    const searchResponse = await fetch(
      `${STRAPI_URL}/api/upload/folders?${query}`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
      }
    );

    if (!searchResponse.ok) {
      throw new Error(`搜尋失敗: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();

    // 如果資料夾已存在，返回 ID
    if (searchData.data && searchData.data.length > 0) {
      console.log(`  📁 資料夾已存在: ${folderName} (ID: ${searchData.data[0].id})`);
      return searchData.data[0].id;
    }

    // 創建新資料夾
    const createPayload = {
      name: folderName
    };
    if (parentId) {
      createPayload.parent = parentId;
    }

    const createResponse = await fetch(
      `${STRAPI_URL}/api/upload/folders`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(createPayload)
      }
    );

    if (!createResponse.ok) {
      const errorText = await createResponse.text();
      throw new Error(`創建失敗: ${createResponse.status} - ${errorText}`);
    }

    const createData = await createResponse.json();
    console.log(`  ✅ 創建資料夾: ${folderName} (ID: ${createData.data.id})`);
    return createData.data.id;
  } catch (error) {
    console.error(`❌ 處理資料夾失敗 ${folderName}:`, error.message);
    return null;
  }
}

/**
 * 移動檔案到指定資料夾
 */
async function moveFileToFolder(fileId, folderId, fileName) {
  try {
    const response = await fetch(
      `${STRAPI_URL}/api/upload/files/${fileId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          folder: folderId
        })
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    console.log(`  ✅ 移動: ${fileName} → 資料夾 ID ${folderId}`);
    return true;
  } catch (error) {
    console.error(`  ❌ 移動失敗 ${fileName}:`, error.message);
    return false;
  }
}

/**
 * 根據檔名判斷應該放在哪個資料夾
 */
function determineFolderForFile(fileName) {
  // Logo
  if (fileName.includes('logo')) {
    return ['Logos'];
  }
  
  // Banner
  if (fileName.includes('banner')) {
    return ['Banners'];
  }
  
  // 產品圖片
  const productMatch = fileName.match(/^(\d+)_/);
  if (productMatch) {
    const productId = productMatch[1];
    
    // 根據產品編號分類
    if (['10001', '10002', '10003'].includes(productId)) {
      return ['Product Images', 'Laser'];
    } else if (['10004', '10005', '10006'].includes(productId)) {
      return ['Product Images', 'CNC'];
    } else if (['10007', '10008'].includes(productId)) {
      return ['Product Images', 'Anodizing'];
    } else if (['10009', '10010'].includes(productId)) {
      return ['Product Images', 'Other'];
    }
  }
  
  // 其他檔案
  return ['General'];
}

async function organizeMediaLibrary() {
  console.log('🗂️  開始整理 Media Library...\n');

  if (!STRAPI_TOKEN) {
    console.error('❌ 請設定 STRAPI_TOKEN');
    return;
  }

  // 1. 創建資料夾結構
  console.log('📁 第一步：創建資料夾結構\n');
  const folderMap = {};

  // 創建根資料夾
  for (const rootFolder of Object.keys(FOLDER_STRUCTURE)) {
    const folderId = await getOrCreateFolder(rootFolder);
    if (folderId) {
      folderMap[rootFolder] = folderId;
      
      // 創建子資料夾
      const subFolders = FOLDER_STRUCTURE[rootFolder];
      if (typeof subFolders === 'object' && !Array.isArray(subFolders)) {
        for (const subFolder of Object.keys(subFolders)) {
          const subFolderId = await getOrCreateFolder(subFolder, folderId);
          if (subFolderId) {
            folderMap[`${rootFolder}/${subFolder}`] = subFolderId;
          }
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
    }
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n資料夾對應表：');
  console.log(folderMap);

  // 2. 載入已上傳的檔案
  console.log('\n📋 第二步：載入已上傳的檔案\n');
  const uploadedImages = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'kept-images.json'), 'utf-8')
  );

  console.log(`找到 ${uploadedImages.length} 個檔案\n`);

  // 3. 移動檔案到對應資料夾
  console.log('📦 第三步：移動檔案到資料夾\n');
  let moved = 0;

  for (let i = 0; i < uploadedImages.length; i++) {
    const file = uploadedImages[i];
    const folderPath = determineFolderForFile(file.fileName);
    const folderKey = folderPath.join('/');
    const folderId = folderMap[folderKey];

    if (folderId) {
      console.log(`[${i + 1}/${uploadedImages.length}] ${file.fileName} → ${folderKey}`);
      const success = await moveFileToFolder(file.id, folderId, file.fileName);
      if (success) moved++;
    } else {
      console.log(`[${i + 1}/${uploadedImages.length}] ⚠️  找不到資料夾: ${file.fileName}`);
    }

    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log(`\n✅ 整理完成！成功移動: ${moved}/${uploadedImages.length}`);
}

organizeMediaLibrary().catch(console.error);
