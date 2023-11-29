import type { AxisRenderer } from "./AxisRenderer";
import type { IXYSeriesDataItem, XYSeries } from "../series/XYSeries";
import { DataItem } from "../../../core/render/Component";
import { Axis, IAxisSettings, IAxisPrivate, IAxisDataItem, IAxisEvents } from "./Axis";
import { MultiDisposer } from "../../../core/util/Disposer";
export interface IValueAxisSettings<R extends AxisRenderer> extends IAxisSettings<R> {
    /**
     * Override minimum value for the axis scale.
     *
     * NOTE: the axis might modify the minimum value to fit into its scale better,
     * unless `strictMinMax` is set to `true`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Custom_scope} for more info
     */
    min?: number;
    /**
     * Override maximum value for the axis scale.
     *
     * NOTE: the axis might modify the maximum value to fit into its scale better,
     * unless `strictMinMax` is set to `true`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Custom_scope} for more info
     */
    max?: number;
    /**
     * Force axis scale to be precisely at values as set in `min` and/or `max`.
     *
     * In case `min` and/or `max` is not set, the axis will fix its scale to
     * precise lowest and highest values available through all of the series
     * attached to it.
     *
     * This effectively locks the axis from auto-zooming itself when chart
     * is zoomed in.
     *
     * If you need to zoom to actual low/high values within currently visible
     * scope, use `strictMinMaxSelection` instead.
     *
     * Use `extraMin` and `extraMax` to add extra "padding".
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Custom_scope} for more info
     */
    strictMinMax?: boolean;
    /**
     * Force axis to auto-zoom to exact lowest and highest values from attached
     * series' data items within ucurrently visible range.
     *
     * This is a good feature when your series is plotted from derivative values,
     * like `valueYChangeSelection` as it helps to avoid frequent jumping of
     * series to adjusted min and max of the axis.
     *
     * Use `extraMin` and `extraMax` to add extra "padding".
     *
     * @since 5.1.11
     */
    strictMinMaxSelection?: boolean;
    /**
     * If set to `true` axis will use logarithmic scale.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Logarithmic_scale} for more info
     */
    logarithmic?: boolean;
    /**
     * Treat zero values as some other value.
     *
     * Useful in situations where zero would result in error, i.e. logarithmic
     * scale.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Logarithmic_scale} for more info
     */
    treatZeroAs?: number;
    /**
     * Relative extension to the automatically-calculated minimum value of the
     * axis scale.
     *
     * E..g. `0.1` will extend the scale by 10%, so if max value is `1000` and
     * minimum value is `0`, the new minimum value will be `-100`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Relative_scope_extension} for more info
     */
    extraMin?: number;
    /**
     * Relative extension to the automatically-calculated maximum value of the
     * axis scale.
     *
     * E..g. `0.1` will extend the scale by 10%, so if max value is `1000`, the
     * axis will now show maximum value of `1100`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Relative_scope_extension} for more info
     */
    extraMax?: number;
    /**
     * Base value, which indicates the threshold between "positive" and "negative"
     * values.
     *
     * @default 0
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Base_value} for more info
     */
    baseValue?: number;
    /**
     * Maximum number of decimals to allow in axis labels.
     *
     * This setting not only affects formatting of the labels, but also where and
     * how many grid/labels are placed on the axis.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Label_format} for more info
     */
    maxPrecision?: number;
    /**
     * A function that can be used to specify how to configure axis fills.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Axis_fills} for more info
     */
    fillRule?: (dataItem: DataItem<IValueAxisDataItem>) => void;
    /**
     * Number format to use for axis labels.
     *
     * If not set, will use format set in global number formatter.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Label_format} for more info
     */
    numberFormat?: string;
    /**
     * A numeric format used for numbers displayed in axis tooltip.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Tooltip_number_format} for more info
     */
    tooltipNumberFormat?: string | Intl.NumberFormatOptions;
    /**
     * If set, will use greater precision for the axis tooltip than the one for
     * axis' actual labels.
     *
     * E.g. if axis displays labels with one decimal (`1.0`, `1.1`, `1.2`) setting
     * this setting to `1` would allow two decimals in axis tooltip, e.g. `1.15`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Tooltip_number_format} for more info
     */
    extraTooltipPrecision?: number;
    /**
     * If your series relies on dynamically calculated values, like value
     * changes, percents, or total sums, set this to `true`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Calculated_values} for more info
     */
    calculateTotals?: boolean;
    /**
     * This setting can be set to an instance of another [[ValueAxis]].
     *
     * If set the grid of this axis will be synced with grid of the target axis.
     *
     * NOTE: this is not 100% guaranteed to work. In some rare cases perfect
     * sync might not be possible.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Syncing_grid} for more info
     */
    syncWithAxis?: ValueAxis<AxisRenderer>;
    /**
     * If set to `false`, the axis won't be auto-zoomed to a selection (this
     * works only if the other axis is a `DateAxis` or a `CategoryAxis`).
     *
     * IMPORTANT: This setting will be ignored if both X and Y axes are
     * a `ValueAxis`.
     *
     * @since 5.2.20
     * @default true
     */
    autoZoom?: boolean;
}
export interface IValueAxisDataItem extends IAxisDataItem {
    /**
     * Value of the data item.
     */
    value?: number;
    /**
     * End value for axis items that span multiple values, like axis ranges.
     */
    endValue?: number;
    /**
     * @ignore
     */
    labelEndValue?: number;
    /**
     * If set to `true` the values fo this data item will be factored in when
     * calculating scale of the [[ValueAxis]]. Useful for axis ranges.
     *
     * @since 5.1.4
     */
    affectsMinMax?: boolean;
}
export interface IMinMaxStep {
    min: number;
    max: number;
    step: number;
}
export interface IValueAxisPrivate extends IAxisPrivate {
    /**
     * Calculated current minimum value of the axis scale.
     *
     * @readonly
     */
    min?: number;
    /**
     * Calculated current maximum value of the axis scale.
     *
     * @readonly
     */
    max?: number;
    /**
     * A minimum value of the axis scale.
     *
     * Can be useful in cases where axis zoom is currently being animated, and
     * `min` is reflecting current intermediate value, whereas `minFinal` will
     * show target value.
     *
     * @readonly
     */
    minFinal?: number;
    /**
     * A maximum value of the axis scale.
     *
     * Can be useful in cases where axis zoom is currently being animated, and
     * `max` is reflecting current intermediate value, whereas `maxFinal` will
     * show target value.
     *
     * @readonly
     */
    maxFinal?: number;
    /**
     * Calculated minimum value of the currently viewable (zoomed) scope.
     *
     * @readonly
     */
    selectionMin?: number;
    /**
     * Calculated maximum value of the currently viewable (zoomed) scope.
     *
     * @readonly
     */
    selectionMax?: number;
    /**
     * A target minimum value of the viewable value scope.
     *
     * Can be useful in cases where axis zoom is currently being animated, and
     * `selectionMin` is reflecting current intermediate value,
     * whereas `selectionMinFinal` will show target value.
     *
     * @readonly
     */
    selectionMinFinal?: number;
    /**
     * A target maximum value of the viewable value scope.
     *
     * Can be useful in cases where axis zoom is currently being animated, and
     * `selectionMax` is reflecting current intermediate value,
     * whereas `selectionMaxFinal` will show target value.
     *
     * @readonly
     */
    selectionMaxFinal?: number;
    /**
     * When selection step changes, it might change during axis zoom animation.
     *
     * `selectionStepFinal` will show what step will be when animation is
     * finished.
     *
     * @readonly
     */
    selectionStepFinal?: number;
    /**
     * Value step between grid lines.
     *
     * @readonly
     */
    step?: number;
    /**
     * Decimal places used when formatting axis labels.
     *
     * @readonly
     */
    stepDecimalPlaces?: number;
}
export interface IValueAxisEvents extends IAxisEvents {
}
/**
 * Creates a value axis.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/} for more info
 * @important
 */
