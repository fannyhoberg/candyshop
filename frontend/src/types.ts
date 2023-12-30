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

export interface NewOrder {
  customer_first_name: string,
  customer_last_name: string,
  customer_address: string,
  customer_postcode: string,
  customer_city: string,
  customer_email: string,
  customer_phone: string,
  order_total: number,
  order_items: OrderItem[]
}

export interface OrderItem {
  product_id: number,
  qty: string,
  item_price: number,
  item_total: number,
}

export interface OrderDataObject {
  data: OrderData,
}

export interface OrderData {
  created_at: string,
  customer_address: string,
  customer_city: string,
  customer_email: string,
  customer_first_name: string,
  customer_last_name: string,
  customer_phone: string,
  customer_postcode: string,
  id: number,

  order_date: string,
  order_total: number,
  updated_at: string,
  user_id: string
}