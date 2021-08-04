import {State} from "../../StateMachine/State";
import AnimationsController from "../../Animations/AnimationsController";
import CharacterAnimationsNames from "../misc/CharacterAnimationsNames";

export default class LeftState extends State{
    protected animationController: AnimationsController;
    constructor(name: string, animationController: AnimationsController){
        super(name);
        this.animationController = animationController;
    }
    enter() {
        this.animationController.play(CharacterAnimationsNames.LEFT);
        console.log('ENTER STATE: ', this.name)
    }
    exit() {
        this.animationController.stop(CharacterAnimationsNames.LEFT);
        console.log('EXIT STATE: ', this.name)
    }
}
