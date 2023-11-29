import type { DataItem } from "../../core/render/Component";
import { MapSeries, IMapSeriesSettings, IMapSeriesDataItem, IMapSeriesPrivate } from "./MapSeries";
import { MapPolygon } from "./MapPolygon";
import { ListTemplate } from "../../core/util/List";
import type { Animation } from "../../core/util/Entity";
export interface IMapPolygonSeriesPrivate extends IMapSeriesPrivate {
}
export interface IMapPolygonSeriesDataItem extends IMapSeriesDataItem {
    /**
     * Related [[MapPolygon]] object.
     */
    mapPolygon: MapPolygon;
    /**
     * GeoJSON geometry of the polygon.
     */
    geometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon;
}
export interface IMapPolygonSeriesSettings extends IMapSeriesSettings {
    /**
     * If set to `true`, the order of coordinates in GeoJSON will be flipped.
     *
     * Some GeoJSON software produces those in reverse order, so if your custom
     * map appears garbled, try this setting.
     *
     * @default false
     * @since 5.2.42
     */
    reverseGeodata?: boolean;
}
/**
 * Creates a map series for displaying polygons.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/} for more info
 * @important
 */
export declare class MapPolygonSeries extends MapSeries {
    /**
     * @ignore
     */
    makeMapPolygon(dataItem: DataItem<this["_dataItemSettings"]>): MapPolygon;
    /**
     * A [[ListTemplate]] of all polygons in series.
     *
     * `mapPolygons.template` can also be used to configure polygons.
     *
     * @default new ListTemplate<MapPolygon>
     */
    readonly mapPolygons: ListTemplate<MapPolygon>;
    static className: string;
    static classNames: Array<string>;
    _settings: IMapPolygonSeriesSettings;
    _privateSettings: IMapPolygonSeriesPrivate;
    _dataItemSettings: IMapPolygonSeriesDataItem;
    protected _types: Array<GeoJSON.GeoJsonGeometryTypes>;
    /**
     * @ignore
     */
    markDirtyProjection(): void;
    _prepareChildren(): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    protected _excludeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    protected _unexcludeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    protected _notIncludeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    protected _unNotIncludeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Forces a repaint of the element which relies on data.
     *
     * @since 5.0.21
     */
    markDirtyValues(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Centers and zooms in on the specific polygon.
     *
     * @param  dataItem  Target data item
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zooming_to_clicked_object} for more info
     * @param  rotate If it's true, the map will rotate so that this polygon would be in the center. Mostly usefull with geoOrthographic projection.
     */
    zoomToDataItem(dataItem: DataItem<IMapPolygonSeriesDataItem>, rotate?: boolean): Animation<any> | undefined;
}
//# sourceMappingURL=MapPolygonSeries.d.ts.map