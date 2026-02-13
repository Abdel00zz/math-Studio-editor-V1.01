
import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.exp(x), // e^x
  domain: [0, 5],
  range: [0, 20],
  steps: 200,
  otherAsymptotes: [
    // Comparaison avec x^2
    { f: (x) => Math.pow(x, 2), label: "y = x²", color: "#3b82f6", strokeDasharray: "4 4" },
    // Comparaison avec x^3 (croît plus vite que x^2 mais moins que e^x)
    { f: (x) => Math.pow(x, 3), label: "y = x³", color: "#8b5cf6", strokeDasharray: "2 2" }
  ],
  pointsOfInterest: [
    { x: 0, y: 1, label: "", color: "#ef4444" }
  ],
  labels: { x: "x", y: "y" }
};

export default graphConfig;
