import { Chord } from "./Chord";
import { ChordLinkDirected } from "./ChordLinkDirected";
import { chordDirected, ribbonArrow, ribbon } from "d3-chord";
import { Template } from "../../core/util/Template";
import { ListTemplate } from "../../core/util/List";
import * as $utils from "../../core/util/Utils";
/**
 * Directed chord series.
 *
 * @see {@link https://www.amcharts.com/docs/v5/charts/flow-charts/} for more information
 * @important
 */
export class ChordDirected extends Chord {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_d3chord", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: chordDirected()
        });
        Object.defineProperty(this, "_ribbonArrow", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ribbonArrow()
        });
        /**
         * List of link elements.
         *
         * @default new ListTemplate<ChordLinkDirected>
         */
        Object.defineProperty(this, "links", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new ListTemplate(Template.new({}), () => ChordLinkDirected._new(this._root, { themeTags: ["link", "shape"] }, [this.links.template]))
        });
    }
    /**
     * @ignore
     */
    makeLink(dataItem) {
        const link = this.linksContainer.children.push(this.links.make());
        link._setDataItem(dataItem);
        link.set("source", dataItem.get("source"));
        link.set("target", dataItem.get("target"));
        link.series = this;
        return link;
    }
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["directed"]);
        super._afterNew();
        this._markDirtyKey("linkHeadRadius");
    }
    _prepareChildren() {
        const linkHeadRadius = "linkHeadRadius";
        if (this.isDirty(linkHeadRadius)) {
            const headRadius = this.get(linkHeadRadius);
            if (headRadius == null) {
                this._ribbon = ribbon();
            }
            else {
                let ribbon = ribbonArrow();
                ribbon.headRadius(headRadius);
                this._ribbon = ribbon;
            }
        }
        super._prepareChildren();
    }
}
Object.defineProperty(ChordDirected, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ChordDirected"
});
Object.defineProperty(ChordDirected, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Chord.classNames.concat([ChordDirected.className])
});
//# sourceMappingURL=ChordDirected.js.map