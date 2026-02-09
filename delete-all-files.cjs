const fetch = require('node-fetch');

const STRAPI_URL = 'https://strapi-backend-mfti2u6crq-de.a.run.app';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

async function deleteAllFiles() {
  console.log('🗑️  開始刪除所有雲端圖片...\n');

  if (!STRAPI_TOKEN) {
    console.error('❌ 請設定 STRAPI_TOKEN');
    return;
  }

  try {
    // 獲取所有檔案
    console.log('📋 獲取檔案清單...');
    const response = await fetch(
      `${STRAPI_URL}/api/upload/files?pagination[pageSize]=1000`,
      {
        headers: {
          'Authorization': `Bearer ${STRAPI_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`獲取失敗: ${response.status}`);
    }

    const data = await response.json();
    const files = data.data || data;

    console.log(`找到 ${files.length} 個檔案\n`);

    if (files.length === 0) {
      console.log('✅ 沒有檔案需要刪除');
      return;
    }

    // 刪除所有檔案
    let deleted = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileId = file.id;
      const fileName = file.name;

      console.log(`[${i + 1}/${files.length}] 刪除: ${fileName}`);

      try {
        const deleteResponse = await fetch(
          `${STRAPI_URL}/api/upload/files/${fileId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${STRAPI_TOKEN}`
            }
          }
        );

        if (deleteResponse.ok) {
          console.log(`  ✅ 已刪除`);
          deleted++;
        } else {
          console.log(`  ❌ 失敗: ${deleteResponse.status}`);
        }
      } catch (error) {
        console.log(`  ❌ 錯誤: ${error.message}`);
      }

      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`\n✅ 刪除完成！成功: ${deleted}/${files.length}`);
  } catch (error) {
    console.error('❌ 執行失敗:', error.message);
  }
}

deleteAllFiles().catch(console.error);
