import type { DataItem } from "../../core/render/Component";
import type { IDisposer } from "../../core/util/Disposer";
import type { Hierarchy, IHierarchyDataItem } from "./Hierarchy";
import { Container, IContainerPrivate, IContainerSettings, IContainerEvents } from "../../core/render/Container";
import { Label } from "../../core/render/Label";
import { ListTemplate } from "../../core/util/List";
export interface IBreadcrumbBarSettings extends IContainerSettings {
    /**
     * A hierarchy series bar will use to build current selection path.
     */
    series: Hierarchy;
}
export interface IBreadcrumbBarPrivate extends IContainerPrivate {
}
export interface IBreadcrumbBarEvents extends IContainerEvents {
}
/**
 * Creates a breadcrumb navigation control.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/breadcrumbs/} for more info
 * @important
 */
export declare class BreadcrumbBar extends Container {
    /**
     * @ignore
     */
    makeLabel(dataItem: DataItem<IHierarchyDataItem>): Label;
    /**
     * A list of labels in the bar.
     *
     * `labels.template` can be used to configure label apperance and behavior.
     *
     * @default new ListTemplate<Label>
     */
    readonly labels: ListTemplate<Label>;
    static className: string;
    static classNames: Array<string>;
    _settings: IBreadcrumbBarSettings;
    _privateSettings: IBreadcrumbBarPrivate;
    _events: IBreadcrumbBarEvents;
    protected _disposer: IDisposer | undefined;
    protected _afterNew(): void;
    _changed(): void;
    protected _handleDataItem(dataItem: DataItem<IHierarchyDataItem> | undefined): void;
}
//# sourceMappingURL=BreadcrumbBar.d.ts.map