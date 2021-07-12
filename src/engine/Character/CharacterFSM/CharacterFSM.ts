import FiniteStateMachine from "../../StateMachine/FiniteStateMachine";
import IdleState from "./IdleState";
import RunState from "./RunState";

export default class CharacterFSM extends FiniteStateMachine{
    constructor(){
        super();
        this.init();
    }

    init(){
        this.addState(new IdleState('idle'));
        this.addState(new RunState('run'));
    }
}
