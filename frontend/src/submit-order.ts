import { submitOrder } from "./api";
import { totalClicksEl } from "./main";
import { NewOrder, OrderData } from "./types";
import { CartItem, OrderItem } from "./types";
// import { getItemsFromLocalStorage } from "./main";

export const checkOutPage = document.querySelector<HTMLElement>('#checkout-container');
export const checkoutHeading = document.querySelector<HTMLHeadingElement>('#checkout-heading');
export const checkoutForm = document.querySelector<HTMLFormElement>('#checkout-form');
export const responseMessageDiv = document.querySelector<HTMLDivElement>('#response-message');
export const checkoutSummaryDiv = document.querySelector<HTMLDivElement>('#checkout-order-container');
const formFirstName = document.querySelector<HTMLInputElement>('#first-name');
const formLastName = document.querySelector<HTMLInputElement>('#last-name');
const formAddress = document.querySelector<HTMLInputElement>('#address');
const formPostcode = document.querySelector<HTMLInputElement>('#zipcode');
const formCity = document.querySelector<HTMLInputElement>('#city');
const formPhone = document.querySelector<HTMLInputElement>('#phone');
const formEmail = document.querySelector<HTMLInputElement>('#email');

let orderToSubmit: CartItem[] = [];

const resetForm = () => {
    const inputFields = checkoutForm?.querySelectorAll('input');

    inputFields?.forEach((field) => {
        field.value = "";
    })
}

const renderSuccessMessage = (orderData: OrderData) => {
    checkoutHeading!.innerText = "Tack för din beställning!";
    checkoutForm?.classList.add("hide");
    responseMessageDiv?.classList.remove("hide");
    checkoutSummaryDiv?.classList.add("hide");

    responseMessageDiv!.innerHTML = `
       <p>Ditt ordernummer är #${orderData.id}</p>
    `
};

const renderErrorMessage = () => {
    checkoutHeading!.innerText = "Något gick fel!";
    checkoutForm?.classList.add("hide");
    responseMessageDiv?.classList.remove("hide");
    checkoutSummaryDiv?.classList.add("hide");

    responseMessageDiv!.innerHTML = `
       <p>Försök igen senare.</p>
    `
}


// Function to transform a cart item into an order item
const transformOrderItem = (cartItem: CartItem): OrderItem => {
    return {
        product_id: cartItem.id,
        qty: cartItem.quantity,
        item_price: cartItem.price,
        item_total: cartItem.total,
    };
}

// Retrieve localStorage and transform it to an array that matches the order template
export const localStorageConvert = (localStorageArray: string): OrderItem[] => {
    orderToSubmit = JSON.parse(localStorage.getItem(localStorageArray) || "[]");
    console.log("this is the order before converting", orderToSubmit);

    const convertOrderToTemplate: OrderItem[] = orderToSubmit.map(transformOrderItem);
    return convertOrderToTemplate;
};

export let convertedOrderToSubmit = localStorageConvert("carts");
console.log("this is the order after converting", convertedOrderToSubmit)

// // Calculate total order cost
// const totalOrderPrice: number = convertedOrderToSubmit.reduce((total, orderItem) => {
//     return total + (Number(orderItem.qty) * orderItem.item_price);
// }, 0);

// console.log("This is the total order price:", totalOrderPrice);

checkoutForm?.addEventListener('submit', async (e) => {

    e.preventDefault();

    convertedOrderToSubmit = localStorageConvert("carts");
    console.log("this is the order after converting", convertedOrderToSubmit)

    // Calculate total order cost
    const totalOrderPrice: number = convertedOrderToSubmit.reduce((total, orderItem) => {
        return total + (Number(orderItem.qty) * orderItem.item_price);
    }, 0);

    console.log("This is the total order price:", totalOrderPrice);

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
    }

    console.log("Will submit new order to API:", newOrder);

    try {
        // Call makeApiCall instead of submitOrder
        const response = await submitOrder(newOrder);
        console.log("submitted!", response);

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
        alert("Could not submit order! Please check the server.");
    }

    // try {
    //     // POST todo to the API
    //     const response = await submitOrder(newOrder);
    //     console.log("submitted!", response);

    //     const orderData = response.data;

    //     console.log("This is your order data: ", orderData.id);

    //     console.log(response.status);

    //     if (response.status = "success") {
    //         renderSuccessMessage(orderData);
    //         localStorage.removeItem("carts");
    //     }

    //     // let orders = await fetchOrders();
    //     // console.log("These are all orders", orders);




    // } catch (err) {
    //     alert("Could not submit order! Please check the server.")
    // }
});
