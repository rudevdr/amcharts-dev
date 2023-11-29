import type { Indicator } from "./indicators/Indicator";
import type { StockChart } from "./StockChart";
import type { XYSeries } from "../xy/series/XYSeries";
import { Modal, IModalSettings, IModalPrivate, IModalEvents } from "../../core/util/Modal";
import { ColorControl } from "./toolbar/ColorControl";
export interface ISettingsModalSettings extends IModalSettings {
    /**
     * A target [[StockChart]].
     */
    stockChart: StockChart;
}
export interface ISettingsModalPrivate extends IModalPrivate {
}
export interface ISettingsModalEvents extends IModalEvents {
    /**
     * Invoked when modal is closed/saved.
     */
    done: {
        settings?: any;
        settingsTarget?: Indicator | XYSeries;
    };
}
/**
 * Used to display a modal dialog with HTML content.
 */
export declare class SettingsModal extends Modal {
    static className: string;
    static classNames: Array<string>;
    _settings: ISettingsModalSettings;
    _privateSettings: ISettingsModalPrivate;
    _events: ISettingsModalEvents;
    protected _updatedSettings: {
        [index: string]: any;
    };
    protected _settingsTarget?: Indicator | XYSeries;
    protected _colorControl?: ColorControl;
    protected _afterNew(): void;
    _beforeChanged(): void;
    /**
     * Opens settings modal for an [[Indicator]].
     *
     * @param  target  Target indicator
     */
    openIndicator(target: Indicator): void;
    /**
     * Opens settings editing for the any [[XYSeries]].
     *
     * @param  series  target series
     */
    openSeries(series: XYSeries): void;
    private initContent;
    private getDropdown;
    private getNumber;
    private getCheckbox;
    private getColor;
    /**
     * Closes the modal, saving settings.
     */
    close(): void;
    /**
     * Closes the modal without applying any changes.
     */
    cancel(): void;
    /**
     * Clears contents of the modal.
     */
    clear(): void;
    private _getSettingKey;
}
//# sourceMappingURL=SettingsModal.d.ts.map