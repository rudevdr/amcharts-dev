import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
import type { IPoint } from "../util/IPoint";
export interface ISliceSettings extends IGraphicsSettings {
    /**
     * Radius in pixels.
     */
    radius?: number;
    /**
     * Slice "width" in degrees.
     */
    arc?: number;
    /**
     * Inner radius of the slice in pixels.
     */
    innerRadius?: number;
    /**
     * Start angle in degrees.
     */
    startAngle?: number;
    /**
     * Slice corner radius in pixels.
     */
    cornerRadius?: number;
    /**
     * Slice "pull out" radius in pixels.
     */
    shiftRadius?: number;
    /**
     * Number of pixels to add to whatever slice's `radius` value is. Negative
     * numbers can also be used.
     */
    dRadius?: number;
    /**
     * Number of pixels to add to whatever slice's `innerRadius` value is.
     * Negative numbers can also be used.
     */
    dInnerRadius?: number;
}
export interface ISlicePrivate extends IGraphicsPrivate {
}
/**
 * Draws a slice shape.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 */
export declare class Slice extends Graphics {
    _settings: ISliceSettings;
    _privateSettings: ISlicePrivate;
    static className: string;
    static classNames: Array<string>;
    /**
     * @ignore
     */
    ix: number;
    /**
     * @ignore
     */
    iy: number;
    protected _generator: import("d3-shape").Arc<any, import("d3-shape").DefaultArcObject>;
    _getTooltipPoint(): IPoint;
    _beforeChanged(): void;
    _changed(): void;
}
//# sourceMappingURL=Slice.d.ts.map