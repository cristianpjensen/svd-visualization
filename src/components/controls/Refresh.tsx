import { useCallback } from "react";
import { useStore } from "../../store";
import { RefreshIcon } from "../icons/Refresh";

export const Refresh = () => {
  const resetMatrix = useStore((state) => state.resetMatrix);

  const handleResetClick = useCallback(() => {
    resetMatrix();
  }, [resetMatrix]);

  return (
    <button onClick={handleResetClick}>
      <RefreshIcon />
    </button>
  );
};
