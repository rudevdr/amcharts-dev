import { voronoiTreemap } from 'd3-voronoi-treemap';
import seedrandom from "seedrandom";
import { Hierarchy } from "../hierarchy/Hierarchy";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { Polygon } from "../../core/render/Polygon";
import * as $utils from "../../core/util/Utils";
import * as $array from "../../core/util/Array";
import { p50 } from "../../core/util/Percent";
;
/**
 * A Weighted Voronoi Treemap series.
 *
 * NOTE: Try to avoid a big number of data items with very big value
 * differences. Better group small items into "Other" item.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/hierarchy/voronoi-treemap/} for more info
 * @since 5.4.0
 */
export class VoronoiTreemap extends Hierarchy {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_tag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "voronoitreemap"
        });
        /**
         * A list of node graphics elements in a [[VoronoiTreemap]] chart.
         *
         * @default new ListTemplate<RoundedRectangle>
         */
        Object.defineProperty(this, "polygons", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => Polygon._new(this._root, {
                themeTags: $utils.mergeTags(this.polygons.template.get("themeTags", []), [this._tag, "shape"])
            }, [this.polygons.template]))
        });
        Object.defineProperty(this, "voronoi", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: voronoiTreemap()
        });
    }
    _afterNew() {
        this.nodesContainer.setAll({
            x: p50,
            y: p50,
            centerX: p50,
            centerY: p50
        });
        super._afterNew();
    }
    _prepareChildren() {
        super._prepareChildren();
        const width = this.innerWidth() / 2;
        const height = this.innerHeight() / 2;
        let node = this._rootNode;
        const selectedDataItem = this.get("selectedDataItem");
        if (selectedDataItem) {
            node = selectedDataItem.get("d3HierarchyNode");
        }
        this.voronoi.convergenceRatio((this.get("convergenceRatio", 0.005)));
        this.voronoi.maxIterationCount((this.get("maxIterationCount", 100)));
        this.voronoi.minWeightRatio((this.get("minWeightRatio", 0.005)));
        if (this.isDirty("type")) {
            if (this.get("type") == "polygon") {
                this.voronoi.clip(this.getCirclePolygon(1));
                this._updateVisuals();
            }
        }
        if (this._sizeDirty) {
            if (this.get("type") == "rectangle") {
                this.voronoi.prng(seedrandom("X"));
                this.voronoi.clip([[-width, -height], [-width, height], [width, height], [width, -height]])(node);
                this._updateVisuals();
            }
        }
        if ((this._valuesDirty || this.isDirty("selectedDataItem")) && node) {
            this.voronoi.prng(seedrandom("X"));
            this.voronoi(node);
            this._updateVisuals();
        }
    }
    _updateNode(dataItem) {
        const coords = dataItem.get("d3HierarchyNode").polygon;
        const polygon = dataItem.get("polygon");
        if (coords && polygon) {
            let coordinates = [];
            let d = 1;
            if (this.get("type") == "polygon") {
                d = Math.min(this.innerWidth(), this.innerHeight()) / 2;
            }
            let minX = Infinity;
            let maxX = -Infinity;
            for (let i = 0, len = coords.length; i < len; i++) {
                const point = coords[i];
                let x = point[0] * d;
                let y = point[1] * d;
                coordinates.push([x, y]);
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
            }
            polygon.set("coordinates", coordinates);
            const fill = dataItem.get("fill");
            polygon._setDefault("fill", fill);
            const label = dataItem.get("label");
            if (label) {
                const site = coords.site;
                if (site) {
                    label.setAll({
                        x: site.x * d,
                        y: site.y * d,
                        maxWidth: Math.abs(maxX - minX)
                    });
                }
            }
        }
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
    /**
     * @ignore
     */
    makeNode(dataItem) {
        const node = super.makeNode(dataItem);
        this._makeNode(dataItem, node);
        return node;
    }
    _makeNode(dataItem, node) {
        const polygon = node.children.moveValue(this.polygons.make(), 0);
        node.setPrivate("tooltipTarget", polygon);
        dataItem.setRaw("polygon", polygon);
        polygon._setDataItem(dataItem);
    }
    getCirclePolygon(radius) {
        const points = this.get("cornerCount", 120);
        const dAngle = Math.PI * 2 / points;
        const polygon = [];
        for (let i = 0; i < points; i++) {
            let angle = i * dAngle;
            polygon.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
        }
        return polygon;
    }
}
Object.defineProperty(VoronoiTreemap, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "VoronoiTreemap"
});
Object.defineProperty(VoronoiTreemap, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Hierarchy.classNames.concat([VoronoiTreemap.className])
});
//# sourceMappingURL=VoronoiTreemap.js.map