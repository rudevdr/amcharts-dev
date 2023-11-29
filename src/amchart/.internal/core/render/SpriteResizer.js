import { Container } from "./Container";
import { p50, Percent } from "../util/Percent";
import { RoundedRectangle } from "./RoundedRectangle";
import { Rectangle } from "./Rectangle";
import { color } from "../util/Color";
import * as $math from "../util/Math";
export class SpriteResizer extends Container {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "rectangle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.children.push(Rectangle.new(this._root, { themeTags: ["rectangle"], fillOpacity: 0, fill: color(0xFFFFFF) }))
        });
        Object.defineProperty(this, "gripL", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._createGrip("left")
        });
        Object.defineProperty(this, "gripR", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._createGrip("right")
        });
        Object.defineProperty(this, "gripT", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._createGrip("top")
        });
        Object.defineProperty(this, "gripB", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._createGrip("bottom")
        });
        Object.defineProperty(this, "_is", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "_ix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_iw", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_positionDP", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isHover", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _afterNew() {
        super._afterNew();
        this.addTag("resizer");
        this.set("visible", false);
        this.gripL.events.on("dragged", (e) => {
            this._resize(e.target, -1);
        });
        this.gripR.events.on("dragged", (e) => {
            this._resize(e.target, 1);
        });
        this.gripL.events.on("dragstart", (e) => {
            this._resizeStart(e.target);
        });
        this.gripR.events.on("dragstart", (e) => {
            this._resizeStart(e.target);
        });
        this.gripT.events.on("dragged", (e) => {
            this._rotate(e, 90);
        });
        this.gripB.events.on("dragged", (e) => {
            this._rotate(e, -90);
        });
        this.gripT.events.on("dragstart", (e) => {
            this._resizeStart(e.target);
        });
        this.gripB.events.on("dragstart", (e) => {
            this._resizeStart(e.target);
        });
    }
    _resizeStart(grip) {
        const sprite = this.get("sprite");
        if (sprite) {
            this._is = sprite.get("scale", 1);
            this._ix = grip.x();
            this._iw = this.width() / 2;
        }
    }
    _resize(grip, c) {
        const sprite = this.get("sprite");
        const spriteTemplate = this.get("spriteTemplate");
        if (sprite) {
            const scale = Math.max(0.01, this._is * (1 + c * (grip.x() - this._ix) / this._iw));
            if (spriteTemplate) {
                spriteTemplate.set("scale", scale);
            }
            else {
                sprite.set("scale", scale);
            }
            sprite.states.lookup("default").set("scale", scale);
            this._updatePositions();
        }
    }
    _rotate(e, delta) {
        const sprite = this.get("sprite");
        const spriteTemplate = this.get("spriteTemplate");
        if (sprite) {
            const parent = this.parent;
            if (parent) {
                const rotationStep = this.get("rotationStep", 10);
                let angle = Math.round((($math.getAngle({ x: this.x(), y: this.y() }, parent.toLocal(e.point)) + delta) / rotationStep)) * rotationStep;
                if (spriteTemplate) {
                    spriteTemplate.set("rotation", angle);
                }
                else {
                    sprite.set("rotation", angle);
                }
                sprite.states.lookup("default").set("rotation", angle);
                this._updatePositions();
            }
        }
    }
    _createGrip(themeTag) {
        const container = this.children.push(Container.new(this._root, {
            themeTags: ["grip", themeTag],
            setStateOnChildren: true,
            draggable: true
        }));
        container.children.push(RoundedRectangle.new(this._root, {
            themeTags: ["outline"],
            centerX: p50,
            centerY: p50
        }));
        container.children.push(RoundedRectangle.new(this._root, {
            centerX: p50,
            centerY: p50
        }));
        return container;
    }
    _updateChildren() {
        super._updateChildren();
        if (this.isDirty("sprite")) {
            const sprite = this.get("sprite");
            if (sprite) {
                this.show(0);
                this.setPrivate("visible", true);
                this._updatePositions();
                const parent = sprite.parent;
                if (parent) {
                    parent.children.moveValue(this, 0);
                }
                this._positionDP = sprite.events.on("positionchanged", () => {
                    this._updatePositions();
                });
            }
            else {
                this.hide(0);
                this.setPrivate("visible", false);
                if (this._positionDP) {
                    this._positionDP.dispose();
                }
            }
        }
        if (this.isDirty("width") || this.isDirty("height") || this.isDirty("rotation")) {
            this._updatePositions();
        }
    }
    _updatePositions() {
        const sprite = this.get("sprite");
        if (sprite) {
            let bounds = sprite.localBounds();
            let scale = sprite.get("scale", 1);
            let d = 20;
            let w = (bounds.right - bounds.left) * scale + d;
            let h = (bounds.bottom - bounds.top) * scale + d;
            let a = sprite.get("rotation", 0);
            const rectangle = this.rectangle;
            let cx = sprite.get("centerX", p50);
            let cy = sprite.get("centerY", p50);
            let cxr = 0;
            if (cx instanceof Percent) {
                cxr = cx.value;
            }
            let cyr = 0;
            if (cy instanceof Percent) {
                cyr = cy.value;
            }
            rectangle.setAll({ centerX: cx, centerY: cy, width: w, height: h });
            this.setAll({ x: sprite.x() + d * (cxr - 0.5) * $math.cos(a) - d * (cyr - 0.5) * $math.sin(a), y: sprite.y() + d * (cyr - 0.5) * $math.cos(a) + d * (cxr - 0.5) * $math.sin(a), width: w, height: h, rotation: a });
            this.gripT.setAll({ x: (0.5 - cxr) * w, y: -cyr * h });
            this.gripB.setAll({ x: (0.5 - cxr) * w, y: (1 - cyr) * h });
            this.gripL.setAll({ x: -cxr * w, y: (0.5 - cyr) * h });
            this.gripR.setAll({ x: (1 - cxr) * w, y: (0.5 - cyr) * h });
            this.rectangle.setAll({ width: w, height: h });
        }
    }
}
Object.defineProperty(SpriteResizer, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "SpriteResizer"
});
Object.defineProperty(SpriteResizer, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Container.classNames.concat([SpriteResizer.className])
});
//# sourceMappingURL=SpriteResizer.js.map