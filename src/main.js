
import './style.css';
import { getAllPokemon } from './api.js';
import { renderCardGrid } from './ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pokedex booting...');

  const app = document.querySelector('#app');

  try {
    const pokemon = await getAllPokemon();
    renderCardGrid(pokemon, app);
  } catch (err) {
    app.innerHTML = `<p>Error loading Pokemon: ${err.message}</p>`;
    console.error(err);
  }
});
