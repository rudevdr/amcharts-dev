import type { DataItem } from "../../../core/render/Component";
import { ColumnSeries, IColumnSeriesPrivate, IColumnSeriesSettings, IColumnSeriesDataItem, IColumnSeriesAxisRange } from "./ColumnSeries";
import { Candlestick } from "./Candlestick";
import { ListTemplate } from "../../../core/util/List";
export interface ICandlestickSeriesDataItem extends IColumnSeriesDataItem {
}
export interface ICandlestickSeriesSettings extends IColumnSeriesSettings {
}
export interface ICandlestickSeriesPrivate extends IColumnSeriesPrivate {
}
export interface ICandlestickSeriesAxisRange extends IColumnSeriesAxisRange {
    /**
     * A list of [[Candlestick]] element in series.
     *
     * @readonly
     */
    columns: ListTemplate<Candlestick>;
}
/**
 * Candlestick series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/candlestick-series/} for more info
 * @important
 */
export declare class CandlestickSeries extends ColumnSeries {
    _settings: ICandlestickSeriesSettings;
    _privateSettings: ICandlestickSeriesPrivate;
    _dataItemSettings: ICandlestickSeriesDataItem;
    _axisRangeType: ICandlestickSeriesAxisRange;
    static className: string;
    static classNames: Array<string>;
    /**
     * @ignore
     */
    makeColumn(dataItem: DataItem<this["_dataItemSettings"]>, listTemplate: ListTemplate<Candlestick>): Candlestick;
    /**
     * A list of candles in the series.
     *
     * `columns.template` can be used to configure candles.
     *
     * @default new ListTemplate<Candlestick>
     */
    readonly columns: ListTemplate<Candlestick>;
    protected _updateGraphics(dataItem: DataItem<this["_dataItemSettings"]>, previousDataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateCandleGraphics(dataItem: DataItem<this["_dataItemSettings"]>, lx0: number, lx1: number, ly0: number, ly1: number, hx0: number, hx1: number, hy0: number, hy1: number, orientation: "horizontal" | "vertical"): void;
    protected _processAxisRange(axisRange: this["_axisRangeType"]): void;
}
//# sourceMappingURL=CandlestickSeries.d.ts.map