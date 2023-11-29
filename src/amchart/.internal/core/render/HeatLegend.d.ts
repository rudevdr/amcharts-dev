import { Container, IContainerSettings, IContainerPrivate } from "./Container";
import { Label } from "../../core/render/Label";
import { RoundedRectangle } from "../../core/render/RoundedRectangle";
import { ListTemplate } from "../../core/util/List";
import { Color } from "../../core/util/Color";
export interface IHeatLegendSettings extends IContainerSettings {
    /**
     * Starting (lowest value) color.
     */
    startColor: Color;
    /**
     * Ending (highest value) color.
     */
    endColor: Color;
    /**
     * Start (lowest) value.
     */
    startValue?: number;
    /**
     * End (highest) value.
     */
    endValue?: number;
    /**
     * Text for start label.
     */
    startText?: string;
    /**
     * Text for end label.
     */
    endText?: string;
    /**
     * Number of steps
     *
     * @default 1
     * @see {@link https://www.amcharts.com/docs/v5/concepts/legend/heat-legend/#Gradient_or_steps} for more info
     */
    stepCount?: number;
    /**
     * Orientation of the heat legend.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/legend/heat-legend/#Orientation} for more info
     */
    orientation: "horizontal" | "vertical";
}
export interface IHeatLegendPrivate extends IContainerPrivate {
}
/**
 * Heat legend.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/legend/heat-legend/} for more info
 */
export declare class HeatLegend extends Container {
    /**
     * A [[Container]] that all labels are placed in.
     *
     * @default Container.new()
     */
    readonly labelContainer: Container;
    /**
     * A [[Container]] that all markers are placed in.
     *
     * @default Container.new()
     */
    readonly markerContainer: Container;
    /**
     * A start [[Label]].
     *
     * @default Label.new()
     */
    readonly startLabel: Label;
    /**
     * An end [[Label]].
     *
     * @default Label.new()
     */
    readonly endLabel: Label;
    static className: string;
    static classNames: Array<string>;
    _settings: IHeatLegendSettings;
    _privateSettings: IHeatLegendPrivate;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    makeMarker(): RoundedRectangle;
    /**
     * List of rectangle elements used for default legend markers.
     *
     * @default new ListTemplate<RoundedRectangle>
     */
    readonly markers: ListTemplate<RoundedRectangle>;
    /**
     * Moves and shows tooltip at specific value.
     *
     * Can also specify optional text to show in tooltip, as well as the color.
     *
     * @param  value  Value
     * @param  text   Text
     * @param  color  Color
     */
    showValue(value: number, text?: string, color?: Color): void;
    _prepareChildren(): void;
}
//# sourceMappingURL=HeatLegend.d.ts.map