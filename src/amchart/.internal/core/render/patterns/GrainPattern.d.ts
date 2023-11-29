import { Pattern, IPatternSettings, IPatternPrivate } from "./Pattern";
import { Color } from "../../util/Color";
export interface IGrainPatternSettings extends IPatternSettings {
    /**
     * Size of a grain in pixels.
     *
     * @default 1
     */
    size?: number;
    /**
     * Density of noise.
     *
     * Value range: `0` (no noise applied) to `1` (noise is applied to every
     * pixel).
     *
     * The bigger the value, the higher chance that pixel will have another pixel
     * painted over with random opacity from `minOpacity` to `maxOpacity`.
     *
     * @default 1
     */
    density?: number;
    /**
     * Minimum opacity of a noise pixel.
     *
     * @default 0
     */
    minOpacity?: number;
    /**
     * Maximum opacity of a noise pixel.
     *
     * @default 0.3
     */
    maxOpacity?: number;
    /**
     * An array of colors to randomly use for pixels.
     *
     * @default [color(0x000000)]
     */
    colors?: Array<Color>;
    /**
     * Horizontal gap between noise pixels measured in `size`.
     *
     * @default 0
     */
    horizontalGap?: number;
    /**
     * Vertical gap between noise pixels measured in `size`.
     *
     * @default 0
     */
    verticalGap?: number;
}
export interface IGrainPatternPrivate extends IPatternPrivate {
}
/**
 * Grain pattern.
 *
 * Allows to add grain (noise) effect to your [[Graphics]] objects.
 *
 * Note, grain pattern does not support `fill` and `color` setting.
 * Use `colors` setting to define colors of a grain pixels.
 *
 * Note, rotation setting is not supported by this pattern.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/patterns/#Grain_patterns} for more info
 * @since 5.5.0
 */
export declare class GrainPattern extends Pattern {
    _settings: IGrainPatternSettings;
    _privateSettings: IGrainPatternPrivate;
    static className: string;
    static classNames: Array<string>;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    protected _clearGrain: boolean;
    _beforeChanged(): void;
    _changed(): void;
    protected _checkDirtyFill(): boolean;
    protected _setRectData(col: number, row: number, size: number, width: number, data: Uint8ClampedArray, rc: number, gc: number, bc: number, ac: number): void;
}
//# sourceMappingURL=GrainPattern.d.ts.map