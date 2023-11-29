import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { DropdownList, IDropdownListItem } from "./DropdownList";
export interface IDropdownListControlSettings extends IStockControlSettings {
    currentItem?: string | IDropdownListItem;
    fixedLabel?: boolean;
    items?: Array<string | IDropdownListItem>;
    scrollable?: boolean;
    maxSearchItems?: number;
    searchable?: boolean;
    searchCallback?: (query: string) => IDropdownListItem[];
}
export interface IDropdownListControlPrivate extends IStockControlPrivate {
    dropdown?: DropdownList;
}
export interface IDropdownListControlEvents extends IStockControlEvents {
    selected: {
        item: string | IDropdownListItem;
    };
}
/**
 * A generic control which creates a searchable list of items in a dropdown.
 *
 * Can be used in a [[StockToolbar]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/dropdown-list-control/} for more info
 */
export declare class DropdownListControl extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IDropdownListControlSettings;
    _privateSettings: IDropdownListControlPrivate;
    _events: IDropdownListControlEvents;
    protected _afterNew(): void;
    protected _initElements(): void;
    setItem(item: string | IDropdownListItem): void;
    _beforeChanged(): void;
    protected _dispose(): void;
}
//# sourceMappingURL=DropdownListControl.d.ts.map