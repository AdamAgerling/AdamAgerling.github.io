document.addEventListener("DOMContentLoaded", async function () {
  let weapons = [];
  let cart = [];
  const weaponsPerPage = 6;
  let currentIndex = 0;

  const fetchData = async (url) => {
    try {
      const cachedData = localStorage.getItem("weapons");
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      localStorage.setItem("weapons", JSON.stringify(data.data));
      return data.data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderWeapons = (weapons) => {
    const weaponsContainer = document.getElementById("weapons");
    const loadMoreContainer = document.getElementById("loadMoreContainer");
    const endIndex = Math.min(currentIndex + weaponsPerPage, weapons.length);

    for (let i = currentIndex; i < endIndex; i++) {
      const weapon = weapons[i];

      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      const card = document.createElement("div");
      card.className = "card custom-pointer";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("p");
      cardTitle.className = "card-title text-center fs-4 fw-bold";
      cardTitle.textContent = weapon.displayName;

      const cardLine = document.createElement("hr");

      const cardText = document.createElement("p");
      cardText.className = "card-text text-center";
      cardText.textContent = weapon.shopData?.cost || "No cost available.";

      const cardImage = document.createElement("img");
      cardImage.className = "card-img-top weapon-img";
      cardImage.src = weapon.displayIcon;
      cardImage.alt = weapon.displayName;

      const addToCartButton = document.createElement("button");
      addToCartButton.className = "btn btn-primary w-100";
      addToCartButton.textContent = "Lägg till i varukorgen";
      addToCartButton.addEventListener("click", () => addToCart(weapon));

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardLine);
      cardBody.appendChild(cardText);
      cardBody.appendChild(addToCartButton);
      card.appendChild(cardImage);
      card.appendChild(cardBody);
      col.appendChild(card);
      weaponsContainer.appendChild(col);
    }

    currentIndex = endIndex;
    if (loadMoreContainer) {
      weaponsContainer.appendChild(loadMoreContainer);
    }

    updateLoadMoreButton();
  };

  const updateLoadMoreButton = () => {
    const loadMoreButton = document.getElementById("loadMore");
    if (!loadMoreButton) return;
    if (currentIndex >= weapons.length) {
      loadMoreButton.classList.add("d-none");
    } else {
      loadMoreButton.classList.remove("d-none");
    }
  };

  const addToCart = (weapon) => {
    const existingItem = cart.find((item) => item.uuid === weapon.uuid);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...weapon, quantity: 1 });
    }
    updateCartUI();
  };

  const updateCartUI = () => {
    const cartCount = document.getElementById("cart-count");
    cartCount.textContent = cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  };

  window.adjustQuantity = (uuid, change) => {
    const item = cart.find((item) => item.uuid === uuid);
    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        cart = cart.filter((item) => item.uuid !== uuid);
      }
      updateCartUI();
      updateCartModal();
    }
  };

  const updateCartModal = () => {
    const modalBody = document.getElementById("cartModalBody");

    if (!modalBody) {
      openCartModal();
      return;
    }

    const totalCost = cart.reduce((sum, item) => {
      return sum + (item.shopData?.cost || 0) * item.quantity;
    }, 0);

    modalBody.innerHTML = `
      ${cart.length === 0 ? "<p>The shopping cart is empty.</p>" : ""}
      <ul>
        ${cart
          .map(
            (item) => `
          <li>
            ${item.displayName} - ${item.shopData?.cost || 0} Credits
            <br/>
            Quantity: ${item.quantity}
            <button class="btn btn-sm btn-danger" onclick="adjustQuantity('${
              item.uuid
            }', -1)">-</button>
            <button class="btn btn-sm btn-success" onclick="adjustQuantity('${
              item.uuid
            }', 1)">+</button>
          </li>
          <hr/>
        `
          )
          .join("")}
      </ul>
      <p class="text-center fs-5 fw-bold">Total cost: ${totalCost} Credits</p>
     ${
       cart.length === 0
         ? ""
         : "<button class='btn btn-success w-100'>Checkout</button>"
     }
    `;
  };

  const openCartModal = () => {
    let existingModal = document.getElementById("cartModal");

    if (!existingModal) {
      const modalContent = `
        <div class="modal fade" id="cartModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Shopping cart</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body" id="cartModalBody">
                <p>Varukorgen är tom.</p>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML("beforeend", modalContent);
      existingModal = document.getElementById("cartModal");
    }

    updateCartModal();
    const cartModal = new bootstrap.Modal(existingModal);
    cartModal.show();
  };
  const initLoadMoreButton = () => {
    const loadMoreContainer = document.getElementById("loadMoreContainer");

    const button = document.createElement("button");
    button.id = "loadMore";
    button.textContent = "Load More Weapons";
    button.className = "btn btn-danger d-block mx-auto my-3 ";
    loadMoreContainer.appendChild(button);

    button.addEventListener("click", () => renderWeapons(weapons));
  };

  const initCartIcon = () => {
    const cartIcon = document.getElementById("cart-icon");
    cartIcon.innerHTML =
      "<span id='cart-count' class='fs-4 text-light'>0</span><span class='fs-3'>🛒</span>";
    cartIcon.addEventListener("click", openCartModal);
  };

  weapons = await fetchData("https://valorant-api.com/v1/weapons");
  renderWeapons(weapons);
  initCartIcon();
  initLoadMoreButton();
  addFooter();
});

function addFooter() {
  const footerElement = document.createElement("div");
  footerElement.className = "bg-dark text-light";
  footerElement.innerHTML = `
    <footer class="py-3">
      <ul class="nav justify-content-center border-bottom pb-3 mb-3">
        <li class="nav-item">
          <a href="/" class="nav-link px-2 text-light">Home</a>
        </li>
        <li class="nav-item">
          <a href="/navigation/agents.html" class="nav-link px-2 text-light">Agents</a>
        </li>
        <li class="nav-item">
          <a href="/navigation/maps.html" class="nav-link px-2 text-light">Maps</a>
        </li>
        <li class="nav-item">
          <a href="/navigation/fakeshop.html" class="nav-link px-2 text-light">Fake shop</a>
        </li>
        <li class="nav-item">
          <a href="/navigation/about.html" class="nav-link px-2 text-light">About us</a>
        </li>
      </ul>
      <p class="text-center text-body-light">© 2025 Vaken, Inc</p>
    </footer>
  `;
  document.body.appendChild(footerElement);
}
