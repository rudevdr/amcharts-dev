import type { Axis } from "../axes/Axis";
import type { AxisRenderer } from "../axes/AxisRenderer";
import { XYSeries, IXYSeriesPrivate, IXYSeriesSettings, IXYSeriesDataItem, IXYSeriesAxisRange } from "./XYSeries";
import { Graphics } from "../../../core/render/Graphics";
import { CurveFactory } from "d3-shape";
import { Template } from "../../../core/util/Template";
import { ListTemplate } from "../../../core/util/List";
import { DataItem } from "../../../core/render/Component";
export interface IPointOptions {
}
export interface ILineSeriesDataItem extends IXYSeriesDataItem {
}
export interface ILineSeriesSettings extends IXYSeriesSettings {
    /**
     * If set to `true` the line will connect over "gaps" - categories or time
     * intervals with no data.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/#Gaps} for more info
     * @default true
     */
    connect?: boolean;
    /**
     * If there are more than `autoGapCount` base time intervals (e.g. days) with
     * no data, the line will break and will display gap.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/#Auto_gaps_with_dates} for more info
     * @default 1.1
     */
    autoGapCount?: number;
    /**
     * @ignore
     */
    curveFactory?: CurveFactory;
    /**
     * Allows simplifying the line with many points.
     *
     * If set, the series will skip points that are closer than X pixels to each
     * other.
     *
     * With many data points, this allows having smoother, less cluttered lines.
     *
     * @default 0
     * @since 5.2.7
     */
    minDistance?: number;
}
export interface ILineSeriesPrivate extends IXYSeriesPrivate {
}
/**
 * Interface representing a [[LineSeries]] axis range.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/axes/axis-ranges/#Series_axis_ranges} for more info
 */
export interface ILineSeriesAxisRange extends IXYSeriesAxisRange {
    /**
     * A list template to use when applying line settings to the line segments covered
     * by an axis range.
     */
    strokes?: ListTemplate<Graphics>;
    /**
     * A list template to use when applying fill settings to the fill segments covered
     * by an axis range.
     */
    fills?: ListTemplate<Graphics>;
}
/**
 * Used to plot line and/or area series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/line-series/} for more info
 * @important
 */
export declare class LineSeries extends XYSeries {
    _settings: ILineSeriesSettings;
    _privateSettings: ILineSeriesPrivate;
    _dataItemSettings: ILineSeriesDataItem;
    _axisRangeType: ILineSeriesAxisRange;
    static className: string;
    static classNames: Array<string>;
    protected _endIndex: number;
    protected _strokeGenerator: import("d3-shape").Line<[number, number]>;
    protected _fillGenerator: import("d3-shape").Area<[number, number]>;
    protected _legendStroke?: Graphics;
    protected _legendFill?: Graphics;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    makeStroke(strokes: ListTemplate<Graphics>): Graphics;
    /**
     * A [[TemplateList]] of all line segments in series.
     *
     * `strokes.template` can be used to set default settings for all line
     * segments, or to change on existing ones.
     *
     * @default new ListTemplate<Graphics>
     */
    readonly strokes: ListTemplate<Graphics>;
    /**
     * @ignore
     */
    makeFill(fills: ListTemplate<Graphics>): Graphics;
    /**
     * A [[TemplateList]] of all segment fills in series.
     *
     * `fills.template` can be used to set default settings for all segment
     * fills, or to change on existing ones.
     *
     * @default new ListTemplate<Graphics>
     */
    readonly fills: ListTemplate<Graphics>;
    protected _fillTemplate: Template<Graphics> | undefined;
    protected _strokeTemplate: Template<Graphics> | undefined;
    protected _previousPoint: Array<number>;
    protected _dindex: number;
    protected _sindex: number;
    _updateChildren(): void;
    protected _clearGraphics(): void;
    protected _startSegment(dataItemIndex: number): void;
    protected _getPoints(dataItem: DataItem<this["_dataItemSettings"]>, o: {
        points: Array<Array<number>>;
        segments: number[][][];
        stacked: boolean | undefined;
        getOpen: boolean;
        basePosX: number;
        basePosY: number;
        fillVisible: boolean | undefined;
        xField: string;
        yField: string;
        xOpenField: string;
        yOpenField: string;
        vcx: number;
        vcy: number;
        baseAxis: Axis<AxisRenderer>;
        xAxis: Axis<AxisRenderer>;
        yAxis: Axis<AxisRenderer>;
        locationX: number;
        locationY: number;
        openLocationX: number;
        openLocationY: number;
        minDistance: number;
    }): void;
    protected _endLine(_points: Array<Array<number>>, _firstPoint: Array<number>): void;
    protected _drawStroke(graphics: Graphics, segments: number[][][]): void;
    protected _drawFill(graphics: Graphics, segments: number[][][]): void;
    protected _processAxisRange(axisRange: this["_axisRangeType"]): void;
    /**
     * @ignore
     */
    createLegendMarker(_dataItem?: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=LineSeries.d.ts.map