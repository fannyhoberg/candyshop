import { fetchProducts } from "./api";
import { Product, ProductObject, CartItem } from "./types";
import { displayProductPopup, closePopup } from "./product-info-popup";
import "./submit-order";
import "./style.css";

// import "bootstrap/dist/css/bootstrap.css";

const container = document.querySelector<HTMLElement>("#product-container")!;
const productOverviewCount =
  document.querySelector<HTMLSpanElement>("#product-count")!;
const productOverviewInstock =
  document.querySelector<HTMLSpanElement>("#products-instock")!;
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
      return item.stock_status === "instock";
    });

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
    let candyImageSrc: {
      thumbnail: string;
    } = { thumbnail: "" };
    if (parentProductEl) {
      const candyImageElement = parentProductEl.querySelector(
        "#candy-image"
      ) as HTMLImageElement;

      // Kontrollera att candyImageElement inte är null innan du fortsätter
      if (candyImageElement) {
        candyImageSrc.thumbnail = candyImageElement.getAttribute("src") || "";
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

    let candyPriceTotal = Number(candyPriceToCart);
    // call function addToCart with value of clicked candy
    if (Number(candyStockQuantity) > 0) {
      addToCart(
        product_id,
        candyNameToCart,
        candyImageSrc,
        Number(candyPriceToCart),
        Number(candyPriceTotal)
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
};

// call the close popup function
closePopup(productInfoContainer, productInfoWrap);

// get items from local storage when page reloads

localStorage.getItem("carts") ?? "";

// FANNYS KOD NEDAN

let totalAmount = 0;

const totalClicksEl = document.querySelector<HTMLElement>(".totalClicks")!;

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

    console.log("carts tjohejsan: ", carts[productInCart].quantity);
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
      let priceProduct = cart.price * Number(cart.quantity);

      totalCost += priceProduct;

      newItemInCart.classList.add("list-item");
      newItemInCart.setAttribute("data-cart-id", cart.id.toString()); // THIS IS THE VALUE I WANT!!
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

    // reference to total cart div
    // add event listener to div and target "till kassan" button

    const goToCheckout =
      document.querySelector<HTMLElement>("#cart-total-wrap")!;
    //reference to checkout
    const checkout = document.querySelector<HTMLElement>(
      "#checkout-container"
    )!;

    goToCheckout?.addEventListener("click", (e) => {
      if ((e.target as HTMLElement).tagName === "BUTTON") {
        console.log("you want to go to checkout!");
        checkout.classList.remove("hide");
      }
    });
  }

  const json = JSON.stringify(carts);
  localStorage.setItem("carts", json);
};

const cartWrapperEl = document.querySelector<HTMLElement>("#cart-wrapper")!;

const openCartEl = document.querySelector<HTMLElement>("#open-cart")!;

const openCart = () => {
  // Eventlistener for click on shopping cart, click will open cart
  openCartEl.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // check if click was on button
    if (target.classList.contains("fa-cart-shopping")) {
      cartWrapperEl.classList.remove("hide");
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

  // update cart with data
  carts = savedCarts;
  // render items from local storage

  addToCartRender();
};

// MATTEAS CODE FOR REMOVING CART ITEM

// add eventlistener to cart UL and target close button
// the goal is to delete items from cart!!

document.querySelectorAll("#cart-list").forEach((listEl) => {
  //listen for clicks on the list
  listEl.addEventListener("click", (e) => {
    // if ((e.target as HTMLButtonElement).tagName === "BUTTON") {
    //   console.log("you want to remove item!");

    if ((e.target as HTMLElement).closest(".remove-item")) {
      //decrease totalAmount when item is removed
      totalAmount--;
      // render update totalAmount to DOM(cart symbol)
      totalClicksEl.innerHTML = `<p>${totalAmount}</p>`;
      console.log("total amount is: ", totalAmount);
      console.log("you want to remove item!");

      // get the data-cart-id from the parent (LI) element
      const parentLiEl = (e.target as HTMLElement).parentElement;
      console.log("parentLiEl is: ", parentLiEl);
      const clickedItemId = Number(parentLiEl?.dataset.cartId); // convert to a number

      console.log("clicked item id is: ", clickedItemId);
      // search cart for the item with the title "clickedItem"
      const clickedItem = carts.find((item) => {
        return item.id === clickedItemId;
      });
      console.log("clicked item is: ", clickedItem);

      carts = carts.filter((item) => item.id !== clickedItemId);

      addToCartRender();

      console.log("carts when deleting: ", carts);

      if (carts.length < 1) {
        totalCostEl.innerHTML = "0 kr";
      }
    }
  });
});

// END OF DELETING ITEMS CODE
getItemsFromLocalStorage();
