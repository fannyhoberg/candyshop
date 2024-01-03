import { submitOrder } from "./api";
import { totalClicksEl } from "./main";
import { NewOrder, OrderData } from "./types";
import { CartItem, OrderItem } from "./types";

export const checkOutPage = document.querySelector<HTMLElement>(
  "#checkout-container"
);
export const checkoutHeading =
  document.querySelector<HTMLHeadingElement>("#checkout-heading");
export const checkoutForm =
  document.querySelector<HTMLFormElement>("#checkout-form");
export const responseMessageDiv =
  document.querySelector<HTMLDivElement>("#response-message");
export const checkoutSummaryDiv = document.querySelector<HTMLDivElement>(
  "#checkout-order-container"
);
const formFirstName = document.querySelector<HTMLInputElement>("#first-name");
const formLastName = document.querySelector<HTMLInputElement>("#last-name");
const formAddress = document.querySelector<HTMLInputElement>("#address");
const formPostcode = document.querySelector<HTMLInputElement>("#zipcode");
const formCity = document.querySelector<HTMLInputElement>("#city");
const formPhone = document.querySelector<HTMLInputElement>("#phone");
const formEmail = document.querySelector<HTMLInputElement>("#email");

let orderToSubmit: CartItem[] = [];

const resetForm = () => {
  const inputFields = checkoutForm?.querySelectorAll("input");

  inputFields?.forEach((field) => {
    if (field.type !== "submit") field.value = "";
  });
};

const renderSuccessMessage = (orderData: OrderData) => {
  checkoutHeading!.innerText = "Tack för din beställning!";
  checkoutForm?.classList.add("hide");
  responseMessageDiv?.classList.remove("hide");
  checkoutSummaryDiv?.classList.add("hide");

  responseMessageDiv!.innerHTML = `
       <p>Ditt ordernummer är #${orderData.id}</p>
    `;
};

const renderErrorMessage = () => {
  checkoutHeading!.innerText = "Något gick fel!";
  checkoutForm?.classList.add("hide");
  responseMessageDiv?.classList.remove("hide");
  checkoutSummaryDiv?.classList.add("hide");

  responseMessageDiv!.innerHTML = `
       <p>Försök igen senare.</p>
    `;
};

// Function to transform a cart item into an order item
const transformOrderItem = (cartItem: CartItem): OrderItem => {
  return {
    product_id: cartItem.id,
    qty: cartItem.quantity,
    item_price: cartItem.price,
    item_total: cartItem.total,
  };
};

// Retrieve localStorage and transform it to an array that matches the order template
export const localStorageConvert = (localStorageArray: string): OrderItem[] => {
  orderToSubmit = JSON.parse(localStorage.getItem(localStorageArray) || "[]");

  const convertOrderToTemplate: OrderItem[] =
    orderToSubmit.map(transformOrderItem);
  return convertOrderToTemplate;
};

export let convertedOrderToSubmit = localStorageConvert("carts");

checkoutForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  convertedOrderToSubmit = localStorageConvert("carts");

  // Calculate total order cost
  const totalOrderPrice: number = convertedOrderToSubmit.reduce(
    (total, orderItem) => {
      return total + Number(orderItem.qty) * orderItem.item_price;
    },
    0
  );

  const newOrder: NewOrder = {
    customer_first_name: formFirstName?.value || "",
    customer_last_name: formLastName?.value || "",
    customer_address: formAddress?.value || "",
    customer_postcode: formPostcode?.value || "",
    customer_city: formCity?.value || "",
    customer_email: formEmail?.value || "",
    customer_phone: formPhone?.value || "",
    order_total: totalOrderPrice,
    order_items: convertedOrderToSubmit,
  };

  if (formPostcode!.value.length > 6) {
    alert("Ditt postnummer får inte vara längre än 6 tecken");
    return;
  }

  try {
    // Call makeApiCall instead of submitOrder
    const response = await submitOrder(newOrder);

    if (response && response.status === "success") {
      renderSuccessMessage(response.data);
      localStorage.removeItem("carts");
      let totalAmount = 0;

      if (totalAmount === 0) {
        totalClicksEl.innerHTML = `<p></p>`;
      }

      const totalAmountjson = JSON.stringify(totalAmount);
      localStorage.setItem("totalAmount", totalAmountjson);

      resetForm();
    } else if (response && response.status === "fail") {
      renderErrorMessage();
    }
  } catch (err) {
    alert("Servern kunde inte nås! Försök igen om en stund.");
  }
});
