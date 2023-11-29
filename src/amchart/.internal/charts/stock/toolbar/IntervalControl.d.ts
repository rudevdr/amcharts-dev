import type { IDropdownListItem } from "./DropdownList";
import type { TimeUnit } from "../../../core/util/Time";
import { DropdownListControl, IDropdownListControlSettings, IDropdownListControlPrivate, IDropdownListControlEvents } from "./DropdownListControl";
export interface IIntervalControlItem extends IDropdownListItem {
    interval: {
        timeUnit: TimeUnit;
        count?: number;
    };
}
export interface IIntervalControlSettings extends IDropdownListControlSettings {
    currentItem?: string | IIntervalControlItem;
    items?: Array<string | IIntervalControlItem>;
}
export interface IIntervalControlPrivate extends IDropdownListControlPrivate {
}
export interface IIntervalControlEvents extends IDropdownListControlEvents {
}
/**
 * A control that is used to change type of the main series of the [[StockChart]].
 */
export declare class IntervalControl extends DropdownListControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IIntervalControlSettings;
    _privateSettings: IIntervalControlPrivate;
    _events: IIntervalControlEvents;
    protected _getDefaultIcon(): SVGElement;
}
//# sourceMappingURL=IntervalControl.d.ts.map