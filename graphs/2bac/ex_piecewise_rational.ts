import { FunctionGraphConfig } from "../../../../../types";

const piecewise = (x: number): number | null => {
  if (x < 1) {
    const delta = 1 - x;
    return x - 1 + 2 * Math.sqrt(Math.max(0, delta));
  }
  const denominator = Math.pow(x, 3) + 1;
  if (Math.abs(denominator) < 1e-6) return null;
  return (Math.pow(x, 3) - 1) / denominator;
};

export const graphConfig: FunctionGraphConfig = {
  f: (x) => piecewise(x),
  domain: [-4.5, 4.5],
  range: [-4, 2],
  steps: 800,
  otherAsymptotes: [
    {
      f: (x) => 1,
      label: "y = 1",
      color: "#16a34a",
      strokeDasharray: "5 5"
    },
    {
      f: (x) => x,
      label: "y = x",
      color: "#0ea5e9",
      strokeDasharray: "3 3",
      initiallyHidden: true
    }
  ],
  pointsOfInterest: [
    { x: 1, y: 0, label: "R(1, 0)", color: "#7c3aed" },
    { x: 0, y: 1, label: "S(0, 1)", color: "#ef4444" }
  ],
  labels: { x: "x", y: "f(x)" }
};

export default graphConfig;
