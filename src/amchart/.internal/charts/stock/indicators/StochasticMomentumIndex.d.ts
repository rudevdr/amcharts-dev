import type { Color } from "../../../core/util/Color";
import { OverboughtOversold, IOverboughtOversoldSettings, IOverboughtOversoldPrivate, IOverboughtOversoldEvents } from "./OverboughtOversold";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IStochasticMomentumIndexSettings extends IOverboughtOversoldSettings {
    /**
     * A color for "ema" line.
     */
    emaColor?: Color;
    /**
     * K period.
     */
    kPeriod?: number;
    /**
     * D period.
     */
    dPeriod?: number;
    /**
     * EMA period.
     */
    emaPeriod?: number;
}
export interface IStochasticMomentumIndexPrivate extends IOverboughtOversoldPrivate {
}
export interface IStochasticMomentumIndexEvents extends IOverboughtOversoldEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @since 5.5.3
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class StochasticMomentumIndex extends OverboughtOversold {
    static className: string;
    static classNames: Array<string>;
    _settings: IStochasticMomentumIndexSettings;
    _privateSettings: IStochasticMomentumIndexPrivate;
    _events: IStochasticMomentumIndexEvents;
    /**
     * Indicator series.
     */
    emaSeries: LineSeries;
    protected _afterNew(): void;
    _updateChildren(): void;
    /**
     * @ignore
     * https://www.barchart.com/education/technical-indicators/stochastic_momentum_index
     */
    prepareData(): void;
}
//# sourceMappingURL=StochasticMomentumIndex.d.ts.map