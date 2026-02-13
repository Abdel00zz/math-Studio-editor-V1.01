import { FunctionGraphConfig } from "../../../../../types";

const evaluate = (x: number): number | null => {
  if (Math.abs(x - 1) < 1e-6) return null;
  return (Math.pow(x, 2) - 4) / (x - 1);
};

export const graphConfig: FunctionGraphConfig = {
  f: (x) => evaluate(x),
  domain: [-5, 5],
  range: [-12, 12],
  steps: 800,
  verticalAsymptotes: [1],
  otherAsymptotes: [
    {
      f: (x) => x + 1,
      label: "y = x + 1",
      color: "#0ea5e9",
      strokeDasharray: "5 5"
    }
  ],
  pointsOfInterest: [
    { x: -2, y: 0, label: "A(-2, 0)", color: "#22c55e" },
    { x: 2, y: 0, label: "B(2, 0)", color: "#ef4444" },
    { x: 0, y: 4, label: "(0, 4)", color: "#f97316" }
  ],
  labels: { x: "x", y: "f(x)" }
};

export default graphConfig;
