
const STORAGE_KEY = 'pokedex_favorites_v1';

export const getFavoriteIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Favorites parse failed, resetting:', err);
    return [];
  }
};

const writeFavoriteIds = (ids) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.warn('Favorites write failed:', err);
  }
};

export const isFavorite = (id) => getFavoriteIds().includes(id);

export const toggleFavorite = (id) => {
  const ids = getFavoriteIds();
  const index = ids.indexOf(id);

  if (index === -1) {
    ids.push(id);
    writeFavoriteIds(ids);
    return true;
  }

  ids.splice(index, 1);
  writeFavoriteIds(ids);
  return false;
};

export const getFavoriteCount = () => getFavoriteIds().length;