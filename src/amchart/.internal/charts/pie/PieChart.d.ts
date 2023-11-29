import type { PieSeries } from "./PieSeries";
import { Percent } from "../../core/util/Percent";
import { PercentChart, IPercentChartPrivate, IPercentChartSettings } from "../percent/PercentChart";
export interface IPieChartSettings extends IPercentChartSettings {
    /**
     * Outer radius of the pie chart.
     *
     * Can be set in fixed pixel value, or relative to chart container size in
     * percent.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Pie_radius} for more info
     * @default 80%
     */
    radius?: number | Percent;
    /**
     * Inner radius of the pie chart. Setting to any non-zero value will result
     * in a donut chart.
     *
     * Can be set in fixed pixel value, or relative to chart container size in
     * percent.
     *
     * Setting to negative number will mean pixels from outer radius.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Pie_radius} for more info
     */
    innerRadius?: number | Percent;
    /**
     * A start angle of the chart in degrees.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Start_end_angles} for more info
     * @default -90
     */
    startAngle?: number;
    /**
     * An end angle of the chart in degrees.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Start_end_angles} for more info
     * @default 270
     */
    endAngle?: number;
}
export interface IPieChartPrivate extends IPercentChartPrivate {
    /**
     * @ignore
     */
    irModifyer?: number;
}
/**
 * Creates a pie chart.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/} for more info
 * @important
 */
export declare class PieChart extends PercentChart {
    static className: string;
    static classNames: Array<string>;
    _settings: IPieChartSettings;
    _privateSettings: IPieChartPrivate;
    _seriesType: PieSeries;
    _maxRadius: number;
    protected _afterNew(): void;
    _prepareChildren(): void;
    /**
     * Returns outer radius in pixels.
     *
     * If optional series parameter is passed in, it will return outer radius
     * of that particular series.
     *
     * @param   series  Series
     * @return          Radius in pixels
     */
    radius(series?: PieSeries): number;
    /**
     * Returns inner radius in pixels.
     *
     * If optional series parameter is passed in, it will return inner radius
     * of that particular series.
     *
     * @param   series  Series
     * @return          Radius in pixels
     */
    innerRadius(series?: PieSeries): number;
}
//# sourceMappingURL=PieChart.d.ts.map