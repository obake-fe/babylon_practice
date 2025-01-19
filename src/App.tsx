import {
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Scene,
  ArcRotateCamera,
} from "@babylonjs/core";
// import SceneComponent from 'babylonjs-hook'; // if you install 'babylonjs-hook' NPM.
import "./App.css";
import { SceneComponent } from "./SceneComponent";

const onSceneReady = (scene: Scene) => {
  // カメラを作成
  const camera = new ArcRotateCamera(
    "camera",
    -Math.PI / 2,
    Math.PI / 2.5,
    3,
    new Vector3(0, 5, -10),
    scene,
  );

  const canvas = scene.getEngine().getRenderingCanvas();

  // ユーザからの入力でカメラをコントロールするため、カメラをキャンバスにアタッチ
  camera.attachControl(canvas, true);

  // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

  // Default intensity is 1. Let's dim the light a small amount
  light.intensity = 0.7;

  // 箱 (豆腐) を作成
  const box = MeshBuilder.CreateBox("box", { size: 2 }, scene);
  box.position.y = 1;

  // Our built-in 'ground' shape.
  // MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);
};

/**
 * Will run on every frame render.  We are spinning the box on y-axis.
 */
// const onRender = (scene: Scene) => {
//   if (box !== undefined) {
//     const deltaTimeInMillis = scene.getEngine().getDeltaTime();
//
//     const rpm = 10;
//     box.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
//   }
// };

export default () => (
  <div>
    <SceneComponent
      antialias
      onSceneReady={onSceneReady}
      // onRender={onRender}
      id="my-canvas"
    />
  </div>
);
