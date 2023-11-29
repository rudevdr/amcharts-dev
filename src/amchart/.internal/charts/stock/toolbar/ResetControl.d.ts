import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
export interface IResetControlSettings extends IStockControlSettings {
}
export interface IResetControlPrivate extends IStockControlPrivate {
}
export interface IResetControlEvents extends IStockControlEvents {
}
/**
 * Reset control.
 *
 * Removes all drawings and indicators when clicked.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/reset-control/} for more info
 */
export declare class ResetControl extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IResetControlSettings;
    _privateSettings: IResetControlPrivate;
    _events: IResetControlEvents;
    protected _afterNew(): void;
    protected _getDefaultIcon(): SVGElement;
}
//# sourceMappingURL=ResetControl.d.ts.map