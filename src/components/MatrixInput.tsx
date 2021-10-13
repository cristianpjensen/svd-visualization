import { useState, useEffect } from "react";

import { Vector } from "../utils/types";
import "./MatrixInput.css";

interface MatrixInputProps {
  rows: [Vector, (arg1: Vector) => void][];
}

export default function MatrixInput(props: MatrixInputProps) {
  const { rows } = props;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "7px 18px 12px 18px 12px 18px 7px",
        gridGap: 4,
      }}
    >
      <MatrixOpen />
      <MatrixInputCell
        value={rows[0][0][0]}
        classString="a"
        row={rows[0][0]}
        setRow={(coords: Vector) => rows[0][1](coords)}
        length={3}
      />
      <MatrixInputCell
        value={rows[0][0][1]}
        classString="b"
        row={rows[0][0]}
        setRow={(coords: Vector) => rows[0][1](coords)}
        length={3}
      />
      <MatrixInputCell
        value={rows[0][0][2]}
        classString="e"
        row={rows[0][0]}
        setRow={(coords: Vector) => rows[0][1](coords)}
        length={3}
      />
      <MatrixInputCell
        value={rows[1][0][0]}
        classString="c"
        row={rows[1][0]}
        setRow={(coords: Vector) => rows[1][1](coords)}
        length={3}
      />
      <MatrixInputCell
        value={rows[1][0][1]}
        classString="d"
        row={rows[1][0]}
        setRow={(coords: Vector) => rows[1][1](coords)}
        length={3}
      />
      <MatrixInputCell
        value={rows[1][0][2]}
        classString="f"
        row={rows[1][0]}
        setRow={(coords: Vector) => rows[1][1](coords)}
        length={3}
      />
      <MatrixInputCell
        value={rows[2][0][0]}
        classString="g"
        row={rows[2][0]}
        setRow={(coords: Vector) => rows[2][1](coords)}
        length={3}
      />
      <MatrixInputCell
        value={rows[2][0][1]}
        classString="h"
        row={rows[2][0]}
        setRow={(coords: Vector) => rows[2][1](coords)}
        length={3}
      />
      <MatrixInputCell
        value={rows[2][0][2]}
        classString="i"
        row={rows[2][0]}
        setRow={(coords: Vector) => rows[2][1](coords)}
        length={3}
      />
      <MatrixClose />
    </div>
  );
}

interface IMatrixInputCellProps {
  value: number;
  classString: string;
  row: Vector;
  setRow: (arg1: Vector) => void;
  length: number;
}

function MatrixInputCell(props: IMatrixInputCellProps) {
  const { value, classString, row, setRow, length } = props;

  const [current, setCurrent] = useState<number>(value);
  const [inputWidth, setInputWidth] = useState<string>("2ch");

  useEffect(() => {
    if (length === 2) {
      if (classString === "a" || classString === "c") {
        setRow([current, row[1]]);
      } else {
        setRow([row[0], current]);
      }
    } else {
      if (classString === "a" || classString === "c" || classString === "g") {
        setRow([current, row[1], row[2]]);
      } else if (
        classString === "b" ||
        classString === "d" ||
        classString === "h"
      ) {
        setRow([row[0], current, row[2]]);
      } else {
        setRow([row[0], row[1], current]);
      }
    }

    // eslint-disable-next-line
  }, [current]);

  const adjustVector = (e: any) => {
    setCurrent(e.target.value);
    setInputWidth(`${e.target.value.length}ch`);
  };

  return (
    <input
      value={current}
      className={classString}
      onChange={adjustVector}
      style={{
        width: inputWidth,
        textAlign: "center",
        fontFamily: "Katex",
        backgroundColor: "transparent",
        color: "white",
        fontSize: 16,
        border: "none",
        outline: "none",
        margin: "0 auto",
      }}
    />
  );
}

function MatrixOpen() {
  return (
    <svg height="70.8" width="7" className="open3">
      <path
        d="M 7 0 l -7 0 l 0 70.8 l 7 0"
        stroke="white"
        strokeWidth="3.8"
        fill="none"
      />
    </svg>
  );
}

function MatrixClose() {
  return (
    <svg height="70.8" width="7" className="close3">
      <path
        d="M 0 0 l 7 0 l 0 70.8 l -7 0"
        stroke="white"
        strokeWidth="3.8"
        fill="none"
      />
    </svg>
  );
}
