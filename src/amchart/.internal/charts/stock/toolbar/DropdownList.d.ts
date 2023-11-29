import { Dropdown, IDropdownSettings, IDropdownPrivate, IDropdownEvents } from "./Dropdown";
export interface IDropdownListItem {
    id: string;
    label: string;
    subLabel?: string;
    className?: string;
    icon?: SVGElement;
    form?: "radio" | "checkbox";
    value?: string;
    checked?: boolean;
    options?: IDropdownListItem[];
    disabled?: boolean;
}
export interface IDropdownListSettings extends IDropdownSettings {
    items?: IDropdownListItem[];
    maxSearchItems?: number;
    searchable?: boolean;
    searchCallback?: (query: string) => Promise<IDropdownListItem[]>;
}
export interface IDropdownListPrivate extends IDropdownPrivate {
    list?: HTMLUListElement;
    search?: HTMLDivElement;
    currentId?: string;
}
export interface IDropdownListEvents extends IDropdownEvents {
    invoked: {
        item: IDropdownListItem;
    };
    changed: {
        item: IDropdownListItem;
        value: string | boolean;
    };
}
/**
 * A dropdown control for [[StockToolbar]].
 */
export declare class DropdownList extends Dropdown {
    static className: string;
    static classNames: Array<string>;
    _settings: IDropdownListSettings;
    _privateSettings: IDropdownListPrivate;
    _events: IDropdownListEvents;
    protected _afterNew(): void;
    protected _initElements(): void;
    protected _sizeItems(): void;
    protected _initItems(items?: IDropdownListItem[]): void;
    protected _initSearch(): void;
    _beforeChanged(): void;
    protected _dispose(): void;
    protected _filterItems(search?: string): Promise<void>;
    addItem(info: IDropdownListItem): void;
    hide(): void;
}
//# sourceMappingURL=DropdownList.d.ts.map