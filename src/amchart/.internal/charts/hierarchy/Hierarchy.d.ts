import type { Color } from "../../core/util/Color";
import type { ColorSet } from "../../core/util/ColorSet";
import type { Bullet } from "../../core/render/Bullet";
import type { Root } from "../../core/Root";
import type { Easing } from "../../core/util/Ease";
import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate, ISeriesEvents } from "../../core/render/Series";
import { DataItem } from "../../core/render/Component";
import { HierarchyNode } from "./HierarchyNode";
import { Container } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
import { ListTemplate } from "../../core/util/List";
import * as d3hierarchy from "d3-hierarchy";
/**
 * @ignore
 */
export interface IHierarchyDataObject {
    name?: string;
    value?: number;
    children?: IHierarchyDataObject[];
    dataItem?: DataItem<IHierarchyDataItem>;
    customValue?: boolean;
}
export interface IHierarchyDataItem extends ISeriesDataItem {
    /**
     * Value of the node as set in data.
     */
    value: number;
    /**
     * @ignore
     */
    valueWorking: number;
    /**
     * Percent value of the node, based on total sum of all nodes in upper level.
     */
    valuePercentTotal: number;
    /**
     * Percent value of the node, based on the value of its direct parent.
     *
     * @since 5.2.21
     */
    valuePercent: number;
    /**
     * Sum of child values.
     */
    sum: number;
    /**
     * Category.
     */
    category: string;
    /**
     * List of child node data items.
     */
    children: Array<DataItem<IHierarchyDataItem>>;
    /**
     * Raw data of the node's children.
     */
    childData: Array<any>;
    /**
     * Data item of parent node.
     */
    parent: DataItem<IHierarchyDataItem>;
    /**
     * Node's depth within the hierarchy.
     */
    depth: number;
    /**
     * A reference to the related [[HierarchyNode]].
     */
    node: HierarchyNode;
    /**
     * A reference to node's [[Label]].
     */
    label: Label;
    /**
     * Node's auto-assigned color.
     */
    fill: Color;
    /**
     * Indicates if node is currently disabled.
     */
    disabled: boolean;
    /**
     * @ignore
     */
    d3HierarchyNode: d3hierarchy.HierarchyNode<IHierarchyDataObject>;
}
export interface IHierarchySettings extends ISeriesSettings {
    /**
     * How to sort nodes by their value.
     *
     * @default "none"
     */
    sort?: "ascending" | "descending" | "none";
    /**
     * A field in data that holds numeric value for the node.
     */
    valueField?: string;
    /**
     * A field in data that holds string-based identificator for node.
     */
    categoryField?: string;
    /**
     * A field in data that holds an array of child node data.
     */
    childDataField?: string;
    /**
     * A field in data that holds boolean value indicating if node is
     * disabled (collapsed).
     */
    disabledField?: string;
    /**
     * A field in data that holds color used for fills for various elements, such
     * as nodes.
     */
    fillField?: string;
    /**
     * A [[ColorSet]] to use when asigning colors for nodes.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/#Node_colors} for more info
     */
    colors?: ColorSet;
    /**
     * Number of child levels to open when clicking on a node.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/#Drill_down} for more info
     */
    downDepth?: number;
    /**
     * Number of levels parent levels to show from currently selected node.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/#Drill_down} for more info
     */
    upDepth?: number;
    /**
     * Number of levels to show on chart's first load.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/#Tree_depth} for more info
     */
    initialDepth?: number;
    /**
     * If set, will show nodes starting from set level.
     *
     * It could be used to eliminate top level branches, that do not need to be
     * shown.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/#Tree_depth} for more info
     */
    topDepth?: number;
    /**
     * If set to `true` will make all other branches collapse when some branch is
     * expanded.
     */
    singleBranchOnly?: boolean;
    /**
     * A data item for currently selected node.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/#Pre_selected_branch} for more info
     */
    selectedDataItem?: DataItem<IHierarchyDataItem>;
    /**
     * Duration for all drill animations in milliseconds.
     */
    animationDuration?: number;
    /**
     * An easing function to use for drill animations.
     */
    animationEasing?: Easing;
}
export interface IHierarchyPrivate extends ISeriesPrivate {
    /**
     * Level count in series.
     */
    maxDepth: number;
}
export interface IHierarchyEvents extends ISeriesEvents {
    dataitemselected: {
        dataItem?: DataItem<IHierarchyDataItem>;
    };
}
/**
 * A base class for all hierarchy charts.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/} for more info
 */
