import { Candlestick, ICandlestickSettings, ICandlestickPrivate } from "./Candlestick";
export interface IOHLCSettings extends ICandlestickSettings {
}
export interface IOHLCPrivate extends ICandlestickPrivate {
}
export declare class OHLC extends Candlestick {
    _settings: IOHLCSettings;
    _privateSettings: IOHLCPrivate;
    static className: string;
    static classNames: Array<string>;
    _draw(): void;
}
//# sourceMappingURL=OHLC.d.ts.map