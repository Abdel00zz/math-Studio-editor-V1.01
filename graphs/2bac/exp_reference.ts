
import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.exp(x),
  domain: [-4, 2.5],
  range: [-1, 8],
  steps: 200,
  otherAsymptotes: [
    // Tangente en 0 : y = x + 1
    { f: (x) => x + 1, label: "Tangente T: y = x + 1", color: "#f59e0b", strokeDasharray: "5 5" },
    // Asymptote y=0
    { f: (x) => 0, label: "Asymptote y=0", color: "#94a3b8", strokeDasharray: "2 2" }
  ],
  pointsOfInterest: [
    { x: 0, y: 1, label: "A(0, 1)", color: "#ef4444" },
    { x: 1, y: Math.E, label: "e(1, e)", color: "#10b981" }
  ],
  labels: { x: "x", y: "exp(x)" }
};

export default graphConfig;
