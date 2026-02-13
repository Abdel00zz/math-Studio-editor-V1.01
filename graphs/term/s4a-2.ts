
import { GraphConfig } from "../../types";

// Configuration isolée pour l'exercice ex-001, étape s4a-2
// Fonction: f(x) = (x^2 - 4) / (x - 1)

const graphConfig: GraphConfig = {
  f: (x) => (x * x - 4) / (x - 1),
  domain: [-6, 8],
  range: [-8, 12],
  steps: 500,
  verticalAsymptotes: [1],
  otherAsymptotes: [
    { 
      f: (x) => x + 1, 
      label: "Asymptote (y = x + 1)", 
      color: "#10b981", 
      strokeDasharray: "5 5" 
    }
  ],
  pointsOfInterest: [
    { x: -2, y: 0, label: "Racine (-2, 0)", color: "#ef4444" },
    { x: 2, y: 0, label: "Racine (2, 0)", color: "#ef4444" },
    { x: 0, y: 4, label: "Ordonnée (0, 4)", color: "#f59e0b" }
  ],
  labels: { x: "x", y: "f(x)" }
};

export default graphConfig;
