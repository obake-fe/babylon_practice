import { useEffect, useRef } from "react";
import { Engine, EngineOptions, Scene, SceneOptions } from "@babylonjs/core";
import { Nav } from "./Nav.tsx";

type SceneComponentProps = {
  antialias: true;
  engineOptions?: EngineOptions;
  adaptToDeviceRatio?: boolean;
  sceneOptions?: SceneOptions;
  onSceneReady: (scene: Scene) => void;
  onRender?: (scene: Scene) => void;
  id: string;
};

export const SceneComponent = ({
  antialias,
  engineOptions,
  adaptToDeviceRatio,
  sceneOptions,
  // onRender,
  onSceneReady,
}: SceneComponentProps) => {
  const reactCanvas = useRef(null);

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
      <canvas className="w-full h-full" ref={reactCanvas} />;
    </>
  );
};
