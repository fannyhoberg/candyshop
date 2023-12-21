import { fetchProducts } from "./api";
import { Product } from "./types";

import "./style.css";
// import "bootstrap/dist/css/bootstrap.css";

const container = document.querySelector<HTMLElement>(".container")!;
//const productCard = document.querySelector<HTMLDivElement>(".product-card")!;

let products: Product[] = [];

/**
 *  Get products from server (through fetchProducts), update local copy and render todos
 */
const getAndRenderProducts = async () => {
  try {
    // Fetch products from server and updates local copy
    products = await fetchProducts();

    console.log("These are our products", products);
    //console.log(typeof products);

    const productArray: [] = products.data;
    console.log("product array: ", productArray);

    // productArray.forEach((item) => {
    //   console.log(item.name);
    // });

    //Render products
    renderProducts(productArray);
  } catch (err) {
    alert("Could not get todos, try again later?");
  }
};

// Render todos to DOM
const renderProducts = (array: Product[]) => {
  container.innerHTML = array
    .map(
      (product) => `
      <div class="product-card">
      <img src="https://www.bortakvall.se${product.images.thumbnail}" alt="Product thumbnail" id="">
      <h2 id="candy-name">${product.name}</h2>
      <p id="candy-price">${product.price} kronor</p>
      <button id="add-to-cart" class="button">Lägg i varukorg</button>
      </div>
  `
    )
    .join("");
};

getAndRenderProducts();
