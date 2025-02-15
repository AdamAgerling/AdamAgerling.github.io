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

  const renderAgents = (agents) => {
    return new Promise((resolve) => {
      const agentsContainer = document.getElementById("agents");
      agentsContainer.innerHTML = "";

      agents.forEach((agent) => {
        const col = document.createElement("div");
        col.className = "col-md-3 mb-3";

        const card = document.createElement("div");
        card.className = "card custom-pointer";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const cardTitle = document.createElement("h5");
        cardTitle.className = "card-title text-center";
        cardTitle.textContent = agent.displayName;

        const cardLine = document.createElement("hr");

        const cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.textContent = agent.description || "No description available.";

        const cardImage = document.createElement("img");
        cardImage.className = "card-img-top c-item";
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
      });

      resolve();
    });
  };

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
    const agentModal = new bootstrap.Modal(
      document.getElementById("agentModal")
    );
    agentModal.show();
  };

  fetchData("https://valorant-api.com/v1/agents")
    .then((data) => {
      const playableAgents = data.data.filter(
        (agent) => agent.isPlayableCharacter
      );
      return renderAgents(playableAgents).then(() => {
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
