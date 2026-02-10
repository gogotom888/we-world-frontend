# Process Page (製程頁面) Setup Guide

## Overview
The Process Page at `http://localhost:3001/process` displays your company's manufacturing process, capabilities, and quality control systems. It connects to the Strapi backend for dynamic content management.

## Backend Configuration

### 1. Access Strapi Admin
- Navigate to: `http://localhost:1337/admin` or `http://localhost:3001/admin`
- Login with your admin credentials

### 2. Configure Process Page Content

Go to **Content Manager > Single Types > Process Page (製程頁面)**

#### Basic Information
- **Title**: `PROCESS 製程`
- **Subtitle**: `完善的生產流程，確保產品品質`
- **Introduction**: Use the CKEditor to add introduction text (HTML formatted)

#### Process Steps (JSON format)
```json
[
  {
    "step": "01",
    "title": "需求分析",
    "description": "了解客戶需求，制定生產方案",
    "icon": "assignment",
    "details": [
      "客戶需求評估",
      "技術可行性分析",
      "成本預算規劃"
    ]
  },
  {
    "step": "02",
    "title": "設計開發",
    "description": "專業設計團隊進行產品設計",
    "icon": "design_services",
    "details": [
      "3D建模設計",
      "工程圖製作",
      "樣品製作"
    ]
  },
  {
    "step": "03",
    "title": "生產製造",
    "description": "採用先進設備進行生產",
    "icon": "precision_manufacturing",
    "details": [
      "CNC精密加工",
      "表面處理",
      "品質檢驗"
    ]
  },
  {
    "step": "04",
    "title": "品質控管",
    "description": "嚴格的品質檢驗流程",
    "icon": "verified",
    "details": [
      "尺寸檢測",
      "外觀檢查",
      "功能測試"
    ]
  }
]
```

#### Manufacturing Capabilities (JSON format)
```json
[
  {
    "icon": "precision_manufacturing",
    "title": "CNC加工",
    "items": [
      "五軸加工中心",
      "三軸CNC銑床",
      "CNC車床",
      "高精度公差控制"
    ]
  },
  {
    "icon": "laser_on",
    "title": "雷射切割",
    "items": [
      "CO2雷射切割",
      "光纖雷射切割",
      "雷射雕刻",
      "精密打標"
    ]
  },
  {
    "icon": "format_paint",
    "title": "表面處理",
    "items": [
      "陽極處理",
      "電鍍加工",
      "噴塗烤漆",
      "絲印移印"
    ]
  },
  {
    "icon": "inventory_2",
    "title": "組裝包裝",
    "items": [
      "精密組裝",
      "功能測試",
      "專業包裝",
      "物流配送"
    ]
  }
]
```

### 3. Configure Permissions
1. Go to **Settings > Users & Permissions Plugin > Roles > Public**
2. Find **PROCESS-PAGE** section
3. Enable:
   - ✅ `find`
   - ✅ `findOne`
4. Click **Save**

### 4. Set Internationalization (Optional)
If using multiple languages:
1. Ensure i18n plugin is enabled
2. Add translations for each locale
3. Fill in the same fields for each language

## Frontend Implementation

The Process Page component is located at:
- `components/pages/ProcessPage.tsx`

### Features
1. **Dynamic Content Loading**: Fetches data from Strapi API
2. **Introduction Section**: Displays HTML content from CKEditor
3. **Process Steps**: Shows step-by-step manufacturing process
4. **Manufacturing Capabilities**: Displays company capabilities
5. **Quality Control**: Fixed section showing quality standards
6. **CTA Section**: Call-to-action for customer inquiries

### API Endpoint
The page fetches data from: `/api/process-page?populate=*`

## Testing

### 1. Test API Connection
Open browser console on the Process page and check for:
```
✅ Process Page 資料已從後台載入
```

### 2. Manual API Test
Visit: `http://localhost:3001/api/process-page?populate=*`

Expected response:
```json
{
  "data": {
    "id": 1,
    "title": "PROCESS 製程",
    "subtitle": "完善的生產流程，確保產品品質",
    "introduction": "<p>...</p>",
    "process_steps": [...],
    "manufacturing_capabilities": [...]
  }
}
```

### 3. View the Page
Navigate to: `http://localhost:3001/process`

## Troubleshooting

### Content Not Showing
1. Check if Strapi is running: `http://localhost:1337/admin`
2. Verify permissions are set (Public role → Process-Page → find, findOne)
3. Check browser console for errors
4. Verify content is saved in Strapi admin

### API Errors
- **403 Forbidden**: Permissions not configured correctly
- **404 Not Found**: Process Page content not created in admin
- **500 Error**: Check Strapi logs in terminal

### Empty Sections
- If Process Steps or Manufacturing Capabilities don't show, check the JSON format
- Ensure the JSON is valid (use a JSON validator)
- Arrays must be properly formatted

## Customization

### Adding More Process Steps
Edit the `process_steps` JSON array and add more objects following the same structure.

### Changing Icons
Icons use Material Icons. Browse available icons at: https://fonts.google.com/icons
Replace the `icon` value with the icon name.

### Modifying Quality Control Section
The Quality Control section is hardcoded in the component. To modify:
1. Edit `components/pages/ProcessPage.tsx`
2. Find the "Quality Control" section
3. Update the content as needed

## Sample Content Templates

### Simple Process Steps
```json
[
  {
    "step": "01",
    "title": "諮詢",
    "description": "了解客戶需求",
    "icon": "call",
    "details": []
  },
  {
    "step": "02",
    "title": "設計",
    "description": "產品設計開發",
    "icon": "draw",
    "details": []
  },
  {
    "step": "03",
    "title": "製造",
    "description": "精密生產製造",
    "icon": "build",
    "details": []
  },
  {
    "step": "04",
    "title": "交付",
    "description": "品質檢驗交付",
    "icon": "local_shipping",
    "details": []
  }
]
```

### Simple Capabilities
```json
[
  {
    "icon": "build",
    "title": "加工服務",
    "items": ["CNC加工", "雷射切割", "鈑金加工"]
  },
  {
    "icon": "palette",
    "title": "表面處理",
    "items": ["噴塗", "電鍍", "拋光"]
  }
]
```

## Next Steps

1. ✅ Complete the backend schema update (already done)
2. ✅ Complete the frontend implementation (already done)
3. ⏳ Access Strapi admin and create Process Page content
4. ⏳ Configure permissions
5. ⏳ Test the page at http://localhost:3001/process

---

**Need Help?**
- Check Strapi documentation: https://docs.strapi.io
- Check Material Icons: https://fonts.google.com/icons
- Review other pages (Service, About) for implementation examples
