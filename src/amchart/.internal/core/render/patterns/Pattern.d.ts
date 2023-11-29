import type { IGraphics, IPattern } from "../backend/Renderer";
import type { Color } from "../../util/Color";
import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "../../util/Entity";
export interface IPatternSettings extends IEntitySettings {
    /**
     * Rotation of patterm in degrees. Supported values: -90 to 90.
     *
     * @default 0
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Rotation} for more info
     */
    rotation?: number;
    /**
     * How pattern tiles are repeated when filling the area.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Repetition} for more info
     */
    repetition?: "repeat" | "repeat-x" | "repeat-y" | "no-repeat";
    /**
     * Width of the pattern tile, in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Sizing_patterns} for more info
     */
    width?: number;
    /**
     * Width of the pattern tile, in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Sizing_patterns} for more info
     */
    height?: number;
    /**
     * Color of the pattern shape.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Colors} for more info
     */
    color?: Color;
    /**
     * Opacity of the pattern shape.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Colors} for more info
     */
    colorOpacity?: number;
    /**
     * Width of the pattern's line elements.
     *
     * @default 1
     */
    strokeWidth?: number;
    /**
     * Stroke (border or line) dash settings.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/#Dashed_lines} for more information
     */
    strokeDasharray?: number[] | number;
    /**
     * Stroke (border or line) dash offset.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/#Dashed_lines} for more information
     */
    strokeDashoffset?: number;
    /**
     * Color to fill gaps between pattern shapes.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Colors} for more info
     */
    fill?: Color;
    /**
     * Opacity of the fill for gaps between pattern shapes.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Colors} for more info
     */
    fillOpacity?: number;
    /**
     * @ignore
     */
    colorInherited?: boolean;
    /**
     * @ignore
     */
    fillInherited?: boolean;
}
export interface IPatternPrivate extends IEntityPrivate {
}
export interface IPatternEvents extends IEntityEvents {
}
/**
 * Base class for patterns.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/} for more info
 */
export declare class Pattern extends Entity {
    protected _afterNew(): void;
    _settings: IPatternSettings;
    _privateSettings: IPatternPrivate;
    static className: string;
    static classNames: Array<string>;
    _display: IGraphics;
    _backgroundDisplay: IGraphics;
    protected _clear: boolean;
    protected _pattern: IPattern | undefined | null;
    get pattern(): IPattern | undefined | null;
    protected _draw(): void;
    _beforeChanged(): void;
    protected _checkDirtyFill(): void;
    _changed(): void;
}
//# sourceMappingURL=Pattern.d.ts.map