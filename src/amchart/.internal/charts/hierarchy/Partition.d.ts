import type { HierarchyNode } from "./HierarchyNode";
import type { DataItem } from "../../core/render/Component";
import { Hierarchy, IHierarchyPrivate, IHierarchySettings, IHierarchyDataItem, IHierarchyDataObject } from "./Hierarchy";
import { ListTemplate } from "../../core/util/List";
import { RoundedRectangle } from "../../core/render/RoundedRectangle";
import * as d3hierarchy from "d3-hierarchy";
/**
 * @ignore
 */
export interface IPartitionDataObject {
    name?: string;
    value?: number;
    children?: IPartitionDataObject[];
    dataItem?: DataItem<IPartitionDataItem>;
}
export interface IPartitionDataItem extends IHierarchyDataItem {
    /**
     * Data items of child nodes.
     */
    children: Array<DataItem<IPartitionDataItem>>;
    /**
     * Data it of a parent node.
     */
    parent: DataItem<IPartitionDataItem>;
    /**
     * @ignore
     */
    d3HierarchyNode: d3hierarchy.HierarchyRectangularNode<IHierarchyDataObject>;
    /**
     * A [[RoundedRectangle]] element of a node.
     */
    rectangle: RoundedRectangle;
}
export interface IPartitionSettings extends IHierarchySettings {
    /**
     * Gap between nodes in pixels.
     *
     * @default 0
     */
    nodePadding?: number;
    /**
     * Orientation of the diagram.
     *
     * @default "vertical"
     */
    orientation?: "horizontal" | "vertical";
}
export interface IPartitionPrivate extends IHierarchyPrivate {
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
 * Partition series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/partition/} for more info
 */
export declare class Partition extends Hierarchy {
    _settings: IPartitionSettings;
    _privateSettings: IPartitionPrivate;
    _dataItemSettings: IPartitionDataItem;
    protected _tag: string;
    static className: string;
    static classNames: Array<string>;
    /**
     * A list of node rectangle elements in a [[Partition]] chart.
     *
     * @default new ListTemplate<RoundedRectangle>
     */
    readonly rectangles: ListTemplate<RoundedRectangle>;
    _partitionLayout: d3hierarchy.PartitionLayout<unknown>;
    _rootNode: d3hierarchy.HierarchyRectangularNode<IPartitionDataObject> | undefined;
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _updateVisuals(): void;
    protected _updateNode(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateNodesScale(hierarchyNode: d3hierarchy.HierarchyRectangularNode<IPartitionDataObject>): void;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>): HierarchyNode;
    protected _makeNode(dataItem: DataItem<this["_dataItemSettings"]>, node: HierarchyNode): void;
    protected _zoom(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=Partition.d.ts.map