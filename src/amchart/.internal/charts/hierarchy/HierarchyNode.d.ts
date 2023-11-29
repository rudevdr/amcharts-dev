import type { DataItem } from "../../core/render/Component";
import type { IDisposer } from "../../core/util/Disposer";
import type { Hierarchy, IHierarchyDataItem } from "./Hierarchy";
import { Container, IContainerPrivate, IContainerSettings } from "../../core/render/Container";
export interface IHierarchyNodeSettings extends IContainerSettings {
}
export interface IHierarchyNodePrivate extends IContainerPrivate {
}
/**
 * Base class for hierarchy nodes.
 */
export declare class HierarchyNode extends Container {
    /**
     * Related series.
     */
    series: Hierarchy | undefined;
    _settings: IHierarchyNodeSettings;
    _privateSettings: IHierarchyNodePrivate;
    static className: string;
    static classNames: Array<string>;
    protected _dataItem: DataItem<IHierarchyDataItem> | undefined;
    protected _clickDisposer: IDisposer | undefined;
    protected _afterNew(): void;
    _changed(): void;
}
//# sourceMappingURL=HierarchyNode.d.ts.map