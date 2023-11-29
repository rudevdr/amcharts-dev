import type { DataItem } from "../../core/render/Component";
import { Flow, IFlowSettings, IFlowDataItem, IFlowPrivate, IFlowEvents } from "./Flow";
import { SankeyNodes, ISankeyNodesDataItem } from "./SankeyNodes";
import { SankeyLink } from "./SankeyLink";
import { ListTemplate } from "../../core/util/List";
import * as d3sankey from "d3-sankey";
import type { Bullet } from "../../core/render/Bullet";
export interface ISankeyDataItem extends IFlowDataItem {
    /**
     * Link element.
     */
    link: SankeyLink;
    /**
     * Source node data item.
     */
    source: DataItem<ISankeyNodesDataItem>;
    /**
     * Target node data item.
     */
    target: DataItem<ISankeyNodesDataItem>;
}
export interface ISankeySettings extends IFlowSettings {
    /**
     * Orientation of the series.
     *
     * @default "horizontal"
     */
    orientation?: "horizontal" | "vertical";
    /**
     * Alignment of nodes.
     *
     * @default "left"
     */
    nodeAlign?: "left" | "right" | "justify" | "center";
    /**
     * Tension setting of the link curve.
     *
     * Accepts values from `0` to `1`.
     *
     * `1` will result in perfectly straight lines.
     *
     * @default 0.5
     */
    linkTension?: number;
    /**
     * A custom function to use when sorting nodes.
     *
     * @todo test
     * @ignore
     */
    nodeSort?: (a: d3sankey.SankeyNodeMinimal<{}, {}>, b: d3sankey.SankeyNodeMinimal<{}, {}>) => number | null;
    /**
     * A custom function to use when sorting links.
     *
     * Use `null` to sort links exactly the way they are presented in data.
     *
     * @since 5.4.4
     */
    linkSort?: null | ((a: d3sankey.SankeyLinkMinimal<{}, {}>, b: d3sankey.SankeyLinkMinimal<{}, {}>) => number | null);
}
export interface ISankeyPrivate extends IFlowPrivate {
}
export interface ISankeyEvents extends IFlowEvents {
}
/**
 * Sankey series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export declare class Sankey extends Flow {
    static className: string;
    static classNames: Array<string>;
    /**
     * List of link elements.
     *
     * @default new ListTemplate<SankeyLink>
     */
    readonly links: ListTemplate<SankeyLink>;
    protected _afterNew(): void;
    /**
     * A series representing sankey nodes.
     *
     * @default SankeyNodes.new()
     */
    readonly nodes: SankeyNodes;
    _settings: ISankeySettings;
    _privateSettings: ISankeyPrivate;
    _dataItemSettings: ISankeyDataItem;
    _events: ISankeyEvents;
    _d3Sankey: d3sankey.SankeyLayout<d3sankey.SankeyGraph<{}, {}>, {}, {}>;
    _d3Graph: d3sankey.SankeyGraph<{}, {}> | undefined;
    _fillGenerator: import("d3-shape").Area<[number, number]>;
    _strokeGenerator: import("d3-shape").Line<[number, number]>;
    /**
     * @ignore
     */
    makeLink(dataItem: DataItem<this["_dataItemSettings"]>): SankeyLink;
    /**
     * @ignore
     */
    updateSankey(): void;
    _updateLinkColor(dataItem: DataItem<this["_dataItemSettings"]>): void;
    protected _getBulletLocation(bullet: Bullet): number;
    _prepareChildren(): void;
}
//# sourceMappingURL=Sankey.d.ts.map