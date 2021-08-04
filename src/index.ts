import Game from './engine/Game'

window.addEventListener('DOMContentLoaded', () => {
	let game = new Game('renderCanvas');
	game.startLevel('level_2');
});
