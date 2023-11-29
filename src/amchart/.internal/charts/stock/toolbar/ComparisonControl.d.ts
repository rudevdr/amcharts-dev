import type { IDropdownListItem } from "./DropdownList";
import { DropdownListControl, IDropdownListControlSettings, IDropdownListControlPrivate, IDropdownListControlEvents } from "./DropdownListControl";
export interface IComparisonControlSettings extends IDropdownListControlSettings {
    items?: Array<string | IDropdownListItem>;
}
export interface IComparisonControlPrivate extends IDropdownListControlPrivate {
}
export interface IComparisonControlEvents extends IDropdownListControlEvents {
}
/**
 * A control that is used to change type of the main series of the [[StockChart]].
 */
export declare class ComparisonControl extends DropdownListControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IComparisonControlSettings;
    _privateSettings: IComparisonControlPrivate;
    _events: IComparisonControlEvents;
    protected _getDefaultIcon(): SVGElement;
}
//# sourceMappingURL=ComparisonControl.d.ts.map