import type { Axis } from "./axes/Axis";
import type { XYCursor } from "./XYCursor";
import type { AxisRenderer } from "./axes/AxisRenderer";
import type { IDisposer } from "../../core/util/Disposer";
import type { XYSeries } from "./series/XYSeries";
import type { IPointerEvent } from "../../core/render/backend/Renderer";
import type { Scrollbar } from "../../core/render/Scrollbar";
import type { IPoint } from "../../core/util/IPoint";
import type { ISpritePointerEvent } from "../../core/render/Sprite";
import { Container } from "../../core/render/Container";
import { SerialChart, ISerialChartPrivate, ISerialChartSettings, ISerialChartEvents } from "../../core/render/SerialChart";
import { ListAutoDispose } from "../../core/util/List";
import { Button } from "../../core/render/Button";
import type { Animation } from "../../core/util/Entity";
export interface IXYChartSettings extends ISerialChartSettings {
    /**
     * horizontal scrollbar.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/} for more info
     */
    scrollbarX?: Scrollbar;
    /**
     * Vertical scrollbar.
     *
     */
    scrollbarY?: Scrollbar;
    /**
     * If this is set to `true`, users will be able to pan the chart horizontally
     * by dragging plot area.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Panning} for more info
     */
    panX?: boolean;
    /**
     * If this is set to `true`, users will be able to pan the chart vertically
     * by dragging plot area.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Panning} for more info
     */
    panY?: boolean;
    /**
     * Indicates what happens when mouse wheel is spinned horizontally while over
     * plot area.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Mouse_wheel_behavior} for more info
     */
    wheelX?: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none";
    /**
     * Indicates what happens when mouse wheel is spinned vertically while over
     * plot area.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Mouse_wheel_behavior} for more info
     */
    wheelY?: "zoomX" | "zoomY" | "zoomXY" | "panX" | "panY" | "panXY" | "none";
    /**
     * Indicates the relative "speed" of the mouse wheel.
     *
     * @default 0.25
     */
    wheelStep?: number;
    /**
     * Chart's cursor.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/} for more info
     */
    cursor?: XYCursor;
    /**
     * If not set (default), cursor will show tooltips for all data items in the
     * same category/date.
     *
     * If set, cursor will select closest data item to pointer (mouse or touch) and
     * show tooltip for it.
     *
     * It will also show tooltips for all data items that are within X pixels
     * range (as set in `maxTooltipDistance`).
     *
     * Tooltips for data items farther then X pixels, will not be shown.
     *
     * NOTE: set it to `-1` to ensure only one tooltip is displayed, even if there
     * are multiple data items in the same place.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/#tooltips} for more info
     */
    maxTooltipDistance?: number;
    /**
     * Indicates how the distance should be measured when assessing distance
     * between tooltips as set in `maxTooltipDistance`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/#tooltips} for more info
     * @since 5.2.6
     */
    maxTooltipDistanceBy?: "xy" | "x" | "y";
    /**
     * If set to `false` the chart will not check for overlapping of multiple
     * tooltips, and will not arrange them to not overlap.
     *
     * Will work only if chart has an `XYCursor` enabled.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/#ooltips} for more info
     * @default true
     */
    arrangeTooltips?: boolean;
    /**
     * If set to `true`, using pinch gesture on the chart's plot area will zoom
     * chart horizontally.
     *
     * NOTE: this setting is not supported in a [[RadarChart]].
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Pinch_zoom} for more info
     * @since 5.1.8
     * @default false
     */
    pinchZoomX?: boolean;
    /**
     * If set to `true`, using pinch gesture on the chart's plot area will zoom
     * chart vertically.
     *
     * NOTE: this setting is not supported in a [[RadarChart]].
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Pinch_zoom} for more info
     * @since 5.1.8
     * @default false
     */
    pinchZoomY?: boolean;
    /**
     * If set, will use this relative position as a "center" for mouse wheel
     * horizontal zooming instead of actual cursor position.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Mouse_wheel_behavior} for more info
     * @since 5.2.11
     */
    wheelZoomPositionX?: number;
    /**
     * If set, will use this relative position as a "center" for mouse wheel
     * vertical zooming instead of actual cursor position.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Mouse_wheel_behavior} for more info
     * @since 5.2.11
     */
    wheelZoomPositionY?: number;
}
export interface IXYChartPrivate extends ISerialChartPrivate {
    /**
     * A list of [[Series]] that currently have their tooltip being displayed.
     */
    tooltipSeries?: Array<XYSeries>;
    /**
     * Array of other [[XYChart]] objects that cursors should be synced with.
     *
     * Note: cursors will be synced across the vertically stacked charts only.
     */
    otherCharts?: Array<XYChart>;
}
export interface IXYChartEvents extends ISerialChartEvents {
    /**
     * Invoked when panning starts.
     *
     * @since 5.0.4
     */
    panstarted: {
        originalEvent: IPointerEvent;
    };
    /**
     * Invoked when panning ends.
     *
     * @since 5.0.4
     */
    panended: {
        originalEvent: IPointerEvent;
    };
    /**
     * Invoked if pointer is pressed down on a chart and released without moving.
     *
     * `panended` event will still kick in after that.
     *
     * @since 5.2.19
     */
    pancancelled: {
        originalEvent: IPointerEvent;
    };
    /**
     * Invoked when wheel caused zoom ends.
     *
     * @since 5.0.4
     */
    wheelended: {};
}
/**
 * Creates an XY chart.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/} for more info
 * @important
 */
