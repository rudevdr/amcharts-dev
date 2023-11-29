import type { IIndicatorEditableSetting } from "./Indicator";
import type { XYSeries } from "../../xy/series/XYSeries";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IChaikinMoneyFlowSettings extends IChartIndicatorSettings {
    /**
     * Main volume series of the [[StockChart]].
     */
    volumeSeries: XYSeries;
}
export interface IChaikinMoneyFlowPrivate extends IChartIndicatorPrivate {
}
export interface IChaikinMoneyFlowEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class ChaikinMoneyFlow extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IChaikinMoneyFlowSettings;
    _privateSettings: IChaikinMoneyFlowPrivate;
    _events: IChaikinMoneyFlowEvents;
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
//# sourceMappingURL=ChaikinMoneyFlow.d.ts.map