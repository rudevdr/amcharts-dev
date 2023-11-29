import { __awaiter } from "tslib";
import { Entity } from "../util/Entity";
import { Template } from "../util/Template";
import { Percent } from "../util/Percent";
import { EventDispatcher } from "../util/EventDispatcher";
import { MultiDisposer, CounterDisposer } from "../util/Disposer";
import { waitForAnimations } from "../util/Animation";
import * as $utils from "../util/Utils";
import * as $array from "../util/Array";
import * as $type from "../util/Type";
import * as $object from "../util/Object";
import * as $math from "../util/Math";
//import { populateString } from "../util/PopulateString";
/**
 * An [[EventDispatcher]] for [[Sprite]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/events/} for more info
 */
class SpriteEventDispatcher extends EventDispatcher {
    constructor(sprite) {
        super();
        Object.defineProperty(this, "_sprite", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_rendererDisposers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_dispatchParents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        this._sprite = sprite;
    }
    _makePointerEvent(key, event) {
        return {
            type: key,
            originalEvent: event.event,
            point: event.point,
            simulated: event.simulated,
            native: event.native,
            target: this._sprite
        };
    }
    _onRenderer(key, dispatch) {
        // TODO: is this OK? it'd be good not to require to set this on each individual element
        this._sprite.set("interactive", true);
        this._sprite._display.interactive = true;
        let events = this._rendererDisposers[key];
        if (events === undefined) {
            const disposer = this._sprite._display.on(key, (e) => {
                dispatch.call(this, e);
            });
            events = this._rendererDisposers[key] = new CounterDisposer(() => {
                delete this._rendererDisposers[key];
                disposer.dispose();
            });
        }
        return events.increment();
    }
    _on(once, type, callback, context, shouldClone, dispatch) {
        const info = super._on(once, type, callback, context, shouldClone, dispatch);
        const rendererEvent = SpriteEventDispatcher.RENDERER_EVENTS[type];
        if (rendererEvent !== undefined) {
            info.disposer = new MultiDisposer([
                info.disposer,
                this._onRenderer(type, rendererEvent),
            ]);
        }
        return info;
    }
    /**
     * Will stop any bubbling up of the event to element's parents.
     *
     * Should be called in an event handler, e.g.:
     *
     * ```TypeScript
     * element.events.on("pointerdown", function(ev) {
     *   // Do something here and prevent from "pointerdown" bubbling up
     *   // ...
     *   ev.target.events.stopParentDispatch();
     * });
     * ```
     * ```JavaScript
     * element.events.on("pointerdown", function(ev) {
     *   // Do something here and prevent from "pointerdown" bubbling up
     *   // ...
     *   ev.target.events.stopParentDispatch();
     * });
     * ```
     */
    stopParentDispatch() {
        this._dispatchParents = false;
    }
    /**
     * @ignore
     */
    dispatchParents(type, event) {
        const old = this._dispatchParents;
        this._dispatchParents = true;
        try {
            this.dispatch(type, event);
            if (this._dispatchParents && this._sprite.parent) {
                this._sprite.parent.events.dispatchParents(type, event);
            }
        }
        finally {
            this._dispatchParents = old;
        }
    }
}
Object.defineProperty(SpriteEventDispatcher, "RENDERER_EVENTS", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: {
        "click": function (event) {
            if (this.isEnabled("click") && !this._sprite.isDragging() && this._sprite._hasDown() && !this._sprite._hasMoved(this._makePointerEvent("click", event))) {
                this.dispatch("click", this._makePointerEvent("click", event));
            }
        },
        "rightclick": function (event) {
            if (this.isEnabled("rightclick")) {
                this.dispatch("rightclick", this._makePointerEvent("rightclick", event));
            }
        },
        "middleclick": function (event) {
            if (this.isEnabled("middleclick")) {
                this.dispatch("middleclick", this._makePointerEvent("middleclick", event));
            }
        },
        "dblclick": function (event) {
            this.dispatchParents("dblclick", this._makePointerEvent("dblclick", event));
        },
        "pointerover": function (event) {
            const sprite = this._sprite;
            let dispatch = true;
            if (sprite.getPrivate("trustBounds")) {
                sprite._getBounds();
                const bounds = sprite.globalBounds();
                if (!$math.inBounds(event.point, bounds)) {
                    dispatch = false;
                    sprite._root._renderer.removeHovering(sprite._display);
                }
            }
            if (dispatch && this.isEnabled("pointerover")) {
                this.dispatch("pointerover", this._makePointerEvent("pointerover", event));
            }
        },
        "pointerout": function (event) {
            if (this.isEnabled("pointerout")) {
                this.dispatch("pointerout", this._makePointerEvent("pointerout", event));
            }
        },
        "pointerdown": function (event) {
            this.dispatchParents("pointerdown", this._makePointerEvent("pointerdown", event));
        },
        "pointerup": function (event) {
            if (this.isEnabled("pointerup")) {
                this.dispatch("pointerup", this._makePointerEvent("pointerup", event));
            }
        },
        "globalpointerup": function (event) {
            if (this.isEnabled("globalpointerup")) {
                this.dispatch("globalpointerup", this._makePointerEvent("globalpointerup", event));
            }
        },
        "globalpointermove": function (event) {
            if (this.isEnabled("globalpointermove")) {
                this.dispatch("globalpointermove", this._makePointerEvent("globalpointermove", event));
            }
        },
        "wheel": function (event) {
            this.dispatchParents("wheel", {
                type: "wheel",
                target: this._sprite,
                originalEvent: event.event,
                point: event.point,
            });
        },
    }
});
/**
 * A base class for all visual elements.
 *
 * @important
 */
