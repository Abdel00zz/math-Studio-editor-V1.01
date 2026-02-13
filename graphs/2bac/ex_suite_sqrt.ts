import { FunctionGraphConfig } from "../../../../../types";

const lowerBound = -4 / 3;
export const graphConfig: FunctionGraphConfig = {
  f: (x) => {
    if (x < lowerBound) return null;
    return Math.sqrt(3 * x + 4);
  },
  domain: [-1.5, 5],
  range: [-1, 6],
  steps: 600,
  otherAsymptotes: [
    {
      f: (x) => x,
      label: "y = x",
      color: "#0ea5e9",
      strokeDasharray: "5 5",
      initiallyHidden: true
    }
  ],
  pointsOfInterest: [
    { x: 4, y: 4, label: "Intersection (4, 4)", color: "#0f766e" },
    { x: lowerBound, y: 0, label: "Point de départ", color: "#f97316" }
  ],
  labels: { x: "x", y: "f(x)" }
};

export default graphConfig;
