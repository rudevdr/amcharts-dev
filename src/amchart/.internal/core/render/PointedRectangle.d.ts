import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
export interface IPointedRectangleSettings extends IGraphicsSettings {
    /**
     * A width of the pinter's (stem's) thick end (base) in pixels.
     */
    pointerBaseWidth?: number;
    /**
     * A length of the pinter (stem) in pixels.
     */
    pointerLength?: number;
    /**
     * X coordinate the shape is pointing to.
     */
    pointerX?: number;
    /**
     * Y coordinate the shape is pointing to.
     */
    pointerY?: number;
    /**
     * Corner radius in pixels.
     */
    cornerRadius?: number;
}
export interface IPointedRectanglePrivate extends IGraphicsPrivate {
}
/**
 * Draws a rectangle with a pointer.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class PointedRectangle extends Graphics {
    _settings: IPointedRectangleSettings;
    _privateSettings: IPointedRectanglePrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    _changed(): void;
}
//# sourceMappingURL=PointedRectangle.d.ts.map