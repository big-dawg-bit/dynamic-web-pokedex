import './style.css';
import { getAllPokemon, getUniqueTypes } from './api.js';
import { renderCardGrid, renderTable, renderDetail, capitalize } from './ui.js';
import { applyFilters } from './filters.js';
import { toggleFavorite, getFavoriteCount, getFavoriteIds } from './favorites.js';
import { initTheme, toggleTheme } from './preferences.js';
import { observeCards } from './observer.js';
import { validateTeam, isValid } from './validation.js';
import { getTeams, saveTeam, deleteTeam } from './teams.js';

let pokemon = [];
let currentView = 'cards';
let teamSelection = new Set();

const filterState = {
  search: '',
  type: 'all',
  sortBy: 'id-asc',
  favoritesOnly: false,
};
const app = document.querySelector('#app');
const controls = document.querySelector('.controls');
const resultCount = document.querySelector('#result-count');
const searchInput = document.querySelector('#search');
const typeFilter = document.querySelector('#type-filter');
const sortSelect = document.querySelector('#sort-by');
const favoritesToggle = document.querySelector('#favorites-toggle');
const themeToggle = document.querySelector('#theme-toggle');
const modal = document.querySelector('#detail-modal');
const detailContent = document.querySelector('#detail-content');
const teamBuilderBtn = document.querySelector('#team-builder-btn');
const teamModal = document.querySelector('#team-modal');
const teamForm = document.querySelector('#team-form');
const teamNameInput = document.querySelector('#team-name');
const teamNotesInput = document.querySelector('#team-notes');
const teamPickable = document.querySelector('#team-pickable');
const teamPickCount = document.querySelector('#team-pick-count');
const savedTeamsList = document.querySelector('#saved-teams-list');


const render = () => {
  const visible = applyFilters(pokemon, filterState);

  resultCount.textContent =
    visible.length === pokemon.length
      ? `Showing all ${pokemon.length} Pokemon`
      : `Showing ${visible.length} of ${pokemon.length} Pokemon`;

  favoritesToggle.textContent = `♥ Favorites (${getFavoriteCount()})`;
  favoritesToggle.classList.toggle('active', filterState.favoritesOnly);

  if (visible.length === 0) {
    app.innerHTML = `<p class="empty-state">No Pokemon match your filters.</p>`;
    return;
  }

  if (currentView === 'cards') {
    renderCardGrid(visible, app);
    observeCards();
  } else {
    renderTable(visible, app);
  }
};

const updateToggleUI = () => {
  document.querySelectorAll('.view-toggle').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === currentView);
  });
};

const populateTypeFilter = () => {
  const types = getUniqueTypes(pokemon);
  types.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = capitalize(type);
    typeFilter.appendChild(option);
  });
};

const updateThemeButton = (theme) => {
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
  );
};

const openDetail = (id) => {
  const target = pokemon.find((p) => p.id === id);
  if (!target) return;
  detailContent.innerHTML = renderDetail(target);
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
};

const closeDetail = () => {
  modal.hidden = true;
  document.body.style.overflow = '';
};
const renderPickable = () => {
  const favIds = getFavoriteIds();
  const favs = pokemon.filter((p) => favIds.includes(p.id));

  if (favs.length === 0) {
    teamPickable.innerHTML =
      '<p class="muted">Favorite at least 6 Pokemon to build a team.</p>';
    return;
  }

  teamPickable.innerHTML = favs
    .map((p) => {
      const picked = teamSelection.has(p.id);
      return `
        <label class="pickable-card ${picked ? 'is-picked' : ''}">
          <input type="checkbox" value="${p.id}" ${picked ? 'checked' : ''} />
          <img src="${p.sprite}" alt="${p.name}" />
          <span>${capitalize(p.name)}</span>
        </label>
      `;
    })
    .join('');
};

const updatePickCount = () => {
  teamPickCount.textContent = `${teamSelection.size}/6`;
};

const renderSavedTeams = () => {
  const teams = getTeams();
  if (teams.length === 0) {
    savedTeamsList.innerHTML = '<p class="muted">No teams saved yet.</p>';
    return;
  }

  savedTeamsList.innerHTML = teams
    .map((team) => {
      const roster = team.pokemonIds
        .map((id) => {
          const p = pokemon.find((x) => x.id === id);
          return p
            ? `<img src="${p.sprite}" alt="${p.name}" title="${capitalize(p.name)}" />`
            : '';
        })
        .join('');

      return `
        <div class="saved-team" data-team-id="${team.id}">
          <div class="saved-team__header">
            <h4>${team.name}</h4>
            <button class="delete-team-btn" data-team-id="${team.id}" aria-label="Delete team">×</button>
          </div>
          ${team.notes ? `<p class="saved-team__notes">${team.notes}</p>` : ''}
          <div class="saved-team__roster">${roster}</div>
        </div>
      `;
    })
    .join('');
};

