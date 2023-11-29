import type { DataItem } from "../../core/render/Component";
import type { StockChart } from "./StockChart";
import type { StockPanel } from "./StockPanel";
import { Legend, ILegendPrivate, ILegendSettings, ILegendEvents, ILegendDataItem } from "../../core/render/Legend";
import { Button } from "../../core/render/Button";
import { ListTemplate } from "../../core/util/List";
export interface IStockLegendDataItem extends ILegendDataItem {
    /**
     * Legend item "close" [[Button]].
     */
    closeButton: Button;
    /**
     * Legend item "settings" [[Button]].
     */
    settingsButton: Button;
    /**
     * Target [[StockPanel]] legend item is attached to.
     */
    panel: StockPanel;
}
export interface IStockLegendSettings extends ILegendSettings {
    /**
     * A target [[StockChart]].
     */
    stockChart: StockChart;
}
export interface IStockLegendPrivate extends ILegendPrivate {
}
export interface IStockLegendEvents extends ILegendEvents {
}
/**
 * A legend, specifically designed for use in a [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Legend} for more info
 * @important
 */
export declare class StockLegend extends Legend {
    static className: string;
    static classNames: Array<string>;
    _settings: IStockLegendSettings;
    _privateSettings: IStockLegendPrivate;
    _events: IStockLegendEvents;
    _dataItemSettings: IStockLegendDataItem;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    makeCloseButton(): Button;
    /**
     * A list of "close" buttons in legend items.
     *
     * @default new ListTemplate<Button>()
     */
    readonly closeButtons: ListTemplate<Button>;
    /**
     * @ignore
     */
    makeSettingsButton(): Button;
    /**
     * A list of "settings" buttons in legend items.
     *
     * @default new ListTemplate<Button>()
     */
    readonly settingsButtons: ListTemplate<Button>;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=StockLegend.d.ts.map