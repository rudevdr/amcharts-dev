import type { DataItem } from "../../core/render/Component";
import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "../../core/render/Graphics";
import type { IFlowNodesDataItem } from "./FlowNodes";
import type { IFlowDataItem, Flow } from "./Flow";
import type { IOrientationPoint, IPoint } from "../../core/util/IPoint";
import type { LinearGradient } from "../../core/render/gradients/LinearGradient";
export interface IFlowLinkSettings extends IGraphicsSettings {
    /**
     * Source node data item.
     */
    source?: DataItem<IFlowNodesDataItem>;
    /**
     * Source node data item.
     */
    target?: DataItem<IFlowNodesDataItem>;
    /**
     * Type of fill to use for links.
     */
    fillStyle?: "solid" | "source" | "target" | "gradient" | "none";
    /**
     * Type of outline to use for links.
     */
    strokeStyle?: "solid" | "source" | "target" | "gradient" | "none";
}
export interface IFlowLinkPrivate extends IGraphicsPrivate {
}
/**
 * A base class for a flow link.
 */
export declare abstract class FlowLink extends Graphics {
    series: Flow | undefined;
    _settings: IFlowLinkSettings;
    _privateSettings: IFlowLinkPrivate;
    static className: string;
    static classNames: Array<string>;
    protected _dataItem: DataItem<IFlowDataItem> | undefined;
    _fillGradient: LinearGradient | undefined;
    _strokeGradient: LinearGradient | undefined;
    _changed(): void;
    abstract getPoint(location: number): IOrientationPoint;
    _getTooltipPoint(): IPoint;
}
//# sourceMappingURL=FlowLink.d.ts.map