import type { IDisplayObject, IRendererEvents, IRendererEvent, IPointerEvent, IMargin } from "./backend/Renderer";
import type { IBounds } from "../util/IBounds";
import type { Container } from "./Container";
import type { IAccessibilitySettings } from "../util/Accessibility";
import type { NumberFormatter } from "../util/NumberFormatter";
import type { DateFormatter } from "../util/DateFormatter";
import type { DurationFormatter } from "../util/DurationFormatter";
import type { DataItem, IComponentDataItem } from "./Component";
import type { Graphics } from "./Graphics";
import type { IPoint } from "../util/IPoint";
import type { ListTemplate } from "../util/List";
import type { Tooltip } from "./Tooltip";
import { Entity, IEntitySettings, IEntityPrivate, IEntityEvents } from "../util/Entity";
import { Template } from "../util/Template";
import { Percent } from "../util/Percent";
import { EventDispatcher, Events, EventListener } from "../util/EventDispatcher";
import { IDisposer, MultiDisposer, CounterDisposer } from "../util/Disposer";
/**
 * An [[EventDispatcher]] for [[Sprite]].
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/events/} for more info
 */
declare class SpriteEventDispatcher<Target, E extends Events<Target, ISpriteEvents>> extends EventDispatcher<E> {
    protected static RENDERER_EVENTS: {
        [K in keyof IRendererEvents]?: <E extends Events<Sprite, ISpriteEvents>>(this: SpriteEventDispatcher<Sprite, E>, event: IRendererEvents[K]) => void;
    };
    protected _sprite: Sprite;
    protected _rendererDisposers: {
        [K in keyof IRendererEvents]?: CounterDisposer;
    };
    protected _dispatchParents: boolean;
    constructor(sprite: Sprite);
    protected _makePointerEvent<K extends keyof E>(key: K, event: IRendererEvent<IPointerEvent>): ISpritePointerEvent & {
        type: K;
    };
    protected _onRenderer<Key extends keyof IRendererEvents>(key: Key, dispatch: (this: this, event: IRendererEvents[Key]) => void): IDisposer;
    protected _on<C, Key extends keyof E>(once: boolean, type: Key | null, callback: any, context: C, shouldClone: boolean, dispatch: (type: Key, event: E[Key]) => void): EventListener;
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
    stopParentDispatch(): void;
    /**
     * @ignore
     */
    dispatchParents<Key extends keyof E>(type: Key, event: E[Key]): void;
}
export interface ISpriteSettings extends IEntitySettings, IAccessibilitySettings {
    /**
     * X position relative to parent.
     */
    x?: number | Percent | null;
    /**
     * Y position relative to parent.
     */
    y?: number | Percent | null;
    /**
     * Element's absolute width in pixels (numeric value) or relative width to
     * parent ([[Percent]]);
     */
    width?: number | Percent | null;
    /**
     * Element's absolute height in pixels (numeric value) or relative height to
     * parent ([[Percent]]);
     */
    height?: number | Percent | null;
    /**
     * Maximum allowed width in pixels.
     */
    maxWidth?: number | null;
    /**
     * Maximum allowed height in pixels.
     */
    maxHeight?: number | null;
    /**
     * Minimum allowed width in pixels.
     */
    minWidth?: number | null;
    /**
     * Minimum allowed height in pixels.
     */
    minHeight?: number | null;
    /**
     * Opacity. 0 - fully transparent; 1 - fully opaque.
     */
    opacity?: number;
    /**
     * Rotation in degrees.
     */
    rotation?: number;
    /**
     * Scale.
     *
     * Setting to a value less than 1 will shrink object.
     */
    scale?: number;
    /**
     * X coordinate of the center of the element relative to itself.
     *
     * Center coordinates will affect placement as well as rotation pivot point.
     */
    centerX?: number | Percent;
    /**
     * Y coordinate of the center of the element relative to itself.
     *
     * Center coordinates will affect placement as well as rotation pivot point.
     */
    centerY?: number | Percent;
    /**
     * Left margin in pixels.
     */
    marginLeft?: number;
    /**
     * Right margin in pixels.
     */
    marginRight?: number;
    /**
     * Top margin in pixels.
     */
    marginTop?: number;
    /**
     * Bottom margin in pixels.
     */
    marginBottom?: number;
    /**
     * Is element visible?
     */
    visible?: boolean;
    /**
     * Positioning of the element.
     *
     * `"absolute"` means element will not participate in parent layout scheme,
     * and will be positioned solely accoridng its `x` and `y` settings.
     */
    position?: "absolute" | "relative";
    /**
     * Horizontal shift in pixels. Can be negative to shift leftward.
     */
    dx?: number;
    /**
     * Vertical shift in pixels. Can be negative to shift upward.
     */
    dy?: number;
    /**
     * Should this element accept user interaction events?
     */
    interactive?: boolean;
    /**
     * Text to show in a tooltip when hovered.
     */
    tooltipText?: string;
    /**
     * HTML content to show in a tooltip when hovered.
     *
     * @since 5.2.11
     */
    tooltipHTML?: string;
    /**
     * Tooltip pointer X coordinate relative to the element itself.
     */
    tooltipX?: number | Percent;
    /**
     * Tooltip pointer Y coordinate relative to the element itself.
     */
    tooltipY?: number | Percent;
    /**
     * [[Tooltip]] instance.
     */
    tooltip?: Tooltip;
    /**
     * Tooltip position.
     */
    tooltipPosition?: "fixed" | "pointer";
    /**
     * If set to `false` element will not be measured and cannot participate in
     * layout schemes.
     */
    isMeasured?: boolean;
    /**
     * Allows binding element's settings to data.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/settings/template-fields/} for more info
     */
    templateField?: string;
    /**
     * If set to `true`, user will be able to drag this element. It will also
     * disable default drag events over the area of this element.
     */
    draggable?: boolean;
    /**
     * If set to `true`, mouse wheel events will be triggered over the element. It
     * will also disable page scrolling using mouse wheel when pointer is over
     * the element.
     */
    wheelable?: boolean;
    /**
     * An instance of [[NumberFormatter]] that should be used instead of global
     * formatter object.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     */
    numberFormatter?: NumberFormatter | undefined;
    /**
     * An instance of [[DateFormatter]] that should be used instead of global
     * formatter object.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     */
    dateFormatter?: DateFormatter | undefined;
    /**
     * An instance of [[DurationFormatter]] that should be used instead of global
     * formatter object.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     */
    durationFormatter?: DurationFormatter | undefined;
    /**
     * If set, element will toggle specified boolean setting between `true` and
     * `false` when clicked/touched.
     */
    toggleKey?: "disabled" | "active" | "none" | undefined;
    /**
     * Indicates if element is currently active.
     */
    active?: boolean;
    /**
     * Indicates if element is disabled.
     */
    disabled?: boolean;
    /**
     * An SVG filter to apply to the element.
     *
     * IMPORTANT: SVG filters are not supported in some browsers, e.g. Safari.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/filters/#SVG_filters} for more info
     * @ignore todo: figure out if we still need this
     */
    filter?: string;
    /**
     * A named mouse cursor style to show when hovering this element.
     *
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/CSS/cursor} for more info
     */
    cursorOverStyle?: string;
    /**
     * If set to `false` this element will not appear in exported snapshots of
     * the chart.
     */
    exportable?: boolean;
    /**
     * Numeric layer to put element in.
     *
     * Elements with higher number will appear in front of the ones with lower
     * numer.
     *
     * If not set, will inherit layer from its ascendants.
     */
    layer?: number;
    /**
     * Margins for the layer.
     *
     * Can be used to make the layer larger/or smaller than default chart size.
     *
     * @since @5.2.39
     */
    layerMargin?: IMargin;
    /**
     * If set to `true` the element will be hidden regardless of `visible` or
     * even if `show()` is called.
     */
    forceHidden?: boolean;
    /**
     * If set to `true` the element will be inactive - absolutely oblivious
     * to all interactions, even if there are related events set, or
     * the `interactive: true` is set.
     *
     * @since 5.0.21
     */
    forceInactive?: boolean;
    /**
     * Defines when tooltip is shown over the element.
     *
     * Available options:
     * * `"hover"` (default) - tooltip is shown when element is hovered by a pointer or touched. It is hidden as soon as element is not hovered anymore, or touch occurs outside it.
     * * `"always"` - a tooltip will always be shown over the element, without any interactions. Please note that if you need to show tooltips for multiple elements at the same time, you need to explicitly create a `Tooltip` instance and set element's `tooltip` setting with it.
     * * '"click"' - a tooltip will only appear when target element is clicked/tapped. Tooltip will hide when clicking anywhere else on the page.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/tooltips/#Sticky_tooltips} for more info
     * @default "hover"
     * @since 5.0.16
     */
    showTooltipOn?: "hover" | "always" | "click";
    /**
     * If set to `true`, an element will try to draw itself in such way, that it
     * looks crisp on screen, with minimal anti-aliasing.
     *
     * It will round x/y position so it is positioned fine "on pixel".
     *
     * It will also adjust `strokeWidth` based on device pixel ratio or zoom,
     * so the line might look thinner than expected.
     *
     * NOTE: this is might not universally work, especially when set on several
     * objects that are supposed to fit perfectly with each other.
     *
     * @default false
     * @since 5.3.0
     */
    crisp?: boolean;
    /**
     * Apply blur filter.
     *
     * Ranges of values in pixels: `0` to `X`.
     *
     * IMPORTANT: This setting is not supported in Safari browsers.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/filters/} for more info
     * @since 5.5.0
     */
    blur?: number;
    /**
     * Modifty visual brightness.
     *
     * Range of values: `0` to `1`.
     *
     * IMPORTANT: This setting is not supported in Safari browsers.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/filters/} for more info
     * @since 5.5.0
     */
    brightness?: number;
    /**
     * Modify contrast.
     *
     * Range of values: `0` to `1`.
     *
     * IMPORTANT: This setting is not supported in Safari browsers.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/filters/} for more info
     * @since 5.5.0
     */
    contrast?: number;
    /**
     * Modify saturation.
     *
     * Range of values in pixels: `0` to `X`.
     *
     * * `0` - grayscale
     * * `1` - no changes
     * * `>1` - more saturated
     *
     * IMPORTANT: This setting is not supported in Safari browsers.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/filters/} for more info
     * @since 5.5.0
     */
    saturate?: number;
    /**
     * Apply sepia filter.
     *
     * Range of values: `0` (no changes) to `1` (complete sepia).
     *
     * IMPORTANT: This setting is not supported in Safari browsers.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/filters/} for more info
     * @since 5.5.0
     */
    sepia?: number;
    /**
     * Invert colors.
     *
     * Range of values: `0` (no changes) to `1` (completely inverted colors).
     *
     * IMPORTANT: This setting is not supported in Safari browsers.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/filters/} for more info
     * @since 5.5.0
     */
    invert?: number;
    /**
     * Rotate HUE colors in degrees.
     *
     * Range of values: `0` to `360`.
     *
     * IMPORTANT: This setting is not supported in Safari browsers.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/colors-gradients-and-patterns/filters/} for more info
     * @since 5.5.0
     */
    hue?: number;
}
export interface ISpritePrivate extends IEntityPrivate {
    /**
     * @ignore
     */
    customData?: any;
    /**
     * @ignore
     */
    x?: number;
    /**
     * @ignore
     */
    y?: number;
    /**
     * @ignore
     */
    width?: number;
    /**
     * @ignore
     */
    height?: number;
    /**
     * @ignore
     */
    visible?: boolean;
    /**
     * Is element currently showing a tooltip?
     */
    showingTooltip?: boolean;
    /**
     * @ignore
     */
    touchHovering?: boolean;
    /**
     * @ignore
     */
    focusElement?: {
        dom: HTMLDivElement;
        disposers: Array<IDisposer>;
    };
    /**
     * An element tooltip should inherit its colors from.
     */
    tooltipTarget?: Graphics;
    /**
     * @ignore
     */
    list?: ListTemplate<Sprite>;
    /**
     * @ignore
     */
    maxWidth?: number | null;
    /**
     * @ignore
     */
    maxHeight?: number | null;
    /**
     * @ignore
     */
    minWidth?: number | null;
    /**
     * @ignore
     */
    minHeight?: number | null;
    /**
     * If set to `false`, its tabindex will be set to -1, so it does not get
     * focused with TAB, regardless whether its public setting `focusable` is
     * set to `true`.
     *
     * @since 5.3.16
     */
    focusable?: boolean;
    /**
     * If set to `true`, the sprite will check if a mouse pointer is within
     * its bounds before dispatching pointer events.
     *
     * This helps to solve ghost tooltips problem that sometimes appear while
     * moving the pointer over interactive objects.
     *
     * This is set to `true` by default on `Rectangle` and `Circle`.
     *
     * @since 5.5.0
     */
    trustBounds?: boolean;
}
/**
 * An interface defining event objects that originate from pinter interactions.
 */
