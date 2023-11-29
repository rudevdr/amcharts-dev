import type { DataItem } from "../../core/render/Component";
import type { Graphics } from "../../core/render/Graphics";
import type { Label } from "../../core/render/Label";
import type { Tick } from "../../core/render/Tick";
import type { ListTemplate } from "../../core/util/List";
import type { ColorSet } from "../../core/util/ColorSet";
import type { ILegendDataItem } from "../../core/render/Legend";
import type { Color } from "../../core/util/Color";
import type { PercentChart } from "./PercentChart";
import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate } from "../../core/render/Series";
import { Container } from "../../core/render/Container";
export interface IPercentSeriesDataItem extends ISeriesDataItem {
    /**
     * Percent of the series value total.
     */
    valuePercentTotal: number;
    /**
     * Category.
     */
    category: string;
    /**
     * Slice visual element.
     */
    slice: Graphics;
    /**
     * Slice label.
     */
    label: Label;
    /**
     * Slice tick.
     */
    tick: Tick;
    /**
     * A related legend data item.
     */
    legendDataItem: DataItem<ILegendDataItem>;
    /**
     * Fill color used for the slice and related elements, e.g. legend marker.
     */
    fill: Color;
}
export interface IPercentSeriesSettings extends ISeriesSettings {
    /**
     * A [[ColorSet]] to use when asigning colors for slices.
     */
    colors?: ColorSet;
    /**
     * A field in data that holds category names.
     */
    categoryField?: string;
    /**
     * Should slice labels be aligned in columns/rows?
     */
    alignLabels?: boolean;
    /**
     * A field that holds color for slice fill.
     */
    fillField?: string;
}
export interface IPercentSeriesPrivate extends ISeriesPrivate {
    /**
     * Calculate average value in series.
     */
    valueAverage?: number;
    /**
     * Count of items in series.
     */
    valueCount?: number;
    /**
     * Sum of values in series.
     */
    valueSum?: number;
    /**
     * Sum of all absolute values in series.
     */
    valueAbsoluteSum?: number;
    /**
     * Lowest value in series.
     */
    valueLow?: number;
    /**
     * Highest value in series.
     */
    valueHigh?: number;
}
/**
 * A base class for any percent chart series.
 */
export declare abstract class PercentSeries extends Series {
    static className: string;
    static classNames: Array<string>;
    _settings: IPercentSeriesSettings;
    _privateSettings: IPercentSeriesPrivate;
    _dataItemSettings: IPercentSeriesDataItem;
    _sliceType: Graphics;
    _labelType: Label;
    _tickType: Tick;
    readonly slicesContainer: Container;
    readonly labelsContainer: Container;
    readonly ticksContainer: Container;
    protected _lLabels: Array<{
        label: Label;
        y: number;
    }>;
    protected _rLabels: Array<{
        label: Label;
        y: number;
    }>;
    protected _hLabels: Array<{
        label: Label;
        y: number;
    }>;
    /**
     * A [[ListTemplate]] of all slices in series.
     *
     * `slices.template` can also be used to configure slices.
     */
    readonly slices: ListTemplate<this["_sliceType"]>;
    protected abstract _makeSlices(): ListTemplate<this["_sliceType"]>;
    abstract chart: PercentChart | undefined;
    /**
     * @ignore
     */
    makeSlice(dataItem: DataItem<this["_dataItemSettings"]>): this["_sliceType"];
    /**
     * A [[ListTemplate]] of all slice labels in series.
     *
     * `labels.template` can also be used to configure slice labels.
     */
    readonly labels: ListTemplate<this["_labelType"]>;
    protected abstract _makeLabels(): ListTemplate<this["_labelType"]>;
    /**
     * @ignore
     */
    makeLabel(dataItem: DataItem<this["_dataItemSettings"]>): this["_labelType"];
    /**
     * A [[ListTemplate]] of all slice ticks in series.
     *
     * `ticks.template` can also be used to configure slice ticks.
     */
    readonly ticks: ListTemplate<this["_tickType"]>;
    protected abstract _makeTicks(): ListTemplate<this["_tickType"]>;
    protected _shouldMakeBullet(dataItem: DataItem<this["_dataItemSettings"]>): boolean;
    /**
     * @ignore
     */
    makeTick(dataItem: DataItem<this["_dataItemSettings"]>): this["_tickType"];
    protected _afterNew(): void;
    protected _onDataClear(): void;
    _prepareChildren(): void;
    /**
     * Shows hidden series.
     *
     * @param   duration  Animation duration in milliseconds
     * @return            Animation promise
     */
    show(duration?: number): Promise<void>;
    /**
     * Hide whole series.
     *
     * @param   duration  Animation duration in milliseconds
     * @return            Animation promise
     */
    hide(duration?: number): Promise<void>;
    /**
     * @ignore
     */
    _updateChildren(): void;
    protected _arrange(): void;
    _afterChanged(): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Shows series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Triggers hover on a series data item.
     *
     * @since 5.0.7
     * @param  dataItem  Target data item
     */
    hoverDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Triggers un-hover on a series data item.
     *
     * @since 5.0.7
     * @param  dataItem  Target data item
     */
    unhoverDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    updateLegendMarker(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _arrangeDown(labels?: Array<{
        label: Label;
        y: number;
    }>): void;
    protected _getNextUp(): number;
    protected _getNextDown(): number;
    protected _arrangeUp(labels?: Array<{
        label: Label;
        y: number;
    }>): void;
    protected _arrangeRight(labels?: Array<{
        label: Label;
        y: number;
    }>): void;
    protected _arrangeLeft(labels?: Array<{
        label: Label;
        y: number;
    }>): void;
    _updateSize(): void;
    protected _updateTick(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _dispose(): void;
}
//# sourceMappingURL=PercentSeries.d.ts.map