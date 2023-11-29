import type { DataItem } from "../../core/render/Component";
import type { PercentSeries, IPercentSeriesDataItem } from "../../charts/percent/PercentSeries";
import type { Legend } from "../../core/render/Legend";
import { Button } from "../../core/render/Button";
import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "../../core/util/Entity";
export interface ISliceGrouperSettings extends IEntitySettings {
    /**
     * A series that will be used to group slices on.
     */
    series?: PercentSeries;
    /**
     * If set, plugin will try to manipulate the items in legend, such as
     * adding group slice, hiding items for small slices, etc.
     */
    legend?: Legend;
    /**
     * Any slice which has percent value less than this setting will be grouped.
     *
     * @default 5
     */
    threshold?: number;
    /**
     * If set, only X first slices will be left as they are. The rest of the
     * slices will be grouped.
     */
    limit?: number;
    /**
     * Name (category) of the group slice.
     *
     * @default "Other"
     */
    groupName?: string;
    /**
     * What happens when group slice is clicked.
     *
     * * `"none"` (default) - nothing.
     * * `"break"` - underlying small slices are shown.
     * * `"zoom"` - series shows only small slies (big ones are hidden).
     */
    clickBehavior?: "none" | "break" | "zoom";
}
export interface ISliceGrouperPrivate extends IEntityPrivate {
    groupDataItem?: DataItem<IPercentSeriesDataItem>;
    normalDataItems?: DataItem<IPercentSeriesDataItem>[];
    smallDataItems?: DataItem<IPercentSeriesDataItem>[];
    currentStep?: number;
    currentPass?: number;
}
export interface ISliceGrouperEvents extends IEntityEvents {
}
/**
 * A plugin that can be used to automatically group small slices on percent
 * charts into a single slice.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/grouping-slices/} for more info
 */
export declare class SliceGrouper extends Entity {
    static className: string;
    static classNames: Array<string>;
    _settings: ISliceGrouperSettings;
    _privateSettings: ISliceGrouperPrivate;
    _events: ISliceGrouperEvents;
    /**
     * A button that is shown when chart small buttons are visible.
     */
    zoomOutButton?: Button;
    protected _afterNew(): void;
    private initZoomButton;
    private handleData;
    /**
     * Resets slice setup to original grouping state.
     */
    zoomOut(): void;
    private updateGroupDataItem;
    private handleClick;
    _beforeChanged(): void;
}
//# sourceMappingURL=SliceGrouper.d.ts.map