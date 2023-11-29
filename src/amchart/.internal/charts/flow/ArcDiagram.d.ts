import type { DataItem } from "../../core/render/Component";
import { Flow, IFlowSettings, IFlowDataItem, IFlowPrivate, IFlowEvents } from "./Flow";
import { ListTemplate } from "../../core/util/List";
import { ArcDiagramNodes, IArcDiagramNodesDataItem } from "./ArcDiagramNodes";
import { ArcDiagramLink } from "./ArcDiagramLink";
import type { Easing } from "../../core/util/Ease";
export interface IArcDiagramDataItem extends IFlowDataItem {
    /**
     * A link element.
     */
    link: ArcDiagramLink;
    /**
     * Source node data item.
     */
    source: DataItem<IArcDiagramNodesDataItem>;
    /**
     * Target node data item.
     */
    target: DataItem<IArcDiagramNodesDataItem>;
}
export interface IArcDiagramSettings extends IFlowSettings {
    /**
     * Orientation of the series. This setting can not be changed after the chart is initialized.
     *
     * @default "horizontal"
     */
    orientation: "horizontal" | "vertical";
    /**
     * Minimum radius of a nodes circle.
     * Maximum radius is computed based on available space
     * @default 5
     */
    minRadius?: number;
    /**
     * Defines Which value should be used when calculating circle radius. Use "none" if you want all circles to be the same.
     * @martynas: gal cia reik naudot radiusField, biski no idea.
     * @default "sum"
     */
    radiusKey?: "sum" | "sumIncoming" | "sumOutgoing" | "none";
    /**
     * Duration for all drill animations in milliseconds.
     */
    animationDuration?: number;
    /**
     * An easing function to use for drill animations.
     */
    animationEasing?: Easing;
}
export interface IArcDiagramPrivate extends IFlowPrivate {
}
export interface IArcDiagramEvents extends IFlowEvents {
}
/**
 * Regular ArcDiagram series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export declare class ArcDiagram extends Flow {
    static className: string;
    static classNames: Array<string>;
    /**
     * List of link elements.
     *
     * @default new ListTemplate<ArcDiagramLink>
     */
    readonly links: ListTemplate<ArcDiagramLink>;
    /**
     * A series for all ArcDiagram nodes.
     *
     * @default ArcDiagramNodes.new()
     */
    readonly nodes: ArcDiagramNodes;
    _settings: IArcDiagramSettings;
    _privateSettings: IArcDiagramPrivate;
    _dataItemSettings: IArcDiagramDataItem;
    _events: IArcDiagramEvents;
    protected _afterNew(): void;
    /**
     * @ignore
     */
    makeLink(dataItem: DataItem<this["_dataItemSettings"]>): ArcDiagramLink;
    _prepareChildren(): void;
    _updateLinkColor(dataItem: DataItem<this["_dataItemSettings"]>): void;
}
//# sourceMappingURL=ArcDiagram.d.ts.map