export class Sprite extends Entity {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "_adjustedLocalBounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { left: 0, right: 0, top: 0, bottom: 0 }
        });
        Object.defineProperty(this, "_localBounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: { left: 0, right: 0, top: 0, bottom: 0 }
        });
        Object.defineProperty(this, "_parent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_dataItem", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_templateField", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_sizeDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // Will be true only when dragging
        Object.defineProperty(this, "_isDragging", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        // The event when the dragging starts
        Object.defineProperty(this, "_dragEvent", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // The position when dragging starts
        Object.defineProperty(this, "_dragPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isHidden", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_isShowing", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_isHiding", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_isDown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_downPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_downPoints", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_toggleDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_dragDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltipDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_hoverDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_focusDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltipMoveDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltipPointerDp", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_statesHandled", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    _afterNew() {
        this.setPrivateRaw("visible", true);
        super._afterNew();
    }
    _markDirtyKey(key) {
        super._markDirtyKey(key);
        if (key == "x" || key == "y" || key == "dx" || key == "dy") {
            this.markDirtyBounds();
            this._addPercentagePositionChildren();
            this.markDirtyPosition();
        }
    }
    _markDirtyPrivateKey(key) {
        super._markDirtyPrivateKey(key);
        if (key == "x" || key == "y") {
            this.markDirtyPosition();
        }
    }
    _removeTemplateField() {
        if (this._templateField) {
            this._templateField._removeObjectTemplate(this);
        }
    }
    _createEvents() {
        return new SpriteEventDispatcher(this);
    }
    _processTemplateField() {
        let template;
        const field = this.get("templateField");
        if (field) {
            const dataItem = this.dataItem;
            if (dataItem) {
                const context = dataItem.dataContext;
                if (context) {
                    template = context[field];
                    if (!(template instanceof Template) && template) {
                        template = Template.new(template);
                    }
                }
            }
        }
        if (this._templateField !== template) {
            this._removeTemplateField();
            this._templateField = template;
            if (template) {
                template._setObjectTemplate(this);
            }
            this._applyTemplates();
        }
    }
    // TODO change this to run before the element is added to the parent, so that way
    //      it doesn't need to apply the themes twice
    _setDataItem(dataItem) {
        const oldDataItem = this._dataItem;
        this._dataItem = dataItem;
        this._processTemplateField();
        const eventType = "dataitemchanged";
        if (dataItem != oldDataItem) {
            if (this.events.isEnabled(eventType)) {
                this.events.dispatch(eventType, {
                    type: eventType,
                    target: this,
                    oldDataItem: oldDataItem,
                    newDataItem: dataItem
                });
            }
        }
    }
    /**
     * A [[DataItem]] used for this element.
     *
     * NOTE: data item is being assigned automatically in most cases where it
     * matters. Use this accessor to set data item only if you know what you're
     * doing.
     *
     * @param  value  Data item
     */
    set dataItem(value) {
        this._setDataItem(value);
    }
    /**
     * @return DataItem
     */
    get dataItem() {
        if (this._dataItem) {
            return this._dataItem;
        }
        else {
            let parent = this._parent;
            while (parent) {
                if (parent._dataItem) {
                    return parent._dataItem;
                }
                else {
                    parent = parent._parent;
                }
            }
        }
    }
    _addPercentageSizeChildren() {
        let parent = this.parent;
        if (parent) {
            if (this.get("width") instanceof Percent || this.get("height") instanceof Percent) {
                $array.pushOne(parent._percentageSizeChildren, this);
            }
            else {
                $array.removeFirst(parent._percentageSizeChildren, this);
            }
        }
    }
    _addPercentagePositionChildren() {
        let parent = this.parent;
        if (parent) {
            if (this.get("x") instanceof Percent || this.get("y") instanceof Percent) {
                $array.pushOne(parent._percentagePositionChildren, this);
            }
            else {
                $array.removeFirst(parent._percentagePositionChildren, this);
            }
        }
    }
    /**
     * @ignore
     */
    markDirtyPosition() {
        this._root._addDirtyPosition(this);
    }
    updatePivotPoint() {
        const bounds = this._localBounds;
        if (bounds) {
            const centerX = this.get("centerX");
            if (centerX != null) {
                this._display.pivot.x = bounds.left + $utils.relativeToValue(centerX, bounds.right - bounds.left);
            }
            const centerY = this.get("centerY");
            if (centerY != null) {
                this._display.pivot.y = bounds.top + $utils.relativeToValue(centerY, bounds.bottom - bounds.top);
            }
        }
    }
    _beforeChanged() {
        super._beforeChanged();
        // handling states in beforeChanged, otherwise states is not applied without animated theme
        this._handleStates();
        if (this.isDirty("tooltip")) {
            const previous = this._prevSettings.tooltip;
            if (previous) {
                previous.dispose();
            }
        }
        if (this.isDirty("layer") || this.isDirty("layerMargin")) {
            this._display.setLayer(this.get("layer"), this.get("layerMargin"));
            this.markDirtyLayer();
        }
        if (this.isDirty("tooltipPosition")) {
            const tooltipMoveDp = this._tooltipMoveDp;
            if (tooltipMoveDp) {
                tooltipMoveDp.dispose();
                this._tooltipMoveDp = undefined;
            }
            const tooltipPointerDp = this._tooltipPointerDp;
            if (tooltipPointerDp) {
                tooltipPointerDp.dispose();
                this._tooltipPointerDp = undefined;
            }
            if (this.get("tooltipPosition") == "pointer") {
                if (this.isHover()) {
                    this._tooltipMoveDp = this.events.on("globalpointermove", (e) => {
                        this.showTooltip(e.point);
                    });
                }
                this._tooltipPointerDp = new MultiDisposer([
                    this.events.on("pointerover", () => {
                        this._tooltipMoveDp = this.events.on("globalpointermove", (e) => {
                            this.showTooltip(e.point);
                        });
                    }),
                    this.events.on("pointerout", () => {
                        const tooltipMoveDp = this._tooltipMoveDp;
                        if (tooltipMoveDp) {
                            tooltipMoveDp.dispose();
                            this._tooltipMoveDp = undefined;
                        }
                    })
                ]);
            }
        }
    }
    _handleStates() {
        if (!this._statesHandled) {
            if (this.isDirty("active")) {
                if (this.get("active")) {
                    this.states.applyAnimate("active");
                    this.set("ariaChecked", true);
                }
                else {
                    if (!this.isHidden()) {
                        this.states.applyAnimate("default");
                    }
                    this.set("ariaChecked", false);
                }
                this.markDirtyAccessibility();
            }
            if (this.isDirty("disabled")) {
                if (this.get("disabled")) {
                    this.states.applyAnimate("disabled");
                    this.set("ariaChecked", false);
                }
                else {
                    if (!this.isHidden()) {
                        this.states.applyAnimate("default");
                    }
                    this.set("ariaChecked", true);
                }
                this.markDirtyAccessibility();
            }
            this._statesHandled = true;
        }
    }
    _changed() {
        super._changed();
        const display = this._display;
        const events = this.events;
        if (this.isDirty("draggable")) {
            const draggable = this.get("draggable");
            if (draggable) {
                this.set("interactive", true);
                this._dragDp = new MultiDisposer([
                    events.on("pointerdown", (ev) => {
                        this.dragStart(ev);
                    }),
                    events.on("globalpointermove", (ev) => {
                        this.dragMove(ev);
                    }),
                    events.on("globalpointerup", (ev) => {
                        this.dragStop(ev);
                    })
                ]);
            }
            else {
                if (this._dragDp) {
                    this._dragDp.dispose();
                    this._dragDp = undefined;
                }
            }
            display.cancelTouch = draggable ? true : false;
        }
        if (this.isDirty("tooltipText") || this.isDirty("tooltipHTML") || this.isDirty("showTooltipOn")) {
            const tooltipText = this.get("tooltipText");
            const tooltipHTML = this.get("tooltipHTML");
            const showTooltipOn = this.get("showTooltipOn", "hover");
            if (this._tooltipDp) {
                this._tooltipDp.dispose();
                this._tooltipDp = undefined;
            }
            if (tooltipText || tooltipHTML) {
                if (showTooltipOn == "click") {
                    this._tooltipDp = new MultiDisposer([
                        events.on("click", () => {
                            this.setTimeout(() => this.showTooltip(), 10);
                        }),
                        $utils.addEventListener(document, "click", (_ev) => {
                            this.hideTooltip();
                        })
                    ]);
                    this._disposers.push(this._tooltipDp);
                }
                else if (showTooltipOn == "always") {
                    // nothing
                }
                else {
                    this._tooltipDp = new MultiDisposer([
                        events.on("pointerover", () => {
                            this.showTooltip();
                        }),
                        events.on("pointerout", () => {
                            this.hideTooltip();
                        })
                    ]);
                    this._disposers.push(this._tooltipDp);
                }
            }
        }
        if (this.isDirty("toggleKey")) {
            let toggleKey = this.get("toggleKey");
            if (toggleKey && toggleKey != "none") {
                this._toggleDp = events.on("click", () => {
                    if (!this._isDragging) {
                        this.set(toggleKey, !this.get(toggleKey));
                    }
                });
            }
            else {
                if (this._toggleDp) {
                    this._toggleDp.dispose();
                    this._toggleDp = undefined;
                }
            }
        }
        if (this.isDirty("opacity")) {
            display.alpha = Math.max(0, this.get("opacity", 1));
            if (this.get("focusable")) {
                this.markDirtyAccessibility();
            }
        }
        if (this.isDirty("rotation")) {
            this.markDirtyBounds();
            display.angle = this.get("rotation", 0);
        }
        if (this.isDirty("scale")) {
            this.markDirtyBounds();
            display.scale = this.get("scale", 0);
        }
        if (this.isDirty("centerX") || this.isDirty("centerY")) {
            this.markDirtyBounds();
            this.updatePivotPoint();
        }
        if (this.isDirty("visible") || this.isPrivateDirty("visible") || this.isDirty("forceHidden")) {
            if (!this.get("visible") || !this.getPrivate("visible") || this.get("forceHidden")) {
                display.visible = false;
                this.hideTooltip();
            }
            else {
                display.visible = true;
            }
            this.markDirtyBounds();
            if (this.get("focusable")) {
                this.markDirtyAccessibility();
            }
        }
        if (this.isDirty("width") || this.isDirty("height")) {
            this.markDirtyBounds();
            this._addPercentageSizeChildren();
            const parent = this.parent;
            if (parent) {
                if ((this.isDirty("width") && this.get("width") instanceof Percent) || (this.isDirty("height") && this.get("height") instanceof Percent)) {
                    parent.markDirty();
                    parent._prevWidth = 0;
                }
            }
            this._sizeDirty = true;
        }
        if (this.isDirty("maxWidth") || this.isDirty("maxHeight") || this.isPrivateDirty("width") || this.isPrivateDirty("height") || this.isDirty("minWidth") || this.isDirty("minHeight") || this.isPrivateDirty("maxWidth") || this.isPrivateDirty("maxHeight") || this.isPrivateDirty("minWidth") || this.isPrivateDirty("minHeight")) {
            this.markDirtyBounds();
            this._sizeDirty = true;
        }
        if (this._sizeDirty) {
            this._updateSize();
        }
        if (this.isDirty("wheelable")) {
            const wheelable = this.get("wheelable");
            if (wheelable) {
                this.set("interactive", true);
            }
            display.wheelable = wheelable ? true : false;
        }
        // Accessibility
        if (this.isDirty("tabindexOrder") || this.isDirty("focusableGroup")) {
            if (this.get("focusable")) {
                this._root._registerTabindexOrder(this);
            }
            else {
                this._root._unregisterTabindexOrder(this);
            }
        }
        if (this.isDirty("filter")) {
            //this.markDirtyBounds();
            display.filter = this.get("filter");
        }
        let filter = this.get("filter", "");
        if (this.isDirty("blur")) {
            const blur = this.get("blur", 0);
            if (blur != 0) {
                filter += " blur(" + blur + "px)";
            }
        }
        if (this.isDirty("saturate")) {
            const saturate = this.get("saturate", 1);
            if (saturate != 1) {
                filter += " saturate(" + saturate + ")";
            }
        }
        if (this.isDirty("brightness")) {
            const brightness = this.get("brightness", 1);
            if (brightness != 1) {
                filter += " brightness(" + brightness + ")";
            }
        }
        if (this.isDirty("contrast")) {
            const contrast = this.get("contrast", 1);
            if (contrast != 1) {
                filter += " contrast(" + contrast + ")";
            }
        }
        if (this.isDirty("sepia")) {
            const sepia = this.get("sepia", 0);
            if (sepia != 0) {
                filter += " sepia(" + sepia + ")";
            }
        }
        if (this.isDirty("hue")) {
            const hue = this.get("hue", 0);
            if (hue != 0) {
                filter += " hue-rotate(" + hue + "deg)";
            }
        }
        if (this.isDirty("invert")) {
            const invert = this.get("invert", 0);
            if (invert != 0) {
                filter += " invert(" + invert + ")";
            }
        }
        if (filter) {
            display.filter = filter;
        }
        if (this.isDirty("cursorOverStyle")) {
            display.cursorOverStyle = this.get("cursorOverStyle");
        }
        if (this.isDirty("hoverOnFocus")) {
            if (this.get("hoverOnFocus")) {
                this._focusDp = new MultiDisposer([
                    events.on("focus", () => {
                        // TODO: proper hover, not just tooltip
                        this.showTooltip();
                    }),
                    events.on("blur", () => {
                        // TODO: proper hover, not just tooltip
                        this.hideTooltip();
                    })
                ]);
            }
            else {
                if (this._focusDp) {
                    this._focusDp.dispose();
                    this._focusDp = undefined;
                }
            }
        }
        if (this.isDirty("focusable")) {
            if (this.get("focusable")) {
                this._root._registerTabindexOrder(this);
            }
            else {
                this._root._unregisterTabindexOrder(this);
            }
            this.markDirtyAccessibility();
        }
        if (this.isPrivateDirty("focusable")) {
            this.markDirtyAccessibility();
        }
        if (this.isDirty("role") || this.isDirty("ariaLive") || this.isDirty("ariaChecked") || this.isDirty("ariaHidden") || this.isDirty("ariaOrientation") || this.isDirty("ariaValueNow") || this.isDirty("ariaValueMin") || this.isDirty("ariaValueMax") || this.isDirty("ariaValueText") || this.isDirty("ariaLabel") || this.isDirty("ariaControls")) {
            // display.accessibility.ariaLabel = populateString(this, this.get("ariaLabel", ""));
            // @todo make sure ariaLabel gets populated in Root
            this.markDirtyAccessibility();
        }
        if (this.isDirty("exportable")) {
            display.exportable = this.get("exportable");
        }
        if (this.isDirty("interactive")) {
            const events = this.events;
            if (this.get("interactive")) {
                this._hoverDp = new MultiDisposer([
                    events.on("click", (ev) => {
                        if ($utils.isTouchEvent(ev.originalEvent)) {
                            if (!this.getPrivate("touchHovering")) {
                                this.setTimeout(() => {
                                    this._handleOver();
                                    if (this.get("tooltipText") || this.get("tooltipHTML")) {
                                        this.showTooltip();
                                    }
                                    this.setPrivateRaw("touchHovering", true);
                                    this.events.dispatch("pointerover", {
                                        type: "pointerover",
                                        target: ev.target,
                                        originalEvent: ev.originalEvent,
                                        point: ev.point,
                                        simulated: ev.simulated
                                    });
                                }, 10);
                            }
                        }
                    }),
                    events.on("globalpointerup", (ev) => {
                        if ($utils.isTouchEvent(ev.originalEvent)) {
                            if (this.getPrivate("touchHovering")) {
                                this._handleOut();
                                if (this.get("tooltipText") || this.get("tooltipHTML")) {
                                    this.hideTooltip();
                                }
                                this.setPrivateRaw("touchHovering", false);
                                this.events.dispatch("pointerout", {
                                    type: "pointerout",
                                    target: ev.target,
                                    originalEvent: ev.originalEvent,
                                    point: ev.point,
                                    simulated: ev.simulated
                                });
                            }
                        }
                        if (this._isDown) {
                            this._handleUp(ev);
                        }
                        //this._isDown = false;
                    }),
                    events.on("pointerover", () => {
                        this._handleOver();
                    }),
                    events.on("pointerout", () => {
                        this._handleOut();
                    }),
                    events.on("pointerdown", (e) => {
                        this._handleDown(e);
                    })
                ]);
            }
            else {
                this._display.interactive = false;
                if (this._hoverDp) {
                    this._hoverDp.dispose();
                    this._hoverDp = undefined;
                }
            }
        }
        if (this.isDirty("forceInactive")) {
            this._display.inactive = this.get("forceInactive", null);
        }
        if (this.get("showTooltipOn") == "always" && this._display.visible) {
            this.showTooltip();
        }
    }
    /**
     * @ignore
     * @todo should this be user-accessible?
     */
    dragStart(e) {
        this._dragEvent = e;
        this.events.stopParentDispatch();
    }
    /**
     * @ignore
     * @todo should this be user-accessible?
     */
    dragStop(e) {
        this._dragEvent = undefined;
        this._dragPoint = undefined;
        this.events.stopParentDispatch();
        if (this._isDragging) {
            this._isDragging = false;
            const type = "dragstop";
            if (this.events.isEnabled(type)) {
                this.events.dispatch(type, {
                    type: type,
                    target: this,
                    originalEvent: e.originalEvent,
                    point: e.point,
                    simulated: e.simulated,
                });
            }
        }
    }
    _handleOver() {
        if (!this.isHidden()) {
            if (this.get("active") && this.states.lookup("hoverActive")) {
                this.states.applyAnimate("hoverActive");
            }
            else if (this.get("disabled") && this.states.lookup("hoverDisabled")) {
                this.states.applyAnimate("hoverDisabled");
            }
            else {
                this.states.applyAnimate("hover");
            }
            if (this.get("draggable") && this._isDown && this.states.lookup("down")) {
                this.states.applyAnimate("down");
            }
        }
    }
    _handleOut() {
        if (!this.isHidden()) {
            if (this.get("active") && this.states.lookup("active")) {
                this.states.applyAnimate("active");
            }
            else if (this.get("disabled") && this.states.lookup("disabled")) {
                this.states.applyAnimate("disabled");
            }
            else {
                if (this.states.lookup("hover") || this.states.lookup("hoverActive")) {
                    this.states.applyAnimate("default");
                }
            }
            if (this.get("draggable") && this._isDown && this.states.lookup("down")) {
                this.states.applyAnimate("down");
            }
        }
    }
    _handleUp(e) {
        if (!this.isHidden()) {
            if (this.get("active") && this.states.lookup("active")) {
                this.states.applyAnimate("active");
            }
            else if (this.get("disabled") && this.states.lookup("disabled")) {
                this.states.applyAnimate("disabled");
            }
            else if (this.states.lookup("down")) {
                if (this.isHover()) {
                    this.states.applyAnimate("hover");
                }
                else {
                    this.states.applyAnimate("default");
                }
            }
            // @todo remove this once migrated to _downPoints
            this._downPoint = undefined;
            const pointerId = $utils.getPointerId(e.originalEvent);
            delete this._downPoints[pointerId];
            if ($object.keys(this._downPoints).length == 0) {
                this._isDown = false;
            }
        }
    }
    _hasMoved(e) {
        // @todo remove this once migrated to _downPoints
        // if (this._downPoint) {
        // 	const x = Math.abs(this._downPoint.x - e.point.x);
        // 	const y = Math.abs(this._downPoint.y - e.point.y);
        // 	return (x > 5) || (y > 5);
        // }
        const pointerId = $utils.getPointerId(e.originalEvent);
        const downPoint = this._downPoints[pointerId];
        if (downPoint) {
            const x = Math.abs(downPoint.x - e.point.x);
            const y = Math.abs(downPoint.y - e.point.y);
            return (x > 5) || (y > 5);
        }
        return false;
    }
    _hasDown() {
        return $object.keys(this._downPoints).length > 0;
    }
    _handleDown(e) {
        const parent = this.parent;
        if (parent && !this.get("draggable")) {
            parent._handleDown(e);
        }
        if (this.get("interactive") && !this.isHidden()) {
            if (this.states.lookup("down")) {
                this.states.applyAnimate("down");
            }
            this._downPoint = {
                x: e.point.x,
                y: e.point.y
            };
            // @todo remove this once migrated to _downPoints
            this._isDown = true;
            const pointerId = $utils.getPointerId(e.originalEvent);
            this._downPoints[pointerId] = {
                x: e.point.x,
                y: e.point.y
            };
        }
    }
    /**
     * @ignore
     * @todo should this be user-accessible?
     */
    dragMove(e) {
        let dragEvent = this._dragEvent;
        if (dragEvent) {
            if (dragEvent.simulated && !e.simulated) {
                return true;
            }
            let angle = 0;
            let parent = this.parent;
            while (parent != null) {
                angle += parent.get("rotation", 0);
                parent = parent.parent;
            }
            let x = e.point.x - dragEvent.point.x;
            let y = e.point.y - dragEvent.point.y;
            const events = this.events;
            if (dragEvent.simulated && !this._isDragging) {
                this._isDragging = true;
                this._dragEvent = e;
                this._dragPoint = {
                    x: this.x(),
                    y: this.y()
                };
                const type = "dragstart";
                if (events.isEnabled(type)) {
                    events.dispatch(type, {
                        type: type,
                        target: this,
                        originalEvent: e.originalEvent,
                        point: e.point,
                        simulated: e.simulated,
                    });
                }
            }
            if (this._isDragging) {
                let dragPoint = this._dragPoint;
                this.set("x", dragPoint.x + x * $math.cos(angle) + y * $math.sin(angle));
                this.set("y", dragPoint.y + y * $math.cos(angle) - x * $math.sin(angle));
                const type = "dragged";
                if (events.isEnabled(type)) {
                    events.dispatch(type, {
                        type: type,
                        target: this,
                        originalEvent: e.originalEvent,
                        point: e.point,
                        simulated: e.simulated,
                    });
                }
            }
            else {
                if (Math.hypot(x, y) > 5) {
                    this._isDragging = true;
                    this._dragEvent = e;
                    this._dragPoint = {
                        x: this.x(),
                        y: this.y()
                    };
                    const type = "dragstart";
                    if (events.isEnabled(type)) {
                        events.dispatch(type, {
                            type: type,
                            target: this,
                            originalEvent: e.originalEvent,
                            point: e.point,
                            simulated: e.simulated
                        });
                    }
                }
            }
        }
    }
    _updateSize() {
    }
    _getBounds() {
        this._localBounds = this._display.getLocalBounds();
    }
    /**
     * Returns depth (how deep in the hierachy of the content tree) of this
     * element.
     *
     * @return Depth
     */
    depth() {
        let self = this.parent;
        let depth = 0;
        while (true) {
            if (self) {
                ++depth;
                self = self.parent;
            }
            else {
                return depth;
            }
        }
    }
    /**
     * @ignore
     */
    markDirtySize() {
        this._sizeDirty = true;
        this.markDirty();
    }
    /**
     * @ignore
     */
    markDirtyBounds() {
        const display = this._display;
        if (this.get("isMeasured")) {
            this._root._addDirtyBounds(this);
            display.isMeasured = true;
            display.invalidateBounds();
            const parent = this.parent;
            if (parent && this.get("position") != "absolute") {
                if (parent.get("width") == null || parent.get("height") == null || parent.get("layout")) {
                    parent.markDirtyBounds();
                }
            }
            if (this.get("focusable") && this.isFocus()) {
                this.markDirtyAccessibility();
            }
        }
    }
    /**
     * @ignore
     */
    markDirtyAccessibility() {
        //if (this._root.focused(this)) {
        this._root._invalidateAccessibility(this);
        //}
    }
    /**
     * @ignore
     */
    markDirtyLayer() {
        //this._display.markDirtyLayer(this.isDirty("opacity") || this.isDirty("visible")); https://codepen.io/team/amcharts/pen/gOWZPmP <- problems
        this._display.markDirtyLayer(true);
    }
    /**
     * @ignore
     */
    markDirty() {
        super.markDirty();
        this.markDirtyLayer();
    }
    _updateBounds() {
        const oldBounds = this._adjustedLocalBounds;
        let newBounds;
        // if display.visible == false, it still returns bounds
        if (!this.get("visible") || !this.getPrivate("visible") || this.get("forceHidden")) {
            newBounds = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            this._localBounds = newBounds;
            this._adjustedLocalBounds = newBounds;
        }
        else {
            this._getBounds();
            this._fixMinBounds(this._localBounds);
            this.updatePivotPoint();
            this._adjustedLocalBounds = this._display.getAdjustedBounds(this._localBounds);
            newBounds = this._adjustedLocalBounds;
        }
        if (!oldBounds || (oldBounds.left !== newBounds.left || oldBounds.top !== newBounds.top || oldBounds.right !== newBounds.right || oldBounds.bottom !== newBounds.bottom)) {
            const eventType = "boundschanged";
            if (this.events.isEnabled(eventType)) {
                this.events.dispatch(eventType, { type: eventType, target: this });
            }
            if (this.parent) {
                this.parent.markDirty();
                this.parent.markDirtyBounds();
            }
        }
    }
    _fixMinBounds(bounds) {
        let minWidth = this.get("minWidth", this.getPrivate("minWidth"));
        let minHeight = this.get("minHeight", this.getPrivate("minHeight"));
        if ($type.isNumber(minWidth)) {
            if (bounds.right - bounds.left < minWidth) {
                bounds.right = bounds.left + minWidth;
            }
        }
        if ($type.isNumber(minHeight)) {
            if (bounds.bottom - bounds.top < minHeight) {
                bounds.bottom = bounds.top + minHeight;
            }
        }
        let privateWidth = this.getPrivate("width");
        let privateHeight = this.getPrivate("height");
        if ($type.isNumber(privateWidth)) {
            if (privateWidth > 0) {
                bounds.right = bounds.left + privateWidth;
            }
            else {
                bounds.left = bounds.right + privateWidth;
            }
        }
        if ($type.isNumber(privateHeight)) {
            if (privateHeight > 0) {
                bounds.bottom = bounds.top + privateHeight;
            }
            else {
                bounds.top = bounds.bottom + privateHeight;
            }
        }
    }
    _removeParent(parent) {
        if (parent) {
            parent.children.removeValue(this);
            $array.removeFirst(parent._percentageSizeChildren, this);
            $array.removeFirst(parent._percentagePositionChildren, this);
        }
    }
    _clearDirty() {
        super._clearDirty();
        this._sizeDirty = false;
        this._statesHandled = false;
    }
    /**
     * Simulate hover over element.
     */
    hover() {
        this.showTooltip();
        this._handleOver();
    }
    /**
     * Simulate unhover over element.
     */
    unhover() {
        this.hideTooltip();
        this._handleOut();
    }
    /**
     * Shows element's [[Tooltip]].
     */
    showTooltip(point) {
        const tooltip = this.getTooltip();
        const tooltipText = this.get("tooltipText");
        const tooltipHTML = this.get("tooltipHTML");
        if ((tooltipText || tooltipHTML) && tooltip) {
            const tooltipPosition = this.get("tooltipPosition");
            const tooltipTarget = this.getPrivate("tooltipTarget", this);
            if (tooltipPosition == "fixed" || !point) {
                this._display._setMatrix();
                point = this.toGlobal(tooltipTarget._getTooltipPoint());
            }
            tooltip.set("pointTo", point);
            tooltip.set("tooltipTarget", tooltipTarget);
            if (!tooltip.get("x")) {
                tooltip.set("x", point.x);
            }
            if (!tooltip.get("y")) {
                tooltip.set("y", point.y);
            }
            if (tooltipText) {
                tooltip.label.set("text", tooltipText);
            }
            if (tooltipHTML) {
                tooltip.label.set("html", tooltipHTML);
            }
            const dataItem = this.dataItem;
            if (dataItem) {
                tooltip.label._setDataItem(dataItem);
            }
            if (this.get("showTooltipOn") == "always" && (point.x < 0 || point.x > this._root.width() || point.y < 0 || point.y > this._root.height())) {
                this.hideTooltip();
                return;
            }
            tooltip.label.text.markDirtyText();
            const promise = tooltip.show();
            this.setPrivateRaw("showingTooltip", true);
            return promise;
        }
    }
    /**
     * Hides element's [[Tooltip]].
     */
    hideTooltip() {
        const tooltip = this.getTooltip();
        if (tooltip) {
            if (tooltip.get("tooltipTarget") == this.getPrivate("tooltipTarget", this) || this.get("tooltip") == tooltip) {
                let timeout = tooltip.get("keepTargetHover") && tooltip.get("stateAnimationDuration", 0) == 0 ? 400 : undefined;
                const promise = tooltip.hide(timeout);
                this.setPrivateRaw("showingTooltip", false);
                return promise;
            }
        }
    }
    _getTooltipPoint() {
        const bounds = this._localBounds;
        if (bounds) {
            let x = 0;
            let y = 0;
            if (!this.get("isMeasured")) {
                x = $utils.relativeToValue(this.get("tooltipX", 0), this.width());
                y = $utils.relativeToValue(this.get("tooltipY", 0), this.height());
            }
            else {
                x = bounds.left + $utils.relativeToValue(this.get("tooltipX", 0), bounds.right - bounds.left);
                y = bounds.top + $utils.relativeToValue(this.get("tooltipY", 0), bounds.bottom - bounds.top);
            }
            return { x, y };
        }
        return { x: 0, y: 0 };
    }
    /**
     * Returns [[Tooltip]] used for this element.
     *
     * @return Tooltip
     */
    getTooltip() {
        let tooltip = this.get("tooltip");
        if (!tooltip) {
            let parent = this.parent;
            if (parent) {
                return parent.getTooltip();
            }
        }
        else {
            return tooltip;
        }
    }
    _updatePosition() {
        const parent = this.parent;
        let dx = this.get("dx", 0);
        let dy = this.get("dy", 0);
        let x = this.get("x");
        let _x = this.getPrivate("x");
        let xx = 0;
        let yy = 0;
        const position = this.get("position");
        if (x instanceof Percent) {
            if (parent) {
                x = parent.innerWidth() * x.value + parent.get("paddingLeft", 0);
            }
            else {
                x = 0;
            }
        }
        if ($type.isNumber(x)) {
            xx = x + dx;
        }
        else {
            if (_x != null) {
                xx = _x;
            }
            else if (parent) {
                if (position == "relative") {
                    xx = parent.get("paddingLeft", 0) + dx;
                }
            }
        }
        let y = this.get("y");
        let _y = this.getPrivate("y");
        if (y instanceof Percent) {
            if (parent) {
                y = parent.innerHeight() * y.value + parent.get("paddingTop", 0);
            }
            else {
                y = 0;
            }
        }
        if ($type.isNumber(y)) {
            yy = y + dy;
        }
        else {
            if (_y != null) {
                yy = _y;
            }
            else if (parent) {
                if (position == "relative") {
                    yy = parent.get("paddingTop", 0) + dy;
                }
            }
        }
        const display = this._display;
        if (display.x != xx || display.y != yy) {
            display.invalidateBounds();
            display.x = xx;
            display.y = yy;
            const eventType = "positionchanged";
            if (this.events.isEnabled(eventType)) {
                this.events.dispatch(eventType, { type: eventType, target: this });
            }
        }
        // Update tooltip position together with the Sprite
        if (this.getPrivate("showingTooltip")) {
            this.showTooltip();
        }
    }
    /**
     * Returns element's actual X position in pixels.
     *
     * @return X (px)
     */
    x() {
        let x = this.get("x");
        let _x = this.getPrivate("x");
        const parent = this.parent;
        if (parent) {
            if (x instanceof Percent) {
                return $utils.relativeToValue(x, parent.innerWidth()) + parent.get("paddingLeft", 0);
            }
            else {
                if (!$type.isNumber(x)) {
                    if (_x != null) {
                        return _x;
                    }
                    else {
                        return parent.get("paddingLeft", this._display.x);
                    }
                }
                else {
                    return x;
                }
            }
        }
        return this._display.x;
    }
    /**
     * Returns element's actual Y position in pixels.
     *
     * @return Y (px)
     */
    y() {
        let _y = this.getPrivate("y");
        if (_y != null) {
            return _y;
        }
        let y = this.get("y");
        const parent = this.parent;
        if (parent) {
            if (y instanceof Percent) {
                return $utils.relativeToValue(y, parent.innerHeight()) + parent.get("paddingTop", 0);
            }
            else {
                if (!$type.isNumber(y)) {
                    if (_y != null) {
                        return _y;
                    }
                    else {
                        return parent.get("paddingTop", this._display.y);
                    }
                }
                else {
                    return y;
                }
            }
        }
        return this._display.y;
    }
    _dispose() {
        super._dispose();
        this._display.dispose();
        this._removeTemplateField();
        this._removeParent(this.parent);
        this._root._removeFocusElement(this);
        const tooltip = this.get("tooltip");
        if (tooltip) {
            tooltip.dispose();
        }
        this.markDirty();
    }
    /**
     * @ignore
     */
    adjustedLocalBounds() {
        this._fixMinBounds(this._adjustedLocalBounds);
        return this._adjustedLocalBounds;
    }
    /**
     * Returns local coordinates of the element's bounds.
     *
     * @ignore
     * @return Global bounds
     */
    localBounds() {
        return this._localBounds;
    }
    /**
     * Returns adjusted local coordinates of the element's bounds.
     *
     * @ignore
     * @return Global bounds
     */
    bounds() {
        const bounds = this._adjustedLocalBounds;
        const x = this.x();
        const y = this.y();
        return { left: bounds.left + x, right: bounds.right + x, top: bounds.top + y, bottom: bounds.bottom + y };
    }
    /**
     * Returns global coordinates of the element's bounds.
     *
     * @ignore
     * @return Global bounds
     */
    globalBounds() {
        const bounds = this.localBounds();
        const p0 = this.toGlobal({ x: bounds.left, y: bounds.top });
        const p1 = this.toGlobal({ x: bounds.right, y: bounds.top });
        const p2 = this.toGlobal({ x: bounds.right, y: bounds.bottom });
        const p3 = this.toGlobal({ x: bounds.left, y: bounds.bottom });
        return {
            left: Math.min(p0.x, p1.x, p2.x, p3.x),
            top: Math.min(p0.y, p1.y, p2.y, p3.y),
            right: Math.max(p0.x, p1.x, p2.x, p3.x),
            bottom: Math.max(p0.y, p1.y, p2.y, p3.y)
        };
    }
    _onShow(_duration) {
    }
    _onHide(_duration) {
    }
    /**
     * Plays initial reveal animation regardless if element is currently hidden
     * or visible.
     *
     * @param   duration  Duration of the animation in milliseconds
     * @param   delay     Delay showing of the element by X milliseconds
     * @return            Promise
     */
    appear(duration, delay) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.hide(0);
            if (delay) {
                return new Promise((success, _error) => {
                    this.setTimeout(() => {
                        success(this.show(duration));
                    }, delay);
                });
            }
            else {
                return this.show(duration);
            }
        });
    }
    /**
     * Shows currently hidden element and returns a `Promise` which completes
     * when all showing animations are finished.
     *
     * ```TypeScript
     * series.show().then(function(ev) {
     *   console.log("Series is now fully visible");
     * })
     * ```
     * ```JavaScript
     * series.show().then(function(ev) {
     *   console.log("Series is now fully visible");
     * })
     * ```
     *
     * @return Promise
     */
    show(duration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isShowing) {
                this._isHidden = false;
                this._isShowing = true;
                this._isHiding = false;
                if (this.states.lookup("default").get("visible")) {
                    this.set("visible", true);
                }
                this._onShow(duration);
                const animations = this.states.applyAnimate("default", duration);
                yield waitForAnimations(animations);
                this._isShowing = false;
            }
        });
    }
    /**
     * Hides the element and returns a `Promise` which completes when all hiding
     * animations are finished.
     *
     * ```TypeScript
     * series.hide().then(function(ev) {
     *   console.log("Series finished hiding");
     * })
     * ```
     * ```JavaScript
     * series.hide().then(function(ev) {
     *   console.log("Series finished hiding");
     * })
     * ```
     *
     * @return Promise
     */
    hide(duration) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isHiding && !this._isHidden) {
                this._isHiding = true;
                this._isShowing = false;
                let state = this.states.lookup("hidden");
                if (!state) {
                    state = this.states.create("hidden", {
                        "opacity": 0,
                        "visible": false
                    });
                }
                this._isHidden = true;
                this._onHide(duration);
                const animations = this.states.applyAnimate("hidden", duration);
                yield waitForAnimations(animations);
                this._isHiding = false;
            }
        });
    }
    /**
     * Returns `true` if this element is currently hidden.
     *
     * @return Is hidden?
     */
    isHidden() {
        return this._isHidden;
    }
    /**
     * Returns `true` if this element is currently animating to a default state.
     *
     * @return Is showing?
     */
    isShowing() {
        return this._isShowing;
    }
    /**
     * Returns `true` if this element is currently animating to a hidden state.
     *
     * @return Is hiding?
     */
    isHiding() {
        return this._isHiding;
    }
    /**
     * Returns `true` if this element is currently hovered by a pointer.
     *
     * @return Is hovered?
     */
    isHover() {
        return this._display.hovering();
    }
    /**
     * Returns `true` if this element does currently have focus.
     *
     * @return Is focused?
     */
    isFocus() {
        return this._root.focused(this);
    }
    /**
     * Returns `true` if this element is currently being dragged.
     *
     * @return Is dragged?
     */
    isDragging() {
        return this._isDragging;
    }
    /**
     * Returns `false` if if either public or private setting `visible` is set
     * to `false`, or `forceHidden` is set to `true`.
     *
     * @return Visible?
     */
    isVisible() {
        if (this.get("visible") && this.getPrivate("visible") && !this.get("forceHidden")) {
            return true;
        }
        return false;
    }
    /**
     * Same as `isVisible()`, except it checks all ascendants, too.
     *
     * @since 5.2.7
     * @return Visible?
     */
    isVisibleDeep() {
        return this._parent ? (this._parent.isVisibleDeep() && this.isVisible()) : this.isVisible();
    }
    /**
     * Returns an actual opacity of the element, taking into account all parents.
     *
     * @return Opacity
     * @since 5.2.11
     */
    compositeOpacity() {
        const opacity = this.get("opacity", 1);
        return this._parent ? (this._parent.compositeOpacity() * opacity) : opacity;
    }
    /**
     * Returns width of this element in pixels.
     *
     * @return Width (px)
     */
    width() {
        let width = this.get("width");
        let maxWidth = this.get("maxWidth", this.getPrivate("maxWidth"));
        let minWidth = this.get("minWidth", this.getPrivate("minWidth"));
        let privateWidth = this.getPrivate("width");
        let w = 0;
        if ($type.isNumber(privateWidth)) {
            w = privateWidth;
        }
        else {
            if (width == null) {
                if (this._adjustedLocalBounds) {
                    w = this._adjustedLocalBounds.right - this._adjustedLocalBounds.left;
                }
            }
            else {
                if (width instanceof Percent) {
                    const parent = this.parent;
                    if (parent) {
                        w = parent.innerWidth() * width.value;
                    }
                    else {
                        w = this._root.width() * width.value;
                    }
                }
                else if ($type.isNumber(width)) {
                    w = width;
                }
            }
        }
        if ($type.isNumber(minWidth)) {
            w = Math.max(minWidth, w);
        }
        if ($type.isNumber(maxWidth)) {
            w = Math.min(maxWidth, w);
        }
        return w;
    }
    /**
     * Returns maximum allowed width of this element in pixels.
     *
     * @return Maximum width (px)
     */
    maxWidth() {
        let maxWidth = this.get("maxWidth", this.getPrivate("maxWidth"));
        if ($type.isNumber(maxWidth)) {
            return maxWidth;
        }
        else {
            let width = this.get("width");
            if ($type.isNumber(width)) {
                return width;
            }
        }
        const parent = this.parent;
        if (parent) {
            return parent.innerWidth();
        }
        return this._root.width();
    }
    /**
     * Returns maximum allowed height of this element in pixels.
     *
     * @return Maximum height (px)
     */
    maxHeight() {
        let maxHeight = this.get("maxHeight", this.getPrivate("maxHeight"));
        if ($type.isNumber(maxHeight)) {
            return maxHeight;
        }
        else {
            let height = this.get("height");
            if ($type.isNumber(height)) {
                return height;
            }
        }
        const parent = this.parent;
        if (parent) {
            return parent.innerHeight();
        }
        return this._root.height();
    }
    /**
     * Returns height of this element in pixels.
     *
     * @return Height (px)
     */
    height() {
        let height = this.get("height");
        let maxHeight = this.get("maxHeight", this.getPrivate("maxHeight"));
        let minHeight = this.get("minHeight", this.getPrivate("minHeight"));
        let privateHeight = this.getPrivate("height");
        let h = 0;
        if ($type.isNumber(privateHeight)) {
            h = privateHeight;
        }
        else {
            if (height == null) {
                if (this._adjustedLocalBounds) {
                    h = this._adjustedLocalBounds.bottom - this._adjustedLocalBounds.top;
                }
            }
            else {
                if (height instanceof Percent) {
                    const parent = this.parent;
                    if (parent) {
                        h = parent.innerHeight() * height.value;
                    }
                    else {
                        h = this._root.height() * height.value;
                    }
                }
                else if ($type.isNumber(height)) {
                    h = height;
                }
            }
        }
        if ($type.isNumber(minHeight)) {
            h = Math.max(minHeight, h);
        }
        if ($type.isNumber(maxHeight)) {
            h = Math.min(maxHeight, h);
        }
        return h;
    }
    _findStaticTemplate(f) {
        // templateField overrides template
        if (this._templateField && f(this._templateField)) {
            return this._templateField;
        }
        return super._findStaticTemplate(f);
    }
    _walkParents(f) {
        if (this._parent) {
            this._walkParent(f);
        }
    }
    _walkParent(f) {
        if (this._parent) {
            this._parent._walkParent(f);
        }
        f(this);
    }
    /**
     * Parent [[Container]] of this element.
     *
     * @return Parent container
     */
    get parent() {
        return this._parent;
    }
    _setParent(parent, updateChildren = false) {
        const prevParent = this._parent;
        if (parent !== prevParent) {
            this.markDirtyBounds();
            parent.markDirty();
            this._parent = parent;
            if (updateChildren) {
                this._removeParent(prevParent);
                if (parent) {
                    this._addPercentageSizeChildren();
                    this._addPercentagePositionChildren();
                }
            }
            this.markDirtyPosition();
            this._applyThemes();
        }
    }
    /**
     * Returns an instance of [[NumberFormatter]] used in this element.
     *
     * If this element does not have it set, global one form [[Root]] is used.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     * @return NumberFormatter instace
     */
    getNumberFormatter() {
        return this.get("numberFormatter", this._root.numberFormatter);
    }
    /**
     * Returns an instance of [[DateFormatter]] used in this element.
     *
     * If this element does not have it set, global one form [[Root]] is used.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     * @return DateFormatter instace
     */
    getDateFormatter() {
        return this.get("dateFormatter", this._root.dateFormatter);
    }
    /**
     * Returns an instance of [[DurationFormatter]] used in this element.
     *
     * If this element does not have it set, global one form [[Root]] is used.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     * @return DurationFormatter instace
     */
    getDurationFormatter() {
        return this.get("durationFormatter", this._root.durationFormatter);
    }
    /**
     * Converts X/Y coordinate within this element to a global coordinate.
     *
     * @param  point  Local coordinate
     * @return        Global coordinate
     */
    toGlobal(point) {
        return this._display.toGlobal(point);
    }
    /**
     * Converts global X/Y coordinate to a coordinate within this element.
     *
     * @param  point  Global coordinate
     * @return        Local coordinate
     */
    toLocal(point) {
        return this._display.toLocal(point);
    }
    _getDownPoint() {
        const id = this._getDownPointId();
        if (id) {
            return this._downPoints[id];
        }
    }
    _getDownPointId() {
        if (this._downPoints) {
            return $object.keysOrdered(this._downPoints, (a, b) => {
                if (a > b) {
                    return 1;
                }
                if (a < b) {
                    return -1;
                }
                return 0;
            })[0];
        }
    }
    /**
     * Moves sprite to the end of the parent's children array.
     *
     * Depending on `layout` setting of the parten container, it may effect the
     * positioning or overlapping order of the elements.
     */
    toFront() {
        const parent = this.parent;
        if (parent) {
            parent.children.moveValue(this, parent.children.length - 1);
        }
    }
    /**
     * Moves sprite to the beginning of the parent's children array.
     *
     * Depending on `layout` setting of the parten container, it may effect the
     * positioning or overlapping order of the elements.
     */
    toBack() {
        const parent = this.parent;
        if (parent) {
            parent.children.moveValue(this, 0);
        }
    }
}
Object.defineProperty(Sprite, "className", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: "Sprite"
});
Object.defineProperty(Sprite, "classNames", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: Entity.classNames.concat([Sprite.className])
});
//# sourceMappingURL=Sprite.js.map