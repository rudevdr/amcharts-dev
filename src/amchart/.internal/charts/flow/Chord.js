import { Flow } from "./Flow";
import { chord, ribbon } from "d3-chord";
import { ascending, descending } from "d3";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import { ChordNodes } from "./ChordNodes";
import { ChordLink } from "./ChordLink";
import { p100, p50 } from "../../core/util/Percent";
import * as $array from "../../core/util/Array";
import * as $utils from "../../core/util/Utils";
import * as $math from "../../core/util/Math";
/**
 * Regular chord series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export class Chord extends Flow {
    constructor() {
        super(...arguments);
        /**
         * List of link elements.
         *
         * @default new ListTemplate<ChordLink>
         */
        Object.defineProperty(this, "links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => ChordLink._new(this._root, { themeTags: ["link", "shape"] }, [this.links.template]))
        });
        /**
         * A series for all chord nodes.
         *
         * @default ChordNodes.new()
         */
        Object.defineProperty(this, "nodes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(ChordNodes.new(this._root, {}))
        });
        Object.defineProperty(this, "_d3chord", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: chord()
        });
        Object.defineProperty(this, "_chordLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_ribbon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ribbon()
        });
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["chord"]);
        this.linksContainer.setAll({ x: p50, y: p50 });
        this.bulletsContainer.setAll({ x: p50, y: p50 });
        super._afterNew();
    }
    _fixRibbon(ribbon) {
        ribbon.startAngle((d) => {
            return d.startAngle + this.get("startAngle", 0) * $math.RADIANS + Math.PI / 2;
        });
        ribbon.endAngle((d) => {
            return d.endAngle + this.get("startAngle", 0) * $math.RADIANS + Math.PI / 2;
        });
    }
    /**
     * @ignore
     */
    makeLink(dataItem) {
        const link = this.linksContainer.children.push(this.links.make());
        this.links.push(link);
        link._setDataItem(dataItem);
        link.set("source", dataItem.get("source"));
        link.set("target", dataItem.get("target"));
        link.series = this;
        return link;
    }
    _makeMatrix() {
        const matrix = [];
        $array.each(this.nodes.dataItems, (sourceDataItem) => {
            const group = [];
            matrix.push(group);
            let outgoing = sourceDataItem.get("outgoingLinks");
            $array.each(this.nodes.dataItems, (targetDataItem) => {
                let value = 0;
                if (outgoing) {
                    $array.each(outgoing, (outgoingLink) => {
                        if (outgoingLink.get("target") === targetDataItem) {
                            value = outgoingLink.get("valueWorking");
                        }
                        let valueSum = this.getPrivate("valueSum", 0);
                        let minSize = this.get("minSize", 0);
                        if (value > 0 && minSize > 0) {
                            if (value < valueSum * minSize) {
                                value = valueSum * minSize;
                            }
                        }
                    });
                }
                group.push(value);
            });
        });
        return matrix;
    }
    _prepareChildren() {
        super._prepareChildren();
        this._fixRibbon(this._ribbon);
        let chordChanged = false;
        if (this._valuesDirty || this._sizeDirty || this.isDirty("padAngle") || this.isDirty("startAngle")) {
            const matrix = this._makeMatrix();
            this._d3chord.padAngle(this.get("padAngle", 0) * $math.RADIANS);
            const sort = this.get("sort");
            if (sort === "ascending") {
                this._d3chord.sortGroups(ascending);
            }
            else if (sort === "descending") {
                this._d3chord.sortGroups(descending);
            }
            /*
                        this._d3chord.sortSubgroups((a, b)=>{
                            if (a != Math.round(a)) return false
                            if (b != Math.round(b)) return true
                            return b < a ? -1 : b > a ? 1 : 0;
                        })
            */
            this._chordLayout = this._d3chord(matrix);
            chordChanged = true;
        }
        if (chordChanged || this.isDirty("radius") || this.isDirty("nodeWidth")) {
            let radius = $utils.relativeToValue(this.get("radius", 0), Math.min(this.innerWidth(), this.innerHeight())) / 2;
            let i = 0;
            const chordStartAngle = this.get("startAngle", 0);
            const nodeWidth = this.get("nodeWidth", 0);
            $array.each(this.nodes.dataItems, (dataItem) => {
                const slice = dataItem.get("slice");
                const chordGroup = this._chordLayout.groups[i];
                const startAngle = chordGroup.startAngle * $math.DEGREES + chordStartAngle;
                const endAngle = chordGroup.endAngle * $math.DEGREES + chordStartAngle;
                slice.setAll({ radius: radius, innerRadius: radius - nodeWidth, startAngle: startAngle, arc: endAngle - startAngle });
                const label = dataItem.get("label");
                label.setAll({ labelAngle: startAngle + (endAngle - startAngle) / 2 });
                label.setPrivate("radius", radius);
                label.setPrivate("innerRadius", 0.1);
                i++;
            });
            const linkRadius = radius - this.get("nodeWidth", 0);
            $array.each(this._chordLayout, (chord) => {
                let dataItem = this._linksByIndex[chord.source.index + "_" + chord.target.index];
                if (!dataItem) {
                    dataItem = this._linksByIndex[chord.target.index + "_" + chord.source.index];
                }
                if (dataItem) {
                    const link = dataItem.get("link");
                    this._getLinkPoints(link, linkRadius, chord);
                    this._updateLink(this._ribbon, link, linkRadius, chord);
                }
            });
        }
    }
    _getLinkPoints(link, linkRadius, chordLayoutItem) {
        const source = chordLayoutItem.source;
        const target = chordLayoutItem.target;
        const chordStartAngle = this.get("startAngle", 0) * $math.RADIANS;
        if (source && target) {
            const startAngle0 = source.startAngle;
            const endAngle0 = source.endAngle;
            const angle0 = startAngle0 + (endAngle0 - startAngle0) / 2 + chordStartAngle;
            const startAngle1 = target.startAngle;
            const endAngle1 = target.endAngle;
            const angle1 = startAngle1 + (endAngle1 - startAngle1) / 2 + chordStartAngle;
            link._p0 = { x: linkRadius * Math.cos(angle0), y: linkRadius * Math.sin(angle0) };
            link._p1 = { x: linkRadius * Math.cos(angle1), y: linkRadius * Math.sin(angle1) };
        }
    }
    _updateLink(ribbon, link, linkRadius, chordLayoutItem) {
        if (chordLayoutItem) {
            ribbon.sourceRadius($utils.relativeToValue(link.get("sourceRadius", p100), linkRadius));
            ribbon.targetRadius($utils.relativeToValue(link.get("targetRadius", p100), linkRadius));
            link.set("draw", (display) => {
                ribbon.context(display);
                ribbon(chordLayoutItem);
            });
        }
    }
}
Object.defineProperty(Chord, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Chord"
});
Object.defineProperty(Chord, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Flow.classNames.concat([Chord.className])
});
//# sourceMappingURL=Chord.js.map