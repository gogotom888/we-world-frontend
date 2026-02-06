
export interface NewsItem {
  id: string;
  date: string;
  title: string;
  image?: string;
  icon?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  image: string;
  images?: string[]; // Multiple images for gallery
  category: 'nameplate' | 'cnc';
  moq?: string; // Minimum Order Quantity
  material?: string;
  size?: string;
  process?: string;
  content?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description?: string;
  icon: string;
  isLarge?: boolean;
}
