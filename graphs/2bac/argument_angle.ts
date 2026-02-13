import { GeometryGraphConfig, JSXGraphBoard } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 4.5, 4.5, -1],
  showAxis: true,
  showGrid: true,
  keepAspectRatio: true,
  init: (board: JSXGraphBoard) => {
    // Origine et point de référence
    const O = board.create('point', [0, 0], { name: '', color: '#1f2937', size: 4, fixed: true });
    const I = board.create('point', [1, 0], { visible: false, fixed: true });
    
    // Point z mobile
    const z = board.create('point', [2.5, 2], { name: '', color: '#ef4444', size: 5 });
    board.create('text', [() => z.X() + 0.15, () => z.Y() + 0.25, '\\(M(z)\\)'], 
      { fontSize: 13, color: '#ef4444', useMathJax: true });
    
    // Segment OM
    board.create('segment', [O, z], { strokeColor: '#ef4444', strokeWidth: 2.5 });
    
    // Arc de l'argument θ
    const angle = board.create('angle', [I, O, z], { 
      name: '', 
      radius: 0.8, 
      fillColor: '#dbeafe',
      strokeColor: '#3b82f6',
      strokeWidth: 2
    });
    
    // Label de l'angle θ
    board.create('text', [0.6, 0.45, '\\(\\theta\\)'], 
      { fontSize: 14, color: '#3b82f6', useMathJax: true, fixed: true });
    
    // Valeur dynamique de l'argument
    board.create('text', [() => z.X()/2 + 0.8, () => z.Y()/2 + 0.5, 
      () => {
        const theta = Math.atan2(z.Y(), z.X());
        const deg = (theta * 180 / Math.PI).toFixed(0);
        return `\\(\\arg(z) \\approx ${deg}°\\)`;
      }
    ], { fontSize: 12, color: '#3b82f6', useMathJax: true });
    
    // Formule pédagogique
    board.create('text', [0.3, 4, '\\(\\arg(z) = \\theta \\in ]-\\pi, \\pi]\\)'], 
      { fontSize: 14, color: '#1e293b', useMathJax: true, fixed: true });
    
    // Note sur tan
    board.create('text', [0.3, 3.5, '\\(\\tan(\\theta) = \\dfrac{b}{a}\\)'], 
      { fontSize: 13, color: '#64748b', useMathJax: true, fixed: true });
  }
};

export default graphConfig;
