import { DropdownListControl, IDropdownListControlSettings, IDropdownListControlPrivate, IDropdownListControlEvents } from "./DropdownListControl";
export interface ISeriesTypeControlSettings extends IDropdownListControlSettings {
}
export interface ISeriesTypeControlPrivate extends IDropdownListControlPrivate {
}
export interface ISeriesTypeControlEvents extends IDropdownListControlEvents {
}
/**
 * A control that is used to change type of the main series of the [[StockChart]].
 */
export declare class SeriesTypeControl extends DropdownListControl {
    static className: string;
    static classNames: Array<string>;
    _settings: ISeriesTypeControlSettings;
    _privateSettings: ISeriesTypeControlPrivate;
    _events: ISeriesTypeControlEvents;
}
//# sourceMappingURL=SeriesTypeControl.d.ts.map