import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Sound,
  StandardMaterial,
  Texture,
  Vector3,
} from "@babylonjs/core";
import { Nav } from "../components/Nav.tsx";

export const Village = () => {
  const reactCanvas = useRef(null);
  const antialias = true;
  const [musicPlaying, setMusicPlaying] = useState(false); // 音楽の状態管理
  const [music, setMusic] = useState<Sound | null>(null); // 音楽オブジェクト
  // const [engine, setEngine] = useState<Engine | null>(null); // Babylon.jsのエンジン
  // const [scene, setScene] = useState<Scene | null>(null); // Babylon.jsのシーン

  const onSceneReady = useCallback(async (scene: Scene) => {
    /**** Set camera and light *****/
    // カメラを作成
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, 0, 0),
      scene,
    );

    const canvas = scene.getEngine().getRenderingCanvas();

    // ユーザからの入力でカメラをコントロールするため、カメラをキャンバスにアタッチ
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    /**** Materials *****/
    //color
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseColor = new Color3(0, 1, 0);

    //texture
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/roof.jpg",
    );
    const boxMat = new StandardMaterial("boxMat");
    boxMat.diffuseTexture = new Texture(
      "https://www.babylonjs-playground.com/textures/floor.png",
    );

    /**** World Objects *****/
    // 箱 (豆腐) を作成
    const box = MeshBuilder.CreateBox("box", {});
    box.material = boxMat;
    box.position.y = 0.5;

    const roof = MeshBuilder.CreateCylinder("roof", {
      diameter: 1.3,
      height: 1.2,
      tessellation: 3,
    });
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;

    // 地面を作成
    const ground = MeshBuilder.CreateGround(
      "ground",
      { width: 10, height: 10 },
      scene,
    );
    ground.material = groundMat;

    const bgm = new Sound("backgroundMusic", "/morning.ogg", scene, null, {
      loop: true,
      autoplay: false,
      volume: 0.5,
    });
    setMusic(bgm);
  }, []);

  // set up basic engine and scene
  useEffect(() => {
    const { current: canvas } = reactCanvas;

    if (!canvas) return;

    const newEngine = new Engine(canvas, antialias);
    const newScene = new Scene(newEngine);
    // setEngine(newEngine);
    // setScene(newScene);

    if (newScene.isReady()) {
      onSceneReady(newScene);
    } else {
      newScene.onReadyObservable.addOnce((scene) => onSceneReady(scene));
    }

    // シーンを継続的にレンダリングするためにレンダーループに登録する
    newEngine.runRenderLoop(() => {
      newScene.render();
    });

    const resize = () => {
      newScene.getEngine().resize();
    };

    if (window) {
      window.addEventListener("resize", resize);
    }

    return () => {
      newScene.getEngine().dispose();

      if (window) {
        window.removeEventListener("resize", resize);
      }
    };
  }, [onSceneReady]);

  // ユーザーの操作後に音楽を再生する関数
  const toggleMusic = () => {
    // babylon.js のデフォルトのミュート機能を解除
    Engine.audioEngine!.unlock();

    if (musicPlaying) {
      music!.stop(); // 音楽を停止
    } else {
      music!.play(); // 音楽を再生
    }
    setMusicPlaying(!musicPlaying); // 音楽の状態を切り替え
  };

  return (
    <>
      <Nav />
      <div className="w-28 form-control">
        <label className="label cursor-pointer">
          <span className="label-text">Music</span>
          <input
            type="checkbox"
            className="toggle"
            defaultChecked={false}
            onClick={toggleMusic}
          />
        </label>
      </div>
      <canvas className="w-full h-full" ref={reactCanvas} />
    </>
  );
};
