// API服务 - 连接Strapi后端
// src/services/api.ts

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// 通用请求函数
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// 产品API
export const productAPI = {
  // 获取所有产品
  async getAll(category?: string) {
    const endpoint = category && category !== 'all' 
      ? `/products?filters[category][slug][$eq]=${category}&populate=*`
      : '/products?populate=*';
    return fetchAPI<ApiResponse<any[]>>(endpoint);
  },

  // 获取单个产品
  async getById(id: string) {
    return fetchAPI<ApiResponse<any>>(`/products/${id}?populate=*`);
  },
};

// 产品分类API
export const categoryAPI = {
  async getAll() {
    return fetchAPI<ApiResponse<any[]>>('/product-categories');
  },

  async getById(id: string) {
    return fetchAPI<ApiResponse<any>>(`/product-categories/${id}`);
  },
};

// 新闻API
export const newsAPI = {
  async getAll() {
    return fetchAPI<ApiResponse<any[]>>('/news?populate=*&sort=publish_date:desc');
  },

  async getById(id: string) {
    return fetchAPI<ApiResponse<any>>(`/news/${id}?populate=*`);
  },
};

// 询价API
export const enquiryAPI = {
  async create(data: {
    company_name?: string;
    contact_person: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    return fetchAPI<ApiResponse<any>>('/enquiries', {
      method: 'POST',
      body: JSON.stringify({ data }),
    });
  },
};

// 文件上传辅助函数
export function getImageUrl(imageData: any): string {
  if (!imageData) return '';
  
  // 如果是Strapi的图片对象
  if (imageData.url) {
    // 如果是相对路径,保持相对路径(通过代理访问)
    if (imageData.url.startsWith('/')) {
      return imageData.url;
    }
    return imageData.url;
  }
  
  return '';
}

// 转换Strapi数据格式为前端格式
export function transformProduct(strapiProduct: any) {
  return {
    id: strapiProduct.id,
    name: strapiProduct.name || strapiProduct.name_en,
    name_en: strapiProduct.name_en,
    name_zh: strapiProduct.name_zh,
    category: strapiProduct.category?.slug || 'all',
    image: getImageUrl(strapiProduct.images?.[0]),
    images: strapiProduct.images?.map((img: any) => getImageUrl(img)) || [],
    moq: strapiProduct.moq,
    material: strapiProduct.material,
    size: strapiProduct.size,
    process: strapiProduct.process,
    content: strapiProduct.content,
  };
}

export function transformNews(strapiNews: any) {
  return {
    id: strapiNews.id,
    date: new Date(strapiNews.publish_date).toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit' 
    }),
    title: strapiNews.title,
    image: strapiNews.image ? getImageUrl(strapiNews.image) : undefined,
    icon: strapiNews.icon,
  };
}
