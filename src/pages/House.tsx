import { useEffect, useRef } from "react";
import {
  ArcRotateCamera,
  Engine,
  HemisphericLight,
  Scene,
  SceneLoader,
  Vector3,
} from "@babylonjs/core";
import { Nav } from "../components/Nav.tsx";

export const House = () => {
  const reactCanvas = useRef(null);
  const antialias = true;

  const onSceneReady = async (scene: Scene) => {
    // カメラを作成
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      3,
      new Vector3(0, 1, -3),
      scene,
    );

    const canvas = scene.getEngine().getRenderingCanvas();

    // ユーザからの入力でカメラをコントロールするため、カメラをキャンバスにアタッチ
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // 家 を作成
    const scene1 = await SceneLoader.AppendAsync(
      "https://assets.babylonjs.com/meshes/",
      "both_houses_scene.babylon",
    );
    const house = scene1.getMeshByName("detached_house");

    house!.position.y = 0;
  };

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const engine = new Engine(canvas, antialias);
    const scene = new Scene(engine);
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
  }, [antialias, onSceneReady]);

  return (
    <>
      <Nav />
      <canvas className="w-full h-full" ref={reactCanvas} />
    </>
  );
};
