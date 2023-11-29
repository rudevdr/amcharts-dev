import type { IIndicatorEditableSetting } from "./Indicator";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface ITypicalPriceSettings extends IChartIndicatorSettings {
}
export interface ITypicalPricePrivate extends IChartIndicatorPrivate {
}
export interface ITypicalPriceEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class TypicalPrice extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: ITypicalPriceSettings;
    _privateSettings: ITypicalPricePrivate;
    _events: ITypicalPriceEvents;
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
//# sourceMappingURL=TypicalPrice.d.ts.map