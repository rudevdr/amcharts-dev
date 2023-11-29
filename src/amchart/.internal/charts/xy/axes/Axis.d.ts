import type { AxisRenderer } from "./AxisRenderer";
import type { AxisLabel } from "./AxisLabel";
import type { AxisTick } from "./AxisTick";
import type { Graphics } from "../../../core/render/Graphics";
import type { Grid } from "./Grid";
import type { AxisBullet } from "./AxisBullet";
import type { XYChart } from "../XYChart";
import type { XYSeries, IXYSeriesDataItem } from "../series/XYSeries";
import type { Animation } from "../../../core/util/Entity";
import type { Tooltip } from "../../../core/render/Tooltip";
import type { Root } from "../../../core/Root";
import { DataItem } from "../../../core/render/Component";
import { Component, IComponentSettings, IComponentPrivate, IComponentEvents, IComponentDataItem } from "../../../core/render/Component";
import { Container } from "../../../core/render/Container";
import { List } from "../../../core/util/List";
export interface IAxisSettings<R extends AxisRenderer> extends IComponentSettings {
    /**
     * A renderer object which is responsible of rendering visible axis elements.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/#Axis_renderer} for more info
     */
    renderer: R;
    /**
     * The initial relative zoom start position of the axis.
     *
     * E.g. stting it to `0.1` will pre-zoom axis to 10% from the start.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Pre_zooming_axes} for more info
     */
    start?: number;
    /**
     * The initial relative zoom end position of the axis.
     *
     * E.g. stting it to `0.9` will pre-zoom axis to 10% from the end.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Pre_zooming_axes} for more info
     */
    end?: number;
    /**
     * Maximum number of times the scope of the axis could auto-zoom-in.
     *
     * This is to prevent axis jumping too drastically when scrolling/zooming.
     *
     * @default 1000
     */
    maxZoomFactor?: number | null;
    /**
     * Maximum number of axis elements to show at a time.
     *
     * E.g. for a [[CategoryAxis]] that would be number of categories.
     * For a [[DateAxis]] it would be number of `baseInterval`.
     *
     * The axis will not allow to be zoomed out beyond this number.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Limiting_zoom_scope} for more info
     */
    maxZoomCount?: number;
    /**
     * Minimum number of axis elements to show at a time.
     *
     * E.g. for a [[CategoryAxis]] that would be number of categories.
     * For a [[DateAxis]] it would be number of `baseInterval`.
     *
     * The axis will not allow to be zoomed in beyond this number.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Limiting_zoom_scope} for more info
     */
    minZoomCount?: number;
    /**
     * Base value of the axis.
     */
    baseValue?: number;
    /**
     * If set to `false` the axis will be exempt when chart is panned
     * horizontally, and will keep its current position.`
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Excluding_axes_from_pan_or_zoom} for more info
     */
    panX?: boolean;
    /**
     * If set to `false` the axis will be exempt when chart is panned
     * vertically, and will keep its current position.`
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Excluding_axes_from_pan_or_zoom} for more info
     */
    panY?: boolean;
    /**
     * If set to `false` the axis will be exempt when chart is zoomed
     * horizontally, and will keep its current zoom/position.`
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Excluding_axes_from_pan_or_zoom} for more info
     */
    zoomX?: boolean;
    /**
     * If set to `false` the axis will be exempt when chart is zoomed
     * vertically, and will keep its current zoom/position.`
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Excluding_axes_from_pan_or_zoom} for more info
     */
    zoomY?: boolean;
    /**
     * A relative distance the axis is allowed to be zoomed/panned beyond its
     * actual scope.
     *
     * @default 0.1
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Over_zooming} for more info
     */
    maxDeviation?: number;
    /**
     * [[Tooltip]] element to use for axis.
     */
    tooltip?: Tooltip;
    /**
     * `tooltipLocation` indicates
     * which relative place to snap to: `0` beginning, `0.5` - middle, `1` - end.
     *
     * @default 0.5
     */
    tooltipLocation?: number;
    /**
     * Should tooltip snap to the `tooltipLocation` (`true`) or follow cursor.
     *
     * @default true
     */
    snapTooltip?: boolean;
    /**
     * If set to `true` (default) the axis width will stay constant across all
     * zooms, even if actual length of all visible labels changes.
     *
     * @default true
     */
    fixAxisSize?: boolean;
    /**
     * A function that will be used to create bullets on each cell.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/#Axis_bullets} for more info
     */
    bullet?: (root: Root, axis: Axis<AxisRenderer>, dataItem: DataItem<IAxisDataItem>) => AxisBullet;
}
export interface IAxisEvents extends IComponentEvents {
}
export interface IAxisPrivate extends IComponentPrivate {
    /**
     * @ignore
     */
    name?: "value" | "date" | "category";
    /**
     * @ignore
     */
    updateScrollbar?: boolean;
    /**
     * @ignore
     */
    maxZoomFactor?: number | null;
    /**
     * Saves position to which tooltip points.
     */
    tooltipPosition?: number;
    /**
     * Width in pixels between grid lines (read-only).
     *
     * It might not be exact, as [[DateAxis]] can have grids at irregular
     * intervals.
     *
     * Could be used to detect when size changes and to adjust labels for them
     * not to overlap.
     */
    cellWidth?: number;
}
export interface IAxisDataItem extends IComponentDataItem {
    /**
     * Axis label element.
     */
    label?: AxisLabel;
    /**
     * Tick element.
     */
    tick?: AxisTick;
    /**
     * Grid line element.
     */
    grid?: Grid;
    /**
     * Axis fill element.
     */
    axisFill?: Graphics;
    /**
     * Bullet element.
     */
    bullet?: AxisBullet;
    /**
     * Indicates if this data item represents an axis range.
     */
    isRange?: boolean;
    /**
     * If set to `true`, the grid and axis fill of this data item will be drawn
     * above series.
     *
     * NOTE: this needs to be set **before** crating an axis range. Updating this
     * dynamically won't have any effect.
     *
     * NOTE: if you need all grid to be drawn above series, you can brig it to
     * front with `chart.gridContainer.toFront();`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/#Grid_fill_above_series} for more info
     * @default false
     */
    above?: boolean;
}
/**
 * A base class for all axes.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/#Adding_axes} for more info
 */
