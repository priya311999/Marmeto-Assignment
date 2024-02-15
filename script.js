function fetchData() {
  const apiURL =
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json?v=1701948448";

  fetch(apiURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const productData = data.product;
      // console.log(productData);

      document.querySelector(".productVendor").textContent = productData.vendor;
      document.querySelector(".productTitle").textContent = productData.title;
      document.querySelector(".price").textContent = productData.price;
      document.querySelector(".compareAtPrice").textContent =
        productData.compare_at_price;
      document.querySelector(".productDescription").innerHTML =
        productData.description;
      // document.getElementById("image").src = productData.images[0].src;

      //Removing the "$" and "," , calculating and displaying the calculated discount %
      const price = parseFloat(
        productData.price.replace("$", "").replace(",", "")
      );
      const compareAtPrice = parseFloat(
        productData.compare_at_price.replace("$", "").replace(",", "")
      );
      const percentageOff = ((compareAtPrice - price) / compareAtPrice) * 100;

      const percentageOffElement = document.querySelector(".percentageOff");
      if (!isNaN(percentageOff) && percentageOff > 0) {
        percentageOffElement.textContent = `${percentageOff.toFixed(0)}% Off`;
      } else {
        percentageOffElement.textContent = "No discount";
      }

      //Dynamically generating and populating Thumbnail Images
      //   const thumbnailsContainer = document.querySelector(".thumbnails");
      //   thumbnailsContainer.innerHTML = "";
      //   productData.images.forEach((image) => {
      //     const img = document.createElement("img");
      //     img.src = image.src;
      //     img.alt = "Thumbnail";
      //     img.classList.add("thumbnail");
      //     img.addEventListener("click", () => {
      //       document.getElementById("image").src = image.src;
      //     });
      //     thumbnailsContainer.appendChild(img);
      //   });

      //Image links given in the API json file seems inactive,that's why using local images.
      //Populating Thumbnails
      // Get references to the product image and thumbnails
      const productImage = document.getElementById("image");
      const thumbnails = document.querySelectorAll(".thumbnails img");

      // Set the initial product image source
      productImage.src = thumbnails[0].src;

      // Add click event listeners to each thumbnail
      thumbnails.forEach((thumbnail) => {
        thumbnail.addEventListener("click", () => {
          // Set the clicked thumbnail as the product image
          productImage.src = thumbnail.src;
        });
      });

      //Dynamically generating and populating Color options
      function populateColorOptions() {
        const colorContainer = document.querySelector(".cContainer");
        colorContainer.innerHTML = "";
        productData.options[0].values.forEach((color, index) => {
          const colorDiv = document.createElement("div");
          const colorName = Object.keys(color)[0];
          colorDiv.style.backgroundColor = color[colorName];
          colorDiv.classList.add("color");
          colorDiv.dataset.color = colorName;

          colorDiv.addEventListener("click", () =>
            handleColorSelection(colorDiv, index)
          );

          colorContainer.appendChild(colorDiv);

          // Initially select the first color
          if (index === 0) {
            colorDiv.classList.add("selected");
            colorDiv.style.border = "2px solid black";
          }
        });
      }

      function handleColorSelection(selectedColorDiv) {
        const allColors = document.querySelectorAll(".color");
        allColors.forEach((color) => {
          color.classList.remove("selected");
          color.style.border = "none";
        });
        selectedColorDiv.classList.add("selected");
        selectedColorDiv.style.border = "2px solid black";
      }

      //Dynamically generating and populating Size options
      function populateSizeOptions() {
        const sizeContainer = document.querySelector(".sizeSelector");
        sizeContainer.innerHTML = "";
        productData.options[1].values.forEach((size, index) => {
          const sizeDiv = document.createElement("div");
          sizeDiv.classList.add("sizeTypeContainer");

          const input = document.createElement("input");
          const label = document.createElement("label");
          input.type = "radio";
          input.id = size.toLowerCase();
          input.name = "size";
          input.value = size;
          label.htmlFor = size.toLowerCase();
          label.textContent = size;

          sizeDiv.appendChild(input);
          sizeDiv.appendChild(label);

          sizeContainer.appendChild(sizeDiv);

          // Initially select the first size
          if (index === 0) {
            input.checked = true;
          }
        });
      }

      function updateAddToCartMessage() {
        const selectedColor = document.querySelector(".color.selected");
        const selectedSize = document.querySelector(
          'input[name="size"]:checked'
        );
        const addToCartMessage = document.querySelector(".add-to-cart-message");

        if (selectedColor && selectedSize) {
          const color = selectedColor.dataset.color;
          const size = selectedSize.value;

          const addedProductDetails = document.getElementById(
            "addedProductDetails"
          );
          addedProductDetails.textContent = `Embrace Sideboard with Color ${color}, Size ${size} added to cart`;

          addedProductDetails.style.background = "#E7F8B7";
          addedProductDetails.style.color = "#000000";
          addedProductDetails.style.fontFamily = "Inter";
          addedProductDetails.style.fontSize = "14px";
          addedProductDetails.style.fontWeight = "600";
          addedProductDetails.style.lineHeight = "28px";
          addedProductDetails.style.letterSpacing = "0";
          addedProductDetails.style.textAlign = "center";
          addedProductDetails.style.marginTop = "10px";

          addToCartMessage.style.display = "block";
        } else {
          addToCartMessage.style.display = "none";
        }
      }

      function handleSizeSelection() {
        updateAddToCartMessage();
      }

      const colors = document.querySelectorAll(".color");
      const sizeInputs = document.querySelectorAll('input[name="size"]');
      const addToCartButton = document.querySelector(".add-to-cart-btn");

      colors.forEach((color, index) => {
        color.addEventListener("click", () =>
          handleColorSelection(color, index)
        );
      });

      sizeInputs.forEach((size) => {
        size.addEventListener("change", handleSizeSelection);
      });

      //   populateThumbnails();
      populateColorOptions();
      populateSizeOptions();
      addToCartButton.addEventListener("click", updateAddToCartMessage);
    })
    .catch((error) => console.error("Error fetching data:", error));
}
fetchData();

function decrementValue() {
  let quantityElement = document.getElementById("quantityValue");
  let currentValue = parseInt(quantityElement.textContent);
  if (currentValue > 1) {
    quantityElement.textContent = currentValue - 1;
  }
}

// Function to increment the value
function incrementValue() {
  let quantityElement = document.getElementById("quantityValue");
  let currentValue = parseInt(quantityElement.textContent);

  quantityElement.textContent = currentValue + 1;
}
