import type { Color } from "../util/Color";
import type { Percent } from "../util/Percent";
import type { IText } from "./backend/Renderer";
import type { DataItem, IComponentDataItem } from "./Component";
import { Sprite, ISpriteSettings, ISpritePrivate } from "./Sprite";
import type { NumberFormatter } from "../util/NumberFormatter";
import type { DateFormatter } from "../util/DateFormatter";
import type { DurationFormatter } from "../util/DurationFormatter";
/**
 * @ignore Text is an internal class. Use Label instead.
 */
export interface ITextSettings extends ISpriteSettings {
    text?: string;
    fill?: Color;
    fillOpacity?: number;
    textAlign?: "start" | "end" | "left" | "right" | "center";
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: "normal" | "bold" | "bolder" | "lighter" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
    fontStyle?: "normal" | "italic" | "oblique";
    fontVariant?: "normal" | "small-caps";
    textDecoration?: "underline" | "line-through";
    shadowColor?: Color | null;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowOpacity?: number;
    lineHeight?: Percent | number;
    baselineRatio?: number;
    opacity?: number;
    direction?: "ltr" | "rtl";
    textBaseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
    oversizedBehavior?: "none" | "hide" | "fit" | "wrap" | "wrap-no-break" | "truncate";
    breakWords?: boolean;
    ellipsis?: string;
    minScale?: number;
    populateText?: boolean;
    ignoreFormatting?: boolean;
}
/**
 * @ignore
 */
export interface ITextPrivate extends ISpritePrivate {
    /**
     * @ignore
     */
    tooltipElement?: HTMLDivElement;
}
/**
 * @ignore Text is an internal class. Use Label instead.
 */
export declare class Text extends Sprite {
    _settings: ITextSettings;
    _privateSettings: ITextPrivate;
    textStyle: import("./backend/Renderer").ITextStyle;
    _display: IText;
    protected _textStyles: Array<keyof ITextSettings>;
    protected _originalScale: number | undefined;
    static className: string;
    static classNames: Array<string>;
    _updateBounds(): void;
    _changed(): void;
    _getText(): string;
    /**
     * Forces the text to be re-evaluated and re-populated.
     */
    markDirtyText(): void;
    _setDataItem(dataItem?: DataItem<IComponentDataItem>): void;
    getNumberFormatter(): NumberFormatter;
    getDateFormatter(): DateFormatter;
    getDurationFormatter(): DurationFormatter;
}
//# sourceMappingURL=Text.d.ts.map