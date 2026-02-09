# Media Library 資料夾整理指南

## 問題說明

目前雲端 Strapi Media Library 中的 130 個圖片檔案都沒有組織在資料夾中，全部散落在根目錄。

## 建議的資料夾結構

```
Media Library/
├── Product Images/
│   ├── Laser/           (雷射產品: 10001, 10002, 10003)
│   ├── CNC/             (CNC 產品: 10004, 10005, 10006)
│   ├── Anodizing/       (陽極處理: 10007, 10008)
│   └── Other/           (其他產品: 10009, 10010, 10011, 10012)
├── Banners/             (輪播圖片)
├── Logos/               (Logo 圖片)
└── General/             (其他檔案)
```

## 檔案分類清單

### Product Images/Laser (雷射產品)
- 10001_*.jpg/png
- 10002_*.png
- 10003_*.jpeg

### Product Images/CNC
- 10004_*.jpeg
- 10005_*.jpeg
- 10006_*.jpg

### Product Images/Anodizing
- 10007_*.png
- 10008_*.jpg

### Product Images/Other
- 10009_*.jpg
- 10010_*.jpg
- 10011_*.svg
- 10012_*.svg

### Banners
- banner*.jpg
- 2025_12_31_*.jpg (輪播圖片)
- aluminum_anodizing_cnc_nameplate_*.jpg

### Logos
- weworld_logo_*.png
- *logo*.png

### General
- 其他不屬於以上分類的檔案

## 手動整理步驟

由於 Strapi 5.x 的 folder API 限制，建議透過 Admin UI 手動整理：

### 1. 登入 Strapi Admin
訪問：https://strapi-backend-mfti2u6crq-de.a.run.app/admin

### 2. 進入 Media Library
點選左側選單的 "Media Library"

### 3. 建立資料夾結構
1. 點選 "Add new folder" 按鈕
2. 依照上述結構建立主資料夾：
   - Product Images
   - Banners
   - Logos
   - General

3. 進入 "Product Images" 資料夾，建立子資料夾：
   - Laser
   - CNC
   - Anodizing
   - Other

### 4. 移動檔案
1. 選取多個檔案（按住 Ctrl/Cmd 多選）
2. 點選 "Move to" 按鈕
3. 選擇目標資料夾
4. 確認移動

### 5. 批次移動建議順序
1. 先移動 Product Images（按產品編號）
2. 再移動 Banners
3. 再移動 Logos
4. 最後移動 General

## 替代方案：本地整理後重新上傳

如果檔案太多不方便手動整理，可以考慮：

1. **清空雲端 Media Library**
   - 全選所有檔案
   - 批次刪除

2. **本地建立資料夾結構**
   ```bash
   backend-strapi/public/uploads/
   ├── product-images/
   │   ├── laser/
   │   ├── cnc/
   │   ├── anodizing/
   │   └── other/
   ├── banners/
   ├── logos/
   └── general/
   ```

3. **按分類移動本地檔案**

4. **重新上傳（保留資料夾結構）**
   - 使用支援資料夾的上傳腳本
   - 或透過 Strapi Admin UI 依資料夾上傳

## 注意事項

⚠️ **重要**：移動或刪除檔案前，請確保：
1. 已備份 `kept-images.json` 檔案
2. 檢查產品是否已關聯圖片
3. 如果產品已關聯圖片，移動檔案不會影響關聯關係（URL 不變）

## 長期建議

未來上傳新圖片時：
1. 直接上傳到對應的資料夾
2. 使用清晰的檔名規則
3. 定期整理和清理未使用的檔案
