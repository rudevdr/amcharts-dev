import type { IMapLineSeriesDataItem } from "./MapLineSeries";
import type { IMapPolygonSeriesDataItem } from "./MapPolygonSeries";
import type { Bullet } from "../../core/render/Bullet";
import type { DataItem } from "../../core/render/Component";
import { MapSeries, IMapSeriesSettings, IMapSeriesDataItem, IMapSeriesPrivate } from "./MapSeries";
import type { IPoint } from "../../core/util/IPoint";
import type { Animation } from "../../core/util/Entity";
import type { IDisposer } from "../../core/util/Disposer";
export interface IMapPointSeriesPrivate extends IMapSeriesPrivate {
}
export interface IMapPointSeriesDataItem extends IMapSeriesDataItem {
    /**
     * GeoJSON geometry of the point.
     */
    geometry?: GeoJSON.Point | GeoJSON.MultiPoint;
    /**
     * Longitude.
     */
    longitude?: number;
    /**
     * Latitude.
     */
    latitude?: number;
    /**
     * Relative position (0-1) on the [[MapLine]] to place point on.
     */
    positionOnLine?: number;
    /**
     * Automatically rotate the point bullet to face the direction of the line
     * it is attached to.
     */
    autoRotate?: boolean;
    /**
     * The angle will be added to the automatically-calculated angle.
     *
     * Can be used to reverse the direction.
     */
    autoRotateAngle?: number;
    /**
     * A data item from a [[MapLineSeries]] the point is attached to.
     */
    lineDataItem?: DataItem<IMapLineSeriesDataItem>;
    /**
     * An ID of a [[MapLine]] the point is attached to.
     */
    lineId?: string;
    /**
     * A data item from a [[MapPolygonSeries]] to use for positioning of the
     * point.
     */
    polygonDataItem?: DataItem<IMapPolygonSeriesDataItem>;
    /**
     * An ID of the [[MapPolygon]] to use for centering the point.
     */
    polygonId?: string;
    /**
     * If set to `true`, the point will be drawn according to its `x` and `y`
     * coordinates, not its latitude and longitude.
     *
     * Fixed points will not move together with map, and can not be used to
     * connect points on a `MapLineSeries`.
     *
     * @default false
     * @since 5.2.34
     */
    fixed?: boolean;
    /**
     * Point (in pixels) of a data item
     */
    point?: IPoint;
    /**
     * @ignore
     */
    clipped?: boolean;
}
export interface IMapPointSeriesSettings extends IMapSeriesSettings {
    /**
     * A field in data that holds an ID of the related polygon.
     *
     * If set, the point will be positioned in the visual center of the target
     * polygon.
     */
    polygonIdField?: string;
    /**
     * If set to `true` will hide all points that are in the visible range of
     * the map.
     */
    clipFront?: boolean;
    /**
     * If set to `true` will hide all points that are in the invisible range of
     * the map.
     *
     * For example on the side of the globe facing away from the viewer when
     * used with Orthographic projection.
     *
     * NOTE: not all projections have invisible side.
     *
     * @default true
     */
    clipBack?: boolean;
    /**
     * A field in data that holds point's longitude.
     */
    latitudeField?: string;
    /**
     * A field in data that holds point's longitude.
     */
    longitudeField?: string;
    /**
     * A field in data that holds information if this point is fixed or moves with a map.
     */
    fixedField?: string;
    /**
     * If set to `true`, bullets will resize when zooming the [[MapChart]].
     *
     * @since 5.2.8
     * @default false
     */
    autoScale?: boolean;
}
/**
 * Creates a map series for displaying markers on the map.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-point-series/} for more info
 * @important
 */
export declare class MapPointSeries extends MapSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IMapPointSeriesSettings;
    _privateSettings: IMapPointSeriesPrivate;
    _dataItemSettings: IMapPointSeriesDataItem;
    protected _types: Array<GeoJSON.GeoJsonGeometryTypes>;
    protected _lineChangedDp?: IDisposer;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    markDirtyProjection(): void;
    /**
     * Forces a repaint of the element which relies on data.
     *
     * @since 5.0.21
     */
    markDirtyValues(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _makeBullets(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _setBulletParent(bullet?: Bullet): void;
    _positionBullet(bullet: Bullet): void;
    protected _positionBulletReal(bullet: Bullet, geometry: GeoJSON.Geometry, coordinates: [number, number], angle?: number): void;
    /**
     * Centers the map to specific series' data item and zooms to the level
     * specified in the parameters.
     *
     * @param  dataItem   Map point
     * @param  zoomLevel  Zoom level
     * @param  rotate If it's true, the map will rotate so that this point would be in the center. Mostly usefull with geoOrthographic projection.
     */
    zoomToDataItem(dataItem: DataItem<IMapPointSeriesDataItem>, zoomLevel: number, rotate?: boolean): Animation<any> | undefined;
    /**
     * Zooms the map in so that all points in the array are visible.
     *
     * @param   dataItems  An array of data items of points to zoom to
     * @param   rotate     Rotate the map so it is centered on the selected items
     * @return             Animation
     * @since 5.5.6
     */
    zoomToDataItems(dataItems: Array<DataItem<IMapPointSeriesDataItem>>, rotate?: boolean): Animation<any> | undefined;
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
}
//# sourceMappingURL=MapPointSeries.d.ts.map