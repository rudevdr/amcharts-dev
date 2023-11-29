import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
export interface IEllipseSettings extends IGraphicsSettings {
    /**
     * The ellipse's major-axis radius. Must be non-negative.
     */
    radiusX: number;
    /**
     * The ellipse's minor-axis radius. Must be non-negative.
     */
    radiusY: number;
}
export interface IEllipsePrivate extends IGraphicsPrivate {
}
/**
 * Draws a Ellipse.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class Ellipse extends Graphics {
    _settings: IEllipseSettings;
    _privateSettings: IEllipsePrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    _changed(): void;
}
//# sourceMappingURL=Ellipse.d.ts.map