const clearFormErrors = () => {
  document.querySelectorAll('.field-error').forEach((el) => {
    el.textContent = '';
    el.parentElement.classList.remove('has-error');
  });
};

const showFormErrors = (errors) => {
  clearFormErrors();
  Object.entries(errors).forEach(([field, msg]) => {
    const errorEl = document.querySelector(`[data-error-for="${field}"]`);
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.parentElement.classList.add('has-error');
    }
  });
};

const openTeamBuilder = () => {
  teamSelection = new Set();
  teamForm.reset();
  clearFormErrors();
  renderPickable();
  updatePickCount();
  renderSavedTeams();
  teamModal.hidden = false;
  document.body.style.overflow = 'hidden';
};

const closeTeamBuilder = () => {
  teamModal.hidden = true;
  document.body.style.overflow = '';
};

const wireViewToggle = () => {
  controls.addEventListener('click', (event) => {
    if (!event.target.classList.contains('view-toggle')) return;
    currentView = event.target.dataset.view;
    render();
    updateToggleUI();
  });
};

const wireFilterControls = () => {
  searchInput.addEventListener('input', (event) => {
    filterState.search = event.target.value;
    render();
  });

  typeFilter.addEventListener('change', (event) => {
    filterState.type = event.target.value;
    render();
  });

  sortSelect.addEventListener('change', (event) => {
    filterState.sortBy = event.target.value;
    render();
  });

  favoritesToggle.addEventListener('click', () => {
    filterState.favoritesOnly = !filterState.favoritesOnly;
    render();
  });
};

const wireFavoriteButtons = () => {
  app.addEventListener('click', (event) => {
    const heartBtn = event.target.closest('.favorite-btn');
    if (!heartBtn) return;

    event.stopImmediatePropagation();
    const id = parseInt(heartBtn.dataset.id, 10);
    toggleFavorite(id);
    render();
  });
};

const wireThemeToggle = () => {
  themeToggle.addEventListener('click', () => {
    const newTheme = toggleTheme();
    updateThemeButton(newTheme);
  });
};

const wireDetailModal = () => {
  app.addEventListener('click', (event) => {
    const cardOrRow = event.target.closest('.pokemon-card, .pokemon-table tbody tr');
    if (!cardOrRow) return;
    const id = parseInt(cardOrRow.dataset.id, 10);
    openDetail(id);
  });

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) closeDetail();
  });
};

const wireTeamBuilder = () => {
  teamBuilderBtn.addEventListener('click', openTeamBuilder);
  teamModal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) closeTeamBuilder();
  });

  teamPickable.addEventListener('change', (event) => {
    if (!event.target.matches('input[type="checkbox"]')) return;

    const id = parseInt(event.target.value, 10);
    if (event.target.checked) {
      teamSelection.add(id);
    } else {
      teamSelection.delete(id);
    }
    updatePickCount();
    event.target.closest('.pickable-card').classList.toggle('is-picked', event.target.checked);
  });

  teamForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = {
      name: teamNameInput.value,
      notes: teamNotesInput.value,
      pokemonIds: [...teamSelection],
    };

    const errors = validateTeam(formData);

    if (!isValid(errors)) {
      showFormErrors(errors);
      return;
    }

    // Valid — save it
    saveTeam(formData);
    teamSelection = new Set();
    teamForm.reset();
    clearFormErrors();
    renderPickable();
    updatePickCount();
    renderSavedTeams();
  });

  // Delete saved team (event delegation)
  savedTeamsList.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.delete-team-btn');
    if (!deleteBtn) return;

    const teamId = parseInt(deleteBtn.dataset.teamId, 10);
    if (confirm('Delete this team?')) {
      deleteTeam(teamId);
      renderSavedTeams();
    }
  });
};

const wireEscapeKey = () => {
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (!modal.hidden) closeDetail();
    else if (!teamModal.hidden) closeTeamBuilder();
  });
};
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pokedex booting...');

  const initialTheme = initTheme();
  updateThemeButton(initialTheme);

  wireViewToggle();
  wireFilterControls();
  wireFavoriteButtons();
  wireThemeToggle();
  wireDetailModal();
  wireTeamBuilder();
  wireEscapeKey();

  try {
    pokemon = await getAllPokemon();
    populateTypeFilter();
    render();
  } catch (err) {
    app.innerHTML = `<p>Error loading Pokemon: ${err.message}</p>`;
    console.error(err);
  }
});