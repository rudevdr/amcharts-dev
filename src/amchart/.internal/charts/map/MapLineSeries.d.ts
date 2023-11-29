import type { IMapPointSeriesDataItem } from "./MapPointSeries";
import type { DataItem } from "../../core/render/Component";
import { MapSeries, IMapSeriesSettings, IMapSeriesDataItem, IMapSeriesPrivate } from "./MapSeries";
import { MapLine } from "./MapLine";
import { ListTemplate } from "../../core/util/List";
/**
 * @ignore
 */
export interface IMapLineSeriesPrivate extends IMapSeriesPrivate {
}
export interface IMapLineSeriesDataItem extends IMapSeriesDataItem {
    /**
     * Related [[MapLine]] object.
     */
    mapLine?: MapLine;
    /**
     * GeoJSON geometry of the line.
     */
    geometry?: GeoJSON.LineString | GeoJSON.MultiLineString;
    /**
     * An array of data items from [[MapPointSeries]] to use as line end-points. Note, fixed points can not be used here.
     */
    pointsToConnect?: Array<DataItem<IMapPointSeriesDataItem>>;
    /**
     * A line type.
     *
     * * `"curved"` (default) - connects points using shortest distance, which will result in curved lines based on map projection.
     * * `"straight"` - connects points using visually straight lines, and will not cross the -180/180 longitude.
     *
     * @default "curved"
     * @since 5.2.32
     */
    lineType?: "curved" | "straight";
}
export interface IMapLineSeriesSettings extends IMapSeriesSettings {
    /**
     * If set to `true` will hide line segments that are in the invisible range
     * of the map.
     *
     * For example on the side of the globe facing away from the viewer when
     * used with Orthographic projection.
     *
     * NOTE: not all projections have invisible side.
     */
    clipBack?: boolean;
    /**
     * A line type.
     *
     * * `"curved"` (default) - connects points using shortest distance, which will result in curved lines based on map projection.
     * * `"straight"` - connects points using visually straight lines, and will not cross the -180/180 longitude.
     *
     * @default "curved"
     * @since 5.2.24
     */
    lineType?: "curved" | "straight";
    /**
     * @ignore
     */
    lineTypeField?: string;
}
/**
 * Creates a map series for displaying lines on the map.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-line-series/} for more info
 * @important
 */
export declare class MapLineSeries extends MapSeries {
    protected _afterNew(): void;
    /**
     * @ignore
     */
    makeMapLine(dataItem: DataItem<this["_dataItemSettings"]>): MapLine;
    /**
     * A [[ListTemplate]] of all lines in series.
     *
     * `mapLines.template` can also be used to configure lines.
     *
     * @default new ListTemplate<MapLine>
     */
    readonly mapLines: ListTemplate<MapLine>;
    static className: string;
    static classNames: Array<string>;
    _settings: IMapLineSeriesSettings;
    _privateSettings: IMapLineSeriesPrivate;
    _dataItemSettings: IMapLineSeriesDataItem;
    protected _types: Array<GeoJSON.GeoJsonGeometryTypes>;
    /**
     * @ignore
     */
    markDirtyProjection(): void;
    _prepareChildren(): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _handlePointsToConnect(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Forces a repaint of the element which relies on data.
     *
     * @since 5.0.21
     */
    markDirtyValues(dataItem: DataItem<this["_dataItemSettings"]>): void;
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
//# sourceMappingURL=MapLineSeries.d.ts.map