
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

const renderCard = (pokemon) => {
  const typeBadges = pokemon.types
    .map((type) => {
      const color = TYPE_COLORS[type] ?? '#777';
      return `<span class="type-badge" style="background-color: ${color}">${capitalize(type)}</span>`;
    })
    .join('');

  return `
    <article class="pokemon-card" data-id="${pokemon.id}">
      <div class="pokemon-card__id">${formatId(pokemon.id)}</div>
      <img src="${pokemon.sprite}" alt="${pokemon.name}" class="pokemon-card__sprite" />
      <h2 class="pokemon-card__name">${capitalize(pokemon.name)}</h2>
      <div class="pokemon-card__types">${typeBadges}</div>
    </article>
  `;
};

export const renderCardGrid = (pokemonList, container) => {
  container.innerHTML = `
    <div class="pokemon-grid">
      ${pokemonList.map(renderCard).join('')}
    </div>
  `;
};

export { capitalize, formatId, formatHeight, formatWeight, TYPE_COLORS };