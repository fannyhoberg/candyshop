import { fetchProducts } from "./api";
import { Product, ProductObject } from "./types";
import { displayProductPopup, closePopup } from "./product-info-popup";
import "./submit-order";
import "./style.css";
// import "bootstrap/dist/css/bootstrap.css";

const container = document.querySelector<HTMLElement>("#product-container")!;
const productOverviewCount =
  document.querySelector<HTMLSpanElement>("#product-count")!;
//const productCard = document.querySelector<HTMLDivElement>(".product-card")!;

// declare variables for info popup

const productInfoWrap =
  document.querySelector<HTMLElement>(".product-info-wrap")!;
const largeImage = document.querySelector<HTMLImageElement>(
  ".product-image-large"
)!;
const candyName = document.querySelector<HTMLHeadingElement>("#candy-name")!;
const candyDescription =
  document.querySelector<HTMLParagraphElement>("#candy-description")!;
const productInfoContainer = document.querySelector<HTMLElement>(
  ".product-info-container"
)!;

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

  // get a reference to all product cards on page and add eventlistener to each product card

  const productCards = document.querySelectorAll(
    ".product-card"
  ) as NodeListOf<HTMLElement>;
  productCards.forEach((productCard) => {
    productCard.addEventListener("click", handleProductClick);
  });
};

const handleProductClick = (e: MouseEvent) => {
  console.log("Handle Product Click triggered");
  const clickedElement = e.target as HTMLElement;

  // Check if the clicked element is the product card image
  if (clickedElement.classList.contains("product-image-thumbnail")) {
    // Retrieve the product ID from the data attribute
    const productId = (clickedElement.closest(".product-card") as HTMLElement)
      ?.dataset.productId;

    // Call a function to display a pop-up or perform any other action
    // only run if productId is not undefined

    if (productId !== undefined) {
      displayProductPopup(
        productId,
        productArray,
        productInfoWrap,
        candyName,
        candyDescription,
        largeImage
      );
    }

    console.log("You clicked the product card image with ID:", productId);
  }
};

// call the close popup function
closePopup(productInfoContainer, productInfoWrap);

getAndRenderProducts();
