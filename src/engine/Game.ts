import {Engine, Scene} from 'babylonjs';
import Level from "./Level";
import Loader from "./Loader";

export default class Game {
	private canvas: HTMLCanvasElement;
	private engine: Engine;
	private scene: Scene;
	private level: Level;
	// private levels: Object;

	constructor(canvasID: string) {
		this.canvas = <HTMLCanvasElement>document.getElementById(canvasID);
		this.engine = new Engine(this.canvas, true);
		this.scene = new Scene(this.engine);
		this.canvas.addEventListener('click', ()=>{
            this.enablePointerLock();
		});
		window.addEventListener("resize", () => {
			this.engine.resize();
		});
	}

	public enablePointerLock () {
		// this.canvas.requestPointerLock = this.canvas.requestPointerLock
		// 	|| this.canvas.mozRequestPointerLock
		// 	|| this.canvas.webkitRequestPointerLock;
		this.canvas.requestPointerLock();
		this.engine.isPointerLock = true;
	}

	public async startLevel (name) {
		let loader = new Loader(this.scene);
		await loader.loadLevel();
		await loader.loadAssets();
		this.level = new Level(name, this.engine, this.canvas, this.scene);
		this.render();
	}

	public disablePointerLock () {
		document.exitPointerLock();
		this.engine.isPointerLock = false;
	}

	public render() {
		this.startRenderLoop();
	}

	public startRenderLoop() {
		this.engine.runRenderLoop(() => {
			let divFps = document.getElementById("fps");
			divFps.innerHTML = this.engine.getFps().toFixed() + " fps";
			this.level.render();
		});
	}

	public stopRenderLoop() {
		this.engine.stopRenderLoop();
	}
}
