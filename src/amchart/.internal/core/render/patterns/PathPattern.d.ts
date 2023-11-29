import { Pattern, IPatternSettings, IPatternPrivate } from "./Pattern";
export interface IPathPatternSettings extends IPatternSettings {
    /**
     * Use an SVG path as pattern.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths} for more information
     */
    svgPath?: string;
}
export interface IPathPatternPrivate extends IPatternPrivate {
}
/**
 * A pattern that uses an SVG path.
 *
 * @since 5.2.33
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export declare class PathPattern extends Pattern {
    _settings: IPathPatternSettings;
    _privateSettings: IPathPatternPrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    protected _draw(): void;
}
//# sourceMappingURL=PathPattern.d.ts.map