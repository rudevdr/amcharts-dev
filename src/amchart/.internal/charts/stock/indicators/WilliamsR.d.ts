import { OverboughtOversold, IOverboughtOversoldSettings, IOverboughtOversoldPrivate, IOverboughtOversoldEvents } from "./OverboughtOversold";
export interface IWilliamsRSettings extends IOverboughtOversoldSettings {
}
export interface IWilliamsRPrivate extends IOverboughtOversoldPrivate {
}
export interface IWilliamsREvents extends IOverboughtOversoldEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class WilliamsR extends OverboughtOversold {
    static className: string;
    static classNames: Array<string>;
    _settings: IWilliamsRSettings;
    _privateSettings: IWilliamsRPrivate;
    _events: IWilliamsREvents;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=WilliamsR.d.ts.map