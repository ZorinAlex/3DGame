import { AnimationGroup } from "babylonjs/Animations/animationGroup";
import * as _ from 'lodash';

export default class AnimationsController {
    private _animations: Map<string, AnimationGroup> = new Map();
    private _currentAnimation: AnimationGroup = null;

    public add(name: string, animation: AnimationGroup){
        this._animations.set(name, animation);
    }

    public play(name: string, loop: boolean = true, speed: number = 1){
        if (!this._animations.has(name)) {
            console.error('animation not found: ', name);
        } else {
            let animation: AnimationGroup = this._animations.get(name);
            if(!_.isNil(animation)){
                console.log('play animation: ',  name);
                this._currentAnimation = animation;
                animation.start(loop, speed, animation.from, animation.to, false)
                if(!loop){
                    animation.onAnimationGroupEndObservable.addOnce((eventData, eventState)=>{
                        console.log(eventData);
                        console.log(eventState);
                    })
                }
            }else{
                console.error('cannot find animation:', name)
            }
        }
    }

    public stop(name: string) {
        if (!this._animations.has(name)) {
            console.error('animation not found: ', name);
        } else {
            let animation = this._animations.get(name);
            if(!_.isNil(animation)){
                console.log('stop animation: ',  name);
                this._currentAnimation = null;
                animation.stop();
            }else{
                console.error('cannot find animation:', name)
            }
        }
    }
}
