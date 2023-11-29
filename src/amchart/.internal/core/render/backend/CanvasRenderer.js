/** @ignore */ /** */
import { BlendMode } from "./Renderer";
import { Color } from "../../util/Color";
import { Matrix } from "../../util/Matrix";
import { Percent, percent } from "../../util/Percent";
//import { Throttler } from "../../util/Throttler";
import { ArrayDisposer, Disposer, DisposerClass, CounterDisposer, MultiDisposer } from "../../util/Disposer";
import { TextFormatter } from "../../util/TextFormatter";
import * as $utils from "../../util/Utils";
import * as $array from "../../util/Array";
import * as $object from "../../util/Object";
import * as $type from "../../util/Type";
import * as $math from "../../util/Math";
import arcToBezier from 'svg-arc-to-cubic-bezier';
/**
 * @ignore
 */
function checkArgs(name, actual, expected) {
    if (actual !== expected) {
        throw new Error("Required " + expected + " arguments for " + name + " but got " + actual);
    }
}
/**
 * @ignore
 */
function checkMinArgs(name, actual, expected) {
    if (actual < expected) {
        throw new Error("Required at least " + expected + " arguments for " + name + " but got " + actual);
    }
}
/**
 * @ignore
 */
function checkEvenArgs(name, actual, expected) {
    checkMinArgs(name, actual, expected);
    if ((actual % expected) !== 0) {
        throw new Error("Arguments for " + name + " must be in pairs of " + expected);
    }
}
/**
 * @ignore
 * This splits the flag so that way 0017 will be processed as 0 0 17
 *
 * This is important for weird paths like `M17 5A1 1 0 0017 30 1 1 0 0017 5`
 */
function splitArcFlags(args) {
    for (let i = 0; i < args.length; i += 7) {
        let index = i + 3;
        let flag = args[index];
        if (flag.length > 1) {
            const a = /^([01])([01])(.*)$/.exec(flag);
            if (a !== null) {
                args.splice(index, 0, a[1]);
                ++index;
                args.splice(index, 0, a[2]);
                ++index;
                if (a[3].length > 0) {
                    args[index] = a[3];
                }
                else {
                    args.splice(index, 1);
                }
            }
        }
        ++index;
        flag = args[index];
        if (flag.length > 1) {
            const a = /^([01])(.+)$/.exec(flag);
            if (a !== null) {
                args.splice(index, 0, a[1]);
                ++index;
                args[index] = a[2];
            }
        }
    }
}
/**
 * @ignore
 */
function assertBinary(value) {
    if (value === 0 || value === 1) {
        return value;
    }
    else {
        throw new Error("Flag must be 0 or 1");
    }
}
//  1 -> 0xffffff * (2 / 2)
//  2 -> 0xffffff * (1 / 2)
//
//  3 -> 0xffffff * (3 / 4)
//  4 -> 0xffffff * (1 / 4)
//
//  5 -> 0xffffff * (7 / 8)
//  6 -> 0xffffff * (5 / 8)
//  7 -> 0xffffff * (3 / 8)
//  8 -> 0xffffff * (1 / 8)
//
//  9 -> 0xffffff * (15 / 16)
// 10 -> 0xffffff * (13 / 16)
// 11 -> 0xffffff * (11 / 16)
// 12 -> 0xffffff *  (9 / 16)
// 13 -> 0xffffff *  (7 / 16)
// 14 -> 0xffffff *  (5 / 16)
// 15 -> 0xffffff *  (3 / 16)
// 16 -> 0xffffff *  (1 / 16)
// @todo remove this old color distribution algo if the new one pans out
/*function distributeId(id: number): number {
    if (id === 1) {
        return 0x000001;

    } else {
        // Finds the closest power of 2
        const base = Math.pow(2, Math.ceil(Math.log(id) / Math.log(2)));

        // Translates the id into an odd fraction index
        const index = ((base - id) * 2) + 1;

        // TODO is Math.round correct ?
        return Math.round(0xffffff * (index / base));
    }
}*/
/**
 * Function by smeans:
 * https://lowcode.life/generating-unique-contrasting-colors-in-javascript/
 * @ignore
 */
function distributeId(id) {
    const rgb = [0, 0, 0];
    for (let i = 0; i < 24; i++) {
        rgb[i % 3] <<= 1;
        rgb[i % 3] |= id & 0x01;
        id >>= 1;
    }
    return (rgb[0] | 0) + (rgb[1] << 8) + (rgb[2] << 16);
}
/**
 * @ignore
 */
function eachTargets(hitTarget, f) {
    for (;;) {
        if (hitTarget.interactive) {
            if (!f(hitTarget)) {
                break;
            }
        }
        if (hitTarget._parent) {
            hitTarget = hitTarget._parent;
        }
        else {
            break;
        }
    }
}
// TODO feature detection for mouse/touch/pointer
/**
 * @ignore
 */
function onPointerEvent(element, name, f) {
    return $utils.addEventListener(element, $utils.getRendererEvent(name), (event) => {
        const target = $utils.getEventTarget(event);
        let touches = event.touches;
        if (touches) {
            if (touches.length == 0) {
                touches = event.changedTouches;
            }
            f($array.copy(touches), target);
        }
        else {
            f([event], target);
        }
    });
}
/**
 * @ignore
 */
function isTainted(image) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0, 1, 1);
    try {
        context.getImageData(0, 0, 1, 1);
        return false;
    }
    catch (err) {
        console.warn("Image \"" + image.src + "\" is loaded from different host and is not covered by CORS policy. For more information about the implications read here: https://www.amcharts.com/docs/v5/concepts/cors");
        return true;
    }
}
/**
 * This is needed to workaround a bug in iOS which causes it to not GC canvas elements.
 *
 * @ignore
 */
function clearCanvas(view) {
    view.width = 0;
    view.height = 0;
    view.style.width = "0px";
    view.style.height = "0px";
}
/**
 * Aligns the coordinate to the pixel, so it renders crisp
 *
 * @ignore
 */
function crisp(x) {
    return Math.floor(x) + .5;
}
/**
 * @ignore
 */
export class CanvasPivot {
    constructor() {
        Object.defineProperty(this, "_x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    set x(value) {
        this._x = value;
    }
    set y(value) {
        this._y = value;
    }
}
/**
 * @ignore
 */
export class CanvasDisplayObject extends DisposerClass {
    constructor(renderer) {
        super();
        Object.defineProperty(this, "_layer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "mask", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "visible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "exportable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "interactive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "inactive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "wheelable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "cancelTouch", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "isMeasured", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "buttonMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "alpha", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "compoundAlpha", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "angle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "scale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "crisp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "pivot", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new CanvasPivot()
        });
        Object.defineProperty(this, "filter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "cursorOverStyle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_replacedCursorStyle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_localMatrix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Matrix()
        });
        Object.defineProperty(this, "_matrix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Matrix()
        });
        // TODO can this be replaced with _localMatrix ?
        Object.defineProperty(this, "_uMatrix", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Matrix()
        });
        Object.defineProperty(this, "_renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_localBounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_bounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_colorId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._renderer = renderer;
    }
    subStatus(status) {
        return {
            inactive: (this.inactive == null ? status.inactive : this.inactive),
            layer: this._layer || status.layer,
        };
    }
    _dispose() {
        this._renderer._removeObject(this);
        this.getLayer().dirty = true;
    }
    getCanvas() {
        return this.getLayer().view;
    }
    getLayer() {
        let self = this;
        for (;;) {
            if (self._layer) {
                return self._layer;
            }
            else if (self._parent) {
                self = self._parent;
            }
            else {
                return this._renderer.defaultLayer;
            }
        }
    }
    setLayer(order, margin) {
        if (order == null) {
            this._layer = undefined;
        }
        else {
            const visible = true;
            this._layer = this._renderer.getLayer(order, visible);
            this._layer.visible = visible;
            this._layer.margin = margin;
            if (margin) {
                $utils.setInteractive(this._layer.view, false);
            }
            this._renderer._ghostLayer.setMargin(this._renderer.layers);
            if (this._parent) {
                this._parent.registerChildLayer(this._layer);
            }
            this._layer.dirty = true;
            this._renderer.resizeLayer(this._layer);
            this._renderer.resizeGhost();
        }
    }
    markDirtyLayer() {
        this.getLayer().dirty = true;
    }
    clear() {
        this.invalidateBounds();
    }
    invalidateBounds() {
        this._localBounds = undefined;
    }
    _addBounds(_bounds) { }
    _getColorId() {
        if (this._colorId === undefined) {
            this._colorId = this._renderer.paintId(this);
        }
        return this._colorId;
    }
    _isInteractive(status) {
        return !status.inactive && (this.interactive || this._renderer._forceInteractive > 0);
    }
    _isInteractiveMask(status) {
        return this._isInteractive(status);
    }
    contains(child) {
        for (;;) {
            if (child === this) {
                return true;
            }
            else if (child._parent) {
                child = child._parent;
            }
            else {
                return false;
            }
        }
    }
    toGlobal(point) {
        return this._matrix.apply(point);
    }
    toLocal(point) {
        return this._matrix.applyInverse(point);
    }
    getLocalMatrix() {
        this._uMatrix.setTransform(0, 0, this.pivot.x, this.pivot.y, this.angle * Math.PI / 180, this.scale);
        return this._uMatrix;
    }
    getLocalBounds() {
        if (!this._localBounds) {
            const bn = 10000000;
            this._localBounds = {
                left: bn,
                top: bn,
                right: -bn,
                bottom: -bn
            };
            this._addBounds(this._localBounds);
        }
        return this._localBounds;
    }
    getAdjustedBounds(bounds) {
        this._setMatrix();
        const matrix = this.getLocalMatrix();
        const p0 = matrix.apply({ x: bounds.left, y: bounds.top });
        const p1 = matrix.apply({ x: bounds.right, y: bounds.top });
        const p2 = matrix.apply({ x: bounds.right, y: bounds.bottom });
        const p3 = matrix.apply({ x: bounds.left, y: bounds.bottom });
        return {
            left: Math.min(p0.x, p1.x, p2.x, p3.x),
            top: Math.min(p0.y, p1.y, p2.y, p3.y),
            right: Math.max(p0.x, p1.x, p2.x, p3.x),
            bottom: Math.max(p0.y, p1.y, p2.y, p3.y)
        };
    }
    on(key, callback, context) {
        if (this.interactive) {
            return this._renderer._addEvent(this, key, callback, context);
        }
        else {
            return new Disposer(() => { });
        }
    }
    _setMatrix() {
        // TODO only calculate this if it has actually changed
        this._localMatrix.setTransform(this.x, this.y, this.pivot.x, this.pivot.y, 
        // Converts degrees to radians
        this.angle * Math.PI / 180, this.scale);
        this._matrix.copyFrom(this._localMatrix);
        if (this._parent) {
            // TODO only calculate this if it has actually changed
            this._matrix.prepend(this._parent._matrix);
        }
    }
    _transform(context, resolution) {
        const m = this._matrix;
        let tx = m.tx * resolution;
        let ty = m.ty * resolution;
        if (this.crisp) {
            tx = crisp(tx);
            ty = crisp(ty);
        }
        context.setTransform(m.a * resolution, m.b * resolution, m.c * resolution, m.d * resolution, tx, ty);
    }
    _transformMargin(context, resolution, margin) {
        const m = this._matrix;
        context.setTransform(m.a * resolution, m.b * resolution, m.c * resolution, m.d * resolution, (m.tx + margin.left) * resolution, (m.ty + margin.top) * resolution);
    }
    _transformLayer(context, resolution, layer) {
        if (layer.margin) {
            this._transformMargin(context, layer.scale || resolution, layer.margin);
        }
        else {
            this._transform(context, layer.scale || resolution);
        }
    }
    render(status) {
        if (this.visible && (this.exportable !== false || !this._renderer._omitTainted)) {
            this._setMatrix();
            const subStatus = this.subStatus(status);
            const resolution = this._renderer.resolution;
            const layers = this._renderer.layers;
            const ghostLayer = this._renderer._ghostLayer;
            const ghostContext = ghostLayer.context;
            const mask = this.mask;
            if (mask) {
                mask._setMatrix();
            }
            // TODO improve this
            $array.each(layers, (layer) => {
                if (layer) {
                    const context = layer.context;
                    context.save();
                    // We must apply the mask before we transform the element
                    if (mask) {
                        mask._transformLayer(context, resolution, layer);
                        mask._runPath(context);
                        context.clip();
                    }
                    context.globalAlpha = this.compoundAlpha * this.alpha;
                    this._transformLayer(context, resolution, layer);
                    if (this.filter) {
                        context.filter = this.filter;
                    }
                }
            });
            ghostContext.save();
            // We must apply the mask before we transform the element
            if (mask && this._isInteractiveMask(subStatus)) {
                mask._transformMargin(ghostContext, resolution, ghostLayer.margin);
                mask._runPath(ghostContext);
                ghostContext.clip();
            }
            this._transformMargin(ghostContext, resolution, ghostLayer.margin);
            this._render(subStatus);
            ghostContext.restore();
            $array.each(layers, (layer) => {
                if (layer) {
                    layer.context.restore();
                }
            });
        }
    }
    _render(status) {
        if (this.exportable === false) {
            status.layer.tainted = true;
        }
    }
    hovering() {
        return this._renderer._hovering.has(this);
    }
    dragging() {
        return this._renderer._dragging.some((x) => x.value === this);
    }
    shouldCancelTouch() {
        const renderer = this._renderer;
        if (renderer.tapToActivate && !renderer._touchActive) {
            return false;
        }
        if (this.cancelTouch) {
            return true;
        }
        else if (this._parent) {
            return this._parent.shouldCancelTouch();
        }
        return false;
    }
}
/**
 * @ignore
 */