export declare class ValueAxis<R extends AxisRenderer> extends Axis<R> {
    static className: string;
    static classNames: Array<string>;
    _settings: IValueAxisSettings<R>;
    _privateSettings: IValueAxisPrivate;
    _dataItemSettings: IValueAxisDataItem;
    _events: IValueAxisEvents;
    protected _dirtyExtremes: boolean;
    protected _dirtySelectionExtremes: boolean;
    protected _deltaMinMax: number;
    protected _minReal: number | undefined;
    protected _maxReal: number | undefined;
    protected _baseValue: number;
    protected _syncDp?: MultiDisposer;
    protected _minLogAdjusted: number;
    /**
     * @ignore
     */
    markDirtyExtremes(): void;
    /**
     * @ignore
     */
    markDirtySelectionExtremes(): void;
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _groupData(): void;
    protected _formatText(value: number): string;
    protected _prepareAxisItems(): void;
    _prepareDataItem(dataItem: DataItem<this["_dataItemSettings"]>, count?: number): void;
    protected _handleRangeChange(): void;
    /**
     * Converts a relative position to a corresponding numeric value from axis
     * scale.
     *
     * @param   position  Relative position
     * @return            Value
     */
    positionToValue(position: number): number;
    /**
     * Convers value to a relative position on axis.
     *
     * @param   value  Value
     * @return         Relative position
     */
    valueToPosition(value: number): number;
    /**
     * @ignore
     */
    valueToFinalPosition(value: number): number;
    /**
     * Returns X coordinate in pixels corresponding to specific value.
     *
     * @param   value     Numeric value
     * @param   location  Location
     * @param   baseValue Base value
     * @return            X coordinate
     */
    getX(value: number, location: number, baseValue: number): number;
    /**
     * Returns X coordinate in pixels corresponding to specific value.
     *
     * @param   value     Numeric value
     * @param   location  Location
     * @param   baseValue Base value
     * @return            X coordinate
     */
    getY(value: number, location: number, baseValue: number): number;
    /**
     * @ignore
     */
    getDataItemCoordinateX(dataItem: DataItem<IXYSeriesDataItem>, field: string, _cellLocation: number, axisLocation: number): number;
    /**
     * @ignore
     */
    getDataItemPositionX(dataItem: DataItem<IXYSeriesDataItem>, field: string, _cellLocation: number, axisLocation: number): number;
    /**
     * @ignore
     */
    getDataItemCoordinateY(dataItem: DataItem<IXYSeriesDataItem>, field: string, _cellLocation: number, axisLocation: number): number;
    /**
     * @ignore
     */
    getDataItemPositionY(dataItem: DataItem<IXYSeriesDataItem>, field: string, _cellLocation: number, axisLocation: number): number;
    /**
     * Returns relative position of axis' `baseValue`.
     *
     * @return  Base value position
     */
    basePosition(): number;
    /**
     * Base value of the [[ValueAxis]], which determines positive and negative
     * values.
     *
     * @return Base value
     */
    baseValue(): number;
    /**
     * @ignore
     */
    cellEndValue(value: number): number;
    protected fixSmallStep(step: number): number;
    protected _fixMin(min: number): number;
    protected _fixMax(max: number): number;
    _calculateTotals(): void;
    protected _getSelectionMinMax(): void;
    protected _getMinMax(): void;
    protected _fixZoomFactor(): void;
    protected _getDelta(max: number): void;
    protected _saveMinMax(_min: number, _max: number): void;
    protected _adjustMinMax(min: number, max: number, gridCount: number, strictMode?: boolean): IMinMaxStep;
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * @param   position  Position
     * @return            Tooltip text
     */
    getTooltipText(position: number, _adjustPosition?: boolean): string | undefined;
    /**
     * Returns a data item from series that is closest to the `position`.
     *
     * @param   series    Series
     * @param   position  Relative position
     * @return            Data item
     */
    getSeriesItem(series: XYSeries, position: number): DataItem<IXYSeriesDataItem> | undefined;
    /**
     * Zooms the axis to specific `start` and `end` values.
     *
     * Optional `duration` specifies duration of zoom animation in milliseconds.
     *
     * @param  start     Start value
     * @param  end       End value
     * @param  duration  Duration in milliseconds
     */
    zoomToValues(start: number, end: number, duration?: number): void;
    /**
     * Syncs with a target axis.
     *
     * @param  min  Min
     * @param  max  Max
     * @param  step Step
     */
    protected _syncAxes(min: number, max: number, step: number, syncMin: number, syncMax: number, syncStep: number): {
        min: number;
        max: number;
        step: number;
    };
    /**
     * Returns `true` if axis needs to be resunced with some other axis.
     */
    protected _checkSync(min: number, max: number, step: number, count: number): boolean;
    /**
     * Returns relative position between two grid lines of the axis.
     *
     * @return Position
     */
    getCellWidthPosition(): number;
}
//# sourceMappingURL=ValueAxis.d.ts.map