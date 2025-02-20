document.addEventListener("DOMContentLoaded", async function () {
  let agents = [];
  let currentIndex = 0;
  const agentsPerPage = 9;

  async function CacheImage(url) {
    const cache = await caches.open("image-cache");
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      return url;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      await cache.put(url, response.clone());
      return url;
    } catch (error) {
      console.error("Error caching image:", error);
      return url;
    }
  }

  const fetchData = async (url) => {
    try {
      const cachedData = localStorage.getItem("agents");
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const filteredAgents = data.data.filter(
        (agent) => agent.isPlayableCharacter
      );
      localStorage.setItem("agents", JSON.stringify(filteredAgents));
      return filteredAgents;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderAgents = () => {
    const agentsContainer = document.getElementById("agents");
    const loadMoreContainer = document.getElementById("loadMoreContainer");
    const endIndex = Math.min(currentIndex + agentsPerPage, agents.length);

    for (let i = currentIndex; i < endIndex; i++) {
      const agent = agents[i];

      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      const card = document.createElement("div");
      card.className = "card custom-pointer";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("p");
      cardTitle.className = "card-title text-center fs-4 fw-bold";
      cardTitle.textContent = agent.displayName;

      const cardLine = document.createElement("hr");

      const cardText = document.createElement("p");
      cardText.className = "card-text";
      cardText.textContent = agent.description || "No description available.";

      const cardImage = document.createElement("img");
      cardImage.className = "card-img-top c-item";
      cardImage.fetchpriority = "high";
      cardImage.src = agent.displayIcon;
      cardImage.alt = agent.displayName;

      card.addEventListener("click", () => {
        openAgentModal(agent);
      });

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardLine);
      cardBody.appendChild(cardText);
      card.appendChild(cardImage);
      card.appendChild(cardBody);
      col.appendChild(card);
      agentsContainer.appendChild(col);
    }

    currentIndex = endIndex;
    if (loadMoreContainer) {
      agentsContainer.appendChild(loadMoreContainer);
    }
    updateLoadMoreButton();
    lazyLoadImages();
  };

  const lazyLoadImages = () => {
    const lazyImages = document.querySelectorAll("img.lazy-load");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(async (entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = await cacheImage(img.dataset.src);
          img.classList.remove("lazy-load");
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => observer.observe(img));
  };

  const updateLoadMoreButton = () => {
    const loadMoreButton = document.getElementById("loadMore");
    if (!loadMoreButton) return;
    if (currentIndex >= agents.length) {
      loadMoreButton.classList.add("d-none");
    } else {
      loadMoreButton.classList.remove("d-none");
    }
  };

  const initLoadMoreButton = () => {
    const loadMoreContainer = document.getElementById("loadMoreContainer");

    const button = document.createElement("button");
    button.id = "loadMore";
    button.textContent = "Load More Agents";
    button.className = "btn btn-danger d-block mx-auto my-3 ";
    loadMoreContainer.appendChild(button);

    button.addEventListener("click", renderAgents);
  };

  agents = await fetchData("https://valorant-api.com/v1/agents");
  renderAgents();
  initLoadMoreButton();
  addFooter();
});

const openAgentModal = (agent) => {
  const existingModal = document.getElementById("agentModal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalContent = `
        <div class="modal fade" id="agentModal" tabindex="-1" aria-labelledby="agentModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title" id="agentModalLabel">${
                  agent.displayName
                }</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <img src="${
                  agent.fullPortrait || agent.displayIcon
                }" class="img-fluid mb-3" alt="${agent.displayName}">
                <p><strong>Role:</strong> ${
                  agent.role?.displayName || "No role available"
                }</p>
                <p><strong>Abilities:</strong></p>
                <ul>
                  ${agent.abilities
                    .map(
                      (ability) =>
                        `<li>
                        <img src="${
                          ability.displayIcon || agent.displayIcon
                        }" class="img-fluid mb-3 ability-img" alt="${
                          ability.displayName
                        }"> <br/>
                        <strong>${ability.displayName}:</strong>
                         ${ability.description}</li>`
                    )
                    .join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;

  document.body.insertAdjacentHTML("beforeend", modalContent);
  const agentModal = new bootstrap.Modal(document.getElementById("agentModal"));
  agentModal.show();
};

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

// Might scratch this.
// document.addEventListener("DOMContentLoaded", function () {
//   if (
//     window.location.pathname === "/navigation/agents.html" ||
//     window.location.pathname === "/navigation/maps.html"
//   ) {
//     const searchContainer = document.createElement("div");
//     searchContainer.className = "container text-center";

//     searchContainer.innerHTML = `
//            <input id="SearchBar" class="form-control" type="text" ${
//              window.location.pathname === "/navigation/agents.html"
//                ? "placeholder='Filter Agents"
//                : "placeholder='Filter Maps"
//            } aria-label="Search">
//            `;
//     document.body.insertBefore(searchContainer, document.body.firstChild);
//     document
//       .getElementById("SearchBar")
//       .addEventListener("input", filterAgents);
//   }
// });
// Might scratch this aswell
// function filterAgents() {
//   const filterName = document.getElementById("SearchBar").value.toLowerCase();
//   const agents = document.querySelectorAll(".card-title");

//   agents.forEach((agent) => {
//     const agentName = card
//       .querySelector(".card-title")
//       .textContent.toLowerCase();
//     if (agentName.includes(filterName)) {
//       card.style.display = "block";
//     } else {
//       card.style.display = "none";
//     }
//   });
// }
