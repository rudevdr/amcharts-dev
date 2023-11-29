import { OverboughtOversold, IOverboughtOversoldSettings, IOverboughtOversoldPrivate, IOverboughtOversoldEvents } from "./OverboughtOversold";
export interface ICommodityChannelIndexSettings extends IOverboughtOversoldSettings {
}
export interface ICommodityChannelIndexPrivate extends IOverboughtOversoldPrivate {
}
export interface ICommodityChannelIndexEvents extends IOverboughtOversoldEvents {
}
/**
 * An implementation of a [[StockChart]] indicator.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare class CommodityChannelIndex extends OverboughtOversold {
    static className: string;
    static classNames: Array<string>;
    _settings: ICommodityChannelIndexSettings;
    _privateSettings: ICommodityChannelIndexPrivate;
    _events: ICommodityChannelIndexEvents;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    prepareData(): void;
}
//# sourceMappingURL=CommodityChannelIndex.d.ts.map