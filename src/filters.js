// Filter / search / sort logic.
// Filter / search / sort logic.
// Demonstrates: array methods (.filter, .sort), callback functions,
// arrow functions, destructuring, template literals, ternary operator.
const applySearch = (pokemon, query) => {
  if (!query) return pokemon;
  const lower = query.toLowerCase();
  return pokemon.filter((p) => p.name.toLowerCase().includes(lower));
};

const applyTypeFilter = (pokemon, type) => {
  if (!type || type === 'all') return pokemon;
  return pokemon.filter((p) => p.types.includes(type));
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

  // Spread to avoid mutating the original array
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
  result = applySort(result, state.sortBy);
  return result;
};