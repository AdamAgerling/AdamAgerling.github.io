document.addEventListener("DOMContentLoaded", async function () {
  let agents = [];
  let currentIndex = 0;
  const agentsPerPage = 9;

  //Credit to modigida for the convertImageToFormat function from the following link: https://github.com/modigida/BookStore/blob/main/Books.js
  async function convertImageToFormat(imageUrl, format = "webp") {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        resolve(canvas.toDataURL(`image/${format}`));
      };

      img.onerror = () => {
        console.error(`Failed to load image: ${imageUrl}`);
        resolve(imageUrl);
      };
    });
  }

  const fetchData = async (url) => {
    try {
      const cachedData = localStorage.getItem("agents");
      if (cachedData) return JSON.parse(cachedData);

      const response = await fetch(url);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const filteredAgents = data.data.filter(
        (agent) => agent.isPlayableCharacter
      );
      localStorage.setItem("agents", JSON.stringify(filteredAgents));

      return filteredAgents;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const renderAgents = async () => {
    const agentsContainer = document.getElementById("agents");
    const loadMoreContainer = document.getElementById("loadMoreContainer");
    const endIndex = Math.min(currentIndex + agentsPerPage, agents.length);

    for (let i = currentIndex; i < endIndex; i++) {
      const agent = agents[i];

      const col = document.createElement("div");
      col.className = "col-md-4 mb-3";

      const card = document.createElement("div");
      card.className = "card shadow-lg custom-pointer";

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
      cardImage.alt = agent.displayName;

      card.appendChild(cardImage);
      card.appendChild(cardBody);
      cardBody.appendChild(cardTitle);
      cardBody.appendChild(cardLine);
      cardBody.appendChild(cardText);
      col.appendChild(card);
      agentsContainer.appendChild(col);

      convertImageToFormat(agent.displayIcon, "webp").then((webpSrc) => {
        cardImage.src = webpSrc;
      });

      card.addEventListener("click", () => openAgentModal(agent));
    }

    currentIndex = endIndex;
    if (loadMoreContainer) agentsContainer.appendChild(loadMoreContainer);
    updateLoadMoreButton();
  };

  const updateLoadMoreButton = () => {
    const loadMoreButton = document.getElementById("loadMore");
    if (!loadMoreButton) return;
    loadMoreButton.classList.toggle("d-none", currentIndex >= agents.length);
  };

  const initLoadMoreButton = () => {
    const loadMoreContainer = document.getElementById("loadMoreContainer");

    const button = document.createElement("button");
    button.id = "loadMore";
    button.textContent = "Load More Agents";
    button.className = "btn btn-danger d-block mx-auto my-3";
    loadMoreContainer.appendChild(button);

    button.addEventListener("click", renderAgents);
  };

  agents = await fetchData("https://valorant-api.com/v1/agents");
  renderAgents();
  initLoadMoreButton();
  addFooter();
});

const openAgentModal = (agent) => {
  document.getElementById("agentModal")?.remove();

  const modalContent = `
        <div class="modal fade" id="agentModal" tabindex="-1" aria-labelledby="agentModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h4 class="modal-title">${agent.displayName}</h4>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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
                      (ability) => `
                        <li>
                          <img src="${
                            ability.displayIcon || agent.displayIcon
                          }" class="img-fluid mb-3 ability-img" alt="${
                        ability.displayName
                      }">
                          <br/>
                          <strong>${ability.displayName}:</strong> ${
                        ability.description
                      }
                        </li>`
                    )
                    .join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>`;

  document.body.insertAdjacentHTML("beforeend", modalContent);
  new bootstrap.Modal(document.getElementById("agentModal")).show();
};

function addFooter() {
  const footerElement = document.createElement("div");
  footerElement.className = "bg-dark text-light";
  footerElement.innerHTML = `
        <footer class="py-3">
          <ul class="nav justify-content-center border-bottom pb-3 mb-3">
            <li class="nav-item"><a href="/" class="nav-link px-2 text-light">Home</a></li>
            <li class="nav-item"><a href="/navigation/agents.html" class="nav-link px-2 text-light">Agents</a></li>
          </ul>
          <p class="text-center text-body-light">© 2025 Vaken, Inc</p>
        </footer>`;
  document.body.appendChild(footerElement);
}
