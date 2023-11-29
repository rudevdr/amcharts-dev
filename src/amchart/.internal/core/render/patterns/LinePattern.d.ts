import { Pattern, IPatternSettings, IPatternPrivate } from "./Pattern";
export interface ILinePatternSettings extends IPatternSettings {
    /**
     * Gap between  lines, in pixels.
     *
     * @default 6
     */
    gap?: number;
}
export interface ILinePatternPrivate extends IPatternPrivate {
}
/**
 * Line pattern.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export declare class LinePattern extends Pattern {
    _settings: ILinePatternSettings;
    _privateSettings: ILinePatternPrivate;
    static className: string;
    static classNames: Array<string>;
    _beforeChanged(): void;
    protected _draw(): void;
}
//# sourceMappingURL=LinePattern.d.ts.map