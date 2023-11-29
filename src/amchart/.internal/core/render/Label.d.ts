import type { Color } from "../util/Color";
import type { Percent } from "../util/Percent";
import type { DataItem, IComponentDataItem } from "./Component";
import { Text } from "../render/Text";
import { Container, IContainerPrivate, IContainerSettings } from "./Container";
export interface ILabelSettings extends IContainerSettings {
    /**
     * Labels' text.
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/text-styling/} for text styling info
     *
     */
    text?: string;
    /**
     * Text color.
     */
    fill?: Color;
    /**
     * Text opacity.
     *
     * @default 1
     * @ince 5.2.39
     */
    fillOpacity?: number;
    /**
     * Alignment.
     */
    textAlign?: "start" | "end" | "left" | "right" | "center";
    /**
     * Font family to use for the label.
     *
     * Multiple fonts can be separated by commas.
     */
    fontFamily?: string;
    /**
     * Font size in misc any supported CSS format (pixel, point, em, etc.).
     */
    fontSize?: string | number;
    /**
     * Font weight.
     */
    fontWeight?: "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    /**
     * Font style.
     */
    fontStyle?: "normal" | "italic" | "oblique";
    /**
     * Font variant.
     */
    fontVariant?: "normal" | "small-caps";
    /**
     * Text decoration.
     *
     * Supported options `"underline"`, `"line-through"`.
     *
     * @since 5.0.15
     */
    textDecoration?: "underline" | "line-through";
    /**
     * Line height in percent or absolute pixels.
     */
    lineHeight?: Percent | number;
    /**
     * How mouch of the height should be considered to go below baseline.
     *
     * @default 0.19
     */
    baselineRatio?: number;
    /**
     * Opacity of the label.
     *
     * 0 - fully transparent; 1 - fully opaque.
     */
    opacity?: number;
    /**
     * Text direction.
     *
     * @default "ltr"
     */
    direction?: "ltr" | "rtl";
    /**
     * A base line to use when aligning text chunks vertically.
     */
    textBaseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
    /**
     * How to handle labels that do not fit into its designated space.
     *
     * LIMITATIONS: on circular labels, the only values supported are `"hide"` and
     * `"truncate"`. The latter will ignore `breakWords` setting.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/labels/#Oversized_text} for more info
     */
    oversizedBehavior?: "none" | "hide" | "fit" | "wrap" | "wrap-no-break" | "truncate";
    /**
     * Whether words can be broken when truncating or wrapping text.
     *
     * @default false
     */
    breakWords?: boolean;
    /**
     * Ellipsis characters to use when truncating text.
     *
     * Will use Unicode ellipsis symbol (`"…"`) by default, which might not be
     * available in all fonts. If ellipsis looks broken, use different
     * characters. E.g.:
     *
     * ```TypeScript
     * label.set("ellipsis", "...");
     * ```
     * ```JavaScript
     * label.set("ellipsis", "...");
     * ```
     *
     *
     * @default "…"
     */
    ellipsis?: string;
    /**
     * Minimum relative scale allowed for label when scaling down
     * when `oversizedBehavior` is set to `"fit"`.
     *
     * If fitting the label would require it to scale beyond `minScale` it would
     * be hidden instead.
     */
    minScale?: number;
    /**
     * If set to `true` the label will parse `text` for data placeholders and
     * will try to populate them with actual data.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/labels/#Data_placeholders} for more info
     */
    populateText?: boolean;
    /**
     * If set to `true`, will ignore in-line formatting blocks and will display
     * text exactly as it is.
     *
     * @default false
     */
    ignoreFormatting?: boolean;
    /**
     * Color of the element's shadow.
     *
     * For this to work at least one of the following needs to be set as well:
     * `shadowBlur`, `shadowOffsetX`, `shadowOffsetY`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowColor?: Color | null;
    /**
     * Blurriness of the the shadow.
     *
     * The bigger the number, the more blurry shadow will be.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowBlur?: number;
    /**
     * Horizontal shadow offset in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowOffsetX?: number;
    /**
     * Vertical shadow offset in pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowOffsetY?: number;
    /**
     * Opacity of the shadow (0-1).
     *
     * If not set, will use the same as `fillOpacity` of the element.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/shadows/} for more info
     */
    shadowOpacity?: number;
}
export interface ILabelPrivate extends IContainerPrivate {
}
/**
 * Creates a label with support for in-line styling and data bindings.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/labels/} for more info
 */
export declare class Label extends Container {
    _settings: ILabelSettings;
    _privateSettings: ILabelPrivate;
    protected _text: Text;
    protected _textKeys: Array<string>;
    static className: string;
    static classNames: Array<string>;
    /**
     * @ignore Text is not to be used directly
     */
    get text(): Text;
    protected _afterNew(): void;
    _makeText(): void;
    _updateChildren(): void;
    protected _setMaxDimentions(): void;
    _setDataItem(dataItem?: DataItem<IComponentDataItem>): void;
    /**
     * Returns text with populated placeholders and formatting if `populateText` is
     * set to `true`.
     *
     * @return Populated text
     */
    getText(): string;
}
//# sourceMappingURL=Label.d.ts.map