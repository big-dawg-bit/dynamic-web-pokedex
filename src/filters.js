import { getFavoriteIds } from './favorites.js';


const applySearch = (pokemon, query) => {
  if (!query) return pokemon;
  const lower = query.toLowerCase();
  return pokemon.filter((p) => p.name.toLowerCase().includes(lower));
};

const applyTypeFilter = (pokemon, type) => {
  if (!type || type === 'all') return pokemon;
  return pokemon.filter((p) => p.types.includes(type));
};

const applyFavoritesFilter = (pokemon, favoritesOnly) => {
  if (!favoritesOnly) return pokemon;
  const favIds = getFavoriteIds();
  return pokemon.filter((p) => favIds.includes(p.id));
};

const FIELD_MAP = {
  id: 'id',
  name: 'name',
  height: 'height',
  weight: 'weight',
  xp: 'baseExperience',
};

const applySort = (pokemon, sortKey) => {
  const [field, direction] = sortKey.split('-');
  const dir = direction === 'desc' ? -1 : 1;
  const dataField = FIELD_MAP[field];

  return [...pokemon].sort((a, b) => {
    const av = a[dataField];
    const bv = b[dataField];
    return typeof av === 'string'
      ? av.localeCompare(bv) * dir
      : (av - bv) * dir;
  });
};

export const applyFilters = (pokemon, state) => {
  let result = pokemon;
  result = applySearch(result, state.search);
  result = applyTypeFilter(result, state.type);
  result = applyFavoritesFilter(result, state.favoritesOnly);
  result = applySort(result, state.sortBy);
  return result;
};