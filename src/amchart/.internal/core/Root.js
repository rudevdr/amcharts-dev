import { Container } from "./render/Container";
import { Text } from "./render/Text";
import { HorizontalLayout } from "./render/HorizontalLayout";
import { VerticalLayout } from "./render/VerticalLayout";
import { GridLayout } from "./render/GridLayout";
import { Disposer } from "./util/Disposer";
import { ResizeSensor } from "./util/ResizeSensor";
import { InterfaceColors } from "./util/InterfaceColors";
import { Graphics } from "./render/Graphics";
import { Rectangle } from "./render/Rectangle";
import { Tooltip } from "./render/Tooltip";
import { NumberFormatter } from "./util/NumberFormatter";
import { DateFormatter } from "./util/DateFormatter";
import { DurationFormatter } from "./util/DurationFormatter";
import { Language } from "./util/Language";
import { EventDispatcher } from "./util/EventDispatcher";
import { DefaultTheme } from "../themes/DefaultTheme";
import { CanvasRenderer } from "./render/backend/CanvasRenderer";
import { p100, percent } from "./util/Percent";
import { color } from "./util/Color";
import { populateString } from "./util/PopulateString";
import { registry } from "./Registry";
import * as $order from "./util/Order";
import * as $array from "./util/Array";
import * as $object from "./util/Object";
import * as $utils from "./util/Utils";
import * as $type from "./util/Type";
import en from "../../locales/en";
function rAF(fps, callback) {
    if (fps == null) {
        requestAnimationFrame(callback);
    }
    else {
        setTimeout(() => {
            requestAnimationFrame(callback);
        }, 1000 / fps);
    }
}
// TODO implement Disposer
/**
 * Root element of the chart.
 *
 * @see {@link https://www.amcharts.com/docs/v5/getting-started/#Root_element} for more info
 */