export class CanvasContainer extends CanvasDisplayObject {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "interactiveChildren", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_childLayers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_children", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
    }
    _isInteractiveMask(status) {
        return this.interactiveChildren || super._isInteractiveMask(status);
    }
    addChild(child) {
        child._parent = this;
        this._children.push(child);
        if (child._layer) {
            this.registerChildLayer(child._layer);
        }
    }
    addChildAt(child, index) {
        child._parent = this;
        this._children.splice(index, 0, child);
        if (child._layer) {
            this.registerChildLayer(child._layer);
        }
    }
    removeChild(child) {
        child._parent = undefined;
        $array.removeFirst(this._children, child);
    }
    _render(status) {
        super._render(status);
        const renderer = this._renderer;
        if (this.interactive && this.interactiveChildren) {
            ++renderer._forceInteractive;
        }
        $array.each(this._children, (child) => {
            child.compoundAlpha = this.compoundAlpha * this.alpha;
            child.render(status);
        });
        if (this.interactive && this.interactiveChildren) {
            --renderer._forceInteractive;
        }
    }
    registerChildLayer(layer) {
        if (!this._childLayers) {
            this._childLayers = [];
        }
        $array.pushOne(this._childLayers, layer);
        if (this._parent) {
            this._parent.registerChildLayer(layer);
        }
    }
    markDirtyLayer(deep = false) {
        super.markDirtyLayer();
        if (deep && this._childLayers) {
            $array.each(this._childLayers, (layer) => layer.dirty = true);
        }
    }
    _dispose() {
        super._dispose();
        if (this._childLayers) {
            $array.each(this._childLayers, (layer) => {
                layer.dirty = true;
            });
        }
    }
}
/**
 * @ignore
 */
function setPoint(bounds, point) {
    bounds.left = Math.min(bounds.left, point.x);
    bounds.top = Math.min(bounds.top, point.y);
    bounds.right = Math.max(bounds.right, point.x);
    bounds.bottom = Math.max(bounds.bottom, point.y);
}
/**
 * @ignore
 */
class Op {
    colorize(_context, _forceColor) { }
    path(_context) { }
    addBounds(_bounds) { }
}
/**
 * @ignore
 */
class BeginPath extends Op {
    colorize(context, _forceColor) {
        context.beginPath();
    }
}
/**
 * @ignore
 */
class BeginFill extends Op {
    constructor(color) {
        super();
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: color
        });
    }
    colorize(context, forceColor) {
        if (forceColor !== undefined) {
            context.fillStyle = forceColor;
        }
        else {
            context.fillStyle = this.color;
        }
    }
}
/**
 * @ignore
 */
class EndFill extends Op {
    constructor(clearShadow) {
        super();
        Object.defineProperty(this, "clearShadow", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: clearShadow
        });
    }
    colorize(context, _forceColor) {
        context.fill();
        if (this.clearShadow) {
            context.shadowColor = "";
            context.shadowBlur = 0;
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
        }
    }
}
/**
 * @ignore
 */
class EndStroke extends Op {
    colorize(context, _forceColor) {
        context.stroke();
    }
}
/**
 * @ignore
 */
class LineStyle extends Op {
    constructor(width, color, lineJoin) {
        super();
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: width
        });
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: color
        });
        Object.defineProperty(this, "lineJoin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: lineJoin
        });
    }
    colorize(context, forceColor) {
        if (forceColor !== undefined) {
            context.strokeStyle = forceColor;
        }
        else {
            context.strokeStyle = this.color;
        }
        context.lineWidth = this.width;
        if (this.lineJoin) {
            context.lineJoin = this.lineJoin;
        }
    }
}
/**
 * @ignore
 */
class LineDash extends Op {
    constructor(dash) {
        super();
        Object.defineProperty(this, "dash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dash
        });
    }
    colorize(context, _forceColor) {
        context.setLineDash(this.dash);
    }
}
/**
 * @ignore
 */
class LineDashOffset extends Op {
    constructor(dashOffset) {
        super();
        Object.defineProperty(this, "dashOffset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: dashOffset
        });
    }
    colorize(context, _forceColor) {
        context.lineDashOffset = this.dashOffset;
    }
}
/**
 * @ignore
 */
class DrawRect extends Op {
    constructor(x, y, width, height) {
        super();
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: width
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: height
        });
    }
    path(context) {
        context.rect(this.x, this.y, this.width, this.height);
    }
    addBounds(bounds) {
        const l = this.x;
        const t = this.y;
        const r = l + this.width;
        const b = t + this.height;
        setPoint(bounds, { x: l, y: t });
        setPoint(bounds, { x: r, y: t });
        setPoint(bounds, { x: l, y: b });
        setPoint(bounds, { x: r, y: b });
    }
}
/**
 * @ignore
 */
class DrawCircle extends Op {
    constructor(x, y, radius) {
        super();
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y
        });
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
    }
    path(context) {
        context.moveTo(this.x + this.radius, this.y);
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    }
    // TODO handle skewing and rotation
    addBounds(bounds) {
        setPoint(bounds, { x: this.x - this.radius, y: this.y - this.radius });
        setPoint(bounds, { x: this.x + this.radius, y: this.y + this.radius });
    }
}
/**
 * @ignore
 */
class DrawEllipse extends Op {
    constructor(x, y, radiusX, radiusY) {
        super();
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y
        });
        Object.defineProperty(this, "radiusX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radiusX
        });
        Object.defineProperty(this, "radiusY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radiusY
        });
    }
    path(context) {
        context.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
    }
    // TODO handle skewing and rotation
    addBounds(bounds) {
        setPoint(bounds, { x: this.x - this.radiusX, y: this.y - this.radiusY });
        setPoint(bounds, { x: this.x + this.radiusX, y: this.y + this.radiusY });
    }
}
/**
 * @ignore
 */
class Arc extends Op {
    constructor(cx, cy, radius, startAngle, endAngle, anticlockwise) {
        super();
        Object.defineProperty(this, "cx", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cx
        });
        Object.defineProperty(this, "cy", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cy
        });
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
        Object.defineProperty(this, "startAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: startAngle
        });
        Object.defineProperty(this, "endAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: endAngle
        });
        Object.defineProperty(this, "anticlockwise", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: anticlockwise
        });
    }
    path(context) {
        if (this.radius > 0) {
            context.arc(this.cx, this.cy, this.radius, this.startAngle, this.endAngle, this.anticlockwise);
        }
    }
    addBounds(bounds) {
        let arcBounds = $math.getArcBounds(this.cx, this.cy, this.startAngle * $math.DEGREES, this.endAngle * $math.DEGREES, this.radius);
        setPoint(bounds, { x: arcBounds.left, y: arcBounds.top });
        setPoint(bounds, { x: arcBounds.right, y: arcBounds.bottom });
    }
}
/**
 * @ignore
 */
class ArcTo extends Op {
    constructor(x1, y1, x2, y2, radius) {
        super();
        Object.defineProperty(this, "x1", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x1
        });
        Object.defineProperty(this, "y1", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y1
        });
        Object.defineProperty(this, "x2", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x2
        });
        Object.defineProperty(this, "y2", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y2
        });
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: radius
        });
    }
    path(context) {
        if (this.radius > 0) {
            context.arcTo(this.x1, this.y1, this.x2, this.y2, this.radius);
        }
    }
    // TODO: add points
    addBounds(_bounds) {
        /*
        // not finished
        https://math.stackexchange.com/questions/1781438/finding-the-center-of-a-circle-given-two-points-and-a-radius-algebraically

        if (prevPoint) {
            let x1 = prevPoint.x;
            let y1 = prevPoint.y;
            let x2 = this.x2;
            let y2 = this.y2;
            let r = this.radius;

            let xa = (x2 - x1) / 2;
            let ya = (y2 - y1) / 2;

            let x0 = x1 + xa;
            let y0 = y1 + ya;

            let a = Math.hypot(xa, ya);
            let b = Math.sqrt(r * r - a * a);

            let cx = x0 + b * ya / a;
            let cy = y0 - b * xa / a;

            console.log(cx, cy);
        }*/
    }
}
/**
 * @ignore
 */
class LineTo extends Op {
    constructor(x, y) {
        super();
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y
        });
    }
    path(context) {
        context.lineTo(this.x, this.y);
    }
    addBounds(bounds) {
        setPoint(bounds, { x: this.x, y: this.y });
    }
}
/**
 * @ignore
 */
class MoveTo extends Op {
    constructor(x, y) {
        super();
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y
        });
    }
    path(context) {
        context.moveTo(this.x, this.y);
    }
    addBounds(bounds) {
        setPoint(bounds, { x: this.x, y: this.y });
    }
}
/**
 * @ignore
 */
class ClosePath extends Op {
    path(context) {
        context.closePath();
    }
}
/**
 * @ignore
 */
class BezierCurveTo extends Op {
    constructor(cpX, cpY, cpX2, cpY2, toX, toY) {
        super();
        Object.defineProperty(this, "cpX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cpX
        });
        Object.defineProperty(this, "cpY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cpY
        });
        Object.defineProperty(this, "cpX2", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cpX2
        });
        Object.defineProperty(this, "cpY2", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cpY2
        });
        Object.defineProperty(this, "toX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: toX
        });
        Object.defineProperty(this, "toY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: toY
        });
    }
    path(context) {
        context.bezierCurveTo(this.cpX, this.cpY, this.cpX2, this.cpY2, this.toX, this.toY);
    }
    // TODO: OK?
    addBounds(bounds) {
        setPoint(bounds, { x: this.cpX, y: this.cpY });
        setPoint(bounds, { x: this.cpX2, y: this.cpY2 });
        setPoint(bounds, { x: this.toX, y: this.toY });
    }
}
/**
 * @ignore
 */
class QuadraticCurveTo extends Op {
    constructor(cpX, cpY, toX, toY) {
        super();
        Object.defineProperty(this, "cpX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cpX
        });
        Object.defineProperty(this, "cpY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: cpY
        });
        Object.defineProperty(this, "toX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: toX
        });
        Object.defineProperty(this, "toY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: toY
        });
    }
    path(context) {
        context.quadraticCurveTo(this.cpX, this.cpY, this.toX, this.toY);
    }
    // TODO: OK?
    addBounds(bounds) {
        setPoint(bounds, { x: this.cpX, y: this.cpY });
        setPoint(bounds, { x: this.toX, y: this.toY });
    }
}
/**
 * @ignore
 */
class Shadow extends Op {
    constructor(color, blur, offsetX, offsetY, opacity) {
        super();
        Object.defineProperty(this, "color", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: color
        });
        Object.defineProperty(this, "blur", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: blur
        });
        Object.defineProperty(this, "offsetX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: offsetX
        });
        Object.defineProperty(this, "offsetY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: offsetY
        });
        Object.defineProperty(this, "opacity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: opacity
        });
    }
    colorize(context, _forceColor) {
        if (this.opacity) {
            context.fillStyle = this.color;
        }
        context.shadowColor = this.color;
        context.shadowBlur = this.blur;
        context.shadowOffsetX = this.offsetX;
        context.shadowOffsetY = this.offsetY;
    }
}
/**
 * @ignore
 */
class GraphicsImage extends Op {
    constructor(image, width, height, x, y) {
        super();
        Object.defineProperty(this, "image", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: image
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: width
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: height
        });
        Object.defineProperty(this, "x", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: x
        });
        Object.defineProperty(this, "y", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: y
        });
    }
    path(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    // TODO: OK?
    addBounds(bounds) {
        setPoint(bounds, { x: this.x, y: this.y });
        setPoint(bounds, { x: this.width, y: this.height });
    }
}
/**
 * @ignore
 */
