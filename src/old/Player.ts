import * as BABYLON from 'babylonjs';
import {AnimationGroup, ArcRotateCamera, ISceneLoaderAsyncResult, Vector3} from 'babylonjs';
import * as _ from 'lodash';
import 'babylonjs-loaders';
import {EPlayerState} from "../utils/PlayerStateNames";
import PlayerAnimationsNames from "../utils/PlayerAnimationsNames";

export default class Player {
    public camera: ArcRotateCamera;
    private canvas: HTMLCanvasElement;
    private scene: BABYLON.Scene;
    private character: BABYLON.Mesh;
    private playerState: EPlayerState;
    private animations: Map<string, AnimationGroup> = new Map();
    private isJump: boolean = false;
    private isFall: boolean = false;

    private startControl: boolean = false;
    private onGround: boolean = false;
    private onTop: boolean = false;
    private characterSpeed: number = 0.2;
    private keyPressed: any = {W: false, A: false, S: false, D: false};
    private vel: number = 0.4;
    private gravity: number = -1.2;

    constructor(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
        this.scene = scene;
        this.initCharacter(scene, canvas);
    }

    private setState(state: EPlayerState) {
        if (this.playerState == state) return;
        switch (this.playerState) {
            case EPlayerState.Idle:
                this.stopAnimationByName(PlayerAnimationsNames.IDLE);
                break;
            case EPlayerState.Run:
                this.stopAnimationByName(PlayerAnimationsNames.RUN);
                break;
        }
        this.playerState = state;
        switch (state) {
            case EPlayerState.Idle:
                this.playAnimationByName(PlayerAnimationsNames.IDLE);
                break;
            case EPlayerState.Run:
                this.playAnimationByName(PlayerAnimationsNames.RUN);
                break;
            case EPlayerState.Left:
                //this.playAnimationByName(PlayerAnimationsNames);
                break;
            case EPlayerState.Right:
                //this.playAnimationByName(PlayerAnimationsNames.RUN);
                break;
            case EPlayerState.Jump:
                this.playAnimationByName(PlayerAnimationsNames.JUMP);
                break;
            case EPlayerState.Fall:
                this.playAnimationByName(PlayerAnimationsNames.FALL);
                break;
        }

    }

    protected playAnimationByName(name: string, speed: number = 1) {
        if (!this.animations.has(name)) {
            console.error('animation not found: ', name);
        } else {
            let animation = this.animations.get(name);
            console.log('play animation: ',  name);
            animation.start(true, speed, animation.from, animation.to, false)
        }
    }

    protected stopAnimationByName(name: string) {
        if (!this.animations.has(name)) {
            console.error('animation not found: ', name);
        } else {
            let animation = this.animations.get(name);
            console.log('stop animation: ',  name);
            animation.stop();
        }
    }

    async initCharacter(scene: BABYLON.Scene, canvas: HTMLCanvasElement) {
        let loaderData: ISceneLoaderAsyncResult = await BABYLON.SceneLoader.ImportMeshAsync("", "/assets/characters/", "character.glb", this.scene);
        this.character = loaderData.meshes[0] as BABYLON.Mesh;
        _.forEach(loaderData.animationGroups, (animationGroup: AnimationGroup) => {
            this.animations.set(animationGroup.name, animationGroup);
        });
        this.character.scaling.scaleInPlace(1);

        this.character.position.y = 1;
        this.character.checkCollisions = true;
        this.character.isPickable = false;
        this.character.onCollideObservable.add(() => {
            if (this.onGround && this.isJump) {
                this.isJump = false;
            }
            if (this.onGround && this.isFall) {
                this.isFall = false;
            }
            if (this.isJump) {
                this.checkOnTop();
                if (this.onTop) {
                    this.isJump = false;
                    this.isFall = true;
                }
            }

        });
        this.character.ellipsoid = new Vector3(0.5, 1, 0.2);
        this.character.ellipsoidOffset = new Vector3(0, 1, 0);
        //this.drawEllipsoid(this.character);
        this.addCamera(scene, canvas);
        this.addHandlers();
        this.setState(EPlayerState.Idle);
    }

    addCamera(scene, canvas) {
        let alpha = -this.character.rotation.y - 4.69;
        let beta = Math.PI / 2.5;
        let target = new Vector3(this.character.position.x, this.character.position.y + 1.5, this.character.position.z);
        this.camera = new ArcRotateCamera(
            "PlayerCamera",
            alpha,
            beta,
            7,
            target,
            scene
        );
        this.camera.wheelPrecision = 15;
        this.camera.checkCollisions = false;
        this.camera.keysLeft = [];
        this.camera.keysRight = [];
        this.camera.keysUp = [];
        this.camera.keysDown = [];
        this.camera.lowerRadiusLimit = 2;
        this.camera.upperRadiusLimit = 20;
        this.camera.attachControl(canvas, false);
    }

