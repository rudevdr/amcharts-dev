import type { StockLegend } from "../StockLegend";
import { Indicator } from "../indicators/Indicator";
import { DropdownListControl, IDropdownListControlSettings, IDropdownListControlPrivate, IDropdownListControlEvents } from "./DropdownListControl";
import type { DropdownList, IDropdownListItem } from "./DropdownList";
export declare type Indicators = "Accumulation Distribution" | "Accumulative Swing Index" | "Aroon" | "Awesome Oscillator" | "Bollinger Bands" | "Chaikin Money Flow" | "Chaikin Oscillator" | "Commodity Channel Index" | "Disparity Index" | "MACD" | "Momentum" | "Moving Average" | "Moving Average Deviation" | "Moving Average Envelope" | "On Balance Volume" | "Relative Strength Index" | "Standard Deviation" | "Stochastic Oscillator" | "Stochastic Momentum Index" | "Trix" | "Typical Price" | "Volume" | "VWAP" | "Williams R" | "Median Price" | "ZigZag";
export interface IIndicator {
    id: string;
    name: string;
    callback: () => Indicator;
}
export interface IIndicatorControlSettings extends IDropdownListControlSettings {
    indicators?: Array<Indicators | IIndicator>;
    legend?: StockLegend;
}
export interface IIndicatorControlPrivate extends IDropdownListControlPrivate {
    /**
     * Here for backwards compatiblity befor [[IndicatorControl]] was
     * migrated to extend [[DropdownListControl]].
     *
     * @ignore
     */
    list?: DropdownList;
}
export interface IIndicatorControlEvents extends IDropdownListControlEvents {
    selected: {
        item: string | IDropdownListItem;
        indicator: Indicator | IIndicator;
    };
}
/**
 * A [[StockToolbar]] control for adding indicators to a [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/indicator-control/} for more info
 */
export declare class IndicatorControl extends DropdownListControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IIndicatorControlSettings;
    _privateSettings: IIndicatorControlPrivate;
    _events: IIndicatorControlEvents;
    protected _afterNew(): void;
    protected _initList(): void;
    /**
     * Returns `true` if the indicator is supported in current chart setup.
     *
     * @param   indicatorId  Indicator ID
     * @return               Supported?
     */
    supportsIndicator(indicatorId: Indicators): boolean;
    protected _getDefaultIcon(): SVGElement;
    _beforeChanged(): void;
    /**
     * Creates a specific indicator, adds it to chart, and returns the instance.
     *
     * @param   indicatorId  Indicator ID
     * @return               Indicator instance
     */
    addIndicator(indicatorId: Indicators): Indicator | undefined;
    /**
     * Serializes all available indicators into an array of simple objects or
     * JSON.
     *
     * `output` parameter can either be `"object"` or `"string"` (default).
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/serializing-indicators-annotations/} for more info
     * @since 5.3.0
     * @param   output Output format
     * @param   indent Line indent in JSON
     * @return         Serialized indicators
     */
    serializeIndicators(output?: "object" | "string", indent?: string): Array<unknown> | string;
    /**
     * Parses data serialized with `serializeIndicators()` and adds indicators to
     * the chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/stock/serializing-indicators-annotations/} for more info
     * @since 5.3.0
     * @param  data Serialized data
     */
    unserializeIndicators(data: string | Array<any>): void;
}
//# sourceMappingURL=IndicatorControl.d.ts.map