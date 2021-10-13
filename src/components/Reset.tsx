import { VectorsAction } from "../App";

interface PolarCoords {
  r: number;
  phi: number;
}
interface ResetProps {
  defaultVectors?: Array<[PolarCoords, (arg1: PolarCoords) => void]>;
  vectorsDispatch?: (arg0: VectorsAction) => void;
}

export default function Reset(props: ResetProps) {
  const { defaultVectors, vectorsDispatch } = props;

  function reset() {
    if (defaultVectors) {
      defaultVectors.forEach(([defaultVector, setVector]) => {
        setVector(defaultVector);
      });
    }

    if (vectorsDispatch) {
      vectorsDispatch({ type: "reset" });
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="matrix"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      strokeWidth="1"
      stroke="white"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      onClick={reset}
      style={{ margin: "3px auto", display: "block" }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
      <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
    </svg>
  );
}
