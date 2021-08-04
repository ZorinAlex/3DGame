import {State} from "../../StateMachine/State";
import AnimationsController from "../../Animations/AnimationsController";
import CharacterAnimationsNames from "../misc/CharacterAnimationsNames";

export default class JumpState extends State{
    protected animationController: AnimationsController;
    constructor(name: string, animationController: AnimationsController){
        super(name);
        this.animationController = animationController;
    }
    enter() {
        this.animationController.play(CharacterAnimationsNames.JUMP, false);
        console.log('ENTER STATE: ', this.name)
    }
    exit() {
        this.animationController.stop(CharacterAnimationsNames.JUMP);
        console.log('EXIT STATE: ', this.name)
    }
}
