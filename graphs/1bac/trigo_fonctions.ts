
import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.cos(x),
  domain: [-2 * Math.PI, 2 * Math.PI],
  range: [-1.5, 1.5],
  steps: 200,
  otherAsymptotes: [
      { f: (x) => Math.sin(x), label: "sin(x)", color: "#10b981", strokeDasharray: "" }
  ],
  pointsOfInterest: [
      { x: 0, y: 1, label: "cos(0)=1", color: "#3b82f6" },
      { x: Math.PI/2, y: 1, label: "sin(π/2)=1", color: "#10b981" },
      { x: Math.PI, y: -1, label: "cos(π)=-1", color: "#3b82f6" }
  ],
  labels: { x: "x (radians)", y: "y" }
};

export default graphConfig;
