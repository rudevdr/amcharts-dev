import * as $type from "./Type";
import * as $array from "./Array";
import * as $object from "./Object";
import { Disposer, DisposerClass } from "./Disposer";
/**
 * ============================================================================
 * DOM FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Execute a function when DOM is ready.
 *
 * @since 5.0.2
 * @param  f  Callback
 */
export function ready(f) {
    if (document.readyState !== "loading") {
        f();
    }
    else {
        const listener = () => {
            if (document.readyState !== "loading") {
                document.removeEventListener("readystatechange", listener);
                f();
            }
        };
        document.addEventListener("readystatechange", listener);
    }
}
/**
 * Removes a DOM element.
 * @param  el  Target element
 */
export function removeElement(el) {
    if (el.parentNode) {
        el.parentNode.removeChild(el);
    }
}
/**
 * Function that adds a disposable event listener directly to a DOM element.
 *
 * @ignore Exclude from docs
 * @param dom       A DOM element to add event to
 * @param type      Event type
 * @param listener  Event listener
 * @returns Disposable event
 */
export function addEventListener(dom, type, listener, options) {
    //@todo proper type check for options: EventListenerOptions | boolean (TS for some reason gives error on passive parameter)
    dom.addEventListener(type, listener, options || false);
    return new Disposer(() => {
        dom.removeEventListener(type, listener, options || false);
    });
}
/**
 * Function that adds an event listener which is triggered when the browser's zoom changes.
 *
 * @param listener  Event listener
 * @returns Disposable event
 */
export function onZoom(listener) {
    // TODO use matchMedia instead ?
    return addEventListener(window, "resize", (_ev) => {
        listener();
    });
}
/**
 * @ignore
 */
export function supports(cap) {
    switch (cap) {
        case "touchevents":
            //return "ontouchstart" in document.documentElement;
            return window.hasOwnProperty("TouchEvent");
        case "pointerevents":
            return window.hasOwnProperty("PointerEvent");
        case "mouseevents":
            return window.hasOwnProperty("MouseEvent");
        case "wheelevents":
            return window.hasOwnProperty("WheelEvent");
        case "keyboardevents":
            return window.hasOwnProperty("KeyboardEvent");
    }
    return false;
}
/**
 * @ignore
 */
export function getPointerId(event) {
    let id = event.pointerId || 0;
    return id;
}
/**
 * Removes focus from any element by shifting focus to body.
 *
 * @ignore
 */
export function blur() {
    if (document.activeElement && document.activeElement != document.body) {
        if (document.activeElement.blur) {
            document.activeElement.blur();
        }
        else {
            let input = document.createElement("button");
            input.style.position = "fixed";
            input.style.top = "0px";
            input.style.left = "-10000px";
            document.body.appendChild(input);
            input.focus();
            input.blur();
            document.body.removeChild(input);
        }
    }
}
/**
 * Focuses element.
 *
 * @ignore
 */
export function focus(el) {
    if (el) {
        el.focus();
    }
}
/**
 * @ignore
 */
export function getRendererEvent(key) {
    if (supports("pointerevents")) {
        return key;
    }
    else if (supports("touchevents")) {
        switch (key) {
            case "pointerover": return "touchstart";
            case "pointerout": return "touchend";
            case "pointerleave": return "touchend";
            case "pointerdown": return "touchstart";
            case "pointermove": return "touchmove";
            case "pointerup": return "touchend";
            case "click": return "click";
            case "dblclick": return "dblclick";
        }
    }
    else if (supports("mouseevents")) {
        switch (key) {
            case "pointerover": return "mouseover";
            case "pointerout": return "mouseout";
            case "pointerleave": return "mouseleave";
            case "pointerdown": return "mousedown";
            case "pointermove": return "mousemove";
            case "pointerup": return "mouseup";
            case "click": return "click";
            case "dblclick": return "dblclick";
        }
    }
    return key;
}
/**
 * Determines if pointer event originated from a touch pointer or mouse.
 *
 * @param ev  Original event
 * @return Touch pointer?
 */
