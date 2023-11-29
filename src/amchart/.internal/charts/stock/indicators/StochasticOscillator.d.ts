import type { Color } from "../../../core/util/Color";
import { OverboughtOversold, IOverboughtOversoldSettings, IOverboughtOversoldPrivate, IOverboughtOversoldEvents } from "./OverboughtOversold";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IStochasticOscillatorSettings extends IOverboughtOversoldSettings {
    /**
     * A color for "slow" section.
     */
    slowColor?: Color;
    /**
     * Smoothing "k" parameter.
     */
    kSmoothing?: number;
    /**
     * Smoothing "d" parameter.
     */
    dSmoothing?: number;
}
export interface IStochasticOscillatorPrivate extends IOverboughtOversoldPrivate {
}
export interface IStochasticOscillatorEvents extends IOverboughtOversoldEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class StochasticOscillator extends OverboughtOversold {
    static className: string;
    static classNames: Array<string>;
    _settings: IStochasticOscillatorSettings;
    _privateSettings: IStochasticOscillatorPrivate;
    _events: IStochasticOscillatorEvents;
    /**
     * Indicator series.
     */
    slowSeries: LineSeries;
    protected _afterNew(): void;
    _updateChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=StochasticOscillator.d.ts.map