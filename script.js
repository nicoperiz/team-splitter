const playerName = document.getElementById("player-name");
const playerLevel = document.getElementById("player-level");
const playerList = document.getElementById("player-list");
const numberOfTeams = document.getElementById("number-of-team");
const teamsContainer = document.getElementById("teams-container");
let players = [];

function addPlayer() {
  const name = playerName.value;
  if (name === "") return;
  const exists = players.find(p => p.name === name);
  if (exists) return;
  const level = playerLevel.value;
  const player = { name: name, level: level };
  players.push(player);
  renderPlayers();
  playerName.value = "";
}

function renderPlayers() {
  playerList.innerHTML = "";
  players.forEach(player => {
    const li = `<li class="${player.level}">${player.name} - ${player.level} <button class="remove-btn" data-name="${player.name}">✕</button></li>`;
    playerList.innerHTML += li;
  });
}

function splitTeams() {
    const numTeams = parseInt(numberOfTeams.value);
  if (players.length === 0) {
  alert("Add at least one player!");
  return;
}
if (numTeams > players.length) {
  alert("Too many teams! Add more players.");
  return;
}
  const order = { strong: 1, medium: 2, weak: 3 };
  const sorted = players.sort((a, b) => order[a.level] - order[b.level]);
  const teams = Array.from({ length: numTeams }, () => []);
  sorted.forEach((player, i) => {
    teams[i % numTeams].push(player);
  });
  teamsContainer.innerHTML = "";
  teams.forEach((team, i) => {
    const teamDiv = `
      <div class="team-card">
        <h3>Team ${i + 1}</h3>
        <ul>
          ${team.map(player => `<li class="${player.level}">${player.name} (${player.level})</li>`).join("")}
        </ul>
      </div>
    `;
    teamsContainer.innerHTML += teamDiv;
  });
}

function reset() {
  players = [];
  renderPlayers();
  teamsContainer.innerHTML = "";
  numberOfTeams.value = "2";
}

document.getElementById("add-player-btn").addEventListener("click", addPlayer);
document.getElementById("split-teams-btn").addEventListener("click", splitTeams);
document.getElementById("reset-btn").addEventListener("click", reset);

function removePlayer(name) {
  players = players.filter(p => p.name !== name);
  renderPlayers();
}
playerList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-btn")) {
    removePlayer(e.target.dataset.name);
  }
});

playerName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addPlayer();
});

numberOfTeams.addEventListener("keydown", (e) => {
  if (e.key === "Enter") splitTeams();
});