/**
 * Définition formelle : lim(x→+∞) f(x) = ℓ
 * 
 * Exemple : lim(x→+∞) 1/x = 0
 * ∀ε > 0, ∃B > 0 : x > B ⟹ |f(x) - ℓ| < ε
 * On choisit B = 1/ε
 */
import type { GeometryGraphConfig } from '@/types';

const config: GeometryGraphConfig = {
    type: 'geometry',
    boundingBox: [-1, 1.2, 12.5, -0.25],
    showAxis: true,
    showGrid: true,
    keepAspectRatio: false,
    
    init: (board) => {
        // Limite ℓ = 0
        const ell = 0;
        
        // Fonction f(x) = 1/x (exemple)
        const f = (x: number) => x <= 0.1 ? NaN : 1 / x;
        
        // Courbe
        board.create('functiongraph', [f, 0.15, 12], {
            strokeColor: '#3b82f6', strokeWidth: 2.5, highlight: false
        });
        
        // Curseur ε
        const epsSlider = board.create('slider', [
            [0.8, 1.08], [4.5, 1.08], [0.05, 0.15, 0.4]
        ], {
            name: 'ε',
            snapWidth: 0.02,
            strokeColor: '#ef4444',
            fillColor: '#ef4444',
            label: { fontSize: 18, offset: [-5, -18] },
            highline: { strokeColor: '#ef4444' },
            baseline: { strokeColor: '#e5e7eb' }
        });
        
        // B = 1/ε (comme démontré dans l'exemple : 1/x < ε ⟺ x > 1/ε)
        const getB = () => 1 / epsSlider.Value();
        
        // === BANDE 0 ≤ f(x) < ε (car ℓ = 0) ===
        board.create('polygon', [
            [-0.5, 0],
            [12, 0],
            [12, () => epsSlider.Value()],
            [-0.5, () => epsSlider.Value()]
        ], {
            fillColor: '#fecaca',
            fillOpacity: 0.3,
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });
        
        // === ZONE x > B ===
        board.create('polygon', [
            [() => getB(), -0.15],
            [12, -0.15],
            [12, 1.2],
            [() => getB(), 1.2]
        ], {
            fillColor: '#bbf7d0',
            fillOpacity: 0.25,
            borders: { strokeWidth: 0 },
            vertices: { visible: false }
        });
        
        // Asymptote horizontale y = 0 (axe des x)
        // Pas besoin de ligne supplémentaire, l'axe est déjà affiché
        
        // Ligne y = ε
        board.create('line', [[0, () => epsSlider.Value()], [1, () => epsSlider.Value()]], {
            strokeColor: '#ef4444', strokeWidth: 1, dash: 2, fixed: true
        });
        
        // Ligne x = B
        board.create('line', [[() => getB(), 0], [() => getB(), 1]], {
            strokeColor: '#22c55e', strokeWidth: 1.5, dash: 2, fixed: true
        });
        
        // Point d'entrée dans la bande
        board.create('point', [() => getB(), () => f(getB())], {
            name: '', size: 2, fillColor: '#3b82f6', strokeColor: '#1e40af', fixed: true
        });
        
        // === LABELS ===
        board.create('text', [-0.6, 0, '\\(0\\)'], {
            fontSize: 16, color: '#3b82f6', useMathJax: true, fixed: true
        });
        
        // Point B sur l'axe
        board.create('point', [() => getB(), 0], {
            name: '',
            size: 2.5,
            fillColor: '#22c55e',
            strokeColor: '#16a34a',
            fixed: true,
            label: { visible: false }
        });
        board.create('text', [() => getB(), -0.18, '\\(B\\)'], {
            fontSize: 17, color: '#22c55e', useMathJax: true, anchorX: 'middle', fixed: true
        });
        
        board.create('text', [11.5, () => epsSlider.Value() + 0.05, '\\(\\varepsilon\\)'], {
            fontSize: 14, color: '#ef4444', useMathJax: true, fixed: true
        });
        
        // Symbole +∞
        board.create('text', [11.5, 0.08, '\\(+\\infty\\)'], {
            fontSize: 13, color: '#64748b', useMathJax: true
        });
    }
};

export default config;