export declare abstract class Hierarchy extends Series {
    static className: string;
    static classNames: Array<string>;
    _settings: IHierarchySettings;
    _privateSettings: IHierarchyPrivate;
    _dataItemSettings: IHierarchyDataItem;
    _events: IHierarchyEvents;
    /**
     * A [[Container]] that nodes are placed in.
     *
     * @default Container.new()
     */
    readonly nodesContainer: Container;
    _rootNode: d3hierarchy.HierarchyNode<IHierarchyDataObject> | undefined;
    _treeData: IHierarchyDataObject | undefined;
    protected _index: number;
    protected _tag: string;
    /**
     * A list of nodes in a [[Hierarchy]] chart.
     *
     * @default new ListTemplate<HierarchyNode>
     */
    readonly nodes: ListTemplate<HierarchyNode>;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>): HierarchyNode;
    /**
     * A list of label elements in a [[Hierarchy]] chart.
     *
     * @default new ListTemplate<Label>
     */
    readonly labels: ListTemplate<Label>;
    _currentDownDepth: number | undefined;
    protected _afterNew(): void;
    _prepareChildren(): void;
    _changed(): void;
    protected _updateVisuals(): void;
    protected _updateNodes(hierarchyNode: d3hierarchy.HierarchyNode<IHierarchyDataObject>): void;
    protected _updateNode(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Looks up and returns a data item by its ID.
     *
     * @param   id  ID
     * @return      Data item
     */
    getDataItemById(id: string): DataItem<this["_dataItemSettings"]> | undefined;
    _getDataItemById(dataItems: Array<DataItem<this["_dataItemSettings"]>>, id: string): DataItem<this["_dataItemSettings"]> | undefined;
    protected _handleBullets(dataItems: Array<DataItem<this["_dataItemSettings"]>>): void;
    protected _onDataClear(): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Adds children data to the target data item.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/hierarchy-api/#Dynamically_adding_child_nodes} for more info
     * @since 5.4.5
     */
    addChildData(dataItem: DataItem<this["_dataItemSettings"]>, data: Array<any>): void;
    protected _processDataItem(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _updateValues(d3HierarchyNode: d3hierarchy.HierarchyNode<IHierarchyDataObject>): void;
    protected _makeHierarchyData(data: IHierarchyDataObject, dataItem: DataItem<IHierarchyDataItem>): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Hides hierarchy's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Shows hierarchy's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Enables a disabled data item.
     *
     * @param  dataItem  Target data item
     * @param  duration  Animation duration in milliseconds
     */
    enableDataItem(dataItem: DataItem<this["_dataItemSettings"]>, maxDepth?: number, depth?: number, duration?: number): void;
    /**
     * Disables a data item.
     *
     * @param  dataItem  Target data item
     * @param  duration  Animation duration in milliseconds
     */
    disableDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): void;
    protected _selectDataItem(dataItem?: DataItem<this["_dataItemSettings"]>, downDepth?: number, skipDisptach?: boolean): void;
    protected _zoom(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _handleSingle(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Selects specific data item.
     *
     * @param  dataItem  Target data item
     */
    selectDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _makeBullet(dataItem: DataItem<this["_dataItemSettings"]>, bulletFunction: (root: Root, series: Series, dataItem: DataItem<this["_dataItemSettings"]>) => Bullet | undefined, index?: number): Bullet | undefined;
    _positionBullet(bullet: Bullet): void;
    /**
     * Triggers hover on a series data item.
     *
     * @since 5.0.7
     * @param  dataItem  Target data item
     */
    hoverDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * Triggers un-hover on a series data item.
     *
     * @since 5.0.7
     * @param  dataItem  Target data item
     */
    unhoverDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=Hierarchy.d.ts.map