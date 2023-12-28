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

// export interface NewOrder {
//   name: string;
//   address: string;
//   zipcode: string;
//   city: string;
//   phone: string;
//   email: string;
// }

export interface NewOrder {
  data: {
    customer_first_name: string,
    customer_last_name: string,
    customer_address: string,
    customer_postcode: string,
    customer_city: string,
    customer_email: string,
    customer_phone: string,
    order_total: number,
    order_items: [{}],
  }
}

