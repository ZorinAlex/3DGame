"use strict";
exports.__esModule = true;
exports.State = void 0;
var State = /** @class */ (function () {
    function State(name) {
        this.name = name;
    }
    State.prototype.exit = function () { };
    State.prototype.enter = function (fromState) { };
    State.prototype.update = function () { };
    return State;
}());
exports.State = State;
