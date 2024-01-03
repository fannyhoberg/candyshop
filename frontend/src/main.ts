import { fetchProducts } from "./api";
import { Product, ProductObject, CartItem } from "./types";
import { displayProductPopup, closePopup } from "./product-info-popup";
import { closeCheckout } from "./checkout";
import { renderOrderSummary } from "./checkout";
import "./submit-order";
import "./style.css";

const container = document.querySelector<HTMLElement>("#product-container")!;
const productOverviewCount =
  document.querySelector<HTMLSpanElement>("#product-count")!;
const productOverviewInstock =
  document.querySelector<HTMLSpanElement>("#products-instock")!;

// reference to cart total wrap
export const goToCheckout =
  document.querySelector<HTMLElement>("#cart-total-wrap")!;
// reference to cart default
export const cartDefaultEl =
  document.querySelector<HTMLElement>("#cart-default")!;

// declare variables for handleProductClick function

const productInfoWrap =
  document.querySelector<HTMLElement>(".product-info-wrap")!;
const largeImage = document.querySelector<HTMLImageElement>(
  ".product-image-large"
)!;
const candyStock = document.querySelector<HTMLElement>("#candy-popup-stock")!;
let candyName = document.querySelector<HTMLHeadingElement>("#candy-name")!;
const candyPrice = document.querySelector<HTMLElement>("#candy-popup-price")!;
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

    // create array from "data" keyword (on ProducObject)
    productArray = products.data;

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
      return item.stock_status === "instock";
    });

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
  // querySelectorAll on (".product-card") returns a node list of HTML elements
  // the node list consists of all elements with the class of product-card
  const productCards = document.querySelectorAll(
    ".product-card"
  ) as NodeListOf<HTMLElement>;

  productCards.forEach((productCard) => {
    productCard.addEventListener("click", handleProductClick);
  });

  array.forEach((product) => {
    if (product.stock_quantity < 1) {
      const productId = product.id;
      const addToCartButton = document.querySelector<HTMLButtonElement>(
        `[data-id="${productId}"]`
      );

      if (addToCartButton) addToCartButton.disabled = true;
    }
  });
};

const handleProductClick = (e: MouseEvent) => {
  let clickedElement = e.target as HTMLElement;
  // When someething is clicked, Retrieve the product ID from the data attribute
  // keep in scope of entire function for re-usability

  // Retrieve the product ID from the data attribute
  let productId =
    (clickedElement.closest(".product-card") as HTMLElement)?.dataset
      .productId ?? ""; // handle if productId is undefined

  // Check if the clicked element is the product card image
  if (clickedElement.classList.contains("product-image-thumbnail")) {
    // Call a function to display a pop-up or perform any other action
    // only run if productId is not undefined

    if (productId !== undefined) {
      displayProductPopup(
        productId,
        productArray,
        productInfoWrap,
        candyName,
        candyPrice,
        candyDescription,
        candyStock,
        largeImage
      );
    }
  }

  // check if click was on button
  if (clickedElement.tagName === "BUTTON") {
    // find the clicked product from array
    const clickedProduct = productArray.find(
      (product) => product.id === Number(productId)
    );

    let candyNameToCart: string = "";
    let candyPriceToCart: string = "";
    let candyStockQuantity: string = "";
    let candyImageSrc: {
      thumbnail: string;
    } = { thumbnail: "" };

    if (clickedProduct) {
      candyName.innerHTML = clickedProduct.name;
      candyNameToCart = candyName.innerHTML;
      candyPriceToCart = clickedProduct.price.toString();
      candyStockQuantity = clickedProduct.stock_quantity.toString();
      candyImageSrc.thumbnail = `https://www.bortakvall.se${clickedProduct.images.thumbnail}`;
    }

    let candyPriceTotal = Number(candyPriceToCart);
    // call function addToCart with value of clicked candy
    if (Number(candyStockQuantity) > 0) {
      addToCart(
        Number(productId),
        candyNameToCart,
        candyImageSrc,
        Number(candyPriceToCart),
        Number(candyPriceTotal)
      );
    }
    // count for clicks and display next to cart

    if (Number(candyStockQuantity) > 0) {
      totalAmount++;
    }
    if (totalAmount > 0 && Number(candyStockQuantity) > 0) {
      totalClicksEl.innerHTML = `<p>${totalAmount}</p>`;
    }

    // setItem totalAmount to localStorage
    const totalAmountjson = JSON.stringify(totalAmount);
    localStorage.setItem("totalAmount", totalAmountjson);
  }
};

// call the close popup function
closePopup(productInfoContainer, productInfoWrap);

// get items from local storage when page reloads

export let totalAmount = 0;

export const totalClicksEl =
  document.querySelector<HTMLElement>(".totalClicks")!;

// empty cart array
export let carts: CartItem[] = [];

let cartlistEL = document.querySelector<HTMLElement>("#cart-list")!;

const cartEl = document.querySelector<HTMLElement>("#cart")!;

