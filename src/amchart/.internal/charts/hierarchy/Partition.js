import { Hierarchy } from "./Hierarchy";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { RoundedRectangle } from "../../core/render/RoundedRectangle";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
import * as $utils from "../../core/util/Utils";
import * as d3hierarchy from "d3-hierarchy";
;
/**
 * Partition series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/partition/} for more info
 */
export class Partition extends Hierarchy {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "partition"
        });
        /**
         * A list of node rectangle elements in a [[Partition]] chart.
         *
         * @default new ListTemplate<RoundedRectangle>
         */
        Object.defineProperty(this, "rectangles", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => RoundedRectangle._new(this._root, {
                themeTags: $utils.mergeTags(this.rectangles.template.get("themeTags", []), [this._tag, "shape"])
            }, [this.rectangles.template]))
        });
        Object.defineProperty(this, "_partitionLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3hierarchy.partition()
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["partition", this._settings.orientation || "vertical"]);
        super._afterNew();
        this.setPrivate("scaleX", 1);
        this.setPrivate("scaleY", 1);
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isDirty("nodePadding")) {
            if (this._rootNode) {
                this._updateNodes(this._rootNode);
            }
        }
        if (this.isPrivateDirty("scaleX") || this.isPrivateDirty("scaleY")) {
            if (this._rootNode) {
                this._updateNodesScale(this._rootNode);
            }
        }
        if (this.isDirty("orientation")) {
            this._updateVisuals();
        }
    }
    _updateVisuals() {
        if (this._rootNode) {
            const partitionLayout = this._partitionLayout;
            let w = this.innerWidth();
            let h = this.innerHeight();
            if (this.get("orientation") == "horizontal") {
                [w, h] = [h, w];
            }
            partitionLayout.size([w, h]);
            const nodePadding = this.get("nodePadding");
            if ($type.isNumber(nodePadding)) {
                partitionLayout.padding(nodePadding);
            }
            partitionLayout(this._rootNode);
            this._updateNodes(this._rootNode);
        }
    }
    _updateNode(dataItem) {
        super._updateNode(dataItem);
        const node = dataItem.get("node");
        const rectangle = dataItem.get("rectangle");
        const hierarchyNode = dataItem.get("d3HierarchyNode");
        const scaleX = this.getPrivate("scaleX", 1);
        const scaleY = this.getPrivate("scaleY", 1);
        let x0, x1, y0, y1;
        if (this.get("orientation") == "horizontal") {
            x0 = hierarchyNode.y0 * scaleX;
            x1 = hierarchyNode.y1 * scaleX;
            y0 = hierarchyNode.x0 * scaleY;
            y1 = hierarchyNode.x1 * scaleY;
        }
        else {
            x0 = hierarchyNode.x0 * scaleX;
            x1 = hierarchyNode.x1 * scaleX;
            y0 = hierarchyNode.y0 * scaleY;
            y1 = hierarchyNode.y1 * scaleY;
        }
        let w = x1 - x0;
        let h = y1 - y0;
        const duration = this.get("animationDuration", 0);
        const easing = this.get("animationEasing");
        node.animate({ key: "x", to: x0, duration: duration, easing: easing });
        node.animate({ key: "y", to: y0, duration: duration, easing: easing });
        node.animate({ key: "width", to: w, duration: duration, easing: easing });
        node.animate({ key: "height", to: h, duration: duration, easing: easing });
        if (rectangle) {
            const fill = dataItem.get("fill");
            rectangle.animate({ key: "width", to: w, duration: duration, easing: easing });
            rectangle.animate({ key: "height", to: h, duration: duration, easing: easing });
            rectangle._setDefault("fill", fill);
            rectangle._setDefault("stroke", fill);
        }
    }
    _updateNodesScale(hierarchyNode) {
        const dataItem = hierarchyNode.data.dataItem;
        if (dataItem) {
            const node = dataItem.get("node");
            const rectangle = dataItem.get("rectangle");
            const scaleX = this.getPrivate("scaleX", 1);
            const scaleY = this.getPrivate("scaleY", 1);
            let x0, x1, y0, y1;
            if (this.get("orientation") == "horizontal") {
                x0 = hierarchyNode.y0 * scaleX;
                x1 = hierarchyNode.y1 * scaleX;
                y0 = hierarchyNode.x0 * scaleY;
                y1 = hierarchyNode.x1 * scaleY;
            }
            else {
                x0 = hierarchyNode.x0 * scaleX;
                x1 = hierarchyNode.x1 * scaleX;
                y0 = hierarchyNode.y0 * scaleY;
                y1 = hierarchyNode.y1 * scaleY;
            }
            const w = x1 - x0;
            const h = y1 - y0;
            node.setAll({ x: x0, y: y0, width: w, height: h });
            rectangle.setAll({ width: w, height: h });
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
        this._makeNode(dataItem, node);
        return node;
    }
    _makeNode(dataItem, node) {
        const rectangle = node.children.moveValue(this.rectangles.make(), 0);
        node.setPrivate("tooltipTarget", rectangle);
        dataItem.setRaw("rectangle", rectangle);
        rectangle._setDataItem(dataItem);
        const label = dataItem.get("label");
        rectangle.on("width", () => {
            label.set("maxWidth", rectangle.width());
        });
        rectangle.on("height", () => {
            label.set("maxHeight", rectangle.height());
        });
    }
    _zoom(dataItem) {
        let x0 = 0;
        let x1 = 0;
        let y0 = 0;
        let y1 = 0;
        const upDepth = this.get("upDepth", 0) + 1;
        const topDepth = this.get("topDepth", 0);
        const width = this.innerWidth();
        const height = this.innerHeight();
        const maxDepth = this.getPrivate("maxDepth", 1);
        const levelHeight = height / (maxDepth + 1);
        const levelWidth = width / (maxDepth + 1);
        const initialDepth = Math.min(this.get("initialDepth", 1), maxDepth - topDepth);
        let downDepth = this._currentDownDepth;
        if (downDepth == null) {
            downDepth = this.get("downDepth", 1);
        }
        if (dataItem) {
            const hierarchyNode = dataItem.get("d3HierarchyNode");
            let currentDepth = hierarchyNode.depth;
            if (this.get("orientation") == "horizontal") {
                x0 = hierarchyNode.y0;
                x1 = hierarchyNode.y1;
                y0 = hierarchyNode.x0;
                y1 = hierarchyNode.x1;
                x0 = x1 - levelWidth * upDepth;
                x1 = x0 + levelWidth * (downDepth + 1);
                if (currentDepth < topDepth) {
                    y0 = 0;
                    y1 = height;
                    x0 = levelWidth * topDepth;
                    x1 = x0 + levelWidth * initialDepth;
                }
            }
            else {
                x0 = hierarchyNode.x0;
                x1 = hierarchyNode.x1;
                y0 = hierarchyNode.y0;
                y1 = hierarchyNode.y1;
                y0 = y1 - levelHeight * upDepth;
                y1 = y0 + levelHeight * (downDepth + 1);
                if (currentDepth < topDepth) {
                    x0 = 0;
                    x1 = width;
                    y0 = levelHeight * topDepth;
                    y1 = y0 + levelHeight * initialDepth;
                }
            }
        }
        let scaleX = width / (x1 - x0);
        let scaleY = height / (y1 - y0);
        const easing = this.get("animationEasing");
        let duration = this.get("animationDuration", 0);
        if (!this.inited) {
            duration = 0;
        }
        this.animatePrivate({ key: "scaleX", to: scaleX, duration: duration, easing: easing });
        this.animatePrivate({ key: "scaleY", to: scaleY, duration: duration, easing: easing });
        this.nodesContainer.animate({ key: "x", to: -x0 * scaleX, duration: duration, easing: easing });
        this.nodesContainer.animate({ key: "y", to: -y0 * scaleY, duration: duration, easing: easing });
    }
}
Object.defineProperty(Partition, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Partition"
});
Object.defineProperty(Partition, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Hierarchy.classNames.concat([Partition.className])
});
//# sourceMappingURL=Partition.js.map