export function isTouchEvent(ev) {
    if (typeof Touch !== "undefined" && ev instanceof Touch) {
        return true;
    }
    else if (typeof PointerEvent !== "undefined" && ev instanceof PointerEvent && ev.pointerType != null) {
        switch (ev.pointerType) {
            case "touch":
            case "pen":
            case 2:
                return true;
            case "mouse":
            case 4:
                return false;
            default:
                return !(ev instanceof MouseEvent);
        }
    }
    else if (ev.type != null) {
        if (ev.type.match(/^mouse/)) {
            return false;
        }
    }
    return true;
}
/**
 * Sets style property on DOM element.
 *
 * @ignore Exclude from docs
 */
export function setStyle(dom, property, value) {
    dom.style[property] = value;
}
export function getStyle(dom, property) {
    return dom.style[property];
}
/**
 * Gets the target of the event, works for shadow DOM too.
 */
export function getEventTarget(event) {
    if (event.composedPath) {
        const path = event.composedPath();
        if (path.length === 0) {
            return null;
        }
        else {
            return path[0];
        }
    }
    else {
        return event.target;
    }
}
/**
 * Checks of element `a` contains element `b`.
 *
 * @param a  Aleged ascendant
 * @param b  Aleged descendant
 * @return Contains?
 */
export function contains(a, b) {
    let cursor = b;
    while (true) {
        if (a === cursor) {
            return true;
        }
        else if (cursor.parentNode === null) {
            // TODO better ShadowRoot detection
            if (cursor.host == null) {
                return false;
            }
            else {
                cursor = cursor.host;
            }
        }
        else {
            cursor = cursor.parentNode;
        }
    }
}
/**
 * Returns `true` if pointer event originated on an element within Root.
 *
 * @since 5.2.8
 * @param  event   Event
 * @param  target  Target element
 */
export function isLocalEvent(event, target) {
    return event.target && contains(target.root.dom, event.target);
}
/**
 * Disables or enables interactivity of a DOM element.
 *
 * @param  target       Target element
 * @param  interactive  Interactive?
 */
export function setInteractive(target, interactive) {
    if (interactive) {
        target.style.pointerEvents = "auto";
    }
    else {
        target.style.pointerEvents = "none";
    }
}
/**
 * Returns the shadow root of the element or null
 *
 * @param a  Node
 * @return Root
 */
export function getShadowRoot(a) {
    let cursor = a;
    while (true) {
        if (cursor.parentNode === null) {
            // TODO better ShadowRoot detection
            if (cursor.host != null) {
                return cursor;
            }
            else {
                return null;
            }
        }
        else {
            cursor = cursor.parentNode;
        }
    }
}
/**
 * [rootStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 */
let rootStylesheet;
/**
 * @ignore Exclude from docs
 */
function createStylesheet(element, text, nonce = "") {
    // TODO use createElementNS ?
    const e = document.createElement("style");
    e.type = "text/css";
    if (nonce != "") {
        e.setAttribute("nonce", nonce);
    }
    e.textContent = text;
    if (element === null) {
        document.head.appendChild(e);
    }
    else {
        element.appendChild(e);
    }
    return e;
}
/**
 * [getStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @return [description]
 */
function getStylesheet(element, nonce = "") {
    if (element === null) {
        if (rootStylesheet == null) {
            // TODO use createElementNS ?
            const e = document.createElement("style");
            e.type = "text/css";
            if (nonce != "") {
                e.setAttribute("nonce", nonce);
            }
            document.head.appendChild(e);
            rootStylesheet = e.sheet;
        }
        return rootStylesheet;
    }
    else {
        // TODO use createElementNS ?
        const e = document.createElement("style");
        e.type = "text/css";
        if (nonce != "") {
            e.setAttribute("nonce", nonce);
        }
        element.appendChild(e);
        return e.sheet;
    }
}
/**
 * [makeStylesheet description]
 *
 * @ignore Exclude from docs
 * @todo Description
 * @param selector  [description]
 * @return [description]
 */
