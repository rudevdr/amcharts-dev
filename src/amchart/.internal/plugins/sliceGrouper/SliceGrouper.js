import { Button } from "../../core/render/Button";
import { Graphics } from "../../core/render/Graphics";
import { Entity } from "../../core/util/Entity";
import * as $array from "../../core/util/Array";
/**
 * A plugin that can be used to automatically group small slices on percent
 * charts into a single slice.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/percent-charts/grouping-slices/} for more info
 */
export class SliceGrouper extends Entity {
    constructor() {
        super(...arguments);
        /**
         * A button that is shown when chart small buttons are visible.
         */
        Object.defineProperty(this, "zoomOutButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        super._afterNew();
        this._setRawDefault("threshold", 5);
        this._setRawDefault("groupName", "Other");
        this._setRawDefault("clickBehavior", "none");
        this.initZoomButton();
        this._root.addDisposer(this);
        const series = this.get("series");
        if (series) {
            const colors = series.get("colors");
            if (colors) {
                this.setPrivate("currentStep", colors.getPrivate("currentStep"));
                this.setPrivate("currentPass", colors.getPrivate("currentPass"));
            }
        }
    }
    initZoomButton() {
        const clickBehavior = this.get("clickBehavior");
        if (clickBehavior !== "none") {
            const container = this.root.tooltipContainer;
            this.zoomOutButton = container.children.push(Button.new(this._root, {
                themeTags: ["zoom"],
                icon: Graphics.new(this._root, {
                    themeTags: ["button", "icon"]
                })
            }));
            this.zoomOutButton.hide();
            this.zoomOutButton.events.on("click", () => {
                this.zoomOut();
            });
        }
    }
    handleData() {
        const series = this.get("series");
        if (series) {
            // Create group data item if not yet available
            let groupDataItem = this.getPrivate("groupDataItem");
            if (!groupDataItem) {
                const legend = this.get("legend");
                const categoryField = series.get("categoryField", "category");
                const valueField = series.get("valueField", "value");
                // Add slice
                const groupSliceData = {};
                groupSliceData[categoryField] = this.get("groupName", "");
                groupSliceData[valueField] = 0;
                const colors = series.get("colors");
                if (colors) {
                    colors.setPrivate("currentStep", this.getPrivate("currentStep"));
                    colors.setPrivate("currentPass", this.getPrivate("currentPass"));
                }
                series.data.push(groupSliceData);
                groupDataItem = series.dataItems[series.dataItems.length - 1];
                groupDataItem.get("slice").events.on("click", () => {
                    this.handleClick();
                });
                this.setPrivate("groupDataItem", groupDataItem);
                // Add to legend
                if (legend) {
                    legend.data.push(groupDataItem);
                    //const legendDataItem = groupDataItem.get("legendDataItem");
                    groupDataItem.on("visible", (visible) => {
                        if (visible) {
                            this.zoomOut();
                        }
                    });
                }
            }
            // Recalculate group value and decorate small slices as necessary
            const threshold = this.get("threshold", 0);
            const limit = this.get("limit", 1000);
            const normalDataItems = [];
            const smallDataItems = [];
            let groupValue = 0;
            if (threshold || limit) {
                $array.each(series.dataItems, (item, index) => {
                    const legendDataItem = item.get("legendDataItem");
                    if (((item.get("valuePercentTotal") <= threshold) || (index > (limit - 1))) && groupDataItem !== item) {
                        groupValue += item.get("value", 0);
                        smallDataItems.push(item);
                        item.hide(0);
                        if (legendDataItem) {
                            legendDataItem.get("itemContainer").hide(0);
                        }
                    }
                    else {
                        normalDataItems.push(item);
                        if (legendDataItem) {
                            legendDataItem.get("itemContainer").show(0);
                        }
                    }
                });
                this.setPrivate("normalDataItems", normalDataItems);
                this.setPrivate("smallDataItems", smallDataItems);
                this.updateGroupDataItem(groupValue);
            }
        }
    }
    /**
     * Resets slice setup to original grouping state.
     */
    zoomOut() {
        const groupDataItem = this.getPrivate("groupDataItem");
        if (groupDataItem) {
            groupDataItem.show();
        }
        const clickBehavior = this.get("clickBehavior");
        if (clickBehavior == "zoom") {
            const normalDataItems = this.getPrivate("normalDataItems", []);
            $array.each(normalDataItems, (item, _index) => {
                item.show();
            });
        }
        const smallDataItems = this.getPrivate("smallDataItems", []);
        $array.each(smallDataItems, (item, _index) => {
            item.hide();
        });
        if (this.zoomOutButton) {
            this.zoomOutButton.hide();
        }
    }
    updateGroupDataItem(groupValue) {
        const series = this.get("series");
        if (series) {
            const groupSliceData = {};
            const categoryField = series.get("categoryField", "category");
            const valueField = series.get("valueField", "value");
            groupSliceData[categoryField] = this.get("groupName", "");
            groupSliceData[valueField] = groupValue;
            series.data.setIndex(series.data.length - 1, groupSliceData);
            const groupDataItem = this.getPrivate("groupDataItem");
            if (groupValue == 0) {
                groupDataItem.hide(0);
            }
            else if (groupDataItem.isHidden()) {
                groupDataItem.show();
            }
            const clickBehavior = this.get("clickBehavior");
            if (clickBehavior != "none") {
                groupDataItem.get("slice").set("toggleKey", "none");
            }
        }
    }
    handleClick() {
        const clickBehavior = this.get("clickBehavior");
        const smallDataItems = this.getPrivate("smallDataItems");
        if (clickBehavior == "none" || (smallDataItems && smallDataItems.length == 0)) {
            return;
        }
        const series = this.get("series");
        const groupDataItem = this.getPrivate("groupDataItem");
        // Hide group slice
        groupDataItem.hide();
        // Reveal small slices
        $array.each(series.dataItems, (item) => {
            if (smallDataItems.indexOf(item) !== -1) {
                item.show();
            }
            else if (clickBehavior == "zoom") {
                item.hide();
            }
        });
        this.zoomOutButton.show();
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("series")) {
            const series = this.get("series");
            if (series) {
                series.events.on("datavalidated", (_ev) => {
                    this.handleData();
                });
            }
        }
    }
}
Object.defineProperty(SliceGrouper, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SliceGrouper"
});
Object.defineProperty(SliceGrouper, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([SliceGrouper.className])
});
//# sourceMappingURL=SliceGrouper.js.map