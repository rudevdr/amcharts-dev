import { DataItem } from "../../../core/render/Component";
import type { AxisRenderer } from "./AxisRenderer";
import type { XYSeries, IXYSeriesDataItem } from "../series/XYSeries";
import { ValueAxis, IValueAxisSettings, IValueAxisPrivate, IValueAxisDataItem, IMinMaxStep, IValueAxisEvents } from "./ValueAxis";
import type { ITimeInterval } from "../../../core/util/Time";
import type { TimeUnit } from "../../../core/util/Time";
export interface IDateAxisSettings<R extends AxisRenderer> extends IValueAxisSettings<R> {
    /**
     * Indicates granularity of data.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Data_granularity} for more info
     */
    baseInterval: ITimeInterval;
    /**
     * Relative location of where axis cell starts: 0 - beginning, 1 - end.
     *
     * IMPORTANT: `startLocation` is not supported by [[GaplessDateAxis]].
     *
     * @default 0
     */
    startLocation?: number;
    /**
     * Relative location of where axis cell ends: 0 - beginning, 1 - end.
     *
     * IMPORTANT: `endLocation` is not supported by [[GaplessDateAxis]].
     *
     * @default 1
     */
    endLocation?: number;
    /**
     * Should axis group data items togeter dynamically?
     *
     * @default false
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Dynamic_data_item_grouping} for more info
     */
    groupData?: boolean;
    /**
     * Maximum number of data items in the view before data grouping kicks in.
     *
     * @default 500
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Dynamic_data_item_grouping} for more info
     */
    groupCount?: number;
    /**
     * Force data item grouping to specific interval.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Dynamic_data_item_grouping} for more info
     */
    groupInterval?: ITimeInterval;
    /**
     * A list of intervals the axis is allowed to group data items into.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Dynamic_data_item_grouping} for more info
     */
    groupIntervals?: Array<ITimeInterval>;
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
        [index: string]: string | Intl.DateTimeFormatOptions;
    };
    /**
     * Date formats used for minor grid labels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Minor_grid_formats} for more info
     * @since 5.6.0
     */
    minorDateFormats?: {
        [index: string]: string | Intl.DateTimeFormatOptions;
    };
    /**
     * Date formats used for "period change" labels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Date_formats} for more info
     */
    periodChangeDateFormats?: {
        [index: string]: string | Intl.DateTimeFormatOptions;
    };
    /**
     * A date format to use for axis tooltip.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Axis_tooltip} for more info
     */
    tooltipDateFormat?: string | Intl.DateTimeFormatOptions;
    /**
     * Time unit-specific formats to use for axis tooltip.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Axis_tooltip} for more info
     * @since 5.1.4
     */
    tooltipDateFormats?: {
        [index: string]: string | Intl.DateTimeFormatOptions;
    };
    /**
     * A value which indicates relative position within axis cell to get timestamp
     * for the tooltip from.
     *
     * Values are from `-1` to `1`.
     *
     * If not set, it will use `tooltipLocation` value, if `tooltipLocation`` is
     * not set, it will use -0.5.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Axis_tooltip} for more info
     * @since 5.1.4
     */
    tooltipIntervalOffset?: number;
}
export interface IDateAxisDataItem extends IValueAxisDataItem {
}
export interface IDateAxisPrivate extends IValueAxisPrivate {
    /**
     * Current group interval.
     */
    groupInterval?: ITimeInterval;
    /**
     * Current base interval.
     */
    baseInterval: ITimeInterval;
    /**
     * Current grid interval.
     */
    gridInterval: ITimeInterval;
}
export interface IDateAxisEvents extends IValueAxisEvents {
    /**
     * Kicks in when data grouping is on, and current group interval changes, e.g. via zooming the chart.
     *
     * @since 5.2.43
     */
    groupintervalchanged: {};
}
/**
 * Creates a date axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/} for more info
 * @important
 */
