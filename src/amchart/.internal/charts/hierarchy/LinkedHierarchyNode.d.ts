import type { DataItem } from "../../core/render/Component";
import type { LinkedHierarchy, ILinkedHierarchyDataItem } from "./LinkedHierarchy";
import { HierarchyNode, IHierarchyNodePrivate, IHierarchyNodeSettings } from "./HierarchyNode";
export interface ILinkedHierarchyNodeSettings extends IHierarchyNodeSettings {
}
export interface ILinkedHierarchyNodePrivate extends IHierarchyNodePrivate {
}
/**
 * A node class for [[LinkedHierarchy]].
 */
export declare class LinkedHierarchyNode extends HierarchyNode {
    /**
     * A series node belongs to.
     */
    series: LinkedHierarchy | undefined;
    _settings: ILinkedHierarchyNodeSettings;
    _privateSettings: ILinkedHierarchyNodePrivate;
    static className: string;
    static classNames: Array<string>;
    protected _dataItem: DataItem<ILinkedHierarchyDataItem> | undefined;
    protected _afterNew(): void;
    _updateLinks(duration?: number): void;
    _prepareChildren(): void;
    protected _onHide(duration?: number): void;
    protected _onShow(duration?: number): void;
}
//# sourceMappingURL=LinkedHierarchyNode.d.ts.map