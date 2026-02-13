
import { GraphConfig } from "../types";

export const graphs: Record<string, GraphConfig> = {
  // Exercise 1: Rational Function
  's4a-2': {
    f: (x) => (x * x - 4) / (x - 1),
    domain: [-6, 8],
    range: [-8, 12],
    verticalAsymptotes: [1],
    otherAsymptotes: [
      { f: (x) => x + 1, label: "Asymptote (y = x + 1)", color: "#10b981", strokeDasharray: "5 5" }
    ],
    pointsOfInterest: [
      { x: -2, y: 0, label: "Racine (-2, 0)", color: "#ef4444" },
      { x: 2, y: 0, label: "Racine (2, 0)", color: "#ef4444" },
      { x: 0, y: 4, label: "f(0)=4", color: "#f59e0b" }
    ],
    labels: { x: "x", y: "f(x)" }
  },

  // Exercise 3: Piecewise Function
  's6-graph': {
    f: (x) => {
      if (x < 1) return x - 1 + 2 * Math.sqrt(1 - x);
      return (Math.pow(x, 3) - 1) / (Math.pow(x, 3) + 1);
    },
    domain: [-4, 5],
    range: [-2, 2],
    verticalAsymptotes: [],
    otherAsymptotes: [
      { f: (x) => 1, label: "Asymptote H. (y = 1)", color: "#10b981", strokeDasharray: "5 5" },
      { f: (x) => x, label: "Direction Asymp. (y = x)", color: "#94a3b8", strokeDasharray: "2 2", initiallyHidden: true }
    ],
    pointsOfInterest: [
      { x: 1, y: 0, label: "Raccord (1,0)", color: "#7c3aed" },
      { x: -3, y: 0, label: "Racine (-3,0)", color: "#ef4444" }
    ],
    labels: { x: "x", y: "f(x)" }
  },

  // Exercise 5: Rational Function with Oblique Asymptote
  's12-graph': {
    f: (x) => (2 * Math.pow(x, 3) + 4 * Math.pow(x, 2) + x) / Math.pow(x + 1, 2),
    domain: [-4, 3],
    range: [-10, 10],
    verticalAsymptotes: [-1],
    otherAsymptotes: [
      { f: (x) => 2 * x, label: "Asymptote (y = 2x)", color: "#10b981", strokeDasharray: "5 5" },
      { f: (x) => 5 * x + 8, label: "Tangente T (-2)", color: "#8b5cf6", strokeDasharray: "3 3", initiallyHidden: true },
      { f: (x) => 0.5 * x, label: "Asymp. Réciproque", color: "#cbd5e1", strokeDasharray: "2 2", initiallyHidden: true }
    ],
    pointsOfInterest: [
      { x: 0, y: 0, label: "O (0,0)", color: "#ef4444" },
      { x: -2, y: -2, label: "Point (-2,-2)", color: "#f59e0b" }
    ],
    labels: { x: "x", y: "f(x)" }
  },

  // New Exercise: Suites - Convergence Visuelle
  'ex-suites-graph': {
    f: (x) => Math.sqrt(3 * x + 4),
    domain: [0, 6],
    range: [0, 6],
    verticalAsymptotes: [],
    otherAsymptotes: [
      { f: (x) => x, label: "y = x", color: "#94a3b8", strokeDasharray: "4 4" }
    ],
    pointsOfInterest: [
      { x: 0, y: 2, label: "u_0 = 0", color: "#f59e0b" },
      { x: 4, y: 4, label: "Limite l=4", color: "#10b981" }
    ],
    labels: { x: "u_n", y: "u_{n+1}" }
  }
};
