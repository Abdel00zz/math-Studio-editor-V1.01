/**
 * Graphe: Limite infinie à l'infini
 * Montre f(x) = x²/4 qui tend vers +∞ quand x→+∞
 */

import type { GeometryGraphConfig } from '@/types';

const config: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-1, 50, 50, -1],
  init: (board) => {
    // Fonction f(x) = x²/4
    const f = (x: number) => Math.pow(x, 2) / 4;

    // Courbe
    const curve = board.create('functiongraph', [f, 0, 50], {
      strokeColor: '#2563eb',
      strokeWidth: 3,
      highlight: false
    });

    // Point M glisseur sur la courbe
    const M = board.create('glider', [8, f(8), curve], {
      name: 'M',
      size: 6,
      fillColor: '#dc2626',
      strokeColor: '#b91c1c',
      label: { fontSize: 12, offset: [20, 15] }
    });

    // Affichage dynamique M(x, f(x))
    board.create('text', [
      () => M.X() + 2,
      () => M.Y() + 3,
      () => `M(${M.X().toFixed(1)}, ${M.Y().toFixed(1)})`
    ], {
      fontSize: 14,
      color: '#dc2626',
      fontWeight: 'bold'
    });

    // Projections
    board.create('segment', [M, [() => M.X(), 0]], {
      strokeColor: '#94a3b8',
      strokeWidth: 1,
      dash: 2
    });

    board.create('segment', [M, [0, () => M.Y()]], {
      strokeColor: '#94a3b8',
      strokeWidth: 1,
      dash: 2
    });

    // Fonction
    board.create('text', [35, 45, 'f(x) = x²/4'], {
      fontSize: 16,
      color: '#2563eb',
      fontWeight: 'bold'
    });

    // Comportement
    board.create('text', [35, 40, 'Quand x → +∞'], {
      fontSize: 14,
      color: '#7c3aed'
    });

    board.create('text', [35, 38, 'f(x) → +∞'], {
      fontSize: 15,
      color: '#dc2626',
      fontWeight: 'bold'
    });

    // Valeurs actuelles
    board.create('text', [
      35,
      32,
      () => `x = ${M.X().toFixed(1)}`
    ], {
      fontSize: 13,
      color: '#374151'
    });

    board.create('text', [
      35,
      30,
      () => `f(x) = ${M.Y().toFixed(1)}`
    ], {
      fontSize: 13,
      color: '#374151'
    });

    // Flèche vers l'infini
    board.create('arrow', [[42, 35], [45, 35]], {
      strokeColor: '#dc2626',
      strokeWidth: 2
    });

    board.create('text', [46, 35.5, '+∞'], {
      fontSize: 14,
      color: '#dc2626',
      fontWeight: 'bold'
    });

    // Curseur pour seuil A
    const sliderA = board.create('slider', [[35, 25], [45, 25], [5, 20, 40]], {
      name: 'A',
      snapWidth: 1,
      strokeColor: '#059669',
      fillColor: '#059669',
      size: 4,
      label: { fontSize: 13, color: '#059669', offset: [-10, -20] }
    });

    // Ligne horizontale y = A
    board.create('line', [[-1, () => sliderA.Value()], [50, () => sliderA.Value()]], {
      strokeColor: '#059669',
      strokeWidth: 1,
      dash: 2
    });

    // Calcul de B: x²/4 > A → x > 2√A
    const getB = () => 2 * Math.sqrt(sliderA.Value());

    // Ligne verticale x = B
    board.create('segment', [
      [() => getB(), 0],
      [() => getB(), 50]
    ], {
      strokeColor: '#059669',
      strokeWidth: 2,
      dash: 1
    });

    // Point B sur l'axe
    board.create('point', [() => getB(), 0], {
      name: 'B',
      size: 4,
      fillColor: '#059669',
      strokeColor: '#047857',
      label: { fontSize: 12, color: '#059669', offset: [0, -15] }
    });

    // Zone de validation (x > B, f(x) > A)
    board.create('polygon', [
      [() => getB(), () => sliderA.Value()],
      [50, () => sliderA.Value()],
      [50, 50],
      [() => getB(), 50]
    ], {
      fillColor: '#10b981',
      fillOpacity: 0.1,
      borders: { visible: false }
    });

    // Flèche indiquant la zone
    board.create('arrow', [
      [() => getB() + 1, 2],
      [() => Math.min(getB() + 5, 45), 2]
    ], {
      strokeColor: '#059669',
      strokeWidth: 2
    });

    // Labels pédagogiques
    board.create('text', [35, 20, '∀ A > 0'], {
      fontSize: 13,
      color: '#059669',
      fontWeight: 'bold'
    });

    board.create('text', [35, 18, '∃ B = 2√A'], {
      fontSize: 13,
      color: '#059669',
      fontWeight: 'bold'
    });

    board.create('text', [35, 16, 'tel que'], {
      fontSize: 12,
      color: '#6b7280'
    });

    board.create('text', [35, 14, 'x > B ⇒ f(x) > A'], {
      fontSize: 13,
      color: '#059669',
      fontWeight: 'bold'
    });

    // État actuel
    board.create('text', [
      35,
      10,
      () => `f(x) ${M.Y() > sliderA.Value() ? '>' : '<'} ${sliderA.Value()}`
    ], {
      fontSize: 12,
      color: () => M.Y() > sliderA.Value() ? '#059669' : '#dc2626',
      fontWeight: 'bold'
    });

    board.create('text', [
      35,
      8,
      () => `x ${M.X() > getB() ? '>' : '<'} B = ${getB().toFixed(1)}`
    ], {
      fontSize: 12,
      color: () => M.X() > getB() ? '#059669' : '#dc2626',
      fontWeight: 'bold'
    });

    // Label pour A
    board.create('text', [() => Math.min(sliderA.Value() + 2, 45), () => sliderA.Value() + 0.5, 'y = A'], {
      fontSize: 12,
      color: '#059669'
    });

    // Label pour B
    board.create('text', [() => getB() + 0.2, 2, 'x = B'], {
      fontSize: 12,
      color: '#059669'
    });
  }
};

export default config;
