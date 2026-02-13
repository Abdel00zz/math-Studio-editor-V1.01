
import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.log(x),
  domain: [0, 8],
  range: [-3, 3],
  steps: 200,
  verticalAsymptotes: [0],
  otherAsymptotes: [
    // Tangente en x=1 : y = x - 1
    { f: (x) => x - 1, label: "Tangente T: y = x - 1", color: "#f59e0b", strokeDasharray: "5 5" }
  ],
  pointsOfInterest: [
    { x: 1, y: 0, label: "A(1, 0)", color: "#ef4444" },
    { x: Math.E, y: 1, label: "e(e, 1)", color: "#10b981" }
  ],
  labels: { x: "x", y: "ln(x)" }
};

export default graphConfig;