export class CanvasGraphics extends CanvasDisplayObject {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_operations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "blendMode", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: BlendMode.NORMAL
        });
        Object.defineProperty(this, "_hasShadows", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_fillAlpha", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_strokeAlpha", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    clear() {
        super.clear();
        this._operations.length = 0;
    }
    _pushOp(op) {
        this._operations.push(op);
    }
    beginFill(color, alpha = 1) {
        this._fillAlpha = alpha;
        if (color) {
            if (color instanceof Color) {
                this._pushOp(new BeginFill(color.toCSS(alpha)));
            }
            else {
                this.isMeasured = true;
                this._pushOp(new BeginFill(color));
            }
        }
        else {
            this._pushOp(new BeginFill("rgba(0, 0, 0, " + alpha + ")"));
        }
    }
    endFill() {
        this._pushOp(new EndFill(this._hasShadows));
    }
    endStroke() {
        this._pushOp(new EndStroke());
    }
    beginPath() {
        this._pushOp(new BeginPath());
    }
    lineStyle(width = 0, color, alpha = 1, lineJoin) {
        this._strokeAlpha = alpha;
        if (color) {
            if (color instanceof Color) {
                this._pushOp(new LineStyle(width, color.toCSS(alpha), lineJoin));
            }
            else {
                this._pushOp(new LineStyle(width, color, lineJoin));
            }
        }
        else {
            this._pushOp(new LineStyle(width, "rgba(0, 0, 0, " + alpha + ")", lineJoin));
        }
    }
    setLineDash(dash) {
        this._pushOp(new LineDash(dash ? dash : []));
    }
    setLineDashOffset(dashOffset = 0) {
        this._pushOp(new LineDashOffset(dashOffset));
    }
    drawRect(x, y, width, height) {
        this._pushOp(new DrawRect(x, y, width, height));
    }
    drawCircle(x, y, radius) {
        this._pushOp(new DrawCircle(x, y, radius));
    }
    drawEllipse(x, y, radiusX, radiusY) {
        this._pushOp(new DrawEllipse(x, y, radiusX, radiusY));
    }
    arc(cx, cy, radius, startAngle, endAngle, anticlockwise = false) {
        this._pushOp(new Arc(cx, cy, radius, startAngle, endAngle, anticlockwise));
    }
    arcTo(x1, y1, x2, y2, radius) {
        this._pushOp(new ArcTo(x1, y1, x2, y2, radius));
    }
    lineTo(x, y) {
        this._pushOp(new LineTo(x, y));
    }
    moveTo(x, y) {
        this._pushOp(new MoveTo(x, y));
    }
    bezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY) {
        this._pushOp(new BezierCurveTo(cpX, cpY, cpX2, cpY2, toX, toY));
    }
    quadraticCurveTo(cpX, cpY, toX, toY) {
        this._pushOp(new QuadraticCurveTo(cpX, cpY, toX, toY));
    }
    closePath() {
        this._pushOp(new ClosePath());
    }
    shadow(color, blur = 0, offsetX = 0, offsetY = 0, opacity) {
        this._hasShadows = true;
        this._pushOp(new Shadow(opacity ? color.toCSS(opacity) : color.toCSS(this._fillAlpha || this._strokeAlpha), blur, offsetX, offsetY));
    }
    image(image, width, height, x, y) {
        this._pushOp(new GraphicsImage(image, width, height, x, y));
    }
    // https://svgwg.org/svg2-draft/paths.html#DProperty
    // TODO better error checking
    svgPath(path) {
        let x = 0;
        let y = 0;
        let cpx = null;
        let cpy = null;
        let qcpx = null;
        let qcpy = null;
        const SEGMENTS_REGEXP = /([MmZzLlHhVvCcSsQqTtAa])([^MmZzLlHhVvCcSsQqTtAa]*)/g;
        const ARGS_REGEXP = /[\u0009\u0020\u000A\u000C\u000D]*([\+\-]?[0-9]*\.?[0-9]+(?:[eE][\+\-]?[0-9]+)?)[\u0009\u0020\u000A\u000C\u000D]*,?/g;
        let match;
        while ((match = SEGMENTS_REGEXP.exec(path)) !== null) {
            const name = match[1];
            const rest = match[2];
            const args = [];
            while ((match = ARGS_REGEXP.exec(rest)) !== null) {
                args.push(match[1]);
            }
            // Reset control point
            if (name !== "S" && name !== "s" && name !== "C" && name !== "c") {
                cpx = null;
                cpy = null;
            }
            // Reset control point
            if (name !== "Q" && name !== "q" && name !== "T" && name !== "t") {
                qcpx = null;
                qcpy = null;
            }
            switch (name) {
                case "M":
                    checkEvenArgs(name, args.length, 2);
                    x = +args[0];
                    y = +args[1];
                    this.moveTo(x, y);
                    for (let i = 2; i < args.length; i += 2) {
                        x = +args[i];
                        y = +args[i + 1];
                        this.lineTo(x, y);
                    }
                    break;
                case "m":
                    checkEvenArgs(name, args.length, 2);
                    x += +args[0];
                    y += +args[1];
                    this.moveTo(x, y);
                    for (let i = 2; i < args.length; i += 2) {
                        x += +args[i];
                        y += +args[i + 1];
                        this.lineTo(x, y);
                    }
                    break;
                case "L":
                    checkEvenArgs(name, args.length, 2);
                    for (let i = 0; i < args.length; i += 2) {
                        x = +args[i];
                        y = +args[i + 1];
                        this.lineTo(x, y);
                    }
                    break;
                case "l":
                    checkEvenArgs(name, args.length, 2);
                    for (let i = 0; i < args.length; i += 2) {
                        x += +args[i];
                        y += +args[i + 1];
                        this.lineTo(x, y);
                    }
                    break;
                case "H":
                    checkMinArgs(name, args.length, 1);
                    for (let i = 0; i < args.length; ++i) {
                        x = +args[i];
                        this.lineTo(x, y);
                    }
                    break;
                case "h":
                    checkMinArgs(name, args.length, 1);
                    for (let i = 0; i < args.length; ++i) {
                        x += +args[i];
                        this.lineTo(x, y);
                    }
                    break;
                case "V":
                    checkMinArgs(name, args.length, 1);
                    for (let i = 0; i < args.length; ++i) {
                        y = +args[i];
                        this.lineTo(x, y);
                    }
                    break;
                case "v":
                    checkMinArgs(name, args.length, 1);
                    for (let i = 0; i < args.length; ++i) {
                        y += +args[i];
                        this.lineTo(x, y);
                    }
                    break;
                case "C":
                    checkEvenArgs(name, args.length, 6);
                    for (let i = 0; i < args.length; i += 6) {
                        const x1 = +args[i];
                        const y1 = +args[i + 1];
                        cpx = +args[i + 2];
                        cpy = +args[i + 3];
                        x = +args[i + 4];
                        y = +args[i + 5];
                        this.bezierCurveTo(x1, y1, cpx, cpy, x, y);
                    }
                    break;
                case "c":
                    checkEvenArgs(name, args.length, 6);
                    for (let i = 0; i < args.length; i += 6) {
                        const x1 = +args[i] + x;
                        const y1 = +args[i + 1] + y;
                        cpx = +args[i + 2] + x;
                        cpy = +args[i + 3] + y;
                        x += +args[i + 4];
                        y += +args[i + 5];
                        this.bezierCurveTo(x1, y1, cpx, cpy, x, y);
                    }
                    break;
                case "S":
                    checkEvenArgs(name, args.length, 4);
                    if (cpx === null || cpy === null) {
                        cpx = x;
                        cpy = y;
                    }
                    for (let i = 0; i < args.length; i += 4) {
                        const x1 = 2 * x - cpx;
                        const y1 = 2 * y - cpy;
                        cpx = +args[i];
                        cpy = +args[i + 1];
                        x = +args[i + 2];
                        y = +args[i + 3];
                        this.bezierCurveTo(x1, y1, cpx, cpy, x, y);
                    }
                    break;
                case "s":
                    checkEvenArgs(name, args.length, 4);
                    if (cpx === null || cpy === null) {
                        cpx = x;
                        cpy = y;
                    }
                    for (let i = 0; i < args.length; i += 4) {
                        const x1 = 2 * x - cpx;
                        const y1 = 2 * y - cpy;
                        cpx = +args[i] + x;
                        cpy = +args[i + 1] + y;
                        x += +args[i + 2];
                        y += +args[i + 3];
                        this.bezierCurveTo(x1, y1, cpx, cpy, x, y);
                    }
                    break;
                case "Q":
                    checkEvenArgs(name, args.length, 4);
                    for (let i = 0; i < args.length; i += 4) {
                        qcpx = +args[i];
                        qcpy = +args[i + 1];
                        x = +args[i + 2];
                        y = +args[i + 3];
                        this.quadraticCurveTo(qcpx, qcpy, x, y);
                    }
                    break;
                case "q":
                    checkEvenArgs(name, args.length, 4);
                    for (let i = 0; i < args.length; i += 4) {
                        qcpx = +args[i] + x;
                        qcpy = +args[i + 1] + y;
                        x += +args[i + 2];
                        y += +args[i + 3];
                        this.quadraticCurveTo(qcpx, qcpy, x, y);
                    }
                    break;
                case "T":
                    checkEvenArgs(name, args.length, 2);
                    if (qcpx === null || qcpy === null) {
                        qcpx = x;
                        qcpy = y;
                    }
                    for (let i = 0; i < args.length; i += 2) {
                        qcpx = 2 * x - qcpx;
                        qcpy = 2 * y - qcpy;
                        x = +args[i];
                        y = +args[i + 1];
                        this.quadraticCurveTo(qcpx, qcpy, x, y);
                    }
                    break;
                case "t":
                    checkEvenArgs(name, args.length, 2);
                    if (qcpx === null || qcpy === null) {
                        qcpx = x;
                        qcpy = y;
                    }
                    for (let i = 0; i < args.length; i += 2) {
                        qcpx = 2 * x - qcpx;
                        qcpy = 2 * y - qcpy;
                        x += +args[i];
                        y += +args[i + 1];
                        this.quadraticCurveTo(qcpx, qcpy, x, y);
                    }
                    break;
                case "A":
                case "a":
                    const relative = (name === "a");
                    splitArcFlags(args);
                    checkEvenArgs(name, args.length, 7);
                    for (let i = 0; i < args.length; i += 7) {
                        let cx = +args[i + 5];
                        let cy = +args[i + 6];
                        if (relative) {
                            cx += x;
                            cy += y;
                        }
                        const bs = arcToBezier({
                            px: x,
                            py: y,
                            rx: +args[i],
                            ry: +args[i + 1],
                            xAxisRotation: +args[i + 2],
                            largeArcFlag: assertBinary(+args[i + 3]),
                            sweepFlag: assertBinary(+args[i + 4]),
                            cx,
                            cy,
                        });
                        $array.each(bs, (b) => {
                            this.bezierCurveTo(b.x1, b.y1, b.x2, b.y2, b.x, b.y);
                            x = b.x;
                            y = b.y;
                        });
                    }
                    break;
                case "Z":
                case "z":
                    checkArgs(name, args.length, 0);
                    this.closePath();
                    break;
            }
        }
    }
    _runPath(context) {
        context.beginPath();
        $array.each(this._operations, (op) => {
            op.path(context);
        });
    }
    _render(status) {
        super._render(status);
        const layerDirty = status.layer.dirty;
        const interactive = this._isInteractive(status);
        if (layerDirty || interactive) {
            const context = status.layer.context;
            const ghostContext = this._renderer._ghostLayer.context;
            if (layerDirty) {
                context.globalCompositeOperation = this.blendMode;
                context.beginPath();
            }
            let color;
            if (interactive) {
                ghostContext.beginPath();
                color = this._getColorId();
            }
            $array.each(this._operations, (op) => {
                if (layerDirty) {
                    op.path(context);
                    op.colorize(context, undefined);
                }
                if (interactive) {
                    op.path(ghostContext);
                    op.colorize(ghostContext, color);
                }
            });
        }
    }
    renderDetached(context) {
        if (this.visible) {
            this._setMatrix();
            context.save();
            // We must apply the mask before we transform the element
            const mask = this.mask;
            if (mask) {
                mask._setMatrix();
                mask._transform(context, 1);
                mask._runPath(context);
                context.clip();
            }
            // TODO handle compoundAlpha somehow ?
            context.globalAlpha = this.compoundAlpha * this.alpha;
            this._transform(context, 1);
            if (this.filter) {
                context.filter = this.filter;
            }
            context.globalCompositeOperation = this.blendMode;
            context.beginPath();
            $array.each(this._operations, (op) => {
                op.path(context);
                op.colorize(context, undefined);
            });
            context.restore();
        }
    }
    _addBounds(bounds) {
        if (this.visible && this.isMeasured) {
            $array.each(this._operations, (op) => {
                op.addBounds(bounds);
            });
        }
    }
}
/**
 * @ignore
 */
