import {State} from "../../StateMachine/State";

export default class RunState extends State{
    constructor(name: string){
        super(name)
    }
    enter() {
        console.log('ENTER STATE: ', this.name)
    }
    exit() {
        console.log('EXIT STATE: ', this.name)
    }
}
