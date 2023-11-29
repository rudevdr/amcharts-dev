import type { DataItem } from "../../../core/render/Component";
import type { Graphics } from "../../../core/render/Graphics";
import type { ListTemplate } from "../../../core/util/List";
import type { IAxisDataItem } from "../axes/Axis";
import type { ILegendDataItem } from "../../../core/render/Legend";
import type { Sprite } from "../../../core/render/Sprite";
import { XYSeries, IXYSeriesPrivate, IXYSeriesSettings, IXYSeriesDataItem, IXYSeriesAxisRange } from "./XYSeries";
export interface IBaseColumnSeriesDataItem extends IXYSeriesDataItem {
    /**
     * An actual [[Graphics]] element (Column/Slice/Candlestick/OHLC).
     */
    graphics?: Graphics;
    /**
     * In case axis ranges are added to the series, it creates a separate
     * element ([[Graphics]]) for each axis range. This array holds them all.
     */
    rangeGraphics?: Array<Graphics>;
    /**
     * If data items from this series are used to feed a [[Legend]], this
     * will hold a reference to the equivalent Legend data item.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/legend/#Data_item_list} for more info
     */
    legendDataItem?: DataItem<ILegendDataItem>;
}
export interface IBaseColumnSeriesSettings extends IXYSeriesSettings {
    /**
     * Indicates if series must divvy up available space with other column
     * series (`true`; default) or take up the whole available space (`false`).
     *
     * @default true
     * @see {@link https://www.amcharts.com/docs/v5/charts/xy-chart/series/column-series/#Clustering} for more info
     */
    clustered?: boolean;
    /**
     * Whether positions of bullets should be calculated based on portion of
     * column currently visual (`true`) or the whole length/height of the
     * column (`false`).
     *
     * @default true
     */
    adjustBulletPosition?: boolean;
    /**
     * If set to `true` will use color of the last visible column for legend
     * marker. Otherwise, series `fill`/`stroke` will be used.
     *
     * @since 5.1.13
     */
    useLastColorForLegendMarker?: boolean;
}
export interface IBaseColumnSeriesPrivate extends IXYSeriesPrivate {
}
export interface IBaseColumnSeriesAxisRange extends IXYSeriesAxisRange {
    /**
     * A list of actual [[Graphics]] elements for an axis range.
     *
     * Can be used to ajust the look of the axis range columns.
     */
    columns: ListTemplate<Graphics>;
}
/**
 * Base class for all "column-based" series
 */
export declare abstract class BaseColumnSeries extends XYSeries {
    _settings: IBaseColumnSeriesSettings;
    _privateSettings: IBaseColumnSeriesPrivate;
    _dataItemSettings: IBaseColumnSeriesDataItem;
    _axisRangeType: IBaseColumnSeriesAxisRange;
    static className: string;
    static classNames: Array<string>;
    /**
     * @ignore
     */
    abstract makeColumn(dataItem: DataItem<this["_dataItemSettings"]>, listTemplate: ListTemplate<Graphics>): Graphics;
    /**
     * ListTemplate of columns in series.
     */
    abstract columns: ListTemplate<Graphics>;
    protected _makeGraphics(listTemplate: ListTemplate<Graphics>, dataItem: DataItem<this["_dataItemSettings"]>): Graphics;
    protected _ph: number;
    protected _pw: number;
    _makeFieldNames(): void;
    _prepareChildren(): void;
    _updateChildren(): void;
    protected _createGraphics(dataItem: DataItem<this["_dataItemSettings"]>): void;
    createAxisRange(axisDataItem: DataItem<IAxisDataItem>): this["_axisRangeType"];
    protected _updateGraphics(dataItem: DataItem<this["_dataItemSettings"]>, previousDataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateSeriesGraphics(dataItem: DataItem<this["_dataItemSettings"]>, graphics: Graphics, l: number, r: number, t: number, b: number, fitW: boolean, fitH: boolean): void;
    protected _handleDataSetChange(): void;
    _applyGraphicsStates(dataItem: DataItem<this["_dataItemSettings"]>, previousDataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    protected _toggleColumn(dataItem: DataItem<this["_dataItemSettings"]>, visible: boolean): void;
    /**
     * Shows series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * @ignore
     */
    updateLegendMarker(dataItem?: DataItem<IBaseColumnSeriesDataItem>): void;
    protected _getTooltipTarget(dataItem: DataItem<this["_dataItemSettings"]>): Sprite;
}
//# sourceMappingURL=BaseColumnSeries.d.ts.map