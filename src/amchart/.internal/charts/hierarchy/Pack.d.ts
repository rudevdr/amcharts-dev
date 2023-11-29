import type { DataItem } from "../../core/render/Component";
import type { HierarchyNode } from "./HierarchyNode";
import { Hierarchy, IHierarchyPrivate, IHierarchySettings, IHierarchyDataItem, IHierarchyEvents } from "./Hierarchy";
import { Circle } from "../../core/render/Circle";
import { ListTemplate } from "../../core/util/List";
import * as d3hierarchy from "d3-hierarchy";
/**
 * @ignore
 */
export interface IPackDataObject {
    name?: string;
    value?: number;
    children?: IPackDataObject[];
    dataItem?: DataItem<IPackDataItem>;
}
export interface IPackDataItem extends IHierarchyDataItem {
    /**
     * An array of data items of node's children.
     */
    children: Array<DataItem<IPackDataItem>>;
    /**
     * A data item of node's parent.
     */
    parent: DataItem<IPackDataItem>;
    /**
     * @ignore
     */
    d3HierarchyNode: d3hierarchy.HierarchyCircularNode<IPackDataObject>;
    /**
     * A [[Circle]] element of the node.
     */
    circle: Circle;
}
export interface IPackSettings extends IHierarchySettings {
    /**
     * Gap between nodes, in pixels.
     *
     * @since 5.2.6
     */
    nodePadding?: number;
}
export interface IPackPrivate extends IHierarchyPrivate {
    /**
     * @ignore
     */
    scaleR?: number;
}
export interface IPackEvents extends IHierarchyEvents {
}
/**
 * Builds a pack diagram.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/sunburst/} for more info
 * @important
 */
export declare class Pack extends Hierarchy {
    _settings: IPackSettings;
    _privateSettings: IPackPrivate;
    _dataItemSettings: IPackDataItem;
    protected _tag: string;
    static className: string;
    static classNames: Array<string>;
    _packLayout: d3hierarchy.PackLayout<unknown>;
    _rootNode: d3hierarchy.HierarchyCircularNode<IPackDataObject> | undefined;
    _packData: IPackDataObject | undefined;
    /**
     * A list of node circle elements in a [[Pack]] chart.
     *
     * @default new ListTemplate<Circle>
     */
    readonly circles: ListTemplate<Circle>;
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _updateVisuals(): void;
    protected _updateNode(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateNodesScale(hierarchyNode: d3hierarchy.HierarchyCircularNode<IPackDataObject>): void;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>): HierarchyNode;
    _zoom(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=Pack.d.ts.map