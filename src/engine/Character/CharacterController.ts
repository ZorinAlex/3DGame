import CharacterControllerInput from "./CharacterControllerInput";
import FiniteStateMachine from "../StateMachine/FiniteStateMachine";

export default class CharacterController {
    private _input: CharacterControllerInput;
    private _stateMachine: FiniteStateMachine;

    constructor() {
        //this._input = new CharacterControllerInput();
        this._stateMachine = new FiniteStateMachine();
        this.load();
    }

    load(){

    }
}