function appendStylesheet(root, selector) {
    const index = root.cssRules.length;
    root.insertRule(selector + "{}", index);
    return root.cssRules[index];
}
/**
 * Defines a class for a CSS rule.
 *
 * Can be used to dynamically add CSS to the document.
 */
export class StyleRule extends DisposerClass {
    /**
     * Constructor.
     *
     * @param selector  CSS selector
     * @param styles    An object of style attribute - value pairs
     */
    constructor(element, selector, styles, nonce = "") {
        super();
        Object.defineProperty(this, "_root", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        /**
         * CSS rule.
         */
        Object.defineProperty(this, "_rule", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._root = getStylesheet(element, nonce);
        try {
            this._rule = appendStylesheet(this._root, selector);
            $object.each(styles, (key, value) => {
                this.setStyle(key, value);
            });
        }
        catch (err) {
            // Create an empty rule on failed selectors
            this._rule = new CSSStyleRule();
        }
    }
    /**
     * A CSS selector text.
     *
     * E.g.: `.myClass p`
     *
     * @param selector  CSS selector
     */
    set selector(selector) {
        this._rule.selectorText = selector;
    }
    /**
     * @return CSS selector
     */
    get selector() {
        return this._rule.selectorText;
    }
    // TODO test this
    _dispose() {
        // TODO a bit hacky
        const index = $array.indexOf(this._root.cssRules, this._rule);
        if (index === -1) {
            throw new Error("Could not dispose StyleRule");
        }
        else {
            // TODO if it's empty remove it from the DOM ?
            this._root.deleteRule(index);
        }
    }
    /**
     * Sets the same style properties with browser-specific prefixes.
     *
     * @param name   Attribute name
     * @param value  Attribute value
     */
    _setVendorPrefixName(name, value) {
        const style = this._rule.style;
        style.setProperty("-webkit-" + name, value, "");
        style.setProperty("-moz-" + name, value, "");
        style.setProperty("-ms-" + name, value, "");
        style.setProperty("-o-" + name, value, "");
        style.setProperty(name, value, "");
    }
    /**
     * Sets a value for specific style attribute.
     *
     * @param name   Attribute
     * @param value  Value
     */
    setStyle(name, value) {
        if (name === "transition") {
            this._setVendorPrefixName(name, value);
        }
        else {
            this._rule.style.setProperty(name, value, "");
        }
    }
}
/**
 * Defines a class for an entire CSS style sheet.
 *
 * Can be used to dynamically add CSS to the document.
 */
export class StyleSheet extends DisposerClass {
    /**
     * Constructor.
     *
     * @param text  CSS stylesheet
     */
    constructor(element, text, nonce = "") {
        super();
        Object.defineProperty(this, "_element", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this._element = createStylesheet(element, text, nonce);
    }
    _dispose() {
        if (this._element.parentNode) {
            this._element.parentNode.removeChild(this._element);
        }
    }
}
/**
 * Adds a class name to an HTML or SVG element.
 *
 * @ignore Exclude from docs
 * @param element    Element
 * @param className  Class name to add
 */
export function addClass(element, className) {
    if (!element) {
        return;
    }
    if (element.classList) {
        const classes = className.split(" ");
        $array.each(classes, (name) => {
            element.classList.add(name);
        });
    }
    else {
        let currentClassName = element.getAttribute("class");
        if (currentClassName) {
            element.setAttribute("class", currentClassName.split(" ").filter((item) => {
                return item !== className;
            }).join(" ") + " " + className);
        }
        else {
            element.setAttribute("class", className);
        }
    }
}
/**
 * Removes a class name from an HTML or SVG element.
 *
 * @ignore Exclude from docs
 * @param element    Element
 * @param className  Class name to add
 */
export function removeClass(element, className) {
    if (!element) {
        return;
    }
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        let currentClassName = element.getAttribute("class");
        if (currentClassName) {
            element.setAttribute("class", currentClassName.split(" ").filter((item) => {
                return item !== className;
            }).join(" "));
        }
    }
}
// /**
//  * Applies a set of styles to an element. Stores the original styles so they
//  * can be restored later.
//  *
//  * @ignore
//  * @param io      Element
//   */
// export function prepElementForDrag(dom: HTMLElement): void {
// 	// @todo: save current values
// 	// Define possible props
// 	let props = [
// 		"touchAction", "webkitTouchAction", "MozTouchAction", "MSTouchAction", "msTouchAction", "oTouchAction",
// 		"userSelect", "webkitUserSelect", "MozUserSelect", "MSUserSelect", "msUserSelect", "oUserSelect",
// 		"touchSelect", "webkitTouchSelect", "MozTouchSelect", "MSTouchSelect", "msTouchSelect", "oTouchSelect",
// 		"touchCallout", "webkitTouchCallout", "MozTouchCallout", "MSTouchCallout", "msTouchCallout", "oTouchCallout",
// 		"contentZooming", "webkitContentZooming", "MozContentZooming", "MSContentZooming", "msContentZooming", "oContentZooming",
// 		"userDrag", "webkitUserDrag", "MozUserDrag", "MSUserDrag", "msUserDrag", "oUserDrag"
// 	];
// 	for (let i = 0; i < props.length; i++) {
// 		if (props[i] in dom.style) {
// 			setStyle(dom, props[i], "none");
// 		}
// 	}
// 	// Remove iOS-specific selection;
// 	setStyle(dom, "tapHighlightColor", "rgba(0, 0, 0, 0)");
// }
// /**
//  * Restores replaced styles
//  *
//  * @ignore
//  * @param  io  Element
//  */
// export function unprepElementForDrag(dom: HTMLElement): void {
// 	// Define possible props
// 	let props = [
// 		"touchAction", "webkitTouchAction", "MozTouchAction", "MSTouchAction", "msTouchAction", "oTouchAction",
// 		"userSelect", "webkitUserSelect", "MozUserSelect", "MSUserSelect", "msUserSelect", "oUserSelect",
// 		"touchSelect", "webkitTouchSelect", "MozTouchSelect", "MSTouchSelect", "msTouchSelect", "oTouchSelect",
// 		"touchCallout", "webkitTouchCallout", "MozTouchCallout", "MSTouchCallout", "msTouchCallout", "oTouchCallout",
// 		"contentZooming", "webkitContentZooming", "MozContentZooming", "MSContentZooming", "msContentZooming", "oContentZooming",
// 		"userDrag", "webkitUserDrag", "MozUserDrag", "MSUserDrag", "msUserDrag", "oUserDrag"
// 	];
// 	for (let i = 0; i < props.length; i++) {
// 		if (props[i] in dom.style) {
// 			setStyle(dom, props[i], "");
// 		}
// 	}
// 	// Remove iOS-specific selection;
// 	setStyle(dom, "tapHighlightColor", "");
// }
export function iOS() {
    return /apple/i.test(navigator.vendor) && "ontouchend" in document;
}
export function getSafeResolution() {
    return iOS() ? 1 : undefined;
}
export function relativeToValue(percent, full) {
    if ($type.isNumber(percent)) {
        return percent;
    }
    else if (percent != null && $type.isNumber(percent.value) && $type.isNumber(full)) {
        return full * percent.value;
    }
    else {
        return 0;
    }
}
/**
 * Returns number of decimals
 *
 * @ignore Exclude from docs
 * @param number  Input number
 * @return Number of decimals
 */
export function decimalPlaces(number) {
    let match = ('' + number).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
    if (!match) {
        return 0;
    }
    return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
}
/**
 * ============================================================================
 * STRING FORMATTING FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Pads a string with additional characters to certain length.
 *
 * @param value  A numeric value
 * @param len    Result string length in characters
 * @param char   A character to use for padding
 * @return Padded value as string
 */
export function padString(value, len = 0, char = "0") {
    if (typeof value !== "string") {
        value = value.toString();
    }
    return len > value.length ? Array(len - value.length + 1).join(char) + value : value;
}
export function trimLeft(text) {
    return text.replace(/^[\s]*/, "");
}
export function trimRight(text) {
    return text.replace(/[\s]*$/, "");
}
export function trim(text) {
    return trimLeft(trimRight(text));
}
/**
 * Tries to determine format type.
 *
 * @ignore Exclude from docs
 * @param format  Format string
 * @return Format type ("string" | "number" | "date" | "duration")
 */
export function getFormat(format) {
    // Undefined?
    if (typeof format === "undefined") {
        return "string";
    }
    // Cleanup and lowercase format
    format = format.toLowerCase().replace(/^\[[^\]]*\]/, "");
    // Remove style tags
    format = format.replace(/\[[^\]]+\]/, "");
    // Trim
    format = format.trim();
    // Check for any explicit format hints (i.e. /Date)
    let hints = format.match(/\/(date|number|duration)$/);
    if (hints) {
        return hints[1];
    }
    // Check for explicit hints
    if (format === "number") {
        return "number";
    }
    if (format === "date") {
        return "date";
    }
    if (format === "duration") {
        return "duration";
    }
    // Detect number formatting symbols
    if (format.match(/[#0]/)) {
        return "number";
    }
    // Detect date formatting symbols
    if (format.match(/[ymwdhnsqaxkzgtei]/)) {
        return "date";
    }
    // Nothing? Let's display as string
    return "string";
}
/**
 * Cleans up format:
 * * Strips out formatter hints
 *
 * @ignore Exclude from docs
 * @param format  Format
 * @return Cleaned format
 */
export function cleanFormat(format) {
    return format.replace(/\/(date|number|duration)$/i, "");
}
/**
 * Strips all tags from the string.
 *
 * @param text  Source string
 * @return String without tags
 */
export function stripTags(text) {
    return text ? text.replace(/<[^>]*>/g, "") : text;
}
/**
 * Removes new lines and tags from a string.
 *
 * @param text  String to conver
 * @return Converted string
 */
export function plainText(text) {
    return text ? stripTags(("" + text).replace(/[\n\r]+/g, ". ")) : text;
}
/**
 * Escapes string so it can safely be used in a Regex.
 *
 * @param value  Unsescaped string
 * @return Escaped string
 */
export function escapeForRgex(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
/**
 * Adds space before each uppercase letter.
 *
 * @param   str Input string
 * @return      Output string
 */
export function addSpacing(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
        if (char.toUpperCase() == char && i != 0) {
            result += " ";
        }
        result += char;
    }
    return result;
}
/**
 * ============================================================================
 * DATE-RELATED FUNCTIONS
 * ============================================================================
 * @hidden
 */
/**
 * Returns a year day.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Year day
 * @todo Account for UTC
 */
export function getYearDay(date, utc = false) {
    // TODO: utc needed?
    utc;
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date.getTime() - start.getTime()) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}
/**
 * Returns week number for a given date.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Week number
 * @todo Account for UTC
 */
export function getWeek(date, _utc = false) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const firstDay = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - firstDay.getTime()) / 86400000) + 1) / 7);
}
/**
 * Returns a "week year" of the given date.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Year of week
 * @since 5.3.0
 * @todo Account for UTC
 */
