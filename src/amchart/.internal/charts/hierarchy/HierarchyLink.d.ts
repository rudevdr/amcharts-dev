import type { IHierarchyDataItem } from "./Hierarchy";
import type { DataItem } from "../../core/render/Component";
import { Graphics, IGraphicsSettings, IGraphicsPrivate } from "../../core/render/Graphics";
export interface IHierarchyLinkSettings extends IGraphicsSettings {
    /**
     * Source node data item.
     */
    source?: DataItem<IHierarchyDataItem>;
    /**
     * Target node data item.
     */
    target?: DataItem<IHierarchyDataItem>;
    /**
     * Strength of the link.
     */
    strength?: number;
    /**
     * Distance in pixels.
     */
    distance?: number;
}
export interface IHierarchyLinkPrivate extends IGraphicsPrivate {
    d3Link: any;
}
/**
 * Draws a link between nodes in a hierarchy series.
 */
export declare class HierarchyLink extends Graphics {
    _settings: IHierarchyLinkSettings;
    _privateSettings: IHierarchyLinkPrivate;
    static className: string;
    static classNames: Array<string>;
    _changed(): void;
    _beforeChanged(): void;
}
//# sourceMappingURL=HierarchyLink.d.ts.map