import type { Axis, IAxisPrivate, IAxisDataItem } from "../axes/Axis";
import type { AxisRenderer } from "../axes/AxisRenderer";
import type { IPoint } from "../../../core/util/IPoint";
import type { Sprite } from "../../../core/render/Sprite";
import type { Bullet } from "../../../core/render/Bullet";
import type { XYChart } from "../XYChart";
import type { ITimeInterval } from "../../../core/util/Time";
import { DataItem } from "../../../core/render/Component";
import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate, ISeriesEvents } from "../../../core/render/Series";
import { List } from "../../../core/util/List";
import { Container } from "../../../core/render/Container";
import { Graphics } from "../../../core/render/Graphics";
import type { IDisposer } from "../../../core/util/Disposer";
/**
 * Interface representing a series axis range.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/#Series_axis_ranges} for more info
 */
export interface IXYSeriesAxisRange {
    /**
     * Related axis data item.
     */
    axisDataItem: DataItem<IAxisDataItem>;
    /**
     * A [[Container]] element that range's elements are placed in.
     */
    container?: Container;
    /**
     * Target series.
     */
    series?: XYSeries;
}
export interface IXYAxisPrivate extends IAxisPrivate {
    min?: number;
    max?: number;
}
export interface IXYAxis extends Axis<AxisRenderer> {
    _privateSettings: IXYAxisPrivate;
}
export interface IXYSeriesEvents extends ISeriesEvents {
    /**
     * Kicks in when axis starts using different data set, e.g. data
     * of different granularit on [[DateAxis]].
     *
     * @since 5.1.1
     */
    datasetchanged: {
        id: string;
    };
}
/**
 * XY chart series data item.
 */
