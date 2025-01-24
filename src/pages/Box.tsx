import { useEffect, useRef } from "react";
import {
  ArcRotateCamera,
  Engine,
  EngineOptions,
  HemisphericLight,
  MeshBuilder,
  Scene,
  SceneOptions,
  Vector3,
} from "@babylonjs/core";
import { Nav } from "../components/Nav.tsx";

type BoxProps = {
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onRender?: (scene: Scene) => void;
};

export const Box = ({
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  // onRender,
}: BoxProps) => {
  const reactCanvas = useRef(null);
  const antialias = true;

  const onSceneReady = (scene: Scene) => {
    // カメラを作成
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      3,
      new Vector3(0, 0, 0),
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
    const box = MeshBuilder.CreateBox("box", {}, scene);
    box.position.y = 0;

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

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(
      canvas,
      antialias,
      engineOptions,
      adaptToDeviceRatio,
    );
    const scene = new Scene(engine, sceneOptions);
    if (scene.isReady()) {
      onSceneReady(scene);
    } else {
      scene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    engine.runRenderLoop(() => {
      // if (typeof onRender === "function") onRender(scene);
      scene.render();
    });

    const resize = () => {
      scene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      scene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [
    antialias,
    engineOptions,
    adaptToDeviceRatio,
    sceneOptions,
    // onRender,
    onSceneReady,
  ]);

  return (
    <>
      <Nav />
      <canvas className="w-full h-full" ref={reactCanvas} />
    </>
  );
};
