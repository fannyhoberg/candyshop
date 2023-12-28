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

    // call function addToCart and send clicked products id
    addToCart(product_id);
    totalAmount++;
    if (totalAmount > 0) {
      totalClicksEl.innerHTML = `<p>${totalAmount}</p>`;
    }
  }

  const parentProductEl = target.closest(".product-card") as HTMLElement;

  console.log("Detta är parentProductEl; ", parentProductEl);

  // Need to save data to Local Storage with every click on button
});

// empty cart array
let carts: Product[] = [];

const cartlistEL = document.querySelector<HTMLElement>("#cart-list")!;
const cartEl = document.querySelector<HTMLElement>("#cart")!;

// function to add product to cart with id and quantity
const addToCart = (product_id: number) => {
  let productInCart = carts.findIndex((value) => value.id == product_id);
  // checks if cart is empty, then fill cart with info
  if (carts.length <= 0) {
    carts = [
      {
        id: product_id,
        stock_quantity: 1,
      },
    ];
    // checks if productInCart does not exists in cart, then push to cart
  } else if (productInCart < 0) {
    carts.push({
      id: product_id,
      stock_quantity: 1,
    });
    // if productInCart already is in cart, then only increase quantity by 1
  } else {
    carts[productInCart].stock_quantity =
      carts[productInCart].stock_quantity + 1;
  }
  addToCartRender();
  console.log("detta är cartlist : ", cartEl);
};

// render products to shoppingcart
const addToCartRender = () => {
  cartlistEL.innerHTML = ``;
  if (carts.length > 0) {
    cartEl.classList.remove("hide");

    const cartDefaultEl = document.querySelector<HTMLElement>("#cart-default")!;
    if (cartDefaultEl.classList.contains("empty-cart")) {
      cartDefaultEl.classList.add("hide");
    }

    carts.forEach((cart) => {
      console.log("detta är carts i for each: ", carts);
      let newItemInCart = document.createElement("li");
      newItemInCart.classList.add("list-item");
      newItemInCart.innerHTML = `
      <div class="list-item-content">
        <img
          class="cart-thumbnail"
          src="https://www.bortakvall.se/storage/products/thumbnails/1997509-300x300.png"
          alt="Product thumbnail"
        />
        <div class="list-text-content">
          <p class="cart-item-title">Gott & Blandat Giants</p>
          <p class="cart-item-title">Id: ${cart.id}</p>
          <p class="cart-item-price">Antal: ${cart.stock_quantity}</p>
          <p class="cart-item-price">24 kronor</p>
        </div>
      </div>
      <button class="remove-item">
        <span class="fa-solid fa-xmark"></span>
      </button>
`;
      cartlistEL.appendChild(newItemInCart);
      // console.log("detta är cartlist : ", cartlistEL);
    });
  }
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
