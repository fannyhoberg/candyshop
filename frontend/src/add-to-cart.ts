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
        console.log("Detta är candyname:", candyNameToCart);
      }
    }
    console.log("Detta är candyname:", candyNameToCart);

    // get reference for clicked candy image source
    let candyImageSrc: string = "";
    if (parentProductEl) {
      const candyImageElement = parentProductEl.querySelector(
        "#candy-image"
      ) as HTMLImageElement;

      // Kontrollera att candyImageElement inte är null innan du fortsätter
      if (candyImageElement) {
        candyImageSrc = candyImageElement.getAttribute("src") || "";

        console.log("Detta är candyImageSrc:", candyImageSrc);
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
        console.log("Detta är candyPriceToCart:", candyPriceToCart);
      }
    }
    console.log("Detta är candyPriceToCart:", candyPriceToCart);

    // call function addToCart with value of clicked candy
    addToCart(product_id, candyNameToCart, candyImageSrc, candyPriceToCart);

    // count for clicks and display next to cart
    totalAmount++;
    if (totalAmount > 0) {
      totalClicksEl.innerHTML = `<p>${totalAmount}</p>`;
    }
  }

  // Need to save data to Local Storage with every click on button
});

// empty cart array
let carts: Product[] = [];

const cartlistEL = document.querySelector<HTMLElement>("#cart-list")!;
const cartEl = document.querySelector<HTMLElement>("#cart")!;

// function to add product to cart array and update quantity
const addToCart = (
  product_id: number,
  candyNameToCart: string,
  candyImageSrc: string,
  candyPriceToCart: string
) => {
  console.log("Detta är candyname i addTocart:", candyNameToCart);
  console.log("Detta är product_id i addTocart:", product_id);

  let productInCart = carts.findIndex((value) => value.id == product_id);
  // checks if cart is empty, then fill cart with info
  if (carts.length <= 0) {
    carts = [
      {
        price: candyPriceToCart,
        images: candyImageSrc,
        name: candyNameToCart,
        id: product_id,
        stock_quantity: 1,
      },
    ];
    // checks if productInCart does not exists in cart, then push to cart
  } else if (productInCart < 0) {
    carts.push({
      price: candyPriceToCart,
      images: candyImageSrc,
      name: candyNameToCart,
      id: product_id,
      stock_quantity: 1,
    });
    // if productInCart already is in cart, then only increase quantity by 1
  } else {
    carts[productInCart].stock_quantity =
      carts[productInCart].stock_quantity + 1;
  }
  //call function to render to cart
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
      let priceProduct = cart.price * cart.stock_quantity;
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
          <p class="cart-item-price">Antal: ${cart.stock_quantity} st</p>
          <p class="cart-item-price">Summa: ${priceProduct} kr</p>
        </div>
      </div>
      <button class="remove-item">
        <span class="fa-solid fa-xmark"></span>
      </button>
`;
      cartlistEL.appendChild(newItemInCart);
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
