import { fetchProducts } from './api';

import './style.css'
import 'bootstrap/dist/css/bootstrap.css'

const container = document.querySelector<HTMLElement>(".container")!;
const productCard = document.querySelector<HTMLDivElement>(".product-card")!;

let products: [];

/**
 *  Get todos from server (through fetchTodos), update local copy and render todos
 */
const getAndRenderProducts = async () => {
  try {
    // Fetch todos from server and updates local copy
    products = await fetchProducts();

    console.log("These are our products", products);
    console.log(typeof products);

    const productArray: [] = products.data;
    console.log(productArray);

    productArray.forEach((item) => {
      console.log(item.name);
    })

    // Render todos
    renderProducts(productArray);

  } catch (err) {
    alert("Could not get todos, try again later?")
  }

}

// Render todos to DOM
const renderProducts = (array) => {

  container.innerHTML = array
    .map(product => `
      <div class="product-card">
      <img src="https://www.bortakvall.se${product.images.thumbnail}" alt="Product thumbnail" id="">
      <h2 id="candy-name">${product.name}</h2>
      <p id="candy-price">${product.price} kronor</p>
      <button id="add-to-card">Köp</button>
      </div>
  `)
    .join("");
};

getAndRenderProducts();
