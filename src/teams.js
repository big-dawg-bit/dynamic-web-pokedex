const STORAGE_KEY = 'pokedex_teams_v1';

export const getTeams = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('Teams parse failed, resetting:', err);
    return [];
  }
};

const writeTeams = (teams) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  } catch (err) {
    console.warn('Teams write failed:', err);
  }
};

export const saveTeam = ({ name, notes, pokemonIds }) => {
  const teams = getTeams();
  const newTeam = {
    id: Date.now(),
    name: name.trim(),
    notes: (notes || '').trim(),
    pokemonIds: [...pokemonIds],
    createdAt: new Date().toISOString(),
  };
  teams.push(newTeam);
  writeTeams(teams);
  return newTeam;
};

export const deleteTeam = (teamId) => {
  const remaining = getTeams().filter((t) => t.id !== teamId);
  writeTeams(remaining);
};