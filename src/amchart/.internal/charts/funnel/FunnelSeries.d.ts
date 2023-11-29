import type { DataItem } from "../../core/render/Component";
import type { SlicedChart } from "./SlicedChart";
import { PercentSeries, IPercentSeriesSettings, IPercentSeriesDataItem, IPercentSeriesPrivate } from "../percent/PercentSeries";
import { ListTemplate } from "../../core/util/List";
import { FunnelSlice } from "./FunnelSlice";
import { Tick } from "../../core/render/Tick";
import { Label } from "../../core/render/Label";
import type { Bullet } from "../../core/render/Bullet";
export interface IFunnelSeriesDataItem extends IPercentSeriesDataItem {
    /**
     * A related slice element.
     */
    slice: FunnelSlice;
    /**
     * A related slice link element
     */
    link: FunnelSlice;
    /**
     * Data item's index.
     */
    index: number;
}
export interface IFunnelSeriesSettings extends IPercentSeriesSettings {
    /**
     * Width of the bottom edge of the slice relative to the top edge of the next
     * slice.
     *
     * `1` - means the full width of the slice, resulting in a rectangle.
     * `0` - means using width of the next slice, resulting in a trapezoid.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/funnel-series/#Slice_bottom_width} for more info
     * @default 1
     */
    bottomRatio?: number;
    /**
     * Orientation of the series.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/#Series_orientation} for more info
     * @default "vertical"
     */
    orientation: "horizontal" | "vertical";
    /**
     * If set to `true`, series will not create slices for data items with zero
     * value.
     */
    ignoreZeroValues?: boolean;
    /**
     * Should labels be aligned into columns/rows?
     *
     * @default false
     */
    alignLabels?: boolean;
    /**
     * Relative location within area available to series where it should start.
     *
     * `0` - beginning, `1` - end, or any intermediate value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/funnel-series/#Start_end_locations} for more info
     * @default 0
     */
    startLocation?: number;
    /**
     * Relative location within area available to series where it should start.
     *
     * `0` - beginning, `1` - end, or any intermediate value.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/funnel-series/#Start_end_locations} for more info
     * @default 0
     */
    endLocation?: number;
}
export interface IFunnelSeriesPrivate extends IPercentSeriesPrivate {
}
/**
 * Creates a funnel series for use in a [[SlicedChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/funnel-series/} for more info
 * @important
 */
export declare class FunnelSeries extends PercentSeries {
    /**
     * A chart series is attached to.
     */
    chart: SlicedChart | undefined;
    protected _tag: string;
    _sliceType: FunnelSlice;
    _labelType: Label;
    _tickType: Tick;
    protected _makeSlices(): ListTemplate<this["_sliceType"]>;
    protected _makeLabels(): ListTemplate<this["_labelType"]>;
    protected _makeTicks(): ListTemplate<this["_tickType"]>;
    /**
     * A [[ListTemplate]] of all slice links in series.
     *
     * `links.template` can also be used to configure slice links.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/sliced-chart/funnel-series/#Slice_links} for more info
     */
    readonly links: ListTemplate<this["_sliceType"]>;
    protected _makeLinks(): ListTemplate<this["_sliceType"]>;
    /**
     * @ignore
     */
    makeLink(dataItem: DataItem<this["_dataItemSettings"]>): this["_sliceType"];
    static className: string;
    static classNames: Array<string>;
    _settings: IFunnelSeriesSettings;
    _privateSettings: IFunnelSeriesPrivate;
    _dataItemSettings: IFunnelSeriesDataItem;
    protected _total: number;
    protected _count: number;
    protected _nextCoord: number;
    protected _opposite: boolean;
    protected _afterNew(): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _updateChildren(): void;
    protected _fixLayout(): void;
    protected getNextValue(dataItem: DataItem<this["_dataItemSettings"]>): number;
    protected isLast(dataItem: DataItem<this["_dataItemSettings"]>): boolean;
    protected decorateSlice(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Shows series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    protected _updateTick(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _positionBullet(bullet: Bullet): void;
}
//# sourceMappingURL=FunnelSeries.d.ts.map