export interface IXYSeriesDataItem extends ISeriesDataItem {
    valueX?: number;
    valueXWorking?: number;
    valueXChange?: number;
    valueXChangePercent?: number;
    valueXChangeSelection?: number;
    valueXChangeSelectionPercent?: number;
    valueXChangePrevious?: number;
    valueXChangePreviousPercent?: number;
    valueXWorkingOpen?: number;
    valueXWorkingClose?: number;
    valueY?: number;
    valueYChange?: number;
    valueYWorking?: number;
    valueYChangePercent?: number;
    valueYChangeSelection?: number;
    valueYChangeSelectionPercent?: number;
    valueYChangePrevious?: number;
    valueYChangePreviousPercent?: number;
    valueYWorkingOpen?: number;
    valueYWorkingClose?: number;
    openValueX?: number;
    openValueXWorking?: number;
    openValueXChange?: number;
    openValueXChangePercent?: number;
    openValueXChangeSelection?: number;
    openValueXChangeSelectionPercent?: number;
    openValueXChangePrevious?: number;
    openValueXChangePreviousPercent?: number;
    openValueXWorkingOpen?: number;
    openValueXWorkingClose?: number;
    openValueY?: number;
    openValueYWorking?: number;
    openValueYChange?: number;
    openValueYChangePercent?: number;
    openValueYChangeSelection?: number;
    openValueYChangeSelectionPercent?: number;
    openValueYChangePrevious?: number;
    openValueYChangePreviousPercent?: number;
    openValueYWorkingOpen?: number;
    openValueYWorkingClose?: number;
    lowValueX?: number;
    lowValueXWorking?: number;
    lowValueXChange?: number;
    lowValueXChangePercent?: number;
    lowValueXChangeSelection?: number;
    lowValueXChangeSelectionPercent?: number;
    lowValueXChangePrevious?: number;
    lowValueXChangePreviousPercent?: number;
    lowValueXWorkingOpen?: number;
    lowValueXWorkingClose?: number;
    highValueX?: number;
    highValueXWorking?: number;
    highValueXChange?: number;
    highValueXChangePercent?: number;
    highValueXChangeSelection?: number;
    highValueXChangeSelectionPercent?: number;
    highValueXChangePrevious?: number;
    highValueXChangePreviousPercent?: number;
    highValueXWorkingOpen?: number;
    highValueXWorkingClose?: number;
    lowValueY?: number;
    lowValueYWorking?: number;
    lowValueYChange?: number;
    lowValueYChangePercent?: number;
    lowValueYChangeSelection?: number;
    lowValueYChangeSelectionPercent?: number;
    lowValueYChangePrevious?: number;
    lowValueYChangePreviousPercent?: number;
    lowValueYWorkingOpen?: number;
    lowValueYWorkingClose?: number;
    highValueY?: number;
    highValueYWorking?: number;
    highValueYChange?: number;
    highValueYChangePercent?: number;
    highValueYChangeSelection?: number;
    highValueYChangeSelectionPercent?: number;
    highValueYChangePrevious?: number;
    highValueYChangePreviousPercent?: number;
    highValueYWorkingOpen?: number;
    highValueYWorkingClose?: number;
    categoryX?: string;
    categoryY?: string;
    openCategoryX?: string;
    openCategoryY?: string;
    locationX?: number;
    locationY?: number;
    openLocationX?: number;
    openLocationY?: number;
    stackToItemX?: DataItem<IXYSeriesDataItem>;
    stackToItemY?: DataItem<IXYSeriesDataItem>;
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
    point?: IPoint;
    originals?: Array<DataItem<IXYSeriesDataItem>>;
}
export interface IXYSeriesSettings extends ISeriesSettings {
    /**
     * Minimal distance between data items in pixels.
     *
     * If data items are closer than this, bullets are turned off to avoid
     * overcrowding.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Bullets} for more info
     */
    minBulletDistance?: number;
    /**
     * X axis series uses.
     *
     * **IMPORTANT:** `xAxis` needs to be set when creating the series. Updating
     * this setting on previously created series object will not work.
     */
    xAxis: IXYAxis;
    /**
     * Y axis series uses.
     *
     * **IMPORTANT:** `yAxis` needs to be set when creating the series. Updating
     * this setting on previously created series object will not work.
     */
    yAxis: IXYAxis;
    /**
     * If set to `true` series will be stacked to other series that also have
     * this setting set to `true`.
     *
     * NOTE: for series stack properly, all stacked series must have same number
     * of data items with the same timestamp/category.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Stacked_series} for more info
     */
    stacked?: boolean;
    /**
     * Whether to stack negative values from zero (`true`) or from whatever
     * previous series value is (`false`).
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Negative_value_stacking} for more info
     */
    stackToNegative?: boolean;
    /**
     * Base axis for the series.
     *
     * A base axis will dictate direction series plot.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Base_axis} for more info
     */
    baseAxis?: IXYAxis;
    /**
     * Input data field for X value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    valueXField?: string;
    /**
     * Input data field for Y value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    valueYField?: string;
    /**
     * Exclude series values when calculating totals for category/interval.
     *
     * @default false
     */
    excludeFromTotal?: boolean;
    /**
     * Display data field for X value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    valueXShow?: "valueXWorking" | "valueXChange" | "valueXChangePercent" | "valueXChangeSelection" | "valueXChangeSelectionPercent" | "valueXChangePrevious" | "valueXChangePreviousPercent" | "valueXTotal" | "valueXTotalPercent" | "valueXSum";
    /**
     * Display data field for Y value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    valueYShow?: "valueYWorking" | "valueYChange" | "valueYChangePercent" | "valueYChangeSelection" | "valueYChangeSelectionPercent" | "valueYChangePrevious" | "valueYChangePreviousPercent" | "valueYTotal" | "valueYTotalPercent" | "valueYSum";
    /**
     * Indicates what aggregate value to use for collective data item, when
     * aggregating X values from several data items.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Dynamic_data_item_grouping} for more info
     */
    valueXGrouped?: "open" | "close" | "low" | "high" | "average" | "sum" | "extreme";
    /**
     * Indicates what aggregate value to use for collective data item, when
     * aggregating X values from several data items.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Dynamic_data_item_grouping} for more info
     */
    valueYGrouped?: "open" | "close" | "low" | "high" | "average" | "sum" | "extreme";
    /**
     * Input data field for X open value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    openValueXField?: string;
    /**
     * Input data field for X open value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    openValueYField?: string;
    /**
     * Display data field for X open value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    openValueXShow?: "openValueXWorking" | "openValueXChange" | "openValueXChangePercent" | "openValueXChangeSelection" | "openValueXChangeSelectionPercent" | "openValueXChangePrevious" | "openValueXChangePreviousPercent";
    /**
     * Display data field for Y open value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    openValueYShow?: "openValueYWorking" | "openValueYChange" | "openValueYChangePercent" | "openValueYChangeSelection" | "openValueYChangeSelectionPercent" | "openValueYChangePrevious" | "openValueYChangePreviousPercent";
    /**
     * Display data field for Y open value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Dynamic_data_item_grouping} for more info
     */
    openValueXGrouped?: "open" | "close" | "low" | "high" | "average" | "sum" | "extreme";
    /**
     * Display data field for Y open value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Dynamic_data_item_grouping} for more info
     */
    openValueYGrouped?: "open" | "close" | "low" | "high" | "average" | "sum" | "extreme";
    /**
     * Input data field for X low value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/candlestick-series/} for more info
     */
    lowValueXField?: string;
    /**
     * Input data field for Y low value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/candlestick-series/} for more info
     */
    lowValueYField?: string;
    /**
     * Input data field for X high value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/candlestick-series/} for more info
     */
    highValueXField?: string;
    /**
     * Input data field for Y high value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/candlestick-series/} for more info
     */
    highValueYField?: string;
    /**
     * Display data field for X low value.
     */
    lowValueXShow?: "lowValueXWorking" | "lowValueXChange" | "lowValueXChangePercent" | "lowValueXChangeSelection" | "lowValueXChangeSelectionPercent" | "lowValueXChangePrevious" | "lowValueXChangePreviousPercent";
    /**
     * Display data field for Y low value.
     */
    lowValueYShow?: "lowValueYWorking" | "lowValueYChange" | "lowValueYChangePercent" | "lowValueYChangeSelection" | "lowValueYChangeSelectionPercent" | "lowValueYChangePrevious" | "lowValueYChangePreviousPercent";
    /**
     * Indicates what aggregate value to use for collective data item, when
     * aggregating X low values from several data items.
     */
    lowValueXGrouped?: "open" | "close" | "low" | "high" | "average" | "sum" | "extreme";
    /**
     * Indicates what aggregate value to use for collective data item, when
     * aggregating Y low values from several data items.
     */
    lowValueYGrouped?: "open" | "close" | "low" | "high" | "average" | "sum" | "extreme";
    /**
     * Display data field for X high value.
     */
    highValueXShow?: "highValueXWorking" | "highValueXChange" | "highValueXChangePercent" | "highValueXChangeSelection" | "highValueXChangeSelectionPercent" | "highValueXChangePrevious" | "highValueXChangePreviousPercent";
    /**
     * Display data field for Y low value.
     */
    highValueYShow?: "highValueYWorking" | "highValueYChange" | "highValueYChangePercent" | "highValueYChangeSelection" | "highValueYChangeSelectionPercent" | "highValueYChangePrevious" | "highValueYChangePreviousPercent";
    /**
     * Indicates what aggregate value to use for collective data item, when
     * aggregating X high values from several data items.
     */
    highValueXGrouped?: "open" | "close" | "high" | "high" | "average" | "sum" | "extreme";
    /**
     * Indicates what aggregate value to use for collective data item, when
     * aggregating X high values from several data items.
     */
    highValueYGrouped?: "open" | "close" | "high" | "high" | "average" | "sum" | "extreme";
    /**
     * Horizontal location of the low data point relative to its cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @default 0.5
     */
    lowLocationX?: number;
    /**
     * Vertical location of the low data point relative to its cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @default 0.5
     */
    lowLocationY?: number;
    /**
     * Horizontal location of the high data point relative to its cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @default 0.5
     */
    highLocationX?: number;
    /**
     * Vertical location of the high data point relative to its cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @default 0.5
     */
    highLocationY?: number;
    /**
     * Input data field for X category.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    categoryXField?: string;
    /**
     * Input data field for Y category.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    categoryYField?: string;
    /**
     * Display data field for X category.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    openCategoryXField?: string;
    /**
     * Display data field for Y category.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/#Data_fields} for more info
     */
    openCategoryYField?: string;
    /**
     * If set to `true` this series will be ignored when calculating scale of the
     * related axes.
     *
     * @default false
     */
    ignoreMinMax?: boolean;
    /**
     * @ignore
     */
    vcx?: number;
    /**
     * @ignore
     */
    vcy?: number;
    /**
     * Horizontal location of the data point relative to its cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/#Data_item_location} for more info
     * @default 0.5
     */
    locationX?: number;
    /**
     * Vertical location of the data point relative to its cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/#Data_item_location} for more info
     * @default 0.5
     */
    locationY?: number;
    /**
     * Horizontal location of the open data point relative to its cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @default 0.5
     */
    openLocationX?: number;
    /**
     * Vertical location of the open data point relative to its cell.
     *
     * `0` - beginning, `0.5` - middle, `1` - end.
     *
     * @default 0.5
     */
    openLocationY?: number;
    /**
     * If set to `true` [[XYCursor]] will show closest data item from series
     * even if it is outside currently hovered date axis interval.
     *
     * This setting is relevant only if `baseAxis` is a date axis.
     */
    snapTooltip?: boolean;
    /**
     * Text to use for series legend label when no particular category/interval
     * is selected.
     */
    legendRangeLabelText?: string;
    /**
     * Text to use for series legend value label when no particular
     * category/interval is selected.
     */
    legendRangeValueText?: string;
    /**
     * If set to `true`, series bullets will be masked by plot area.
     */
    maskBullets?: boolean;
    /**
     * Whether series' tooltip should inherit its color from series or its first
     * bullet.
     *
     * @default "series"
     */
    seriesTooltipTarget?: "series" | "bullet";
    /**
     * Indicates horizontal position at which to show series' tooltip at.
     *
     * @default "value"
     * @since 5.0.16
     */
    tooltipPositionX?: "open" | "value" | "low" | "high";
    /**
     * Indicates vertical position at which to show series' tooltip at.
     *
     * @default "value"
     * @since 5.0.16
     */
    tooltipPositionY?: "open" | "value" | "low" | "high";
    /**
     * If set to `true` data items for this series won't be grouped even if
     * the `groupData: true` is set on a related [[DateAxis]].
     *
     * @since 5.0.19
     */
    groupDataDisabled?: boolean;
    /**
     * A [[DataItem]] that is being used for current tooltip, e.g. by a chart
     * cursor.
     *
     * @since 5.1.2
     */
    tooltipDataItem?: DataItem<IXYSeriesDataItem>;
    /**
     * If set to `true`, when data is grouped, the `originals` setting of the
     * group data items will be populated by the original (source) data items
     * that fall into the group.
     *
     * Please note that if `groupDataCallback` is set, this setting is ignored
     * as originals will always be included, regardless of the value.
     *
     * @since 5.1.11
     * @default false
     */
    groupDataWithOriginals?: boolean;
    /**
     * A custom function to call when grouping data items.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/date-axis/#Custom_aggregation_functions} for more info
     * @since 5.1.11
     */
    groupDataCallback?: (dataItem: DataItem<IXYSeriesDataItem>, interval: ITimeInterval) => void;
}
export interface IXYSeriesPrivate extends ISeriesPrivate {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
    selectionMinX?: number;
    selectionMaxX?: number;
    selectionMinY?: number;
    selectionMaxY?: number;
    valueXAverage?: number;
    valueXCount?: number;
    valueXSum?: number;
    valueXAbsoluteSum?: number;
    valueXLow?: number;
    valueXHigh?: number;
    valueXOpen?: number;
    valueXClose?: number;
    valueYAverage?: number;
    valueYCount?: number;
    valueYSum?: number;
    valueYAbsoluteSum?: number;
    valueYLow?: number;
    valueYHigh?: number;
    valueYOpen?: number;
    valueYClose?: number;
    valueXAverageSelection?: number;
    valueXCountSelection?: number;
    valueXSumSelection?: number;
    valueXAbsoluteSumSelection?: number;
    valueXLowSelection?: number;
    valueXHighSelection?: number;
    valueXOpenSelection?: number;
    valueXCloseSelection?: number;
    valueYAverageSelection?: number;
    valueYCountSelection?: number;
    valueYSumSelection?: number;
    valueYAbsoluteSumSelection?: number;
    valueYLowSelection?: number;
    valueYHighSelection?: number;
    valueYOpenSelection?: number;
    valueYCloseSelection?: number;
    openValueXAverage?: number;
    openValueXCount?: number;
    openValueXSum?: number;
    openValueXAbsoluteSum?: number;
    openValueXLow?: number;
    openValueXHigh?: number;
    openValueXOpen?: number;
    openValueXClose?: number;
    openValueYAverage?: number;
    openValueYCount?: number;
    openValueYSum?: number;
    openValueYAbsoluteSum?: number;
    openValueYLow?: number;
    openValueYHigh?: number;
    openValueYOpen?: number;
    openValueYClose?: number;
    openValueXAverageSelection?: number;
    openValueXCountSelection?: number;
    openValueXSumSelection?: number;
    openValueXAbsoluteSumSelection?: number;
    openValueXLowSelection?: number;
    openValueXHighSelection?: number;
    openValueXOpenSelection?: number;
    openValueXCloseSelection?: number;
    openValueYAverageSelection?: number;
    openValueYCountSelection?: number;
    openValueYSumSelection?: number;
    openValueYAbsoluteSumSelection?: number;
    openValueYLowSelection?: number;
    openValueYHighSelection?: number;
    openValueYOpenSelection?: number;
    openValueYCloseSelection?: number;
    lowValueXAverage?: number;
    lowValueXCount?: number;
    lowValueXSum?: number;
    lowValueXAbsoluteSum?: number;
    lowValueXLow?: number;
    lowValueXHigh?: number;
    lowValueXlow?: number;
    lowValueXClose?: number;
    lowValueYAverage?: number;
    lowValueYCount?: number;
    lowValueYSum?: number;
    lowValueYAbsoluteSum?: number;
    lowValueYLow?: number;
    lowValueYHigh?: number;
    lowValueYlow?: number;
    lowValueYClose?: number;
    lowValueXAverageSelection?: number;
    lowValueXCountSelection?: number;
    lowValueXSumSelection?: number;
    lowValueXAbsoluteSumSelection?: number;
    lowValueXLowSelection?: number;
    lowValueXHighSelection?: number;
    lowValueXlowSelection?: number;
    lowValueXCloseSelection?: number;
    lowValueYAverageSelection?: number;
    lowValueYCountSelection?: number;
    lowValueYSumSelection?: number;
    lowValueYAbsoluteSumSelection?: number;
    lowValueYLowSelection?: number;
    lowValueYHighSelection?: number;
    lowValueYlowSelection?: number;
    lowValueYCloseSelection?: number;
    highValueXAverage?: number;
    highValueXCount?: number;
    highValueXSum?: number;
    highValueXAbsoluteSum?: number;
    highValueXLow?: number;
    highValueXHigh?: number;
    highValueXhigh?: number;
    highValueXClose?: number;
    highValueYAverage?: number;
    highValueYCount?: number;
    highValueYSum?: number;
    highValueYAbsoluteSum?: number;
    highValueYLow?: number;
    highValueYHigh?: number;
    highValueYhigh?: number;
    highValueYClose?: number;
    highValueXAverageSelection?: number;
    highValueXCountSelection?: number;
    highValueXSumSelection?: number;
    highValueXAbsoluteSumSelection?: number;
    highValueXLowSelection?: number;
    highValueXHighSelection?: number;
    highValueXhighSelection?: number;
    highValueXCloseSelection?: number;
    highValueYAverageSelection?: number;
    highValueYCountSelection?: number;
    highValueYSumSelection?: number;
    highValueYAbsoluteSumSelection?: number;
    highValueYLowSelection?: number;
    highValueYHighSelection?: number;
    highValueYhighSelection?: number;
    highValueYCloseSelection?: number;
    outOfSelection?: boolean;
}
/**
 * A base class for all XY chart series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/} for more info
 */
