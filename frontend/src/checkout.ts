import "./submit-order";
import {
  checkOutPage,
  checkoutForm,
  checkoutHeading,
  responseMessageDiv,
  checkoutSummaryDiv,
} from "./submit-order";
import { getItemsFromLocalStorage, cartWrapperEl } from "./main";
import { goToCheckout, cartDefaultEl, carts } from "./main";
import { SummaryItem } from "./types";

const summaryUl = document.querySelector<HTMLUListElement>(
  "#checkout-order-list"
);
const checkoutTotal =
  document.querySelector<HTMLParagraphElement>("#checkout-total");

// Close checkout funciton
export const closeCheckout = () => {
  checkOutPage?.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (target.id === "close-checkout") {
      checkOutPage?.classList.add("hide");

      if (
        checkoutForm?.classList.contains("hide") &&
        !responseMessageDiv?.classList.length
      ) {
        checkoutHeading!.innerText = "KASSA";
        checkoutForm.classList.remove("hide");
        responseMessageDiv?.classList.add("hide");
        cartWrapperEl.classList.add("hide");
        checkoutSummaryDiv?.classList.remove("hide");

        getItemsFromLocalStorage();

        if (carts.length < 1) {
          cartDefaultEl.classList.remove("hide");
          goToCheckout.classList.add("hide");
        }
      }
    }
  });
};

export const renderOrderSummary = () => {
  // Get localStorage cart information
  const savedCarts: SummaryItem[] = JSON.parse(
    localStorage.getItem("carts") || "[]"
  );

  // Assign to a variable
  let cartSummary = savedCarts;

  if (summaryUl) {
    const summaryTotal: number = cartSummary.reduce((total, item) => {
      return total + Number(item.price) * Number(item.quantity);
    }, 0);

    checkoutTotal!.innerText = `Totalt: ${summaryTotal} kronor`;

    summaryUl.innerHTML = cartSummary
      .map(
        (item) =>
          `<li class="checkout-list-element">
        <p>${item.name}</p>
        <p>${Number(item.price) * Number(item.quantity)} kronor</p>
        </li>`
      )
      .join("");
  }
};
