import type { IIndicatorEditableSetting } from "./Indicator";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { LineSeries } from "../../xy/series/LineSeries";
import type { Color } from "../../../core/util/Color";
export interface ITrixSettings extends IChartIndicatorSettings {
    /**
     * Signal color.
     */
    signalColor?: Color;
    /**
     * A value for "signal" period.
     */
    signalPeriod?: number;
}
export interface ITrixPrivate extends IChartIndicatorPrivate {
}
export interface ITrixEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class Trix extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: ITrixSettings;
    _privateSettings: ITrixPrivate;
    _events: ITrixEvents;
    /**
     * Indicator series.
     */
    series: LineSeries;
    /**
     * Indicator series for the signal.
     */
    signalSeries: LineSeries;
    _editableSettings: IIndicatorEditableSetting[];
    protected _themeTag: string;
    _createSeries(): LineSeries;
    protected _afterNew(): void;
    _prepareChildren(): void;
    _updateChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=Trix.d.ts.map