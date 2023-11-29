import type { DataItem } from "../../../core/render/Component";
import { CandlestickSeries, ICandlestickSeriesPrivate, ICandlestickSeriesSettings, ICandlestickSeriesDataItem, ICandlestickSeriesAxisRange } from "./CandlestickSeries";
import { OHLC } from "./OHLC";
import { ListTemplate } from "../../../core/util/List";
export interface IOHLCSeriesDataItem extends ICandlestickSeriesDataItem {
}
export interface IOHLCSeriesSettings extends ICandlestickSeriesSettings {
}
export interface IOHLCSeriesPrivate extends ICandlestickSeriesPrivate {
}
export interface IOHLCSeriesAxisRange extends ICandlestickSeriesAxisRange {
    /**
     * List of [[OHLC]] columns in a range.
     */
    columns: ListTemplate<OHLC>;
}
/**
 * OHLC series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/candlestick-series/} for more info
 * @important
 */
export declare class OHLCSeries extends CandlestickSeries {
    _settings: IOHLCSeriesSettings;
    _privateSettings: IOHLCSeriesPrivate;
    _dataItemSettings: IOHLCSeriesDataItem;
    _axisRangeType: IOHLCSeriesAxisRange;
    static className: string;
    static classNames: Array<string>;
    /**
     * @ignore
     */
    makeColumn(dataItem: DataItem<this["_dataItemSettings"]>, listTemplate: ListTemplate<OHLC>): OHLC;
    /**
     * A list of OHLC bars in the series.
     *
     * `columns.template` can be used to configure OHLC bars.
     *
     * @default new ListTemplate<OHLC>
     */
    readonly columns: ListTemplate<OHLC>;
    protected _processAxisRange(axisRange: this["_axisRangeType"]): void;
}
//# sourceMappingURL=OHLCSeries.d.ts.map