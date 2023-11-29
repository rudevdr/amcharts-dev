import type { DataItem } from "../../../core/render/Component";
import type { AxisRenderer } from "./AxisRenderer";
import { CategoryAxis, ICategoryAxisSettings, ICategoryAxisPrivate, ICategoryAxisDataItem, ICategoryAxisEvents } from "./CategoryAxis";
import type { ITimeInterval } from "../../../core/util/Time";
import type { Tooltip } from "../../../core/render/Tooltip";
export interface ICategoryDateAxisSettings<R extends AxisRenderer> extends ICategoryAxisSettings<R> {
    /**
     * Indicates granularity of data.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Data_granularity} for more info
     */
    baseInterval: ITimeInterval;
    /**
     * A list of intervals the axis is allowed to show grid/labels on.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Grid_granularity} for more info
     */
    gridIntervals?: Array<ITimeInterval>;
    /**
     * Display "period change" labels using different format.
     *
     * If set to `true`, will use `periodChangeDateFormats` instead
     * of `dateFormats` for such labels, e.g. for month start.
     *
     * @default true
     */
    markUnitChange?: boolean;
    /**
     * Date formats used for intermediate labels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Date_formats} for more info
     */
    dateFormats?: {
        [index: string]: string;
    };
    /**
     * Date formats used for "period change" labels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Date_formats} for more info
     */
    periodChangeDateFormats?: {
        [index: string]: string;
    };
    /**
     * A date format to use for axis tooltip.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-dates/} for more info
     */
    tooltipDateFormat?: string;
}
export interface ICategoryDateAxisDataItem extends ICategoryAxisDataItem {
}
export interface ICategoryDateAxisPrivate extends ICategoryAxisPrivate {
    /**
     * Current base interval.
     */
    baseInterval: ITimeInterval;
}
export interface ICategoryDateAxisEvents extends ICategoryAxisEvents {
}
/**
 * Category-based date axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/category-date-axis/} for more info
 * @important
 */
export declare class CategoryDateAxis<R extends AxisRenderer> extends CategoryAxis<R> {
    static className: string;
    static classNames: Array<string>;
    _settings: ICategoryDateAxisSettings<R>;
    _privateSettings: ICategoryDateAxisPrivate;
    _dataItemSettings: ICategoryDateAxisDataItem;
    _events: ICategoryDateAxisEvents;
    protected _frequency: number;
    protected _itemMap: {
        [index: string]: DataItem<ICategoryDateAxisDataItem>;
    };
    protected _afterNew(): void;
    protected _prepareAxisItems(): void;
    /**
     * Returns a duration of currently active `baseInterval` in milliseconds.
     *
     * @return Duration
     */
    baseDuration(): number;
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * @param   position  Position
     * @return            Tooltip text
     */
    getTooltipText(position: number, _adjustPosition?: boolean): string | undefined;
    protected _updateTooltipText(tooltip: Tooltip, position: number): void;
}
//# sourceMappingURL=CategoryDateAxis.d.ts.map