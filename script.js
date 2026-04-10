const playerName = document.getElementById("player-name");
const playerLevel = document.getElementById("player-level");
const playerList = document.getElementById("player-list");
const numberOfTeams = document.getElementById("number-of-team");
const teamsContainer = document.getElementById("teams-container");

const levelScore = { strong: 3, medium: 2, weak: 1 };
let players = [];

function capitalizeName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function addPlayer() {
  const name = capitalizeName(playerName.value.trim());
  if (!name) return;

  const exists = players.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (exists) {
    showError("Player already exists!");
    return;
  }

  players.push({ name, level: playerLevel.value });
  renderPlayers();
  playerName.value = "";
}

function renderPlayers() {
  playerList.innerHTML = "";
  players.forEach(player => {
    const li = document.createElement("li");
    li.className = player.level;
    li.innerHTML = `
      <div class="player-info">
        <span class="player-name">${player.name}</span>
        <span class="player-badge badge-${player.level}">${player.level}</span>
      </div>
      <button class="remove-btn" data-name="${player.name}">✕</button>
    `;
    playerList.appendChild(li);
  });
}

function splitTeams() {
  const numTeams = parseInt(numberOfTeams.value);

  if (players.length === 0) { showError("Add at least one player!"); return; }
  if (numTeams > players.length) { showError("Too many teams! Add more players."); return; }

  const order = { strong: 1, medium: 2, weak: 3 };
  const sorted = shuffle([...players]).sort((a, b) => order[a.level] - order[b.level]);
  const teams = Array.from({ length: numTeams }, () => []);

  sorted.forEach((player, i) => teams[i % numTeams].push(player));

  const maxScore = Math.max(...teams.map(t => t.reduce((sum, p) => sum + levelScore[p.level], 0)));

  teamsContainer.innerHTML = "";
  teams.forEach((team, i) => {
    const score = team.reduce((sum, p) => sum + levelScore[p.level], 0);
    const maxPossible = team.length * 3;
    const fillPercent = Math.round((score / maxPossible) * 100);

    const teamDiv = document.createElement("div");
    teamDiv.className = "team-card";
    teamDiv.innerHTML = `
      <div class="team-header">
        <div>
          <div class="team-name">Team ${i + 1}</div>
          <div class="team-meta">${team.length} player${team.length !== 1 ? "s" : ""}</div>
        </div>
        <div>
          <div class="team-score-label">Strength ${score}/${maxPossible}</div>
          <div class="score-bar">
            <div class="score-fill" style="width: ${fillPercent}%"></div>
          </div>
        </div>
      </div>
      <div>
        ${team.map(p => `
          <div class="team-player">
            <div class="dot dot-${p.level}"></div>
            <span class="team-player-name">${p.name}</span>
          </div>
        `).join("")}
      </div>
    `;
    teamsContainer.appendChild(teamDiv);
  });
}

function reset() {
  players = [];
  renderPlayers();
  teamsContainer.innerHTML = "";
  numberOfTeams.value = "2";
}

function removePlayer(name) {
  players = players.filter(p => p.name !== name);
  renderPlayers();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function showError(msg) {
  const error = document.getElementById("error-msg");
  error.textContent = msg;
  setTimeout(() => error.textContent = "", 2000);
}

document.getElementById("add-player-btn").addEventListener("click", addPlayer);
document.getElementById("split-teams-btn").addEventListener("click", splitTeams);
document.getElementById("reset-btn").addEventListener("click", reset);

playerList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) removePlayer(e.target.dataset.name);
});

playerName.addEventListener("keydown", (e) => { if (e.key === "Enter") addPlayer(); });
numberOfTeams.addEventListener("keydown", (e) => { if (e.key === "Enter") splitTeams(); });