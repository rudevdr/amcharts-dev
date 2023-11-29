import { Flow } from "./Flow";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { ArcDiagramNodes } from "./ArcDiagramNodes";
import { ArcDiagramLink } from "./ArcDiagramLink";
import * as $utils from "../../core/util/Utils";
import * as $array from "../../core/util/Array";
/**
 * Regular ArcDiagram series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export class ArcDiagram extends Flow {
    constructor() {
        super(...arguments);
        /**
         * List of link elements.
         *
         * @default new ListTemplate<ArcDiagramLink>
         */
        Object.defineProperty(this, "links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => ArcDiagramLink._new(this._root, { themeTags: ["link", "shape"] }, [this.links.template]))
        });
        /**
         * A series for all ArcDiagram nodes.
         *
         * @default ArcDiagramNodes.new()
         */
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(ArcDiagramNodes.new(this._root, {}))
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["arcdiagram", this._settings.orientation || "horizontal"]);
        super._afterNew();
        this.nodes.children.push(this.bulletsContainer);
    }
    /**
     * @ignore
     */
    makeLink(dataItem) {
        const link = this.nodes.children.moveValue(this.links.make(), 0);
        this.links.push(link);
        link._setDataItem(dataItem);
        link.set("source", dataItem.get("source"));
        link.set("target", dataItem.get("target"));
        link.series = this;
        return link;
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this._valuesDirty || this._sizeDirty || this.isDirty("orientation")) {
            let width = 1;
            const orientation = this.get("orientation");
            $array.each(this.dataItems, (dataItem) => {
                const link = dataItem.get("link");
                link.setPrivate("orientation", this.get("orientation"));
            });
            if (orientation == "vertical") {
                width = this.innerHeight();
            }
            else {
                width = this.innerWidth();
            }
            let sum = 0;
            let low = Infinity;
            let radiusKey = this.get("radiusKey");
            if (radiusKey != "none") {
                $array.each(this.nodes.dataItems, (dataItem) => {
                    let value = dataItem.get(radiusKey + "Working");
                    sum += value;
                    low = Math.min(low, value);
                });
            }
            const count = this.nodes.dataItems.length;
            const nodePadding = this.get("nodePadding", 10);
            const minRadius = this.get("minRadius", 5);
            width = width - count * (nodePadding + minRadius * 2);
            if (width <= 0) {
                width = 0;
            }
            let sumNoLow = sum - count * low;
            let c = width / sumNoLow;
            let prevCoord = 0;
            const animationDuration = this.get("animationDuration", 0);
            const animationEasing = this.get("animationEasing");
            $array.each(this.nodes.dataItems, (dataItem) => {
                let value = dataItem.get(radiusKey + "Working");
                const node = dataItem.get("node");
                let radius = minRadius + c * (value - low) / 2;
                if (radiusKey == "none") {
                    radius = minRadius + width / count / 2;
                }
                if (orientation == "vertical") {
                    node.set("x", 0);
                    const y = prevCoord + nodePadding + radius;
                    if (node.y() == 0) {
                        node.set("y", y);
                    }
                    else {
                        node.animate({ key: "y", to: y, duration: animationDuration, easing: animationEasing });
                    }
                }
                else {
                    node.set("y", 0);
                    const x = prevCoord + nodePadding + radius;
                    if (node.x() == 0) {
                        node.set("x", x);
                    }
                    else {
                        node.animate({ key: "x", to: x, duration: animationDuration, easing: animationEasing });
                    }
                }
                prevCoord = prevCoord + nodePadding + radius * 2;
                dataItem.get("circle").set("radius", radius);
            });
        }
    }
    _updateLinkColor(dataItem) {
        super._updateLinkColor(dataItem);
        const orientation = this.get("orientation");
        const fillGradient = dataItem.get("link")._fillGradient;
        const strokeGradient = dataItem.get("link")._strokeGradient;
        if (orientation == "vertical") {
            if (fillGradient) {
                fillGradient.set("rotation", 90);
            }
            if (strokeGradient) {
                strokeGradient.set("rotation", 90);
            }
        }
        else {
            if (fillGradient) {
                fillGradient.set("rotation", 0);
            }
            if (strokeGradient) {
                strokeGradient.set("rotation", 0);
            }
        }
    }
}
Object.defineProperty(ArcDiagram, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ArcDiagram"
});
Object.defineProperty(ArcDiagram, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Flow.classNames.concat([ArcDiagram.className])
});
//# sourceMappingURL=ArcDiagram.js.map