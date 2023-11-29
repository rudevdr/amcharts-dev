import type { HierarchyNode } from "../hierarchy/HierarchyNode";
import type { DataItem } from "../../core/render/Component";
import { Hierarchy, IHierarchyPrivate, IHierarchySettings, IHierarchyDataItem } from "../hierarchy/Hierarchy";
import { ListTemplate } from "../../core/util/List";
import { Polygon } from "../../core/render/Polygon";
export interface IVoronoiTreemapDataObject {
    name?: string;
    value?: number;
    children?: IVoronoiTreemapDataObject[];
    dataItem?: DataItem<IVoronoiTreemapDataItem>;
}
export interface IVoronoiTreemapDataItem extends IHierarchyDataItem {
    /**
     * Data items of child nodes.
     */
    children: Array<DataItem<IVoronoiTreemapDataItem>>;
    /**
     * Data it of a parent node.
     */
    parent: DataItem<IVoronoiTreemapDataItem>;
    /**
     * A [[Polygon]] element of a node.
     */
    polygon: Polygon;
}
export interface IVoronoiTreemapSettings extends IHierarchySettings {
    /**
     * Type of the diagram's shape.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/voronoi-treemap/#Diagram_type} for more info
     * @default "polygon"
     */
    type?: "rectangle" | "polygon";
    /**
     * Number of corners when type is `"polygon"`.
     *
     * `120` means the polygoon will look like a circle.
     *
     * NOTE: this setting is ignored if `type="rectangle"`.
     *
     * @default 120
     */
    cornerCount?: number;
    /**
     * Minimum weight ratio which allows computing the minimum allowed
     * weight (`= [maximum weight] * minWeightRatio`).
     *
     * Setting very small `minWeigtRatio` might result flickering.
     *
     * NOTE: the nodes that have smaller weight will be scaled up and will not
     * represent their true value correctly.
     *
     * @default 0.005
     */
    minWeightRatio?: number;
    /**
     * The convergence ratio in Voronoi treemaps measures how well the treemap
     * layout represents the hierarchical structure of the underlying data.
     *
     * It is calculated as the ratio of the summed area of the smallest enclosing
     * rectangle for each cell to the total area of the treemap. A lower
     * convergence ratio indicates a better representation of the hierarchy,
     * meaning that the cells are closely packed and the treemap effectively
     * captures the nested relationships between the data elements.
     *
     * @default 0.005
     */
    convergenceRatio?: number;
    /**
     * Maximum allowed number of iterations when computing the layout.
     *
     * Computation is stopped when it number of iterations is reached, even if
     * the `convergenceRatio` is not yet reached.
     *
     * Bigger number means finer results, but slower performance.
     *
     * @default 100
     */
    maxIterationCount?: number;
}
export interface IVoronoiTreemapPrivate extends IHierarchyPrivate {
}
/**
 * A Weighted Voronoi Treemap series.
 *
 * NOTE: Try to avoid a big number of data items with very big value
 * differences. Better group small items into "Other" item.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/voronoi-treemap/} for more info
 * @since 5.4.0
 */
export declare class VoronoiTreemap extends Hierarchy {
    _settings: IVoronoiTreemapSettings;
    _privateSettings: IVoronoiTreemapPrivate;
    _dataItemSettings: IVoronoiTreemapDataItem;
    protected _tag: string;
    static className: string;
    static classNames: Array<string>;
    /**
     * A list of node graphics elements in a [[VoronoiTreemap]] chart.
     *
     * @default new ListTemplate<RoundedRectangle>
     */
    readonly polygons: ListTemplate<Polygon>;
    voronoi: any;
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _updateNode(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _handleSingle(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>): HierarchyNode;
    protected _makeNode(dataItem: DataItem<this["_dataItemSettings"]>, node: HierarchyNode): void;
    protected getCirclePolygon(radius: number): number[][];
}
//# sourceMappingURL=VoronoiTreemap.d.ts.map