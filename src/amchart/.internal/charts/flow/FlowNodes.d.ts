import type { DataItem } from "../../core/render/Component";
import type { Color } from "../../core/util/Color";
import type { Time } from "../../core/util/Animation";
import type { Flow, IFlowDataItem } from "./Flow";
import type * as d3sankey from "d3-sankey";
import { Label } from "../../core/render/Label";
import { Series, ISeriesSettings, ISeriesDataItem, ISeriesPrivate, ISeriesEvents } from "../../core/render/Series";
import { ListTemplate } from "../../core/util/List";
import { FlowNode } from "./FlowNode";
import type { ColorSet } from "../../core/util/ColorSet";
export interface IFlowNodesDataItem extends ISeriesDataItem {
    /**
     * Node name.
     */
    name: string;
    /**
     * An associated node instance.
     */
    node: FlowNode;
    /**
     * Node label.
     */
    label: Label;
    /**
     * Node color.
     */
    fill: Color;
    /**
     * Indicates "unknown" node.
     */
    unknown: boolean;
    /**
     * @ignore
     */
    d3SankeyNode: d3sankey.SankeyNode<d3sankey.SankeyExtraProperties, d3sankey.SankeyExtraProperties>;
    /**
     * Sum of values of all incoming links.
     */
    sumIncoming: number;
    /**
     * Sum of values of all outgoing links.
     */
    sumOutgoing: number;
    /**
     * @ignore
     */
    sumIncomingWorking: number;
    /**
     * @ignore
     */
    sumOutgoingWorking: number;
    /**
     * Sum of values of all links: incoming and outgoing.
     */
    sum: number;
    /**
     * @ignore
     */
    sumWorking: number;
    /**
     * A list of incoming link data items.
     */
    incomingLinks: Array<DataItem<IFlowDataItem>>;
    /**
     * A list of outgoing link data items.
     */
    outgoingLinks: Array<DataItem<IFlowDataItem>>;
    /**
     * Depth of the node.
     */
    depth: number;
}
export interface IFlowNodesSettings extends ISeriesSettings {
    /**
     * A field in data boolean setting if the node is "unknown".
     *
     * @default "unknown"
     */
    unknownField?: string;
    /**
     * A field in data that holds name for the node.
     *
     * @default "id"
     */
    nameField?: string;
    /**
     * A field in data that holds boolean value indicating if node is
     * disabled (collapsed).
     *
     * @since 5.4.2
     */
    disabledField?: string;
    /**
     * A field in data that holds color used for fills nodes.
     *
     * @default "fill"
     */
    fillField?: string;
    /**
     * A [[ColorSet]] that series will use to apply to its nodes.
     */
    colors?: ColorSet;
    /**
     * Animation duration in ms.
     */
    animationDuration?: number;
    /**
     * Easing function to use for node animations.
     */
    animationEasing?: (t: Time) => Time;
}
export interface IFlowNodesPrivate extends ISeriesPrivate {
}
export interface IFlowNodesEvents extends ISeriesEvents {
}
/**
 * Holds instances of nodes for a [[Flow]] series.
 */
export declare abstract class FlowNodes extends Series {
    static className: string;
    static classNames: Array<string>;
    _settings: IFlowNodesSettings;
    _privateSettings: IFlowNodesPrivate;
    _dataItemSettings: IFlowNodesDataItem;
    _events: IFlowNodesEvents;
    /**
     * List of label elements.
     *
     * @default new ListTemplate<Label>
     */
    readonly labels: ListTemplate<Label>;
    /**
     * List of node elements.
     *
     * @default new ListTemplate<FlowNode>
     */
    readonly nodes: ListTemplate<FlowNode>;
    /**
     * Related [[Flow]] series.
     */
    abstract flow: Flow | undefined;
    _userDataSet: boolean;
    protected _afterNew(): void;
    protected _onDataClear(): void;
    protected processDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>, themeTag?: string): FlowNode;
    _updateNodeColor(_dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    addincomingLink(dataItem: DataItem<this["_dataItemSettings"]>, link: DataItem<IFlowDataItem>): void;
    /**
     * @ignore
     */
    addOutgoingLink(dataItem: DataItem<this["_dataItemSettings"]>, link: DataItem<IFlowDataItem>): void;
    /**
     * Shows node's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    showDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    hideDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Shows node's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    enableDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
    /**
     * Hides series's data item.
     *
     * @param   dataItem  Data item
     * @param   duration  Animation duration in milliseconds
     * @return            Promise
     */
    disableDataItem(dataItem: DataItem<this["_dataItemSettings"]>, duration?: number): Promise<void>;
}
//# sourceMappingURL=FlowNodes.d.ts.map