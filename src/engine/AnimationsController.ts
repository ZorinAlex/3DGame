import { AnimationGroup } from "babylonjs/Animations/animationGroup";

export default class AnimationsController {
    private _animations: Map<string, AnimationGroup> = new Map();
    private _currentAnimation: AnimationGroup = null;

    public add(name: string, animation: AnimationGroup){
        this._animations.set(name, animation);
    }

    public play(name: string, speed: number = 1){
        if (!this._animations.has(name)) {
            console.error('animation not found: ', name);
        } else {
            let animation = this._animations.get(name);
            console.log('play animation: ',  name);
            this._currentAnimation = animation;
            animation.start(true, speed, animation.from, animation.to, false)
        }
    }

    public stop(name: string) {
        if (!this._animations.has(name)) {
            console.error('animation not found: ', name);
        } else {
            let animation = this._animations.get(name);
            console.log('stop animation: ',  name);
            this._currentAnimation = null;
            animation.stop();
        }
    }
}
