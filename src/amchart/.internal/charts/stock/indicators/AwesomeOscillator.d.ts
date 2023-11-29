import type { IIndicatorEditableSetting } from "./Indicator";
import { Color } from "../../../core/util/Color";
import { ChartIndicator, IChartIndicatorSettings, IChartIndicatorPrivate, IChartIndicatorEvents } from "./ChartIndicator";
import { ColumnSeries } from "../../xy/series/ColumnSeries";
export interface IAwesomeOscillatorSettings extends IChartIndicatorSettings {
    /**
     * Increasing color.
     */
    increasingColor?: Color;
    /**
     * Decreasing color.
     */
    decreasingColor?: Color;
}
export interface IAwesomeOscillatorPrivate extends IChartIndicatorPrivate {
}
export interface IAwesomeOscillatorEvents extends IChartIndicatorEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class AwesomeOscillator extends ChartIndicator {
    static className: string;
    static classNames: Array<string>;
    _settings: IAwesomeOscillatorSettings;
    _privateSettings: IAwesomeOscillatorPrivate;
    _events: IAwesomeOscillatorEvents;
    /**
     * Indicator series.
     */
    series: ColumnSeries;
    _editableSettings: IIndicatorEditableSetting[];
    _afterNew(): void;
    _createSeries(): ColumnSeries;
    _updateChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=AwesomeOscillator.d.ts.map