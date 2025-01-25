import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Color3,
  Engine,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  Scene,
  Sound,
  StandardMaterial,
  Texture,
  Vector3,
  Vector4,
} from "@babylonjs/core";
import { Nav } from "../components/Nav.tsx";

export const Village = () => {
  const reactCanvas = useRef(null);
  const antialias = true;
  const [musicPlaying, setMusicPlaying] = useState(false); // 音楽の状態管理
  const [music, setMusic] = useState<Sound | null>(null); // 音楽オブジェクト
  // const [engine, setEngine] = useState<Engine | null>(null); // Babylon.jsのエンジン
  // const [scene, setScene] = useState<Scene | null>(null); // Babylon.jsのシーン

  /*
   * 地面を作成
   */
  const buildGround = () => {
    //color
    const groundMat = new StandardMaterial("groundMat");
    groundMat.diffuseColor = new Color3(0, 1, 0);

    const ground = MeshBuilder.CreateGround("ground", {
      width: 15,
      height: 16,
    });
    ground.material = groundMat;

    return ground;
  };

  /*
   * 箱を作成
   */
  const buildBox = (width: number) => {
    // テクスチャ
    const boxMat = new StandardMaterial("boxMat");
    if (width == 2) {
      boxMat.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/semihouse.png",
      );
    } else {
      boxMat.diffuseTexture = new Texture(
        "https://assets.babylonjs.com/environments/cubehouse.png",
      );
    }

    // それぞれの面に違った画像をあてるためのオプションパラメータ
    const faceUV = [];
    if (width == 2) {
      faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
      faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
      faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
    } else {
      faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
      faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
      faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
      faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
    }
    // top 4 and bottom 5 not seen so not set

    /**** World Objects *****/
    const box = MeshBuilder.CreateBox("box", {
      width,
      faceUV: faceUV,
      wrap: true,
    });
    box.material = boxMat;
    box.position.y = 0.5;

    return box;
  };

  /*
   * 屋根を作成
   */
  const buildRoof = (width: number) => {
    // テクスチャ
    const roofMat = new StandardMaterial("roofMat");
    roofMat.diffuseTexture = new Texture(
      "https://assets.babylonjs.com/environments/roof.jpg",
    );

    const roof = MeshBuilder.CreateCylinder("roof", {
      diameter: 1.3,
      height: 1.2,
      tessellation: 3,
    });
    roof.material = roofMat;
    roof.scaling.x = 0.75;
    roof.scaling.y = width;
    roof.rotation.z = Math.PI / 2;
    roof.position.y = 1.22;

    return roof;
  };

  const buildHouse = (width: number) => {
    const box = buildBox(width);
    const roof = buildRoof(width);

    return Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
  };

  const buildDwellings = () => {
    buildGround();

    const detached_house = buildHouse(1);
    detached_house!.rotation.y = -Math.PI / 16;
    detached_house!.position.x = -6.8;
    detached_house!.position.z = 2.5;

    const semi_house = buildHouse(2);
    semi_house!.rotation.y = -Math.PI / 16;
    semi_house!.position.x = -4.5;
    semi_house!.position.z = 3;

    const places = []; //each entry is an array [house type, rotation, x, z]
    places.push([1, -Math.PI / 16, -6.8, 2.5]);
    places.push([2, -Math.PI / 16, -4.5, 3]);
    places.push([2, -Math.PI / 16, -1.5, 4]);
    places.push([2, -Math.PI / 3, 1.5, 6]);
    places.push([2, (15 * Math.PI) / 16, -6.4, -1.5]);
    places.push([1, (15 * Math.PI) / 16, -4.1, -1]);
    places.push([2, (15 * Math.PI) / 16, -2.1, -0.5]);
    places.push([1, (5 * Math.PI) / 4, 0, -1]);
    places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3]);
    places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5]);
    places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7]);
    places.push([2, Math.PI / 1.9, 4.75, -1]);
    places.push([1, Math.PI / 1.95, 4.5, -3]);
    places.push([2, Math.PI / 1.9, 4.75, -5]);
    places.push([1, Math.PI / 1.9, 4.75, -7]);
    places.push([2, -Math.PI / 3, 5.25, 2]);
    places.push([1, -Math.PI / 3, 6, 4]);

    //Create instances from the first two that were built
    const houses = [];
    for (let i = 0; i < places.length; i++) {
      if (places[i][0] === 1) {
        houses[i] = detached_house!.createInstance("house" + i);
      } else {
        houses[i] = semi_house!.createInstance("house" + i);
      }
      houses[i].rotation.y = places[i][1];
      houses[i].position.x = places[i][2];
      houses[i].position.z = places[i][3];
    }
  };

  const onSceneReady = useCallback((scene: Scene) => {
    /**** Set camera and light *****/
    const camera = new ArcRotateCamera(
      "camera",
      -Math.PI / 2,
      Math.PI / 2.5,
      20,
      // new Vector3(0, 2, -8),
      new Vector3(0, 0, 0),
      scene,
    );

    const canvas = scene.getEngine().getRenderingCanvas();

    // ユーザからの入力でカメラをコントロールするため、カメラをキャンバスにアタッチ
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    buildDwellings();

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
      <canvas className="w-1/2 h-1/2" ref={reactCanvas} />
    </>
  );
};
