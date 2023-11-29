import { Legend } from "../../core/render/Legend";
import { Button } from "../../core/render/Button";
import { Graphics } from "../../core/render/Graphics";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { Indicator } from "./indicators/Indicator";
import * as $utils from "../../core/util/Utils";
/**
 * A legend, specifically designed for use in a [[StockChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/stock/#Legend} for more info
 * @important
 */
export class StockLegend extends Legend {
    constructor() {
        super(...arguments);
        /**
         * A list of "close" buttons in legend items.
         *
         * @default new ListTemplate<Button>()
         */
        Object.defineProperty(this, "closeButtons", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Button._new(this._root, {
                themeTags: $utils.mergeTags(this.closeButtons.template.get("themeTags", []), ["control", "close"]),
                icon: Graphics.new(this._root, {
                    themeTags: ["icon", "button"]
                })
            }, [this.closeButtons.template]))
        });
        /**
         * A list of "settings" buttons in legend items.
         *
         * @default new ListTemplate<Button>()
         */
        Object.defineProperty(this, "settingsButtons", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Button._new(this._root, {
                themeTags: $utils.mergeTags(this.settingsButtons.template.get("themeTags", []), ["control", "settings"]),
                icon: Graphics.new(this._root, {
                    themeTags: ["icon", "button"]
                })
            }, [this.settingsButtons.template]))
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["stocklegend"]);
        super._afterNew();
    }
    /**
     * @ignore
     */
    makeCloseButton() {
        const button = this.closeButtons.make();
        this.closeButtons.push(button);
        return button;
    }
    /**
     * @ignore
     */
    makeSettingsButton() {
        const button = this.settingsButtons.make();
        this.settingsButtons.push(button);
        button.events.on("click", () => {
            const dataItem = button.dataItem;
            if (dataItem) {
                const stockChart = this.get("stockChart");
                if (stockChart) {
                    const indicator = button.getPrivate("customData");
                    if (indicator instanceof Indicator) {
                        stockChart.getPrivate("settingsModal").openIndicator(indicator);
                    }
                    else {
                        stockChart.getPrivate("settingsModal").openSeries(dataItem.dataContext);
                    }
                }
            }
            setTimeout(() => {
                button.unhover();
            }, 50);
        });
        return button;
    }
    processDataItem(dataItem) {
        super.processDataItem(dataItem);
        const itemContainer = dataItem.get("itemContainer");
        const settingsButton = this.makeSettingsButton();
        itemContainer.children.push(settingsButton);
        settingsButton._setDataItem(dataItem);
        dataItem.set("settingsButton", settingsButton);
        const closeButton = this.makeCloseButton();
        itemContainer.children.push(closeButton);
        closeButton._setDataItem(dataItem);
        dataItem.set("closeButton", closeButton);
    }
}
Object.defineProperty(StockLegend, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "StockLegend"
});
Object.defineProperty(StockLegend, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Legend.classNames.concat([StockLegend.className])
});
//# sourceMappingURL=StockLegend.js.map