import { fetchProducts } from "./api";
import { Product, ProductObject } from "./types";
//import { handleProductClick } from "./product-info-popup";
import "./style.css";
// import "bootstrap/dist/css/bootstrap.css";

export { productArray };

const container = document.querySelector<HTMLElement>("#product-container")!;
const productOverviewCount =
  document.querySelector<HTMLSpanElement>("#product-count")!;
//const productCard = document.querySelector<HTMLDivElement>(".product-card")!;

// declare variable to store value returned from fetch function
let products: ProductObject;
let productArray: Product[] = [];

/**
 *  Get products from server (through fetchProducts), update local copy and render todos
 */
const getAndRenderProducts = async () => {
  try {
    // Fetch products from server and updates local copy
    products = await fetchProducts();

    console.log("These are our products", products);

    // create array from "data" keyword (on ProducObject)
    productArray = products.data;
    console.log("product array: ", productArray);

    // productArray.forEach((item) => {
    //   console.log(item.name);
    // });

    //Render products
    renderProducts(productArray);
    productOverviewCount.innerHTML = `${productArray.length}`;
  } catch (err) {
    alert("Could not get todos, try again later?");
  }
};

// Render products to DOM
const renderProducts = (array: Product[]) => {
  container.innerHTML = array
    .map(
      (product) => `
      <div class="product-card" data-product-id="${product.id}" >
      <img src="https://www.bortakvall.se${product.images.thumbnail}" alt="Product thumbnail" class="product-image-thumbnail">
      <div class="product-card-content">
      <h2 id="candy-name">${product.name}</h2>
      <p id="candy-price">${product.price} kronor</p>
      <button id="add-to-cart" class="button">Lägg i varukorg</button>
      </div>
      </div>
  `
    )
    .join("");
  //productCard.addEventListener("click", handleProductClick);
};

getAndRenderProducts();
