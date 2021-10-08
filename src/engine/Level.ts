import Character from './Character/Character';
import {Scene, Mesh, Engine,Vector3,CubeTexture, HemisphericLight, StandardMaterial, Texture, PointLight, ShadowGenerator, IShadowLight, RenderTargetTexture, Light, AbstractMesh} from "babylonjs";
import * as _ from 'lodash';

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
        let skyboxTexture: Texture = _.find(this.scene.textures,(texture: Texture)=>{
        	return texture.name.match('skybox')
		})
        //TODO get texture id somewhere :D
		skyboxMaterial.reflectionTexture = this.scene.getTextureByUniqueID(skyboxTexture.uniqueId);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
	}

	addLight(){
		// let ambientLight = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), this.scene);
		// ambientLight.intensity = .1;
		this.addShadows()
	}

	public addShadows(){
		//Player
		let ground = this.scene.getMeshByName('Plane');
		_.forEach(this.scene.lights, (light: Light)=>{
			let lightClone: Light = light.clone(light.name);
			lightClone.name = 'player_light';
			let shadowGenerator = new ShadowGenerator(1024, lightClone as IShadowLight);
			shadowGenerator.addShadowCaster(this.player.mesh);
			_.forEach(this.scene.meshes, (mesh: Mesh)=>{
				shadowGenerator.getShadowMap().renderList.push(mesh);
			})

			shadowGenerator.bias = 0.00001;
			shadowGenerator.normalBias = 0.01;
			shadowGenerator.useContactHardeningShadow = true;
			shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;
		});
		ground.receiveShadows = true;
		//Level objects
		_.forEach(this.scene.lights, (light: IShadowLight)=>{
			if(light.name !== 'player_light'){
				let shadowGenerator = new ShadowGenerator(1024, light);
				shadowGenerator.bias = 0.00001;
				shadowGenerator.normalBias = 0.01;
				shadowGenerator.useContactHardeningShadow = true;
				shadowGenerator.contactHardeningLightSizeUVRatio = 0.05;
				shadowGenerator.setDarkness(0.5);
				_.forEach(this.scene.meshes, (mesh: Mesh)=>{
					if( mesh.name !== 'Character' && mesh.name !== '__root__' && mesh.name !== 'skyBox'){
						shadowGenerator.getShadowMap().renderList.push(mesh);
						// shadowGenerator.addShadowCaster(mesh);
						mesh.receiveShadows = true;
					}else{
						light.excludedMeshes.push(mesh)
					}
				})
				shadowGenerator.getShadowMap().refreshRate = RenderTargetTexture.REFRESHRATE_RENDER_ONCE;
				//@ts-ignore
				light.autoUpdateExtends = false;
			}
		});
	}
}