export declare abstract class XYSeries extends Series {
    static className: string;
    static classNames: Array<string>;
    _settings: IXYSeriesSettings;
    _privateSettings: IXYSeriesPrivate;
    _dataItemSettings: IXYSeriesDataItem;
    _axisRangeType: IXYSeriesAxisRange;
    _events: IXYSeriesEvents;
    protected _xField: string;
    protected _yField: string;
    protected _xOpenField: string;
    protected _yOpenField: string;
    protected _xLowField: string;
    protected _xHighField: string;
    protected _yLowField: string;
    protected _yHighField: string;
    protected _axesDirty: boolean;
    _stackDirty: boolean;
    protected _selectionProcessed: boolean;
    chart: XYChart | undefined;
    _dataSets: {
        [index: string]: Array<DataItem<IXYSeriesDataItem>>;
    };
    _mainContainerMask: Graphics | undefined;
    protected _x: number;
    protected _y: number;
    _bullets: {
        [index: string]: Sprite;
    };
    /**
     * A [[Container]] that us used to put series' elements in.
     *
     * @default Container.new()
     */
    readonly mainContainer: Container;
    /**
     * A list of axis ranges that affect the series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/} for more info
     */
    readonly axisRanges: List<this["_axisRangeType"]>;
    protected _skipped: boolean;
    protected _couldStackTo: Array<XYSeries>;
    protected _reallyStackedTo: {
        [index: number]: XYSeries;
    };
    _stackedSeries: {
        [index: number]: XYSeries;
    };
    protected _aLocationX0: number;
    protected _aLocationX1: number;
    protected _aLocationY0: number;
    protected _aLocationY1: number;
    protected _showBullets: boolean;
    protected valueXFields: string[];
    protected valueYFields: string[];
    _valueXFields: Array<string>;
    _valueYFields: Array<string>;
    protected _valueXShowFields: Array<string>;
    protected _valueYShowFields: Array<string>;
    __valueXShowFields: Array<string>;
    __valueYShowFields: Array<string>;
    protected _emptyDataItem: DataItem<{}>;
    _dataSetId?: string;
    protected _tooltipFieldX?: string;
    protected _tooltipFieldY?: string;
    _posXDp?: IDisposer;
    _posYDp?: IDisposer;
    protected _afterNew(): void;
    protected _processAxisRange(axisRange: this["_axisRangeType"]): void;
    protected _removeAxisRange(axisRange: this["_axisRangeType"]): void;
    protected _updateFields(): void;
    protected _dispose(): void;
    protected _min<Key extends keyof this["_privateSettings"]>(key: Key, value: number | undefined): void;
    protected _max<Key extends keyof this["_privateSettings"]>(key: Key, value: number | undefined): void;
    protected _shouldMakeBullet(dataItem: DataItem<this["_dataItemSettings"]>): boolean;
    protected _makeFieldNames(): void;
    protected _fixVC(): void;
    protected _handleMaskBullets(): void;
    _fixPosition(): void;
    _prepareChildren(): void;
    protected _makeRangeMask(): void;
    _updateChildren(): void;
    protected _stack(): void;
    _unstack(): void;
    protected _stackDataItems(): void;
    protected processXSelectionDataItem(dataItem: DataItem<this["_dataItemSettings"]>, vcx: number, stacked: boolean): void;
    protected processYSelectionDataItem(dataItem: DataItem<this["_dataItemSettings"]>, vcy: number, stacked: boolean): void;
    /**
     * @ignore
     */
    getStackedYValueWorking(dataItem: DataItem<IXYSeriesDataItem>, key: string): number;
    /**
     * @ignore
     */
    getStackedXValueWorking(dataItem: DataItem<IXYSeriesDataItem>, key: string): number;
    /**
     * @ignore
     */
    getStackedYValue(dataItem: DataItem<IXYSeriesDataItem>, key: string): number;
    /**
     * @ignore
     */
    getStackedXValue(dataItem: DataItem<IXYSeriesDataItem>, key: string): number;
    /**
     * @ignore
     */
    createLegendMarker(_dataItem?: DataItem<this["_dataItemSettings"]>): void;
    _markDirtyAxes(): void;
    _markDataSetDirty(): void;
    _clearDirty(): void;
    _positionBullet(bullet: Bullet): void;
    protected _shouldShowBullet(_positionX: number, _positionY: number): boolean;
    /**
     * @ignore
     */
    setDataSet(id: string): void;
    /**
     * @ignore
     */
    resetGrouping(): void;
    protected _handleDataSetChange(): void;
    /**
     * Shows hidden series.
     *
     * @param   duration  Duration of animation in milliseconds
     * @return            Animation promise
     */
    show(duration?: number): Promise<void>;
    /**
     * Hides series.
     *
     * @param   duration  Duration of animation in milliseconds
     * @return            Animation promise
     */
    hide(duration?: number): Promise<void>;
    /**
     * Shows series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    _markDirtyStack(): void;
    protected _markStakedDirtyStack(): void;
    _afterChanged(): void;
    /**
     * Shows a tooltip for specific data item.
     *
     * @param  dataItem  Data item
     */
    showDataItemTooltip(dataItem: DataItem<this["_dataItemSettings"]> | undefined): void;
    hideTooltip(): Promise<void> | undefined;
    protected _getTooltipTarget(dataItem: DataItem<this["_dataItemSettings"]>): Sprite;
    /**
     * @ignore
     */
    updateLegendValue(dataItem?: DataItem<this["_dataItemSettings"]> | undefined): void;
    protected _getItemReaderLabel(): string;
    /**
     * @ignore
     */
    getPoint(positionX: number, positionY: number): IPoint;
    protected _shouldInclude(_position: number): boolean;
    /**
     * @ignore
     */
    handleCursorHide(): void;
    protected _afterDataChange(): void;
    /**
     * Resets cached axis scale values.
     */
    resetExtremes(): void;
    /**
     * Creates and returns an axis range object.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/} for more info
     * @param   axisDataItem  Axis data item
     * @return                Axis range
     */
    createAxisRange(axisDataItem: DataItem<IAxisDataItem>): this["_axisRangeType"];
    /**
     * A list of series's main (ungrouped) data items.
     *
     * @return  Data items
     */
    get mainDataItems(): Array<DataItem<this["_dataItemSettings"]>>;
}
//# sourceMappingURL=XYSeries.d.ts.map