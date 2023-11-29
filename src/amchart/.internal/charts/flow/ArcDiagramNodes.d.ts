import type { DataItem } from "../../core/render/Component";
import type { FlowNode } from "./FlowNode";
import type { ArcDiagram } from "./ArcDiagram";
import { FlowNodes, IFlowNodesSettings, IFlowNodesDataItem, IFlowNodesPrivate, IFlowNodesEvents } from "./FlowNodes";
import { Circle } from "../../core/render/Circle";
import { ListTemplate } from "../../core/util/List";
import { Label } from "../../core/render/Label";
export interface IArcDiagramNodesDataItem extends IFlowNodesDataItem {
    /**
     * Node [[Circle]] element.
     */
    circle: Circle;
    /**
     * Node label element.
     */
    label: Label;
}
export interface IArcDiagramNodesSettings extends IFlowNodesSettings {
}
export interface IArcDiagramNodesPrivate extends IFlowNodesPrivate {
}
export interface IArcDiagramNodesEvents extends IFlowNodesEvents {
}
/**
 * Holds instances of nodes for a [[ArcDiagram]] series.
 */
export declare class ArcDiagramNodes extends FlowNodes {
    static className: string;
    static classNames: Array<string>;
    /**
     * List of label elements.
     *
     * @default new ListTemplate<Label>
     */
    readonly labels: ListTemplate<Label>;
    _settings: IArcDiagramNodesSettings;
    _privateSettings: IArcDiagramNodesPrivate;
    _dataItemSettings: IArcDiagramNodesDataItem;
    _events: IArcDiagramNodesEvents;
    /**
     * Related [[ArcDiagram]] series.
     */
    flow: ArcDiagram | undefined;
    protected _dAngle: number;
    /**
     * List of slice elements.
     *
     * @default new ListTemplate<Slice>
     */
    readonly circles: ListTemplate<Circle>;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>): FlowNode;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
    _updateNodeColor(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=ArcDiagramNodes.d.ts.map