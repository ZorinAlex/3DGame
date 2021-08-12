import FiniteStateMachine from "../StateMachine/FiniteStateMachine";
import {CharacterStateNames} from "./misc/CharacterStateNames";
import { Scene, Mesh, ArcRotateCamera,Vector3} from "babylonjs";
import * as _ from 'lodash';

export default class CharacterController {
    private _stateMachine: FiniteStateMachine;
    private _characterMesh: Mesh;
    private _characterCamera: ArcRotateCamera;
    private _scene: Scene;

    constructor(scene: Scene, mesh: Mesh, camera: ArcRotateCamera, stateMachine: FiniteStateMachine) {
        this._stateMachine = stateMachine;
        this._scene = scene;
        this._characterCamera = camera;
        this._characterMesh = mesh;
        this.init();
    }

    init(){
        this._stateMachine.setState(CharacterStateNames.IDLE);
        this._scene.getEngine().runRenderLoop(() => {
            this.update()
        });
        this._characterCamera.setTarget(this._characterMesh.position);
    }

    protected characterLookPositionToCamera() {
        const camAng = -this._characterCamera.alpha - BABYLON.Tools.ToDegrees(40);
        this._characterMesh.rotation = new Vector3(0, camAng, 0);
    }

    protected update(){
        this._stateMachine.update();
        this.characterLookPositionToCamera();
    }
}
