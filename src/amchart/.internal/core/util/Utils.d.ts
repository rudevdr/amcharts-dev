import type { Percent } from "./Percent";
import type { IPointerEvent } from "../render/backend/Renderer";
import type { Sprite } from "../render/Sprite";
import * as $type from "./Type";
import type { IBounds } from "./IBounds";
import { DisposerClass, IDisposer } from "./Disposer";
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
export declare function ready(f: () => void): void;
/**
 * Removes a DOM element.
 * @param  el  Target element
 */
export declare function removeElement(el: HTMLElement): void;
/**
 * Function that adds a disposable event listener directly to a DOM element.
 *
 * @ignore Exclude from docs
 * @param dom       A DOM element to add event to
 * @param type      Event type
 * @param listener  Event listener
 * @returns Disposable event
 */
export declare function addEventListener<E extends Event>(dom: EventTarget, type: string, listener: (event: E) => void, options?: any): IDisposer;
/**
 * Function that adds an event listener which is triggered when the browser's zoom changes.
 *
 * @param listener  Event listener
 * @returns Disposable event
 */
export declare function onZoom(listener: () => void): IDisposer;
/**
 * @ignore
 */
export declare function supports(cap: "touchevents" | "pointerevents" | "mouseevents" | "wheelevents" | "keyboardevents"): boolean;
/**
 * @ignore
 */
export declare function getPointerId(event: IPointerEvent): any;
/**
 * Removes focus from any element by shifting focus to body.
 *
 * @ignore
 */
export declare function blur(): void;
/**
 * Focuses element.
 *
 * @ignore
 */
export declare function focus(el: HTMLElement): void;
/**
 * @ignore
 */
export declare function getRendererEvent(key: string): string;
/**
 * Determines if pointer event originated from a touch pointer or mouse.
 *
 * @param ev  Original event
 * @return Touch pointer?
 */
export declare function isTouchEvent(ev: MouseEvent | Touch): boolean;
/**
 * Sets style property on DOM element.
 *
 * @ignore Exclude from docs
 */
export declare function setStyle(dom: HTMLElement, property: string, value: string | undefined): void;
export declare function getStyle(dom: HTMLElement, property: string): string | undefined;
/**
 * Gets the target of the event, works for shadow DOM too.
 */
export declare function getEventTarget(event: Event | Touch): Node | null;
/**
 * Checks of element `a` contains element `b`.
 *
 * @param a  Aleged ascendant
 * @param b  Aleged descendant
 * @return Contains?
 */
export declare function contains(a: Element, b: Element): boolean;
/**
 * Returns `true` if pointer event originated on an element within Root.
 *
 * @since 5.2.8
 * @param  event   Event
 * @param  target  Target element
 */
export declare function isLocalEvent(event: IPointerEvent, target: Sprite): boolean | null;
/**
 * Disables or enables interactivity of a DOM element.
 *
 * @param  target       Target element
 * @param  interactive  Interactive?
 */
export declare function setInteractive(target: HTMLElement, interactive: boolean): void;
/**
 * Returns the shadow root of the element or null
 *
 * @param a  Node
 * @return Root
 */
export declare function getShadowRoot(a: Node): ShadowRoot | null;
/**
 * Defines a class for a CSS rule.
 *
 * Can be used to dynamically add CSS to the document.
 */
export declare class StyleRule extends DisposerClass {
    private _root;
    /**
     * CSS rule.
     */
    private _rule;
    /**
     * A CSS selector text.
     *
     * E.g.: `.myClass p`
     *
     * @param selector  CSS selector
     */
    set selector(selector: string);
    /**
     * @return CSS selector
     */
    get selector(): string;
    /**
     * Constructor.
     *
     * @param selector  CSS selector
     * @param styles    An object of style attribute - value pairs
     */
    constructor(element: ShadowRoot | null, selector: string, styles: {
        [name: string]: string;
    }, nonce?: string);
    protected _dispose(): void;
    /**
     * Sets the same style properties with browser-specific prefixes.
     *
     * @param name   Attribute name
     * @param value  Attribute value
     */
    private _setVendorPrefixName;
    /**
     * Sets a value for specific style attribute.
     *
     * @param name   Attribute
     * @param value  Value
     */
    setStyle(name: string, value: string): void;
}
/**
 * Defines a class for an entire CSS style sheet.
 *
 * Can be used to dynamically add CSS to the document.
 */
export declare class StyleSheet extends DisposerClass {
    private _element;
    /**
     * Constructor.
     *
     * @param text  CSS stylesheet
     */
    constructor(element: ShadowRoot | null, text: string, nonce?: string);
    protected _dispose(): void;
}
/**
 * Adds a class name to an HTML or SVG element.
 *
 * @ignore Exclude from docs
 * @param element    Element
 * @param className  Class name to add
 */
export declare function addClass(element: HTMLElement | SVGElement, className: string): void;
/**
 * Removes a class name from an HTML or SVG element.
 *
 * @ignore Exclude from docs
 * @param element    Element
 * @param className  Class name to add
 */
export declare function removeClass(element: HTMLElement, className: string): void;
export declare function iOS(): boolean;
export declare function getSafeResolution(): number | undefined;
export declare function relativeToValue(percent: number | Percent | undefined | null, full: number): number;
/**
 * Returns number of decimals
 *
 * @ignore Exclude from docs
 * @param number  Input number
 * @return Number of decimals
 */
