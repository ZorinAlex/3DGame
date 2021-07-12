"use strict";
exports.__esModule = true;
var _ = require("lodash");
var FiniteStateMachine = /** @class */ (function () {
    function FiniteStateMachine() {
        this._states = new Map();
        this._currentState = null;
    }
    FiniteStateMachine.prototype.addState = function (state) {
        this._states.set(state.name, state);
    };
    FiniteStateMachine.prototype.setState = function (name) {
        if (this._states.has(name)) {
            var previousState = this._currentState;
            if (!_.isNil(previousState)) {
                if (previousState.name == name)
                    return;
                previousState.exit();
            }
            this._currentState = this._states.get(name);
            this._currentState.enter(previousState);
        }
        else {
            console.error('state not exists: ', name);
        }
    };
    FiniteStateMachine.prototype.update = function () {
        if (!_.isNil(this._currentState)) {
            this._currentState.update();
        }
    };
    return FiniteStateMachine;
}());
exports["default"] = FiniteStateMachine;
