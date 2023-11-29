import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { Dropdown } from "./Dropdown";
export interface IDropdownControlSettings extends IStockControlSettings {
    fixedLabel?: boolean;
    scrollable?: boolean;
    html?: string;
}
export interface IDropdownControlPrivate extends IStockControlPrivate {
    dropdown?: Dropdown;
    container?: HTMLDivElement;
}
export interface IDropdownControlEvents extends IStockControlEvents {
}
/**
 * A generic control which creates a searchable list of items in a dropdown.
 *
 * Can be used in a [[StockToolbar]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/dropdown-list-control/} for more info
 */
export declare class DropdownControl extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IDropdownControlSettings;
    _privateSettings: IDropdownControlPrivate;
    _events: IDropdownControlEvents;
    protected _afterNew(): void;
    _beforeChanged(): void;
    protected _initElements(): void;
    protected _dispose(): void;
}
//# sourceMappingURL=DropdownControl.d.ts.map