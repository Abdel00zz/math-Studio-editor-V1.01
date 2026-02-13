
import { FunctionGraphConfig } from "../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.sqrt(3 * x + 4),
  domain: [0, 6],
  range: [0, 6],
  verticalAsymptotes: [],
  otherAsymptotes: [
    { f: (x) => x, label: "y = x", color: "#94a3b8", strokeDasharray: "4 4" }
  ],
  pointsOfInterest: [
    { x: 0, y: 2, label: "u_0 = 0", color: "#f59e0b" },
    { x: 4, y: 4, label: "Limite l=4", color: "#10b981" }
  ],
  labels: { x: "u_n", y: "u_{n+1}" }
};

export default graphConfig;
