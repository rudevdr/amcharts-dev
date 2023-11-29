import { Pattern, IPatternSettings, IPatternPrivate } from "./Pattern";
export interface IRectanglePatternSettings extends IPatternSettings {
    /**
     * Gap between rectangles, in pixels.
     *
     * @default 6
     */
    gap?: number;
    /**
     * Maximum width of the rectangle, in pixels.
     *
     * @default 5
     */
    maxWidth?: number;
    /**
     * Maximum height of the rectangle, in pixels.
     *
     * @default 5
     */
    maxHeight?: number;
    /**
     * If set to `true`, will place every second rectangle, creating checkered
     * pattern.
     *
     * @default false
     */
    checkered?: boolean;
    /**
     * Center rectangles.
     *
     * @default true
     */
    centered?: boolean;
}
export interface IRectanglePatternPrivate extends IPatternPrivate {
}
/**
 * Rectangle pattern.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export declare class RectanglePattern extends Pattern {
    _settings: IRectanglePatternSettings;
    _privateSettings: IRectanglePatternPrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    protected _draw(): void;
}
//# sourceMappingURL=RectanglePattern.d.ts.map