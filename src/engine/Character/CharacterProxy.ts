import FiniteStateMachine from "../StateMachine/FiniteStateMachine";
import AnimationsController from "../Animations/AnimationsController";
import CharacterControllerInput from "./CharacterControllerInput";
import CharacterMovement from "./CharacterMovement";

export default class CharacterProxy {
    private _stateMachine: FiniteStateMachine;
    private _animationController: AnimationsController;
    private _characterControllerInput: CharacterControllerInput;
    private _characterMovement: CharacterMovement;

    constructor(stateMachine: FiniteStateMachine,animationController: AnimationsController, characterControllerInput: CharacterControllerInput, characterMovement: CharacterMovement ){
        this._stateMachine = stateMachine;
        this._animationController = animationController;
        this._characterControllerInput = characterControllerInput;
        this._characterMovement = characterMovement;
    }

    get stateMachine(): FiniteStateMachine{
        return this._stateMachine;
    }

    get animationController(): AnimationsController{
        return this._animationController;
    }

    get characterControllerInput(): CharacterControllerInput{
        return this._characterControllerInput;
    }

    get characterMovement(): CharacterMovement{
        return this._characterMovement;
    }
}