export class CanvasText extends CanvasDisplayObject {
    constructor(renderer, text, style) {
        super(renderer);
        Object.defineProperty(this, "text", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "style", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "resolution", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "textVisible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_textInfo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_originalScale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        this.text = text;
        this.style = style;
    }
    invalidateBounds() {
        super.invalidateBounds();
        this._textInfo = undefined;
    }
    _shared(context) {
        if (this.style.textAlign) {
            context.textAlign = this.style.textAlign;
        }
        if (this.style.direction) {
            context.direction = this.style.direction;
        }
        if (this.style.textBaseline) {
            context.textBaseline = this.style.textBaseline;
        }
    }
    _prerender(status, ignoreGhost = false, ignoreFontWeight = false) {
        super._render(status);
        const context = status.layer.context;
        const ghostContext = this._renderer._ghostLayer.context;
        // Font style
        const style = this.style;
        let fontStyle = this._getFontStyle(undefined, ignoreFontWeight);
        context.font = fontStyle;
        if (this._isInteractive(status) && !ignoreGhost) {
            ghostContext.font = fontStyle;
        }
        // Other parameters
        if (style.fill) {
            if (style.fill instanceof Color) {
                context.fillStyle = style.fill.toCSS(style.fillOpacity != undefined ? style.fillOpacity : 1);
            }
            else {
                context.fillStyle = style.fill;
            }
        }
        if (style.shadowColor) {
            status.layer.context.shadowColor = style.shadowColor.toCSS(style.shadowOpacity || 1);
        }
        if (style.shadowBlur) {
            status.layer.context.shadowBlur = style.shadowBlur;
        }
        if (style.shadowOffsetX) {
            status.layer.context.shadowOffsetX = style.shadowOffsetX;
        }
        if (style.shadowOffsetY) {
            status.layer.context.shadowOffsetY = style.shadowOffsetY;
        }
        this._shared(context);
        if (this._isInteractive(status) && !ignoreGhost) {
            ghostContext.fillStyle = this._getColorId();
            this._shared(ghostContext);
        }
    }
    _getFontStyle(style2, ignoreFontWeight = false) {
        // Process defaults
        const style = this.style;
        let fontStyle = [];
        if (style2 && style2.fontVariant) {
            fontStyle.push(style2.fontVariant);
        }
        else if (style.fontVariant) {
            fontStyle.push(style.fontVariant);
        }
        if (!ignoreFontWeight) {
            if (style2 && style2.fontWeight) {
                fontStyle.push(style2.fontWeight);
            }
            else if (style.fontWeight) {
                fontStyle.push(style.fontWeight);
            }
        }
        if (style2 && style2.fontStyle) {
            fontStyle.push(style2.fontStyle);
        }
        else if (style.fontStyle) {
            fontStyle.push(style.fontStyle);
        }
        if (style2 && style2.fontSize) {
            if ($type.isNumber(style2.fontSize)) {
                style2.fontSize = style2.fontSize + "px";
            }
            fontStyle.push(style2.fontSize);
        }
        else if (style.fontSize) {
            if ($type.isNumber(style.fontSize)) {
                style.fontSize = style.fontSize + "px";
            }
            fontStyle.push(style.fontSize);
        }
        if (style2 && style2.fontFamily) {
            fontStyle.push(style2.fontFamily);
        }
        else if (style.fontFamily) {
            fontStyle.push(style.fontFamily);
        }
        else if (fontStyle.length) {
            fontStyle.push("Arial");
        }
        return fontStyle.join(" ");
    }
    _render(status) {
        // We need measurements in order to properly position text for alignment
        if (!this._textInfo) {
            this._measure(status);
        }
        if (this.textVisible) {
            const interactive = this._isInteractive(status);
            const context = status.layer.context;
            const layerDirty = status.layer.dirty;
            const ghostContext = this._renderer._ghostLayer.context;
            context.save();
            ghostContext.save();
            this._prerender(status);
            // const lines = this.text.toString().replace(/\r/g, "").split(/\n/);
            // const x = this._localBounds && (this._localBounds.left < 0) ? Math.abs(this._localBounds.left) : 0;
            // Process text info produced by _measure()
            $array.each(this._textInfo, (line, _index) => {
                $array.each(line.textChunks, (chunk, _index) => {
                    // Set style
                    if (chunk.style) {
                        context.save();
                        ghostContext.save();
                        context.font = chunk.style;
                        if (this._isInteractive(status)) {
                            ghostContext.font = chunk.style;
                        }
                    }
                    if (chunk.fill) {
                        context.save();
                        context.fillStyle = chunk.fill.toCSS();
                        // Color does not affect ghostContext so we not set it
                    }
                    // Draw text
                    if (layerDirty) {
                        context.fillText(chunk.text, chunk.offsetX, line.offsetY + chunk.offsetY);
                    }
                    // Draw underline
                    if (chunk.textDecoration == "underline" || chunk.textDecoration == "line-through") {
                        let thickness = 1;
                        let offset = 1;
                        let fontSize = chunk.height;
                        let offsetX = chunk.offsetX;
                        switch (this.style.textAlign) {
                            case "right":
                            case "end":
                                offsetX -= chunk.width;
                                break;
                            case "center":
                                offsetX -= chunk.width / 2;
                                break;
                        }
                        if (chunk.style) {
                            const format = TextFormatter.getTextStyle(chunk.style);
                            switch (format.fontWeight) {
                                case "bolder":
                                case "bold":
                                case "700":
                                case "800":
                                case "900":
                                    thickness = 2;
                                    break;
                            }
                        }
                        if (fontSize) {
                            offset = fontSize / 20;
                        }
                        let y;
                        if (chunk.textDecoration == "line-through") {
                            y = thickness + line.offsetY + chunk.offsetY - chunk.height / 2;
                        }
                        else {
                            y = thickness + offset * 1.5 + line.offsetY + chunk.offsetY;
                        }
                        context.save();
                        context.beginPath();
                        if (chunk.fill) {
                            context.strokeStyle = chunk.fill.toCSS();
                        }
                        else if (this.style.fill && this.style.fill instanceof Color) {
                            context.strokeStyle = this.style.fill.toCSS();
                        }
                        context.lineWidth = thickness * offset;
                        context.moveTo(offsetX, y);
                        context.lineTo(offsetX + chunk.width, y);
                        context.stroke();
                        context.restore();
                    }
                    if (interactive && this.interactive) {
                        // Draw text in ghost canvas ONLY if it is set as interactive
                        // explicitly. This way we avoid hit test anomalies caused by anti
                        // aliasing of text.
                        ghostContext.fillText(chunk.text, chunk.offsetX, line.offsetY + chunk.offsetY);
                    }
                    if (chunk.fill) {
                        context.restore();
                        // Color does not affect ghostContext so we not set it
                    }
                    // Reset style
                    if (chunk.style) {
                        context.restore();
                        ghostContext.restore();
                    }
                });
            });
            context.restore();
            ghostContext.restore();
        }
    }
    _addBounds(bounds) {
        if (this.visible && this.isMeasured) {
            //if (this._textVisible) {
            const x = this._measure({
                inactive: this.inactive,
                layer: this.getLayer(),
            });
            setPoint(bounds, { x: x.left, y: x.top });
            setPoint(bounds, { x: x.right, y: x.bottom });
            //}
        }
    }
    _ignoreFontWeight() {
        return /apple/i.test(navigator.vendor);
    }
    _measure(status) {
        const context = status.layer.context;
        const ghostContext = this._renderer._ghostLayer.context;
        const rtl = this.style.direction == "rtl";
        // Reset text info
        this._textInfo = [];
        // Init
        const oversizedBehavior = this.style.oversizedBehavior;
        const maxWidth = this.style.maxWidth;
        const truncate = $type.isNumber(maxWidth) && oversizedBehavior == "truncate";
        const wrap = $type.isNumber(maxWidth) && (oversizedBehavior == "wrap" || oversizedBehavior == "wrap-no-break");
        // Pre-render
        context.save();
        ghostContext.save();
        this._prerender(status, true, this._ignoreFontWeight());
        // Get default font metrix
        const refText = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";
        // Split up text into lines
        const lines = this.text.toString().replace(/\r/g, "").split(/\n/);
        let styleRestored = true;
        let minX = 0;
        let maxX = 0;
        // Iterate through the lines
        let offsetY = 0;
        let currentStyle;
        $array.each(lines, (line, _index) => {
            // Split up line into format/value chunks
            let chunks;
            if (line == "") {
                chunks = [{
                        type: "value",
                        text: ""
                    }];
            }
            else {
                chunks = TextFormatter.chunk(line, false, this.style.ignoreFormatting);
            }
            while (chunks.length > 0) {
                // Init line object
                let lineInfo = {
                    offsetY: offsetY,
                    ascent: 0,
                    width: 0,
                    height: 0,
                    left: 0,
                    right: 0,
                    textChunks: []
                };
                // Measure reference text
                const metrics = this._measureText(refText, context);
                const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                lineInfo.height = height;
                lineInfo.ascent = metrics.actualBoundingBoxAscent;
                let currentFormat;
                let currentDecoration = this.style.textDecoration;
                let currentFill;
                let currentChunkWidth;
                let skipFurtherText = false;
                let firstTextChunk = true;
                let leftoverChunks = [];
                let currentVerticalAlign;
                //let offsetX = 0;
                //let chunk;
                //while(chunk = chunks.shift()) {
                $array.eachContinue(chunks, (chunk, index) => {
                    // Format chunk
                    if (chunk.type == "format") {
                        if (chunk.text == "[/]") {
                            if (!styleRestored) {
                                context.restore();
                                ghostContext.restore();
                                styleRestored = true;
                            }
                            currentFill = undefined;
                            currentStyle = undefined;
                            currentChunkWidth = undefined;
                            currentDecoration = this.style.textDecoration;
                            currentVerticalAlign = undefined;
                            currentFormat = chunk.text;
                        }
                        else {
                            if (!styleRestored) {
                                context.restore();
                                ghostContext.restore();
                            }
                            let format = TextFormatter.getTextStyle(chunk.text);
                            const fontStyle = this._getFontStyle(format);
                            context.save();
                            ghostContext.save();
                            context.font = fontStyle;
                            currentStyle = fontStyle;
                            currentFormat = chunk.text;
                            if (format.textDecoration) {
                                currentDecoration = format.textDecoration;
                            }
                            if (format.fill) {
                                currentFill = format.fill;
                            }
                            if (format.width) {
                                currentChunkWidth = $type.toNumber(format.width);
                            }
                            if (format.verticalAlign) {
                                currentVerticalAlign = format.verticalAlign;
                            }
                            styleRestored = false;
                            // Measure reference text after change of format
                            const metrics = this._measureText(refText, context);
                            const height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                            if (height > lineInfo.height) {
                                lineInfo.height = height;
                            }
                            if (metrics.actualBoundingBoxAscent > lineInfo.ascent) {
                                lineInfo.ascent = metrics.actualBoundingBoxAscent;
                            }
                        }
                    }
                    // Text chunk
                    else if (chunk.type == "value" && !skipFurtherText) {
                        // Measure
                        const metrics = this._measureText(chunk.text, context);
                        let chunkWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
                        // Check for fit
                        if (truncate) {
                            // Break words?
                            let breakWords = firstTextChunk || this.style.breakWords || false;
                            // Measure ellipsis and check if it fits
                            const ellipsis = this.style.ellipsis || "";
                            const ellipsisMetrics = this._measureText(ellipsis, context);
                            const ellipsisWidth = ellipsisMetrics.actualBoundingBoxLeft + ellipsisMetrics.actualBoundingBoxRight;
                            // Check fit
                            if ((lineInfo.width + chunkWidth) > maxWidth) {
                                const excessWidth = maxWidth - lineInfo.width - ellipsisWidth;
                                chunk.text = this._truncateText(context, chunk.text, excessWidth, breakWords);
                                chunk.text += ellipsis;
                                skipFurtherText = true;
                            }
                        }
                        else if (wrap) {
                            // Check fit
                            if ((lineInfo.width + chunkWidth) > maxWidth) {
                                const excessWidth = maxWidth - lineInfo.width;
                                const tmpText = this._truncateText(context, chunk.text, excessWidth, false, (firstTextChunk && this.style.oversizedBehavior != "wrap-no-break"));
                                if (tmpText == "") {
                                    // Unable to fit a single letter - hide the whole label
                                    this.textVisible = true;
                                    return false;
                                }
                                //skipFurtherText = true;
                                //Add remaining chunks for the next line
                                leftoverChunks = chunks.slice(index + 1);
                                //Add remaining text of current chunk if it was forced-cut
                                if ($utils.trim(tmpText) != $utils.trim(chunk.text)) {
                                    leftoverChunks.unshift({
                                        type: "value",
                                        text: chunk.text.substr(tmpText.length)
                                    });
                                    if (currentFormat) {
                                        leftoverChunks.unshift({
                                            type: "format",
                                            text: currentFormat
                                        });
                                    }
                                }
                                // Set current chunk (truncated)
                                chunk.text = $utils.trim(tmpText);
                                chunks = [];
                                skipFurtherText = true;
                            }
                        }
                        // Chunk width?
                        let leftBoundMod = 1;
                        let rightBoundMod = 1;
                        if (currentStyle && currentChunkWidth && (currentChunkWidth > chunkWidth)) {
                            // increase horizontal bounding boxes accordingly
                            const boundsMod = chunkWidth / currentChunkWidth;
                            switch (this.style.textAlign) {
                                case "right":
                                case "end":
                                    leftBoundMod = boundsMod;
                                    break;
                                case "center":
                                    leftBoundMod = boundsMod;
                                    rightBoundMod = boundsMod;
                                    break;
                                default:
                                    rightBoundMod = boundsMod;
                            }
                            chunkWidth = currentChunkWidth;
                        }
                        const chunkHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                        if (chunkHeight > lineInfo.height) {
                            lineInfo.height = chunkHeight;
                        }
                        if (metrics.actualBoundingBoxAscent > lineInfo.ascent) {
                            lineInfo.ascent = metrics.actualBoundingBoxAscent;
                        }
                        lineInfo.width += chunkWidth;
                        lineInfo.left += metrics.actualBoundingBoxLeft / leftBoundMod;
                        lineInfo.right += metrics.actualBoundingBoxRight / rightBoundMod;
                        lineInfo.textChunks.push({
                            style: currentStyle,
                            fill: currentFill,
                            text: chunk.text,
                            width: chunkWidth,
                            height: chunkHeight,
                            left: metrics.actualBoundingBoxLeft,
                            right: metrics.actualBoundingBoxRight,
                            ascent: metrics.actualBoundingBoxAscent,
                            offsetX: 0,
                            offsetY: 0,
                            textDecoration: currentDecoration,
                            verticalAlign: currentVerticalAlign
                        });
                        //offsetX += chunkWidth;
                        firstTextChunk = false;
                    }
                    if (leftoverChunks) {
                        //return false;
                    }
                    return true;
                    //}
                });
                if (this.style.lineHeight instanceof Percent) {
                    lineInfo.height *= this.style.lineHeight.value;
                    lineInfo.ascent *= this.style.lineHeight.value;
                }
                else {
                    lineInfo.height *= this.style.lineHeight || 1.2;
                    lineInfo.ascent *= this.style.lineHeight || 1.2;
                }
                if (minX < lineInfo.left) {
                    minX = lineInfo.left;
                }
                if (maxX < lineInfo.right) {
                    maxX = lineInfo.right;
                }
                this._textInfo.push(lineInfo);
                //lineInfo.offsetY += lineInfo.ascent;
                offsetY += lineInfo.height;
                // Reset chunks so that it can proceed to the next line
                chunks = leftoverChunks || [];
            }
        });
        if (!styleRestored) {
            context.restore();
            ghostContext.restore();
        }
        // Adjust chunk internal offsets
        $array.each(this._textInfo, (lineInfo, _index) => {
            let currentChunkOffset = 0;
            $array.each(lineInfo.textChunks, (chunk) => {
                chunk.offsetX = currentChunkOffset + chunk.left - lineInfo.left;
                chunk.offsetY += lineInfo.height - lineInfo.height * (this.style.baselineRatio || 0.19);
                currentChunkOffset += chunk.width;
                if (chunk.verticalAlign) {
                    switch (chunk.verticalAlign) {
                        case "super":
                            chunk.offsetY -= lineInfo.height / 2 - chunk.height / 2;
                            break;
                        case "sub":
                            chunk.offsetY += chunk.height / 2;
                            break;
                    }
                }
            });
        });
        const bounds = {
            left: rtl ? -maxX : -minX,
            top: 0,
            right: rtl ? minX : maxX,
            bottom: offsetY,
        };
        // We need to fit?
        if (oversizedBehavior !== "none") {
            const ratio = this._fitRatio(bounds);
            if (ratio < 1) {
                if (oversizedBehavior == "fit") {
                    if ($type.isNumber(this.style.minScale) && (ratio < this.style.minScale)) {
                        this.textVisible = false;
                        bounds.left = 0;
                        bounds.top = 0;
                        bounds.right = 0;
                        bounds.bottom = 0;
                    }
                    else {
                        if (!this._originalScale || this._originalScale == 1) {
                            this._originalScale = this.scale;
                        }
                        this.scale = ratio;
                        this.textVisible = true;
                    }
                }
                else if (oversizedBehavior == "hide") {
                    this.textVisible = false;
                    bounds.left = 0;
                    bounds.top = 0;
                    bounds.right = 0;
                    bounds.bottom = 0;
                }
                else {
                    switch (this.style.textAlign) {
                        case "right":
                        case "end":
                            bounds.left = -maxWidth;
                            bounds.right = 0;
                            break;
                        case "center":
                            bounds.left = -maxWidth / 2;
                            bounds.right = maxWidth / 2;
                            break;
                        default:
                            bounds.left = 0;
                            bounds.right = maxWidth;
                    }
                    this.scale = this._originalScale || 1;
                    this._originalScale = undefined;
                    this.textVisible = true;
                }
            }
            else {
                this.scale = this._originalScale || 1;
                this._originalScale = undefined;
                this.textVisible = true;
            }
        }
        context.restore();
        ghostContext.restore();
        return bounds;
    }
    _fitRatio(bounds) {
        const maxW = this.style.maxWidth;
        const maxH = this.style.maxHeight;
        if (!$type.isNumber(maxW) && !$type.isNumber(maxH)) {
            return 1;
        }
        const w = bounds.right - bounds.left;
        const h = bounds.bottom - bounds.top;
        return Math.min(maxW / w || 1, maxH / h || 1);
    }
    _truncateText(context, text, maxWidth, breakWords = false, fallbackBreakWords = true) {
        let width;
        do {
            if (breakWords) {
                text = text.slice(0, -1);
            }
            else {
                let tmp = text.replace(/[^,;:!?\\\/\s​]+[,;:!?\\\/\s​]*$/g, "");
                if ((tmp == "" || tmp === text) && fallbackBreakWords) {
                    breakWords = true;
                }
                else if (tmp == "") {
                    return text;
                }
                else {
                    text = tmp;
                }
            }
            const metrics = this._measureText(text, context);
            width = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
        } while ((width > maxWidth) && text != "");
        return text;
    }
    _measureText(text, context) {
        let metrics = context.measureText(text);
        let fakeMetrics = {};
        if (metrics.actualBoundingBoxAscent == null) {
            const div = document.createElement("div");
            div.innerText = text;
            div.style.visibility = "hidden";
            div.style.position = "absolute";
            div.style.top = "-1000000px;";
            div.style.fontFamily = this.style.fontFamily || "";
            div.style.fontSize = this.style.fontSize + "";
            document.body.appendChild(div);
            const bbox = div.getBoundingClientRect();
            document.body.removeChild(div);
            const h = bbox.height;
            const w = metrics.width;
            let left = 0;
            let right = w;
            fakeMetrics = {
                actualBoundingBoxAscent: h,
                actualBoundingBoxDescent: 0,
                actualBoundingBoxLeft: left,
                actualBoundingBoxRight: right,
                fontBoundingBoxAscent: h,
                fontBoundingBoxDescent: 0,
                width: w
            };
            //return fake;
        }
        else {
            fakeMetrics = {
                actualBoundingBoxAscent: metrics.actualBoundingBoxAscent,
                actualBoundingBoxDescent: metrics.actualBoundingBoxDescent,
                actualBoundingBoxLeft: metrics.actualBoundingBoxLeft,
                actualBoundingBoxRight: metrics.actualBoundingBoxRight,
                fontBoundingBoxAscent: metrics.actualBoundingBoxAscent,
                fontBoundingBoxDescent: metrics.actualBoundingBoxDescent,
                width: metrics.width
            };
        }
        const w = metrics.width;
        switch (this.style.textAlign) {
            case "right":
            case "end":
                fakeMetrics.actualBoundingBoxLeft = w;
                fakeMetrics.actualBoundingBoxRight = 0;
                break;
            case "center":
                fakeMetrics.actualBoundingBoxLeft = w / 2;
                fakeMetrics.actualBoundingBoxRight = w / 2;
                break;
            default:
                fakeMetrics.actualBoundingBoxLeft = 0;
                fakeMetrics.actualBoundingBoxRight = w;
        }
        return fakeMetrics;
    }
}
/**
 * @ignore
 */
export class CanvasTextStyle {
    constructor() {
        //public wordWrapWidth: number = 100;
        Object.defineProperty(this, "fill", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fillOpacity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "textAlign", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fontFamily", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fontSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fontWeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fontStyle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "fontVariant", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "textDecoration", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowBlur", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowOffsetX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowOffsetY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowOpacity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // leading?: number;
        // letterSpacing?: number;
        Object.defineProperty(this, "lineHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: percent(120)
        });
        Object.defineProperty(this, "baselineRatio", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0.19
        });
        // padding?: number;
        // stroke?: number;
        // strokeThickness?: number;
        // trim?: number;
        // wordWrap?: boolean;
        Object.defineProperty(this, "direction", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "textBaseline", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "oversizedBehavior", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "none"
        });
        Object.defineProperty(this, "breakWords", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "ellipsis", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "…"
        });
        Object.defineProperty(this, "maxWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "maxHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "minScale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "ignoreFormatting", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
}
/**
 * @ignore
 */
