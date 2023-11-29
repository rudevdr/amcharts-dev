import type { HierarchyNode } from "./HierarchyNode";
import type { DataItem } from "../../core/render/Component";
import { Hierarchy, IHierarchyPrivate, IHierarchySettings, IHierarchyDataItem, IHierarchyDataObject } from "./Hierarchy";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { RoundedRectangle } from "../../core/render/RoundedRectangle";
import * as d3hierarchy from "d3-hierarchy";
export interface ITreemapDataObject {
    name?: string;
    value?: number;
    children?: ITreemapDataObject[];
    dataItem?: DataItem<ITreemapDataItem>;
}
export interface ITreemapDataItem extends IHierarchyDataItem {
    children: Array<DataItem<ITreemapDataItem>>;
    parent: DataItem<ITreemapDataItem>;
    d3HierarchyNode: d3hierarchy.HierarchyRectangularNode<IHierarchyDataObject>;
    rectangle: RoundedRectangle;
}
export interface ITreemapSettings extends IHierarchySettings {
    /**
     * Gap between nodes. In pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/treemap/#Margins}
     */
    nodePaddingInner?: number;
    /**
     * Gap between nodes and outer edge of the chart. In pixels.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/treemap/#Margins}
     */
    nodePaddingOuter?: number;
    /**
     * Gap between nodes and top edge.
     *
     * Will be ignored if `nodePaddingOuter` is set.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/treemap/#Margins}
     */
    nodePaddingTop?: number;
    /**
     * Gap between nodes and bottomedge.
     *
     * Will be ignored if `nodePaddingOuter` is set.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/treemap/#Margins}
     */
    nodePaddingBottom?: number;
    /**
     * Gap between nodes and left edge.
     *
     * Will be ignored if `nodePaddingOuter` is set.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/treemap/#Margins}
     */
    nodePaddingLeft?: number;
    /**
     * Gap between nodes and bottom edge.
     *
     * Will be ignored if `nodePaddingOuter` is set.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/treemap/#Margins}
     */
    nodePaddingRight?: number;
    /**
     * An algorithm to use when laying out node rectangles.
     *
     * @see {@link }
     * @default "squarify"
     */
    layoutAlgorithm?: "binary" | "squarify" | "slice" | "dice" | "sliceDice";
}
export interface ITreemapPrivate extends IHierarchyPrivate {
    /**
     * Current horizontal scale.
     */
    scaleX?: number;
    /**
     * Current vertical scale.
     */
    scaleY?: number;
}
/**
 * Treemap series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/treemap/} for more info
 */
export declare class Treemap extends Hierarchy {
    _settings: ITreemapSettings;
    _privateSettings: ITreemapPrivate;
    _dataItemSettings: ITreemapDataItem;
    protected _tag: string;
    static className: string;
    static classNames: Array<string>;
    readonly rectangleTemplate: Template<RoundedRectangle>;
    _treemapLayout: d3hierarchy.TreemapLayout<unknown>;
    _rootNode: d3hierarchy.HierarchyRectangularNode<ITreemapDataObject> | undefined;
    /**
     * A list of node rectangle elements in a [[Treemap]] chart.
     *
     * @default new ListTemplate<RoundedRectangle>
     */
    readonly rectangles: ListTemplate<RoundedRectangle>;
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _updateVisuals(): void;
    protected _updateNode(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateNodesScale(hierarchyNode: d3hierarchy.HierarchyRectangularNode<ITreemapDataObject>): void;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>): HierarchyNode;
    _zoom(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _selectDataItem(dataItem?: DataItem<this["_dataItemSettings"]>, downDepth?: number, skipDisptach?: boolean): void;
    protected _getVisibleNodes(dataItem: DataItem<this["_dataItemSettings"]>, maxDepth: number): DataItem<this["_dataItemSettings"]>[];
}
//# sourceMappingURL=Treemap.d.ts.map