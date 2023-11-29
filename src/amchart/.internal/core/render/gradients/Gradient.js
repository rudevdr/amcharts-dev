import { Entity } from "../../util/Entity";
/**
 * Base class for gradients.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/gradients/} for more info
 */
export class Gradient extends Entity {
    _afterNew() {
        // Applying themes because gradient will not have parent
        super._afterNewApplyThemes();
    }
    /**
     * @ignore
     */
    getFill(_target) {
        return {
            addColorStop: (_offset, _color) => { }
        };
    }
    _changed() {
        super._changed();
        //if (this.isDirty("target") && this.get("target")) {
        //	this.get("target")!.events.on("boundschanged", () => {
        //	});
        //}
    }
    /**
     * @ignore
     */
    getBounds(target) {
        const gradientTarget = this.get("target");
        if (gradientTarget) {
            let bounds = gradientTarget.globalBounds();
            const p0 = target.toLocal({ x: bounds.left, y: bounds.top });
            const p1 = target.toLocal({ x: bounds.right, y: bounds.top });
            const p2 = target.toLocal({ x: bounds.right, y: bounds.bottom });
            const p3 = target.toLocal({ x: bounds.left, y: bounds.bottom });
            return {
                left: Math.min(p0.x, p1.x, p2.x, p3.x),
                top: Math.min(p0.y, p1.y, p2.y, p3.y),
                right: Math.max(p0.x, p1.x, p2.x, p3.x),
                bottom: Math.max(p0.y, p1.y, p2.y, p3.y)
            };
        }
        return target._display.getLocalBounds();
    }
}
Object.defineProperty(Gradient, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Gradient"
});
Object.defineProperty(Gradient, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Gradient.className])
});
//# sourceMappingURL=Gradient.js.map