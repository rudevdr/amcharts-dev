import type { IPoint } from "./IPoint";
import type { IBounds } from "./IBounds";
/**
 * ============================================================================
 * CONSTANTS
 * ============================================================================
 * @hidden
 */
export declare const PI: number;
export declare const HALFPI: number;
export declare const RADIANS: number;
export declare const DEGREES: number;
/**
 * Rounds the numeric value to whole number or specific precision of set.
 *
 * @param value      Value
 * @param precision  Precision (number of decimal points)
 * @param floor  In case value ends with 0.5 and precision is 0, we might need to floor the value instead of ceiling it.
 * @return Rounded value
 */
export declare function round(value: number, precision?: number, floor?: boolean): number;
/**
 * Ceils the numeric value to whole number or specific precision of set.
 *
 * @param value      Value
 * @param precision  Precision (number of decimal points)
 * @return Rounded value
 */
export declare function ceil(value: number, precision: number): number;
/**
 * [getCubicControlPointA description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param p0        [description]
 * @param p1        [description]
 * @param p2        [description]
 * @param p3        [description]
 * @param tensionX  [description]
 * @param tensionY  [description]
 * @return [description]
 */
export declare function getCubicControlPointA(p0: IPoint, p1: IPoint, p2: IPoint, tensionX: number, tensionY: number): IPoint;
/**
 * [getCubicControlPointB description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param p0        [description]
 * @param p1        [description]
 * @param p2        [description]
 * @param p3        [description]
 * @param tensionX  [description]
 * @param tensionY  [description]
 * @return [description]
 */
export declare function getCubicControlPointB(p1: IPoint, p2: IPoint, p3: IPoint, tensionX: number, tensionY: number): IPoint;
export declare function fitToRange(value: number, min: number, max: number): number;
/**
 * Returns sine of an angle specified in degrees.
 *
 * @param value  Value
 * @return Sine
 */
export declare function sin(angle: number): number;
/**
 * Returns tan of an angle specified in degrees.
 *
 * @param value  Value
 * @return Sine
 */
export declare function tan(angle: number): number;
/**
 * Returns cosine of an angle specified in degrees.
 *
 * @param value  Value
 * @return Cosine
 */
export declare function cos(angle: number): number;
export declare function normalizeAngle(value: number): number;
export declare function getArcBounds(cx: number, cy: number, startAngle: number, endAngle: number, radius: number): IBounds;
/**
 * Returns point on arc
 *
 * @param center point
 * @param radius
 * @param arc
 * @return {boolean}
 */
export declare function getArcPoint(radius: number, arc: number): {
    x: number;
    y: number;
};
export declare function mergeBounds(bounds: IBounds[]): IBounds;
export declare function fitAngleToRange(value: number, startAngle: number, endAngle: number): number;
export declare function inBounds(point: IPoint, bounds: IBounds): boolean;
export declare function getAngle(point1: IPoint, point2?: IPoint): number;
/**
 * [getPointOnQuadraticCurve description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param pointA        [description]
 * @param pointB        [description]
 * @param controlPoint  [description]
 * @param position      [description]
 * @return [description]
 */
export declare function getPointOnQuadraticCurve(pointA: IPoint, pointB: IPoint, controlPoint: IPoint, position: number): IPoint;
export declare function getPointOnLine(pointA: IPoint, pointB: IPoint, position: number): IPoint;
/**
 * Returns the closest value from the array of values to the reference value.
 *
 * @param values  Array of values
 * @param value   Reference value
 * @return Closes value from the array
 */
export declare function closest(values: number[], referenceValue: number): number;
/**
 * Returns true if bounds overlap
 * @param bounds1 IBounds
 * @param bounds2 IBounds
 * @returns boolean
 */
export declare function boundsOverlap(bounds1: IBounds, bounds2: IBounds): boolean;
/**
 * Generates points of a spiral
 * @param cx
 * @param cy
 * @param radius
 * @param radiusY
 * @param innerRadius
 * @param step
 * @param radiusStep
 * @param startAngle
 * @param endAngle
 * @returns IPoint[]
 */
export declare function spiralPoints(cx: number, cy: number, radius: number, radiusY: number, innerRadius: number, step: number, radiusStep: number, startAngle: number, endAngle: number): IPoint[];
/**
 * Returns true if circles overlap
 * @param circle1
 * @param circle2
 * @returns boolean
 */
export declare function circlesOverlap(circle1: {
    x: number;
    y: number;
    radius: number;
}, circle2: {
    x: number;
    y: number;
    radius: number;
}): boolean;
//# sourceMappingURL=Math.d.ts.map