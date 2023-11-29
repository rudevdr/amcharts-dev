import type { IIndicatorEditableSetting } from "./Indicator";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IMomentumSettings extends IChartIndicatorSettings {
}
export interface IMomentumPrivate extends IChartIndicatorPrivate {
}
export interface IMomentumEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 * @since 5.4.8
 */
export declare class Momentum extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IMomentumSettings;
    _privateSettings: IMomentumPrivate;
    _events: IMomentumEvents;
    /**
     * Indicator series.
     */
    series: LineSeries;
    _editableSettings: IIndicatorEditableSetting[];
    _afterNew(): void;
    _createSeries(): LineSeries;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=Momentum.d.ts.map