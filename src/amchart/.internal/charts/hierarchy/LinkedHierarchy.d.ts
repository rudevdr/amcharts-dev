import type { DataItem } from "../../core/render/Component";
import type * as d3hierarchy from "d3-hierarchy";
import { Hierarchy, IHierarchySettings, IHierarchyDataItem, IHierarchyPrivate, IHierarchyEvents } from "./Hierarchy";
import { Container } from "../../core/render/Container";
import { LinkedHierarchyNode } from "./LinkedHierarchyNode";
import { HierarchyLink } from "./HierarchyLink";
import { Circle } from "../../core/render/Circle";
import { ListTemplate } from "../../core/util/List";
import type { IPoint } from "../../core/util/IPoint";
/**
 * @ignore
 */
export interface ILinkedHierarchyDataObject {
    name?: string;
    value?: number;
    children?: ILinkedHierarchyDataObject[];
    dataItem?: DataItem<ILinkedHierarchyDataItem>;
}
export interface ILinkedHierarchyDataItem extends IHierarchyDataItem {
    /**
     * An array of child data items.
     */
    children: Array<DataItem<ILinkedHierarchyDataItem>>;
    /**
     * A data item of a parent node.
     */
    parent: DataItem<ILinkedHierarchyDataItem>;
    /**
     * A related node.
     */
    node: LinkedHierarchyNode;
    /**
     * [[Circle]] element of the related node.
     */
    circle: Circle;
    /**
     * [[Circle]] element of the related node, representing outer circle.
     */
    outerCircle: Circle;
    /**
     * A [[HierarchyLink]] leading to parent node.
     */
    parentLink: HierarchyLink;
    /**
     * An [[HierarchyLink]] leading to parent node.
     */
    links: Array<HierarchyLink>;
    /**
     * An array of [[HierarchyLink]] objects leading to child nodes.
     */
    childLinks: Array<HierarchyLink>;
    /**
     * An array of IDs of directly linked nodes.
     */
    linkWith: Array<string>;
    /**
     * @ignore
     */
    d3HierarchyNode: d3hierarchy.HierarchyPointNode<ILinkedHierarchyDataObject>;
}
export interface ILinkedHierarchySettings extends IHierarchySettings {
    /**
     * A field in data which holds IDs of nodes to link with.
     */
    linkWithField?: string;
}
export interface ILinkedHierarchyPrivate extends IHierarchyPrivate {
}
export interface ILinkedHierarchyEvents extends IHierarchyEvents {
}
/**
 * A base class for linked hierarchy series.
 */
export declare abstract class LinkedHierarchy extends Hierarchy {
    static className: string;
    static classNames: Array<string>;
    _settings: ILinkedHierarchySettings;
    _privateSettings: ILinkedHierarchyPrivate;
    _dataItemSettings: ILinkedHierarchyDataItem;
    _events: ILinkedHierarchyEvents;
    protected _afterNew(): void;
    /**
     * A list of nodes in a [[LinkedHierarchy]] chart.
     *
     * @default new ListTemplate<LinkedHierarchyNode>
     */
    readonly nodes: ListTemplate<LinkedHierarchyNode>;
    /**
     * A list of node circle elements in a [[LinkedHierarchy]] chart.
     *
     * @default new ListTemplate<Circle>
     */
    readonly circles: ListTemplate<Circle>;
    /**
     * A list of node outer circle elements in a [[LinkedHierarchy]] chart.
     *
     * @default new ListTemplate<Circle>
     */
    readonly outerCircles: ListTemplate<Circle>;
    /**
     * A list of link elements in a [[LinkedHierarchy]] chart.
     *
     * @default new ListTemplate<HierarchyLink>
     */
    readonly links: ListTemplate<HierarchyLink>;
    /**
     * A [[Container]] that link elements are placed in.
     *
     * @default Container.new()
     */
    readonly linksContainer: Container;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>): LinkedHierarchyNode;
    _handleRadiusChange(): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    updateLinkWith(dataItems: Array<DataItem<this["_dataItemSettings"]>>): void;
    protected _getPoint(hierarchyNode: this["_dataItemSettings"]["d3HierarchyNode"]): IPoint;
    protected _animatePositions(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateNode(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Link two data items with a link element.
     *
     * @param   source    Source node data item
     * @param   target    Target node data item
     * @param   strength  Link strength
     * @return            Link element
     */
    linkDataItems(source: DataItem<this["_dataItemSettings"]>, target: DataItem<this["_dataItemSettings"]>, strength?: number): HierarchyLink;
    /**
     * Unlink two linked data items.
     *
     * @param   source  Source node data item
     * @param   target  Target node data item
     */
    unlinkDataItems(source: DataItem<this["_dataItemSettings"]>, target: DataItem<this["_dataItemSettings"]>): void;
    protected _handleUnlink(): void;
    protected _disposeLink(link: HierarchyLink): void;
    /**
     * Returns `true` if two nodes are linked with each other.
     */
    areLinked(source: DataItem<this["_dataItemSettings"]>, target: DataItem<this["_dataItemSettings"]>): boolean;
    protected _processLink(_link: HierarchyLink, _source: DataItem<this["_dataItemSettings"]>, _target: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Select a data item.
     * @param  dataItem  Data item
     */
    selectDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=LinkedHierarchy.d.ts.map