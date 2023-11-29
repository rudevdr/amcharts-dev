import { ValueAxis } from "../../xy/axes/ValueAxis";
import { DropdownListControl } from "./DropdownListControl";
import { StockIcons } from "./StockIcons";
import * as $array from "../../../core/util/Array";
/**
 * A control that is used to change type of the main series of the [[StockChart]].
 */
export class SettingsControl extends DropdownListControl {
    _afterNew() {
        super._afterNew();
        const dropdown = this.getPrivate("dropdown");
        dropdown.events.on("changed", (ev) => {
            const stockChart = this.get("stockChart");
            const stockSeries = stockChart.get("stockSeries");
            if (stockSeries) {
                if (ev.item.id == "y-scale") {
                    if (ev.item.value == "percent") {
                        stockChart.setPercentScale(true);
                        this._setLogarithmic(false);
                    }
                    else {
                        stockChart.setPercentScale(false);
                        this._setLogarithmic(ev.item.value == "logarithmic");
                    }
                }
                else if (ev.item.id == "fills") {
                    this._setFills(ev.checked);
                }
            }
        });
        this.on("active", () => {
            this._populateInputs();
        });
    }
    // public _afterChanged() {
    // 	super._afterChanged();
    // }
    _getDefaultIcon() {
        return StockIcons.getIcon("Settings");
    }
    _populateInputs() {
        const button = this.getPrivate("button");
        const inputs = button.getElementsByTagName("input");
        const currentScale = this._getYScale();
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i];
            switch (input.id) {
                case "am5stock-list-fills":
                    input.checked = this._getFillEnabled();
                    break;
                case "am5stock-list-y-scale-percent":
                case "am5stock-list-y-scale-regular":
                case "am5stock-list-y-scale-logarithmic":
                    input.checked = input.value == currentScale;
                    break;
            }
        }
    }
    _getFillEnabled() {
        const stockChart = this.get("stockChart");
        const stockSeries = stockChart.get("stockSeries");
        if (stockSeries) {
            const xAxis = stockSeries.get("xAxis");
            const fills = xAxis.get("renderer").axisFills.values;
            return (fills.length > 0) && fills[0].get("visible", false);
        }
        return false;
    }
    _getYScale() {
        const stockChart = this.get("stockChart");
        const stockSeries = stockChart.get("stockSeries");
        if (stockSeries) {
            const yAxis = stockSeries.get("yAxis");
            if (yAxis instanceof ValueAxis) {
                if (stockSeries.get("valueYShow") == "valueYChangeSelectionPercent") {
                    return "percent";
                }
                if (yAxis.get("logarithmic")) {
                    return "logarithmic";
                }
            }
        }
        return "regular";
    }
    _setLogarithmic(value) {
        const stockChart = this.get("stockChart");
        const stockSeries = stockChart.get("stockSeries");
        if (stockSeries) {
            const yAxis = stockSeries.get("yAxis");
            if (yAxis instanceof ValueAxis) {
                $array.each(yAxis.series, (series) => {
                    series.resetExtremes();
                    series.markDirtyValues();
                });
                yAxis.set("logarithmic", value);
            }
        }
    }
    _setFills(enabled) {
        const stockChart = this.get("stockChart");
        stockChart.panels.each((panel) => {
            panel.xAxes.each((xAxis) => {
                xAxis.get("renderer").axisFills.template.set("visible", enabled);
                xAxis.get("renderer").grid.template.set("forceHidden", enabled);
            });
        });
    }
}
Object.defineProperty(SettingsControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SettingsControl"
});
Object.defineProperty(SettingsControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: DropdownListControl.classNames.concat([SettingsControl.className])
});
//# sourceMappingURL=SettingsControl.js.map