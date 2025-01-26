import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { Nav } from "../components/Nav.tsx";

export const Basketball = () => {
  // Riveファイルとステートマシンの設定
  const { rive, RiveComponent } = useRive({
    src: "/basketball.riv", // Riveファイルのパス
    stateMachines: "State Machine 1", // ステートマシン名（Riveのエディターで確認）
    autoplay: true, // 自動再生の有無
  });

  // トリガーの取得（ボタンを押したら切り替え）
  const trigger = useStateMachineInput(rive, "State Machine 1", "Clicked");

  // ボタンのクリックイベント
  const handleClick = () => {
    if (trigger) {
      trigger.fire(); // トリガーを発火させてアニメーションを切り替え
    }
  };

  return (
    <>
      <Nav />
      <div className="flex items-center flex-col w-1/5 m-4">
        <RiveComponent style={{ width: 300, height: 300 }} />
        <button className="btn w-40 m-4 btn-neutral" onClick={handleClick}>
          Change
        </button>
      </div>
    </>
  );
};
