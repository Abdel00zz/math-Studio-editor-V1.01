
import { FunctionGraphConfig } from "../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => {
    if (x < 1) return x - 1 + 2 * Math.sqrt(1 - x);
    return (Math.pow(x, 3) - 1) / (Math.pow(x, 3) + 1);
  },
  domain: [-4, 5],
  range: [-2, 2],
  verticalAsymptotes: [],
  otherAsymptotes: [
    { f: (x) => 1, label: "Asymptote H. (y = 1)", color: "#10b981", strokeDasharray: "5 5" },
    { f: (x) => x, label: "Direction Asymp. (y = x)", color: "#94a3b8", strokeDasharray: "2 2", initiallyHidden: true }
  ],
  pointsOfInterest: [
    { x: 1, y: 0, label: "Raccord (1,0)", color: "#7c3aed" },
    { x: -3, y: 0, label: "Racine (-3,0)", color: "#ef4444" }
  ],
  labels: { x: "x", y: "f(x)" }
};

export default graphConfig;
