import * as BABYLON from 'babylonjs';
import Character from './Character/Character';

export default class Level {
	private name: string;
	private player: Character;
	private canvas: HTMLCanvasElement;
	private scene: BABYLON.Scene;
	private skybox: BABYLON.Mesh;
	private engine: BABYLON.Engine;
	private assetsManager: BABYLON.AssetsManager;

	constructor(name, engine, canvas) {
		this.name = name;
		this.canvas = canvas;
		this.engine = engine;
		this.scene = new BABYLON.Scene(engine);
		this.assetsManager = new BABYLON.AssetsManager(this.scene);

		this.scene.gravity = new BABYLON.Vector3(0, -0.81, 0);
		this.scene.collisionsEnabled = true;

		this.addPlayer();
		this.setSkybox();
	}

	public load() {
		BABYLON.SceneLoader.Append('/assets/levels/', `${this.name}.babylon`, this.scene, (scene) => {
			let ambientLight = new BABYLON.HemisphericLight('ambientLight', new BABYLON.Vector3(0, 1, 0), this.scene);
			ambientLight.intensity = .1;
		})
	}

	public render() {
		this.scene.render();
	}

	public addPlayer() {
		this.player = new Character(this.scene, this.canvas);
		this.scene.activeCamera = this.player.camera;
	}

	public setSkybox () {
		this.skybox = BABYLON.Mesh.CreateBox("skyBox", 250, this.scene);
        let skyboxMaterial = new BABYLON.StandardMaterial("skybox", this.scene);

        this.skybox.material = skyboxMaterial;
        this.skybox.infiniteDistance = true;

        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("/assets/skybox/SpecularHDR.dds", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
	}
}
