
import { FunctionGraphConfig } from "../../../../../types";

export const graphConfig: FunctionGraphConfig = {
  f: (x) => Math.log(x), // Fonction principale : ln(x)
  domain: [0, 12],
  range: [-2, 3],
  steps: 200,
  verticalAsymptotes: [0],
  otherAsymptotes: [
    // Logarithme décimal : log10(x) = ln(x) / ln(10)
    { f: (x) => Math.log10(x), label: "log(x)", color: "#8b5cf6", strokeDasharray: "" },
    // Asymptote visuelle horizontale y=1 pour repérer les bases
    { f: (x) => 1, label: "y=1", color: "#cbd5e1", strokeDasharray: "2 2", initiallyHidden: true }
  ],
  pointsOfInterest: [
    { x: Math.E, y: 1, label: "ln(e)=1", color: "#3b82f6" },
    { x: 10, y: 1, label: "log(10)=1", color: "#8b5cf6" }
  ],
  labels: { x: "x", y: "y" }
};

export default graphConfig;
