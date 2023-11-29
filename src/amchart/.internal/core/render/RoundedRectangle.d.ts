import { Rectangle, IRectangleSettings, IRectanglePrivate } from "./Rectangle";
export interface IRoundedRectangleSettings extends IRectangleSettings {
    /**
     * Radius of the top-left corner in pixels.
     */
    cornerRadiusTL?: number;
    /**
     * Radius of the top-right corner in pixels.
     */
    cornerRadiusTR?: number;
    /**
     * Radius of the botttom-right corner in pixels.
     */
    cornerRadiusBR?: number;
    /**
     * Radius of the bottom-left corner in pixels.
     */
    cornerRadiusBL?: number;
}
export interface IRoundedRectanglePrivate extends IRectanglePrivate {
}
/**
 * Draws a rectangle with rounded corners.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class RoundedRectangle extends Rectangle {
    _settings: IRoundedRectangleSettings;
    _privateSettings: IRoundedRectanglePrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    _draw(): void;
}
//# sourceMappingURL=RoundedRectangle.d.ts.map