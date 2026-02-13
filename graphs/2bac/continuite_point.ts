import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => {
    if (Math.abs(x - 1) < 0.05) return null;
    return Math.sin(x) + 2;
  },
  domain: [-1, 5],
  range: [0.5, 3.5],
  steps: 400,
  pointsOfInterest: [
    { x: 1, y: 2, label: 'x = x₀', color: '#ef4444' }
  ],
  labels: { x: 'x', y: 'f(x)' }
};

export default graphConfig;
