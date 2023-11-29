import type { DataItem } from "../../core/render/Component";
import { Flow, IFlowSettings, IFlowDataItem, IFlowPrivate, IFlowEvents } from "./Flow";
import { RibbonGenerator, RibbonSubgroup, Ribbon } from "d3-chord";
import { ListTemplate } from "../../core/util/List";
import { ChordNodes, IChordNodesDataItem } from "./ChordNodes";
import { ChordLink } from "./ChordLink";
import { Percent } from "../../core/util/Percent";
export interface IChordDataItem extends IFlowDataItem {
    /**
     * A link element.
     */
    link: ChordLink;
    /**
     * Source node data item.
     */
    source: DataItem<IChordNodesDataItem>;
    /**
     * Target node data item.
     */
    target: DataItem<IChordNodesDataItem>;
}
export interface IChordSettings extends IFlowSettings {
    /**
     * Angle of a gap between each node, in degrees.
     *
     * @default 1
     */
    padAngle?: number;
    /**
     * Radius of the diagram in percent or pixels.
     *
     * If set in percent, it will be relative to the whole area available for
     * the series.
     *
     * @default 90%
     */
    radius?: number | Percent;
    /**
     * The thickness of node strip in pixels.
     *
     * @default 10
     */
    nodeWidth?: number;
    /**
     * Starting angle in degrees.
     *
     * @default 0
     */
    startAngle?: number;
    /**
     * How to sort nodes by their value.
     *
     * @default "descending"
     */
    sort?: "ascending" | "descending" | "none";
}
export interface IChordPrivate extends IFlowPrivate {
}
export interface IChordEvents extends IFlowEvents {
}
/**
 * Regular chord series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export declare class Chord extends Flow {
    static className: string;
    static classNames: Array<string>;
    /**
     * List of link elements.
     *
     * @default new ListTemplate<ChordLink>
     */
    readonly links: ListTemplate<ChordLink>;
    /**
     * A series for all chord nodes.
     *
     * @default ChordNodes.new()
     */
    readonly nodes: ChordNodes;
    _settings: IChordSettings;
    _privateSettings: IChordPrivate;
    _dataItemSettings: IChordDataItem;
    _events: IChordEvents;
    _d3chord: import("d3-chord").ChordLayout;
    _chordLayout: {
        source: {
            index: number;
            startAngle: number;
            endAngle: number;
            value: number;
        };
        target: {
            index: number;
            startAngle: number;
            endAngle: number;
            value: number;
        };
    }[];
    _ribbon: RibbonGenerator<any, Ribbon, RibbonSubgroup>;
    protected _afterNew(): void;
    protected _fixRibbon(ribbon: RibbonGenerator<any, Ribbon, RibbonSubgroup>): void;
    /**
     * @ignore
     */
    makeLink(dataItem: DataItem<this["_dataItemSettings"]>): ChordLink;
    protected _makeMatrix(): number[][];
    _prepareChildren(): void;
    protected _getLinkPoints(link: ChordLink, linkRadius: number, chordLayoutItem: any): void;
    protected _updateLink(ribbon: RibbonGenerator<any, Ribbon, RibbonSubgroup>, link: ChordLink, linkRadius: number, chordLayoutItem: any): void;
}
//# sourceMappingURL=Chord.d.ts.map