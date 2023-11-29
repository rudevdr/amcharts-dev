import type { MapChart } from "./MapChart";
import type { GeoProjection, GeoPath } from "d3-geo";
import type { DataItem } from "../../core/render/Component";
import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate, ISeriesEvents } from "../../core/render/Series";
export interface IMapSeriesDataItem extends ISeriesDataItem {
    geometry?: GeoJSON.Geometry;
    geometryType?: GeoJSON.GeoJsonGeometryTypes;
    value?: number;
}
export interface IMapSeriesSettings extends ISeriesSettings {
    /**
     * All map series will determine the actual bounds shown in the [[MapChart]].
     *
     * If we need a series to be ignored while calculating the bounds, we can set
     * this to `false`.
     *
     * Especially useful for background series.
     *
     * @default true
     * @since 5.2.36
     */
    affectsBounds?: boolean;
    /**
     * Map data in GeoJSON format.
     */
    geoJSON?: GeoJSON.GeoJSON;
    /**
     * An array of map object ids from geodata to include in the map.
     *
     * If set, only those objects listed in `include` will be shown.
     */
    include?: Array<string>;
    /**
     * An array of map object ids from geodata to omit when showing the map.
     */
    exclude?: Array<string>;
    /**
     * A field in series `data` that will hold map object's numeric value.
     *
     * It can be used in a number of places, e.g. tooltips, heat rules, etc.
     */
    valueField?: string;
    /**
     * @ignore
     */
    geometryField?: string;
    /**
     * @ignore
     */
    geometryTypeField?: string;
    /**
     * Names of geodata items, such as countries, to replace by from loaded
     * geodata.
     *
     * Can be used to override built-in English names for countries.
     *
     * ```TypeScript
     * import am5geodata_lang_ES from '@amcharts5-geodata/lang/es';
     * // ...
     * map.geodataNames = am5geodata_lang_ES;
     * ```
     * ```JavaScript
     * map.geodataNames = am5geodata_lang_ES;
     * ```
     *
     * @since 5.1.13
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-translations/} for more info
     */
    geodataNames?: {
        [index: string]: string;
    };
}
export interface IMapSeriesPrivate extends ISeriesPrivate {
}
export interface IMapSeriesEvents extends ISeriesEvents {
    /**
     * Invoked when geodata is finished loading and processed.
     */
    geodataprocessed: {};
}
/**
 * Base class for map series.
 */
export declare abstract class MapSeries extends Series {
    static className: string;
    static classNames: Array<string>;
    chart: MapChart | undefined;
    _settings: IMapSeriesSettings;
    _privateSettings: IMapSeriesPrivate;
    _dataItemSettings: IMapSeriesDataItem;
    _events: IMapSeriesEvents;
    protected _types: Array<GeoJSON.GeoJsonGeometryTypes>;
    _geometries: Array<GeoJSON.Geometry>;
    protected _geoJSONparsed: boolean;
    protected _excluded: Array<DataItem<IMapSeriesDataItem>>;
    protected _notIncluded: Array<DataItem<IMapSeriesDataItem>>;
    protected _afterNew(): void;
    protected _handleDirties(): void;
    _prepareChildren(): void;
    protected _excludeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _unexcludeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _notIncludeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _unNotIncludeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected checkInclude(id: string, includes: string[] | undefined, excludes?: string[] | undefined): boolean;
    protected _parseGeoJSON(): void;
    /**
     * @ignore
     */
    abstract markDirtyProjection(): void;
    _placeBulletsContainer(_chart: MapChart): void;
    _removeBulletsContainer(): void;
    /**
     * @ignore
     */
    projection(): GeoProjection | undefined;
    /**
     * @ignore
     */
    geoPath(): GeoPath | undefined;
    protected _addGeometry(geometry: any, series: MapSeries): void;
    protected _removeGeometry(geometry: any): void;
    protected _dispose(): void;
    protected _onDataClear(): void;
}
//# sourceMappingURL=MapSeries.d.ts.map