export class Root {
    constructor(id, settings = {}, isReal) {
        /**
         * A reference to original chart container (div element).
         */
        Object.defineProperty(this, "dom", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_inner", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_settings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_isDirtyParents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_dirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_dirtyParents", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_dirtyBounds", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_dirtyPositions", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {}
        });
        Object.defineProperty(this, "_ticker", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_tickers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_updateTick", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        /**
         * Root's event dispatcher.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/events/} for more info
         */
        Object.defineProperty(this, "events", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new EventDispatcher()
        });
        /**
         * @ignore
         * @todo needs description
         */
        Object.defineProperty(this, "animationTime", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "_animations", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_renderer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_rootContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Main content container.
         */
        Object.defineProperty(this, "container", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * A [[Container]] used to display tooltips in.
         */
        Object.defineProperty(this, "tooltipContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltipContainerSettings", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltip", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        // Locale-related
        /**
         * @ignore
         */
        Object.defineProperty(this, "language", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Language.new(this, {})
        });
        /**
         * Locale used by the chart.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/locales/}
         */
        Object.defineProperty(this, "locale", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: en
        });
        // Date-time related
        /**
         * Use UTC when formatting date/time.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-dates/#utc-and-time-zones} for more info
         */
        Object.defineProperty(this, "utc", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * If set, will format date/time in specific time zone.
         *
         * The value should be named time zone, e.g.:
         * `"America/Vancouver"`, `"Australia/Sydney"`, `"UTC"`.
         *
         * NOTE: Using time zone feature may noticeable affect performance of the
         * chart, especially with large data sets, since every single date will need
         * to be recalculated.
         *
         * @see {@link https://www.amcharts.com/docs/v5/getting-started/root-element/#time-zone} for more info
         * @since 5.1.0
         */
        Object.defineProperty(this, "timezone", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * The maximum FPS that the Root will run at.
         *
         * If `undefined` it will run at the highest FPS.
         *
         * @see {@link https://www.amcharts.com/docs/v5/getting-started/root-element/#Performance} for more info
         */
        Object.defineProperty(this, "fps", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Number formatter.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/} for more info
         */
        Object.defineProperty(this, "numberFormatter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: NumberFormatter.new(this, {})
        });
        /**
         * Date/time formatter.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-dates/} for more info
         */
        Object.defineProperty(this, "dateFormatter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: DateFormatter.new(this, {})
        });
        /**
         * Duration formatter.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-dates/} for more info
         */
        Object.defineProperty(this, "durationFormatter", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: DurationFormatter.new(this, {})
        });
        // Accessibility
        /**
         * Global tab index for using for the whole chart
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/accessibility/} for more info
         */
        Object.defineProperty(this, "tabindex", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        //@todo maybe make this better
        Object.defineProperty(this, "_tabindexes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_a11yD", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_focusElementDirty", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_focusElementContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_focusedSprite", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_isShift", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_keyboardDragPoint", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltipElementContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_readerAlertElement", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_logo", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltipDiv", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Used for dynamically-created CSS and JavaScript with strict source policies.
         */
        Object.defineProperty(this, "nonce", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * Special color set to be used for various controls.
         *
         * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/#Interface_colors} for more info
         */
        Object.defineProperty(this, "interfaceColors", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * An instance of vertical layout object that can be used to set `layout` setting
         * of a [[Container]].
         *
         * @default VerticalLayout.new()
         */
        Object.defineProperty(this, "verticalLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: VerticalLayout.new(this, {})
        });
        /**
         * An instance of horizontal layout object that can be used to set `layout` setting
         * of a [[Container]].
         *
         * @default HorizontalLayout.new()
         */
        Object.defineProperty(this, "horizontalLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: HorizontalLayout.new(this, {})
        });
        /**
         * An instance of grid layout object that can be used to set `layout` setting
         * of a [[Container]].
         *
         * @default VerticalLayout.new()
         */
        Object.defineProperty(this, "gridLayout", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: GridLayout.new(this, {})
        });
        Object.defineProperty(this, "_paused", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        /**
         * Indicates whether chart should resized automatically when parent container
         * width and/or height changes.
         *
         * If disabled (`autoResize = false`) you can make the chart resize manually
         * by calling root element's `resize()` method.
         */
        Object.defineProperty(this, "autoResize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
        Object.defineProperty(this, "_fontHash", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ""
        });
        Object.defineProperty(this, "_isDisposed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "_disposers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_resizeSensorDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_tooltips", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "_htmlElementContainer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "_htmlEnabledContainers", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        if (!isReal) {
            throw new Error("You cannot use `new Class()`, instead use `Class.new()`");
        }
        this._settings = settings;
        if (settings.accessible == false) {
            this._a11yD = true;
        }
        if (settings.useSafeResolution == null) {
            settings.useSafeResolution = true;
        }
        let resolution;
        if (settings.useSafeResolution) {
            resolution = $utils.getSafeResolution();
        }
        this._renderer = new CanvasRenderer(resolution);
        let dom;
        if (id instanceof HTMLElement) {
            dom = id;
        }
        else {
            dom = document.getElementById(id);
        }
        $array.each(registry.rootElements, (root) => {
            if (root.dom === dom) {
                throw new Error("You cannot have multiple Roots on the same DOM node");
            }
        });
        this.interfaceColors = InterfaceColors.new(this, {});
        if (dom === null) {
            throw new Error("Could not find HTML element with id `" + id + "`");
        }
        this.dom = dom;
        let inner = document.createElement("div");
        inner.style.position = "relative";
        inner.style.width = "100%";
        inner.style.height = "100%";
        dom.appendChild(inner);
        const tooltipContainerBounds = settings.tooltipContainerBounds;
        if (tooltipContainerBounds) {
            this._tooltipContainerSettings = tooltipContainerBounds;
        }
        this._inner = inner;
        this._updateComputedStyles();
        registry.rootElements.push(this);
    }
    static new(id, settings) {
        const root = new Root(id, settings, true);
        root._init();
        return root;
    }
    moveDOM(id) {
        let dom;
        if (id instanceof HTMLElement) {
            dom = id;
        }
        else {
            dom = document.getElementById(id);
        }
        if (dom) {
            while (this.dom.childNodes.length > 0) {
                dom.appendChild(this.dom.childNodes[0]);
            }
            this.dom = dom;
            this._initResizeSensor();
            this.resize();
        }
    }
    _handleLogo() {
        if (this._logo) {
            const w = this.dom.offsetWidth;
            const h = this.dom.offsetHeight;
            if ((w <= 150) || (h <= 60)) {
                this._logo.hide();
            }
            else {
                this._logo.show();
            }
        }
    }
    _showBranding() {
        if (!this._logo) {
            const logo = this.tooltipContainer.children.push(Container.new(this, {
                interactive: true,
                interactiveChildren: false,
                position: "absolute",
                setStateOnChildren: true,
                paddingTop: 9,
                paddingRight: 9,
                paddingBottom: 9,
                paddingLeft: 9,
                scale: .6,
                y: percent(100),
                centerY: p100,
                tooltipText: "Created using amCharts 5",
                tooltipX: p100,
                cursorOverStyle: "pointer",
                background: Rectangle.new(this, {
                    fill: color(0x474758),
                    fillOpacity: 0,
                    tooltipY: 5
                })
            }));
            const tooltip = Tooltip.new(this, {
                pointerOrientation: "horizontal",
                paddingTop: 4,
                paddingRight: 7,
                paddingBottom: 4,
                paddingLeft: 7
            });
            tooltip.label.setAll({
                fontSize: 12
            });
            tooltip.get("background").setAll({
                fill: this.interfaceColors.get("background"),
                stroke: this.interfaceColors.get("grid"),
                strokeOpacity: 0.3
            });
            logo.set("tooltip", tooltip);
            logo.events.on("click", () => {
                window.open("https://www.amcharts.com/", "_blank");
            });
            logo.states.create("hover", {});
            const m = logo.children.push(Graphics.new(this, {
                stroke: color(0xcccccc),
                strokeWidth: 3,
                svgPath: "M5 25 L13 25h13.6c3.4 0 6 0 10.3-4.3s5.2-12 8.6-12c3.4 0 4.3 8.6 7.7 8.6M83.4 25H79.8c-3.4 0-6 0-10.3-4.3s-5.2-12-8.6-12-4.3 8.6-7.7 8.6"
            }));
            m.states.create("hover", { stroke: color(0x3CABFF) });
            const a = logo.children.push(Graphics.new(this, {
                stroke: color(0x888888),
                strokeWidth: 3,
                svgPath: "M83.4 25h-31C37 25 39.5 4.4 28.4 4.4S18.9 24.2 4.3 25H0"
            }));
            a.states.create("hover", { stroke: color(0x474758) });
            //logo.set("tooltip", this._tooltip);
            //logo.setPrivate("tooltipTarget", logo.get("background"));
            this._logo = logo;
            this._handleLogo();
        }
    }
    _getRealSize() {
        return this.dom.getBoundingClientRect();
    }
    _getCalculatedSize(rect) {
        if (this._settings.calculateSize) {
            return this._settings.calculateSize(rect);
        }
        else {
            return {
                width: rect.width,
                height: rect.height,
            };
        }
    }
    _init() {
        const settings = this._settings;
        if (settings.accessible !== false) {
            if (settings.focusable) {
                this._inner.setAttribute("focusable", "true");
                this._inner.setAttribute("tabindex", this.tabindex + "");
            }
            if (settings.ariaLabel) {
                this._inner.setAttribute("aria-label", settings.ariaLabel);
            }
            if (settings.role) {
                this._inner.setAttribute("role", settings.role);
            }
        }
        const renderer = this._renderer;
        const rect = this._getRealSize();
        const size = this._getCalculatedSize(rect);
        const width = Math.floor(size.width);
        const height = Math.floor(size.height);
        const realWidth = Math.floor(rect.width);
        const realHeight = Math.floor(rect.height);
        const rootContainer = Container.new(this, {
            visible: true,
            width: width,
            height: height,
        });
        this._rootContainer = rootContainer;
        this._rootContainer._defaultThemes.push(DefaultTheme.new(this));
        const container = rootContainer.children.push(Container.new(this, { visible: true, width: p100, height: p100 }));
        this.container = container;
        renderer.resize(realWidth, realHeight, width, height);
        //@todo: better appendChild - refer
        this._inner.appendChild(renderer.view);
        // TODO: TMP TMP TMP for testing only, remove
        //renderer.debugGhostView = true;
        this._initResizeSensor();
        // HTML content holder
        const htmlElementContainer = document.createElement("div");
        this._htmlElementContainer = htmlElementContainer;
        htmlElementContainer.className = "am5-html-container";
        htmlElementContainer.style.position = "absolute";
        htmlElementContainer.style.pointerEvents = "none";
        if (!this._tooltipContainerSettings) {
            htmlElementContainer.style.overflow = "hidden";
        }
        this._inner.appendChild(htmlElementContainer);
        if (this._a11yD !== true) {
            // Create element which is used to make announcements to screen reader
            const readerAlertElement = document.createElement("div");
            readerAlertElement.className = "am5-reader-container";
            readerAlertElement.setAttribute("role", "alert");
            // readerAlertElement.style.zIndex = "-100000";
            // readerAlertElement.style.opacity = "0";
            // readerAlertElement.style.top = "0";
            readerAlertElement.style.position = "absolute";
            readerAlertElement.style.width = "1px";
            readerAlertElement.style.height = "1px";
            readerAlertElement.style.overflow = "hidden";
            readerAlertElement.style.clip = "rect(1px, 1px, 1px, 1px)";
            this._readerAlertElement = readerAlertElement;
            this._inner.appendChild(this._readerAlertElement);
            const focusElementContainer = document.createElement("div");
            focusElementContainer.className = "am5-focus-container";
            focusElementContainer.style.position = "absolute";
            focusElementContainer.style.pointerEvents = "none";
            focusElementContainer.style.top = "0px";
            focusElementContainer.style.left = "0px";
            focusElementContainer.style.overflow = "hidden";
            focusElementContainer.style.width = width + "px";
            focusElementContainer.style.height = height + "px";
            focusElementContainer.setAttribute("role", "graphics-document");
            $utils.setInteractive(focusElementContainer, false);
            this._focusElementContainer = focusElementContainer;
            this._inner.appendChild(this._focusElementContainer);
            const tooltipElementContainer = document.createElement("div");
            this._tooltipElementContainer = tooltipElementContainer;
            tooltipElementContainer.className = "am5-tooltip-container";
            this._inner.appendChild(tooltipElementContainer);
            // Add keyboard events for accessibility, e.g. simulating drag with arrow
            // keys and click with ENTER
            if ($utils.supports("keyboardevents")) {
                this._disposers.push($utils.addEventListener(window, "keydown", (ev) => {
                    if (ev.keyCode == 16) {
                        this._isShift = true;
                    }
                    else if (ev.keyCode == 9) {
                        this._isShift = ev.shiftKey;
                    }
                }));
                this._disposers.push($utils.addEventListener(window, "keyup", (ev) => {
                    if (ev.keyCode == 16) {
                        this._isShift = false;
                    }
                }));
                this._disposers.push($utils.addEventListener(focusElementContainer, "click", () => {
                    // Some screen readers convert ENTER (and some SPACE) press whil on
                    // focused element to a "click" event, preventing actual "keydown"
                    // event from firing. We're using this "click" event to still
                    // generate internal click events.
                    const focusedSprite = this._focusedSprite;
                    if (focusedSprite) {
                        const downEvent = renderer.getEvent(new MouseEvent("click"));
                        focusedSprite.events.dispatch("click", {
                            type: "click",
                            originalEvent: downEvent.event,
                            point: downEvent.point,
                            simulated: true,
                            target: focusedSprite
                        });
                    }
                }));
                this._disposers.push($utils.addEventListener(focusElementContainer, "keydown", (ev) => {
                    const focusedSprite = this._focusedSprite;
                    if (focusedSprite) {
                        if (ev.keyCode == 27) {
                            // ESC pressed - lose current focus
                            $utils.blur();
                            this._focusedSprite = undefined;
                        }
                        let dragOffsetX = 0;
                        let dragOffsetY = 0;
                        // TODO: figure out if using bogus MouseEvent is fine, or it will
                        // fail on some platforms
                        switch (ev.keyCode) {
                            case 13:
                                ev.preventDefault();
                                const downEvent = renderer.getEvent(new MouseEvent("click"));
                                focusedSprite.events.dispatch("click", {
                                    type: "click",
                                    originalEvent: downEvent.event,
                                    point: downEvent.point,
                                    simulated: true,
                                    target: focusedSprite
                                });
                                return;
                            case 37:
                                dragOffsetX = -6;
                                break;
                            case 39:
                                dragOffsetX = 6;
                                break;
                            case 38:
                                dragOffsetY = -6;
                                break;
                            case 40:
                                dragOffsetY = 6;
                                break;
                            default:
                                return;
                        }
                        if (dragOffsetX != 0 || dragOffsetY != 0) {
                            ev.preventDefault();
                            if (!focusedSprite.isDragging()) {
                                // Start dragging
                                this._keyboardDragPoint = {
                                    x: 0,
                                    y: 0
                                };
                                const downEvent = renderer.getEvent(new MouseEvent("mousedown", {
                                    clientX: 0,
                                    clientY: 0
                                }));
                                if (focusedSprite.events.isEnabled("pointerdown")) {
                                    focusedSprite.events.dispatch("pointerdown", {
                                        type: "pointerdown",
                                        originalEvent: downEvent.event,
                                        point: downEvent.point,
                                        simulated: true,
                                        target: focusedSprite
                                    });
                                }
                            }
                            else {
                                // Move focus marker
                                //this._positionFocusElement(focusedSprite);
                            }
                            // Move incrementally
                            const dragPoint = this._keyboardDragPoint;
                            dragPoint.x += dragOffsetX;
                            dragPoint.y += dragOffsetY;
                            const moveEvent = renderer.getEvent(new MouseEvent("mousemove", {
                                clientX: dragPoint.x,
                                clientY: dragPoint.y
                            }), false);
                            if (focusedSprite.events.isEnabled("globalpointermove")) {
                                focusedSprite.events.dispatch("globalpointermove", {
                                    type: "globalpointermove",
                                    originalEvent: moveEvent.event,
                                    point: moveEvent.point,
                                    simulated: true,
                                    target: focusedSprite
                                });
                            }
                        }
                    }
                }));
                this._disposers.push($utils.addEventListener(focusElementContainer, "keyup", (ev) => {
                    if (this._focusedSprite) {
                        const focusedSprite = this._focusedSprite;
                        const keyCode = ev.keyCode;
                        switch (keyCode) {
                            case 37:
                            case 39:
                            case 38:
                            case 40:
                                if (focusedSprite.isDragging()) {
                                    // Simulate drag stop
                                    const dragPoint = this._keyboardDragPoint;
                                    const upEvent = renderer.getEvent(new MouseEvent("mouseup", {
                                        clientX: dragPoint.x,
                                        clientY: dragPoint.y
                                    }));
                                    if (focusedSprite.events.isEnabled("globalpointerup")) {
                                        focusedSprite.events.dispatch("globalpointerup", {
                                            type: "globalpointerup",
                                            originalEvent: upEvent.event,
                                            point: upEvent.point,
                                            simulated: true,
                                            target: focusedSprite
                                        });
                                    }
                                    //this._positionFocusElement(focusedSprite);
                                    this._keyboardDragPoint = undefined;
                                    // @todo dispatch mouseup event instead of calling dragStop?
                                    // this._dispatchEvent("globalpointerup", target, upEvent);
                                    return;
                                }
                                else if (focusedSprite.get("focusableGroup")) {
                                    // Find next item in focusable group
                                    const group = focusedSprite.get("focusableGroup");
                                    const items = this._tabindexes.filter((item) => {
                                        return item.get("focusableGroup") == group && item.getPrivate("focusable") !== false ? true : false;
                                    });
                                    let index = items.indexOf(focusedSprite);
                                    const lastIndex = items.length - 1;
                                    index += (keyCode == 39 || keyCode == 40) ? 1 : -1;
                                    if (index < 0) {
                                        index = lastIndex;
                                    }
                                    else if (index > lastIndex) {
                                        index = 0;
                                    }
                                    $utils.focus(items[index].getPrivate("focusElement").dom);
                                }
                                break;
                        }
                    }
                }));
            }
        }
        this._startTicker();
        this.setThemes([]);
        this._addTooltip();
        if (!this._hasLicense()) {
            this._showBranding();
        }
    }
    _initResizeSensor() {
        if (this._resizeSensorDisposer) {
            this._resizeSensorDisposer.dispose();
        }
        this._resizeSensorDisposer = new ResizeSensor(this.dom, () => {
            if (this.autoResize) {
                this.resize();
            }
        });
        this._disposers.push(this._resizeSensorDisposer);
    }
    /**
     * If automatic resizing of char is disabled (`root.autoResize = false`), it
     * can be resized manually by calling this method.
     */
    resize() {
        const rect = this._getRealSize();
        const size = this._getCalculatedSize(rect);
        const w = Math.floor(size.width);
        const h = Math.floor(size.height);
        if (w > 0 && h > 0) {
            const realWidth = Math.floor(rect.width);
            const realHeight = Math.floor(rect.height);
            const htmlElementContainer = this._htmlElementContainer;
            htmlElementContainer.style.width = w + "px";
            htmlElementContainer.style.height = h + "px";
            if (this._a11yD !== true) {
                const focusElementContainer = this._focusElementContainer;
                focusElementContainer.style.width = w + "px";
                focusElementContainer.style.height = h + "px";
            }
            this._renderer.resize(realWidth, realHeight, w, h);
            const rootContainer = this._rootContainer;
            rootContainer.setPrivate("width", w);
            rootContainer.setPrivate("height", h);
            this._render();
            this._handleLogo();
        }
    }
    _render() {
        this._renderer.render(this._rootContainer._display);
        if (this._focusElementDirty) {
            this._updateCurrentFocus();
            this._focusElementDirty = false;
        }
    }
    _runTickers(currentTime) {
        $array.each(this._tickers, (f) => {
            f(currentTime);
        });
    }
    _runAnimations(currentTime) {
        $array.keepIf(this._animations, (animation) => {
            return animation._runAnimation(currentTime);
        });
    }
    _runDirties() {
        //console.log("tick **************************************************************");
        let allParents = {};
        while (this._isDirtyParents) {
            // This must be before calling _prepareChildren
            this._isDirtyParents = false;
            $object.keys(this._dirtyParents).forEach((key) => {
                const parent = this._dirtyParents[key];
                delete this._dirtyParents[key];
                if (!parent.isDisposed()) {
                    allParents[parent.uid] = parent;
                    parent._prepareChildren();
                }
            });
        }
        $object.keys(allParents).forEach((key) => {
            allParents[key]._updateChildren();
        });
        const objects = [];
        //		console.log("_beforeChanged")
        $object.keys(this._dirty).forEach((key) => {
            const entity = this._dirty[key];
            if (entity.isDisposed()) {
                delete this._dirty[entity.uid];
            }
            else {
                objects.push(entity);
                entity._beforeChanged();
            }
        });
        //		console.log("_changed")
        objects.forEach((entity) => {
            entity._changed();
            delete this._dirty[entity.uid];
            entity._clearDirty();
        });
        this._isDirty = false;
        const depths = {};
        const bounds = [];
        $object.keys(this._dirtyBounds).forEach((key) => {
            const entity = this._dirtyBounds[key];
            delete this._dirtyBounds[key];
            if (!entity.isDisposed()) {
                depths[entity.uid] = entity.depth();
                bounds.push(entity);
            }
        });
        this._positionHTMLElements();
        // High depth -> low depth
        bounds.sort((x, y) => {
            return $order.compare(depths[y.uid], depths[x.uid]);
        });
        //		console.log("_updateBounds")
        bounds.forEach((entity) => {
            entity._updateBounds();
        });
        //		console.log("_updatePosition")
        const dirtyPositions = this._dirtyPositions;
        $object.keys(dirtyPositions).forEach((key) => {
            const sprite = dirtyPositions[key];
            delete dirtyPositions[key];
            if (!sprite.isDisposed()) {
                sprite._updatePosition();
            }
        });
        //		console.log("_afterChanged")
        objects.forEach((entity) => {
            entity._afterChanged();
        });
    }
    _renderFrame(currentTime) {
        if (this._updateTick) {
            if (this.events.isEnabled("framestarted")) {
                this.events.dispatch("framestarted", {
                    type: "framestarted",
                    target: this,
                    timestamp: currentTime,
                });
            }
            this._checkComputedStyles();
            this._runTickers(currentTime);
            this._runAnimations(currentTime);
            this._runDirties();
            this._render();
            this._positionHTMLElements();
            if (this.events.isEnabled("frameended")) {
                this.events.dispatch("frameended", {
                    type: "frameended",
                    target: this,
                    timestamp: currentTime,
                });
            }
            return this._tickers.length === 0 &&
                this._animations.length === 0 &&
                !this._isDirty;
        }
        else {
            return true;
        }
    }
    _runTicker(currentTime, now) {
        if (!this.isDisposed()) {
            this.animationTime = currentTime;
            const done = this._renderFrame(currentTime);
            // No more work to do
            if (done) {
                this._ticker = null;
                this.animationTime = null;
            }
            else {
                if (!this._paused) {
                    if (now) {
                        this._ticker;
                    }
                    else {
                        rAF(this.fps, this._ticker);
                    }
                }
            }
        }
    }
    _runTickerNow(timeout = 10000) {
        if (!this.isDisposed()) {
            const endTime = performance.now() + timeout;
            for (;;) {
                const currentTime = performance.now();
                if (currentTime >= endTime) {
                    this.animationTime = null;
                    break;
                }
                this.animationTime = currentTime;
                const done = this._renderFrame(currentTime);
                if (done) {
                    this.animationTime = null;
                    break;
                }
            }
        }
    }
    _startTicker() {
        if (this._ticker === null) {
            this.animationTime = null;
            this._ticker = (currentTime) => {
                this._runTicker(currentTime);
            };
            rAF(this.fps, this._ticker);
        }
    }
    /**
     * Returns whether the root is updating or not.
     */
    get updateTick() {
        return this._updateTick;
    }
    /**
     * Enables or disables the root updating.
     */
    set updateTick(value) {
        this._updateTick = value;
        if (value) {
            this._startTicker();
        }
    }
    _addDirtyEntity(entity) {
        if (this._dirty[entity.uid] === undefined) {
            this._isDirty = true;
            this._dirty[entity.uid] = entity;
            this._startTicker();
        }
    }
    _addDirtyParent(parent) {
        if (this._dirtyParents[parent.uid] === undefined) {
            this._isDirty = true;
            this._isDirtyParents = true;
            this._dirtyParents[parent.uid] = parent;
            this._startTicker();
        }
    }
    _addDirtyBounds(entity) {
        if (this._dirtyBounds[entity.uid] === undefined) {
            this._isDirty = true;
            this._dirtyBounds[entity.uid] = entity;
            this._startTicker();
        }
    }
    _addDirtyPosition(sprite) {
        if (this._dirtyPositions[sprite.uid] === undefined) {
            this._isDirty = true;
            this._dirtyPositions[sprite.uid] = sprite;
            this._startTicker();
        }
    }
    _addAnimation(animation) {
        // TODO use numeric id instead
        if (this._animations.indexOf(animation) === -1) {
            this._animations.push(animation);
            this._startTicker();
        }
    }
    _markDirty() {
        this._isDirty = true;
    }
    _markDirtyRedraw() {
        this.events.once("frameended", () => {
            this._isDirty = true;
            this._startTicker();
        });
    }
    eachFrame(f) {
        this._tickers.push(f);
        this._startTicker();
        return new Disposer(() => {
            $array.removeFirst(this._tickers, f);
        });
    }
    markDirtyGlobal(container) {
        if (!container) {
            container = this.container;
        }
        container.walkChildren((child) => {
            if (child instanceof Container) {
                this.markDirtyGlobal(child);
            }
            child.markDirty();
            child.markDirtyBounds();
        });
    }
    /**
     * Returns width of the target container, in pixels.
     *
     * @return Width
     */
    width() {
        // TODO make this more efficient, maybe just return the renderer's width ?
        return Math.floor(this._getCalculatedSize(this._getRealSize()).width);
    }
    /**
     * Returns height of the target container, in pixels.
     *
     * @return Height
     */
    height() {
        // TODO make this more efficient, maybe just return the renderer's height ?
        return Math.floor(this._getCalculatedSize(this._getRealSize()).height);
    }
    /**
     * Disposes root and all the content in it.
     */
    dispose() {
        if (!this._isDisposed) {
            this._isDisposed = true;
            this._rootContainer.dispose();
            this._renderer.dispose();
            this.horizontalLayout.dispose();
            this.verticalLayout.dispose();
            this.interfaceColors.dispose();
            $array.each(this._disposers, (x) => {
                x.dispose();
            });
            if (this._inner) {
                $utils.removeElement(this._inner);
            }
            $array.remove(registry.rootElements, this);
        }
    }
    /**
     * Returns `true` if root element is disposed.
     *
     * @return Disposed?
     */
    isDisposed() {
        return this._isDisposed;
    }
    /**
     * Triggers screen reader read out a message.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/accessibility/} for more info
     * @param  text  Alert text
     */
    readerAlert(text) {
        if (this._a11yD !== true) {
            this._readerAlertElement.innerHTML = $utils.stripTags(text);
        }
    }
    /**
     * Sets themes to be used for the chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/themes/} for more info
     * @param  themes  A list of themes
     */
    setThemes(themes) {
        this._rootContainer.set("themes", themes);
        // otherwise new themes are not applied
        const tooltipContainer = this.tooltipContainer;
        if (tooltipContainer) {
            tooltipContainer._applyThemes();
        }
        // @todo review this
        const interfaceColors = this.interfaceColors;
        if (interfaceColors) {
            interfaceColors._applyThemes();
        }
    }
    _addTooltip() {
        if (!this.tooltipContainer) {
            const tooltipContainerSettings = this._tooltipContainerSettings;
            const tooltipContainer = this._rootContainer.children.push(Container.new(this, {
                position: "absolute",
                isMeasured: false,
                width: p100,
                height: p100,
                layer: tooltipContainerSettings ? 35 : 30,
                layerMargin: tooltipContainerSettings ? tooltipContainerSettings : undefined
            }));
            this.tooltipContainer = tooltipContainer;
            const tooltip = Tooltip.new(this, {});
            this.container.set("tooltip", tooltip);
            tooltip.hide(0);
            this._tooltip = tooltip;
        }
    }
    /**
     * Accesibility
     */
    _registerTabindexOrder(target) {
        if (this._a11yD == true) {
            return;
        }
        if (target.get("focusable")) {
            $array.pushOne(this._tabindexes, target);
        }
        else {
            $array.remove(this._tabindexes, target);
        }
        this._invalidateTabindexes();
    }
    _unregisterTabindexOrder(target) {
        if (this._a11yD == true) {
            return;
        }
        $array.remove(this._tabindexes, target);
        this._invalidateTabindexes();
    }
    _invalidateTabindexes() {
        if (this._a11yD == true) {
            return;
        }
        this._tabindexes.sort((a, b) => {
            const aindex = a.get("tabindexOrder", 0);
            const bindex = b.get("tabindexOrder", 0);
            if (aindex == bindex) {
                return 0;
            }
            else if (aindex > bindex) {
                return 1;
            }
            else {
                return -1;
            }
        });
        const groups = [];
        $array.each(this._tabindexes, (item, index) => {
            if (!item.getPrivate("focusElement")) {
                this._makeFocusElement(index, item);
            }
            else {
                this._moveFocusElement(index, item);
            }
            const group = item.get("focusableGroup");
            if (group && item.getPrivate("focusable") !== false) {
                if (groups.indexOf(group) !== -1) {
                    // Non-first element in the group, make it not directly focusable
                    item.getPrivate("focusElement").dom.setAttribute("tabindex", "-1");
                }
                else {
                    groups.push(group);
                }
            }
        });
    }
    _updateCurrentFocus() {
        if (this._a11yD == true) {
            return;
        }
        if (this._focusedSprite) {
            this._decorateFocusElement(this._focusedSprite);
            this._positionFocusElement(this._focusedSprite);
        }
    }
    _decorateFocusElement(target, focusElement) {
        if (this._a11yD == true) {
            return;
        }
        // Decorate with proper accessibility attributes
        if (!focusElement) {
            focusElement = target.getPrivate("focusElement").dom;
        }
        if (!focusElement) {
            return;
        }
        const role = target.get("role");
        if (role) {
            focusElement.setAttribute("role", role);
        }
        else {
            focusElement.removeAttribute("role");
        }
        const ariaLabel = target.get("ariaLabel");
        if (ariaLabel) {
            const label = populateString(target, ariaLabel);
            focusElement.setAttribute("aria-label", label);
        }
        else {
            focusElement.removeAttribute("aria-label");
        }
        const ariaLive = target.get("ariaLive");
        if (ariaLive) {
            focusElement.setAttribute("aria-live", ariaLive);
        }
        else {
            focusElement.removeAttribute("aria-live");
        }
        const ariaChecked = target.get("ariaChecked");
        if (ariaChecked != null) {
            focusElement.setAttribute("aria-checked", ariaChecked ? "true" : "false");
        }
        else {
            focusElement.removeAttribute("aria-checked");
        }
        if (target.get("ariaHidden")) {
            focusElement.setAttribute("aria-hidden", "true");
        }
        else {
            focusElement.removeAttribute("aria-hidden");
        }
        const ariaOrientation = target.get("ariaOrientation");
        if (ariaOrientation) {
            focusElement.setAttribute("aria-orientation", ariaOrientation);
        }
        else {
            focusElement.removeAttribute("aria-orientation");
        }
        const ariaValueNow = target.get("ariaValueNow");
        if (ariaValueNow) {
            focusElement.setAttribute("aria-valuenow", ariaValueNow);
        }
        else {
            focusElement.removeAttribute("aria-valuenow");
        }
        const ariaValueMin = target.get("ariaValueMin");
        if (ariaValueMin) {
            focusElement.setAttribute("aria-valuemin", ariaValueMin);
        }
        else {
            focusElement.removeAttribute("aria-valuemin");
        }
        const ariaValueMax = target.get("ariaValueMax");
        if (ariaValueMax) {
            focusElement.setAttribute("aria-valuemax", ariaValueMax);
        }
        else {
            focusElement.removeAttribute("aria-valuemax");
        }
        const ariaValueText = target.get("ariaValueText");
        if (ariaValueText) {
            focusElement.setAttribute("aria-valuetext", ariaValueText);
        }
        else {
            focusElement.removeAttribute("aria-valuetext");
        }
        const ariaControls = target.get("ariaControls");
        if (ariaControls) {
            focusElement.setAttribute("aria-controls", ariaControls);
        }
        else {
            focusElement.removeAttribute("aria-controls");
        }
        if (target.get("visible") && target.get("opacity") !== 0 && target.get("role") != "tooltip" && !target.isHidden() && target.getPrivate("focusable") !== false) {
            if (focusElement.getAttribute("tabindex") != "-1") {
                focusElement.setAttribute("tabindex", "" + this.tabindex);
            }
            focusElement.removeAttribute("aria-hidden");
        }
        else {
            focusElement.removeAttribute("tabindex");
            focusElement.setAttribute("aria-hidden", "true");
        }
    }
    _makeFocusElement(index, target) {
        if (target.getPrivate("focusElement") || this._a11yD == true) {
            return;
        }
        // Init
        const focusElement = document.createElement("div");
        if (target.get("role") != "tooltip") {
            focusElement.tabIndex = this.tabindex;
        }
        focusElement.style.position = "absolute";
        $utils.setInteractive(focusElement, false);
        const disposers = [];
        target.setPrivate("focusElement", {
            dom: focusElement,
            disposers,
        });
        this._decorateFocusElement(target);
        disposers.push($utils.addEventListener(focusElement, "focus", (ev) => {
            this._handleFocus(ev, index);
        }));
        disposers.push($utils.addEventListener(focusElement, "blur", (ev) => {
            this._handleBlur(ev, index);
        }));
        this._moveFocusElement(index, target);
    }
    _removeFocusElement(target) {
        if (this._a11yD == true) {
            return;
        }
        $array.remove(this._tabindexes, target);
        const focusElement = target.getPrivate("focusElement");
        if (focusElement) {
            const container = this._focusElementContainer;
            container.removeChild(focusElement.dom);
            $array.each(focusElement.disposers, (x) => {
                x.dispose();
            });
        }
    }
    _hideFocusElement(target) {
        if (this._a11yD == true) {
            return;
        }
        const focusElement = target.getPrivate("focusElement");
        focusElement.dom.style.display = "none";
    }
    _moveFocusElement(index, target) {
        if (this._a11yD == true) {
            return;
        }
        // Get container
        const container = this._focusElementContainer;
        const focusElement = target.getPrivate("focusElement").dom;
        if (focusElement === this._focusElementContainer.children[index]) {
            // Nothing to do
            return;
        }
        const next = this._focusElementContainer.children[index + 1];
        if (next) {
            container.insertBefore(focusElement, next);
        }
        else {
            container.append(focusElement);
        }
    }
    _positionFocusElement(target) {
        if (this._a11yD == true || target == undefined) {
            return;
        }
        const bounds = target.globalBounds();
        let width = bounds.right == bounds.left ? target.width() : bounds.right - bounds.left;
        let height = bounds.top == bounds.bottom ? target.height() : bounds.bottom - bounds.top;
        const padding = this._settings.focusPadding !== undefined ? this._settings.focusPadding : 2;
        let x = bounds.left - padding;
        let y = bounds.top - padding;
        if (width < 0) {
            x += width;
            width = Math.abs(width);
        }
        if (height < 0) {
            y += height;
            height = Math.abs(height);
        }
        const focusElement = target.getPrivate("focusElement").dom;
        focusElement.style.top = y + "px";
        focusElement.style.left = x + "px";
        focusElement.style.width = (width + padding * 2) + "px";
        focusElement.style.height = (height + padding * 2) + "px";
    }
    _handleFocus(ev, index) {
        if (this._a11yD == true) {
            return;
        }
        // Get element
        const focused = this._tabindexes[index];
        // Jump over hidden elements
        if (!focused.isVisibleDeep()) {
            this._focusNext(ev.target, this._isShift ? -1 : 1);
            return;
        }
        // Size and position
        this._positionFocusElement(focused);
        //this._decorateFocusElement(focused);
        this._focusedSprite = focused;
        if (focused.events.isEnabled("focus")) {
            focused.events.dispatch("focus", {
                type: "focus",
                originalEvent: ev,
                target: focused
            });
        }
    }
    _focusNext(el, direction) {
        if (this._a11yD == true) {
            return;
        }
        const focusableElements = Array.from(document.querySelectorAll([
            'a[href]',
            'area[href]',
            'button:not([disabled])',
            'details',
            'input:not([disabled])',
            'iframe:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[contentEditable=""]',
            '[contentEditable="true"]',
            '[contentEditable="TRUE"]',
            '[tabindex]:not([tabindex^="-"])',
            //':not([disabled])'
        ].join(',')));
        let index = focusableElements.indexOf(el) + direction;
        if (index < 0) {
            index = focusableElements.length - 1;
        }
        else if (index >= focusableElements.length) {
            index = 0;
        }
        focusableElements[index].focus();
    }
    _handleBlur(ev, _index) {
        if (this._a11yD == true) {
            return;
        }
        const focused = this._focusedSprite;
        if (focused && !focused.isDisposed() && focused.events.isEnabled("blur")) {
            focused.events.dispatch("blur", {
                type: "blur",
                originalEvent: ev,
                target: focused
            });
        }
        this._focusedSprite = undefined;
    }
    /**
     * @ignore
     */
    updateTooltip(target) {
        if (this._a11yD == true) {
            return;
        }
        const text = $utils.stripTags(target._getText());
        let tooltipElement = target.getPrivate("tooltipElement");
        if (target.get("role") == "tooltip" && text != "") {
            if (!tooltipElement) {
                tooltipElement = this._makeTooltipElement(target);
            }
            if (tooltipElement.innerHTML != text) {
                tooltipElement.innerHTML = text;
            }
        }
        else if (tooltipElement) {
            tooltipElement.remove();
            target.removePrivate("tooltipElement");
        }
    }
    _makeTooltipElement(target) {
        const container = this._tooltipElementContainer;
        const tooltipElement = document.createElement("div");
        tooltipElement.style.position = "absolute";
        tooltipElement.style.width = "1px";
        tooltipElement.style.height = "1px";
        tooltipElement.style.overflow = "hidden";
        tooltipElement.style.clip = "rect(1px, 1px, 1px, 1px)";
        $utils.setInteractive(tooltipElement, false);
        this._decorateFocusElement(target, tooltipElement);
        container.append(tooltipElement);
        target.setPrivate("tooltipElement", tooltipElement);
        return tooltipElement;
    }
    _removeTooltipElement(target) {
        if (this._a11yD == true) {
            return;
        }
        const tooltipElement = target.getPrivate("tooltipElement");
        if (tooltipElement) {
            const parent = tooltipElement.parentElement;
            if (parent) {
                parent.removeChild(tooltipElement);
            }
        }
    }
    _invalidateAccessibility(target) {
        if (this._a11yD == true) {
            return;
        }
        this._focusElementDirty = true;
        const focusElement = target.getPrivate("focusElement");
        if (target.get("focusable")) {
            if (focusElement) {
                this._decorateFocusElement(target);
                this._positionFocusElement(target);
            }
            // else {
            // 	this._renderer._makeFocusElement(0, this);
            // }
        }
        else if (focusElement) {
            this._removeFocusElement(target);
        }
        //this.updateCurrentFocus();
    }
    /**
     * Returns `true` if `target` is currently focused.
     *
     * @param   target  Target
     * @return          Focused?
     */
    focused(target) {
        return this._focusedSprite === target;
    }
    /**
     * Converts document coordinates to coordinates withing root element.
     *
     * @param   point  Document point
     * @return         Root point
     */
    documentPointToRoot(point) {
        const rect = this._getRealSize();
        const size = this._getCalculatedSize(rect);
        const scaleWidth = size.width / rect.width;
        const scaleHeight = size.height / rect.height;
        return {
            x: (point.x - rect.left) * scaleWidth,
            y: (point.y - rect.top) * scaleHeight,
        };
    }
    /**
     * Converts root coordinates to document
     *
     * @param   point  Document point
     * @return         Root point
     */
    rootPointToDocument(point) {
        const rect = this._getRealSize();
        const size = this._getCalculatedSize(rect);
        const scaleWidth = size.width / rect.width;
        const scaleHeight = size.height / rect.height;
        return {
            x: (point.x / scaleWidth) + rect.left,
            y: (point.y / scaleHeight) + rect.top
        };
    }
    /**
     * @ignore
     */
    addDisposer(disposer) {
        this._disposers.push(disposer);
        return disposer;
    }
    _updateComputedStyles() {
        const styles = window.getComputedStyle(this.dom);
        let fontHash = "";
        $object.each(styles, (key, val) => {
            if ($type.isString(key) && key.match(/^font/)) {
                fontHash += val;
            }
        });
        const changed = fontHash != this._fontHash;
        if (changed) {
            this._fontHash = fontHash;
        }
        return changed;
    }
    _checkComputedStyles() {
        if (this._updateComputedStyles()) {
            this._invalidateLabelBounds(this.container);
        }
    }
    _invalidateLabelBounds(target) {
        if (target instanceof Container) {
            target.children.each((child) => {
                this._invalidateLabelBounds(child);
            });
        }
        else if (target instanceof Text) {
            target.markDirtyBounds();
        }
    }
    /**
     * To all the clever heads out there. Yes, we did not make any attempts to
     * scramble this.
     *
     * This is a part of a tool meant for our users to manage their commercial
     * licenses for removal of amCharts branding from charts.
     *
     * The only legit way to do so is to purchase a commercial license for amCharts:
     * https://www.amcharts.com/online-store/
     *
     * Removing or altering this code, or disabling amCharts branding in any other
     * way is against the license and thus illegal.
     */
    _hasLicense() {
        for (let i = 0; i < registry.licenses.length; i++) {
            if (registry.licenses[i].match(/^AM5C.{5,}/i)) {
                return true;
            }
        }
        return false;
    }
    _licenseApplied() {
        if (this._logo) {
            this._logo.set("forceHidden", true);
        }
    }
    /**
     * @ignore
     */
    get debugGhostView() {
        return this._renderer.debugGhostView;
    }
    /**
     * @ignore
     */
    set debugGhostView(value) {
        this._renderer.debugGhostView = value;
    }
    /**
     * Set this to `true` if you need chart to require first a tap onto it before
     * touch gesture related functionality like zoom/pan is turned on.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/root-element/#Touch_related_options} for more info
     * @default false
     * @since 5.2.9
     * @param  value  Needs a tap to activate touch functions
     */
    set tapToActivate(value) {
        this._renderer.tapToActivate = value;
    }
    /**
     * @return Needs a tap to activate touch functions
     */
    get tapToActivate() {
        return this._renderer.tapToActivate;
    }
    /**
     * If `tapToActivate` is set to `true`, this setting will determine number
     * of milliseconds the chart will stay "active", before releasing the
     * controls back to the page.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/root-element/#Touch_related_options} for more info
     * @default 3000
     * @since 5.2.9
     * @param  value  Timeout
     */
    set tapToActivateTimeout(value) {
        this._renderer.tapToActivateTimeout = value;
    }
    /**
     * @return Timeout
     */
    get tapToActivateTimeout() {
        return this._renderer.tapToActivateTimeout;
    }
    _makeHTMLElement(target) {
        // Get container
        const container = this._htmlElementContainer;
        // Init
        const htmlElement = document.createElement("div");
        target.setPrivate("htmlElement", htmlElement);
        //htmlElement.tabIndex = this.tabindex;
        htmlElement.style.position = "absolute";
        htmlElement.style.overflow = "auto";
        htmlElement.style.boxSizing = "border-box";
        $utils.setInteractive(htmlElement, target.get("interactive", false));
        // Translate events
        if (target.events.isEnabled("click")) {
            $utils.setInteractive(htmlElement, true);
            this._disposers.push($utils.addEventListener(htmlElement, "click", (ev) => {
                const downEvent = this._renderer.getEvent(ev);
                target.events.dispatch("click", {
                    type: "click",
                    originalEvent: downEvent.event,
                    point: downEvent.point,
                    simulated: false,
                    target: target
                });
            }));
        }
        this._positionHTMLElement(target);
        container.append(htmlElement);
        $array.pushOne(this._htmlEnabledContainers, target);
        return htmlElement;
    }
    _positionHTMLElements() {
        $array.each(this._htmlEnabledContainers, (target) => {
            this._positionHTMLElement(target);
        });
    }
    _positionHTMLElement(target) {
        const htmlElement = target.getPrivate("htmlElement");
        if (htmlElement) {
            // Translate settings
            const visualSettings = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "minWidth", "minHeight", "maxWidth", "maxHeight"];
            $array.each(visualSettings, (setting) => {
                const value = target.get(setting);
                if (value) {
                    htmlElement.style[setting] = value + "px";
                }
                else {
                    htmlElement.style[setting] = "";
                }
            });
            // Deal with opacity
            const opacity = target.compositeOpacity();
            setTimeout(() => {
                htmlElement.style.opacity = opacity + "";
            }, 10);
            const visible = target.isVisibleDeep();
            if (visible) {
                htmlElement.style.display = "block";
            }
            // Deal with position
            const bounds = target.globalBounds();
            htmlElement.style.top = (bounds.top) + "px";
            htmlElement.style.left = (bounds.left) + "px";
            // Use width/height if those are set
            const width = target.get("width");
            const height = target.get("height");
            let w = 0;
            let h = 0;
            if (width) {
                w = target.width();
            }
            if (height) {
                h = target.height();
            }
            if (!width || !height) {
                htmlElement.style.position = "fixed";
                htmlElement.style.width = "";
                htmlElement.style.height = "";
                const bbox = htmlElement.getBoundingClientRect();
                htmlElement.style.position = "absolute";
                w = bbox.width;
                h = bbox.height;
                target._adjustedLocalBounds = { left: 0, right: 0, top: 0, bottom: 0 };
                target.setPrivate("minWidth", w);
                target.setPrivate("minHeight", h);
            }
            else {
                target.removePrivate("minWidth");
                target.removePrivate("minHeight");
            }
            if (w > 0) {
                htmlElement.style.minWidth = (w) + "px";
            }
            if (h > 0) {
                htmlElement.style.minHeight = (h) + "px";
            }
            // Hide or show
            if (!visible || opacity == 0) {
                htmlElement.style.display = "none";
            }
        }
    }
    _setHTMLContent(target, html) {
        let htmlElement = target.getPrivate("htmlElement");
        if (!htmlElement) {
            htmlElement = this._makeHTMLElement(target);
        }
        if (htmlElement.innerHTML != html) {
            htmlElement.innerHTML = html;
        }
    }
    _removeHTMLContent(target) {
        let htmlElement = target.getPrivate("htmlElement");
        if (htmlElement) {
            this._htmlElementContainer.removeChild(htmlElement);
            target.removePrivate("htmlElement");
        }
        $array.remove(this._htmlEnabledContainers, target);
    }
}
//# sourceMappingURL=Root.js.map