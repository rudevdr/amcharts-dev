import { PicturePattern } from "../render/patterns/PicturePattern";
import { Sprite } from "./Sprite";
import { BlendMode } from "./backend/Renderer";
import * as $type from "../util/Type";
import * as $array from "../util/Array";
export const visualSettings = ["fill", "fillOpacity", "stroke", "strokeWidth", "strokeOpacity", "fillPattern", "strokePattern", "fillGradient", "strokeGradient", "strokeDasharray", "strokeDashoffset", "shadowBlur", "shadowColor", "shadowOpacity", "shadowOffsetX", "shadowOffsetY", "blur", "sepia", "invert", "brightness", "hue", "contrast", "saturate"];
/**
 * Base class used for drawing shapes.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/graphics/} for more info
 * @important
 */
export class Graphics extends Sprite {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_display", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._root._renderer.makeGraphics()
        });
        Object.defineProperty(this, "_clear", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _beforeChanged() {
        super._beforeChanged();
        if (this.isDirty("draw") || this.isDirty("svgPath")) {
            this.markDirtyBounds();
        }
        if (this.isDirty("fill") || this.isDirty("stroke") || this.isDirty("visible") || this.isDirty("forceHidden") || this.isDirty("scale") || this.isDirty("fillGradient") || this.isDirty("strokeGradient") || this.isDirty("fillPattern") || this.isDirty("strokePattern") || this.isDirty("fillOpacity") || this.isDirty("strokeOpacity") || this.isDirty("strokeWidth") || this.isDirty("draw") || this.isDirty("blendMode") || this.isDirty("strokeDasharray") || this.isDirty("strokeDashoffset") || this.isDirty("svgPath") || this.isDirty("lineJoin") || this.isDirty("shadowColor") || this.isDirty("shadowBlur") || this.isDirty("shadowOffsetX") || this.isDirty("shadowOffsetY")) {
            this._clear = true;
        }
        this._display.crisp = this.get("crisp", false);
        if (this.isDirty("fillGradient")) {
            const gradient = this.get("fillGradient");
            if (gradient) {
                this._display.isMeasured = true;
                const gradientTarget = gradient.get("target");
                if (gradientTarget) {
                    this._disposers.push(gradientTarget.events.on("boundschanged", () => {
                        this._markDirtyKey("fill");
                    }));
                    this._disposers.push(gradientTarget.events.on("positionchanged", () => {
                        this._markDirtyKey("fill");
                    }));
                }
            }
        }
        if (this.isDirty("strokeGradient")) {
            const gradient = this.get("strokeGradient");
            if (gradient) {
                this._display.isMeasured = true;
                const gradientTarget = gradient.get("target");
                if (gradientTarget) {
                    this._disposers.push(gradientTarget.events.on("boundschanged", () => {
                        this._markDirtyKey("stroke");
                    }));
                    this._disposers.push(gradientTarget.events.on("positionchanged", () => {
                        this._markDirtyKey("stroke");
                    }));
                }
            }
        }
    }
    _changed() {
        super._changed();
        if (this._clear) {
            this.markDirtyBounds();
            this.markDirtyLayer();
            this._display.clear();
            let strokeDasharray = this.get("strokeDasharray");
            if ($type.isNumber(strokeDasharray)) {
                if (strokeDasharray < 0.5) {
                    strokeDasharray = [0];
                }
                else {
                    strokeDasharray = [strokeDasharray];
                }
            }
            this._display.setLineDash(strokeDasharray);
            const strokeDashoffset = this.get("strokeDashoffset");
            if (strokeDashoffset) {
                this._display.setLineDashOffset(strokeDashoffset);
            }
            const blendMode = this.get("blendMode", BlendMode.NORMAL);
            this._display.blendMode = blendMode;
            const draw = this.get("draw");
            if (draw) {
                draw(this._display, this);
            }
            const svgPath = this.get("svgPath");
            if (svgPath != null) {
                this._display.svgPath(svgPath);
            }
        }
    }
    _afterChanged() {
        super._afterChanged();
        if (this._clear) {
            const fill = this.get("fill");
            const fillGradient = this.get("fillGradient");
            const fillPattern = this.get("fillPattern");
            const fillOpacity = this.get("fillOpacity");
            const stroke = this.get("stroke");
            const strokeGradient = this.get("strokeGradient");
            const strokePattern = this.get("strokePattern");
            const shadowColor = this.get("shadowColor");
            const shadowBlur = this.get("shadowBlur");
            const shadowOffsetX = this.get("shadowOffsetX");
            const shadowOffsetY = this.get("shadowOffsetY");
            const shadowOpacity = this.get("shadowOpacity");
            //const bounds = this._display.getLocalBounds();
            if (shadowColor && (shadowBlur || shadowOffsetX || shadowOffsetY)) {
                this._display.shadow(shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY, shadowOpacity);
            }
            if (fill && !fillGradient) {
                this._display.beginFill(fill, fillOpacity);
                this._display.endFill();
            }
            if (fillGradient) {
                if (fill) {
                    const stops = fillGradient.get("stops", []);
                    if (stops.length) {
                        $array.each(stops, (stop) => {
                            if ((!stop.color || stop.colorInherited) && fill) {
                                stop.color = fill;
                                stop.colorInherited = true;
                            }
                            if (stop.opacity == null || stop.opacityInherited) {
                                stop.opacity = fillOpacity;
                                stop.opacityInherited = true;
                            }
                        });
                    }
                }
                const gradient = fillGradient.getFill(this);
                if (gradient) {
                    this._display.beginFill(gradient, fillOpacity);
                    this._display.endFill();
                }
            }
            if (fillPattern) {
                /*
                let changed = false;
                if (fill && (!fillPattern.get("fill") || fillPattern.get("fillInherited"))) {
                    fillPattern.set("fill", fill);
                    fillPattern.set("fillInherited", true)
                    changed = true;
                }
                if (stroke && (!fillPattern.get("color") || fillPattern.get("colorInherited"))) {
                    fillPattern.set("color", stroke);
                    fillPattern.set("colorInherited", true)
                    changed = true;
                }
                if (changed) {
                    // @todo: is this OK?
                    fillPattern._changed();
                }
                */
                const pattern = fillPattern.pattern;
                if (pattern) {
                    this._display.beginFill(pattern, fillOpacity);
                    this._display.endFill();
                    if (fillPattern instanceof PicturePattern) {
                        fillPattern.events.once("loaded", () => {
                            this._clear = true;
                            this.markDirty();
                        });
                    }
                }
            }
            if (stroke || strokeGradient || strokePattern) {
                const strokeOpacity = this.get("strokeOpacity");
                let strokeWidth = this.get("strokeWidth", 1);
                if (this.get("nonScalingStroke")) {
                    strokeWidth = strokeWidth / this.get("scale", 1);
                }
                if (this.get("crisp")) {
                    strokeWidth /= this._root._renderer.resolution;
                }
                const lineJoin = this.get("lineJoin");
                if (stroke && !strokeGradient) {
                    this._display.lineStyle(strokeWidth, stroke, strokeOpacity, lineJoin);
                    this._display.endStroke();
                }
                if (strokeGradient) {
                    const stops = strokeGradient.get("stops", []);
                    if (stops.length) {
                        $array.each(stops, (stop) => {
                            if ((!stop.color || stop.colorInherited) && stroke) {
                                stop.color = stroke;
                                stop.colorInherited = true;
                            }
                            if (stop.opacity == null || stop.opacityInherited) {
                                stop.opacity = strokeOpacity;
                                stop.opacityInherited = true;
                            }
                        });
                    }
                    const gradient = strokeGradient.getFill(this);
                    if (gradient) {
                        this._display.lineStyle(strokeWidth, gradient, strokeOpacity, lineJoin);
                        this._display.endStroke();
                    }
                }
                if (strokePattern) {
                    /*
                    let changed = false;
                    
                    if (stroke && (!strokePattern.get("color") || strokePattern.get("colorInherited"))) {
                        strokePattern.set("color", stroke);
                        strokePattern.set("colorInherited", true);
                        changed = true;
                    }
                    if (changed) {
                        // @todo: is this OK?
                        strokePattern._changed();
                    }
                    */
                    let pattern = strokePattern.pattern;
                    if (pattern) {
                        this._display.lineStyle(strokeWidth, pattern, strokeOpacity, lineJoin);
                        this._display.endStroke();
                        if (strokePattern instanceof PicturePattern) {
                            strokePattern.events.once("loaded", () => {
                                this._clear = true;
                                this.markDirty();
                            });
                        }
                    }
                }
            }
            if (this.getPrivate("showingTooltip")) {
                this.showTooltip();
            }
        }
        this._clear = false;
    }
}
Object.defineProperty(Graphics, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Graphics"
});
Object.defineProperty(Graphics, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Sprite.classNames.concat([Graphics.className])
});
//# sourceMappingURL=Graphics.js.map