export declare function decimalPlaces(number: number): number;
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
export declare function padString(value: any, len?: number, char?: string): string;
export declare function trimLeft(text: string): string;
export declare function trimRight(text: string): string;
export declare function trim(text: string): string;
/**
 * Tries to determine format type.
 *
 * @ignore Exclude from docs
 * @param format  Format string
 * @return Format type ("string" | "number" | "date" | "duration")
 */
export declare function getFormat(format: string): string;
/**
 * Cleans up format:
 * * Strips out formatter hints
 *
 * @ignore Exclude from docs
 * @param format  Format
 * @return Cleaned format
 */
export declare function cleanFormat(format: string): string;
/**
 * Strips all tags from the string.
 *
 * @param text  Source string
 * @return String without tags
 */
export declare function stripTags(text: string): string;
/**
 * Removes new lines and tags from a string.
 *
 * @param text  String to conver
 * @return Converted string
 */
export declare function plainText(text: string): string;
/**
 * Escapes string so it can safely be used in a Regex.
 *
 * @param value  Unsescaped string
 * @return Escaped string
 */
export declare function escapeForRgex(value: string): string;
/**
 * Adds space before each uppercase letter.
 *
 * @param   str Input string
 * @return      Output string
 */
export declare function addSpacing(str: string): string;
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
export declare function getYearDay(date: Date, utc?: boolean): number;
/**
 * Returns week number for a given date.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Week number
 * @todo Account for UTC
 */
export declare function getWeek(date: Date, _utc?: boolean): number;
/**
 * Returns a "week year" of the given date.
 *
 * @param date  Date
 * @param utc   Assume UTC dates?
 * @return Year of week
 * @since 5.3.0
 * @todo Account for UTC
 */
export declare function getWeekYear(date: Date, _utc?: boolean): number;
/**
 * Returns a week number in the month.
 *
 * @param date  Source Date
 * @param utc   Assume UTC dates?
 * @return Week number in month
 */
export declare function getMonthWeek(date: Date, utc?: boolean): number;
/**
 * Returns a year day out of the given week number.
 *
 * @param week     Week
 * @param year     Year
 * @param weekday  Weekday
 * @param utc      Assume UTC dates
 * @return Day in a year
 */
export declare function getDayFromWeek(week: number, year: number, weekday?: number, utc?: boolean): number;
/**
 * Returns 12-hour representation out of the 24-hour hours.
 *
 * @param hours  24-hour number
 * @return 12-hour number
 */
export declare function get12Hours(hours: number, base?: number): number;
/**
 * Returns a string name of the time zone.
 *
 * @param date     Date object
 * @param long     Should return long ("Pacific Standard Time") or short abbreviation ("PST")
 * @param savings  Include information if it's in daylight savings mode
 * @param utc      Assume UTC dates
 * @return Time zone name
 */
export declare function getTimeZone(date: Date, long?: boolean, savings?: boolean, utc?: boolean, timezone?: string): string;
export declare function getTimezoneOffset(timezone: string): number;
export declare function capitalizeFirst(text: string): string;
/**
 * ============================================================================
 * COLOR UTILS
 * ============================================================================
 */
/**
 * Represents an interface for an object that represents an RGB color.
 */
export interface iRGB {
    r: number;
    g: number;
    b: number;
    a?: number;
}
/**
 * Represents an interface for an object that represents an HSL color.
 */
export interface iHSL {
    h: number;
    s: number;
    l: number;
    a?: number;
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
export declare function hslToRgb(color: iHSL): iRGB;
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
export declare function rgbToHsl(color: iRGB): iHSL;
/**
 * Returns a color that is `percent` brighter than the reference color.
 *
 * @ignore Exclude from docs
 * @param color    Reference color
 * @param percent  Brightness percent
 * @return Hex code of the new color
 */
export declare function lighten(rgb: $type.Optional<iRGB>, percent: number): $type.Optional<iRGB>;
/**
 * Gets lightness step.
 *
 * @ignore Exclude from docs
 * @param value    Value
 * @param percent  Percent
 * @return Step
 */
export declare function getLightnessStep(value: number, percent: number): number;
/**
 * Returns a color that is `percent` brighter than the source `color`.
 *
 * @ignore Exclude from docs
 * @param color    Source color
 * @param percent  Brightness percent
 * @return New color
 */
export declare function brighten(rgb: $type.Optional<iRGB>, percent: number): $type.Optional<iRGB>;
/**
 * Returns brightness step.
 *
 * @ignore Exclude from docs
 * @param value    Value
 * @param percent  Percent
 * @return Step
 */
export declare function getBrightnessStep(_value: number, percent: number): number;
/**
 * Returns `true` if color is "light". Useful indetermining which contrasting
 * color to use for elements over this color. E.g.: you would want to use
 * black text over light background, and vice versa.
 *
 * @ignore Exclude from docs
 * @param color  Source color
 * @return Light?
 */
export declare function isLight(color: iRGB): boolean;
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
export declare function saturate(rgb: $type.Optional<iRGB>, saturation: number): $type.Optional<iRGB>;
export declare function alternativeColor(color: iRGB, lightAlternative?: iRGB, darkAlternative?: iRGB): iRGB;
/**
 * @ignore
 * @deprecated
 */
/**
 * @ignore
 * @deprecated
 */
/**
 * @ignore
 */
export declare function mergeTags(tags1: string[] | undefined, tags2: string[]): string[];
/**
 * @ignore
 */
export declare function sameBounds(a: IBounds, b?: IBounds): boolean;
//# sourceMappingURL=Utils.d.ts.map