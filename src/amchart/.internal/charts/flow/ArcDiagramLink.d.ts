import { FlowLink, IFlowLinkPrivate, IFlowLinkSettings } from "./FlowLink";
import type { DataItem } from "../../core/render/Component";
import type { IArcDiagramNodesDataItem } from "./ArcDiagramNodes";
import type { ArcDiagram, IArcDiagramDataItem } from "./ArcDiagram";
import type { IOrientationPoint, IPoint } from "../../core/util/IPoint";
export interface IArcDiagramLinkSettings extends IFlowLinkSettings {
    /**
     * Source data item.
     */
    source?: DataItem<IArcDiagramNodesDataItem>;
    /**
     * target data item.
     */
    target?: DataItem<IArcDiagramNodesDataItem>;
}
export interface IArcDiagramLinkPrivate extends IFlowLinkPrivate {
    /**
     * Link orientation.
     */
    orientation?: "horizontal" | "vertical";
}
/**
 * A link element used in [[ArcDiagram]] chart.
 */
export declare class ArcDiagramLink extends FlowLink {
    _p0: IPoint | undefined;
    _p1: IPoint | undefined;
    _radius: number;
    _settings: IArcDiagramLinkSettings;
    _privateSettings: IArcDiagramLinkPrivate;
    static className: string;
    static classNames: Array<string>;
    protected _dataItem: DataItem<IArcDiagramDataItem> | undefined;
    series: ArcDiagram | undefined;
    _beforeChanged(): void;
    _changed(): void;
    _draw(): void;
    getPoint(location: number): IOrientationPoint;
}
//# sourceMappingURL=ArcDiagramLink.d.ts.map