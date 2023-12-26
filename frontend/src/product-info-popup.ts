import { productArray } from "./main";

// export function to main.ts
export { handleProductClick };

// get reference to div-wrapper with class hide
const productInfoPopup =
  document.querySelector<HTMLElement>(".product-info-wrap")!;

// close-button

//const closePopup = document.querySelector<HTMLElement>("#close-product")!;

// large image

const largeImage = document.querySelector<HTMLImageElement>(
  ".product-image-large"
)!;

// h2-title

const candyName = document.querySelector<HTMLHeadingElement>("#candy-name")!;

// description

const candyDescription =
  document.querySelector<HTMLParagraphElement>("#candy-description")!;

// click event to show more info about product
const handleProductClick = (e: MouseEvent) => {
  const clickedElement = e.target as HTMLElement;

  // Check if the clicked element is a image with the class of candypic
  if (clickedElement?.classList.contains("product-image-thumbnail")) {
    console.log("You clicked candy");

    // Find closest parent element with dataset
    const parentProductEl = clickedElement.closest(
      ".product-card"
    ) as HTMLElement;

    // Check if parent element is found before usage
    if (parentProductEl) {
      // fetch product dataset from the closest parent element
      const productId = Number(parentProductEl.dataset.productId); // Konvertera till en siffra

      // Find the clicked product based on ID
      const clickedProduct = productArray.find((product) => {
        return product.id === productId;
      });

      // Show information about clicked product
      if (clickedProduct) {
        productInfoPopup.classList.remove("hide");
        candyName.innerHTML = `Produktnamn: ${clickedProduct.name}`;
        candyDescription.innerHTML = `Innehåll: ${clickedProduct.description}`;

        // add large pic when info pops up
        largeImage.src = `https://www.bortakvall.se${clickedProduct.images.large}`;
        largeImage.alt = `Large image of ${clickedProduct.name}`;

        // old code from testpage
        //readMoreInfo.appendChild(infoImage);

        console.log("product-id: ", clickedProduct.id);
      }
    }
  }
};

/*

function for closing popup is a work in progress atm! 

// close the popup

const handleClosePopup = () => {
  productInfoPopup.classList.add("hide");
  console.log("you wish to close the popup!");
};

closePopup?.addEventListener("click", handleClosePopup);

*/
