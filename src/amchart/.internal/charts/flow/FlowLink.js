import { Graphics } from "../../core/render/Graphics";
import { Percent } from "../../core/util/Percent";
/**
 * A base class for a flow link.
 */
export class FlowLink extends Graphics {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "series", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_fillGradient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_strokeGradient", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    _changed() {
        super._changed();
        if (this.isDirty("fillStyle")) {
            const series = this.series;
            const dataItem = this.dataItem;
            if (series && dataItem) {
                series._updateLinkColor(dataItem);
            }
        }
    }
    _getTooltipPoint() {
        let tooltipY = this.get("tooltipY");
        let position = 0.5;
        if (tooltipY instanceof Percent) {
            position = tooltipY.value;
        }
        return this.getPoint(position);
    }
}
Object.defineProperty(FlowLink, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "FlowLink"
});
Object.defineProperty(FlowLink, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Graphics.classNames.concat([FlowLink.className])
});
//# sourceMappingURL=FlowLink.js.map