import type { IIndicatorEditableSetting } from "./Indicator";
import type { XYSeries } from "../../xy/series/XYSeries";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IAccumulationDistributionSettings extends IChartIndicatorSettings {
    /**
     * Main volume series of the [[StockChart]].
     */
    volumeSeries?: XYSeries;
    /**
     * Use volume series (if set)?
     */
    useVolume?: boolean;
}
export interface IAccumulationDistributionPrivate extends IChartIndicatorPrivate {
}
export interface IAccumulationDistributionEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class AccumulationDistribution extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IAccumulationDistributionSettings;
    _privateSettings: IAccumulationDistributionPrivate;
    _events: IAccumulationDistributionEvents;
    /**
     * Indicator series.
     */
    series: LineSeries;
    _editableSettings: IIndicatorEditableSetting[];
    _afterNew(): void;
    _createSeries(): LineSeries;
    _prepareChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=AccumulationDistribution.d.ts.map