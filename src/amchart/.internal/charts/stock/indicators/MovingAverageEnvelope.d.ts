import type { IIndicatorEditableSetting } from "./Indicator";
import type { Color } from "../../../core/util/Color";
import { MovingAverage, IMovingAverageSettings, IMovingAveragePrivate, IMovingAverageEvents } from "./MovingAverage";
import { LineSeries } from "../../xy/series/LineSeries";
export interface IMovingAverageEnvelopeSettings extends IMovingAverageSettings {
    /**
     * Shift.
     *
     * @default 5
     */
    shift?: number;
    /**
     * Type of the shift.
     *
     * @default "percent"
     */
    shiftType?: "percent" | "points";
    /**
     * A color for upper section.
     */
    upperColor?: Color;
    /**
     *  A color for lower section.
     */
    lowerColor?: Color;
}
export interface IMovingAverageEnvelopePrivate extends IMovingAveragePrivate {
}
export interface IMovingAverageEnvelopeEvents extends IMovingAverageEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class MovingAverageEnvelope extends MovingAverage {
    static className: string;
    static classNames: Array<string>;
    _settings: IMovingAverageEnvelopeSettings;
    _privateSettings: IMovingAverageEnvelopePrivate;
    _events: IMovingAverageEnvelopeEvents;
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
    _updateChildren(): void;
    _prepareChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
    protected _dispose(): void;
    hide(duration?: number): Promise<any>;
    show(duration?: number): Promise<any>;
}
//# sourceMappingURL=MovingAverageEnvelope.d.ts.map