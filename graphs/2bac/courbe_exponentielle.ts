import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.exp(x),
  domain: [-3, 2],
  range: [-0.5, 8],
  steps: 500,
  otherAsymptotes: [
    {
      f: (x) => 0,
      label: 'y = 0',
      color: '#0ea5e9',
      strokeDasharray: '5 5'
    }
  ],
  pointsOfInterest: [
    { x: 0, y: 1, label: '(0, 1)', color: '#ef4444' }
  ],
  labels: { x: 'x', y: 'eˣ' }
};

export default graphConfig;
