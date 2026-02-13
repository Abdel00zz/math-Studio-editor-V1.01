import { FunctionGraphConfig } from "../../../../../types";

const rootOffset = Math.sqrt(2) / 2;
const evaluate = (x: number): number | null => {
  const denom = Math.pow(x + 1, 2);
  if (Math.abs(denom) < 1e-6) return null;
  const numerator = 2 * Math.pow(x, 3) + 4 * Math.pow(x, 2) + x;
  return numerator / denom;
};
const tangentY = evaluate(-2) ?? -2;

export const graphConfig: FunctionGraphConfig = {
  f: (x) => evaluate(x),
  domain: [-6, 4],
  range: [-12, 12],
  steps: 800,
  verticalAsymptotes: [-1],
  otherAsymptotes: [
    {
      f: (x) => 2 * x,
      label: "y = 2x",
      color: "#0ea5e9",
      strokeDasharray: "5 5"
    }
  ],
  pointsOfInterest: [
    { x: 0, y: 0, label: "O(0, 0)", color: "#f97316" },
    { x: -1 - rootOffset, y: 0, label: "A(-1 - √2/2, 0)", color: "#22c55e" },
    { x: -1 + rootOffset, y: 0, label: "B(-1 + √2/2, 0)", color: "#ef4444" },
    { x: -2, y: tangentY, label: "Tangente en x = -2", color: "#7c3aed" }
  ],
  labels: { x: "x", y: "f(x)" }
};

export default graphConfig;
