/**
 * @ignore
 */
export declare class MonotoneXTension {
    constructor(context: CanvasRenderingContext2D, tension: number);
    _line: number;
    _point: number;
    _context: any;
    _x0: number;
    _x1: number;
    _y0: number;
    _y1: number;
    _t0: number;
    _tension: number;
    areaStart(): void;
    areaEnd(): void;
    lineStart(): void;
    lineEnd(): void;
    point(x: number, y: number): void;
}
/**
 * @ignore
 */
export declare function curveMonotoneXTension(tension: number): (context: any) => MonotoneXTension;
//# sourceMappingURL=MonotoneXTension.d.ts.map