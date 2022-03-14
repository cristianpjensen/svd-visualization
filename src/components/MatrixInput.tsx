import { useCallback, useState } from "react";
import _ from "lodash";
import { useStore } from "../store";

export const MatrixInput = () => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(3, 1fr)",
        gridGap: "0.5rem",
        zIndex: 1,
      }}
    >
      {_.range(9).map((i) => (
        <InputCell key={i} index={i} />
      ))}
    </div>
  );
};

interface InputCellProps {
  index: number;
}

const InputCell = ({ index }: InputCellProps) => {
  const [matrix, setMatrixIndex] = useStore((state) => [
    state.matrix,
    state.setMatrixIndex,
  ]);
  const [value, setValue] = useState<number>(matrix.elements[index]);

  const handleChange = useCallback((e: any) => {
    setValue(e.target.value);

    setMatrixIndex(index, parseFloat(e.target.value));
  }, []);

  return (
    <input
      style={{
        width: "4ch",
        textAlign: "center",
        fontFamily: "Katex",
        color: "lightgreen",
        backgroundColor: "transparent",
        fontSize: 16,
        border: "none",
        outline: "none",
        margin: "0px auto",
      }}
      value={value}
      onChange={handleChange}
    />
  );
};
