import { ChordLink } from "./ChordLink";
import * as $utils from "../../core/util/Utils";
/**
 * A link element used in [[ChordDirected]] chart.
 */
export class ChordLinkDirected extends ChordLink {
    _afterNew() {
        this._settings.themeTags = $utils.mergeTags(this._settings.themeTags, ["chord", "link", "directed"]);
        super._afterNew();
    }
}
Object.defineProperty(ChordLinkDirected, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ChordLinkDirected"
});
Object.defineProperty(ChordLinkDirected, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: ChordLink.classNames.concat([ChordLinkDirected.className])
});
//# sourceMappingURL=ChordLinkDirected.js.map