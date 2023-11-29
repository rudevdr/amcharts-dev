import { OverboughtOversold, IOverboughtOversoldSettings, IOverboughtOversoldPrivate, IOverboughtOversoldEvents } from "./OverboughtOversold";
import { LineSeries } from "../../xy/series/LineSeries";
import type { Color } from "../../../core/util/Color";
export interface IRelativeStrengthIndexSettings extends IOverboughtOversoldSettings {
    /**
     * EMA period.
     */
    smaPeriod?: number;
    /**
     * A color for "ema" line.
     */
    smaColor?: Color;
}
export interface IRelativeStrengthIndexPrivate extends IOverboughtOversoldPrivate {
}
export interface IRelativeStrengthIndexEvents extends IOverboughtOversoldEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class RelativeStrengthIndex extends OverboughtOversold {
    static className: string;
    static classNames: Array<string>;
    _settings: IRelativeStrengthIndexSettings;
    _privateSettings: IRelativeStrengthIndexPrivate;
    _events: IRelativeStrengthIndexEvents;
    /**
     * Indicator series.
     */
    smaSeries: LineSeries;
    protected _afterNew(): void;
    _updateChildren(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=RelativeStrengthIndex.d.ts.map