export declare class XYChart extends SerialChart {
    static className: string;
    static classNames: Array<string>;
    _settings: IXYChartSettings;
    _privateSettings: IXYChartPrivate;
    _seriesType: XYSeries;
    _events: IXYChartEvents;
    /**
     * A list of horizontal axes.
     */
    readonly xAxes: ListAutoDispose<Axis<AxisRenderer>>;
    /**
     * A list of vertical axes.
     */
    readonly yAxes: ListAutoDispose<Axis<AxisRenderer>>;
    /**
     * A [[Container]] located on top of the chart, used to store top horizontal
     * axes.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly topAxesContainer: Container;
    /**
     * A [[Container]] located in the middle the chart, used to store vertical axes
     * and plot area container.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly yAxesAndPlotContainer: Container;
    /**
     * A [[Container]] located on bottom of the chart, used to store bottom
     * horizontal axes.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly bottomAxesContainer: Container;
    /**
     * A [[Container]] located on left of the chart, used to store left-hand
     * vertical axes.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly leftAxesContainer: Container;
    /**
     * A [[Container]] located in the middle of the chart, used to store plotContainer and topPlotContainer
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly plotsContainer: Container;
    /**
     * A [[Container]] located in the middle of the chart, used to store actual
     * plots (series).
     *
     * NOTE: `plotContainer` will automatically have its `background` preset. If
     * you need to modify background or outline for chart's plot area, you can
     * use `plotContainer.get("background")` for that.*
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly plotContainer: Container;
    /**
     * A [[Container]] used for any elements that need to be displayed over
     * regular `plotContainer`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly topPlotContainer: Container;
    /**
     * A [[Container]] axis grid elements are stored in.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly gridContainer: Container;
    /**
     * A [[Container]] axis background grid elements are stored in.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly topGridContainer: Container;
    /**
     * A [[Container]] located on right of the chart, used to store right-hand
     * vertical axes.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/xy-chart-containers/} for more info
     * @default Container.new()
     */
    readonly rightAxesContainer: Container;
    /**
     * A [[Container]] axis headers are stored in.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-headers/} for more info
     * @default Container.new()
     */
    readonly axisHeadersContainer: Container;
    /**
     * A button that is shown when chart is not fully zoomed out.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/zoom-and-pan/#Zoom_out_button} for more info
     * @default Button.new()
     */
    readonly zoomOutButton: Button;
    _movePoint: IPoint;
    protected _wheelDp: IDisposer | undefined;
    _otherCharts?: Array<XYChart>;
    protected _movePoints: {
        [index: number]: IPoint;
    };
    protected _downStartX?: number;
    protected _downEndX?: number;
    protected _downStartY?: number;
    protected _downEndY?: number;
    protected _afterNew(): void;
    _beforeChanged(): void;
    protected _setUpTouch(): void;
    protected _maskGrid(): void;
    protected _removeSeries(series: this["_seriesType"]): void;
    /**
     * This method is invoked when mouse wheel is used over chart's plot
     * container, and handles zooming/pan.
     *
     * You can invoke this method manually, if you need to mimic chart's wheel
     * behavior over other elements of the chart.
     */
    handleWheel(event: {
        originalEvent: WheelEvent;
        point: IPoint;
        target: Container;
    }): void;
    protected _handleSetWheel(): void;
    protected _getWheelSign(axis: Axis<AxisRenderer>): number;
    protected _fixWheel(start: number, end: number): [number, number];
    protected _handlePlotDown(event: ISpritePointerEvent): void;
    protected _handleWheelAnimation(animation?: Animation<any>): void;
    protected _dispatchWheelAnimation(): void;
    protected _handlePlotUp(event: ISpritePointerEvent): void;
    protected _handlePlotMove(event: ISpritePointerEvent): void;
    protected _handlePinch(): void;
    _handleCursorPosition(): void;
    _updateCursor(): void;
    protected _addCursor(cursor: XYCursor): void;
    _prepareChildren(): void;
    protected _processSeries(series: this["_seriesType"]): void;
    protected _colorize(series: this["_seriesType"]): void;
    protected _handleCursorSelectEnd(): void;
    protected _handleScrollbar(axes: ListAutoDispose<Axis<any>>, start: number, end: number, priority?: "start" | "end"): void;
    protected _processAxis<R extends AxisRenderer>(axes: ListAutoDispose<Axis<R>>, container: Container): IDisposer;
    protected _removeAxis(axis: Axis<AxisRenderer>): void;
    _updateChartLayout(): void;
    /**
     * @ignore
     */
    processAxis(axis: Axis<AxisRenderer>): void;
    _handleAxisSelection(axis: Axis<any>, force?: boolean): void;
    protected _handleZoomOut(): void;
    /**
     * Checks if point is within plot area.
     *
     * @param   point  Reference point
     * @return         Is within plot area?
     */
    inPlot(point: IPoint): boolean;
    /**
     * @ignore
     */
    arrangeTooltips(): void;
    protected _tooltipToLocal(point: IPoint): IPoint;
    /**
     * Fully zooms out the chart.
     */
    zoomOut(): void;
}
//# sourceMappingURL=XYChart.d.ts.map