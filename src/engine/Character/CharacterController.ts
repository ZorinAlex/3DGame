import CharacterControllerInput from "./CharacterControllerInput";
import FiniteStateMachine from "../StateMachine/FiniteStateMachine";
import {CharacterStateNames} from "./misc/CharacterStateNames";
import { Scene, Mesh, ArcRotateCamera,Vector3, Ray, RayHelper, Color3, UniversalCamera } from "babylonjs";
import * as _ from 'lodash';

export default class CharacterController {
    private _input: CharacterControllerInput;
    private _stateMachine: FiniteStateMachine;
    private _characterMesh: Mesh;
    private _characterCamera: ArcRotateCamera;
    private _scene: Scene;
    private _onGround: boolean = false;
    private _onTop: boolean = false;
    private _gravity: number = -1.2;
    private isDebugMode: boolean = false;

    protected _characterVelocity: number = 0.4;
    protected _characterSpeed: number = 0.2;
    protected _isCharacterJump: boolean = false;
    protected _isCharacterFall: boolean = false;

    protected topRay: Ray;
    protected bottomRay: Ray;

    constructor(scene: Scene, mesh: Mesh, camera: ArcRotateCamera, stateMachine: FiniteStateMachine) {
        //this._input = new CharacterControllerInput(scene, this.onKeyUp.bind(this));
        this._stateMachine = stateMachine;
        this._scene = scene;
        this._characterCamera = camera;
        this._characterMesh = mesh;
        this.init();
    }

    init(){
        this._stateMachine.setState(CharacterStateNames.IDLE);
        this._characterMesh.onCollideObservable.add(() => {
            if (this._onGround && this._isCharacterJump) {
                this._isCharacterJump = false;
            }
            if (this._onGround && this._isCharacterFall) {
                this._isCharacterFall = false;
            }
            if (this._isCharacterJump) {
                this.checkOnTop();
                if (this._onTop) {
                    this._characterVelocity = -this._characterVelocity/10;
                    this._isCharacterJump = false;
                    this._isCharacterFall = true;
                }
            }
        });
        this.initBottomRay();
        this.initTopRay();
        //this._scene.onBeforeRenderObservable.add(this.update.bind(this));
        this._scene.getEngine().runRenderLoop(() => {
            this.update()
        });
        this._characterCamera.setTarget(this._characterMesh.position);
    }

    protected initTopRay(){
        const origin = this._characterMesh.position;
        const targetPoint = origin.clone();
        targetPoint.y += 1;
        const direction = targetPoint.subtract(origin);
        direction.normalize();
        const length = 0.5;
        this.topRay = new Ray(origin, direction, length);
        if (this.isDebugMode) RayHelper.CreateAndShow(this.topRay, this._scene, new Color3(1, 0.1, 0.1));
    }

    protected initBottomRay(){
        const origin = this._characterMesh.position;
        const targetPoint = origin.clone();
        targetPoint.y -= 1;
        const direction = targetPoint.subtract(origin);
        direction.normalize();
        const length = 0.2;
        this.bottomRay = new Ray(origin, direction, length);
        if (this.isDebugMode) RayHelper.CreateAndShow(this.bottomRay, this._scene, new Color3(1, 1, 0.1));
    }

    protected fall() {
        if (this._isCharacterFall) return;
            this._characterVelocity = 0;
            this._isCharacterJump = false;
            this._isCharacterFall = true;
    }

    protected jump() {
        if (!this._isCharacterJump) {
            this._characterVelocity = 0.4;
            this._isCharacterJump = true;
        }
    }

    private checkOnGround(): void {
        const hit = this._scene.pickWithRay(this.bottomRay);
        this._onGround = !_.isNil(hit.pickedMesh) && hit.pickedMesh.id !== 'ray'
    }

    private checkOnTop(): void {
        if(this._onTop) return;
        const hit = this._scene.pickWithRay(this.topRay);
        this._onTop = !_.isNil(hit.pickedMesh) && hit.pickedMesh.id !== 'ray';
    }

    protected characterLookPositionToCamera() {
        const camAng = -this._characterCamera.alpha - BABYLON.Tools.ToDegrees(40);
        this._characterMesh.rotation = new Vector3(0, camAng, 0);
    }

    // protected onKeyUp(key: string){
    //     if(this._onGround){
    //         this._stateMachine.setState(CharacterStateNames.IDLE);
    //     }
    // }

    protected update(){
        this._stateMachine.update();
        this.characterLookPositionToCamera();
        // this.checkOnGround();
        // if (this._input.getKey().forward) {
        //     this._characterMesh.moveWithCollisions(new Vector3(this._characterMesh.forward.x * this._characterSpeed, 0, this._characterMesh.forward.z * this._characterSpeed));
        //     this._stateMachine.setState(CharacterStateNames.RUN);
        // }else if (this._input.getKey().backward) {
        //     this._characterMesh.moveWithCollisions(new Vector3(-this._characterMesh.forward.x * this._characterSpeed, 0, -this._characterMesh.forward.z * this._characterSpeed));
        //     this._stateMachine.setState(CharacterStateNames.RUN);
        // }else if (this._input.getKey().left) {
        //     this._characterMesh.moveWithCollisions(new Vector3(this._characterMesh.right.x * this._characterSpeed, 0, this._characterMesh.right.z * this._characterSpeed));
        //     this._stateMachine.setState(CharacterStateNames.LEFT);
        // }else if (this._input.getKey().right) {
        //     this._characterMesh.moveWithCollisions(new Vector3(-this._characterMesh.right.x * this._characterSpeed, 0, -this._characterMesh.right.z * this._characterSpeed));
        //     this._stateMachine.setState(CharacterStateNames.RIGHT);
        // }
        // if (this._input.getKey().space){
        //     this.jump();
        //     this._stateMachine.setState(CharacterStateNames.JUMP);
        // }
        // if (this._isCharacterJump) {
        //     this._characterMesh.moveWithCollisions(new Vector3(0, this._characterVelocity, 0));
        //     this._characterVelocity = this._characterVelocity + this._scene.getEngine().getDeltaTime() / 1000 * this._gravity;
        //     if(this._characterVelocity>0){
        //         this._stateMachine.setState(CharacterStateNames.JUMP);
        //     }else{
        //         this._stateMachine.setState(CharacterStateNames.FALL);
        //     }
        // }
        // if (this._isCharacterFall) {
        //     this._characterMesh.moveWithCollisions(new Vector3(0, this._characterVelocity, 0));
        //     this._characterVelocity = this._characterVelocity + this._scene.getEngine().getDeltaTime() / 1000 * this._gravity;
        //     this._stateMachine.setState(CharacterStateNames.FALL);
        // }
        // if (!this._onGround && !this._isCharacterJump) {
        //     this.fall();
        //     this._stateMachine.setState(CharacterStateNames.FALL);
        // }
        // if(this._onGround && this._stateMachine.getState().name === CharacterStateNames.FALL){
        //     this._stateMachine.setState(CharacterStateNames.IDLE);
        // }
    }
}
