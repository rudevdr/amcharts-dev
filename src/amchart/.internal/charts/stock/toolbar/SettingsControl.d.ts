import type { IDropdownListItem } from "./DropdownList";
import { DropdownListControl, IDropdownListControlSettings, IDropdownListControlPrivate, IDropdownListControlEvents } from "./DropdownListControl";
export interface ISettingsControlItem extends IDropdownListItem {
}
export interface ISettingsControlSettings extends IDropdownListControlSettings {
}
export interface ISettingsControlPrivate extends IDropdownListControlPrivate {
}
export interface ISettingsControlEvents extends IDropdownListControlEvents {
}
/**
 * A control that is used to change type of the main series of the [[StockChart]].
 */
export declare class SettingsControl extends DropdownListControl {
    static className: string;
    static classNames: Array<string>;
    _settings: ISettingsControlSettings;
    _privateSettings: ISettingsControlPrivate;
    _events: ISettingsControlEvents;
    protected _afterNew(): void;
    protected _getDefaultIcon(): SVGElement;
    protected _populateInputs(): void;
    protected _getFillEnabled(): boolean;
    protected _getYScale(): "percent" | "regular" | "logarithmic";
    protected _setLogarithmic(value: boolean): void;
    protected _setFills(enabled: boolean): void;
}
//# sourceMappingURL=SettingsControl.d.ts.map