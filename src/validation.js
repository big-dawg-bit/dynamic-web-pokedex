export const validateTeam = ({ name, notes, pokemonIds }) => {
  const errors = {};

  const trimmedName = (name || '').trim();
  if (trimmedName.length === 0) {
    errors.name = 'Team name is required';
  } else if (trimmedName.length < 3) {
    errors.name = 'Team name must be at least 3 characters';
  } else if (trimmedName.length > 20) {
    errors.name = 'Team name must be 20 characters or fewer';
  }

  if (notes && notes.length > 200) {
    errors.notes = `Notes are too long (${notes.length} of 200 max)`;
  }

  if (pokemonIds.length !== 6) {
    errors.pokemonIds = `Pick exactly 6 Pokemon — you've picked ${pokemonIds.length}`;
  }

  return errors;
};

export const isValid = (errors) => Object.keys(errors).length === 0;