    // only for debug ellipsoid
    drawEllipsoid(mesh) {
        mesh.computeWorldMatrix(true);
        let ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
        if (!ellipsoidMat) {
            ellipsoidMat = new BABYLON.StandardMaterial("__ellipsoidMat__", mesh.getScene());
            ellipsoidMat.wireframe = true;
            ellipsoidMat.emissiveColor = BABYLON.Color3.Green();
            ellipsoidMat.specularColor = BABYLON.Color3.Black();
        }
        let ellipsoid = BABYLON.Mesh.CreateSphere("__ellipsoid__", 9, 1, mesh.getScene());
        ellipsoid.scaling = mesh.ellipsoid.clone();
        ellipsoid.scaling.y *= 2;
        ellipsoid.scaling.x *= 2;
        ellipsoid.scaling.z *= 2;
        ellipsoid.material = ellipsoidMat;
        ellipsoid.parent = mesh;
        ellipsoid.computeWorldMatrix(true);
    }

    public keyHandler(keyboardEvent: BABYLON.KeyboardInfo) {
        this.startControl = true;
        if (!_.isNil(keyboardEvent.event)) {
            switch (keyboardEvent.event.code) {
                case 'Space':
                    if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                        this.jump();
                        this.setState(EPlayerState.Jump);
                    }
                    break;
                case 'KeyW':
                    if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                        this.keyPressed.W = true;
                        this.setState(EPlayerState.Run);
                    } else if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYUP) {
                        this.keyPressed.W = false;
                        this.setState(EPlayerState.Idle);
                    }
                    break;
                case 'KeyS':
                    if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                        this.keyPressed.S = true;
                    } else if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYUP) {
                        this.keyPressed.S = false;
                    }
                    break;
                case 'KeyA':
                    if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                        this.keyPressed.A = true;
                    } else if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYUP) {
                        this.keyPressed.A = false;
                    }
                    break;
                case 'KeyD':
                    if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYDOWN) {
                        this.keyPressed.D = true;
                    } else if (keyboardEvent.type === BABYLON.KeyboardEventTypes.KEYUP) {
                        this.keyPressed.D = false;
                    }
                    break;
            }
        }

    }

    loop() {
        this.characterLookPositionToCamera();
        this.checkOnGround();
        if (this.isJump) {
            this.character.moveWithCollisions(new Vector3(0, this.vel, 0));
            this.vel = this.vel + this.scene.getEngine().getDeltaTime() / 1000 * this.gravity;
        }
        if (this.isFall) {
            this.character.moveWithCollisions(new Vector3(0, this.vel, 0));
            this.vel = this.vel + this.scene.getEngine().getDeltaTime() / 1000 * this.gravity;
        }
        if (!this.onGround && !this.isJump) {
            this.fall();
        }
        if (this.keyPressed.W) {
            this.character.moveWithCollisions(new Vector3(Math.cos(this.camera.alpha) * -1 * this.characterSpeed, 0, Math.sin(this.camera.alpha) * -1 * this.characterSpeed));
        }
        if (this.keyPressed.S) {
            this.character.moveWithCollisions(new Vector3(Math.cos(this.camera.alpha) * 1 * this.characterSpeed, 0, Math.sin(this.camera.alpha) * 1 * this.characterSpeed));
        }
        if (this.keyPressed.A) {
            this.character.moveWithCollisions(new Vector3(Math.cos(this.camera.alpha + Math.PI / 2) * -1 * this.characterSpeed, 0, Math.sin(this.camera.alpha + Math.PI / 2) * -1 * this.characterSpeed));
        }
        if (this.keyPressed.D) {
            this.character.moveWithCollisions(new Vector3(Math.cos(this.camera.alpha + Math.PI / 2) * 1 * this.characterSpeed, 0, Math.sin(this.camera.alpha + Math.PI / 2) * 1 * this.characterSpeed));
        }
        this.character.rotation.y = -(this.camera.alpha + Math.PI / 2);
        this.camera.setTarget(this.character.position);
    }

    private checkOnGround(): void {
        const origin = this.character.position;
        const targetPoint = origin.clone();
        targetPoint.y -= 1;
        const direction = targetPoint.subtract(origin);
        direction.normalize();
        const length = 0.2;
        const ray = new BABYLON.Ray(origin, direction, length);

        const hit = this.scene.pickWithRay(ray);
        //BABYLON.RayHelper.CreateAndShow(ray, this.scene, new BABYLON.Color3(1, 1, 0.1));
        this.onGround = !_.isNil(hit.pickedMesh) && hit.pickedMesh.id !== 'ray'
    }

    private checkOnTop(): void {
        const origin = this.character.position;
        const targetPoint = origin.clone();
        targetPoint.y += 1;
        const direction = targetPoint.subtract(origin);
        direction.normalize();
        const length = 0.2;
        const ray = new BABYLON.Ray(origin, direction, length);

        const hit = this.scene.pickWithRay(ray);
        //BABYLON.RayHelper.CreateAndShow(ray, this.scene, new BABYLON.Color3(1, 1, 0.1));
        this.onTop = !_.isNil(hit.pickedMesh)
    }

    protected characterLookPositionToCamera() {
        let focus = this.camera.getFrontPosition(100);
        focus.y = 0;
        focus.multiplyInPlace(new Vector3(-1, -1, -1));
        this.character.lookAt(focus);
    }

    private fall() {
        if (!this.isFall) {
            this.vel = 0;
            this.isJump = false;
            this.isFall = true;
        }
    }

    public jump() {
        if (!this.isJump) {
            this.vel = 0.4;
            this.isJump = true;
        }
    }

    private addHandlers() {
        this.scene.onKeyboardObservable.add(this.keyHandler.bind(this));
        this.scene.onBeforeRenderObservable.add(this.loop.bind(this));
    }
}
