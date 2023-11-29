import { FlowLink } from "./FlowLink";
import * as $math from "../../core/util/Math";
/**
 * A link element used in [[Chord]] chart.
 */
export class ChordLink extends FlowLink {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_p0", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_p1", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    getPoint(location) {
        if (this._p0 && this._p1) {
            if (this._type === "line") {
                let p = $math.getPointOnLine(this._p0, this._p1, location);
                return { x: p.x, y: p.y, angle: $math.getAngle(this._p0, this._p1) };
            }
            else {
                let p0 = $math.getPointOnQuadraticCurve(this._p0, this._p1, { x: 0, y: 0 }, Math.max(0, location - 0.01));
                let p1 = $math.getPointOnQuadraticCurve(this._p0, this._p1, { x: 0, y: 0 }, Math.min(1, location + 0.01));
                let p = $math.getPointOnQuadraticCurve(this._p0, this._p1, { x: 0, y: 0 }, location);
                return { x: p.x, y: p.y, angle: $math.getAngle(p0, p1) };
            }
        }
        return { x: 0, y: 0, angle: 0 };
    }
}
Object.defineProperty(ChordLink, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "ChordLink"
});
Object.defineProperty(ChordLink, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: FlowLink.classNames.concat([ChordLink.className])
});
//# sourceMappingURL=ChordLink.js.map