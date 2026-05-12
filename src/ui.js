import { isFavorite } from './favorites.js';

const TYPE_COLORS = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const formatId = (id) => `#${String(id).padStart(3, '0')}`;
const formatHeight = (dm) => `${(dm / 10).toFixed(1)} m`;
const formatWeight = (hg) => `${(hg / 10).toFixed(1)} kg`;

const humanize = (str) => capitalize(str.replace(/-/g, ' '));

const renderTypeBadges = (types) =>
  types
    .map((type) => {
      const color = TYPE_COLORS[type] ?? '#777';
      return `<span class="type-badge" style="background-color: ${color}">${capitalize(type)}</span>`;
    })
    .join('');

const renderFavoriteButton = (id) => {
  const fav = isFavorite(id);
  return `
    <button
      class="favorite-btn ${fav ? 'is-favorite' : ''}"
      data-id="${id}"
      aria-label="${fav ? 'Remove from favorites' : 'Add to favorites'}"
    >${fav ? '❤️' : '🤍'}</button>
  `;
};


const renderCard = (pokemon) => `
  <article class="pokemon-card" data-id="${pokemon.id}">
    ${renderFavoriteButton(pokemon.id)}
    <div class="pokemon-card__id">${formatId(pokemon.id)}</div>
    <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-card__sprite" />
    <h2 class="pokemon-card__name">${capitalize(pokemon.name)}</h2>
    <div class="pokemon-card__types">${renderTypeBadges(pokemon.types)}</div>
  </article>
`;

export const renderCardGrid = (pokemonList, container) => {
  container.innerHTML = `
    <div class="pokemon-grid">
      ${pokemonList.map(renderCard).join('')}
    </div>
  `;
};

const renderTableRow = (pokemon) => `
  <tr data-id="${pokemon.id}">
    <td class="cell-id">${formatId(pokemon.id)}</td>
    <td class="cell-sprite"><img src="${pokemon.sprite}" alt="${pokemon.name}" /></td>
    <td class="cell-name">${capitalize(pokemon.name)}</td>
    <td class="cell-types"><div class="type-stack">${renderTypeBadges(pokemon.types)}</div></td>
    <td class="cell-height">${formatHeight(pokemon.height)}</td>
    <td class="cell-weight">${formatWeight(pokemon.weight)}</td>
    <td class="cell-xp">${pokemon.baseExperience}</td>
    <td class="cell-fav">${renderFavoriteButton(pokemon.id)}</td>
  </tr>
`;

export const renderTable = (pokemonList, container) => {
  container.innerHTML = `
    <table class="pokemon-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Sprite</th>
          <th>Name</th>
          <th>Types</th>
          <th>Height</th>
          <th>Weight</th>
          <th>Base XP</th>
          <th>Fav</th>
        </tr>
      </thead>
      <tbody>
        ${pokemonList.map(renderTableRow).join('')}
      </tbody>
    </table>
  `;
};

const renderStatBar = (statName, value) => {
  const percentage = Math.min((value / 255) * 100, 100);
  return `
    <div class="stat-row">
      <span class="stat-name">${humanize(statName)}</span>
      <span class="stat-value">${value}</span>
      <div class="stat-bar-track">
        <div class="stat-bar-fill" style="width: ${percentage}%"></div>
      </div>
    </div>
  `;
};

export const renderDetail = (pokemon) => {
  const statRows = pokemon.stats.map((s) => renderStatBar(s.name, s.value)).join('');
  const abilityList = pokemon.abilities
    .map((a) => `<li>${humanize(a)}</li>`)
    .join('');

  return `
    <div class="detail-header">
      <img src="${pokemon.sprite}" alt="${pokemon.name}" class="detail-sprite" />
      <div class="detail-meta">
        <div class="detail-id">${formatId(pokemon.id)}</div>
        <h2 class="detail-name">${capitalize(pokemon.name)}</h2>
        <div class="detail-types">${renderTypeBadges(pokemon.types)}</div>
      </div>
    </div>
    <div class="detail-grid">
      <div class="detail-section">
        <h3>Physical</h3>
        <p><strong>Height:</strong> ${formatHeight(pokemon.height)}</p>
        <p><strong>Weight:</strong> ${formatWeight(pokemon.weight)}</p>
        <p><strong>Base XP:</strong> ${pokemon.baseExperience}</p>
      </div>
      <div class="detail-section">
        <h3>Abilities</h3>
        <ul class="ability-list">${abilityList}</ul>
      </div>
      <div class="detail-section detail-section--wide">
        <h3>Base Stats</h3>
        <div class="stats-list">${statRows}</div>
      </div>
    </div>
  `;
};

export { capitalize, formatId, formatHeight, formatWeight, TYPE_COLORS };