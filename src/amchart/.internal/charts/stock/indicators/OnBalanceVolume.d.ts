import type { IIndicatorEditableSetting } from "./Indicator";
import type { XYSeries } from "../../xy/series/XYSeries";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IOnBalanceVolumeSettings extends IChartIndicatorSettings {
    /**
     * Chart's main volume series.
     */
    volumeSeries: XYSeries;
}
export interface IOnBalanceVolumePrivate extends IChartIndicatorPrivate {
}
export interface IOnBalanceVolumeEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class OnBalanceVolume extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IOnBalanceVolumeSettings;
    _privateSettings: IOnBalanceVolumePrivate;
    _events: IOnBalanceVolumeEvents;
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
//# sourceMappingURL=OnBalanceVolume.d.ts.map