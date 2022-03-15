import { useCallback } from "react";
import { useStore } from "../../store";
import { RefreshIcon } from "../icons/Refresh";

import "./Refresh.css";

export const Refresh = () => {
  const resetMatrix = useStore((state) => state.resetMatrix);

  const handleResetClick = useCallback(() => {
    resetMatrix();
  }, [resetMatrix]);

  return (
    <button
      style={{
        background: "none",
        color: "inherit",
        border: "none",
        padding: 0,
        font: "inherit",
        cursor: "pointer",
        outline: "inherit",
      }}
      className="refresh"
      onClick={handleResetClick}
    >
      <RefreshIcon />
    </button>
  );
};
