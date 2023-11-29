import type { AxisRenderer } from "./AxisRenderer";
import type { TimeUnit } from "../../../core/util/Time";
import { ValueAxis, IValueAxisSettings, IValueAxisPrivate, IValueAxisDataItem, IValueAxisEvents, IMinMaxStep } from "./ValueAxis";
export interface IDurationAxisSettings<R extends AxisRenderer> extends IValueAxisSettings<R> {
    /**
     * A base unit (granularity) of data.
     *
     * Used to indicate what are the base units of your data.
     *
     * Available options: `"millisecond"`, `"second"` (default), `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, and `"year"`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-durations/#Base_unit} for more info
     * @default "second"
     */
    baseUnit?: TimeUnit;
}
export interface IDurationAxisDataItem extends IValueAxisDataItem {
}
export interface IDurationAxisPrivate extends IValueAxisPrivate {
    /**
     * A format to used by axis to format its labels.
     *
     * @readonly
     */
    durationFormat: string;
}
export interface IDurationAxisEvents extends IValueAxisEvents {
}
/**
 * Creates a duration axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/duration-axis/} for more info
 * @important
 */
export declare class DurationAxis<R extends AxisRenderer> extends ValueAxis<R> {
    static className: string;
    static classNames: Array<string>;
    _settings: IDurationAxisSettings<R>;
    _privateSettings: IDurationAxisPrivate;
    _dataItemSettings: IDurationAxisDataItem;
    _events: IDurationAxisEvents;
    protected _dataGrouped: boolean;
    protected _groupingCalculated: boolean;
    protected _intervalDuration: number;
    _afterNew(): void;
    protected _adjustMinMax(min: number, max: number, gridCount: number, strictMode?: boolean): IMinMaxStep;
    protected _formatText(value: number): string;
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * @param   position  Position
     * @return            Tooltip text
     */
    getTooltipText(position: number, _adjustPosition?: boolean): string | undefined;
}
//# sourceMappingURL=DurationAxis.d.ts.map