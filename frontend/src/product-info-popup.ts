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
  const clickedProduct = productArray.find(
    (product) => product.id === parseInt(productId)
  );

  if (clickedProduct) {
    // Show information about clicked product
    productInfoWrap.classList.remove("hide");
    candyName.innerHTML = `Produktnamn: ${clickedProduct.name}`;
    candyPrice.innerHTML = `Pris: ${clickedProduct.price} kr`;
    candyDescription.innerHTML = `Innehåll: ${clickedProduct.description}`;
    candyStock.innerHTML = `Lagerstatus: ${clickedProduct.stock_quantity}`;
    largeImage.src = `https://www.bortakvall.se${clickedProduct.images.large}`;
    largeImage.alt = `Large image of ${clickedProduct.name}`;

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
      productInfoWrap.classList.add("hide");
    }
  });
};