export declare abstract class Axis<R extends AxisRenderer> extends Component {
    static className: string;
    static classNames: Array<string>;
    _settings: IAxisSettings<R>;
    _privateSettings: IAxisPrivate;
    _dataItemSettings: IAxisDataItem;
    _events: IAxisEvents;
    _seriesType: XYSeries;
    protected _series: Array<this["_seriesType"]>;
    _isPanning: boolean;
    /**
     * Array of minor data items.
     */
    minorDataItems: Array<DataItem<this["_dataItemSettings"]>>;
    /**
     * A [[Container]] that holds all the axis label elements.
     *
     * @default Container.new()
     */
    readonly labelsContainer: Container;
    /**
     * A [[Container]] that holds all the axis grid and fill elements.
     *
     * @default Container.new()
     */
    readonly gridContainer: Container;
    /**
     * A [[Container]] that holds axis grid elements which goes above the series.
     *
     * @default Container.new()
     */
    readonly topGridContainer: Container;
    /**
     * A [[Container]] that holds all the axis bullet elements.
     *
     * @default new Container
     */
    readonly bulletsContainer: Container;
    /**
     * A referenece to the the chart the axis belongs to.
     */
    chart: XYChart | undefined;
    protected _rangesDirty: Boolean;
    _panStart: number;
    _panEnd: number;
    protected _sAnimation?: Animation<this["_settings"]["start"]>;
    protected _eAnimation?: Animation<this["_settings"]["end"]>;
    _skipSync: boolean;
    /**
     * A list of axis ranges.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/} for more info
     * @default new List()
     */
    readonly axisRanges: List<DataItem<this["_dataItemSettings"]>>;
    _seriesAxisRanges: Array<DataItem<this["_dataItemSettings"]>>;
    /**
     * A control label that is invisible but is used to keep width the width of
     * the axis constant.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/value-axis/#Ghost_label} for more info
     */
    ghostLabel: AxisLabel;
    protected _cursorPosition: number;
    protected _snapToSeries?: Array<XYSeries>;
    _seriesValuesDirty: boolean;
    /**
     * A container above the axis that can be used to add additional stuff into
     * it. For example a legend, label, or an icon.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-headers/} for more info
     * @default new Container
     */
    axisHeader: Container;
    _bullets: {
        [index: string]: AxisBullet;
    };
    protected _dispose(): void;
    protected _afterNew(): void;
    protected _updateFinals(_start: number, _end: number): void;
    /**
     * Zooms the axis to relative locations.
     *
     * Both `start` and `end` are relative: 0 means start of the axis, 1 - end.
     *
     * @param   start     Relative start
     * @param   end       Relative end
     * @param   duration  Duration of the zoom animation in milliseconds
     * @return            Zoom animation
     */
    zoom(start: number, end: number, duration?: number, priority?: "start" | "end"): Animation<this["_settings"]["start"]> | Animation<this["_settings"]["end"]> | undefined;
    /**
     * A list of series using this axis.
     *
     * @return Series
     */
    get series(): Array<this["_seriesType"]>;
    _processAxisRange(dataItem: DataItem<this["_dataItemSettings"]>, themeTags: Array<string>): void;
    _prepareDataItem(_dataItem: DataItem<this["_dataItemSettings"]>, _index?: number): void;
    /**
     * @ignore
     */
    abstract getX(_value: any, _location: number, baseValue?: any): number;
    /**
     * @ignore
     */
    abstract getY(_value: any, _location: number, baseValue?: any): number;
    /**
     * @ignore
     */
    abstract getDataItemCoordinateX(_dataItem: DataItem<IXYSeriesDataItem>, _field: string, _cellLocation?: number, _axisLocation?: number): number;
    /**
     * @ignore
     */
    abstract getDataItemCoordinateY(_dataItem: DataItem<IXYSeriesDataItem>, _field: string, _cellLocation?: number, _axisLocation?: number): number;
    /**
     * @ignore
     */
    abstract getDataItemPositionX(_dataItem: DataItem<IXYSeriesDataItem>, _field: string, _cellLocation?: number, _axisLocation?: number): number;
    /**
     * @ignore
     */
    abstract getDataItemPositionY(_dataItem: DataItem<IXYSeriesDataItem>, _field: string, _cellLocation?: number, _axisLocation?: number): number;
    /**
     * @ignore
     */
    markDirtyExtremes(): void;
    /**
     * @ignore
     */
    markDirtySelectionExtremes(): void;
    _calculateTotals(): void;
    protected _updateAxisRanges(): void;
    /**
     * @ignore
     */
    abstract baseValue(): any;
    _prepareChildren(): void;
    _updateTooltipBounds(): void;
    _updateBounds(): void;
    /**
     * @ignore
     */
    processChart(chart: XYChart): void;
    /**
     * @ignore
     */
    hideDataItem(dataItem: DataItem<IAxisDataItem>): Promise<void>;
    /**
     * @ignore
     */
    showDataItem(dataItem: DataItem<IAxisDataItem>): Promise<void>;
    _toggleFHDataItem(dataItem: DataItem<IAxisDataItem>, forceHidden: boolean): void;
    _toggleDataItem(dataItem: DataItem<IAxisDataItem>, visible: boolean): void;
    /**
     * @ignore
     */
    abstract basePosition(): number;
    _createAssets(dataItem: DataItem<this["_dataItemSettings"]>, tags: Array<string>, minor?: boolean): void;
    protected _processBullet(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _afterChanged(): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateGhost(): void;
    _handleCursorPosition(position: number, snapToSeries?: Array<XYSeries>): void;
    /**
     * Can be called when axis zoom changes and you need to update tooltip
     * position.
     */
    updateTooltip(): void;
    protected _updateTooltipText(tooltip: Tooltip, position: number): void;
    /**
     * Returns text to be used in an axis tooltip for specific relative position.
     *
     * @param   position        Position
     * @param   adjustPosition  Adjust position
     * @return                  Tooltip text
     */
    abstract getTooltipText(position: number, adjustPosition?: boolean): string | undefined;
    /**
     * @ignore
     */
    roundAxisPosition(position: number, _location: number): number;
    /**
     * @ignore
     */
    handleCursorShow(): void;
    /**
     * @ignore
     */
    handleCursorHide(): void;
    /**
     * @ignore
     */
    processSeriesDataItem(_dataItem: DataItem<IXYSeriesDataItem>, _fields: Array<string>): void;
    _clearDirty(): void;
    /**
     * Converts pixel coordinate to a relative position on axis.
     *
     * @param   coordinate  Coordinate
     * @return              Relative position
     */
    coordinateToPosition(coordinate: number): number;
    /**
     * Converts relative position of the plot area to relative position of the
     * axis with zoom taken into account.
     *
     * @param position Position
     * @return Relative position
     */
    toAxisPosition(position: number): number;
    /**
     * Converts relative position of the axis to a global position taking current
     * zoom into account (opposite to what `toAxisPosition` does).
     *
     * @since 5.4.2
     * @param position Position
     * @return Global position
     */
    toGlobalPosition(position: number): number;
    /**
     * Adjusts position with inversed taken into account.
     *
     * @ignore
     */
    fixPosition(position: number): number;
    /**
     * Returns a data item from series that is closest to the `position`.
     *
     * @param   series    Series
     * @param   position  Relative position
     * @return            Data item
     */
    abstract getSeriesItem(series: XYSeries, position: number, location?: number): DataItem<IXYSeriesDataItem> | undefined;
    /**
     * @ignore
     */
    shouldGap(_dataItem: DataItem<IXYSeriesDataItem>, _nextItem: DataItem<IXYSeriesDataItem>, _autoGapCount: number, _fieldName: string): boolean;
    /**
     * Creates and returns an axis range object.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/} for more info
     * @param   axisDataItem  Axis data item
     * @return                Axis range
     */
    createAxisRange(axisDataItem: DataItem<IAxisDataItem>): DataItem<this["_dataItemSettings"]>;
    /**
     * @ignore
     */
    _groupSeriesData(_series: XYSeries): void;
    /**
     * Returns relative position between two grid lines of the axis.
     *
     * @return Position
     */
    getCellWidthPosition(): number;
}
//# sourceMappingURL=Axis.d.ts.map