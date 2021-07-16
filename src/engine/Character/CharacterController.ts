import CharacterControllerInput from "./CharacterControllerInput";
import FiniteStateMachine from "../StateMachine/FiniteStateMachine";
import IdleState from "./CharacterFSM/IdleState";
import RunState from "./CharacterFSM/RunState";
import {CharacterStateNames} from "./misc/CharacterStateNames";
import * as BABYLON from "babylonjs";
import { Scene, Mesh, ArcRotateCamera,Vector3 } from "babylonjs";
import * as _ from 'lodash';

export default class CharacterController {
    private _input: CharacterControllerInput;
    private _stateMachine: FiniteStateMachine;
    private _characterMesh: Mesh;
    private _characterCamera: ArcRotateCamera;
    private _scene: Scene;
    private _onGround: boolean = false;
    private _onTop: boolean = false;
    private _gravity: number = 5;

    protected _characterVelocity: number = 0;
    protected _characterSpeed: number = 2;
    protected _isCharacterJump: boolean = false;
    protected _isCharacterFall: boolean = false;


    constructor(scene: Scene, mesh: Mesh, camera: ArcRotateCamera) {
        this._input = new CharacterControllerInput(scene, this.onKeyUp);
        this._stateMachine = new FiniteStateMachine();
        this._scene = scene;
        this._characterCamera = camera;
        this._characterMesh = mesh;
        this.init();
    }

    init(){
        this._stateMachine.addState(new IdleState(CharacterStateNames.IDLE));
        this._stateMachine.addState(new RunState(CharacterStateNames.RUN));

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
                    this._isCharacterJump = false;
                    this._isCharacterFall = true;
                }
            }
        });
        this._scene.onBeforeRenderObservable.add(this.update.bind(this));
    }

    protected fall() {
        if (!this._isCharacterFall) {
            this._characterVelocity = 0;
            this._isCharacterJump = false;
            this._isCharacterFall = true;
        }
    }

    protected jump() {
        if (!this._isCharacterJump) {
            this._characterVelocity = 0.4;
            this._isCharacterJump = true;
        }
    }

    private checkOnGround(): void {
        const origin = this._characterMesh.position;
        const targetPoint = origin.clone();
        targetPoint.y -= 1;
        const direction = targetPoint.subtract(origin);
        direction.normalize();
        const length = 0.2;
        const ray = new BABYLON.Ray(origin, direction, length);
        const hit = this._scene.pickWithRay(ray);
        //BABYLON.RayHelper.CreateAndShow(ray, this.scene, new BABYLON.Color3(1, 1, 0.1));
        this._onGround = !_.isNil(hit.pickedMesh) && hit.pickedMesh.id !== 'ray'
    }

    private checkOnTop(): void {
        const origin = this._characterMesh.position;
        const targetPoint = origin.clone();
        targetPoint.y += 1;
        const direction = targetPoint.subtract(origin);
        direction.normalize();
        const length = 0.2;
        const ray = new BABYLON.Ray(origin, direction, length);
        const hit = this._scene.pickWithRay(ray);
        //BABYLON.RayHelper.CreateAndShow(ray, this.scene, new BABYLON.Color3(1, 1, 0.1));
        this._onTop = !_.isNil(hit.pickedMesh)
    }

    protected characterLookPositionToCamera() {
        let focus = this._characterCamera.getFrontPosition(100);
        focus.y = 0;
        focus.multiplyInPlace(new Vector3(-1, -1, -1));
        this._characterMesh.lookAt(focus);
    }

    protected onKeyUp(key: string){
        if(this._onGround){
            this._stateMachine.setState(CharacterStateNames.IDLE);
        }
    }

    protected update(){
        this.characterLookPositionToCamera();
        this.checkOnGround();
        if (this._input.getKey().forward) {
            this._characterMesh.moveWithCollisions(new Vector3(Math.cos(this._characterCamera.alpha) * -1 * this._characterSpeed, 0, Math.sin(this._characterCamera.alpha) * -1 * this._characterSpeed));
            this._stateMachine.setState(CharacterStateNames.RUN);
        }
        if (this._input.getKey().backward) {
            this._characterMesh.moveWithCollisions(new Vector3(Math.cos(this._characterCamera.alpha) * 1 * this._characterSpeed, 0, Math.sin(this._characterCamera.alpha) * 1 * this._characterSpeed));
            this._stateMachine.setState(CharacterStateNames.RUN);
        }
        if (this._input.getKey().left) {
            this._characterMesh.moveWithCollisions(new Vector3(Math.cos(this._characterCamera.alpha + Math.PI / 2) * -1 * this._characterSpeed, 0, Math.sin(this._characterCamera.alpha + Math.PI / 2) * -1 * this._characterSpeed));
            this._stateMachine.setState(CharacterStateNames.LEFT);
        }
        if (this._input.getKey().right) {
            this._characterMesh.moveWithCollisions(new Vector3(Math.cos(this._characterCamera.alpha + Math.PI / 2) * 1 * this._characterSpeed, 0, Math.sin(this._characterCamera.alpha + Math.PI / 2) * 1 * this._characterSpeed));
            this._stateMachine.setState(CharacterStateNames.RIGHT);
        }
        if (this._input.getKey().space){
            this.jump();
            this._stateMachine.setState(CharacterStateNames.JUMP);
        }
        if (this._isCharacterJump) {
            this._characterMesh.moveWithCollisions(new Vector3(0, this._characterVelocity, 0));
            this._characterVelocity = this._characterVelocity + this._scene.getEngine().getDeltaTime() / 1000 * this._gravity;
            this._stateMachine.setState(CharacterStateNames.JUMP);
        }
        if (this._isCharacterFall) {
            this._characterMesh.moveWithCollisions(new Vector3(0, this._characterVelocity, 0));
            this._characterVelocity = this._characterVelocity + this._scene.getEngine().getDeltaTime() / 1000 * this._gravity;
            this._stateMachine.setState(CharacterStateNames.FALL);
        }
        if (!this._onGround && !this._isCharacterJump) {
            this.fall();
            this._stateMachine.setState(CharacterStateNames.FALL);
        }
    }
}
