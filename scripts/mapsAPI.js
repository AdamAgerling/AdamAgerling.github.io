document.addEventListener("DOMContentLoaded", function () {
  const fetchData = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const renderMaps = (maps) => {
    return new Promise((resolve) => {
      const mapsContainer = document.getElementById("maps");
      mapsContainer.innerHTML = "";

      maps.forEach((map) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-3";

        const card = document.createElement("div");
        card.className = "card custom-pointer";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const cardTitle = document.createElement("h5");
        cardTitle.className = "card-title text-center";
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
      });

      resolve();
    });
  };

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

  fetchData("https://valorant-api.com/v1/maps")
    .then((data) => {
      const actualMaps = data.data.filter(
        (map) =>
          map.displayName !== "The Range" &&
          map.displayName !== "Basic Training"
      );
      return renderMaps(actualMaps).then(() => {
        addFooter();
      });
    })
    .catch((error) => console.error("Fetch error:", error));
});

function addFooter() {
  const footerElement = document.createElement("div");
  footerElement.className = "bg-dark text-light";
  footerElement.innerHTML = `
        <footer class="py-3">
          <ul class="nav justify-content-center border-bottom pb-3 mb-3">
            <li class="nav-item">
              <a href="/" class="nav-link px-2 text-danger">Home</a>
            </li>
            <li class="nav-item">
              <a href="/navigation/agents.html" class="nav-link px-2 text-danger">Agents</a>
            </li>
            <li class="nav-item">
              <a href="/navigation/maps.html" class="nav-link px-2 text-danger">Maps</a>
            </li>
            <li class="nav-item">
              <a href="/navigation/fakeshop.html" class="nav-link px-2 text-danger">Fake shop</a>
            </li>
            <li class="nav-item">
              <a href="/navigation/about.html" class="nav-link px-2 text-danger">About us</a>
            </li>
          </ul>
          <p class="text-center text-body-danger">© 2025 Vaken, Inc</p>
        </footer>
      `;

  document.body.appendChild(footerElement);
}
