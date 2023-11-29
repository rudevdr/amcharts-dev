import type { DataItem } from "../../core/render/Component";
import type { Sankey, ISankeyDataItem } from "./Sankey";
import type { ISankeyNodesDataItem } from "./SankeyNodes";
import type { IOrientationPoint } from "../../core/util/IPoint";
import { FlowLink, IFlowLinkPrivate, IFlowLinkSettings } from "./FlowLink";
import type { IPoint } from "../../core/util/IPoint";
export interface ISankeyLinkSettings extends IFlowLinkSettings {
    /**
     * Source node data item.
     */
    source?: DataItem<ISankeyNodesDataItem>;
    /**
     * Source node data item.
     */
    target?: DataItem<ISankeyNodesDataItem>;
    /**
     * Type of fill to use for links.
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/sankey-diagram/#Color_mode} for more info
     * @default "gradient"
     */
    fillStyle?: "solid" | "gradient" | "source" | "target";
    /**
     * A relative distance from node for link "elbow" (bend point).
     *
     * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/sankey-diagram/#Bend_point} for more info
     * @default 0.2
     */
    controlPointDistance?: number;
}
export interface ISankeyLinkPrivate extends IFlowLinkPrivate {
    /**
     * Link orientation.
     */
    orientation?: "horizontal" | "vertical";
}
export declare class SankeyLink extends FlowLink {
    _settings: ISankeyLinkSettings;
    _privateSettings: ISankeyLinkPrivate;
    static className: string;
    static classNames: Array<string>;
    protected _dataItem: DataItem<ISankeyDataItem> | undefined;
    series: Sankey | undefined;
    protected _svgPath: SVGPathElement;
    protected _totalLength: number;
    _beforeChanged(): void;
    getPoint(location: number): IOrientationPoint;
    _getTooltipPoint(): IPoint;
}
//# sourceMappingURL=SankeyLink.d.ts.map