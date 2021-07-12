import { ExecuteCodeAction, Scene, ActionManager } from "babylonjs";


export default class CharacterControllerInput {
    private _keys: Object;
    private _inputMap: Object = {};
    private _controlled: any;
    private _scene: Scene;
    constructor(scene: Scene) {
        this._scene = scene;
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
    }
    protected onKeyUp(key: string){
        console.log('UP:', key);
    }
}
