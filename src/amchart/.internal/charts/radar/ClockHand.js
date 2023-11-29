import { Container } from "../../core/render/Container";
import { Graphics } from "../../core/render/Graphics";
import { Percent, percent } from "../../core/util/Percent";
import * as $utils from "../../core/util/Utils";
/**
 * A clock hand for use with [[RadarChart]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/radar-chart/gauge-charts/#Clock_hands} for more info
 * @important
 */
export class ClockHand extends Container {
    constructor() {
        super(...arguments);
        /**
         * A "hand" element.
         *
         * @default Graphics.new()
         */
        Object.defineProperty(this, "hand", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Graphics.new(this._root, { themeTags: ["hand"] }))
        });
        /**
         * A "pin" element (hand's base).
         *
         * @default Graphics.new()
         */
        Object.defineProperty(this, "pin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Graphics.new(this._root, { themeTags: ["pin"] }))
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["clock"]);
        super._afterNew();
        // to be redrawn when size changes
        this.set("width", percent(1));
        this.adapters.add("x", () => {
            return 0;
        });
        this.adapters.add("y", () => {
            return 0;
        });
        this.pin.set("draw", (display, graphics) => {
            const parent = graphics.parent;
            if (parent) {
                const dataItem = parent.dataItem;
                if (dataItem) {
                    const axis = dataItem.component;
                    if (axis) {
                        const chart = axis.chart;
                        if (chart) {
                            const cr = chart.getPrivate("radius", 0);
                            let r = $utils.relativeToValue(parent.get("pinRadius", 0), cr);
                            if (r < 0) {
                                r = cr + r;
                            }
                            display.moveTo(r, 0);
                            display.arc(0, 0, r, 0, 360);
                        }
                    }
                }
            }
        });
        this.hand.set("draw", (display, graphics) => {
            const parent = graphics.parent;
            if (parent) {
                let bullet = parent.parent;
                // to be redrawn when size changes
                if (bullet) {
                    bullet.set("width", percent(1));
                }
                const dataItem = parent.dataItem;
                if (dataItem) {
                    const axis = dataItem.component;
                    if (axis) {
                        const chart = axis.chart;
                        if (chart) {
                            const bw = parent.get("bottomWidth", 10) / 2;
                            const tw = parent.get("topWidth", 0) / 2;
                            const cr = chart.getPrivate("radius", 0);
                            let r = $utils.relativeToValue(parent.get("radius", 0), cr);
                            if (r < 0) {
                                r = cr + r;
                            }
                            let ir = parent.get("innerRadius", 0);
                            if (ir instanceof Percent) {
                                ir = $utils.relativeToValue(ir, cr);
                            }
                            else {
                                if (ir < 0) {
                                    if (ir < 0) {
                                        ir = r + ir;
                                    }
                                }
                            }
                            display.moveTo(ir, -bw);
                            display.lineTo(r, -tw);
                            display.lineTo(r, tw);
                            display.lineTo(ir, bw);
                            display.lineTo(ir, -bw);
                        }
                    }
                }
            }
        });
    }
    _prepareChildren() {
        super._prepareChildren();
        this.hand._markDirtyKey("fill");
        this.pin._markDirtyKey("fill");
    }
}
Object.defineProperty(ClockHand, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ClockHand"
});
Object.defineProperty(ClockHand, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([ClockHand.className])
});
//# sourceMappingURL=ClockHand.js.map