export function getWeekYear(date, _utc = false) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const day = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - day);
    const firstDay = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return firstDay.getFullYear();
}
/**
 * Returns a week number in the month.
 *
 * @param date  Source Date
 * @param utc   Assume UTC dates?
 * @return Week number in month
 */
export function getMonthWeek(date, utc = false) {
    const firstWeek = getWeek(new Date(date.getFullYear(), date.getMonth(), 1), utc);
    let currentWeek = getWeek(date, utc);
    if (currentWeek == 1) {
        currentWeek = 53;
    }
    return currentWeek - firstWeek + 1;
}
/**
 * Returns a year day out of the given week number.
 *
 * @param week     Week
 * @param year     Year
 * @param weekday  Weekday
 * @param utc      Assume UTC dates
 * @return Day in a year
 */
export function getDayFromWeek(week, year, weekday = 1, utc = false) {
    let date = new Date(year, 0, 4, 0, 0, 0, 0);
    if (utc) {
        date.setUTCFullYear(year);
    }
    let day = week * 7 + weekday - ((date.getDay() || 7) + 3);
    return day;
}
/**
 * Returns 12-hour representation out of the 24-hour hours.
 *
 * @param hours  24-hour number
 * @return 12-hour number
 */
export function get12Hours(hours, base) {
    if (hours > 12) {
        hours -= 12;
    }
    else if (hours === 0) {
        hours = 12;
    }
    return base != null ? hours + (base - 1) : hours;
}
/**
 * Returns a string name of the time zone.
 *
 * @param date     Date object
 * @param long     Should return long ("Pacific Standard Time") or short abbreviation ("PST")
 * @param savings  Include information if it's in daylight savings mode
 * @param utc      Assume UTC dates
 * @return Time zone name
 */
