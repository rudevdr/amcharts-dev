/** @ignore */ /** */
import type { IPoint } from "./IPoint";
import type { IGraphics } from "../render/backend/Renderer";
/**
 * @ignore
 */
export declare function segmentedLine(display: IGraphics, segments: Array<Array<Array<IPoint>>>): void;
/**
 * @ignore
 */
export declare function line(display: IGraphics, points: Array<IPoint>): void;
/**
 * @ignore
 */
export declare function moveTo(display: IGraphics, point: IPoint): void;
/**
 * @ignore
 */
export declare function clear(display: IGraphics): void;
/**
 * @ignore
 */
export declare function smoothedSegmentedline(display: IGraphics, segments: Array<Array<Array<IPoint>>>, tensionX: number, tensionY: number): void;
/**
 * @ignore
 */
export declare function smoothedLine(display: IGraphics, points: Array<IPoint>, tensionX: number, tensionY: number): string | undefined;
//# sourceMappingURL=Draw.d.ts.map