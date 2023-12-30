import { ProductObject } from "./types";

// fetch the data from api

export const fetchProducts = async () => {
  const response = await fetch("https://www.bortakvall.se/api/v2/products");
  if (!response.ok) {
    throw new Error(
      `Could not fetch products. Status code was ${response.status}`
    );
  } else {
    console.log(response.json);
  }

  // store parsed JSON content with the expected structure defined by the ProductObject type
  const data: ProductObject = await response.json();

  return data;
};
