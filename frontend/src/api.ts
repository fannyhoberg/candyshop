import { Product } from "./types";

export const fetchProducts = async () => {
  const response = await fetch("https://www.bortakvall.se/api/v2/products");
  if (!response.ok) {
    throw new Error(
      `Could not fetch todos. Status code was ${response.status}`
    );
  }

  //   else {
  //     console.log(response.json);
  //   }

  const data: Product[] = await response.json();

  return data;
  // console.log(data);
};
