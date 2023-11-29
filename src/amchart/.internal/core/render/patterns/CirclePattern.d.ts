import { Pattern, IPatternSettings, IPatternPrivate } from "./Pattern";
export interface ICirclePatternSettings extends IPatternSettings {
    /**
     * Gap between circles, in pixels.
     *
     * @default 3
     */
    gap?: number;
    /**
     * Radius of the circles, in pixels.
     *
     * @default 3
     */
    radius?: number;
    /**
     * If set to `true`, will place every second circle, creating checkered
     * pattern.
     *
     * @default false
     */
    checkered?: boolean;
    /**
     * Center circles.
     *
     * @default true
     */
    centered?: boolean;
}
export interface ICirclePatternPrivate extends IPatternPrivate {
}
/**
 * Circle pattern.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export declare class CirclePattern extends Pattern {
    _settings: ICirclePatternSettings;
    _privateSettings: ICirclePatternPrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    protected _draw(): void;
}
//# sourceMappingURL=CirclePattern.d.ts.map