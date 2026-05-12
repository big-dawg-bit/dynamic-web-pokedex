
import './style.css';
import { getAllPokemon } from './api.js';
import { renderCardGrid, renderTable } from './ui.js';

let pokemon = [];
let currentView = 'cards'; // 'cards' or 'table'

const app = document.querySelector('#app');
const controls = document.querySelector('.controls');

const render = () => {
  if (currentView === 'cards') {
    renderCardGrid(pokemon, app);
  } else {
    renderTable(pokemon, app);
  }
};

const updateToggleUI = () => {
  document.querySelectorAll('.view-toggle').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === currentView);
  });
};

const wireViewToggle = () => {
  controls.addEventListener('click', (event) => {
    if (!event.target.classList.contains('view-toggle')) return;
    currentView = event.target.dataset.view;
    render();
    updateToggleUI();
  });
};

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pokedex booting...');

  wireViewToggle();

  try {
    pokemon = await getAllPokemon();
    render();
  } catch (err) {
    app.innerHTML = `<p>Error loading Pokemon: ${err.message}</p>`;
    console.error(err);
  }
});
