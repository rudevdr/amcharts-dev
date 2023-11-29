import type { DataItem } from "../../core/render/Component";
import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate } from "../../core/render/Series";
import { Graphics } from "../../core/render/Graphics";
import { Container } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
import { ListTemplate } from "../../core/util/List";
import type { ILegendDataItem } from "../../core/render/Legend";
import type { Color } from "../../core/util/Color";
import type { ColorSet } from "../../core/util/ColorSet";
export interface IVennDataItem extends ISeriesDataItem {
    /**
     * Array of categories that this data item is an intersection for.
     */
    intersections: Array<string>;
    /**
     * Category.
     */
    category: string;
    /**
     * Slice visaul element.
     */
    slice: Graphics;
    /**
     * Slice label.
     */
    label: Label;
    /**
     * A related legend data item.
     */
    legendDataItem: DataItem<ILegendDataItem>;
    /**
     * Fill color used for the slice and related elements, e.g. legend marker.
     */
    fill: Color;
}
export interface IVennSettings extends ISeriesSettings {
    /**
     * A field in data that holds array of categories that overlap.
     */
    intersectionsField?: string;
    /**
     * A [[ColorSet]] to use when asigning colors for slices.
     */
    colors?: ColorSet;
    /**
     * A field in data that holds category names.
     */
    categoryField?: string;
    /**
     * A field that holds color for slice fill.
     */
    fillField?: string;
}
export interface IVennPrivate extends ISeriesPrivate {
}
/**
 * Creates a Venn diagram.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/venn/} for more info
 * @important
 */
export declare class Venn extends Series {
    static className: string;
    static classNames: Array<string>;
    _settings: IVennSettings;
    _privateSettings: IVennPrivate;
    _dataItemSettings: IVennDataItem;
    protected _sets: string;
    /**
     * A [[Container]] that holds all slices (circles and intersections).
     *
     * @default Container.new()
     */
    readonly slicesContainer: Container;
    /**
     * A [[Container]] that holds all labels.
     *
     * @default Container.new()
     */
    readonly labelsContainer: Container;
    /**
     * A [[Graphics]] element that is used to show the shape of the hovered slice
     * or intersection.
     *
     * @default Graphics.new()
     */
    readonly hoverGraphics: Graphics;
    protected _hovered?: Graphics;
    protected _afterNew(): void;
    /**
     * A [[ListTemplate]] of all slices in series.
     *
     * `slices.template` can also be used to configure slices.
     */
    readonly slices: ListTemplate<Graphics>;
    /**
     * @ignore
     */
    makeSlice(dataItem: DataItem<this["_dataItemSettings"]>): Graphics;
    protected _updateHover(): void;
    /**
     * A [[ListTemplate]] of all slice labels in series.
     *
     * `labels.template` can also be used to configure slice labels.
     */
    readonly labels: ListTemplate<Label>;
    /**
     * @ignore
     */
    makeLabel(dataItem: DataItem<this["_dataItemSettings"]>): Label;
    protected _makeSlices(): ListTemplate<Graphics>;
    protected _makeLabels(): ListTemplate<Label>;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _prepareChildren(): void;
    /**
     * Looks up and returns a data item by its category.
     *
     * @param   category  Category
     * @return      Data item
     */
    getDataItemByCategory(id: string): DataItem<this["_dataItemSettings"]> | undefined;
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
     * @ignore
     */
    updateLegendMarker(dataItem: DataItem<this["_dataItemSettings"]>): void;
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
}
//# sourceMappingURL=Venn.d.ts.map