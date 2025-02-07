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
  // TODO: FIX render issue with modal, when I click one agent, the modal shows the same agent for all agents
  // TODO: FIX sizing width on modal, and image size on cards.
  const renderAgents = (agents) => {
    return new Promise((resolve) => {
      const agentsContainer = document.getElementById("agents");
      agentsContainer.innerHTML = "";

      agents.forEach((agent) => {
        const col = document.createElement("div");
        col.className = "col-md-4 mb-4";

        const card = document.createElement("div");
        card.className = "card";

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const cardTitle = document.createElement("h5");
        cardTitle.className = "card-title";
        cardTitle.textContent = agent.displayName;

        const cardText = document.createElement("p");
        cardText.className = "card-text";
        cardText.textContent = agent.description || "No description available.";

        const cardImage = document.createElement("img");
        cardImage.className = "card-img-top";
        cardImage.src = agent.displayIcon;
        cardImage.alt = agent.displayName;

        card.addEventListener("click", () => {
          openAgentModal(agent);
        });

        cardBody.appendChild(cardTitle);
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
    const modalContent = `
        <div class="modal fade" id="agentModal" tabindex="-1" aria-labelledby="agentModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="agentModalLabel">${
                  agent.displayName
                }</h5>
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
                        `<li><strong>${ability.displayName}:</strong> ${ability.description}</li>`
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
      return renderAgents(playableAgents);
    })
    .catch((error) => console.error("Fetch error:", error));
});
