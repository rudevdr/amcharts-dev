import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "./Graphics";
export interface ICircleSettings extends IGraphicsSettings {
    /**
     * Circle radius in pixels.
     */
    radius?: number;
}
export interface ICirclePrivate extends IGraphicsPrivate {
}
/**
 * Draws a circle.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export declare class Circle extends Graphics {
    _settings: ICircleSettings;
    _privateSettings: ICirclePrivate;
    static className: string;
    static classNames: Array<string>;
    _afterNew(): void;
    _beforeChanged(): void;
    _changed(): void;
}
//# sourceMappingURL=Circle.d.ts.map