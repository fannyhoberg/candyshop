import "./submit-order";
import { checkOutPage, checkoutForm, checkoutHeading, responseMessageDiv } from "./submit-order";
import { getItemsFromLocalStorage } from "./main";
import { goToCheckout, cartDefaultEl, carts } from "./main";

// Close checkout funciton
export const closeCheckout = () => {
    checkOutPage?.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLFormElement;

        if (target.id === "close-checkout") {
            console.log("You want to close the checkout!")
            checkOutPage?.classList.add("hide");

            if (checkoutForm?.classList.contains("hide") && !responseMessageDiv?.classList.length) {
                checkoutHeading!.innerText = "KASSA";
                checkoutForm.classList.remove("hide");
                responseMessageDiv?.classList.add("hide");

                getItemsFromLocalStorage();

                if (carts.length < 1) {
                    cartDefaultEl.classList.remove("hide");
                    goToCheckout.classList.add("hide");
                }
            };
        }
    });
};

// console.log("Back to homepage triggered");
// const clickedButton = e.target as HTMLButtonElement;

// // Check if the clicked element is the product card image
// if (clickedButton.id === "close-checkout") {
//     checkoutForm?.classList.add("hide");
// };