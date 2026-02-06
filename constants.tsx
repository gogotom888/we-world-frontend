
import { NewsItem, ProductItem, ServiceItem } from './types';

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    date: '10/25',
    title: 'New Smart Factory Initiatives',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    date: '10/12',
    title: 'Awarded ISO 9001 Certification',
    icon: 'verified'
  },
  {
    id: '3',
    date: '10/12',
    title: 'Expansion into New Facilities',
    icon: 'factory'
  }
];

export const SERVICES: ServiceItem[] = [
  {
    id: '1',
    title: 'CNC Machining',
    description: 'CNC Machining and making museum of precision, automated operations, and machining products.',
    icon: 'precision_manufacturing',
    isLarge: true
  },
  {
    id: '2',
    title: 'Injection Molding',
    icon: 'architecture'
  },
  {
    id: '3',
    title: 'Assembly & Testing',
    icon: 'engineering'
  },
  {
    id: '4',
    title: 'Quality Assurance',
    icon: 'verified_user'
  }
];

export const PRODUCTS: ProductItem[] = [
  // Nameplate Category
  {
    id: 'p1',
    name: 'Etched nameplates 蝕刻銘板',
    category: 'nameplate',
    image: 'https://www.we-world.com.tw/theme/tw/images/upload/0149.jpg',
    images: [
      'https://www.we-world.com.tw/theme/tw/images/upload/0149.jpg',
      'https://www.we-world.com.tw/theme/tw/images/upload/0149.jpg'
    ],
    moq: '100',
    material: 'Aluminum',
    size: '',
    process: 'Stamping,Etching',
    content: 'Etched nameplates 蝕刻銘板'
  },
  {
    id: 'p2',
    name: 'Diamond cut aluminum nameplates 鑽雕鋁銘板',
    category: 'nameplate',
    image: 'https://www.we-world.com.tw/theme/tw/images/upload/1.png',
    images: [
      'https://www.we-world.com.tw/theme/tw/images/upload/1.png'
    ],
    moq: '100',
    material: 'Aluminum',
    size: '',
    process: 'Diamond Cutting',
    content: 'Diamond cut aluminum nameplates 鑽雕鋁銘板'
  },
  {
    id: 'p3',
    name: 'Blue hairline aluminum nameplate 藍色髮絲鋁銘板',
    category: 'nameplate',
    image: 'https://www.we-world.com.tw/theme/tw/images/upload/%E9%AB%AE4.jpg',
    images: [
      'https://www.we-world.com.tw/theme/tw/images/upload/%E9%AB%AE4.jpg'
    ],
    moq: '100',
    material: 'Aluminum',
    size: '',
    process: 'Hairline Finish',
    content: 'Blue hairline aluminum nameplate 藍色髮絲鋁銘板'
  },
  {
    id: 'p4',
    name: 'Red hairline aluminum nameplate 紅色髮絲鋁銘板',
    category: 'nameplate',
    image: 'https://www.we-world.com.tw/theme/tw/images/upload/%E9%AB%AE3.jpg',
    images: [
      'https://www.we-world.com.tw/theme/tw/images/upload/%E9%AB%AE3.jpg'
    ],
    moq: '100',
    material: 'Aluminum',
    size: '',
    process: 'Hairline Finish',
    content: 'Red hairline aluminum nameplate 紅色髮絲鋁銘板'
  },
  {
    id: 'p5',
    name: 'Grey hairline aluminum nameplate 灰色髮絲鋁銘板',
    category: 'nameplate',
    image: 'https://www.we-world.com.tw/theme/tw/images/upload/%E9%AB%AE2.jpg',
    images: [
      'https://www.we-world.com.tw/theme/tw/images/upload/%E9%AB%AE2.jpg'
    ],
    moq: '100',
    material: 'Aluminum',
    size: '',
    process: 'Hairline Finish',
    content: 'Grey hairline aluminum nameplate 灰色髮絲鋁銘板'
  },
  {
    id: 'p6',
    name: 'Golden hairline aluminum nameplate 金色髮絲鋁銘板',
    category: 'nameplate',
    image: 'https://www.we-world.com.tw/theme/tw/images/upload/%E9%AB%AE1.jpg',
    images: [
      'https://www.we-world.com.tw/theme/tw/images/upload/%E9%AB%AE1.jpg'
    ],
    moq: '100',
    material: 'Aluminum',
    size: '',
    process: 'Hairline Finish',
    content: 'Golden hairline aluminum nameplate 金色髮絲鋁銘板'
  },
  // CNC Category
  {
    id: 'p7',
    name: 'Anodized CNC Aluminum Case 鋁陽極處理機殼',
    category: 'cnc',
    image: 'https://www.we-world.com.tw/upload/product/201503111516101.jpg',
    images: [
      'https://www.we-world.com.tw/upload/product/201503111516101.jpg'
    ],
    moq: '50',
    material: 'Aluminum',
    size: '',
    process: 'CNC Machining, Anodizing',
    content: 'Anodized CNC Aluminum Case 鋁陽極處理機殼'
  },
  {
    id: 'p8',
    name: 'Precision Turning Components 精密車削零件',
    category: 'cnc',
    image: 'https://www.we-world.com.tw/upload/product/201503111515251.jpg',
    images: [
      'https://www.we-world.com.tw/upload/product/201503111515251.jpg'
    ],
    moq: '100',
    material: 'Aluminum',
    size: '',
    process: 'CNC Turning',
    content: 'Precision Turning Components 精密車削零件'
  }
];
