import { Scene, Mesh, ArcRotateCamera, Vector3 } from "babylonjs";
import AnimationsController from "../AnimationsController";
import {ISceneLoaderAsyncResult} from "babylonjs/Loading/sceneLoader";
import * as BABYLON from "babylonjs";
import {AnimationGroup} from "babylonjs/Animations/animationGroup";
import * as _ from "lodash";
import CharacterController from "./CharacterController";

export default class Character{
    private _characterMesh: Mesh;
    private _characterCamera: ArcRotateCamera;
    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _characterAnimationController: AnimationsController;
    private _characterController: CharacterController;

    constructor(scene: Scene, canvas: HTMLCanvasElement){
        this._scene = scene;
        this._canvas = canvas;
        this.init();
    }

    private async init(){
        this._characterAnimationController = new AnimationsController();
        await this.addCharacter();
        this.addCamera();
        this._characterController = new CharacterController(this._scene, this._characterMesh, this._characterCamera);
    }

    public get camera(){
        return this._characterCamera;
    }

    protected async addCharacter(){
        //TODO move to loader
        let loaderData: ISceneLoaderAsyncResult = await BABYLON.SceneLoader.ImportMeshAsync("", "/assets/characters/", "character.glb", this._scene);

        this._characterMesh = loaderData.meshes[0] as BABYLON.Mesh;
        _.forEach(loaderData.animationGroups, (animationGroup: AnimationGroup) => {
            this._characterAnimationController.add(animationGroup.name, animationGroup);
        });
        this._characterMesh.scaling.scaleInPlace(1);

        this._characterMesh.position.y = 1;
        this._characterMesh.checkCollisions = true;
        this._characterMesh.isPickable = false;
        this._characterMesh.ellipsoid = new Vector3(0.5, 1, 0.2);
        this._characterMesh.ellipsoidOffset = new Vector3(0, 1, 0);
        //this.drawEllipsoid(this._characterMesh);
    }

    protected addCamera() {
        let alpha = -this._characterMesh.rotation.y - 4.69;
        let beta = Math.PI / 2.5;
        let target = new Vector3(this._characterMesh.position.x, this._characterMesh.position.y + 1.5, this._characterMesh.position.z);
        this._characterCamera = new ArcRotateCamera(
            "PlayerCamera",
            alpha,
            beta,
            7,
            target,
            this._scene
        );
        this._characterCamera.wheelPrecision = 15;
        this._characterCamera.checkCollisions = false;
        this._characterCamera.keysLeft = [];
        this._characterCamera.keysRight = [];
        this._characterCamera.keysUp = [];
        this._characterCamera.keysDown = [];
        this._characterCamera.lowerRadiusLimit = 2;
        this._characterCamera.upperRadiusLimit = 20;
        this._characterCamera.attachControl(this._canvas, false);
    }

    // only for debug ellipsoid
    protected drawEllipsoid(mesh) {
        mesh.computeWorldMatrix(true);
        let ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
        if (!ellipsoidMat) {
            ellipsoidMat = new BABYLON.StandardMaterial("__ellipsoidMat__", mesh.getScene());
            ellipsoidMat.wireframe = true;
            ellipsoidMat.emissiveColor = BABYLON.Color3.Green();
            ellipsoidMat.specularColor = BABYLON.Color3.Black();
        }
        let ellipsoid = BABYLON.Mesh.CreateSphere("__ellipsoid__", 9, 1, mesh.getScene());
        ellipsoid.scaling = mesh.ellipsoid.clone();
        ellipsoid.scaling.y *= 2;
        ellipsoid.scaling.x *= 2;
        ellipsoid.scaling.z *= 2;
        ellipsoid.material = ellipsoidMat;
        ellipsoid.parent = mesh;
        ellipsoid.computeWorldMatrix(true);
    }
}
