import type { DataItem } from "../../core/render/Component";
import type { Percent } from "../../core/util/Percent";
import type { HierarchyLink } from "./HierarchyLink";
import type * as d3Hierarchy from "d3-hierarchy";
import { LinkedHierarchy, ILinkedHierarchySettings, ILinkedHierarchyDataItem, ILinkedHierarchyPrivate, ILinkedHierarchyEvents } from "./LinkedHierarchy";
import * as d3Force from "d3-force";
/**
 * @ignore
 */
export interface IForceDirectedDataObject {
    name?: string;
    value?: number;
    children?: IForceDirectedDataObject[];
    dataItem?: DataItem<IForceDirectedDataItem>;
}
export interface IForceDirectedDataItem extends ILinkedHierarchyDataItem {
    /**
     * An array of data items of child nodes.
     */
    children: Array<DataItem<IForceDirectedDataItem>>;
    /**
     * Data item of a parent node.
     */
    parent: DataItem<IForceDirectedDataItem>;
    /**
     * @ignore
     */
    d3ForceNode: d3Force.SimulationNodeDatum;
    /**
     * X coordinate.
     */
    x: number | undefined;
    /**
     * Y coordinate.
     */
    y: number | undefined;
}
export interface IForceDirectedSettings extends ILinkedHierarchySettings {
    /**
     * Minimum gap in pixels between the nodes.
     */
    nodePadding?: number;
    /**
     * A force that attracts (or pushes back) all nodes to the center of the
     * chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Layout_and_force_simulation} for more info
     * @default 0.5
     */
    centerStrength?: number;
    /**
     * A force that attracts (or pushes back) all nodes to each other.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Layout_and_force_simulation} for more info
     * @default -15
     */
    manyBodyStrength?: number;
    /**
     * A force that attracts (or pushes back) nodes that are linked together
     * via `linkWithField`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Layout_and_force_simulation} for more info
     * @default 0.5
     */
    linkWithStrength?: number | undefined;
    /**
     * Resistance acting agains node speed.
     *
     * The greater the value, the more "sluggish" the nodes will be.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Layout_and_force_simulation} for more info
     * @default 0.5
     */
    velocityDecay?: number;
    /**
     * Length of how long initial force simulation would run in frames.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Layout_and_force_simulation} for more info
     * @default 500
     */
    initialFrames?: number;
    /**
     * If set to a number will wait X number of frames before revealing
     * the tree.
     *
     * Can be used to hide initial animations where nodes settle into their
     * places.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Layout_and_force_simulation} for more info
     * @default 10
     */
    showOnFrame?: number;
    /**
     * Smallest possible radius for a node circle.
     *
     * Can be a fixed pixel value or percent relative to chart size.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Sizing_nodes} for more info
     * @default 1%
     */
    minRadius?: number | Percent;
    /**
     * Biggest possible radius for a node circle.
     *
     * Can be a fixed pixel value or percent relative to chart size.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Sizing_nodes} for more info
     * @default 8%
     */
    maxRadius?: number | Percent;
    /**
     * Field in data that holds X coordinate of the node.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Fixed_nodes} for more info
     */
    xField?: string;
    /**
     * Field in data that holds X coordinate of the node.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/#Fixed_nodes} for more info
     */
    yField?: string;
}
export interface IForceDirectedPrivate extends ILinkedHierarchyPrivate {
}
export interface IForceDirectedEvents extends ILinkedHierarchyEvents {
}
/**
 * Creates a force-directed tree.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/force-directed/} for more info
 * @important
 */
export declare class ForceDirected extends LinkedHierarchy {
    protected _tag: string;
    /**
     * @ignore
     */
    readonly d3forceSimulation: d3Force.Simulation<{}, d3Force.SimulationLinkDatum<d3Force.SimulationNodeDatum>>;
    /**
     * @ignore
     */
    readonly collisionForce: d3Force.ForceCollide<d3Force.SimulationNodeDatum>;
    /**
     * @ignore
     */
    linkForce: d3Force.ForceLink<d3Force.SimulationNodeDatum, d3Force.SimulationLinkDatum<d3Force.SimulationNodeDatum>>;
    static className: string;
    static classNames: Array<string>;
    _settings: IForceDirectedSettings;
    _privateSettings: IForceDirectedPrivate;
    _dataItemSettings: IForceDirectedDataItem;
    _events: IForceDirectedEvents;
    protected _nodes: Array<any>;
    protected _links: Array<any>;
    protected _afterNew(): void;
    protected _tick: number;
    protected _nodesDirty: boolean;
    _prepareChildren(): void;
    /**
     * @ignore
     */
    restartSimulation(alpha: number): void;
    _handleRadiusChange(): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateValues(d3HierarchyNode: d3Hierarchy.HierarchyNode<IForceDirectedDataObject>): void;
    protected _updateVisuals(): void;
    _updateChildren(): void;
    _updateForces(): void;
    protected _animatePositions(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    _clearDirty(): void;
    /**
     * @ignore
     */
    updateNodePositions(): void;
    /**
     * @ignore
     */
    updateLinkWith(dataItems: Array<DataItem<this["_dataItemSettings"]>>): void;
    /**
     * @ignore
     */
    protected getDistance(linkDatum: any): number;
    /**
     * @ignore
     */
    protected getStrength(linkDatum: any): number;
    protected _updateNode(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateRadius(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _processLink(link: HierarchyLink, source: DataItem<this["_dataItemSettings"]>, target: DataItem<this["_dataItemSettings"]>): void;
    protected _disposeLink(link: HierarchyLink): void;
    protected _handleUnlink(): void;
    protected _onDataClear(): void;
}
//# sourceMappingURL=ForceDirected.d.ts.map