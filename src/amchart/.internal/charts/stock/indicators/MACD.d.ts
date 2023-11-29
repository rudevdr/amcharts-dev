import type { IIndicatorEditableSetting } from "./Indicator";
import { Color } from "../../../core/util/Color";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import { ColumnSeries } from "../../xy/series/ColumnSeries";
export interface IMACDSettings extends IChartIndicatorSettings {
    /**
     * Increasing color.
     */
    increasingColor?: Color;
    /**
     * Decreasing color.
     */
    decreasingColor?: Color;
    /**
     * Signal color.
     */
    signalColor?: Color;
    /**
     * A value for "fast" period.
     */
    fastPeriod?: number;
    /**
     * A value for "slow" period.
     */
    slowPeriod?: number;
    /**
     * A value for "signal" period.
     */
    signalPeriod?: number;
}
export interface IMACDPrivate extends IChartIndicatorPrivate {
}
export interface IMACDEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class MACD extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IMACDSettings;
    _privateSettings: IMACDPrivate;
    _events: IMACDEvents;
    /**
     * Indicator series.
     */
    series: LineSeries;
    /**
     * Indicator series for the signal.
     */
    signalSeries: LineSeries;
    /**
     * Indicator series for the difference.
     */
    differenceSeries: ColumnSeries;
    _editableSettings: IIndicatorEditableSetting[];
    _createSeries(): LineSeries;
    protected _afterNew(): void;
    _prepareChildren(): void;
    _updateChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=MACD.d.ts.map