// function to add product to cart array and update quantity
const addToCart = (
  product_id: number,
  candyNameToCart: string,
  candyImageSrc: { thumbnail: string },
  candyPriceToCart: number,
  candyPriceTotal: number
) => {
  let productInCart = carts.findIndex((value) => value.id == product_id);

  // checks if cart is empty, then fill cart with info
  if (carts.length <= 0) {
    carts = [
      {
        total: candyPriceTotal,
        price: candyPriceToCart,
        images: candyImageSrc,
        name: candyNameToCart,
        id: product_id,
        quantity: "1",
      },
    ];
    // checks if productInCart does not exists in cart, then push to cart
  } else if (productInCart < 0) {
    carts.push({
      total: candyPriceTotal,
      price: candyPriceToCart,
      images: candyImageSrc,
      name: candyNameToCart,
      id: product_id,
      quantity: "1",
    });
    // if productInCart already is in cart, then only increase quantity by 1
    // also calculate total price when user adds same item more than once
  } else {
    let updatedQty = Number(carts[productInCart].quantity) + 1;
    carts[productInCart].quantity = updatedQty.toString();
    carts[productInCart].total =
      Number(carts[productInCart].quantity) * candyPriceToCart;
  }
  //call function to render to cart
  addToCartRender();
  renderOrderSummary();
};

const totalCostEl = document.querySelector<HTMLElement>("#totalCost")!;
// render products to shoppingcart
const addToCartRender = () => {
  cartlistEL.innerHTML = ``;

  if (carts.length > 0) {
    cartEl.classList.remove("hide");
    goToCheckout.classList.remove("hide");

    if (cartDefaultEl.classList.contains("empty-cart")) {
      cartDefaultEl.classList.add("hide");
    }

    let totalCost = 0;

    carts.forEach((cart) => {
      let newItemInCart = document.createElement("li");
      let priceProduct = cart.price * Number(cart.quantity);

      totalCost += priceProduct;

      newItemInCart.classList.add("list-item");
      newItemInCart.setAttribute("data-cart-id", cart.id.toString());
      newItemInCart.innerHTML = `
      <div class="list-item-content">
        <img
          class="cart-thumbnail"
          src="${cart.images.thumbnail}"
          alt="Product thumbnail"
        />
        <div class="list-text-content">
          <p class="cart-item-title">${cart.name}</p>
          <p class="cart-item-price">Antal: ${cart.quantity} st</p>
          <p class="cart-item-price">Summa: ${priceProduct} kr</p>
        </div>
      </div>
      <button class="remove-item">
        x
      </button>
`;

      cartlistEL.appendChild(newItemInCart);
    });

    totalCostEl.innerHTML = `${totalCost} kr`;
    // go to checkout from cart

    // add event listener to div and target "till kassan" button
    //reference to checkout
    const checkout = document.querySelector<HTMLElement>(
      "#checkout-container"
    )!;

    goToCheckout?.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).tagName === "BUTTON") {
        checkout.classList.remove("hide");
      }
    });
  }

  const json = JSON.stringify(carts);
  localStorage.setItem("carts", json);
};

export const cartWrapperEl =
  document.querySelector<HTMLElement>("#cart-wrapper")!;

const openCartEl = document.querySelector<HTMLElement>("#open-cart")!;

const openCart = () => {
  // Eventlistener for click on shopping cart, click will open cart
  openCartEl.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // check if click was on button
    if (target.classList.contains("fa-cart-shopping")) {
      cartWrapperEl.classList.remove("hide");
    }

    if (totalAmount === 0) {
      cartEl.classList.add("hide");
    }
  });
};

openCart();

// Eventlistener to close cart
const closeCartEl = document.querySelector<HTMLElement>("#close-cart")!;

const closeCart = () => {
  closeCartEl.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("fa-xmark")) {
      cartWrapperEl.classList.add("hide");
    }
  });
};
closeCart();

getAndRenderProducts();

// function to get items from local storage
export const getItemsFromLocalStorage = () => {
  const savedCarts: CartItem[] = JSON.parse(
    localStorage.getItem("carts") || "[]"
  );

  // Get totalAmount from local storage
  const savedTotalAmount = JSON.parse(
    localStorage.getItem("totalAmount") || "0"
  );

  // update cart with data
  carts = savedCarts;

  // Update totalAmount with data
  totalAmount = savedTotalAmount;

  // render items from local storage
  addToCartRender();
  renderOrderSummary();

  // Update totalClicksEl based on totalAmount when page reload
  if (totalAmount > 0) {
    totalClicksEl.innerHTML = `<p>${totalAmount}</p>`;
  }
};

// add eventlistener to cart UL and target close button

document.querySelectorAll("#cart-list").forEach((listEl) => {
  //listen for clicks on the list
  listEl.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest(".remove-item")) {
      // get the data-cart-id from the parent (LI) element
      const parentLiEl = (e.target as HTMLElement).parentElement;

      const clickedItemId = Number(parentLiEl?.dataset.cartId); // convert to a number

      // search cart for the item with the title "clickedItem"
      const clickedItem = carts.find((item) => {
        return item.id === clickedItemId;
      });

      carts = carts.filter((item) => item.id !== clickedItemId);

      addToCartRender();
      renderOrderSummary();

      if (carts.length < 1) {
        cartDefaultEl.classList.remove("hide");
        totalCostEl.innerHTML = "0 kr";
      }

      //decrease totalAmount when item is removed
      totalAmount -= Number(clickedItem?.quantity);

      // Update totalAmount in local storage
      const totalAmountjson = JSON.stringify(totalAmount);
      localStorage.setItem("totalAmount", totalAmountjson);

      if (totalAmount === 0) {
        totalClicksEl.innerHTML = `<p></p>`;
        cartEl.classList.add("hide");
      } else {
        totalClicksEl.innerHTML = `<p>${totalAmount}</p>`;
      }
    }
  });
});

// END OF DELETING ITEMS CODE
getItemsFromLocalStorage();

closeCheckout();
