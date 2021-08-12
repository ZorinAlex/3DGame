import {State} from "../../StateMachine/State";
import CharacterAnimationsNames from "../misc/CharacterAnimationsNames";
import CharacterProxy from "../CharacterProxy";
import {CharacterStateNames} from "../misc/CharacterStateNames";

export default class FallState extends State{
    private _characterProxy: CharacterProxy;
    constructor(name: string, characterProxy: CharacterProxy){
        super(name);
        this._characterProxy = characterProxy;
    }
    enter() {
        this._characterProxy.characterMovement.isFall = false;
        this._characterProxy.animationController.play(CharacterAnimationsNames.FALL);
        console.log('ENTER STATE: ', this.name)
    }
    exit() {
        this._characterProxy.animationController.stop(CharacterAnimationsNames.FALL);
        console.log('EXIT STATE: ', this.name)
    }
    update() {
        if (this._characterProxy.characterControllerInput.getKey().forward) {
            this._characterProxy.characterMovement.forvard();
        }else if(this._characterProxy.characterControllerInput.getKey().backward){
            this._characterProxy.characterMovement.backward();
        }else if(this._characterProxy.characterControllerInput.getKey().left){
            this._characterProxy.characterMovement.left();
        }else if(this._characterProxy.characterControllerInput.getKey().right){
            this._characterProxy.characterMovement.right();
        }
        if(this._characterProxy.characterMovement.isOnGround()){
            this._characterProxy.stateMachine.setState(CharacterStateNames.IDLE);
        }
        this._characterProxy.characterMovement.fall();
    }
}
