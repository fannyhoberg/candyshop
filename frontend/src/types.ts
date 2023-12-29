export interface ProductObject {
  status: string;
  data: Product[];
}

export interface Product {
  description: string;
  id: number;
  images: { thumbnail: string; large: string };
  name: string;
  on_sale: boolean;
  price: number;
  stock_quantity: number;
  stock_status: string;
  tags: [
    { id: number; name: string; slug: string },
    { id: number; name: string; slug: string }
  ];
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  images: {
    thumbnail: string;
  };
  stock_quantity: number;
}
