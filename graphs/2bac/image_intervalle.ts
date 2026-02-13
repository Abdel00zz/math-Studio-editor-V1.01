import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.sin(x) + 1.5,
  domain: [-1, 5],
  range: [0.2, 2.8],
  steps: 400,
  otherAsymptotes: [
    {
      f: (x) => 2.5,
      label: 'y = max',
      color: '#10b981',
      strokeDasharray: '5 5'
    },
    {
      f: (x) => 0.5,
      label: 'y = min',
      color: '#10b981',
      strokeDasharray: '5 5'
    }
  ],
  labels: { x: 'x', y: 'f(x)' }
};

export default graphConfig;