export declare class DateAxis<R extends AxisRenderer> extends ValueAxis<R> {
    static className: string;
    static classNames: Array<string>;
    _settings: IDateAxisSettings<R>;
    _privateSettings: IDateAxisPrivate;
    _dataItemSettings: IDateAxisDataItem;
    _events: IDateAxisEvents;
    protected _dataGrouped: boolean;
    protected _seriesDataGrouped: boolean;
    protected _groupingCalculated: boolean;
    protected _intervalDuration: number;
    protected _baseDuration: number;
    protected _intervalMax: {
        [index: string]: number;
    };
    protected _intervalMin: {
        [index: string]: number;
    };
    _afterNew(): void;
    protected _setBaseInterval(interval: ITimeInterval): void;
    protected _fixZoomFactor(): void;
    protected _groupData(): void;
    _groupSeriesData(series: XYSeries): void;
    _clearDirty(): void;
    /**
     * Returns a time interval axis would group data to for a specified duration.
     *
     * @since 5.2.1
     */
    getGroupInterval(duration: number): ITimeInterval;
    /**
     * Return `max` of a specified time interval.
     *
     * Will work only if the axis was grouped to this interval at least once.
     *
     * @since 5.2.1
     * @param   interval  Interval
     * @return            Max
     */
    getIntervalMax(interval: ITimeInterval): number;
    /**
     * Return `min` of a specified time interval.
     *
     * Will work only if the axis was grouped to this interval at least once.
     *
     * @since 5.2.1
     * @param   interval  Interval
     * @return            Min
     */
    getIntervalMin(interval: ITimeInterval): number;
    protected _handleRangeChange(): void;
    protected _adjustMinMax(min: number, max: number, gridCount: number, _strictMode?: boolean): IMinMaxStep;
    /**
     * @ignore
     */
    intervalDuration(): number;
    protected _saveMinMax(min: number, max: number): void;
    protected _getM(timeUnit: TimeUnit): 1.05 | 1.01;
    protected _getMinorInterval(interval: ITimeInterval): ITimeInterval | undefined;
    protected _prepareAxisItems(): void;
    protected _updateFinals(start: number, end: number): void;
    protected _getDelta(): void;
    protected _fixMin(min: number): number;
    protected _fixMax(max: number): number;
    protected _updateDates(_date: number, _series: XYSeries): void;
    /**
     * Returns a duration of currently active `baseInterval` in milliseconds.
     *
     * @return Duration
     */
    baseDuration(): number;
    /**
     * Returns a duration of user-defined `baseInterval` in milliseconds.
     *
     * @return Duration
     */
    baseMainDuration(): number;
    /**
     * @ignore
     */
    processSeriesDataItem(dataItem: DataItem<IXYSeriesDataItem>, fields: Array<string>): void;
    /**
     * @ignore
     */
    getDataItemPositionX(dataItem: DataItem<IXYSeriesDataItem>, field: string, cellLocation: number, axisLocation: number): number;
    /**
     * @ignore
     */
    getDataItemCoordinateX(dataItem: DataItem<IXYSeriesDataItem>, field: string, cellLocation: number, axisLocation: number): number;
    /**
     * @ignore
     */
    getDataItemPositionY(dataItem: DataItem<IXYSeriesDataItem>, field: string, cellLocation: number, axisLocation: number): number;
    /**
     * @ignore
     */
    getDataItemCoordinateY(dataItem: DataItem<IXYSeriesDataItem>, field: string, cellLocation: number, axisLocation: number): number;
    /**
     * @ignore
     */
    roundAxisPosition(position: number, location: number): number;
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * NOTE: Unless `adjustPosition` (2nd parameter) is set to `false`, the method
     * will adjust position by `tooltipIntervalOffset`.
     *
     * @param  position        Position
     * @param  adjustPosition  Adjust position
     * @return                 Tooltip text
     */
    getTooltipText(position: number, adjustPosition?: boolean): string | undefined;
    /**
     * Returns a data item from series that is closest to the `position`.
     *
     * @param   series    Series
     * @param   position  Relative position
     * @return            Data item
     */
    getSeriesItem(series: XYSeries, position: number, location?: number, snap?: boolean): DataItem<IXYSeriesDataItem> | undefined;
    /**
     * @ignore
     */
    shouldGap(dataItem: DataItem<IXYSeriesDataItem>, nextItem: DataItem<IXYSeriesDataItem>, autoGapCount: number, fieldName: string): boolean;
    /**
     * Zooms the axis to specific `start` and `end` dates.
     *
     * Optional `duration` specifies duration of zoom animation in milliseconds.
     *
     * @param  start     Start Date
     * @param  end       End Date
     * @param  duration  Duration in milliseconds
     */
    zoomToDates(start: Date, end: Date, duration?: number): void;
    /**
     * Returns a `Date` object corresponding to specific position within plot
     * area.
     *
     * @param   position  Pposition
     * @return            Date
     */
    positionToDate(position: number): Date;
    /**
     * Returns a relative position within plot area that corresponds to specific
     * date.
     *
     * @param   date  Date
     * @return        Position
     */
    dateToPosition(date: Date): number;
    /**
     * Returns relative position between two grid lines of the axis.
     *
     * @since 5.2.30
     * @return Position
     */
    getCellWidthPosition(): number;
}
//# sourceMappingURL=DateAxis.d.ts.map