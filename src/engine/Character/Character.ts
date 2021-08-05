import { Scene, Mesh, Vector3, UniversalCamera, ArcRotateCamera, TransformNode } from "babylonjs";
import AnimationsController from "../Animations/AnimationsController";
import * as BABYLON from "babylonjs";
import * as _ from "lodash";
import CharacterController from "./CharacterController";
import FiniteStateMachine from "../StateMachine/FiniteStateMachine";
import IdleState from "./CharacterStates/IdleState";
import {CharacterStateNames} from "./misc/CharacterStateNames";
import RunState from "./CharacterStates/RunState";
import LeftState from "./CharacterStates/LeftState";
import RightState from "./CharacterStates/RightState";
import JumpState from "./CharacterStates/JumpState";
import FallState from "./CharacterStates/FallState";

export default class Character{
    private _characterMesh: Mesh;
    private _characterCamera: ArcRotateCamera;
    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _characterStateMachine: FiniteStateMachine;
    private _characterAnimationController: AnimationsController;
    private _characterController: CharacterController;

    constructor(scene: Scene, canvas: HTMLCanvasElement){
        this._scene = scene;
        this._canvas = canvas;
        this.init();
    }

    public get camera(){
        return this._characterCamera;
    }

    private async init(){
        await this.addCharacter();
        this._characterAnimationController = new AnimationsController();
        this.addAnimations();
        this.addCamera();
        this._characterStateMachine = new FiniteStateMachine();
        this.addStates();
        this._characterController = new CharacterController(this._scene, this._characterMesh, this._characterCamera, this._characterStateMachine);
    }

    protected addStates(){
        this._characterStateMachine.addState(new IdleState(CharacterStateNames.IDLE, this._characterAnimationController));
        this._characterStateMachine.addState(new RunState(CharacterStateNames.RUN, this._characterAnimationController));
        this._characterStateMachine.addState(new LeftState(CharacterStateNames.LEFT, this._characterAnimationController));
        this._characterStateMachine.addState(new RightState(CharacterStateNames.RIGHT, this._characterAnimationController));
        this._characterStateMachine.addState(new JumpState(CharacterStateNames.JUMP, this._characterAnimationController));
        this._characterStateMachine.addState(new FallState(CharacterStateNames.FALL, this._characterAnimationController));
    }

    protected addAnimations(){
        this._characterAnimationController.add('Idle',this._scene.getAnimationGroupByName('Idle'));
        this._characterAnimationController.add('Run',this._scene.getAnimationGroupByName('Run'));
        this._characterAnimationController.add('Left',this._scene.getAnimationGroupByName('Left'));
        this._characterAnimationController.add('Right',this._scene.getAnimationGroupByName('Right'));
        this._characterAnimationController.add('Jump',this._scene.getAnimationGroupByName('Jump'));
        this._characterAnimationController.add('Fall',this._scene.getAnimationGroupByName('Fall'));
    }

    protected async addCharacter(){
        this._characterMesh = this._scene.getMeshByID('__root__') as Mesh;
        this._characterMesh.scaling.scaleInPlace(1);
        this._characterMesh.position.y = 1;
        this._characterMesh.checkCollisions = true;
        this._characterMesh.isPickable = false;
        this._characterMesh.ellipsoid = new Vector3(0.5, 1, 0.2);
        this._characterMesh.ellipsoidOffset = new Vector3(0, this._characterMesh.ellipsoid.y, 0);
        //this.drawEllipsoid(this._characterMesh);
    }

    protected addCamera1() {
        //root camera parent that handles positioning of the camera to follow the player
        let camRoot: TransformNode = new TransformNode("root");
        camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
        //to face the player from behind (180 degrees)
        camRoot.rotation = new Vector3(0, Math.PI, 0);

        //rotations along the x-axis (up/down tilting)
        let yTilt = new TransformNode("ytilt");
        //adjustments to camera view to point down at our player
        yTilt.rotation = new Vector3(0.5934119456780721, 0, 0);
        yTilt.parent = camRoot;

        //our actual camera that's pointing at our root's position
        //this._characterCamera = new UniversalCamera("cam", new Vector3(0, 0, -30), this._scene);
        //this._characterCamera.lockedTarget = camRoot.position;
        this._characterCamera.fov = 0.47350045992678597;
        this._characterCamera.parent = yTilt;

        this._characterCamera.attachControl(this._canvas, false);

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
        this._characterCamera.wheelPrecision = 20;
        this._characterCamera.checkCollisions = false;
        this._characterCamera.keysLeft = [];
        this._characterCamera.keysRight = [];
        this._characterCamera.keysUp = [];
        this._characterCamera.keysDown = [];
        this._characterCamera.lowerRadiusLimit = 3;
        this._characterCamera.upperRadiusLimit = 7;
        this._characterCamera.lowerBetaLimit = 0.8;
        this._characterCamera.upperBetaLimit = 1.3;
        this._characterCamera.angularSensibilityX=2000;
        this._characterCamera.angularSensibilityY=10000;
        this._characterCamera.attachControl(this._canvas, false);
    }
    // only for debug ellipsoid
    protected drawEllipsoid(mesh) {
        mesh.computeWorldMatrix(true);
        let ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
        if (! ellipsoidMat) {
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
        ellipsoid.position = mesh.ellipsoidOffset.clone();
        ellipsoid.computeWorldMatrix(true);
    }
}
