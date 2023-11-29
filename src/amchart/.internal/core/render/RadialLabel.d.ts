import { Percent } from "../util/Percent";
import { Label, ILabelPrivate, ILabelSettings } from "./Label";
import { RadialText } from "./RadialText";
export interface IRadialLabelSettings extends ILabelSettings {
    /**
     * Pixel value to adjust radius with.
     *
     * Will add to (or subtract from if negative) whatever value `baseRadius` evaluates
     * to.
     */
    radius?: number;
    /**
     * Radius of the label's position.
     *
     * Can be either set in absolute pixel value, or percent.
     *
     * Relative value, depending on the situation, will most often mean its
     * position within certain circular object, like a slice: 0% meaning inner
     * edge, and 100% - the outer edge.
     *
     * @default 100%
     */
    baseRadius?: number | Percent;
    /**
     * Label anngle in degrees.
     *
     * In most cases it will be set by the chart/series and does not need to
     * be set manually.
     */
    labelAngle?: number;
    /**
     * Should the text "face" inward or outward from the arc the text is
     * following.
     *
     * `"auto"` means that facing will be chosen automatically based on the angle
     * to enhance readbility.
     *
     * Only applies if `type = "circluar"`.
     *
     * @default "auto"
     */
    orientation?: "inward" | "outward" | "auto";
    /**
     * Should label be drawn inside (`true`) or outside (`false`) the arc.
     *
     * @default false
     */
    inside?: boolean;
    /**
     * Label type.
     *
     * * `"regular"` (default) - normal horizontal label.
     * * `"circular"` - arched label.
     * * `"radial"` - label radiating from the center of the arc.
     * * `"aligned"` - horizontal label aligned with other labels horizontally.
     * * `"adjusted"` - horizontal label adjusted in postion.
     *
     * **IMPORTANT!** If the label is used in a [[PieSeries]], its `alignLabels` setting
     * (default: `true`) takes precedence over `textType`. If you need to set this
     * to anything else than `regular`, make sure you also set `alignLabels: falese` on
     * `PieSeries`.
     *
     * @default "regular"
     */
    textType?: "regular" | "circular" | "radial" | "aligned" | "adjusted";
    /**
     * Extra spacing between characters, in pixels.
     *
     * @default 0
     */
    kerning?: number;
}
export interface IRadialLabelPrivate extends ILabelPrivate {
    /**
     * @ignore
     */
    left?: boolean;
    /**
     * @ignore
     */
    radius?: number;
    /**
     * @ignore
     */
    innerRadius?: number;
}
export declare class RadialLabel extends Label {
    _settings: IRadialLabelSettings;
    _privateSettings: IRadialLabelPrivate;
    protected _text: RadialText;
    static className: string;
    static classNames: Array<string>;
    protected _flipped: boolean;
    protected _afterNew(): void;
    _makeText(): void;
    /**
     * Returns base radius in pixels.
     *
     * @return Base radius
     */
    baseRadius(): number;
    /**
     * Returns radius adjustment in pixels.
     *
     * @return Radius
     */
    radius(): number;
    _updateChildren(): void;
    _updatePosition(): void;
    /**
     * @ignore
     */
    get text(): RadialText;
}
//# sourceMappingURL=RadialLabel.d.ts.map