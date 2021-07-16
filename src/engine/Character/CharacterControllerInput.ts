import { ExecuteCodeAction, Scene, ActionManager } from "babylonjs";

interface IKeys {
    forward: boolean,
    backward: boolean,
    left: boolean,
    right: boolean,
    space: boolean,
    shift: boolean
}

export default class CharacterControllerInput {
    private _keys: IKeys;
    private _inputMap: Object = {};
    private _scene: Scene;
    public onKeyUpCallback: Function;
    constructor(scene: Scene, onKeyUpCallback: Function) {
        this._scene = scene;
        this.onKeyUpCallback = onKeyUpCallback;
        this.init();
    }

    protected init(){
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            shift: false
        };
        this._scene.actionManager = new ActionManager(this._scene);
        this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
            this.onKeyDown(evt.sourceEvent.code)
        }));
        this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
            this._inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keyup";
            this.onKeyUp(evt.sourceEvent.code)
        }));
    }

    protected onKeyDown(key: string){
        console.log('DOWN:', key);
        switch (key) {
            case "KeyW":
            case "ArrowUp":
                this._keys.forward = true;
                break;
            case "KeyS":
            case "ArrowDown":
                this._keys.backward = true;
                break;
            case "KeyA":
            case "ArrowLeft":
                this._keys.left = true;
                break;
            case "KeyD":
            case "ArrowRight":
                this._keys.right = true;
                break;
            case "Space":
                this._keys.space = true;
                break;
            case "Shift":
                this._keys.shift = true;
                break;
        }
    }
    protected onKeyUp(key: string){
        console.log('UP:', key);
        switch (key) {
            case "KeyW":
            case "ArrowUp":
                this._keys.forward = false;
                break;
            case "KeyS":
            case "ArrowDown":
                this._keys.backward = false;
                break;
            case "KeyA":
            case "ArrowLeft":
                this._keys.left = false;
                break;
            case "KeyD":
            case "ArrowRight":
                this._keys.right = false;
                break;
            case "Space":
                this._keys.space = false;
                break;
            case "Shift":
                this._keys.shift = false;
                break;
        }
        this.onKeyUpCallback(key);
    }

    public getKey() : IKeys {
        return this._keys;
    }
}
