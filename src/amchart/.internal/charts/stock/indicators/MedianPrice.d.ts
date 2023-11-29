import type { IIndicatorEditableSetting } from "./Indicator";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IMedianPriceSettings extends IChartIndicatorSettings {
}
export interface IMedianPricePrivate extends IChartIndicatorPrivate {
}
export interface IMedianPriceEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class MedianPrice extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IMedianPriceSettings;
    _privateSettings: IMedianPricePrivate;
    _events: IMedianPriceEvents;
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
//# sourceMappingURL=MedianPrice.d.ts.map