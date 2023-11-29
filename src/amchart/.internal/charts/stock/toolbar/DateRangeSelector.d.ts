import { StockControl, IStockControlSettings, IStockControlPrivate, IStockControlEvents } from "./StockControl";
import { Dropdown } from "./Dropdown";
export interface IDateRangeSelectorSettings extends IStockControlSettings {
    /**
     * Date format to use for date input fields.
     *
     * Will use global date format if not set.
     */
    dateFormat?: string;
    /**
     * If set to `false` the control will not load default CSS for Flatpickr
     * component. This would mean it would be unstyled, and would require
     * custom CSS present on the page.
     *
     * @default true
     * @since 5.2.4
     */
    useDefaultCSS?: boolean;
    /**
     * Minimum date to allow for selection.
     *
     * Accepts either a `Date` object or `"auto"` (smallest date available in
     * chart).
     *
     * @default "auto"
     * @since 5.3.7
     */
    minDate?: Date | "auto" | null;
    /**
     * Maximum date to allow for selection.
     *
     * Accepts either a `Date` object or `"auto"` (latest date available in
     * chart).
     *
     * @default "auto"
     * @since 5.3.7
     */
    maxDate?: Date | "auto" | null;
}
export interface IDateRangeSelectorPrivate extends IStockControlPrivate {
    dropdown: Dropdown;
    fromField: HTMLInputElement;
    fromPicker: any;
    fromDate?: Date;
    toField: HTMLInputElement;
    toPicker: any;
    toDate?: Date;
}
export interface IDateRangeSelectorEvents extends IStockControlEvents {
}
/**
 * Date range selector control for [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/date-range-selector/} for more info
 */
export declare class DateRangeSelector extends StockControl {
    static className: string;
    static classNames: Array<string>;
    _settings: IDateRangeSelectorSettings;
    _privateSettings: IDateRangeSelectorPrivate;
    _events: IDateRangeSelectorEvents;
    protected _afterNew(): void;
    protected _initDropdown(): void;
    protected _getDefaultIcon(): SVGElement;
    _afterChanged(): void;
    protected _updateInputs(): void;
    protected _updatePickers(): void;
    protected _updateLabel(): void;
    protected _formatDate(date: Date): string;
    protected _parseDate(date: string): Date;
    protected _getDateFormat(): string;
    protected _getAxis(): any;
    protected _getPickerLocale(): any;
    /**
     * Loads the default CSS.
     *
     * @ignore Exclude from docs
     */
    protected _loadDefaultCSS(): void;
}
//# sourceMappingURL=DateRangeSelector.d.ts.map