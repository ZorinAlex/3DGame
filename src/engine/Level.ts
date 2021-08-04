import Character from './Character/Character';
import {Scene, Mesh, Engine,Vector3,CubeTexture, HemisphericLight, StandardMaterial, Texture} from "babylonjs";

export default class Level {
	private name: string;
	private player: Character;
	private canvas: HTMLCanvasElement;
	private scene: Scene;
	private skybox: Mesh;
	private engine: Engine;

	constructor(name, engine, canvas,scene) {
		this.name = name;
		this.canvas = canvas;
		this.engine = engine;
		this.scene = scene;
		this.scene.gravity = new Vector3(0, -0.81, 0);
		this.scene.collisionsEnabled = true;

		this.addPlayer();
		this.setSkybox();
		this.addLight();
	}

	// public load() {
	// 	BABYLON.SceneLoader.Append('/assets/levels/', `${this.name}.babylon`, this.scene, (scene) => {
	// 		let ambientLight = new BABYLON.HemisphericLight('ambientLight', new BABYLON.Vector3(0, 1, 0), this.scene);
	// 		ambientLight.intensity = .1;
	// 	})
	// }

	public render() {
		this.scene.render();
	}

	public addPlayer() {
		this.player = new Character(this.scene, this.canvas);
		this.scene.activeCamera = this.player.camera;
	}

	public setSkybox () {
		this.skybox = Mesh.CreateBox("skyBox", 250, this.scene);
        let skyboxMaterial = new StandardMaterial("skybox", this.scene);

        this.skybox.material = skyboxMaterial;
        this.skybox.infiniteDistance = true;

        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.disableLighting = true;
        //TODO get texture id somewhere :D
		skyboxMaterial.reflectionTexture = this.scene.getTextureByUniqueID(0)

        //skyboxMaterial.reflectionTexture = new CubeTexture("/assets/skybox/SpecularHDR.dds", this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	}

	addLight(){
		let ambientLight = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), this.scene);
		ambientLight.intensity = .1;
	}
}
