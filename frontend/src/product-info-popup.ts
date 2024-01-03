import { Product } from "./types";
export { displayProductPopup, closePopup };

// Function to display product popup
const displayProductPopup = (
  productId: string,
  productArray: Product[],
  productInfoWrap: HTMLElement,
  candyName: HTMLHeadingElement,
  candyPrice: HTMLElement,
  candyDescription: HTMLParagraphElement,
  candyStock: HTMLElement,
  largeImage: HTMLImageElement
) => {
  console.log("Display Product Popup triggered");
  const clickedProduct = productArray.find(
    (product) => product.id === parseInt(productId)
  );

  console.log("Clicked Product: ", clickedProduct);

  if (clickedProduct) {
    // Show information about clicked product
    productInfoWrap.classList.remove("hide");
    candyName.innerHTML = `Produktnamn: ${clickedProduct.name}`;
    candyPrice.innerHTML = `Pris: ${clickedProduct.price} kr`;
    candyDescription.innerHTML = `Innehåll: ${clickedProduct.description}`;
    candyStock.innerHTML = `Lagerstatus: ${clickedProduct.stock_quantity}`;
    largeImage.src = `https://www.bortakvall.se${clickedProduct.images.large}`;
    largeImage.alt = `Large image of ${clickedProduct.name}`;

    console.log("product-id: ", clickedProduct.id);

    if (clickedProduct.stock_quantity === null) {
      candyStock.innerHTML = `Lagerstatus: 0`;
    }
  }
};

const closePopup = (
  productInfoContainer: HTMLElement,
  productInfoWrap: HTMLElement
) => {
  productInfoContainer.addEventListener("click", (e) => {
    if ((e.target as HTMLElement)?.tagName === "SPAN") {
      e.stopPropagation(); // prevents event from bubbling up
      console.log("you clicked x!");
      productInfoWrap.classList.add("hide");
    }
  });
};
