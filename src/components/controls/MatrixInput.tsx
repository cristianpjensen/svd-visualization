import React, { useCallback, useState } from "react";
import { useStore } from "../../store";

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
      <InputCell index={0} />
      <InputCell index={1} />
      <InputCell index={2} />
      <InputCell index={3} />
      <InputCell index={4} />
      <InputCell index={5} />
      <InputCell index={6} />
      <InputCell index={7} />
      <InputCell index={8} />
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
  const [value, setValue] = useState<string>(
    matrix.elements[index].toString().replace("-", "–")
  );

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const current = e.currentTarget.value;

      if (!isNaN(parseFloat(current)) && current !== "") {
        setMatrixIndex(index, parseFloat(current));
      }

      setValue(current.replace("-", "−"));
    },
    [index, setMatrixIndex]
  );

  return (
    <input
      type="number"
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
