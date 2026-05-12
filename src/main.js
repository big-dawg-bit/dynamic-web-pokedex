
import './style.css';
import { getAllPokemon } from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('Pokedex booting...');

  const app = document.querySelector('#app');

  try {
    const pokemon = await getAllPokemon();
    app.innerHTML = `<p>Loaded ${pokemon.length} Pokemon. Check the console for the data.</p>`;
    console.log('Pokemon:', pokemon);
  } catch (err) {
    app.innerHTML = `<p>Error loading Pokemon: ${err.message}</p>`;
    console.error(err);
  }
});
