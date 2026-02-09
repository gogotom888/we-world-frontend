// 將本地 Strapi SQLite 資料遷移到雲端 PostgreSQL
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const CLOUD_DB_URL = 'postgresql://postgres.znoqozexytcfdfgsxfys:Tdi27405969@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres';
const LOCAL_STRAPI_PATH = path.join(__dirname, 'backend-strapi');

async function migrateData() {
  console.log('🚀 開始資料遷移...');
  
  // 連接雲端資料庫
  const client = new Client({ connectionString: CLOUD_DB_URL });
  
  try {
    await client.connect();
    console.log('✅ 已連接到雲端資料庫');
    
    // 檢查本地資料
    const uploadsPath = path.join(LOCAL_STRAPI_PATH, 'public', 'uploads');
    if (fs.existsSync(uploadsPath)) {
      const files = fs.readdirSync(uploadsPath, { recursive: true });
      console.log(`📁 找到 ${files.length} 個本地上傳檔案`);
    }
    
    // 導出資料表清單
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    console.log('\n📋 雲端資料庫資料表：');
    result.rows.forEach(row => console.log(`  - ${row.table_name}`));
    
    console.log('\n⚠️  注意：');
    console.log('1. 本地使用 SQLite，雲端使用 PostgreSQL');
    console.log('2. 需要透過 Strapi Admin 手動建立 Content Types');
    console.log('3. 圖片需要重新上傳到雲端');
    console.log('\n建議使用 Strapi 內建的資料匯入/匯出功能');
    
  } catch (error) {
    console.error('❌ 錯誤:', error.message);
  } finally {
    await client.end();
  }
}

migrateData();
