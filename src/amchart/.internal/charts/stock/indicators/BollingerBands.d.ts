import type { IIndicatorEditableSetting } from "./Indicator";
import type { Color } from "../../../core/util/Color";
import { MovingAverage, IMovingAverageSettings, IMovingAveragePrivate, IMovingAverageEvents } from "./MovingAverage";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IBollingerBandsSettings extends IMovingAverageSettings {
    /**
     * A value of standard deviations.
     */
    standardDeviations?: number;
    /**
     * A color for upper section.
     */
    upperColor?: Color;
    /**
     * A color for lower section.
     */
    lowerColor?: Color;
}
export interface IBollingerBandsPrivate extends IMovingAveragePrivate {
}
export interface IBollingerBandsEvents extends IMovingAverageEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class BollingerBands extends MovingAverage {
    static className: string;
    static classNames: Array<string>;
    _settings: IBollingerBandsSettings;
    _privateSettings: IBollingerBandsPrivate;
    _events: IBollingerBandsEvents;
    /**
     * Indicator series for the upper band.
     */
    upperBandSeries: LineSeries;
    /**
     * Indicator series for the lower band.
     */
    lowerBandSeries: LineSeries;
    _editableSettings: IIndicatorEditableSetting[];
    protected _afterNew(): void;
    _prepareChildren(): void;
    _updateChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
    protected _dispose(): void;
    hide(duration?: number): Promise<any>;
    show(duration?: number): Promise<any>;
}
//# sourceMappingURL=BollingerBands.d.ts.map