export interface ISpritePointerEvent {
    /**
     * Original event object that caused the interaction, e.g. [[MouseEvent]].
     */
    originalEvent: IPointerEvent;
    /**
     * A point where event originated.
     */
    point: IPoint;
    /**
     * Is it a simulated event, e.g. if the event was generated by code rather
     * then actual user interaction.
     */
    simulated: boolean;
    /**
     * Whether event originated in chart's container or its children.
     */
    native?: boolean;
    /**
     * The element on which the event occurred.
     */
    target: Sprite;
}
export interface ISpriteEvents extends IEntityEvents {
    /**
     * Invoked when element's data item changes.
     */
    dataitemchanged: {
        oldDataItem: DataItem<IComponentDataItem> | undefined;
        newDataItem: DataItem<IComponentDataItem> | undefined;
    };
    /**
     * Invoked when element's position (X/Y) changes.
     */
    positionchanged: {};
    /**
     * Invoked when element's bounds change due to any manipulation to it.
     */
    boundschanged: {};
    /**
     * Invoked when element dragging starts.
     */
    dragstart: ISpritePointerEvent;
    /**
     * Invoked when element dragging stops.
     */
    dragstop: ISpritePointerEvent;
    /**
     * Invoked when element ois being dragged.
     */
    dragged: ISpritePointerEvent;
    /**
     * Invoked when element is clicked or tapped.
     */
    click: ISpritePointerEvent;
    /**
     * Invoked when element is clicked width the right mouse button.
     */
    rightclick: ISpritePointerEvent;
    /**
     * Invoked when element is clicked with the middle mouse button.
     */
    middleclick: ISpritePointerEvent;
    /**
     * Invoked when element is doubleclicked or tapped twice quickly.
     */
    dblclick: ISpritePointerEvent;
    /**
     * Invoked when pointer moves over the element.
     */
    pointerover: ISpritePointerEvent;
    /**
     * Invoked when pointer moves outside the element.
     */
    pointerout: ISpritePointerEvent;
    /**
     * Invoked when pointer button is pressed or touch starts over the element.
     */
    pointerdown: ISpritePointerEvent;
    /**
     * Invoked when pointer button is released or touch stops over the element.
     */
    pointerup: ISpritePointerEvent;
    /**
     * Invoked when pointer button is released or touch stops in the window, even
     * outside of the element or even chart area.
     */
    globalpointerup: ISpritePointerEvent;
    /**
     * Invoked when pointer is moving anywhere in the window, even outside of the
     * element or even chart area.
     */
    globalpointermove: ISpritePointerEvent;
    /**
     * Invoked when mouse wheel is spinned while pointer is over the element.
     */
    wheel: {
        originalEvent: WheelEvent;
        point: IPoint;
    };
    /**
     * Invoked when element gains focus.
     */
    focus: {
        originalEvent: FocusEvent;
        target: Sprite;
    };
    /**
     * Invoked when element loses focus.
     */
    blur: {
        originalEvent: FocusEvent;
        target: Sprite;
    };
}
/**
 * A base class for all visual elements.
 *
 * @important
 */
