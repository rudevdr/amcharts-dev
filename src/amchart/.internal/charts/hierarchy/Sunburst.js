import { Partition } from "./Partition";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { Slice } from "../../core/render/Slice";
import { RadialLabel } from "../../core/render/RadialLabel";
import { p100, p50 } from "../../core/util/Percent";
import * as $array from "../../core/util/Array";
import * as d3hierarchy from "d3-hierarchy";
import * as $utils from "../../core/util/Utils";
import * as $type from "../../core/util/Type";
import * as $math from "../../core/util/Math";
;
/**
 * Builds a sunburst diagram.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/sunburst/} for more info
 * @important
 */
export class Sunburst extends Partition {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "sunburst"
        });
        Object.defineProperty(this, "_partitionLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3hierarchy.partition()
        });
        /**
         * A list of node slice elements in a [[Sunburst]] chart.
         *
         * @default new ListTemplate<Slice>
         */
        Object.defineProperty(this, "slices", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Slice._new(this._root, {
                themeTags: $utils.mergeTags(this.slices.template.get("themeTags", []), [this._tag, "hierarchy", "node", "shape"])
            }, [this.slices.template]))
        });
        /**
         * A list of label elements in a [[Hierarchy]] chart.
         *
         * @default new ListTemplate<RadialLabel>
         */
        Object.defineProperty(this, "labels", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => RadialLabel._new(this._root, {
                themeTags: $utils.mergeTags(this.labels.template.get("themeTags", []), [this._tag])
            }, [this.labels.template]))
        });
    }
    _afterNew() {
        super._afterNew();
        this.nodesContainer.setAll({ x: p50, y: p50 });
        this.setPrivateRaw("dx", 0);
        this.setPrivateRaw("dr", 0);
    }
    _prepareChildren() {
        super._prepareChildren();
        if (this.isPrivateDirty("dr") || this.isPrivateDirty("dx")) {
            if (this._rootNode) {
                this._updateNodesScale(this._rootNode);
            }
        }
    }
    _updateVisuals() {
        if (this._rootNode) {
            const partitionLayout = this._partitionLayout;
            let bounds = $math.getArcBounds(0, 0, this.get("startAngle", 0), this.get("endAngle", 360), 1);
            let w = this.innerWidth();
            let h = this.innerHeight();
            const wr = w / (bounds.right - bounds.left);
            const hr = h / (bounds.bottom - bounds.top);
            let s = Math.min(wr, hr);
            let r = $utils.relativeToValue(this.get("radius", p100), s);
            let ir = $utils.relativeToValue(this.get("innerRadius", 0), r);
            if (ir < 0) {
                ir = r + ir;
            }
            s = r - ir;
            this.setPrivateRaw("innerRadius", ir);
            this.setPrivateRaw("hierarchySize", s);
            partitionLayout.size([s, s]);
            this.nodesContainer.setAll({
                dy: -r * (bounds.bottom + bounds.top) / 2, dx: -r * (bounds.right + bounds.left) / 2
            });
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
        const hierarchyNode = dataItem.get("d3HierarchyNode");
        const node = dataItem.get("node");
        node.setAll({ x: 0, y: 0 });
        const duration = this.get("animationDuration", 0);
        const easing = this.get("animationEasing");
        const scaleX = this.getPrivate("scaleX", 1);
        const scaleY = this.getPrivate("scaleY", 1);
        const dr = this.getPrivate("dr", 0);
        const dx = this.getPrivate("dx", 0);
        const x0 = hierarchyNode.x0 * scaleX + dx;
        const x1 = hierarchyNode.x1 * scaleX + dx;
        const y0 = hierarchyNode.y0 * scaleY;
        const y1 = hierarchyNode.y1 * scaleY;
        const ir = this.getPrivate("innerRadius");
        const hs = this.getPrivate("hierarchySize", 0);
        const slice = dataItem.get("slice");
        if (slice) {
            const startAngle = this.get("startAngle", -90);
            const endAngle = this.get("endAngle", 270);
            const sliceStartAngle = startAngle + x0 / hs * (endAngle - startAngle);
            const arc = startAngle + x1 / hs * (endAngle - startAngle) - sliceStartAngle;
            let sliceInnerRadius = ir + y0;
            let sliceRadius = ir + y1;
            sliceInnerRadius -= dr;
            sliceRadius -= dr;
            sliceRadius = Math.max(0, sliceRadius);
            sliceInnerRadius = Math.max(0, sliceInnerRadius);
            slice.animate({ key: "radius", to: sliceRadius, duration: duration, easing: easing });
            slice.animate({ key: "innerRadius", to: sliceInnerRadius, duration: duration, easing: easing });
            slice.animate({ key: "startAngle", to: sliceStartAngle, duration: duration, easing: easing });
            slice.animate({ key: "arc", to: arc, duration: duration, easing: easing });
            const fill = dataItem.get("fill");
            slice._setDefault("fill", fill);
            slice._setDefault("stroke", fill);
        }
    }
    _updateNodesScale(hierarchyNode) {
        const dataItem = hierarchyNode.data.dataItem;
        if (dataItem) {
            const scaleX = this.getPrivate("scaleX", 1);
            const scaleY = this.getPrivate("scaleY", 1);
            const dr = this.getPrivate("dr", 0);
            const dx = this.getPrivate("dx", 0);
            const x0 = hierarchyNode.x0 * scaleX + dx;
            const x1 = hierarchyNode.x1 * scaleX + dx;
            const y0 = hierarchyNode.y0 * scaleY;
            const y1 = hierarchyNode.y1 * scaleY;
            const ir = this.getPrivate("innerRadius");
            const hs = this.getPrivate("hierarchySize", 0);
            const slice = dataItem.get("slice");
            if (slice) {
                const startAngle = this.get("startAngle", -90);
                const endAngle = this.get("endAngle", 270);
                const sliceStartAngle = startAngle + x0 / hs * (endAngle - startAngle);
                const arc = startAngle + x1 / hs * (endAngle - startAngle) - sliceStartAngle;
                let sliceInnerRadius = ir + y0;
                let sliceRadius = ir + y1;
                sliceInnerRadius -= dr;
                sliceRadius -= dr;
                sliceRadius = Math.max(0, sliceRadius);
                sliceInnerRadius = Math.max(0, sliceInnerRadius);
                slice.setAll({ radius: sliceRadius, innerRadius: sliceInnerRadius, startAngle: sliceStartAngle, arc: arc });
            }
            const hierarchyChildren = hierarchyNode.children;
            if (hierarchyChildren) {
                $array.each(hierarchyChildren, (hierarchyChild) => {
                    this._updateNodesScale(hierarchyChild);
                });
            }
        }
    }
    _makeNode(dataItem, node) {
        const slice = node.children.moveValue(this.slices.make(), 0);
        node.setPrivate("tooltipTarget", slice);
        dataItem.setRaw("slice", slice);
        slice._setDataItem(dataItem);
        slice.on("arc", () => {
            this._updateLabel(dataItem);
        });
        slice.on("innerRadius", () => {
            this._updateLabel(dataItem);
        });
        slice.on("radius", () => {
            this._updateLabel(dataItem);
        });
    }
    _updateLabel(dataItem) {
        const slice = dataItem.get("slice");
        const label = dataItem.get("label");
        if (slice && label) {
            let innerRadius = slice.get("innerRadius", 0);
            let radius = slice.get("radius", 0);
            let angle = slice.get("startAngle", 0);
            let arc = Math.abs(slice.get("arc", 0));
            let labelAngle = angle + arc / 2;
            let textType = label.get("textType");
            let maxWidth = radius - innerRadius;
            let maxHeight = radius * arc * $math.RADIANS;
            if (innerRadius == 0 && arc >= 360 && textType == "radial") {
                radius = 1;
                labelAngle = 0;
                maxWidth *= 2;
                maxHeight = maxWidth;
            }
            if (Math.round(arc) >= 360 && textType == "radial") {
                labelAngle = 0;
            }
            if (textType == "circular") {
                maxWidth = arc * $math.RADIANS * (innerRadius + (radius - innerRadius) / 2) - 10;
            }
            label.setAll({ labelAngle: labelAngle });
            label.setPrivate("radius", radius);
            label.setPrivate("innerRadius", innerRadius);
            label.setAll({
                maxHeight: maxHeight,
                maxWidth: maxWidth
            });
        }
    }
    _zoom(dataItem) {
        let x0 = 0;
        let x1 = 0;
        let hs = this.getPrivate("hierarchySize", 0);
        const hierarchyNode = dataItem.get("d3HierarchyNode");
        let upDepth = this.get("upDepth", 0);
        let topDepth = this.get("topDepth", 0);
        let currentDepth = hierarchyNode.depth;
        let maxDepth = this.getPrivate("maxDepth", 1);
        let downDepth = this._currentDownDepth;
        if (downDepth == null) {
            downDepth = this.get("downDepth", 1);
        }
        const levelHeight = hs / (maxDepth + 1);
        if (currentDepth < topDepth) {
            currentDepth = topDepth;
        }
        if (currentDepth - upDepth < 0) {
            upDepth = currentDepth;
        }
        x0 = hierarchyNode.x0;
        x1 = hierarchyNode.x1;
        let scaleDepth = (downDepth + upDepth + 1);
        if (scaleDepth > maxDepth - topDepth + 1) {
            scaleDepth = maxDepth - topDepth + 1;
        }
        let scaleX = hs / (x1 - x0);
        let scaleY = hs / (levelHeight * scaleDepth);
        let dr = Math.max(currentDepth - upDepth, topDepth) * levelHeight * scaleY;
        const easing = this.get("animationEasing");
        let duration = this.get("animationDuration", 0);
        if (!this.inited) {
            duration = 0;
        }
        let dx = -x0 * scaleX;
        this.animatePrivate({ key: "scaleX", to: scaleX, duration: duration, easing: easing });
        this.animatePrivate({ key: "scaleY", to: scaleY, duration: duration, easing: easing });
        this.animatePrivate({ key: "dr", to: dr, duration: duration, easing: easing });
        this.animatePrivate({ key: "dx", to: dx, duration: duration, easing: easing });
    }
    _handleSingle(dataItem) {
        const parent = dataItem.get("parent");
        if (parent) {
            const children = parent.get("children");
            if (children) {
                $array.each(children, (child) => {
                    if (child != dataItem) {
                        this.disableDataItem(child);
                        child.get("node").hide();
                    }
                });
            }
            this._handleSingle(parent);
        }
    }
    _positionBullet(bullet) {
        const sprite = bullet.get("sprite");
        if (sprite) {
            const dataItem = sprite.dataItem;
            const locationX = bullet.get("locationX", 0.5);
            const locationY = bullet.get("locationY", 0.5);
            const slice = dataItem.get("slice");
            const arc = slice.get("arc", 0);
            const angle = slice.get("startAngle", 0) + slice.get("arc", 0) * locationX;
            const innerRadius = slice.get("innerRadius", 0);
            const radius = innerRadius + (slice.get("radius", 0) - innerRadius) * locationY;
            let x = $math.cos(angle) * radius;
            let y = $math.sin(angle) * radius;
            if ($math.round(arc, 5) === 360 && $math.round(innerRadius, 2) === 0) {
                x = 0;
                y = 0;
            }
            sprite.set("x", x);
            sprite.set("y", y);
        }
    }
    _makeBullet(dataItem, bulletFunction, index) {
        const bullet = super._makeBullet(dataItem, bulletFunction, index);
        if (bullet) {
            const sprite = bullet.get("sprite");
            const slice = dataItem.get("slice");
            if (sprite && slice) {
                slice.on("arc", () => {
                    this._positionBullet(bullet);
                });
                slice.on("radius", () => {
                    this._positionBullet(bullet);
                });
            }
            return bullet;
        }
    }
}
Object.defineProperty(Sunburst, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Sunburst"
});
Object.defineProperty(Sunburst, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Partition.classNames.concat([Sunburst.className])
});
//# sourceMappingURL=Sunburst.js.map