export class CanvasRadialText extends CanvasText {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "textType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "circular"
        });
        Object.defineProperty(this, "radius", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "startAngle", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "inside", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "orientation", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "auto"
        });
        Object.defineProperty(this, "kerning", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_textReversed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _render(status) {
        switch (this.textType) {
            case "circular":
                this._renderCircular(status);
                break;
            default:
                super._render(status);
                break;
        }
    }
    _renderCircular(status) {
        if (this.textVisible) {
            this._prerender(status);
            const interactive = this._isInteractive(status);
            const context = status.layer.context;
            const layerDirty = status.layer.dirty;
            const ghostContext = this._renderer._ghostLayer.context;
            // Savepoint
            context.save();
            if (interactive) {
                ghostContext.save();
            }
            // We need measurements in order to properly position text for alignment
            if (!this._textInfo) {
                this._measure(status);
            }
            // Init
            let radius = (this.radius || 0);
            let startAngle = (this.startAngle || 0);
            let deltaAngle = 0;
            let orientation = this.orientation;
            let inward = orientation == "auto" ? "auto" : orientation == "inward";
            const inside = this.inside;
            const align = this.style.textAlign || "left";
            const kerning = this.kerning || 0;
            let clockwise = align == "left" ? 1 : -1;
            const shouldReverse = !this._textReversed;
            // Check if we need to invert the whole stuff
            if (inward == "auto") {
                // Calc max angle so we know whether we need to flip it
                let maxAngle = 0;
                let midAngle = 0;
                $array.each(this._textInfo, (line, _index) => {
                    const deltaAngle = startAngle + (line.width / (radius - line.height)) / 2 * -clockwise;
                    if (deltaAngle > maxAngle) {
                        maxAngle = deltaAngle;
                    }
                });
                if (align == "left") {
                    midAngle = (maxAngle + deltaAngle / 2) * $math.DEGREES;
                }
                else if (align == "right") {
                    midAngle = (maxAngle - deltaAngle / 2) * $math.DEGREES;
                }
                else {
                    midAngle = startAngle * $math.DEGREES;
                }
                midAngle = $math.normalizeAngle(midAngle);
                inward = (midAngle >= 270) || (midAngle <= 90);
            }
            if (inward == true && shouldReverse) {
                this._textInfo.reverse();
                this._textReversed = true;
            }
            // if ((inward == false && align == "left") || (inward == true && align == "right")) {
            // 	clockwise *= -1;
            // }
            // Process text info produced by _measure()
            $array.each(this._textInfo, (line, _index) => {
                const textHeight = line.height;
                // Adjust radius (for `inside = false`)
                // Radius adjustment for `inside = false` is below the line calculation
                if (!inside) {
                    radius += textHeight;
                }
                // Reverse letters if we're painting them counter-clockwise
                if (((clockwise == -1 && inward) || (clockwise == 1 && !inward)) && shouldReverse) {
                    line.textChunks.reverse();
                }
                // Init angles
                let lineStartAngle = startAngle;
                deltaAngle = 0;
                // Adjust for center-align
                if (align == "center") {
                    lineStartAngle += (line.width / (radius - textHeight)) / 2 * -clockwise;
                    deltaAngle = lineStartAngle - startAngle;
                }
                // if (inward == "auto") {
                // 	let midAngle;
                // 	if (align == "left") {
                // 		midAngle = (lineStartAngle + deltaAngle / 2) * $math.DEGREES;
                // 	}
                // 	else if () {
                // 		midAngle = (lineStartAngle - deltaAngle / 2) * $math.DEGREES;
                // 	}
                // 	inward = (midAngle >= 270) || (midAngle <= 90);
                // }
                // Rotate letters if they are facing outward
                lineStartAngle += (Math.PI * (inward ? 0 : 1)); // Rotate 180 if outward
                // Savepoint
                context.save();
                if (interactive) {
                    ghostContext.save();
                }
                // Assume starting angle
                context.rotate(lineStartAngle);
                if (interactive) {
                    ghostContext.rotate(lineStartAngle);
                }
                let angleShift = 0;
                $array.each(line.textChunks, (chunk, _index) => {
                    // Draw the letter
                    const char = chunk.text;
                    const charWidth = chunk.width;
                    // Rotate half a letter
                    angleShift = (charWidth / 2) / (radius - textHeight) * clockwise;
                    context.rotate(angleShift);
                    if (interactive) {
                        ghostContext.rotate(angleShift);
                    }
                    // Set style
                    if (chunk.style) {
                        context.save();
                        ghostContext.save();
                        context.font = chunk.style;
                        if (interactive) {
                            ghostContext.font = chunk.style;
                        }
                    }
                    if (chunk.fill) {
                        context.save();
                        context.fillStyle = chunk.fill.toCSS();
                        // Color does not affect ghostContext so we not set it
                    }
                    // Center letters
                    context.textBaseline = "middle";
                    context.textAlign = "center";
                    if (interactive) {
                        ghostContext.textBaseline = "middle";
                        ghostContext.textAlign = "center";
                    }
                    // Plop the letter
                    if (layerDirty) {
                        context.fillText(char, 0, (inward ? 1 : -1) * (0 - radius + textHeight / 2));
                    }
                    if (interactive) {
                        ghostContext.fillText(char, 0, (inward ? 1 : -1) * (0 - radius + textHeight / 2));
                    }
                    if (chunk.fill) {
                        context.restore();
                        // Color does not affect ghostContext so we not set it
                    }
                    // Reset style
                    if (chunk.style) {
                        context.restore();
                        ghostContext.restore();
                    }
                    // Rotate half a letter and add spacing
                    angleShift = (charWidth / 2 + kerning) / (radius - textHeight) * clockwise;
                    context.rotate(angleShift);
                    if (interactive) {
                        ghostContext.rotate(angleShift);
                    }
                });
                // Restore angle
                context.restore();
                if (interactive) {
                    ghostContext.restore();
                }
                // Adjust radius (for `inside = true`)
                if (inside) {
                    radius -= textHeight;
                }
            });
            // Restore
            context.restore();
            if (interactive) {
                ghostContext.restore();
            }
        }
    }
    _measure(status) {
        switch (this.textType) {
            case "circular":
                return this._measureCircular(status);
            default:
                return super._measure(status);
        }
    }
    _measureCircular(status) {
        const context = status.layer.context;
        const ghostContext = this._renderer._ghostLayer.context;
        const rtl = this.style.direction == "rtl";
        const oversizedBehavior = this.style.oversizedBehavior;
        const maxWidth = this.style.maxWidth;
        const truncate = $type.isNumber(maxWidth) && oversizedBehavior == "truncate";
        const ellipsis = this.style.ellipsis || "";
        let ellipsisMetrics;
        //const wrap = $type.isNumber(maxWidth) && (oversizedBehavior == "wrap" || oversizedBehavior == "wrap-no-break");
        // Reset text info
        this.textVisible = true;
        this._textInfo = [];
        this._textReversed = false;
        // Pre-render
        context.save();
        ghostContext.save();
        this._prerender(status, true);
        // Split up text into lines
        const lines = this.text.toString().replace(/\r/g, "").split(/\n/);
        let styleRestored = true;
        let totalWidth = 0;
        // Iterate through the lines
        let offsetY = 0;
        $array.each(lines, (line, _index) => {
            // Split up line into format/value chunks
            let chunks = TextFormatter.chunk(line, false, this.style.ignoreFormatting);
            // Init line object
            let lineInfo = {
                offsetY: offsetY,
                ascent: 0,
                width: 0,
                height: 0,
                left: 0,
                right: 0,
                textChunks: []
            };
            let currentStyle;
            let currentFill;
            let currentChunkWidth;
            //while(chunk = chunks.shift()) {
            $array.each(chunks, (chunk, _index) => {
                // Format chunk
                if (chunk.type == "format") {
                    if (chunk.text == "[/]") {
                        if (!styleRestored) {
                            context.restore();
                            ghostContext.restore();
                            styleRestored = true;
                        }
                        currentFill = undefined;
                        currentStyle = undefined;
                        currentChunkWidth = undefined;
                    }
                    else {
                        let format = TextFormatter.getTextStyle(chunk.text);
                        const fontStyle = this._getFontStyle(format);
                        context.save();
                        ghostContext.save();
                        context.font = fontStyle;
                        currentStyle = fontStyle;
                        if (format.fill) {
                            currentFill = format.fill;
                        }
                        if (format.width) {
                            currentChunkWidth = $type.toNumber(format.width);
                        }
                        styleRestored = false;
                    }
                    if (truncate) {
                        ellipsisMetrics = this._measureText(ellipsis, context);
                    }
                }
                // Text format
                else if (chunk.type == "value") {
                    // Measure each letter
                    const chars = chunk.text.match(/./ug) || [];
                    if (rtl) {
                        chars.reverse();
                    }
                    for (let i = 0; i < chars.length; i++) {
                        const char = chars[i];
                        // Measure
                        const metrics = this._measureText(char, context);
                        let chunkWidth = metrics.width;
                        // Chunk width?
                        if (currentStyle && currentChunkWidth && (currentChunkWidth > chunkWidth)) {
                            chunkWidth = currentChunkWidth;
                        }
                        const chunkHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
                        if (chunkHeight > lineInfo.height) {
                            lineInfo.height = chunkHeight;
                        }
                        if (metrics.actualBoundingBoxAscent > lineInfo.ascent) {
                            lineInfo.ascent = metrics.actualBoundingBoxAscent;
                        }
                        totalWidth += chunkWidth;
                        // Handle oversized behavior
                        if (truncate) {
                            // Measure ellipsis and check if it fits
                            if (!ellipsisMetrics) {
                                ellipsisMetrics = this._measureText(ellipsis, context);
                            }
                            const ellipsisWidth = ellipsisMetrics.actualBoundingBoxLeft + ellipsisMetrics.actualBoundingBoxRight;
                            //totalWidth += ellipsisWidth;
                            if ((totalWidth + ellipsisWidth) > maxWidth) {
                                if (lineInfo.textChunks.length == 1) {
                                    this.textVisible = false;
                                }
                                else {
                                    lineInfo.width += ellipsisWidth;
                                    lineInfo.left += ellipsisMetrics.actualBoundingBoxLeft;
                                    lineInfo.right += ellipsisMetrics.actualBoundingBoxRight;
                                    lineInfo.textChunks.push({
                                        style: currentStyle,
                                        fill: currentFill,
                                        text: ellipsis,
                                        width: ellipsisWidth,
                                        height: chunkHeight + ellipsisMetrics.actualBoundingBoxDescent,
                                        left: ellipsisMetrics.actualBoundingBoxLeft,
                                        right: ellipsisMetrics.actualBoundingBoxRight,
                                        ascent: ellipsisMetrics.actualBoundingBoxAscent,
                                        offsetX: 0,
                                        offsetY: chunkHeight,
                                        textDecoration: undefined
                                    });
                                }
                                break;
                            }
                        }
                        lineInfo.width += chunkWidth;
                        lineInfo.left += metrics.actualBoundingBoxLeft;
                        lineInfo.right += metrics.actualBoundingBoxRight;
                        lineInfo.textChunks.push({
                            style: currentStyle,
                            fill: currentFill,
                            text: char,
                            width: chunkWidth,
                            height: chunkHeight + metrics.actualBoundingBoxDescent,
                            left: metrics.actualBoundingBoxLeft,
                            right: metrics.actualBoundingBoxRight,
                            ascent: metrics.actualBoundingBoxAscent,
                            offsetX: 0,
                            offsetY: chunkHeight,
                            textDecoration: undefined
                        });
                        if (rtl) {
                            break;
                        }
                    }
                }
            });
            if (this.style.lineHeight instanceof Percent) {
                lineInfo.height *= this.style.lineHeight.value;
            }
            else {
                lineInfo.height *= this.style.lineHeight || 1.2;
            }
            this._textInfo.push(lineInfo);
            //lineInfo.offsetY += lineInfo.ascent;
            offsetY += lineInfo.height;
        });
        if (!styleRestored) {
            context.restore();
            ghostContext.restore();
        }
        if (oversizedBehavior == "hide" && (totalWidth > maxWidth)) {
            this.textVisible = false;
        }
        // Adjust chunk internal offsets
        $array.each(this._textInfo, (lineInfo) => {
            $array.each(lineInfo.textChunks, (chunk) => {
                chunk.offsetY += Math.round((lineInfo.height - chunk.height + (lineInfo.ascent - chunk.ascent)) / 2);
            });
        });
        context.restore();
        ghostContext.restore();
        return {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
        };
    }
}
/**
 * @ignore
 */
