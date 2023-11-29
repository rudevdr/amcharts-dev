import type { XYSeries, IXYSeriesDataItem } from "../../xy/series/XYSeries";
import type { StockLegend } from "../StockLegend";
import type { StockChart } from "../StockChart";
import type { DataItem } from "../../../core/render/Component";
import type { Color } from "../../../core/util/Color";
import { Container, IContainerSettings, IContainerPrivate, IContainerEvents } from "../../../core/render/Container";
import { MultiDisposer } from "../../../core/util/Disposer";
export interface IIndicatorEditableSetting {
    /**
     * Setting key.
     */
    key: string;
    /**
     * Name of the setting (displayed in edit modal).
     *
     * Settings with the same name will be grouped in modal.
     */
    name: string;
    /**
     * Type of the control to show for editing the setting in modal.
     */
    type: "color" | "number" | "dropdown" | "checkbox";
    /**
     * If `type: "dropdown"`, `options` should contain a list of items it.
     */
    options?: Array<string | {
        value: number | string;
        text: string;
    }>;
}
export interface IIndicatorSettings extends IContainerSettings {
    /**
     * An instance of target [[StockChart]].
     */
    stockChart: StockChart;
    /**
     * A main series indicator will be based on.
     */
    stockSeries: XYSeries;
    /**
     * A volume series indicator will be based on, if it reaquires one.
     */
    volumeSeries?: XYSeries;
    /**
     * If set to a reference to [[StockLegend]], indicator will add itself into
     * the legend.
     */
    legend?: StockLegend;
    /**
     * Period.
     */
    period?: number;
    /**
     * A value field to use.
     */
    field?: "open" | "close" | "low" | "high" | "hl/2" | "hlc/3" | "hlcc/4" | "ohlc/4";
    /**
     * Indicator name, e.g. "Moving Average".
     */
    name?: string;
    /**
     * Short name for the indicator, e.g. "MA" (for "Moving Average").
     *
     * Mainly used for the legend.
     */
    shortName?: string;
    /**
     * A color to use for the indicator series.
     */
    seriesColor?: Color;
}
export interface IIndicatorPrivate extends IContainerPrivate {
}
export interface IIndicatorEvents extends IContainerEvents {
}
/**
 * Base class for [[StockChart]] indicators.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/indicators/} for more info
 */
export declare abstract class Indicator extends Container {
    static className: string;
    static classNames: Array<string>;
    _settings: IIndicatorSettings;
    _privateSettings: IIndicatorPrivate;
    _events: IIndicatorEvents;
    _editableSettings: IIndicatorEditableSetting[];
    series: XYSeries;
    protected _dataDirty: boolean;
    protected _sDP?: MultiDisposer;
    protected _vDP?: MultiDisposer;
    _prepareChildren(): void;
    protected markDataDirty(): void;
    _updateChildren(): void;
    protected _dispose(): void;
    hide(duration?: number): Promise<any>;
    show(duration?: number): Promise<any>;
    protected _handleLegend(series: XYSeries): void;
    protected _updateSeriesColor(series?: XYSeries, color?: Color, contextName?: string): void;
    setCustomData(name: string, value?: any): void;
    /**
     * @ignore
     */
    prepareData(): void;
    protected _getValue(dataItem: DataItem<IXYSeriesDataItem>): number | undefined;
    /**
     * @ignore
     */
    protected _getDataArray(dataItems: Array<DataItem<any>>): Array<any>;
    /**
     * @ignore
     */
    protected _getTypicalPrice(dataItems: Array<DataItem<any>>): Array<any>;
    protected _sma(data: Array<any>, period: number, field: string, toField: string): void;
    protected _wma(data: Array<any>, period: number, field: string, toField: string): void;
    protected _ema(data: Array<any>, period: number, field: string, toField: string): void;
    protected _dema(data: Array<any>, period: number, field: string, toField: string): void;
    protected _tema(data: Array<any>, period: number, field: string, toField: string): void;
}
//# sourceMappingURL=Indicator.d.ts.map