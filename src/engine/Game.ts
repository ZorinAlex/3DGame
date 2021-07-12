import {Engine, Scene} from 'babylonjs';
import Level from "./Level";

export default class Game {
	private canvas: HTMLCanvasElement;
	private engine: Engine;
	private level: Level;
	// private levels: Object;
	
	constructor(canvasID: string) {
		this.canvas = <HTMLCanvasElement>document.getElementById(canvasID);
		this.engine = new Engine(this.canvas, true);
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
	
	public startLevel (name) {
		this.level = new Level(name, this.engine, this.canvas);
		this.level.load();
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
			this.level.render();
		});
	}
	
	public stopRenderLoop() {
		this.engine.stopRenderLoop();
	}
}