export class CanvasImage extends CanvasDisplayObject {
    constructor(renderer, image) {
        super(renderer);
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "image", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tainted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowColor", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowBlur", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowOffsetX", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowOffsetY", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shadowOpacity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_imageMask", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.image = image;
    }
    _dispose() {
        super._dispose();
        if (this._imageMask) {
            clearCanvas(this._imageMask);
        }
    }
    getLocalBounds() {
        if (!this._localBounds) {
            let w = 0;
            let h = 0;
            if (this.width) {
                w = this.width;
            }
            if (this.height) {
                h = this.height;
            }
            this._localBounds = {
                left: 0,
                top: 0,
                right: w,
                bottom: h
            };
            this._addBounds(this._localBounds);
        }
        return this._localBounds;
    }
    _render(status) {
        super._render(status);
        if (this.image) {
            if (this.tainted === undefined) {
                this.tainted = isTainted(this.image);
                status.layer.tainted = true;
            }
            if (this.tainted && this._renderer._omitTainted) {
                return;
            }
            if (status.layer.dirty) {
                if (this.shadowColor) {
                    status.layer.context.shadowColor = this.shadowColor.toCSS(this.shadowOpacity || 1);
                }
                if (this.shadowBlur) {
                    status.layer.context.shadowBlur = this.shadowBlur;
                }
                if (this.shadowOffsetX) {
                    status.layer.context.shadowOffsetX = this.shadowOffsetX;
                }
                if (this.shadowOffsetY) {
                    status.layer.context.shadowOffsetY = this.shadowOffsetY;
                }
                // TODO should this round ?
                const width = this.width || this.image.naturalWidth;
                const height = this.height || this.image.naturalHeight;
                status.layer.context.drawImage(this.image, 0, 0, width, height);
            }
            if (this.interactive && this._isInteractive(status)) {
                const mask = this._getMask(this.image);
                this._renderer._ghostLayer.context.drawImage(mask, 0, 0);
            }
        }
    }
    clear() {
        super.clear();
        this.image = undefined;
        this._imageMask = undefined;
    }
    _getMask(image) {
        if (this._imageMask === undefined) {
            // TODO should this round ?
            const width = this.width || image.naturalWidth;
            const height = this.height || image.naturalHeight;
            // We need to create a second canvas because destination-in clears out the entire canvas
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext("2d");
            context.imageSmoothingEnabled = false;
            context.fillStyle = this._getColorId();
            context.fillRect(0, 0, width, height);
            if (!isTainted(image)) {
                context.globalCompositeOperation = "destination-in";
                context.drawImage(image, 0, 0, width, height);
            }
            this._imageMask = canvas;
        }
        return this._imageMask;
    }
}
/**
 * @ignore
 */
export class CanvasRendererEvent {
    constructor(event, originalPoint, point, bbox) {
        Object.defineProperty(this, "event", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: event
        });
        Object.defineProperty(this, "originalPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: originalPoint
        });
        Object.defineProperty(this, "point", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: point
        });
        Object.defineProperty(this, "bbox", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: bbox
        });
        Object.defineProperty(this, "id", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "simulated", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "native", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        if ($utils.supports("touchevents") && event instanceof Touch) {
            this.id = event.identifier;
        }
        else {
            this.id = null;
        }
    }
}
/**
 * @ignore
 */
