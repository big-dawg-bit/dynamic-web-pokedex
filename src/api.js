
const API_BASE = 'https://pokeapi.co/api/v2';
const POKEMON_LIMIT = 151; // Gen 1 (Kanto)
const CACHE_KEY = 'pokedex_cache_v1';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in ms


const readCache = () => {
  const raw = localStorage.getItem(CACHE_KEY);
  if (!raw) return null;

  try {
    const { timestamp, data } = JSON.parse(raw);
    const age = Date.now() - timestamp;
    return age < CACHE_TTL_MS ? data : null; // ternary: fresh? use cache : ignore
  } catch (err) {
    console.warn('Cache parse failed, ignoring:', err);
    return null;
  }
};


const writeCache = (data) => {
  try {
    const payload = JSON.stringify({ timestamp: Date.now(), data });
    localStorage.setItem(CACHE_KEY, payload);
  } catch (err) {
    console.warn('Cache write failed (quota?):', err);
  }
};


export const clearCache = () => {
  localStorage.removeItem(CACHE_KEY);
};


const normalizePokemon = (raw) => ({
  id: raw.id,
  name: raw.name,
  sprite:
    raw.sprites.other['official-artwork'].front_default ??
    raw.sprites.front_default,
  types: raw.types.map((t) => t.type.name),
  height: raw.height, // decimetres
  weight: raw.weight, // hectograms
  baseExperience: raw.base_experience,
  stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
  abilities: raw.abilities.map((a) => a.ability.name),
});

const fetchPokemonDetail = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  const raw = await response.json();
  return normalizePokemon(raw);
};

export const getAllPokemon = async () => {
  
  const cached = readCache();
  if (cached) {
    console.log(`Loaded ${cached.length} Pokemon from cache.`);
    return cached;
  }


  console.log(`Fetching ${POKEMON_LIMIT} Pokemon from PokeAPI...`);

  const listResponse = await fetch(`${API_BASE}/pokemon?limit=${POKEMON_LIMIT}`);
  if (!listResponse.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${listResponse.status}`);
  }
  const list = await listResponse.json();

 
  const detailPromises = list.results.map((entry) => fetchPokemonDetail(entry.url));
  const pokemon = await Promise.all(detailPromises);

  writeCache(pokemon);
  console.log(`Fetched ${pokemon.length} Pokemon successfully.`);
  return pokemon;
};


export const getUniqueTypes = (pokemon) => {
  const allTypes = pokemon.flatMap((p) => p.types);
  return [...new Set(allTypes)].sort();
};