
import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.log(x),
  domain: [0, 20],
  range: [0, 20],
  steps: 200,
  otherAsymptotes: [
    // La droite y = x pour comparer
    { f: (x) => x, label: "y = x", color: "#94a3b8", strokeDasharray: "4 4" },
    // La racine carrée pour montrer que ln est encore plus lent
    { f: (x) => Math.sqrt(x), label: "y = √x", color: "#10b981", strokeDasharray: "2 2" }
  ],
  pointsOfInterest: [
    { x: 1, y: 0, label: "A(1, 0)", color: "#3b82f6" }
  ],
  labels: { x: "x", y: "y" }
};

export default graphConfig;
