import type { IAnimation } from "./util/Animation";
import type { Entity } from "./util/Entity";
import type { Sprite } from "./render/Sprite";
import type { Theme } from "./Theme";
import type { IPoint } from "./util/IPoint";
import type { IRenderer } from "./render/backend/Renderer";
import type { Timezone } from "./util/Timezone";
import { Container } from "./render/Container";
import { Text } from "./render/Text";
import { VerticalLayout } from "./render/VerticalLayout";
import { IDisposer } from "./util/Disposer";
import { InterfaceColors } from "./util/InterfaceColors";
import { Tooltip } from "./render/Tooltip";
import { NumberFormatter } from "./util/NumberFormatter";
import { DateFormatter } from "./util/DateFormatter";
import { DurationFormatter } from "./util/DurationFormatter";
import { ILocale, Language } from "./util/Language";
import { Events, EventDispatcher } from "./util/EventDispatcher";
/**
 * @ignore
 */
interface IParent extends Entity {
    _prepareChildren(): void;
    _updateChildren(): void;
}
interface IBounds extends Entity {
    depth(): number;
    _updateBounds(): void;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IRootEvents {
    framestarted: {
        timestamp: number;
    };
    frameended: {
        timestamp: number;
    };
}
export interface IRootSettings {
    /**
     * Indicates whether chart should use "safe" resolution on some memory-limiting
     * platforms such as Safari.
     *
     * @default true
     */
    useSafeResolution?: boolean;
    /**
     * Allows defining margins around chart area for tooltips to go outside the
     * chart itself.
     *
     * @since 5.2.24
     */
    tooltipContainerBounds?: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    /**
     * Set to `false` to disable all accessibility features.
     *
     * NOTE: once disabled, accessibility cannot be re-enabled on a live `Root` object.
     *
     * @default true
     * @since 5.3.0
     */
    accessible?: boolean;
    /**
     * If set to `true`, the parent inner `<div>` element will become a focusable
     * element.
     *
     * @since 5.3.17
     * @default false
     * @see {@link https://www.amcharts.com/docs/v5/concepts/accessibility/#Accessibility_of_Root_element} for more info
     */
    focusable?: boolean;
    /**
     * Distance between focused element and its highlight square in pixels.
     *
     * @since 5.6.0
     * @default 2
     */
    focusPadding?: number;
    /**
     * If set to some string, it will be used as inner `<div>` ARIA-LABEL.
     *
     * Should be used in conjuction with `focusable`.
     *
     * @since 5.3.17
     * @see {@link https://www.amcharts.com/docs/v5/concepts/accessibility/#Accessibility_of_Root_element} for more info
     */
    ariaLabel?: string;
    /**
     * Allows setting a "role" for the inner `<div>`.
     *
     * @since 5.3.17
     * @see {@link https://www.amcharts.com/docs/v5/concepts/accessibility/#Accessibility_of_Root_element} for more info
     */
    role?: string;
    /**
     * Allows for specifying a custom width / height for the chart.
     *
     * This function will be called automatically when the chart is resized.
     */
    calculateSize?: (dimensions: DOMRect) => ISize;
}
/**
 * Root element of the chart.
 *
 * @see {@link https://www.amcharts.com/docs/v5/getting-started/#Root_element} for more info
 */
export declare class Root implements IDisposer {
    /**
     * A reference to original chart container (div element).
     */
    dom: HTMLElement;
    _inner: HTMLElement;
    protected _settings: IRootSettings;
    protected _isDirty: boolean;
    protected _isDirtyParents: boolean;
    protected _dirty: {
        [id: number]: Entity;
    };
    protected _dirtyParents: {
        [id: number]: IParent;
    };
    protected _dirtyBounds: {
        [id: number]: IBounds;
    };
    protected _dirtyPositions: {
        [id: number]: Sprite;
    };
    protected _ticker: ((currentTime: number) => void) | null;
    protected _tickers: Array<(currentTime: number) => void>;
    protected _updateTick: boolean;
    /**
     * Root's event dispatcher.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/events/} for more info
     */
    events: EventDispatcher<Events<this, IRootEvents>>;
    /**
     * @ignore
     * @todo needs description
     */
    animationTime: number | null;
    private _animations;
    _renderer: IRenderer;
    _rootContainer: Container;
    /**
     * Main content container.
     */
    container: Container;
    /**
     * A [[Container]] used to display tooltips in.
     */
    tooltipContainer: Container;
    protected _tooltipContainerSettings: {
        top: number;
        left: number;
        right: number;
        bottom: number;
    };
    _tooltip: Tooltip;
    /**
     * @ignore
     */
    language: Language;
    /**
     * Locale used by the chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/locales/}
     */
    locale: ILocale;
    /**
     * Use UTC when formatting date/time.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-dates/#utc-and-time-zones} for more info
     */
    utc: boolean;
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
    timezone?: Timezone;
    /**
     * The maximum FPS that the Root will run at.
     *
     * If `undefined` it will run at the highest FPS.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/root-element/#Performance} for more info
     */
    fps: number | undefined;
    /**
     * Number formatter.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-numbers/} for more info
     */
    numberFormatter: NumberFormatter;
    /**
     * Date/time formatter.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-dates/} for more info
     */
    dateFormatter: DateFormatter;
    /**
     * Duration formatter.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/formatters/formatting-dates/} for more info
     */
    durationFormatter: DurationFormatter;
    /**
     * Global tab index for using for the whole chart
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/accessibility/} for more info
     */
    tabindex: number;
    protected _tabindexes: Sprite[];
    protected _a11yD: boolean;
    protected _focusElementDirty: boolean;
    protected _focusElementContainer: HTMLDivElement | undefined;
    protected _focusedSprite: Sprite | undefined;
    protected _isShift: boolean | undefined;
    protected _keyboardDragPoint: IPoint | undefined;
    protected _tooltipElementContainer: HTMLDivElement | undefined;
    protected _readerAlertElement: HTMLDivElement | undefined;
    _logo?: Container;
    _tooltipDiv: HTMLDivElement | undefined;
    /**
     * Used for dynamically-created CSS and JavaScript with strict source policies.
     */
    nonce?: string;
    /**
     * Special color set to be used for various controls.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/#Interface_colors} for more info
     */
    interfaceColors: InterfaceColors;
    /**
     * An instance of vertical layout object that can be used to set `layout` setting
     * of a [[Container]].
     *
     * @default VerticalLayout.new()
     */
    verticalLayout: VerticalLayout;
    /**
     * An instance of horizontal layout object that can be used to set `layout` setting
     * of a [[Container]].
     *
     * @default HorizontalLayout.new()
     */
    horizontalLayout: VerticalLayout;
    /**
     * An instance of grid layout object that can be used to set `layout` setting
     * of a [[Container]].
     *
     * @default VerticalLayout.new()
     */
    gridLayout: VerticalLayout;
    _paused: boolean;
    /**
     * Indicates whether chart should resized automatically when parent container
     * width and/or height changes.
     *
     * If disabled (`autoResize = false`) you can make the chart resize manually
     * by calling root element's `resize()` method.
     */
    autoResize: boolean;
    protected _fontHash: string;
    protected _isDisposed: boolean;
    protected _disposers: Array<IDisposer>;
    protected _resizeSensorDisposer?: IDisposer;
    _tooltips: Array<Tooltip>;
    protected _htmlElementContainer: HTMLDivElement | undefined;
    protected _htmlEnabledContainers: Container[];
    protected constructor(id: string | HTMLElement, settings: IRootSettings | undefined, isReal: boolean);
    static new(id: string | HTMLElement, settings?: IRootSettings): Root;
    moveDOM(id: string | HTMLElement): void;
    protected _handleLogo(): void;
    _showBranding(): void;
    protected _getRealSize(): DOMRect;
    protected _getCalculatedSize(rect: DOMRect): ISize;
    protected _init(): void;
    private _initResizeSensor;
    /**
     * If automatic resizing of char is disabled (`root.autoResize = false`), it
     * can be resized manually by calling this method.
     */
    resize(): void;
    private _render;
    private _runTickers;
    private _runAnimations;
    private _runDirties;
    private _renderFrame;
    _runTicker(currentTime: number, now?: boolean): void;
    _runTickerNow(timeout?: number): void;
    private _startTicker;
    /**
     * Returns whether the root is updating or not.
     */
    get updateTick(): boolean;
    /**
     * Enables or disables the root updating.
     */
    set updateTick(value: boolean);
    _addDirtyEntity(entity: Entity): void;
    _addDirtyParent(parent: IParent): void;
    _addDirtyBounds(entity: IBounds): void;
    _addDirtyPosition(sprite: Sprite): void;
    _addAnimation(animation: IAnimation): void;
    _markDirty(): void;
    _markDirtyRedraw(): void;
    eachFrame(f: (currentTime: number) => void): IDisposer;
    markDirtyGlobal(container?: Container): void;
    /**
     * Returns width of the target container, in pixels.
     *
     * @return Width
     */
    width(): number;
    /**
     * Returns height of the target container, in pixels.
     *
     * @return Height
     */
    height(): number;
    /**
     * Disposes root and all the content in it.
     */
    dispose(): void;
    /**
     * Returns `true` if root element is disposed.
     *
     * @return Disposed?
     */
    isDisposed(): boolean;
    /**
     * Triggers screen reader read out a message.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/accessibility/} for more info
     * @param  text  Alert text
     */
    readerAlert(text: string): void;
    /**
     * Sets themes to be used for the chart.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/themes/} for more info
     * @param  themes  A list of themes
     */
    setThemes(themes: Array<Theme>): void;
    protected _addTooltip(): void;
    /**
     * Accesibility
     */
    _registerTabindexOrder(target: Sprite): void;
    _unregisterTabindexOrder(target: Sprite): void;
    _invalidateTabindexes(): void;
    _updateCurrentFocus(): void;
    _decorateFocusElement(target: Sprite, focusElement?: HTMLDivElement): void;
    _makeFocusElement(index: number, target: Sprite): void;
    _removeFocusElement(target: Sprite): void;
    _hideFocusElement(target: Sprite): void;
    protected _moveFocusElement(index: number, target: Sprite): void;
    protected _positionFocusElement(target: Sprite): void;
    protected _handleFocus(ev: FocusEvent, index: number): void;
    protected _focusNext(el: HTMLDivElement, direction: 1 | -1): void;
    protected _handleBlur(ev: FocusEvent, _index: number): void;
    /**
     * @ignore
     */
    updateTooltip(target: Text): void;
    _makeTooltipElement(target: Text): HTMLDivElement;
    _removeTooltipElement(target: Text): void;
    _invalidateAccessibility(target: Sprite): void;
    /**
     * Returns `true` if `target` is currently focused.
     *
     * @param   target  Target
     * @return          Focused?
     */
    focused(target: Sprite): boolean;
    /**
     * Converts document coordinates to coordinates withing root element.
     *
     * @param   point  Document point
     * @return         Root point
     */
    documentPointToRoot(point: IPoint): IPoint;
    /**
     * Converts root coordinates to document
     *
     * @param   point  Document point
     * @return         Root point
     */
    rootPointToDocument(point: IPoint): IPoint;
    /**
     * @ignore
     */
    addDisposer<T extends IDisposer>(disposer: T): T;
    protected _updateComputedStyles(): boolean;
    protected _checkComputedStyles(): void;
    protected _invalidateLabelBounds(target: Sprite): void;
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
    protected _hasLicense(): boolean;
    _licenseApplied(): void;
    /**
     * @ignore
     */
    get debugGhostView(): boolean;
    /**
     * @ignore
     */
    set debugGhostView(value: boolean);
    /**
     * Set this to `true` if you need chart to require first a tap onto it before
     * touch gesture related functionality like zoom/pan is turned on.
     *
     * @see {@link https://www.amcharts.com/docs/v5/getting-started/root-element/#Touch_related_options} for more info
     * @default false
     * @since 5.2.9
     * @param  value  Needs a tap to activate touch functions
     */
    set tapToActivate(value: boolean);
    /**
     * @return Needs a tap to activate touch functions
     */
    get tapToActivate(): boolean;
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
    set tapToActivateTimeout(value: number);
    /**
     * @return Timeout
     */
    get tapToActivateTimeout(): number;
    _makeHTMLElement(target: Container): HTMLDivElement;
    _positionHTMLElements(): void;
    _positionHTMLElement(target: Container): void;
    _setHTMLContent(target: Container, html: string): void;
    _removeHTMLContent(target: Container): void;
}
export {};
//# sourceMappingURL=Root.d.ts.map