import type { DataItem } from "../../core/render/Component";
import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate, ISeriesEvents } from "./Series";
import { Container } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
import { RoundedRectangle } from "../../core/render/RoundedRectangle";
import { ListTemplate } from "../../core/util/List";
import type { Entity, IEntitySettings } from "../../core/util/Entity";
import type { Color } from "../../core/util/Color";
export interface ILegendDataItem extends ISeriesDataItem {
    /**
     * [[Container]] element holding all other legend item elements, labels,
     * markers, etc.
     */
    itemContainer: Container;
    /**
     * Marker element.
     */
    marker: Container;
    /**
     * Marker rectangle element.
     */
    markerRectangle: RoundedRectangle;
    /**
     * Label element.
     */
    label: Label;
    /**
     * Value label element.
     */
    valueLabel: Label;
    /**
     * Marker fill color.
     */
    fill?: Color;
    /**
     * Marker stroke (outline) color.
     */
    stroke?: Color;
    /**
     * Name of the legend item.
     */
    name?: string;
}
export interface ILegendItemSettings extends IEntitySettings {
    visible?: boolean;
}
/**
 * @ignore
 */
export interface ILegendItem extends Entity {
    _settings: ILegendItemSettings;
    isHidden?: () => boolean;
    show?: () => void;
    hide?: () => void;
    createLegendMarker?: () => {};
    component?: Series;
    updateLegendValue?: () => {};
}
export interface ILegendSettings extends ISeriesSettings {
    /**
     * If set to `true` the legend will not try to mimic appearance of the actual
     * item but rather show default square marker.
     *
     * @default false
     */
    useDefaultMarker?: boolean;
    /**
     * A key to look up in data for a name of the data item.
     *
     */
    nameField?: string;
    /**
     * A key to look up in data for a fill of the data item.
     *
     */
    fillField?: string;
    /**
     * A key to look up in data for a stroke of the data item.
     *
     */
    strokeField?: string;
    /**
     * Which legend item element will be clickable to toggle related chart item:
     * * `"itemContainer"` - the whole legend item (default).
     * * `"marker"` - legend item marker.
     * * `"none"` - disables toggling of legend item.
     *
     * @default "itemContainer"
     * @since 5.0.13
     */
    clickTarget?: "itemContainer" | "marker" | "none";
}
export interface ILegendPrivate extends ISeriesPrivate {
}
export interface ILegendEvents extends ISeriesEvents {
}
/**
 * A universal legend control.
 *
 * @important
 * @see {@link https://www.amcharts.com/docs/v5/concepts/legend/} for more info
 */
export declare class Legend extends Series {
    protected _afterNew(): void;
    static className: string;
    static classNames: Array<string>;
    _settings: ILegendSettings;
    _privateSettings: ILegendPrivate;
    _dataItemSettings: ILegendDataItem;
    _events: ILegendEvents;
    /**
     * List of all [[Container]] elements for legend items.
     *
     * @default new ListTemplate<Container>
     */
    readonly itemContainers: ListTemplate<Container>;
    /**
     * @ignore
     */
    makeItemContainer(dataItem: DataItem<this["_dataItemSettings"]>): Container;
    /**
     * @ignore
     */
    makeMarker(): Container;
    /**
     * List of legend marker elements.
     *
     * @default new ListTemplate<Container>
     */
    readonly markers: ListTemplate<Container>;
    /**
     * @ignore
     */
    makeLabel(): Label;
    /**
     * List of legend label elements.
     *
     * @default new ListTemplate<Label>
     */
    readonly labels: ListTemplate<Label>;
    /**
     * @ignore
     */
    makeValueLabel(): Label;
    /**
     * List of legend value label elements.
     *
     * @default new ListTemplate<label>
     */
    readonly valueLabels: ListTemplate<Label>;
    /**
     * @ignore
     */
    makeMarkerRectangle(): RoundedRectangle;
    /**
     * List of rectangle elements used for default legend markers.
     *
     * @default new ListTemplate<RoundedRectangle>
     */
    readonly markerRectangles: ListTemplate<RoundedRectangle>;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _addClickEvents(container: Container, item: ILegendItem, dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=Legend.d.ts.map