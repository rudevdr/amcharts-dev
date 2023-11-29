import type { DataItem } from "../../core/render/Component";
import type { FlowNode } from "./FlowNode";
import type { Chord } from "./Chord";
import type { Bullet } from "../../core/render/Bullet";
import { FlowNodes, IFlowNodesSettings, IFlowNodesDataItem, IFlowNodesPrivate, IFlowNodesEvents } from "./FlowNodes";
import { Slice } from "../../core/render/Slice";
import { ListTemplate } from "../../core/util/List";
import { RadialLabel } from "../../core/render/RadialLabel";
export interface IChordNodesDataItem extends IFlowNodesDataItem {
    /**
     * Node [[Slice]] element.
     */
    slice: Slice;
    /**
     * Node label element.
     */
    label: RadialLabel;
}
export interface IChordNodesSettings extends IFlowNodesSettings {
}
export interface IChordNodesPrivate extends IFlowNodesPrivate {
}
export interface IChordNodesEvents extends IFlowNodesEvents {
}
/**
 * Holds instances of nodes for a [[Chord]] series.
 */
export declare class ChordNodes extends FlowNodes {
    static className: string;
    static classNames: Array<string>;
    /**
     * List of label elements.
     *
     * @default new ListTemplate<RadialLabel>
     */
    readonly labels: ListTemplate<RadialLabel>;
    _settings: IChordNodesSettings;
    _privateSettings: IChordNodesPrivate;
    _dataItemSettings: IChordNodesDataItem;
    _events: IChordNodesEvents;
    /**
     * Related [[Chord]] series.
     */
    flow: Chord | undefined;
    protected _dAngle: number;
    /**
     * List of slice elements.
     *
     * @default new ListTemplate<Slice>
     */
    readonly slices: ListTemplate<Slice>;
    /**
     * @ignore
     * added to solve old naming bug
     */
    readonly rectangles: ListTemplate<Slice>;
    /**
     * @ignore
     */
    makeNode(dataItem: DataItem<this["_dataItemSettings"]>): FlowNode;
    _positionBullet(bullet: Bullet): void;
    _updateNodeColor(dataItem: DataItem<this["_dataItemSettings"]>): void;
    /**
     * @ignore
     */
    disposeDataItem(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=ChordNodes.d.ts.map