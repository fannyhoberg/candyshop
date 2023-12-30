import { NewOrder, ProductObject } from "./types";

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


export const submitOrder = async (newOrder: NewOrder) => {
  try {
    const res = await fetch("https://www.bortakvall.se/api/v2/users/32/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newOrder),
    });

    // Check that everything went ok
    if (!res.ok) {
      alert("Could not submit order!");
      console.log("Could not submit order:", res);
      return;
    }

    const resData = await res.json();
    return resData;

  } catch (error) {
    console.error("Error submitting order:", error);
    throw error;

  }

};


export const fetchOrders = async () => {
  const response = await fetch("https://www.bortakvall.se/api/v2/users/32/orders");
  if (!response.ok) {
    throw new Error(
      `Could not fetch todos. Status code was ${response.status}`
    );
  } else {
    console.log(response.json);
  }

  // store parsed JSON content with the expected structure defined by the ProductObject type
  const data = await response.json();

  return data;
};