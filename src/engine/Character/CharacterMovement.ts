import {Mesh, Ray, Scene,Vector3,RayHelper, Color3} from "babylonjs";
import * as _ from 'lodash';

export default class CharacterMovement {
    private _speed: number;
    private _gravity:number;
    private _velocity: number;
    private _mesh: Mesh;
    private _scene: Scene;
    private _topRay: Ray;
    private _bottomRay: Ray;
    private _isFall: boolean = false;
    private _isJump: boolean = false;

    constructor(speed: number, gravity: number, velocity: number, mesh: Mesh, scene: Scene){
        this._speed = speed;
        this._gravity = gravity;
        this._velocity = velocity;
        this._mesh = mesh;
        this._scene = scene;
        this.init();
    }

    init(){
        this.initTopRay();
        this.initBottomRay();
    }

    public forvard(){
        this._mesh.moveWithCollisions(new Vector3(this._mesh.forward.x * this._speed, 0, this._mesh.forward.z * this._speed));
    }

    public backward(){
        this._mesh.moveWithCollisions(new Vector3(-this._mesh.forward.x * this._speed, 0, -this._mesh.forward.z * this._speed));
    }

    public right(){
        this._mesh.moveWithCollisions(new Vector3(-this._mesh.right.x * this._speed, 0, -this._mesh.right.z * this._speed));
    }

    public left(){
        this._mesh.moveWithCollisions(new Vector3(this._mesh.right.x * this._speed, 0, this._mesh.right.z * this._speed));
    }

    public set isFall(fall: boolean){
        this._isFall = fall;
    }

    public set isJump(fall: boolean){
        this._isJump = fall;
    }

    public get velocity(): number{
        return this._velocity;
    }

    public fall(){
        if(!this._isFall){
            this._velocity = 0;
            this._isFall = true;
        }
        this.vertical();
    }

    public jump(){
        if(!this._isJump) {
            this._velocity = 0.4;
            this._isJump = true;
        }
        //this.updateTopRay()
        this.vertical();
    }

    private vertical(){
        this._mesh.moveWithCollisions(new Vector3(0, this._velocity, 0));
        this._velocity = this._velocity + this._scene.getEngine().getDeltaTime() / 1000 * this._gravity;
    }

    public isOnGround(): boolean {
        const hit = this._scene.pickWithRay(this._bottomRay);
        return !_.isNil(hit.pickedMesh) && hit.pickedMesh.id !== 'ray'
    }

    public isOnTop(): boolean {
        const hit = this._scene.pickWithRay(this._topRay);
        return !_.isNil(hit.pickedMesh) && hit.pickedMesh.id !== 'ray';
    }

    protected initTopRay(){
        const origin = this._mesh.position;
        const targetPoint = origin.clone();
        targetPoint.y += 1;
        const direction = targetPoint.subtract(origin);
        direction.normalize();
        let character = this._scene.getMeshByID('Character') as Mesh;
        let vectorsWorld = character.getBoundingInfo().boundingBox.vectorsWorld;
        let height = Number(vectorsWorld[1].y-(vectorsWorld[0].y));
        const length = height + 0.2;
        this._topRay = new Ray(origin, direction, length);
        //RayHelper.CreateAndShow(this._topRay, this._scene, new Color3(1, 0.1, 0.1));
    }

    private updateTopRay(){
        this._topRay.origin = this._mesh.position.add(new Vector3(0,0.5,0));
    }

    protected initBottomRay(){
        const origin = this._mesh.position;
        const targetPoint = origin.clone();
        targetPoint.y -= 1;
        const direction = targetPoint.subtract(origin);
        direction.normalize();
        const length = 0.5;
        this._bottomRay = new Ray(origin, direction, length);
        //RayHelper.CreateAndShow(this.bottomRay, this._scene, new Color3(1, 1, 0.1));
    }
}
