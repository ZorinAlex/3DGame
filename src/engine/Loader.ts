import {Scene, AssetsManager} from "babylonjs";
import 'babylonjs-loaders';

export default class Loader {
    protected assetsManager: AssetsManager;
    constructor(scene: Scene){
        this.assetsManager = new AssetsManager(scene);
    }
    public loadAssets(): Promise<void>{
        return new Promise((resolve, reject) => {
            this.assetsManager.addMeshTask("level", "", "assets/levels/", "level_2.babylon");
            this.assetsManager.addCubeTextureTask("skybox", "assets/skybox/SpecularHDR.dds");
            this.assetsManager.addMeshTask("player", "", "assets/characters/", "character.glb");
            this.assetsManager.onTaskErrorObservable.add(function(task) {
                console.log('task failed', task.errorObject.message, task.errorObject.exception);
            });
            this.assetsManager.onProgress = function(remainingCount, totalCount, lastFinishedTask) {
                console.log('We are loading the scene. ' + remainingCount + ' out of ' + totalCount + ' items still need to be loaded.')
            };

            this.assetsManager.onFinish = (tasks)=> {
                console.log('onFinish', tasks);
                resolve();
            };
            this.assetsManager.load();
        })

    }
}
