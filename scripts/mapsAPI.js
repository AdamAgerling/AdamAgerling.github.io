document.addEventListener("DOMContentLoaded", async function () {
  let maps = [];
  let currentIndex = 0;
  const mapsPerPage = 9;

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
      const cachedData = localStorage.getItem("maps");
      if (cachedData) {
        return JSON.parse(cachedData);
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const filteredMaps = data.data.filter(
        (map) =>
          map.displayName !== "Basic Training" &&
          map.displayName !== "The Range"
      );
      localStorage.setItem("maps", JSON.stringify(filteredMaps));
      return filteredMaps;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderMaps = (maps) => {
    const mapsContainer = document.getElementById("maps");
    const loadMoreContainer = document.getElementById("loadMoreContainer");
    const endIndex = Math.min(currentIndex + mapsPerPage, maps.length);

    for (let i = currentIndex; i < endIndex; i++) {
      const map = maps[i];

      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      const card = document.createElement("div");
      card.className = "card custom-pointer";

      const cardBody = document.createElement("div");
      cardBody.className = "card-body";

      const cardTitle = document.createElement("p");
      cardTitle.className = "card-title text-center fs-4 fw-bold";
      cardTitle.textContent = map.displayName;

      const cardLine = document.createElement("hr");

      const cardText = document.createElement("p");
      cardText.className = "card-text text-center";
      cardText.textContent =
        map.tacticalDescription || "No tactical description available.";

      const cardImage = document.createElement("img");
      cardImage.fetchpriority = "high";
      cardImage.className = "card-img-top map-img ";
      cardImage.src = map.listViewIcon;
      cardImage.alt = map.displayName;

      card.addEventListener("click", () => {
        openMapsModal(map);
      });

      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardLine);
      cardBody.appendChild(cardText);
      card.appendChild(cardImage);
      card.appendChild(cardBody);
      col.appendChild(card);
      mapsContainer.appendChild(col);
    }

    currentIndex = endIndex;
    if (loadMoreContainer) {
      mapsContainer.appendChild(loadMoreContainer);
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
    if (currentIndex >= maps.length) {
      loadMoreButton.classList.add("d-none");
    } else {
      loadMoreButton.classList.remove("d-none");
    }
  };

  const initLoadMoreButton = () => {
    const loadMoreContainer = document.getElementById("loadMoreContainer");

    const button = document.createElement("button");
    button.id = "loadMore";
    button.textContent = "Load More Maps";
    button.className = "btn btn-danger d-block mx-auto my-3 ";
    loadMoreContainer.appendChild(button);

    button.addEventListener("click", () => renderMaps(maps));
  };

  maps = await fetchData("https://valorant-api.com/v1/maps");
  renderMaps(maps);
  initLoadMoreButton();
  addFooter();
});

const openMapsModal = (map) => {
  const existingModal = document.getElementById("mapModal");
  if (existingModal) {
    existingModal.remove();
  }

  const modalContent = `
          <div class="modal fade" id="mapModal" tabindex="-1" aria-labelledby="mapModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title" id="mapModalLabel">${
                    map.displayName
                  }'s map layout</h4>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <img src="${
                    map.displayIcon || map.listViewIcon
                  }" class="img-fluid mb-3" alt="${map.displayName}">
                  <p><strong>Map type:</strong> ${
                    map.tacticalDescription ||
                    !map.displayName == "Basic Training"
                      ? `${map.tacticalDescription}`
                      : "No map type available"
                  }</p>
                  <p><strong>Callout names:</strong></p>
                  <ul>
                  ${
                    map.callouts
                      ? map.callouts
                          .map(
                            (callout) =>
                              `<li>
                        <strong>Callout: </strong>${
                          callout.regionName ||
                          "No callouts exist on Basic Training Map"
                        }<br/> 
                         <strong> Map coordinates: </strong> ${
                           callout.location
                             ? Object.entries(callout.location)
                                 .map(([key, value]) => `${key}: ${value}`)
                                 .join(", ")
                             : "No coordinates available"
                         }</li>`
                          )
                          .join("")
                      : "No callouts available"
                  }
                </ul>
                </div>
              </div>
            </div>
          </div>
        `;

  document.body.insertAdjacentHTML("beforeend", modalContent);
  const mapModal = new bootstrap.Modal(document.getElementById("mapModal"));
  mapModal.show();
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
