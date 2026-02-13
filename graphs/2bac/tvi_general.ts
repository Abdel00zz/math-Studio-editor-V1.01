import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => {
    const y = (x - 0.5) * (x - 3.5) + 1.5;
    return y;
  },
  domain: [-0.5, 4.5],
  range: [-1.5, 3],
  steps: 400,
  otherAsymptotes: [
    {
      f: (x) => 0,
      label: 'y = 0',
      color: '#1f2937',
      strokeDasharray: '5 5'
    }
  ],
  pointsOfInterest: [
    { x: 0.5, y: 1.5, label: 'Point intermédiaire', color: '#3b82f6' },
    { x: 3.5, y: 1.5, label: 'Point intermédiaire', color: '#3b82f6' }
  ],
  labels: { x: 'x', y: 'f(x)' }
};

export default graphConfig;
