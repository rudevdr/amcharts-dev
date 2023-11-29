import { MapPointSeries, IMapPointSeriesSettings, IMapPointSeriesPrivate, IMapPointSeriesDataItem } from "./MapPointSeries";
import { DataItem, IComponentDataItem } from "../../core/render/Component";
import type { Root } from "../../core/Root";
import type { Bullet } from "../../core/render/Bullet";
import * as d3hierarchy from "d3-hierarchy";
export interface IClusteredDataItem extends IComponentDataItem {
    /**
     * All the data items of this cluster
     */
    children?: Array<DataItem<IMapPointSeriesDataItem>>;
    /**
     * Bullet of clustered data item
     */
    bullet?: Bullet;
}
export interface IClusteredPointSeriesDataItem extends IMapPointSeriesDataItem {
    /**
     * An ID of a bullet's group.
     */
    groupId?: string;
    /**
     * Clustered data item (if available)
     * @readonly
     */
    cluster?: DataItem<IClusteredDataItem>;
    /**
     * How much bullet was moved from its original position
     */
    dx?: number;
    /**
     * How much bullet was moved from its original position
     */
    dy?: number;
}
export interface IClusteredPointSeriesPrivate extends IMapPointSeriesPrivate {
}
export interface IClusteredPointSeriesSettings extends IMapPointSeriesSettings {
    /**
     * Series data can contain a field with an ID of a virtual group the bullet
     * belongs to.
     *
     * For example, we migth want bullets to group with other bullets from the
     * same continent.
     *
     * `groupIdField` specifies which field in source data holds group IDs.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Group_segregation} for more info
     * @default groupID
     */
    groupIdField?: string;
    /**
     * Bullets that are closer than X pixels apart, will be automatically grouped.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Minimal_distance} for more info
     * @default 20
     */
    minDistance?: number;
    /**
     * Set this to a [[Bullet]] instance which will be used to show groups.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Group_bullet} for more info
     */
    clusteredBullet?: (root: Root, series: ClusteredPointSeries, dataItem: DataItem<IClusteredPointSeriesDataItem>) => Bullet | undefined;
    /**
     * If bullets are closer to each other than `scatterDistance`, they will be
     * scattered so that all are visible.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Scatter_settings} for more info
     * @default 5
     * @since 5.5.7
     */
    scatterDistance?: number;
    /**
     * Presumed radius of a each bullet when scattering them.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Scatter_settings} for more info
     * @default 8
     * @since 5.5.7
     */
    scatterRadius?: number;
    /**
     * If a map is zoomed to a maxZoomLevel * stopClusterZoom, clusters will be
     * disabled.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Scatter_settings} for more info
     * @default 0.95
     * @since 5.5.7
     */
    stopClusterZoom?: number;
}
/**
 * A version of [[MapPointSeries]] which can automatically group closely located
 * bullets into groups.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/} for more info
 * @since 5.5.6
 * @important
 */
export declare class ClusteredPointSeries extends MapPointSeries {
    static className: string;
    static classNames: Array<string>;
    _settings: IClusteredPointSeriesSettings;
    _privateSettings: IClusteredPointSeriesPrivate;
    _dataItemSettings: IClusteredPointSeriesDataItem;
    protected _dataItem: DataItem<this["_dataItemSettings"]>;
    protected _clusterIndex: number;
    protected _clusters: Array<Array<DataItem<this["_dataItemSettings"]>>>;
    clusteredDataItems: Array<DataItem<IClusteredDataItem>>;
    protected _scatterIndex: number;
    protected _scatters: Array<Array<DataItem<this["_dataItemSettings"]>>>;
    _packLayout: d3hierarchy.PackLayout<unknown>;
    protected _spiral: Array<{
        x: number;
        y: number;
    }>;
    protected _afterNew(): void;
    _updateChildren(): void;
    /**
     * Zooms to the area so that all clustered data items of a cluster would be
     * visible.
     *
     * Pass in `true` as a second parameter to rotate that map so that the group
     * is in the center. This is especially useful in the maps that use
     * Orthographic (globe) projection.
     *
     * @param  dataItem  Group data item
     * @param  rotate    Rotate the map so that group is in the center?
     * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/clustered-point-series/#Drill_down} for more info
     */
    zoomToCluster(dataItem: DataItem<IClusteredDataItem>, rotate?: boolean): void;
    protected _clusterGroup(dataItems: Array<DataItem<IClusteredPointSeriesDataItem>>): void;
    protected _clusterDataItem(dataItem: DataItem<IClusteredPointSeriesDataItem>, dataItems: Array<DataItem<IClusteredPointSeriesDataItem>>): void;
    protected _scatterGroup(dataItems: Array<DataItem<IClusteredPointSeriesDataItem>>): void;
    protected _scatterDataItem(dataItem: DataItem<IClusteredPointSeriesDataItem>, dataItems: Array<DataItem<IClusteredPointSeriesDataItem>>): void;
}
//# sourceMappingURL=ClusteredPointSeries.d.ts.map