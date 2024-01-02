import { fetchProducts } from "./api";
import { Product, ProductObject, CartItem } from "./types";
import { displayProductPopup, closePopup } from "./product-info-popup";
import "./submit-order";
import "./style.css";
// import "bootstrap/dist/css/bootstrap.css";

const container = document.querySelector<HTMLElement>("#product-container")!;
const productOverviewCount =
  document.querySelector<HTMLSpanElement>("#product-count")!;
const productOverviewInstock = document.querySelector<HTMLSpanElement>('#products-instock')!;
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

    // sort array in alphabetic order
    productArray.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }

      if (a.name > b.name) {
        return 1;
      }

      return 0;
    });


    const productsInStock = productArray.filter((item) => {
      return item.stock_status === "instock"
    })

    console.log("Products in stock:", productsInStock.length);

    //Render products
    renderProducts(productArray);
    productOverviewCount.innerHTML = `${productArray.length}`;
    productOverviewInstock!.innerHTML = `${productsInStock.length}`;
  } catch (err) {
    alert("Could not get products, try again later?");
  }
};

// Render products to DOM
const renderProducts = (array: Product[]) => {
  container.innerHTML = array
    .map(
      (product) => `
      <div class="product-card" data-product-id="${product.id}" >
      <img src="https://www.bortakvall.se${product.images.thumbnail}" alt="Product thumbnail" class="product-image-thumbnail" id="candy-image">
      <div class="product-card-content">
      <h2 id="candy-name">${product.name}</h2>
      <p><span id="candy-price">${product.price}</span> kronor</p> 
      <p id="stock-quantity" class="hide">${product.stock_quantity}</p>
      <button id="add-to-cart" class="button" data-id="${product.id}">Lägg i varukorg</button>
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

  array.forEach((product) => {
    if (product.stock_quantity < 1) {
      const productId = product.id;
      const addToCartButton = document.querySelector<HTMLButtonElement>(`[data-id="${productId}"]`);

      if (addToCartButton)
        addToCartButton.disabled = true;
    }
  })
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

// get items from local storage when page reloads

localStorage.getItem("carts") ?? "";

// FANNYS KOD NEDAN

let totalAmount = 0;

const totalClicksEl = document.querySelector<HTMLElement>(".totalClicks")!;

// Eventlistener for container with candies, listening for clicks on button
container.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  // check if click was on button
  if (target.tagName === "BUTTON") {
    console.log("Du klickade på knappen", e);

    // get and store product-id
    let product_id = Number(target.dataset.id);
    console.log("Detta är product_id", product_id);

    // get reference for closest product card
    const parentProductEl = target.closest(".product-card") as HTMLElement;
    console.log("Detta är parentProductEl; ", parentProductEl);

    // get reference for clicked candy name
    let candyNameToCart: string = "";

    if (parentProductEl) {
      const candyNameElement = parentProductEl.querySelector(
        "#candy-name"
      ) as HTMLHeadingElement;

      // Check that candyNameElement is not null
      if (candyNameElement) {
        candyNameToCart = candyNameElement.textContent || "";
      }
    }
    console.log("Detta är candyname:", candyNameToCart);

    // get reference for clicked candy image source
    let candyImageSrc: string;
    if (parentProductEl) {
      const candyImageElement = parentProductEl.querySelector(
        "#candy-image"
      ) as HTMLImageElement;

      // Kontrollera att candyImageElement inte är null innan du fortsätter
      if (candyImageElement) {
        candyImageSrc = candyImageElement.getAttribute("src") || "";
      }
    }
    console.log("Detta är candyImageSrc:", candyImageSrc);

    // get reference for clicked candy price
    let candyPriceToCart: string = "";

    if (parentProductEl) {
      const candyPriceElement = parentProductEl.querySelector(
        "#candy-price"
      ) as HTMLElement;

      // Check that candyNameElement is not null
      if (candyPriceElement) {
        candyPriceToCart = candyPriceElement.textContent || "";
      }
    }
    console.log("Detta är candyPriceToCart:", candyPriceToCart);

    // get reference for clicked candy stock quantity
    let candyStockQuantity: string = "";

    if (parentProductEl) {
      const candyStockQuantityEl = parentProductEl.querySelector(
        "#stock-quantity"
      ) as HTMLElement;

      // Check that candyNameElement is not null
      if (candyStockQuantityEl) {
        candyStockQuantity = candyStockQuantityEl.textContent || "";
      }
    }
    console.log("Detta är candyStockQuantity:", candyStockQuantity);

    // call function addToCart with value of clicked candy
    if (Number(candyStockQuantity) > 0) {
      addToCart(
        product_id,
        candyNameToCart,
        candyImageSrc,
        Number(candyPriceToCart)
      );
    } else {
      alert("Denna produkt saknas i lager!");
    }
    // count for clicks and display next to cart

    if (Number(candyStockQuantity) > 0) {
      totalAmount++;
    }
    if (totalAmount > 0 && Number(candyStockQuantity) > 0) {
      totalClicksEl.innerHTML = `<p>${totalAmount}</p>`;
    }
  }

  // Need to save data to Local Storage with every click on button
});

// empty cart array
export let carts: CartItem[] = [];

const cartlistEL = document.querySelector<HTMLElement>("#cart-list")!;
const cartEl = document.querySelector<HTMLElement>("#cart")!;

// function to add product to cart array and update quantity
const addToCart = (
  product_id: number,
  candyNameToCart: string,
  candyImageSrc: string,
  candyPriceToCart: number
) => {
  let productInCart = carts.findIndex((value) => value.id == product_id);
  // checks if cart is empty, then fill cart with info
  if (carts.length <= 0) {
    carts = [
      {
        price: candyPriceToCart,
        images: candyImageSrc,
        name: candyNameToCart,
        id: product_id,
        quantity: 1,
      },
    ];
    // checks if productInCart does not exists in cart, then push to cart
  } else if (productInCart < 0) {
    carts.push({
      price: candyPriceToCart,
      images: candyImageSrc,
      name: candyNameToCart,
      id: product_id,
      quantity: 1,
    });
    // if productInCart already is in cart, then only increase quantity by 1
  } else {
    carts[productInCart].quantity = carts[productInCart].quantity + 1;
  }
  //call function to render to cart
  addToCartRender();
  console.log("detta är carts : ", carts);
};

const totalCostEl = document.querySelector<HTMLElement>("#totalCost")!;
// render products to shoppingcart
const addToCartRender = () => {
  cartlistEL.innerHTML = ``;

  if (carts.length > 0) {
    cartEl.classList.remove("hide");

    const cartDefaultEl = document.querySelector<HTMLElement>("#cart-default")!;
    if (cartDefaultEl.classList.contains("empty-cart")) {
      cartDefaultEl.classList.add("hide");
    }

    let totalCost = 0;

    carts.forEach((cart) => {
      let newItemInCart = document.createElement("li");
      let priceProduct = cart.price * cart.quantity;

      totalCost += priceProduct;

      newItemInCart.classList.add("list-item");
      newItemInCart.innerHTML = `
      <div class="list-item-content">
        <img
          class="cart-thumbnail"
          src="${cart.images}"
          alt="Product thumbnail"
        />
        <div class="list-text-content">
          <p class="cart-item-title">${cart.name}</p>
          <p class="cart-item-price">Antal: ${cart.quantity} st</p>
          <p class="cart-item-price">Summa: ${priceProduct} kr</p>
        </div>
      </div>
      <button class="remove-item">
        <span class="fa-solid fa-xmark"></span>
      </button>
`;
      totalCostEl.innerHTML = `${totalCost} kr`;
      cartlistEL.appendChild(newItemInCart);
    });
  }
  const json = JSON.stringify(carts);
  localStorage.setItem("carts", json);
};

const cartWrapperEl = document.querySelector<HTMLElement>("#cart-wrapper")!;

const openCartEl = document.querySelector<HTMLElement>("#open-cart")!;

// Eventlistener for click on shopping cart, click will open cart
openCartEl.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  // check if click was on button
  if (target.classList.contains("fa-cart-shopping")) {
    cartWrapperEl.classList.remove("hide");
  }
});

// Eventlistener to close cart
const closeCartEl = document.querySelector<HTMLElement>("#close-cart")!;

closeCartEl.addEventListener("click", (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains("fa-xmark")) {
    cartWrapperEl.classList.add("hide");
  }
});

getAndRenderProducts();

// function to get items from local storage
export const getItemsFromLocalStorage = () => {
  const savedCarts: CartItem[] = JSON.parse(
    localStorage.getItem("carts") || "[]"
  );

  // update cart with data
  carts = savedCarts;
  // render items from local storage

  addToCartRender();
};

getItemsFromLocalStorage();