export class CanvasRenderer extends ArrayDisposer {
    /*protected _mouseMoveThrottler: Throttler = new Throttler(() => {
        this._dispatchGlobalMousemove(this._lastPointerMoveEvent.event, this._lastPointerMoveEvent.native);
    });
    */
    constructor(resolution) {
        super();
        Object.defineProperty(this, "view", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: document.createElement("div")
        });
        Object.defineProperty(this, "_layerDom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: document.createElement("div")
        });
        Object.defineProperty(this, "layers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_dirtyLayers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "defaultLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.getLayer(0)
        });
        Object.defineProperty(this, "_ghostLayer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new GhostLayer()
        });
        Object.defineProperty(this, "_patternCanvas", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: document.createElement("canvas")
        });
        Object.defineProperty(this, "_patternContext", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this._patternCanvas.getContext("2d")
        });
        Object.defineProperty(this, "_realWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_realHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_calculatedWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_calculatedHeight", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "resolution", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "interactionsEnabled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_listeners", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_colorId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_colorMap", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_forceInteractive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_omitTainted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // TODO this should store the Id as well
        Object.defineProperty(this, "_hovering", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Set()
        });
        Object.defineProperty(this, "_dragging", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_mousedown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_lastPointerMoveEvent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tapToActivate", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "tapToActivateTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 3000
        });
        Object.defineProperty(this, "_touchActive", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_touchActiveTimeout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        if (resolution == null) {
            this.resolution = window.devicePixelRatio;
        }
        else {
            this.resolution = resolution;
        }
        this.view.style.position = "absolute";
        this.view.setAttribute("aria-hidden", "true");
        this.view.appendChild(this._layerDom);
        this._disposers.push(new Disposer(() => {
            $object.each(this._events, (_key, events) => {
                events.disposer.dispose();
            });
            $array.each(this.layers, (layer) => {
                clearCanvas(layer.view);
                if (layer.exportableView) {
                    clearCanvas(layer.exportableView);
                }
            });
            clearCanvas(this._ghostLayer.view);
            clearCanvas(this._patternCanvas);
        }));
        /*
        this._disposers.push($utils.addEventListener(this._ghostLayer.view, "click", (originalEvent: MouseEvent) => {
            const event = this.getEvent(originalEvent);
            const target = this._getHitTarget(event.originalPoint, event.bbox);
            console.debug(target);
        }));
        */
        // Monitor for possible pixel ratio changes (when page is zoomed)
        this._disposers.push($utils.onZoom(() => {
            if (resolution == null) {
                this.resolution = window.devicePixelRatio;
            }
        }));
        // We need this in order top prevent default touch gestures when dragging
        // draggable elements
        if ($utils.supports("touchevents")) {
            const listener = (ev) => {
                if (this._dragging.length !== 0) {
                    $array.eachContinue(this._dragging, (item) => {
                        if (item.value.shouldCancelTouch()) {
                            ev.preventDefault();
                            return false;
                        }
                        return true;
                    });
                }
                // If touch down happends, delay touch out
                if (this._touchActiveTimeout) {
                    this._delayTouchDeactivate();
                }
            };
            this._disposers.push($utils.addEventListener(window, "touchstart", listener, { passive: false }));
            this._disposers.push($utils.addEventListener(this.view, "touchstart", listener, { passive: false }));
            this._disposers.push($utils.addEventListener(this.view, "touchmove", () => {
                // If touch is moving, delay touch out
                if (this._touchActiveTimeout) {
                    this._delayTouchDeactivate();
                }
            }, { passive: true }));
            this._disposers.push($utils.addEventListener(window, "click", (_ev) => {
                this._touchActive = false;
            }, { passive: true }));
            this._disposers.push($utils.addEventListener(this.view, "click", (_ev) => {
                window.setTimeout(() => {
                    this._touchActive = true;
                    this._delayTouchDeactivate();
                }, 100);
            }, { passive: true }));
        }
        // Prevent scrolling of the window when hovering on "wheelable" object
        if ($utils.supports("wheelevents")) {
            this._disposers.push($utils.addEventListener(this.view, "wheel", (ev) => {
                let prevent = false;
                this._hovering.forEach((obj) => {
                    if (obj.wheelable) {
                        prevent = true;
                        return false;
                    }
                });
                if (prevent) {
                    ev.preventDefault();
                }
            }, { passive: false }));
        }
    }
    _delayTouchDeactivate() {
        if (this._touchActiveTimeout) {
            clearTimeout(this._touchActiveTimeout);
        }
        if (this.tapToActivateTimeout > 0) {
            this._touchActiveTimeout = window.setTimeout(() => {
                this._touchActive = false;
            }, this.tapToActivateTimeout);
        }
    }
    get debugGhostView() {
        return !!this._ghostLayer.view.parentNode;
    }
    set debugGhostView(value) {
        if (value) {
            if (!this._ghostLayer.view.parentNode) {
                this.view.appendChild(this._ghostLayer.view);
            }
        }
        else {
            if (this._ghostLayer.view.parentNode) {
                this._ghostLayer.view.parentNode.removeChild(this._ghostLayer.view);
            }
        }
    }
    createLinearGradient(x1, y1, x2, y2) {
        return this.defaultLayer.context.createLinearGradient(x1, y1, x2, y2);
    }
    createRadialGradient(x1, y1, radius1, x2, y2, radius2) {
        return this.defaultLayer.context.createRadialGradient(x1, y1, radius1, x2, y2, radius2);
    }
    createPattern(graphics, background, repetition, width, height) {
        // const patternCanvas = document.createElement("canvas");
        // const patternContext = patternCanvas.getContext("2d")!;
        // patternCanvas.width = width;
        // patternCanvas.height = height;
        // if (fill) {
        // 	patternContext.fillStyle = fill.toCSS();
        // 	patternContext.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
        // }
        // const layer = {
        // 	view: patternCanvas,
        // 	context: patternContext,
        // 	visible: true,
        // 	order: 0,
        // 	width: width,
        // 	height: height,
        // 	dirty: true
        // };
        // // patternContext.arc(0, 0, 50, 0, .5 * Math.PI);
        // // patternContext.stroke();
        // image.targetLayer = layer;
        // image.render(layer);
        //this._layerDom.appendChild(patternCanvas);
        this._patternCanvas.width = width;
        this._patternCanvas.height = height;
        this._patternContext.clearRect(0, 0, width, height);
        // patternCanvas.style.width = width * this.resolution + "px";
        // patternCanvas.style.height = height * this.resolution + "px";
        background.renderDetached(this._patternContext);
        graphics.renderDetached(this._patternContext);
        return this._patternContext.createPattern(this._patternCanvas, repetition);
    }
    makeContainer() {
        return new CanvasContainer(this);
    }
    makeGraphics() {
        return new CanvasGraphics(this);
    }
    makeText(text, style) {
        return new CanvasText(this, text, style);
    }
    makeTextStyle() {
        return new CanvasTextStyle();
    }
    makeRadialText(text, style) {
        return new CanvasRadialText(this, text, style);
    }
    makePicture(image) {
        return new CanvasImage(this, image);
    }
    resizeLayer(layer) {
        layer.resize(this._calculatedWidth, this._calculatedHeight, this._calculatedWidth, this._calculatedHeight, this.resolution);
    }
    resizeGhost() {
        this._ghostLayer.resize(this._calculatedWidth, this._calculatedHeight, this._calculatedWidth, this._calculatedHeight, this.resolution);
    }
    resize(realWidth, realHeight, calculatedWidth, calculatedHeight) {
        this._realWidth = realWidth;
        this._realHeight = realHeight;
        this._calculatedWidth = calculatedWidth;
        this._calculatedHeight = calculatedHeight;
        $array.each(this.layers, (layer) => {
            if (layer) {
                layer.dirty = true;
                this.resizeLayer(layer);
            }
        });
        this.resizeGhost();
        this.view.style.width = calculatedWidth + "px";
        this.view.style.height = calculatedHeight + "px";
    }
    createDetachedLayer(willReadFrequently = false) {
        const view = document.createElement("canvas");
        const context = view.getContext("2d", { willReadFrequently: willReadFrequently });
        const layer = new CanvasLayer(view, context);
        view.style.position = "absolute";
        view.style.top = "0px";
        view.style.left = "0px";
        return layer;
    }
    getLayerByOrder(order) {
        const layers = this.layers;
        const length = layers.length;
        for (let i = 0; i < length; i++) {
            const layer = layers[i];
            if (layer.order == order) {
                return layer;
            }
        }
    }
    getLayer(order, visible = true) {
        let existingLayer = this.getLayerByOrder(order);
        if (existingLayer) {
            return existingLayer;
        }
        const layer = this.createDetachedLayer(order == 99);
        layer.order = order;
        layer.visible = visible;
        layer.view.className = "am5-layer-" + order;
        if (layer.visible) {
            this.resizeLayer(layer);
        }
        const layers = this.layers;
        layers.push(layer);
        layers.sort((a, b) => {
            if (a.order > b.order) {
                return 1;
            }
            else if (a.order < b.order) {
                return -1;
            }
            else {
                return 0;
            }
        });
        const length = layers.length;
        const layerIndex = $array.indexOf(layers, layer);
        let next;
        for (let i = layerIndex + 1; i < length; i++) {
            if (layers[i].visible) {
                next = layers[i];
                break;
            }
        }
        if (layer.visible) {
            if (next === undefined) {
                this._layerDom.appendChild(layer.view);
            }
            else {
                this._layerDom.insertBefore(layer.view, next.view);
            }
        }
        return layer;
    }
    render(root) {
        this._dirtyLayers.length = 0;
        $array.each(this.layers, (layer) => {
            if (layer) {
                if (layer.dirty && layer.visible) {
                    this._dirtyLayers.push(layer);
                    layer.clear();
                }
            }
        });
        this._ghostLayer.clear();
        root.render({
            inactive: null,
            layer: this.defaultLayer,
        });
        this._ghostLayer.context.restore();
        //setTimeout(() => {
        // Remove this after the Chrome bug is fixed:
        // https://bugs.chromium.org/p/chromium/issues/detail?id=1279394
        $array.each(this.layers, (layer) => {
            if (layer) {
                const context = layer.context;
                context.beginPath();
                context.moveTo(0, 0);
                context.stroke();
            }
        });
        $array.each(this._dirtyLayers, (layer) => {
            layer.context.restore();
            layer.dirty = false;
        });
        //}, 100)
        if (this._hovering.size && this._lastPointerMoveEvent) {
            const { events, target, native } = this._lastPointerMoveEvent;
            //this._mouseMoveThrottler.run();
            $array.each(events, (event) => {
                this._dispatchGlobalMousemove(event, target, native);
            });
        }
    }
    paintId(obj) {
        const id = distributeId(++this._colorId);
        const color = Color.fromHex(id).toCSS();
        this._colorMap[color] = obj;
        return color;
    }
    _removeObject(obj) {
        if (obj._colorId !== undefined) {
            delete this._colorMap[obj._colorId];
        }
    }
    // protected _identifyObjectByColor(colorId: number): CanvasDisplayObject | undefined {
    // 	return this._colorMap[colorId];
    // }
    _adjustBoundingBox(bbox) {
        const margin = this._ghostLayer.margin;
        return new DOMRect(-margin.left, -margin.top, bbox.width + margin.left + margin.right, bbox.height + margin.top + margin.bottom);
    }
    getEvent(originalEvent, adjustPoint = true) {
        const bbox = this.view.getBoundingClientRect();
        const x = originalEvent.clientX || 0;
        const y = originalEvent.clientY || 0;
        const widthScale = this._calculatedWidth / this._realWidth;
        const heightScale = this._calculatedHeight / this._realHeight;
        const originalPoint = {
            x: x - bbox.left,
            y: y - bbox.top,
        };
        const point = {
            x: (x - (adjustPoint ? bbox.left : 0)) * widthScale,
            y: (y - (adjustPoint ? bbox.top : 0)) * heightScale,
        };
        return new CanvasRendererEvent(originalEvent, originalPoint, point, this._adjustBoundingBox(bbox));
    }
    _getHitTarget(point, bbox, target) {
        if (bbox.width === 0 || bbox.height === 0 || point.x < bbox.left || point.x > bbox.right || point.y < bbox.top || point.y > bbox.bottom) {
            return;
        }
        if (!target || !this._layerDom.contains(target)) {
            return;
        }
        const pixel = this._ghostLayer.getImageData(point, bbox);
        if (pixel.data[0] === 0 && pixel.data[1] === 0 && pixel.data[2] === 0) {
            return false;
        }
        const colorId = Color.fromRGB(pixel.data[0], pixel.data[1], pixel.data[2]).toCSS();
        const hit = this._colorMap[colorId];
        return hit;
    }
    _withEvents(key, f) {
        const events = this._events[key];
        if (events !== undefined) {
            events.dispatching = true;
            try {
                f(events);
            }
            finally {
                events.dispatching = false;
                if (events.cleanup) {
                    events.cleanup = false;
                    $array.keepIf(events.callbacks, (callback) => {
                        return !callback.disposed;
                    });
                    if (events.callbacks.length === 0) {
                        events.disposer.dispose();
                        delete this._events[key];
                    }
                }
            }
        }
    }
    _dispatchEventAll(key, event) {
        if (!this.interactionsEnabled) {
            return;
        }
        this._withEvents(key, (events) => {
            $array.each(events.callbacks, (callback) => {
                if (!callback.disposed) {
                    callback.callback.call(callback.context, event);
                }
            });
        });
    }
    _dispatchEvent(key, target, event) {
        if (!this.interactionsEnabled) {
            return false;
        }
        let dispatched = false;
        this._withEvents(key, (events) => {
            $array.each(events.callbacks, (callback) => {
                if (!callback.disposed && callback.object === target) {
                    callback.callback.call(callback.context, event);
                    dispatched = true;
                }
            });
        });
        return dispatched;
    }
    _dispatchMousedown(originalEvent, originalTarget) {
        const button = originalEvent.button;
        if (button != 0 && button != 2 && button != 1 && button !== undefined) {
            // Ignore non-primary mouse buttons
            return;
        }
        const event = this.getEvent(originalEvent);
        const target = this._getHitTarget(event.originalPoint, event.bbox, originalTarget);
        if (target) {
            const id = event.id;
            let dragged = false;
            eachTargets(target, (obj) => {
                const info = { id: id, value: obj };
                this._mousedown.push(info);
                if (!dragged && this._dispatchEvent("pointerdown", obj, event)) {
                    // Only dispatch the first element which matches
                    dragged = true;
                    const has = this._dragging.some((x) => {
                        return x.value === obj && x.id === id;
                    });
                    if (!has) {
                        this._dragging.push(info);
                    }
                }
                return true;
            });
        }
    }
    _dispatchGlobalMousemove(originalEvent, originalTarget, native) {
        const event = this.getEvent(originalEvent);
        const target = this._getHitTarget(event.originalPoint, event.bbox, originalTarget);
        event.native = native;
        if (target) {
            this._hovering.forEach((obj) => {
                if (!obj.contains(target)) {
                    this._hovering.delete(obj);
                    if (obj.cursorOverStyle) {
                        $utils.setStyle(document.body, "cursor", obj._replacedCursorStyle);
                    }
                    this._dispatchEvent("pointerout", obj, event);
                }
            });
            if (event.native) {
                eachTargets(target, (obj) => {
                    if (!this._hovering.has(obj)) {
                        this._hovering.add(obj);
                        if (obj.cursorOverStyle) {
                            obj._replacedCursorStyle = $utils.getStyle(document.body, "cursor");
                            $utils.setStyle(document.body, "cursor", obj.cursorOverStyle);
                        }
                        this._dispatchEvent("pointerover", obj, event);
                    }
                    return true;
                });
            }
            //} else if (target === false) {
        }
        else {
            this._hovering.forEach((obj) => {
                if (obj.cursorOverStyle) {
                    $utils.setStyle(document.body, "cursor", obj._replacedCursorStyle);
                }
                this._dispatchEvent("pointerout", obj, event);
            });
            this._hovering.clear();
        }
        this._dispatchEventAll("globalpointermove", event);
    }
    removeHovering(graphics) {
        this._hovering.delete(graphics);
        if (graphics.cursorOverStyle) {
            $utils.setStyle(document.body, "cursor", graphics._replacedCursorStyle);
        }
    }
    _dispatchGlobalMouseup(originalEvent, native) {
        const event = this.getEvent(originalEvent);
        event.native = native;
        //const target = this._getHitTarget(event.originalPoint);
        this._dispatchEventAll("globalpointerup", event);
    }
    _dispatchDragMove(originalEvent) {
        if (this._dragging.length !== 0) {
            const event = this.getEvent(originalEvent);
            const id = event.id;
            this._dragging.forEach((obj) => {
                if (obj.id === id) {
                    this._dispatchEvent("pointermove", obj.value, event);
                }
            });
        }
    }
    _dispatchDragEnd(originalEvent, originalTarget) {
        const button = originalEvent.button;
        let clickevent;
        if (button == 0 || button === undefined) {
            clickevent = "click";
        }
        else if (button == 2) {
            clickevent = "rightclick";
        }
        else if (button == 1) {
            clickevent = "middleclick";
        }
        else {
            // Ignore non-primary mouse buttons
            return;
        }
        const event = this.getEvent(originalEvent);
        const id = event.id;
        if (this._mousedown.length !== 0) {
            const target = this._getHitTarget(event.originalPoint, event.bbox, originalTarget);
            if (target) {
                this._mousedown.forEach((obj) => {
                    if (obj.id === id && obj.value.contains(target)) {
                        this._dispatchEvent(clickevent, obj.value, event);
                    }
                });
            }
            this._mousedown.length = 0;
        }
        if (this._dragging.length !== 0) {
            this._dragging.forEach((obj) => {
                if (obj.id === id) {
                    this._dispatchEvent("pointerup", obj.value, event);
                }
            });
            this._dragging.length = 0;
        }
    }
    _dispatchDoubleClick(originalEvent, originalTarget) {
        const event = this.getEvent(originalEvent);
        const target = this._getHitTarget(event.originalPoint, event.bbox, originalTarget);
        if (target) {
            eachTargets(target, (obj) => {
                if (this._dispatchEvent("dblclick", obj, event)) {
                    return false;
                }
                else {
                    return true;
                }
            });
        }
    }
    _dispatchWheel(originalEvent, originalTarget) {
        const event = this.getEvent(originalEvent);
        const target = this._getHitTarget(event.originalPoint, event.bbox, originalTarget);
        if (target) {
            eachTargets(target, (obj) => {
                if (this._dispatchEvent("wheel", obj, event)) {
                    return false;
                }
                else {
                    return true;
                }
            });
        }
    }
    _makeSharedEvent(key, f) {
        if (this._listeners[key] === undefined) {
            const listener = f();
            this._listeners[key] = new CounterDisposer(() => {
                delete this._listeners[key];
                listener.dispose();
            });
        }
        return this._listeners[key].increment();
    }
    _onPointerEvent(name, f) {
        let native = false;
        let timer = null;
        function clear() {
            timer = null;
            native = false;
        }
        return new MultiDisposer([
            new Disposer(() => {
                if (timer !== null) {
                    clearTimeout(timer);
                }
                clear();
            }),
            $utils.addEventListener(this.view, $utils.getRendererEvent(name), (_) => {
                native = true;
                if (timer !== null) {
                    clearTimeout(timer);
                }
                timer = window.setTimeout(clear, 0);
            }),
            onPointerEvent(window, name, (ev, target) => {
                if (timer !== null) {
                    clearTimeout(timer);
                    timer = null;
                }
                f(ev, target, native);
                native = false;
            }),
        ]);
    }
    // This ensures that only a single DOM event is added (e.g. only a single mousemove event listener)
    _initEvent(key) {
        switch (key) {
            case "globalpointermove":
            case "pointerover":
            case "pointerout":
                return this._makeSharedEvent("pointermove", () => {
                    const listener = (events, target, native) => {
                        this._lastPointerMoveEvent = { events, target, native };
                        $array.each(events, (event) => {
                            this._dispatchGlobalMousemove(event, target, native);
                        });
                    };
                    return new MultiDisposer([
                        this._onPointerEvent("pointerdown", listener),
                        this._onPointerEvent("pointermove", listener),
                    ]);
                });
            case "globalpointerup":
                return this._makeSharedEvent("pointerup", () => {
                    const mouseup = this._onPointerEvent("pointerup", (events, target, native) => {
                        $array.each(events, (event) => {
                            this._dispatchGlobalMouseup(event, native);
                        });
                        this._lastPointerMoveEvent = { events, target, native };
                    });
                    const pointercancel = this._onPointerEvent("pointercancel", (events, target, native) => {
                        $array.each(events, (event) => {
                            this._dispatchGlobalMouseup(event, native);
                        });
                        this._lastPointerMoveEvent = { events, target, native };
                    });
                    return new Disposer(() => {
                        mouseup.dispose();
                        pointercancel.dispose();
                    });
                });
            case "click":
            case "rightclick":
            case "middleclick":
            case "pointerdown":
            /*
                return this._makeSharedEvent("pointerdown", () => {
                    return this._onPointerEvent("pointerdown", (event, target, native) => {
                        this._lastPointerMoveEvent = { event, target, native };
                        this._dispatchMousedown(event)
                    });
                });
            */
            case "pointermove":
            case "pointerup":
                return this._makeSharedEvent("pointerdown", () => {
                    //const throttler = new Throttler();
                    const mousedown = this._onPointerEvent("pointerdown", (events, target) => {
                        $array.each(events, (ev) => {
                            this._dispatchMousedown(ev, target);
                        });
                    });
                    // TODO handle throttling properly for multitouch
                    const mousemove = this._onPointerEvent("pointermove", (ev) => {
                        //throttler.throttle(() => {
                        $array.each(ev, (ev) => {
                            this._dispatchDragMove(ev);
                        });
                        //});
                    });
                    const mouseup = this._onPointerEvent("pointerup", (ev, target) => {
                        $array.each(ev, (ev) => {
                            this._dispatchDragEnd(ev, target);
                        });
                    });
                    const pointercancel = this._onPointerEvent("pointercancel", (ev, target) => {
                        $array.each(ev, (ev) => {
                            this._dispatchDragEnd(ev, target);
                        });
                    });
                    return new Disposer(() => {
                        mousedown.dispose();
                        mousemove.dispose();
                        mouseup.dispose();
                        pointercancel.dispose();
                    });
                });
            case "dblclick":
                return this._makeSharedEvent("dblclick", () => {
                    return this._onPointerEvent("dblclick", (ev, target) => {
                        $array.each(ev, (ev) => {
                            this._dispatchDoubleClick(ev, target);
                        });
                    });
                });
            case "wheel":
                return this._makeSharedEvent("wheel", () => {
                    return $utils.addEventListener(window, $utils.getRendererEvent("wheel"), (event) => {
                        this._dispatchWheel(event, $utils.getEventTarget(event));
                    }, { passive: false });
                });
        }
    }
    _addEvent(object, key, callback, context) {
        let events = this._events[key];
        if (events === undefined) {
            events = this._events[key] = {
                disposer: this._initEvent(key),
                callbacks: [],
                dispatching: false,
                cleanup: false,
            };
        }
        const listener = { object, context, callback, disposed: false };
        events.callbacks.push(listener);
        return new Disposer(() => {
            listener.disposed = true;
            if (events.dispatching) {
                events.cleanup = true;
            }
            else {
                $array.removeFirst(events.callbacks, listener);
                if (events.callbacks.length === 0) {
                    events.disposer.dispose();
                    delete this._events[key];
                }
            }
        });
    }
    getCanvas(root, options) {
        // Make sure everything is rendered
        this.render(root);
        if (!options) {
            options = {};
        }
        let scale = this.resolution;
        let canvasWidth = Math.floor(this._calculatedWidth * this.resolution);
        let canvasHeight = Math.floor(this._calculatedHeight * this.resolution);
        // Check if we need to scale
        if (options.minWidth && (options.minWidth > canvasWidth)) {
            let minScale = options.minWidth / canvasWidth;
            if (minScale > scale) {
                scale = minScale * this.resolution;
            }
        }
        if (options.minHeight && (options.minHeight > canvasHeight)) {
            let minScale = options.minHeight / canvasHeight;
            if (minScale > scale) {
                scale = minScale * this.resolution;
            }
        }
        if (options.maxWidth && (options.maxWidth < canvasWidth)) {
            let maxScale = options.maxWidth / canvasWidth;
            if (maxScale < scale) {
                scale = maxScale * this.resolution;
            }
        }
        if (options.maxHeight && (options.maxHeight > canvasHeight)) {
            let maxScale = options.maxHeight / canvasHeight;
            if (maxScale < scale) {
                scale = maxScale * this.resolution;
            }
        }
        // Check if we need to compensate for pixel ratio
        if (options.maintainPixelRatio) {
            scale /= this.resolution;
        }
        // Init list canvases to remove from DOM after export
        const canvases = [];
        // Set up new canvas for export
        let forceRender = false;
        const canvas = document.createElement("canvas");
        if (scale != this.resolution) {
            forceRender = true;
            canvasWidth = canvasWidth * scale / this.resolution;
            canvasHeight = canvasHeight * scale / this.resolution;
        }
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        // Add to DOM so it inherits CSS
        canvas.style.position = "fixed";
        canvas.style.top = "-10000px";
        this.view.appendChild(canvas);
        canvases.push(canvas);
        // Context
        const context = canvas.getContext("2d");
        let width = 0;
        let height = 0;
        let needRerender = false;
        $array.each(this.layers, (layer) => {
            if (layer && layer.visible) {
                if (layer.tainted || forceRender) {
                    needRerender = true;
                    layer.exportableView = layer.view;
                    layer.exportableContext = layer.context;
                    layer.view = document.createElement("canvas");
                    // Add to DOM so it inherits CSS
                    layer.view.style.position = "fixed";
                    layer.view.style.top = "-10000px";
                    this.view.appendChild(layer.view);
                    canvases.push(layer.view);
                    let extraX = 0;
                    let extraY = 0;
                    if (layer.margin) {
                        extraX += layer.margin.left || 0 + layer.margin.right || 0;
                        extraY += layer.margin.top || 0 + layer.margin.bottom || 0;
                    }
                    layer.view.width = canvasWidth + extraX;
                    layer.view.height = canvasHeight + extraY;
                    layer.context = layer.view.getContext("2d");
                    layer.dirty = true;
                    layer.scale = scale;
                }
            }
        });
        if (needRerender) {
            this._omitTainted = true;
            this.render(root);
            this._omitTainted = false;
        }
        $array.each(this.layers, (layer) => {
            if (layer && layer.visible) {
                // Layer is fine. Just plop it into our target canvas
                let x = 0;
                let y = 0;
                if (layer.margin) {
                    x = -(layer.margin.left || 0) * this.resolution;
                    y = -(layer.margin.top || 0) * this.resolution;
                }
                context.drawImage(layer.view, x, y);
                // Restore layer original canvas
                if (layer.exportableView) {
                    layer.view = layer.exportableView;
                    layer.exportableView = undefined;
                }
                if (layer.exportableContext) {
                    layer.context = layer.exportableContext;
                    layer.exportableContext = undefined;
                }
                if (width < layer.view.clientWidth) {
                    width = layer.view.clientWidth;
                }
                if (height < layer.view.clientHeight) {
                    height = layer.view.clientHeight;
                }
                layer.scale = undefined;
            }
        });
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        $array.each(canvases, (canvas) => {
            canvas.style.position = "";
            canvas.style.top = "";
            this.view.removeChild(canvas);
        });
        return canvas;
    }
}
class GhostLayer {
    constructor() {
        Object.defineProperty(this, "view", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "margin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
            }
        });
        Object.defineProperty(this, "_width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.view = document.createElement("canvas");
        this.context = this.view.getContext("2d", { alpha: false, willReadFrequently: true });
        this.context.imageSmoothingEnabled = false;
        this.view.style.position = "absolute";
        this.view.style.top = "0px";
        this.view.style.left = "0px";
    }
    resize(canvasWidth, canvasHeight, domWidth, domHeight, resolution) {
        canvasWidth += (this.margin.left + this.margin.right);
        canvasHeight += (this.margin.top + this.margin.bottom);
        // TODO this should take into account calculateSize
        domWidth += (this.margin.left + this.margin.right);
        domHeight += (this.margin.top + this.margin.bottom);
        this.view.style.left = -this.margin.left + "px";
        this.view.style.top = -this.margin.top + "px";
        this._width = Math.floor(canvasWidth * resolution);
        this._height = Math.floor(canvasHeight * resolution);
        this.view.width = this._width;
        this.view.style.width = domWidth + "px";
        this.view.height = this._height;
        this.view.style.height = domHeight + "px";
    }
    getImageData(point, bbox) {
        return this.context.getImageData(
        // TODO should this round ?
        Math.round(((point.x - bbox.left) / bbox.width) * this._width), Math.round(((point.y - bbox.top) / bbox.height) * this._height), 1, 1);
    }
    setMargin(layers) {
        this.margin.left = 0;
        this.margin.right = 0;
        this.margin.top = 0;
        this.margin.bottom = 0;
        $array.each(layers, (layer) => {
            if (layer.margin) {
                this.margin.left = Math.max(this.margin.left, layer.margin.left);
                this.margin.right = Math.max(this.margin.right, layer.margin.right);
                this.margin.top = Math.max(this.margin.top, layer.margin.top);
                this.margin.bottom = Math.max(this.margin.bottom, layer.margin.bottom);
            }
        });
    }
    clear() {
        this.context.save();
        this.context.fillStyle = '#000';
        this.context.fillRect(0, 0, this._width, this._height);
    }
}
/**
 * @ignore
 */
