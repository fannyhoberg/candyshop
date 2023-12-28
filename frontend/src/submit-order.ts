import { submitOrder } from "./api";
import { NewOrder } from "./types";


export const checkoutForm = document.querySelector<HTMLFormElement>('#checkout-form');
// const formInputFields = document.querySelectorAll<HTMLInputElement>('input.form-input');
const formFirstName = document.querySelector<HTMLInputElement>('#first-name');
const formLastName = document.querySelector<HTMLInputElement>('#last-name');
const formAddress = document.querySelector<HTMLInputElement>('#address');
const formPostcode = document.querySelector<HTMLInputElement>('#zipcode');
const formCity = document.querySelector<HTMLInputElement>('#city');
const formPhone = document.querySelector<HTMLInputElement>('#phone');
const formEmail = document.querySelector<HTMLInputElement>('#email');

checkoutForm?.addEventListener('submit', async (e) => {

    e.preventDefault();

    const newOrder: NewOrder = {
        customer_first_name: formFirstName?.value || "",
        customer_last_name: formLastName?.value || "",
        customer_address: formAddress?.value || "",
        customer_postcode: formPostcode?.value || "",
        customer_city: formCity?.value || "",
        customer_email: formEmail?.value || "",
        customer_phone: formPhone?.value || "",
        order_total: 24,
        order_items: [
            {
                product_id: 5216,
                qty: "2",
                item_price: 12,
                item_total: 24
            }
        ],
    }

    console.log("Will submit new order to API:", newOrder);

    try {
        // POST todo to the API
        await submitOrder(newOrder);
        console.log("submitted!");

        // Get the updated list of todos from the API

        // Finally, clear the input-field
        // if (formInputFields) {
        //     formInputFields.forEach(element => {
        //         element.value = "";
        //     })
        // }
    } catch (err) {
        alert("Could not submit order! Please check the server.")
    }
});