export declare abstract class Sprite extends Entity {
    _settings: ISpriteSettings;
    _privateSettings: ISpritePrivate;
    _events: ISpriteEvents;
    events: SpriteEventDispatcher<this, Events<this, this["_events"]>>;
    abstract _display: IDisplayObject;
    _adjustedLocalBounds: IBounds;
    protected _localBounds: IBounds;
    static className: string;
    static classNames: Array<string>;
    _parent: Container | undefined;
    protected _dataItem: DataItem<IComponentDataItem> | undefined;
    protected _templateField: Template<this> | undefined;
    protected _sizeDirty: boolean;
    protected _isDragging: boolean;
    protected _dragEvent: ISpritePointerEvent | undefined;
    protected _dragPoint: IPoint | undefined;
    protected _isHidden: boolean;
    protected _isShowing: boolean;
    protected _isHiding: boolean;
    protected _isDown: boolean;
    _downPoint: IPoint | undefined;
    _downPoints: {
        [index: number]: IPoint;
    };
    _toggleDp: IDisposer | undefined;
    protected _dragDp: MultiDisposer | undefined;
    protected _tooltipDp: MultiDisposer | undefined;
    protected _hoverDp: MultiDisposer | undefined;
    protected _focusDp: MultiDisposer | undefined;
    protected _tooltipMoveDp: IDisposer | undefined;
    protected _tooltipPointerDp: MultiDisposer | undefined;
    protected _statesHandled: boolean;
    protected _afterNew(): void;
    _markDirtyKey<Key extends keyof this["_settings"]>(key: Key): void;
    _markDirtyPrivateKey<Key extends keyof this["_privateSettings"]>(key: Key): void;
    protected _removeTemplateField(): void;
    protected _createEvents(): SpriteEventDispatcher<this, Events<this, this["_events"]>>;
    _processTemplateField(): void;
    _setDataItem(dataItem?: DataItem<IComponentDataItem>): void;
    /**
     * A [[DataItem]] used for this element.
     *
     * NOTE: data item is being assigned automatically in most cases where it
     * matters. Use this accessor to set data item only if you know what you're
     * doing.
     *
     * @param  value  Data item
     */
    set dataItem(value: DataItem<IComponentDataItem> | undefined);
    /**
     * @return DataItem
     */
    get dataItem(): DataItem<IComponentDataItem> | undefined;
    protected _addPercentageSizeChildren(): void;
    protected _addPercentagePositionChildren(): void;
    /**
     * @ignore
     */
    markDirtyPosition(): void;
    protected updatePivotPoint(): void;
    _beforeChanged(): void;
    protected _handleStates(): void;
    _changed(): void;
    /**
     * @ignore
     * @todo should this be user-accessible?
     */
    dragStart(e: ISpritePointerEvent): void;
    /**
     * @ignore
     * @todo should this be user-accessible?
     */
    dragStop(e: ISpritePointerEvent): void;
    protected _handleOver(): void;
    protected _handleOut(): void;
    protected _handleUp(e: ISpritePointerEvent): void;
    _hasMoved(e: ISpritePointerEvent): boolean;
    _hasDown(): boolean;
    protected _handleDown(e: ISpritePointerEvent): void;
    /**
     * @ignore
     * @todo should this be user-accessible?
     */
    dragMove(e: ISpritePointerEvent): true | undefined;
    _updateSize(): void;
    _getBounds(): void;
    /**
     * Returns depth (how deep in the hierachy of the content tree) of this
     * element.
     *
     * @return Depth
     */
    depth(): number;
    /**
     * @ignore
     */
    markDirtySize(): void;
    /**
     * @ignore
     */
    markDirtyBounds(): void;
    /**
     * @ignore
     */
    markDirtyAccessibility(): void;
    /**
     * @ignore
     */
    markDirtyLayer(): void;
    /**
     * @ignore
     */
    markDirty(): void;
    _updateBounds(): void;
    _fixMinBounds(bounds: IBounds): void;
    protected _removeParent(parent: Container | undefined): void;
    _clearDirty(): void;
    /**
     * Simulate hover over element.
     */
    hover(): void;
    /**
     * Simulate unhover over element.
     */
    unhover(): void;
    /**
     * Shows element's [[Tooltip]].
     */
    showTooltip(point?: IPoint): Promise<void> | undefined;
    /**
     * Hides element's [[Tooltip]].
     */
    hideTooltip(): Promise<void> | undefined;
    _getTooltipPoint(): IPoint;
    /**
     * Returns [[Tooltip]] used for this element.
     *
     * @return Tooltip
     */
    getTooltip(): Tooltip | undefined;
    _updatePosition(): void;
    /**
     * Returns element's actual X position in pixels.
     *
     * @return X (px)
     */
    x(): number;
    /**
     * Returns element's actual Y position in pixels.
     *
     * @return Y (px)
     */
    y(): number;
    protected _dispose(): void;
    /**
     * @ignore
     */
    adjustedLocalBounds(): IBounds;
    /**
     * Returns local coordinates of the element's bounds.
     *
     * @ignore
     * @return Global bounds
     */
    localBounds(): IBounds;
    /**
     * Returns adjusted local coordinates of the element's bounds.
     *
     * @ignore
     * @return Global bounds
     */
    bounds(): IBounds;
    /**
     * Returns global coordinates of the element's bounds.
     *
     * @ignore
     * @return Global bounds
     */
    globalBounds(): IBounds;
    protected _onShow(_duration?: number): void;
    protected _onHide(_duration?: number): void;
    /**
     * Plays initial reveal animation regardless if element is currently hidden
     * or visible.
     *
     * @param   duration  Duration of the animation in milliseconds
     * @param   delay     Delay showing of the element by X milliseconds
     * @return            Promise
     */
    appear(duration?: number, delay?: number): Promise<void>;
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
    show(duration?: number): Promise<void>;
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
    hide(duration?: number): Promise<void>;
    /**
     * Returns `true` if this element is currently hidden.
     *
     * @return Is hidden?
     */
    isHidden(): boolean;
    /**
     * Returns `true` if this element is currently animating to a default state.
     *
     * @return Is showing?
     */
    isShowing(): boolean;
    /**
     * Returns `true` if this element is currently animating to a hidden state.
     *
     * @return Is hiding?
     */
    isHiding(): boolean;
    /**
     * Returns `true` if this element is currently hovered by a pointer.
     *
     * @return Is hovered?
     */
    isHover(): boolean;
    /**
     * Returns `true` if this element does currently have focus.
     *
     * @return Is focused?
     */
    isFocus(): boolean;
    /**
     * Returns `true` if this element is currently being dragged.
     *
     * @return Is dragged?
     */
    isDragging(): boolean;
    /**
     * Returns `false` if if either public or private setting `visible` is set
     * to `false`, or `forceHidden` is set to `true`.
     *
     * @return Visible?
     */
    isVisible(): boolean;
    /**
     * Same as `isVisible()`, except it checks all ascendants, too.
     *
     * @since 5.2.7
     * @return Visible?
     */
    isVisibleDeep(): boolean;
    /**
     * Returns an actual opacity of the element, taking into account all parents.
     *
     * @return Opacity
     * @since 5.2.11
     */
    compositeOpacity(): number;
    /**
     * Returns width of this element in pixels.
     *
     * @return Width (px)
     */
    width(): number;
    /**
     * Returns maximum allowed width of this element in pixels.
     *
     * @return Maximum width (px)
     */
    maxWidth(): number;
    /**
     * Returns maximum allowed height of this element in pixels.
     *
     * @return Maximum height (px)
     */
    maxHeight(): number;
    /**
     * Returns height of this element in pixels.
     *
     * @return Height (px)
     */
    height(): number;
    protected _findStaticTemplate(f: (template: Template<this>) => boolean): Template<this> | undefined;
    _walkParents(f: (parent: Sprite) => void): void;
    protected _walkParent(f: (parent: Sprite) => void): void;
    /**
     * Parent [[Container]] of this element.
     *
     * @return Parent container
     */
    get parent(): Container | undefined;
    _setParent(parent: Container, updateChildren?: boolean): void;
    /**
     * Returns an instance of [[NumberFormatter]] used in this element.
     *
     * If this element does not have it set, global one form [[Root]] is used.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     * @return NumberFormatter instace
     */
    getNumberFormatter(): NumberFormatter;
    /**
     * Returns an instance of [[DateFormatter]] used in this element.
     *
     * If this element does not have it set, global one form [[Root]] is used.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     * @return DateFormatter instace
     */
    getDateFormatter(): DateFormatter;
    /**
     * Returns an instance of [[DurationFormatter]] used in this element.
     *
     * If this element does not have it set, global one form [[Root]] is used.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/using-formatters/} for more info
     * @return DurationFormatter instace
     */
    getDurationFormatter(): DurationFormatter;
    /**
     * Converts X/Y coordinate within this element to a global coordinate.
     *
     * @param  point  Local coordinate
     * @return        Global coordinate
     */
    toGlobal(point: IPoint): IPoint;
    /**
     * Converts global X/Y coordinate to a coordinate within this element.
     *
     * @param  point  Global coordinate
     * @return        Local coordinate
     */
    toLocal(point: IPoint): IPoint;
    _getDownPoint(): IPoint | undefined;
    _getDownPointId(): number | undefined;
    /**
     * Moves sprite to the end of the parent's children array.
     *
     * Depending on `layout` setting of the parten container, it may effect the
     * positioning or overlapping order of the elements.
     */
    toFront(): void;
    /**
     * Moves sprite to the beginning of the parent's children array.
     *
     * Depending on `layout` setting of the parten container, it may effect the
     * positioning or overlapping order of the elements.
     */
    toBack(): void;
}
export {};
//# sourceMappingURL=Sprite.d.ts.map