export class CanvasLayer {
    constructor(view, context) {
        Object.defineProperty(this, "view", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "context", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "tainted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "margin", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "order", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "visible", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "scale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "dirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "exportableView", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "exportableContext", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_width", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "_height", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        this.view = view;
        this.context = context;
    }
    resize(canvasWidth, canvasHeight, domWidth, domHeight, resolution) {
        // TODO should this take into account calculateSize ?
        if (this.width != null) {
            canvasWidth = this.width;
            domWidth = this.width;
        }
        // TODO should this take into account calculateSize ?
        if (this.height != null) {
            canvasHeight = this.height;
            domHeight = this.height;
        }
        if (this.margin) {
            canvasWidth += (this.margin.left + this.margin.right);
            canvasHeight += (this.margin.top + this.margin.bottom);
            // TODO this should take into account calculateSize
            domWidth += (this.margin.left + this.margin.right);
            domHeight += (this.margin.top + this.margin.bottom);
            this.view.style.left = -this.margin.left + "px";
            this.view.style.top = -this.margin.top + "px";
        }
        else {
            this.view.style.left = "0px";
            this.view.style.top = "0px";
        }
        this._width = Math.floor(canvasWidth * resolution);
        this._height = Math.floor(canvasHeight * resolution);
        this.view.width = this._width;
        this.view.style.width = domWidth + "px";
        this.view.height = this._height;
        this.view.style.height = domHeight + "px";
    }
    clear() {
        this.context.save();
        this.context.clearRect(0, 0, this._width, this._height);
    }
}
//# sourceMappingURL=CanvasRenderer.js.map