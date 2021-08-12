import {State} from "../../StateMachine/State";
import CharacterAnimationsNames from "../misc/CharacterAnimationsNames";
import CharacterProxy from "../CharacterProxy";
import {CharacterStateNames} from "../misc/CharacterStateNames";

export default class LeftState extends State{
    private _characterProxy: CharacterProxy;
    constructor(name: string, characterProxy: CharacterProxy){
        super(name);
        this._characterProxy = characterProxy;
    }
    enter() {
        this._characterProxy.animationController.play(CharacterAnimationsNames.LEFT);
        console.log('ENTER STATE: ', this.name)
    }
    exit() {
        this._characterProxy.animationController.stop(CharacterAnimationsNames.LEFT);
        console.log('EXIT STATE: ', this.name)
    }
    update() {
        if (this._characterProxy.characterControllerInput.getKey().forward || this._characterProxy.characterControllerInput.getKey().backward) {
            this._characterProxy.stateMachine.setState(CharacterStateNames.RUN);
        }else if(this._characterProxy.characterControllerInput.getKey().left){
            this._characterProxy.characterMovement.left();
        }else if(this._characterProxy.characterControllerInput.getKey().right){
            this._characterProxy.stateMachine.setState(CharacterStateNames.RIGHT);
        }else if(this._characterProxy.characterControllerInput.getKey().space){
            this._characterProxy.stateMachine.setState(CharacterStateNames.JUMP);
        }
        if(this._characterProxy.characterControllerInput.getKey().space){
            this._characterProxy.stateMachine.setState(CharacterStateNames.JUMP);
        }
        if(this._characterProxy.characterControllerInput.noKeysDown()){
            this._characterProxy.stateMachine.setState(CharacterStateNames.IDLE);
        }
        if(!this._characterProxy.characterMovement.isOnGround()){
            this._characterProxy.stateMachine.setState(CharacterStateNames.FALL);
        }
    }
}
