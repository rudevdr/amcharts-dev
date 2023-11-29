import { Container } from "../../core/render/Container";
import { Button } from "../../core/render/Button";
import { Graphics } from "../../core/render/Graphics";
import { MultiDisposer } from "../../core/util/Disposer";
/**
 * A control that displays button for zooming [[MapChart]] in and out.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/map-chart/map-pan-zoom/#Zoom_control} for more information
 * @important
 */
export class ZoomControl extends Container {
    constructor() {
        super(...arguments);
        /**
         * A [[Button]] for zoom in.
         *
         * @default Button.new()
         */
        Object.defineProperty(this, "plusButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, { width: 36, height: 36, themeTags: ["plus"] }))
        });
        /**
         * A [[Button]] for zoom out.
         *
         * @default Button.new()
         */
        Object.defineProperty(this, "minusButton", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Button.new(this._root, { width: 36, height: 36, themeTags: ["minus"] }))
        });
        Object.defineProperty(this, "_disposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _afterNew() {
        super._afterNew();
        this.set("position", "absolute");
        this.set("layout", this._root.verticalLayout);
        this.set("themeTags", ["zoomcontrol"]);
        this.plusButton.setAll({
            icon: Graphics.new(this._root, { themeTags: ["icon"] }),
            layout: undefined
        });
        this.minusButton.setAll({
            icon: Graphics.new(this._root, { themeTags: ["icon"] }),
            layout: undefined
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isPrivateDirty("chart")) {
            const chart = this.getPrivate("chart");
            const previous = this._prevPrivateSettings.chart;
            if (chart) {
                this._disposer = new MultiDisposer([
                    this.plusButton.events.on("click", () => {
                        chart.zoomIn();
                    }),
                    this.minusButton.events.on("click", () => {
                        chart.zoomOut();
                    })
                ]);
            }
            if (previous && this._disposer) {
                this._disposer.dispose();
            }
        }
    }
}
Object.defineProperty(ZoomControl, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ZoomControl"
});
Object.defineProperty(ZoomControl, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([ZoomControl.className])
});
//# sourceMappingURL=ZoomControl.js.map