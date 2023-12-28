import { submitOrder } from "./api";
import { NewOrder } from "./types";


const checkoutForm = document.querySelector<HTMLFormElement>('#checkout-form');
// const formInputFields = document.querySelectorAll<HTMLInputElement>('input.form-input');
// const formFirstName = document.querySelector<HTMLInputElement>('#first-name');
// const formLastName = document.querySelector<HTMLInputElement>('#last-name');
// const formAddress = document.querySelector<HTMLInputElement>('#address');
// const formPostcode = document.querySelector<HTMLInputElement>('#zipcode');
// const formCity = document.querySelector<HTMLInputElement>('#city');
// const formPhone = document.querySelector<HTMLInputElement>('#phone');
// const formEmail = document.querySelector<HTMLInputElement>('#email');

checkoutForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // const newOrder: NewOrder = {
    //   data: {
    //     customer_first_name: formFirstName?.value || "",
    //     customer_last_name: formLastName?.value || "",
    //     customer_address: formAddress?.value || "",
    //     customer_postcode: formPostcode?.value || "",
    //     customer_city: formCity?.value || "",
    //     customer_email: formEmail?.value || "",
    //     customer_phone: formPhone?.value || "",
    //     order_total: 5,
    //     order_items: [{}],
    //   }

    const newOrder = {
        customer_first_name: "Hanna",
        customer_last_name: "Söderholm",
        customer_address: "Nobelvägen 70A",
        customer_postcode: "212 15",
        customer_city: "Malmö",
        customer_email: "hms.soderholm@gmail.com",
        customer_phone: "",
        order_total: 5,
        order_items: [
            {
                product: "candy1",
                price: 12,
                quantity: 5
            },
            {
                product: "candy2",
                price: 12,
                quantity: 3
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
