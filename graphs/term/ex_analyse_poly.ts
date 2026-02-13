import { FunctionGraphConfig } from "../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.pow(x, 3) - 3 * x + 3,
  domain: [-4.5, 4.5],
  range: [-8, 10],
  steps: 800,
  otherAsymptotes: [
    {
      f: (x) => x,
      label: "y = x",
      color: "#0ea5e9",
      strokeDasharray: "5 5"
    }
  ],
  pointsOfInterest: [
    { x: -1, y: 5, label: "A(-1, 5)", color: "#ef4444" },
    { x: 1, y: 1, label: "B(1, 1)", color: "#10b981" },
    { x: 0, y: 3, label: "I(0, 3)", color: "#f97316" }
  ],
  labels: { x: "x", y: "f(x)" }
};

export default graphConfig;
