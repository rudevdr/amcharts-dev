import { Entity, IEntitySettings, IEntityPrivate } from "./Entity";
import { Color } from "./Color";
export interface IColorSetSettings extends IEntitySettings {
    /**
     * List of colors in the set.
     */
    colors?: Color[];
    /**
     * A step size when using `next()`.
     *
     * E.g. setting to `2` will make it return every second color in the list.
     *
     * @default 1
     */
    step?: number;
    /**
     * Start iterating colors from specific index.
     */
    startIndex?: number;
    /**
     * If set to `true`, color set will reuse existing colors from the list
     * inestead of generating new ones.
     *
     * @default false
     */
    reuse?: boolean;
    /**
     * A base color to generate new colors from if `colors` is not specified.
     * @type {[type]}
     */
    baseColor?: Color;
    /**
     * A set of tranformation to apply to base list of colors when the set runs
     * out of colors and generates additional ones.
     */
    passOptions?: IColorSetStepOptions;
    /**
     * If set, each returned color will be applied saturation.
     */
    saturation?: number;
}
export interface IColorSetPrivate extends IEntityPrivate {
    currentStep?: number;
    currentPass?: number;
    /**
     * @ignore
     */
    numColors?: number;
}
export interface IColorSetStepOptions {
    /**
     * Value to add to "hue".
     */
    hue?: number;
    /**
     * Value to add to "saturation".
     */
    saturation?: number;
    /**
     * Value to add to "lightness".
     */
    lightness?: number;
}
/**
 * An object which holds list of colors and can generate new ones.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/#Color_sets} for more info
 */
export declare class ColorSet extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: IColorSetSettings;
    _privateSettings: IColorSetPrivate;
    protected _afterNew(): void;
    _beforeChanged(): void;
    /**
     * @ignore
     */
    generateColors(): void;
    /**
     * Returns a [[Color]] at specific index.
     *
     * If there's no color at this index, a new color is generated.
     *
     * @param   index  Index
     * @return         Color
     */
    getIndex(index: number): Color;
    /**
     * Returns next [[Color]] in the list.
     *
     * If the list is out of colors, new ones are generated dynamically.
     */
    next(): Color;
    /**
     * Resets counter to the start of the list, so the next call for `next()` will
     * return the first color.
     */
    reset(): void;
}
//# sourceMappingURL=ColorSet.d.ts.map