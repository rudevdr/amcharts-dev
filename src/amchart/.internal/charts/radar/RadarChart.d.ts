import type { AxisRendererCircular } from "./AxisRendererCircular";
import type { AxisRendererRadial } from "./AxisRendererRadial";
import type { Axis } from "../xy/axes/Axis";
import type { RadarCursor } from "./RadarCursor";
import type { RadarColumnSeries } from "./RadarColumnSeries";
import type { RadarLineSeries } from "./RadarLineSeries";
import type { IPoint } from "../../core/util/IPoint";
import { XYChart, IXYChartPrivate, IXYChartSettings } from "../xy/XYChart";
import { Percent } from "../../core/util/Percent";
import { Container } from "../../core/render/Container";
export interface IRadarChartSettings extends IXYChartSettings {
    /**
     * Outer radius of the chart. Can be set in pixels or percent, relative to
     * available space.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/#Chart_radius} for more info
     * @default 80%
     */
    radius?: number | Percent;
    /**
     * Inner radius of the chart. Can be set in pixels or percent, relative to
     * outer radius.
     *
     * Setting to negative number will mean pixels from outer radius.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/#Chart_radius} for more info
     */
    innerRadius?: number | Percent;
    /**
     * Chart start angle in degress.
     *
     * @default -90
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/#Start_end_angles} for more info
     */
    startAngle?: number;
    /**
     * Chart end angle in degress.
     *
     * @default 270
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/#Start_end_angles} for more info
     */
    endAngle?: number;
    /**
     * [[RadarCursor]] instance.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/#Cursor} for more info
     */
    cursor?: RadarCursor;
}
export interface IRadarChartPrivate extends IXYChartPrivate {
    /**
     * Radius in pixels.
     */
    radius?: number;
    /**
     * Inner radius in pixels.
     */
    innerRadius?: number;
    /**
     * @ignore
     */
    irModifyer?: number;
}
/**
 * Radar chart.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/} for more info
 * @important
 */
export declare class RadarChart extends XYChart {
    /**
     * [[Container]] where radar-related elements go.
     *
     * @default Container.new()
     */
    readonly radarContainer: Container;
    static className: string;
    static classNames: Array<string>;
    _settings: IRadarChartSettings;
    _privateSettings: IRadarChartPrivate;
    protected _arcGenerator: import("d3-shape").Arc<any, import("d3-shape").DefaultArcObject>;
    _seriesType: RadarColumnSeries | RadarLineSeries;
    protected _maxRadius: number;
    protected _afterNew(): void;
    protected _maskGrid(): void;
    _prepareChildren(): void;
    protected _addCursor(cursor: RadarCursor): void;
    _updateRadius(): void;
    /**
     * @ignore
     */
    _updateMask(container: Container, innerRadius: number, radius: number): void;
    /**
     * @ignore
     */
    processAxis(axis: Axis<AxisRendererRadial | AxisRendererCircular>): void;
    /**
     * @ignore
     */
    inPlot(point: IPoint, radius?: number, innerRadius?: number): boolean;
    protected _tooltipToLocal(point: IPoint): IPoint;
    protected _handlePinch(): void;
}
//# sourceMappingURL=RadarChart.d.ts.map