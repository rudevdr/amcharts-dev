import { Flow } from "./Flow";
import { SankeyNodes } from "./SankeyNodes";
import { SankeyLink } from "./SankeyLink";
import { area, line } from "d3-shape";
import { curveMonotoneXTension } from "../../core/render/MonotoneXTension";
import { curveMonotoneYTension } from "../../core/render/MonotoneYTension";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import * as $array from "../../core/util/Array";
import * as $type from "../../core/util/Type";
import * as $utils from "../../core/util/Utils";
import * as d3sankey from "d3-sankey";
/**
 * Sankey series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export class Sankey extends Flow {
    constructor() {
        super(...arguments);
        /**
         * List of link elements.
         *
         * @default new ListTemplate<SankeyLink>
         */
        Object.defineProperty(this, "links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => SankeyLink._new(this._root, { themeTags: ["link", "shape"] }, [this.links.template]))
        });
        /**
         * A series representing sankey nodes.
         *
         * @default SankeyNodes.new()
         */
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(SankeyNodes.new(this._root, {}))
        });
        Object.defineProperty(this, "_d3Sankey", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: d3sankey.sankey()
        });
        Object.defineProperty(this, "_d3Graph", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_fillGenerator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: area()
        });
        Object.defineProperty(this, "_strokeGenerator", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: line()
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["sankey", this._settings.orientation || "horizontal"]);
        this._fillGenerator.y0(function (p) {
            return p[3];
        });
        this._fillGenerator.x0(function (p) {
            return p[2];
        });
        this._fillGenerator.y1(function (p) {
            return p[1];
        });
        this._fillGenerator.x1(function (p) {
            return p[0];
        });
        super._afterNew();
    }
    /**
     * @ignore
     */
    makeLink(dataItem) {
        const source = dataItem.get("source");
        const target = dataItem.get("target");
        const link = this.links.make();
        if (source.get("unknown")) {
            link.addTag("source");
            link.addTag("unknown");
        }
        if (target.get("unknown")) {
            link.addTag("target");
            link.addTag("unknown");
        }
        this.linksContainer.children.push(link);
        link._setDataItem(dataItem);
        link.set("source", source);
        link.set("target", target);
        link.series = this;
        this.links.push(link);
        return link;
    }
    /**
     * @ignore
     */
    updateSankey() {
        const d3Graph = this._d3Graph;
        if (d3Graph) {
            this._d3Sankey.update(d3Graph);
            $array.each(this.dataItems, (dataItem) => {
                const link = dataItem.get("link");
                link.setPrivate("orientation", this.get("orientation"));
                link.markDirty();
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
    _getBulletLocation(bullet) {
        if (this.get("orientation") == "vertical") {
            return bullet.get("locationY", 0);
        }
        else {
            return bullet.get("locationX", 0);
        }
    }
    _prepareChildren() {
        super._prepareChildren();
        let vertical = false;
        if (this.get("orientation") == "vertical") {
            vertical = true;
        }
        if (this.isDirty("orientation") || this.isDirty("linkTension")) {
            const linkTension = this.get("linkTension", 0.5);
            if (vertical) {
                this._fillGenerator.curve(curveMonotoneYTension(linkTension));
                this._strokeGenerator.curve(curveMonotoneYTension(linkTension));
            }
            else {
                this._fillGenerator.curve(curveMonotoneXTension(linkTension));
                this._strokeGenerator.curve(curveMonotoneXTension(linkTension));
            }
        }
        if (this._valuesDirty || this._sizeDirty || this.isDirty("nodePadding") || this.isDirty("nodeWidth") || this.isDirty("nodeAlign") || this.isDirty("nodeSort") || this.isDirty("orientation") || this.isDirty("linkTension") || this.isDirty("linkSort")) {
            if (this._nodesData.length > 0) {
                const d3Sankey = this._d3Sankey;
                let w = this.innerWidth();
                let h = this.innerHeight();
                if (vertical) {
                    [w, h] = [h, w];
                }
                d3Sankey.size([w, h]);
                d3Sankey.nodePadding(this.get("nodePadding", 10));
                d3Sankey.nodeWidth(this.get("nodeWidth", 10));
                d3Sankey.nodeSort(this.get("nodeSort", null));
                d3Sankey.linkSort(this.get("linkSort"));
                switch (this.get("nodeAlign")) {
                    case "right":
                        d3Sankey.nodeAlign(d3sankey.sankeyRight);
                        break;
                    case "justify":
                        d3Sankey.nodeAlign(d3sankey.sankeyJustify);
                        break;
                    case "center":
                        d3Sankey.nodeAlign(d3sankey.sankeyCenter);
                        break;
                    default:
                        d3Sankey.nodeAlign(d3sankey.sankeyLeft);
                        break;
                }
                this._d3Graph = d3Sankey({ nodes: this._nodesData, links: this._linksData });
                $array.each(this.dataItems, (dataItem) => {
                    const link = dataItem.get("link");
                    link.setPrivate("orientation", this.get("orientation"));
                    link.markDirty();
                });
                const d3Graph = this._d3Graph;
                if (d3Graph) {
                    const nodes = d3Graph.nodes;
                    $array.each(nodes, (d3SankeyNode) => {
                        const dataItem = d3SankeyNode.dataItem;
                        const node = dataItem.get("node");
                        let x0;
                        let x1;
                        let y0;
                        let y1;
                        if (vertical) {
                            x0 = d3SankeyNode.y0;
                            x1 = d3SankeyNode.y1;
                            y0 = d3SankeyNode.x0;
                            y1 = d3SankeyNode.x1;
                        }
                        else {
                            x0 = d3SankeyNode.x0;
                            x1 = d3SankeyNode.x1;
                            y0 = d3SankeyNode.y0;
                            y1 = d3SankeyNode.y1;
                        }
                        if ($type.isNumber(x0) && $type.isNumber(x1) && $type.isNumber(y0) && $type.isNumber(y1)) {
                            node.setAll({ x: x0, y: y0, width: x1 - x0, height: y1 - y0 });
                            const rectangle = dataItem.get("rectangle");
                            rectangle.setAll({ width: x1 - x0, height: y1 - y0 });
                        }
                    });
                }
            }
        }
    }
}
Object.defineProperty(Sankey, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Sankey"
});
Object.defineProperty(Sankey, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Flow.classNames.concat([Sankey.className])
});
//# sourceMappingURL=Sankey.js.map