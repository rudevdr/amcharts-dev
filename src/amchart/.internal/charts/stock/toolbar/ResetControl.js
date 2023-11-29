import { StockControl } from "./StockControl";
import { StockIcons } from "./StockIcons";
/**
 * Reset control.
 *
 * Removes all drawings and indicators when clicked.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/toolbar/reset-control/} for more info
 */
export class ResetControl extends StockControl {
    _afterNew() {
        super._afterNew();
        this.events.on("click", () => {
            const stockChart = this.get("stockChart");
            stockChart.panels.each((panel) => {
                panel.drawings.each((drawing) => {
                    drawing.data.clear();
                });
            });
            stockChart.indicators.clear();
        });
    }
    _getDefaultIcon() {
        return StockIcons.getIcon("Reset");
    }
}
Object.defineProperty(ResetControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ResetControl"
});
Object.defineProperty(ResetControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: StockControl.classNames.concat([ResetControl.className])
});
//# sourceMappingURL=ResetControl.js.map