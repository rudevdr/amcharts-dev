import { Container } from "../../core/render/Container";
/**
 * Base class for hierarchy nodes.
 */
export class HierarchyNode extends Container {
    constructor() {
        super(...arguments);
        /**
         * Related series.
         */
        Object.defineProperty(this, "series", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_clickDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        super._afterNew();
        this.states.create("disabled", {});
        this.states.create("hover", {});
        this.states.create("hoverDisabled", {});
        this.on("disabled", () => {
            const dataItem = this.dataItem;
            if (!dataItem.get("children")) {
                this.set("disabled", true);
                return;
            }
            const disabled = this.get("disabled");
            const series = this.series;
            if (dataItem && series) {
                if (dataItem.get("disabled") != disabled) {
                    if (disabled) {
                        series.disableDataItem(dataItem);
                    }
                    else {
                        series.enableDataItem(dataItem, series.get("downDepth", 1), 0);
                    }
                }
            }
        });
    }
    _changed() {
        super._changed();
        if (this.isDirty("toggleKey")) {
            const toggleKey = this.get("toggleKey");
            if (toggleKey == "disabled") {
                this._clickDisposer = this.events.on("click", () => {
                    if (!this._isDragging) {
                        let series = this.series;
                        if (series) {
                            series.selectDataItem(this.dataItem);
                        }
                    }
                });
            }
            else {
                if (this._clickDisposer) {
                    this._clickDisposer.dispose();
                }
            }
        }
    }
}
Object.defineProperty(HierarchyNode, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "HierarchyNode"
});
Object.defineProperty(HierarchyNode, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([HierarchyNode.className])
});
//# sourceMappingURL=HierarchyNode.js.map