import Game from './engine/Game'

window.addEventListener('DOMContentLoaded', () => {
	// let canvas = <HTMLCanvasElement>document.getElementById('renderCanvas');

	// canvas.requestPointerLock = canvas.requestPointerLock
	// 	|| canvas.mozRequestPointerLock
	// 	|| canvas.webkitRequestPointerLock;

	// canvas.requestPointerLock();

	// window.addEventListener('keydown', ev => {
	// 	if (ev.code === '27') {
	// 		document.exitPointerLock();
	// 	}
	// });

	let game = new Game('renderCanvas');

	game.startLevel('level_2');
	setTimeout(()=>{
		game.render()
	},2000)

});
