import type { DataItem } from "../../core/render/Component";
import type { IPoint } from "../../core/util/IPoint";
import { LinkedHierarchy, ILinkedHierarchyPrivate, ILinkedHierarchySettings, ILinkedHierarchyDataItem, ILinkedHierarchyEvents } from "./LinkedHierarchy";
import * as d3hierarchy from "d3-hierarchy";
export interface ITreeDataObject {
    name?: string;
    value?: number;
    children?: ITreeDataObject[];
    dataItem?: DataItem<ITreeDataItem>;
}
export interface ITreeDataItem extends ILinkedHierarchyDataItem {
    /**
     * An array of children data items.
     */
    children: Array<DataItem<ITreeDataItem>>;
    /**
     * Parent data item.
     * @type {DataItem<ITreeDataItem>}
     */
    parent: DataItem<ITreeDataItem>;
}
export interface ITreeSettings extends ILinkedHierarchySettings {
    /**
     * Orientation of the diagram.
     *
     * @default "vertical"
     */
    orientation?: "horizontal" | "vertical";
    /**
     * If set to `true`, will flip the tree direction.
     *
     * @default false
     * @since 5.2.4
     */
    inversed?: boolean;
}
export interface ITreePrivate extends ILinkedHierarchyPrivate {
    /**
     * Current horizontal scale.
     */
    scaleX?: number;
    /**
     * Current vertical scale.
     */
    scaleY?: number;
}
export interface ITreeEvents extends ILinkedHierarchyEvents {
}
/**
 * Displays a tree diagram.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/tree/} for more info
 * @important
 */
export declare class Tree extends LinkedHierarchy {
    _settings: ITreeSettings;
    _privateSettings: ITreePrivate;
    _dataItemSettings: ITreeDataItem;
    protected _tag: string;
    static className: string;
    static classNames: Array<string>;
    _hierarchyLayout: d3hierarchy.TreeLayout<unknown>;
    _rootNode: d3hierarchy.HierarchyCircularNode<ITreeDataObject> | undefined;
    _packData: ITreeDataObject | undefined;
    _prepareChildren(): void;
    protected _updateVisuals(): void;
    protected _getPoint(hierarchyNode: this["_dataItemSettings"]["d3HierarchyNode"]): IPoint;
}
//# sourceMappingURL=Tree.d.ts.map