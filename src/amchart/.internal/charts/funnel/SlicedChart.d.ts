import { PercentChart, IPercentChartPrivate, IPercentChartSettings } from "../percent/PercentChart";
import type { PercentSeries } from "../percent/PercentSeries";
export interface ISlicedChartSettings extends IPercentChartSettings {
}
export interface ISlicedChartPrivate extends IPercentChartPrivate {
}
/**
 * Creates a sliced chart for use with [[FunnelSeries]], [[PyramidSeries]], or [[PictorialStackedSeries]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/} for more info
 * @important
 */
export declare class SlicedChart extends PercentChart {
    protected _afterNew(): void;
    static className: string;
    static classNames: Array<string>;
    _settings: ISlicedChartSettings;
    _privateSettings: ISlicedChartPrivate;
    _seriesType: PercentSeries;
}
//# sourceMappingURL=SlicedChart.d.ts.map