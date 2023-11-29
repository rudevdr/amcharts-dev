import { XYChart } from "../xy/XYChart";
import { ListAutoDispose } from "../../core/util/List";
import * as $array from "../../core/util/Array";
/**
 * A panel instance for the [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/panels/} for more info
 * @important
 */
export class StockPanel extends XYChart {
    constructor() {
        super(...arguments);
        /**
         * An instance of [[PanelControls]].
         */
        Object.defineProperty(this, "panelControls", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Panel resize grip element.
         *
         * @since 5.4.7
         */
        Object.defineProperty(this, "panelResizer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A list of drawings on panel.
         *
         */
        Object.defineProperty(this, "drawings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListAutoDispose()
        });
    }
    _afterNew() {
        super._afterNew();
        this._disposers.push(this.drawings.events.onAll((change) => {
            if (change.type === "clear") {
                $array.each(change.oldValues, (series) => {
                    this.series.removeValue(series);
                });
            }
            else if (change.type === "push") {
                this.series.push(change.newValue);
            }
            else if (change.type === "setIndex") {
                this.series.setIndex(change.index, change.newValue);
            }
            else if (change.type === "insertIndex") {
                this.series.insertIndex(change.index, change.newValue);
            }
            else if (change.type === "removeIndex") {
                this.series.removeIndex(change.index);
            }
            else {
                throw new Error("Unknown IListEvent type");
            }
        }));
    }
    /**
     * Moves panel up.
     */
    moveUp() {
        const stockChart = this.getPrivate("stockChart");
        const children = stockChart.panelsContainer.children;
        const index = children.indexOf(this);
        if (index > 0) {
            children.moveValue(this, index - 1);
        }
        stockChart._updateControls();
    }
    /**
     * Moves panel down.
     */
    moveDown() {
        const stockChart = this.getPrivate("stockChart");
        const children = stockChart.panelsContainer.children;
        const index = children.indexOf(this);
        if (index < children.length - 1) {
            children.moveValue(this, index + 1);
        }
        stockChart._updateControls();
    }
    /**
     * Closes panel.
     */
    close() {
        const stockChart = this.getPrivate("stockChart");
        stockChart.panels.removeValue(this);
        stockChart._updateControls();
    }
    /**
     * Toggles "full screen" mode of the panel on and off.
     */
    expand() {
        const stockChart = this.getPrivate("stockChart");
        const panels = [];
        stockChart.panels.each((panel) => {
            if (!panel.isVisible()) {
                panels.push(panel);
            }
        });
        $array.each(panels, (panel) => {
            panel.setPrivate("visible", true);
        });
        if (panels.length == 0) {
            stockChart.panels.each((panel) => {
                if (panel != this) {
                    panel.setPrivate("visible", false);
                }
            });
        }
        stockChart._updateControls();
        if (panels.length == 0) {
            const panelControls = this.panelControls;
            panelControls.upButton.setPrivate("visible", false);
            panelControls.downButton.setPrivate("visible", false);
            panelControls.closeButton.setPrivate("visible", false);
        }
    }
}
Object.defineProperty(StockPanel, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StockPanel"
});
Object.defineProperty(StockPanel, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: XYChart.classNames.concat([StockPanel.className])
});
//# sourceMappingURL=StockPanel.js.map