
import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => (2 * Math.pow(x, 3) + 4 * Math.pow(x, 2) + x) / Math.pow(x + 1, 2),
  domain: [-4, 3],
  range: [-10, 10],
  verticalAsymptotes: [-1],
  otherAsymptotes: [
    { f: (x) => 2 * x, label: "Asymptote (y = 2x)", color: "#10b981", strokeDasharray: "5 5" },
    { f: (x) => 5 * x + 8, label: "Tangente T (-2)", color: "#8b5cf6", strokeDasharray: "3 3", initiallyHidden: true },
    { f: (x) => 0.5 * x, label: "Asymp. Réciproque", color: "#cbd5e1", strokeDasharray: "2 2", initiallyHidden: true }
  ],
  pointsOfInterest: [
    { x: 0, y: 0, label: "O (0,0)", color: "#ef4444" },
    { x: -2, y: -2, label: "Point (-2,-2)", color: "#f59e0b" }
  ],
  labels: { x: "x", y: "f(x)" }
};

export default graphConfig;
