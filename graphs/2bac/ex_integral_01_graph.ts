
import { GeometryGraphConfig } from "../../../../../types";

export const graphConfig: GeometryGraphConfig = {
  type: 'geometry',
  boundingBox: [-0.5, 5, 2.5, -2],
  showAxis: true,
  showGrid: true,
  init: (board) => {
    // Function f(x) = (x-1)e^x
    const f = board.create('functiongraph', [
      (x: number) => (x - 1) * Math.exp(x),
      -0.5, 2.5
    ], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'f' });

    // Negative area [0, 1]
    const curveNeg = board.create('curve', [[0, 0], [0, 0]], {
        fillColor: '#ef4444', 
        fillOpacity: 0.3, 
        strokeWidth: 0
    }) as any;
    curveNeg.updateDataArray = function() {
        this.dataX = [0];
        this.dataY = [0];
        const step = 0.05;
        for(let x=0; x<=1; x+=step) {
            this.dataX.push(x);
            this.dataY.push((x-1)*Math.exp(x));
        }
        this.dataX.push(1);
        this.dataY.push(0);
        this.dataX.push(0);
        this.dataY.push(0);
    };

    // Positive area [1, 2]
    const curvePos = board.create('curve', [[0, 0], [0, 0]], {
        fillColor: '#10b981', 
        fillOpacity: 0.3, 
        strokeWidth: 0
    }) as any;
    curvePos.updateDataArray = function() {
        this.dataX = [1];
        this.dataY = [0];
        const step = 0.05;
        for(let x=1; x<=2; x+=step) {
            this.dataX.push(x);
            this.dataY.push((x-1)*Math.exp(x));
        }
        this.dataX.push(2);
        this.dataY.push(0);
        this.dataX.push(1);
        this.dataY.push(0);
    };

    // Bound markers
    board.create('segment', [[2, 0], [2, Math.exp(2)]], { dash: 2, strokeColor: '#94a3b8' });
    board.create('text', [0.1, -0.2, "0"], { fontSize: 12 });
    board.create('text', [1, 0.2, "1"], { fontSize: 12 });
    board.create('text', [2, -0.2, "2"], { fontSize: 12 });

    // Labels
    board.create('text', [0.4, -0.5, "-"], { color: '#ef4444', fontSize: 20, fontWeight: 'bold' });
    board.create('text', [1.5, 1, "+"], { color: '#10b981', fontSize: 20, fontWeight: 'bold' });

    board.create('text', [0.5, 3, "\\[ \\mathcal{A} = \\int_0^2 |f(x)| dx \\]"], {
        fontSize: 14,
        color: '#1e293b',
        useMathJax: true,
        fixed: true
    });
  }
};

export default graphConfig;
