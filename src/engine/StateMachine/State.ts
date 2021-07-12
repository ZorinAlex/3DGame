export interface IState {
    name: string;
    exit();
    enter(IState?);
    update();
}
export class State implements IState{
    public name: string;
    constructor(name: string){
        this.name = name;
    }
    public exit(){}
    public enter(fromState?: IState){}
    public update(){}
}


