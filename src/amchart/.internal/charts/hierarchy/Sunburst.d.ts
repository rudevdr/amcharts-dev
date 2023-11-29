import type { Root } from "../../core/Root";
import type { DataItem } from "../../core/render/Component";
import type { HierarchyNode } from "./HierarchyNode";
import type { Bullet } from "../../core/render/Bullet";
import type { Series } from "../../core/render/Series";
import { Partition, IPartitionPrivate, IPartitionSettings, IPartitionDataItem } from "./Partition";
import { ListTemplate } from "../../core/util/List";
import { Slice } from "../../core/render/Slice";
import { RadialLabel } from "../../core/render/RadialLabel";
import { Percent } from "../../core/util/Percent";
import * as d3hierarchy from "d3-hierarchy";
/**
 * @ignore
 */
export interface ISunburstDataObject {
    name?: string;
    value?: number;
    children?: ISunburstDataObject[];
    dataItem?: DataItem<ISunburstDataItem>;
}
export interface ISunburstDataItem extends IPartitionDataItem {
    /**
     * Data items of child nodes.
     */
    children: Array<DataItem<ISunburstDataItem>>;
    /**
     * Data item of a parent node.
     */
    parent: DataItem<ISunburstDataItem>;
    /**
     * @ignore
     */
    d3PartitionNode: d3hierarchy.HierarchyRectangularNode<ISunburstDataObject>;
    /**
     * A [[Slice]] element of the node.
     */
    slice: Slice;
}
export interface ISunburstSettings extends IPartitionSettings {
    /**
     * Start angle of the series.
     *
     * @default -90
     */
    startAngle?: number;
    /**
     * End angle of the series.
     *
     * @default 270
     */
    endAngle?: number;
    /**
     * Inner radius of the suburst pie.
     *
     * Setting to negative number will mean pixels from outer radius.
     *
     * @default 0
     */
    innerRadius?: number | Percent;
    /**
     * Outer radius of the sunburst pie.
     *
     * @default 100%
     */
    radius?: number | Percent;
}
export interface ISunburstPrivate extends IPartitionPrivate {
    /**
     * @ignore
     */
    dr: number;
    /**
     * @ignore
     */
    dx: number;
    /**
     * @ignore
     */
    innerRadius: number;
    /**
     * @ignore
     */
    hierarchySize?: number;
}
/**
 * Builds a sunburst diagram.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/sunburst/} for more info
 * @important
 */
export declare class Sunburst extends Partition {
    _settings: ISunburstSettings;
    _privateSettings: ISunburstPrivate;
    _dataItemSettings: ISunburstDataItem;
    protected _tag: string;
    static className: string;
    static classNames: Array<string>;
    _partitionLayout: d3hierarchy.PartitionLayout<unknown>;
    _rootNode: d3hierarchy.HierarchyRectangularNode<ISunburstDataObject> | undefined;
    /**
     * A list of node slice elements in a [[Sunburst]] chart.
     *
     * @default new ListTemplate<Slice>
     */
    readonly slices: ListTemplate<Slice>;
    /**
     * A list of label elements in a [[Hierarchy]] chart.
     *
     * @default new ListTemplate<RadialLabel>
     */
    readonly labels: ListTemplate<RadialLabel>;
    protected _afterNew(): void;
    _prepareChildren(): void;
    protected _updateVisuals(): void;
    protected _updateNode(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateNodesScale(hierarchyNode: d3hierarchy.HierarchyRectangularNode<ISunburstDataObject>): void;
    protected _makeNode(dataItem: DataItem<this["_dataItemSettings"]>, node: HierarchyNode): void;
    protected _updateLabel(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _zoom(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _handleSingle(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _positionBullet(bullet: Bullet): void;
    protected _makeBullet(dataItem: DataItem<this["_dataItemSettings"]>, bulletFunction: (root: Root, series: Series, dataItem: DataItem<this["_dataItemSettings"]>) => Bullet | undefined, index?: number): Bullet | undefined;
}
//# sourceMappingURL=Sunburst.d.ts.map