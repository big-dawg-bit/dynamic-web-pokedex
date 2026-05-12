import './style.css';
import { getAllPokemon, getUniqueTypes } from './api.js';
import { renderCardGrid, renderTable, capitalize } from './ui.js';
import { applyFilters } from './filters.js';
import { toggleFavorite, getFavoriteCount } from './favorites.js';
import { initTheme, toggleTheme } from './preferences.js';
import { observeCards } from './observer.js';

let pokemon = [];
let currentView = 'cards';

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

    event.stopPropagation();
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


document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pokedex booting...');

  const initialTheme = initTheme();
  updateThemeButton(initialTheme);

  wireViewToggle();
  wireFilterControls();
  wireFavoriteButtons();
  wireThemeToggle();

  try {
    pokemon = await getAllPokemon();
    populateTypeFilter();
    render();
  } catch (err) {
    app.innerHTML = `<p>Error loading Pokemon: ${err.message}</p>`;
    console.error(err);
  }
});