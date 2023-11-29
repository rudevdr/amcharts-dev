import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
export interface ITriangleSettings extends IGraphicsSettings {
}
export interface ITrianglePrivate extends IGraphicsPrivate {
}
/**
 * Draws a triangle.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class Triangle extends Graphics {
    _settings: ITriangleSettings;
    _privateSettings: ITrianglePrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    _changed(): void;
    protected _draw(): void;
    _updateSize(): void;
}
//# sourceMappingURL=Triangle.d.ts.map