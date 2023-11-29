import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
export interface IRectangleSettings extends IGraphicsSettings {
}
export interface IRectanglePrivate extends IGraphicsPrivate {
}
/**
 * Draws a rectangle.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class Rectangle extends Graphics {
    _settings: IRectangleSettings;
    _privateSettings: IRectanglePrivate;
    static className: string;
    static classNames: Array<string>;
    _afterNew(): void;
    _beforeChanged(): void;
    _changed(): void;
    protected _draw(): void;
    _updateSize(): void;
}
//# sourceMappingURL=Rectangle.d.ts.map