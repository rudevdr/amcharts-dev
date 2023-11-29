import { Hierarchy } from "./Hierarchy";
import { Circle } from "../../core/render/Circle";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import * as $array from "../../core/util/Array";
import * as d3hierarchy from "d3-hierarchy";
import * as $utils from "../../core/util/Utils";
;
/**
 * Builds a pack diagram.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/sunburst/} for more info
 * @important
 */
export class Pack extends Hierarchy {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "pack"
        });
        Object.defineProperty(this, "_packLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3hierarchy.pack()
        });
        Object.defineProperty(this, "_packData", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A list of node circle elements in a [[Pack]] chart.
         *
         * @default new ListTemplate<Circle>
         */
        Object.defineProperty(this, "circles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Circle._new(this._root, {
                themeTags: $utils.mergeTags(this.circles.template.get("themeTags", []), [this._tag, "shape"])
            }, [this.circles.template]))
        });
    }
    _afterNew() {
        super._afterNew();
        this.setPrivate("scaleR", 1);
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isPrivateDirty("scaleR")) {
            if (this._rootNode) {
                this._updateNodesScale(this._rootNode);
            }
        }
    }
    _updateVisuals() {
        if (this._rootNode) {
            const packLayout = this._packLayout;
            packLayout.size([this.innerWidth(), this.innerHeight()]);
            packLayout(this._rootNode);
            packLayout.padding(this.get("nodePadding", 0));
            this._updateNodes(this._rootNode);
        }
    }
    _updateNode(dataItem) {
        super._updateNode(dataItem);
        const node = dataItem.get("node");
        const circle = dataItem.get("circle");
        const hierarchyNode = dataItem.get("d3HierarchyNode");
        const scaleR = this.getPrivate("scaleR", 1);
        const x = hierarchyNode.x * scaleR;
        const y = hierarchyNode.y * scaleR;
        const radius = hierarchyNode.r * scaleR;
        const duration = this.get("animationDuration", 0);
        const easing = this.get("animationEasing");
        node.animate({ key: "x", to: x, duration: duration, easing: easing });
        node.animate({ key: "y", to: y, duration: duration, easing: easing });
        if (circle) {
            const fill = dataItem.get("fill");
            circle.animate({ key: "radius", to: radius, duration: duration, easing: easing });
            circle._setDefault("fill", fill);
            circle._setDefault("stroke", fill);
        }
    }
    _updateNodesScale(hierarchyNode) {
        const dataItem = hierarchyNode.data.dataItem;
        if (dataItem) {
            const node = dataItem.get("node");
            const circle = dataItem.get("circle");
            const scaleR = this.getPrivate("scaleR", 1);
            const x = hierarchyNode.x * scaleR;
            const y = hierarchyNode.y * scaleR;
            const radius = hierarchyNode.r * scaleR;
            node.setAll({ x: x, y: y });
            circle.set("radius", radius);
            const hierarchyChildren = hierarchyNode.children;
            if (hierarchyChildren) {
                $array.each(hierarchyChildren, (hierarchyChild) => {
                    this._updateNodesScale(hierarchyChild);
                });
            }
        }
    }
    /**
     * @ignore
     */
    makeNode(dataItem) {
        const node = super.makeNode(dataItem);
        const circle = node.children.moveValue(this.circles.make(), 0);
        node.setPrivate("tooltipTarget", circle);
        this.circles.push(circle);
        dataItem.setRaw("circle", circle);
        const label = dataItem.get("label");
        circle.on("radius", () => {
            const d = circle.get("radius", this.width()) * 2;
            label.setAll({ maxWidth: d, maxHeight: d });
        });
        return node;
    }
    _zoom(dataItem) {
        const hierarchyNode = dataItem.get("d3HierarchyNode");
        let x = hierarchyNode.x;
        let y = hierarchyNode.y;
        let r = hierarchyNode.r;
        let scaleR = Math.min(this.innerWidth(), this.innerHeight()) / (r * 2);
        const easing = this.get("animationEasing");
        let duration = this.get("animationDuration", 0);
        if (!this.inited) {
            duration = 0;
        }
        this.animatePrivate({ key: "scaleR", to: scaleR, duration: duration, easing: easing });
        const nodesContainer = this.nodesContainer;
        nodesContainer.animate({ key: "x", from: nodesContainer.x(), to: this.width() / 2 - x * scaleR, duration: duration, easing: easing });
        nodesContainer.animate({ key: "y", from: nodesContainer.y(), to: this.height() / 2 - y * scaleR, duration: duration, easing: easing });
    }
}
Object.defineProperty(Pack, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Pack"
});
Object.defineProperty(Pack, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Hierarchy.classNames.concat([Pack.className])
});
//# sourceMappingURL=Pack.js.map