export function getTimeZone(date, long = false, savings = false, utc = false, timezone) {
    if (utc) {
        return long ? "Coordinated Universal Time" : "UTC";
    }
    else if (timezone) {
        const d1 = date.toLocaleString("en-US", { timeZone: timezone });
        const d2 = date.toLocaleString("en-US", { timeZone: timezone, timeZoneName: long ? "long" : "short" });
        return trim(d2.substr(d1.length));
    }
    let wotz = date.toLocaleString("UTC");
    let wtz = date.toLocaleString("UTC", { timeZoneName: long ? "long" : "short" }).substr(wotz.length);
    //wtz = wtz.replace(/[+-]+[0-9]+$/, "");
    if (savings === false) {
        wtz = wtz.replace(/ (standard|daylight|summer|winter) /i, " ");
    }
    return trim(wtz);
}
export function getTimezoneOffset(timezone) {
    const date = new Date(Date.UTC(2012, 0, 1, 0, 0, 0, 0));
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / 6e4 * -1;
}
export function capitalizeFirst(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
/**
 * The functions below are taken and adapted from Garry Tan's blog post:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * The further attributions go mjijackson.com, which now seems to be defunct.
 */
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * Function adapted from:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * @ignore Exclude from docs
 * @param h       The hue
 * @param s       The saturation
 * @param l       The lightness
 * @return The RGB representation
 */
export function hslToRgb(color) {
    let r, g, b;
    let h = color.h;
    let s = color.s;
    let l = color.l;
    if (s == 0) {
        r = g = b = l; // achromatic
    }
    else {
        let hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        };
        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}
/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * Function adapted from:
 * http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
 *
 * @ignore Exclude from docs
 * @param r       The red color value
 * @param g       The green color value
 * @param b       The blue color value
 * @return The HSL representation
 */
export function rgbToHsl(color) {
    let r = color.r / 255;
    let g = color.g / 255;
    let b = color.b / 255;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;
    if (max === min) {
        h = s = 0; // achromatic
    }
    else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return {
        h: h,
        s: s,
        l: l
    };
}
/**
 * Returns a color that is `percent` brighter than the reference color.
 *
 * @ignore Exclude from docs
 * @param color    Reference color
 * @param percent  Brightness percent
 * @return Hex code of the new color
 */
export function lighten(rgb, percent) {
    if (rgb) {
        return {
            r: Math.max(0, Math.min(255, rgb.r + getLightnessStep(rgb.r, percent))),
            g: Math.max(0, Math.min(255, rgb.g + getLightnessStep(rgb.g, percent))),
            b: Math.max(0, Math.min(255, rgb.b + getLightnessStep(rgb.b, percent))),
            a: rgb.a
        };
    }
    else {
        // TODO is this correct ?
        return rgb;
    }
}
;
/**
 * Gets lightness step.
 *
 * @ignore Exclude from docs
 * @param value    Value
 * @param percent  Percent
 * @return Step
 */
export function getLightnessStep(value, percent) {
    let base = percent > 0 ? 255 - value : value;
    return Math.round(base * percent);
}
/**
 * Returns a color that is `percent` brighter than the source `color`.
 *
 * @ignore Exclude from docs
 * @param color    Source color
 * @param percent  Brightness percent
 * @return New color
 */
export function brighten(rgb, percent) {
    if (rgb) {
        let base = Math.min(Math.max(rgb.r, rgb.g, rgb.b), 230);
        //let base = Math.max(rgb.r, rgb.g, rgb.b);
        let step = getLightnessStep(base, percent);
        return {
            r: Math.max(0, Math.min(255, Math.round(rgb.r + step))),
            g: Math.max(0, Math.min(255, Math.round(rgb.g + step))),
            b: Math.max(0, Math.min(255, Math.round(rgb.b + step))),
            a: rgb.a
        };
    }
    else {
        // TODO is this correct ?
        return rgb;
    }
}
;
/**
 * Returns brightness step.
 *
 * @ignore Exclude from docs
 * @param value    Value
 * @param percent  Percent
 * @return Step
 */
export function getBrightnessStep(_value, percent) {
    let base = 255; //percent > 0 ? 255 - value : value;
    return Math.round(base * percent);
}
/**
 * Returns `true` if color is "light". Useful indetermining which contrasting
 * color to use for elements over this color. E.g.: you would want to use
 * black text over light background, and vice versa.
 *
 * @ignore Exclude from docs
 * @param color  Source color
 * @return Light?
 */
export function isLight(color) {
    return ((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000 >= 128;
}
/**
 * Returns a new [[iRGB]] object based on `rgb` parameter with specific
 * saturation applied.
 *
 * `saturation` can be in the range of 0 (fully desaturated) to 1 (fully
 * saturated).
 *
 * @ignore Exclude from docs
 * @param color       Base color
 * @param saturation  Saturation (0-1)
 * @return New color
 */
export function saturate(rgb, saturation) {
    if (rgb === undefined || saturation == 1) {
        return rgb;
    }
    let hsl = rgbToHsl(rgb);
    hsl.s = saturation;
    return hslToRgb(hsl);
}
export function alternativeColor(color, lightAlternative = { r: 255, g: 255, b: 255 }, darkAlternative = { r: 255, g: 255, b: 255 }) {
    let light = lightAlternative;
    let dark = darkAlternative;
    if (isLight(darkAlternative)) {
        light = darkAlternative;
        dark = lightAlternative;
    }
    return isLight(color) ? dark : light;
}
/**
 * @ignore
 * @deprecated
 */
// export function unshiftThemeClass(settings: any, themeClass: string) {
// 	let themeClasses = settings.themeClasses;
// 	if (!themeClasses) {
// 		themeClasses = [];
// 	}
// 	themeClasses.unshift(themeClass);
// 	settings.themeClasses = themeClasses;
// }
/**
 * @ignore
 * @deprecated
 */
// export function pushThemeClass(settings: any, themeClass: string) {
// 	let themeClasses = settings.themeClasses;
// 	if (!themeClasses) {
// 		themeClasses = [];
// 	}
// 	themeClasses.push(themeClass);
// 	settings.themeClasses = themeClasses;
// }
/**
 * @ignore
 */
export function mergeTags(tags1, tags2) {
    if (!tags1) {
        tags1 = [];
    }
    return [...tags1, ...tags2].filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
}
/**
 * @ignore
 */
export function sameBounds(a, b) {
    if (!b) {
        return false;
    }
    if (a.left != b.left) {
        return false;
    }
    if (a.right != b.right) {
        return false;
    }
    if (a.top != b.top) {
        return false;
    }
    if (a.bottom != b.bottom) {
        return false;
    }
    return true;
}
//# sourceMappingURL=Utils.js.map