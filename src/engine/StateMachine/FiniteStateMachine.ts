import {IState, State} from "./State";
import * as _ from "lodash";

export default class FiniteStateMachine {
    private _states: Map<string, IState>;
    private _currentState: IState;

    constructor() {
        this._states = new Map();
        this._currentState = null;
    }

    addState(state: IState) {
        this._states.set(state.name, state);
    }

    setState(name: string) {
        if (this._states.has(name)) {
            const previousState: State = this._currentState;
            if (!_.isNil(previousState)) {
                if (previousState.name == name) return;
                previousState.exit();
            }

            this._currentState = this._states.get(name);
            this._currentState.enter(previousState)
        } else {
            console.error('state not exists: ', name);
        }
    }

    update() {
        if(!_.isNil(this._currentState)){
            this._currentState.update();
        }
    }
}
