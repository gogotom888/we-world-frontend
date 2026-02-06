/**
 * 統一的 API 請求工具
 * 處理 Strapi API 請求並自動處理錯誤
 */

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

/**
 * 安全的 JSON 解析
 * 如果響應為空或不是有效 JSON,返回 null 而不是拋出錯誤
 */
async function safeJsonParse(response: Response): Promise<any> {
  const text = await response.text();
  
  if (!text || text.trim() === '') {
    console.warn('⚠️ API 返回空響應');
    return null;
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('❌ JSON 解析失敗:', text.substring(0, 100));
    throw new Error('Invalid JSON response');
  }
}

/**
 * Strapi API 請求工具
 */
export async function fetchAPI(
  endpoint: string,
  options: FetchOptions = {}
): Promise<any> {
  const { params, ...fetchOptions } = options;
  
  // 構建 URL
  let url = endpoint;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }
  
  console.log(`📡 API Request: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
    
    console.log(`📊 API Response: ${response.status} ${response.statusText}`);
    
    // 檢查響應狀態
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`⚠️ 404 Not Found: ${url}`);
        return null;
      }
      
      if (response.status === 403) {
        console.error(`❌ 403 Forbidden: ${url}`);
        console.error('請檢查 Strapi Settings > Roles > Public 權限');
        throw new Error('Permission denied');
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // 安全解析 JSON
    const data = await safeJsonParse(response);
    
    if (data === null) {
      console.warn(`⚠️ ${endpoint} 返回空數據`);
      return null;
    }
    
    console.log(`✅ API Success: ${endpoint}`, data);
    return data;
    
  } catch (error) {
    console.error(`❌ API Error: ${endpoint}`, error);
    throw error;
  }
}

/**
 * 獲取 Strapi Collection Type 數據
 */
export async function fetchCollection(
  collectionName: string,
  options: {
    populate?: string;
    sort?: string;
    filters?: Record<string, any>;
  } = {}
): Promise<any[]> {
  const params: Record<string, string> = {};
  
  if (options.populate) params.populate = options.populate;
  if (options.sort) params.sort = options.sort;
  
  // 處理 filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      params[`filters[${key}][$eq]`] = String(value);
    });
  }
  
  const data = await fetchAPI(`/api/${collectionName}`, { params });
  
  return data?.data || [];
}

/**
 * 獲取 Strapi Single Type 數據
 */
export async function fetchSingleType(
  typeName: string,
  populate: string = '*'
): Promise<any> {
  const data = await fetchAPI(`/api/${typeName}`, {
    params: { populate },
  });
  
  return data?.data || null;
}

export default {
  fetchAPI,
  fetchCollection,
  fetchSingleType,
  safeJsonParse,
};
