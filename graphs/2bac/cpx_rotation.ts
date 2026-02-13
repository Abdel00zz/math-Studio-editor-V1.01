
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-3, 4.5, 4.5, -3],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board) => {
    // Centre Omega
    const Omega = board.create('point', [0, 0], { name: '', color: '#1e293b', fixed: true, size: 4 });
    board.create('text', [-0.3, -0.35, '\\(\\Omega\\)'], { fontSize: 13, useMathJax: true });

    // Point M
    const M = board.create('point', [2.5, 0.5], { name: '', color: '#3b82f6', size: 5 });
    board.create('text', [() => M.X() + 0.15, () => M.Y() + 0.25, '\\(M\\)'], 
      { fontSize: 13, color: '#3b82f6', useMathJax: true });
    board.create('segment', [Omega, M], { strokeColor: '#3b82f6', strokeWidth: 2 });

    // Slider pour l'angle θ
    const alpha = board.create('slider', [[-2.5, 4], [1.5, 4], [0, Math.PI/3, 2*Math.PI]], { 
      name: '', 
      snapWidth: Math.PI/12,
      fillColor: '#10b981',
      strokeColor: '#059669'
    });
    board.create('text', [1.8, 4, () => `\\(\\theta = ${(alpha.Value() * 180 / Math.PI).toFixed(0)}°\\)`], 
      { fontSize: 12, color: '#10b981', useMathJax: true });

    // Point M' image par rotation
    const M_prime = board.create('point', [
      () => Omega.X() + (M.X() - Omega.X()) * Math.cos(alpha.Value()) - (M.Y() - Omega.Y()) * Math.sin(alpha.Value()),
      () => Omega.Y() + (M.X() - Omega.X()) * Math.sin(alpha.Value()) + (M.Y() - Omega.Y()) * Math.cos(alpha.Value())
    ], { name: '', color: '#ef4444', size: 5 });
    board.create('text', [() => M_prime.X() + 0.15, () => M_prime.Y() + 0.25, "\\(M'\\)"], 
      { fontSize: 13, color: '#ef4444', useMathJax: true });

    board.create('segment', [Omega, M_prime], { strokeColor: '#ef4444', strokeWidth: 2 });

    // Arc angle avec flèche
    board.create('arc', [Omega, M, M_prime], { 
      strokeColor: '#10b981', 
      strokeWidth: 2.5, 
      lastArrow: { type: 2, size: 6 }
    });

    // Formule de rotation
    board.create('text', [-2.5, -2.3, "\\(z' - \\omega = e^{i\\theta}(z - \\omega)\\)"], { 
      fontSize: 15, 
      color: '#1e293b', 
      useMathJax: true, 
      fixed: true 
    });
  }
};

export default graphConfig;
