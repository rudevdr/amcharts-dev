/** @ignore */ /** */
import { IRenderer, IContainer, IDisplayObject, IGraphics, IRendererEvents, IMargin, IText, ITextStyle, IRadialText, IPicture, IRendererEvent, ILayer, ICanvasOptions, BlendMode, IPointerEvent, Id } from "./Renderer";
import type { IBounds } from "../../util/IBounds";
import type { IPoint } from "../../util/IPoint";
import { Color } from "../../util/Color";
import { Matrix } from "../../util/Matrix";
import { Percent } from "../../util/Percent";
import { ArrayDisposer, DisposerClass, IDisposer, CounterDisposer } from "../../util/Disposer";
/**
 * @ignore
 */
export declare class CanvasPivot implements IPoint {
    protected _x: number;
    protected _y: number;
    get x(): number;
    get y(): number;
    set x(value: number);
    set y(value: number);
}
interface IStatus {
    layer: CanvasLayer;
    inactive: boolean | null;
}
/**
 * @ignore
 */
export declare class CanvasDisplayObject extends DisposerClass implements IDisplayObject, IDisposer {
    _layer?: CanvasLayer;
    mask: CanvasGraphics | null;
    visible: boolean;
    exportable?: boolean;
    interactive: boolean;
    inactive: boolean | null;
    wheelable: boolean;
    cancelTouch: boolean;
    isMeasured: boolean;
    buttonMode: boolean;
    alpha: number;
    compoundAlpha: number;
    angle: number;
    scale: number;
    x: number;
    y: number;
    crisp: boolean;
    pivot: CanvasPivot;
    filter?: string;
    cursorOverStyle?: string;
    _replacedCursorStyle?: string;
    _localMatrix: Matrix;
    _matrix: Matrix;
    protected _uMatrix: Matrix;
    _renderer: CanvasRenderer;
    _parent: CanvasContainer | undefined;
    protected _localBounds: IBounds | undefined;
    protected _bounds: IBounds | undefined;
    _colorId: string | undefined;
    constructor(renderer: CanvasRenderer);
    protected subStatus(status: IStatus): IStatus;
    protected _dispose(): void;
    getCanvas(): HTMLCanvasElement;
    getLayer(): CanvasLayer;
    setLayer(order: number | undefined, margin: IMargin | undefined): void;
    markDirtyLayer(): void;
    clear(): void;
    invalidateBounds(): void;
    _addBounds(_bounds: IBounds): void;
    protected _getColorId(): string;
    protected _isInteractive(status: IStatus): boolean;
    protected _isInteractiveMask(status: IStatus): boolean;
    contains(child: CanvasDisplayObject): boolean;
    toGlobal(point: IPoint): IPoint;
    toLocal(point: IPoint): IPoint;
    getLocalMatrix(): Matrix;
    getLocalBounds(): IBounds;
    getAdjustedBounds(bounds: IBounds): IBounds;
    on<C, Key extends keyof IRendererEvents>(key: Key, callback: (this: C, event: IRendererEvents[Key]) => void, context?: C): IDisposer;
    _setMatrix(): void;
    _transform(context: CanvasRenderingContext2D, resolution: number): void;
    _transformMargin(context: CanvasRenderingContext2D, resolution: number, margin: IMargin): void;
    _transformLayer(context: CanvasRenderingContext2D, resolution: number, layer: CanvasLayer): void;
    render(status: IStatus): void;
    protected _render(status: IStatus): void;
    hovering(): boolean;
    dragging(): boolean;
    shouldCancelTouch(): boolean;
}
/**
 * @ignore
 */
export declare class CanvasContainer extends CanvasDisplayObject implements IContainer {
    interactiveChildren: boolean;
    private _childLayers?;
    protected _children: Array<CanvasDisplayObject>;
    protected _isInteractiveMask(status: IStatus): boolean;
    addChild(child: CanvasDisplayObject): void;
    addChildAt(child: CanvasDisplayObject, index: number): void;
    removeChild(child: CanvasDisplayObject): void;
    protected _render(status: IStatus): void;
    registerChildLayer(layer: CanvasLayer): void;
    markDirtyLayer(deep?: boolean): void;
    protected _dispose(): void;
}
/**
 * @ignore
 */
declare abstract class Op {
    colorize(_context: CanvasRenderingContext2D, _forceColor: string | undefined): void;
    path(_context: CanvasRenderingContext2D): void;
    addBounds(_bounds: IBounds): void;
}
/**
 * @ignore
 */
export declare class CanvasGraphics extends CanvasDisplayObject implements IGraphics {
    protected _operations: Array<Op>;
    blendMode: BlendMode;
    protected _hasShadows: boolean;
    protected _fillAlpha?: number;
    protected _strokeAlpha?: number;
    clear(): void;
    protected _pushOp(op: Op): void;
    beginFill(color?: Color | CanvasGradient | CanvasPattern, alpha?: number): void;
    endFill(): void;
    endStroke(): void;
    beginPath(): void;
    lineStyle(width?: number, color?: Color | CanvasGradient | CanvasPattern, alpha?: number, lineJoin?: "miter" | "round" | "bevel"): void;
    setLineDash(dash?: number[]): void;
    setLineDashOffset(dashOffset?: number): void;
    drawRect(x: number, y: number, width: number, height: number): void;
    drawCircle(x: number, y: number, radius: number): void;
    drawEllipse(x: number, y: number, radiusX: number, radiusY: number): void;
    arc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
    arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
    lineTo(x: number, y: number): void;
    moveTo(x: number, y: number): void;
    bezierCurveTo(cpX: number, cpY: number, cpX2: number, cpY2: number, toX: number, toY: number): void;
    quadraticCurveTo(cpX: number, cpY: number, toX: number, toY: number): void;
    closePath(): void;
    shadow(color: Color, blur?: number, offsetX?: number, offsetY?: number, opacity?: number): void;
    image(image: HTMLImageElement | HTMLCanvasElement, width: number, height: number, x: number, y: number): void;
    svgPath(path: string): void;
    _runPath(context: CanvasRenderingContext2D): void;
    protected _render(status: IStatus): void;
    renderDetached(context: CanvasRenderingContext2D): void;
    _addBounds(bounds: IBounds): void;
}
/**
 * @ignore
 */
interface ILineChunk {
    style: string | undefined;
    fill: Color | undefined;
    text: string;
    width: number;
    height: number;
    left: number;
    right: number;
    ascent: number;
    offsetX: number;
    offsetY: number;
    textDecoration: string | undefined;
    verticalAlign?: "baseline" | "sub" | "super";
}
/**
 * @ignore
 */
interface ILine {
    offsetY: number;
    ascent: number;
    width: number;
    height: number;
    left: number;
    right: number;
    textChunks: Array<ILineChunk>;
}
/**
 * @ignore
 */
export declare class CanvasText extends CanvasDisplayObject implements IText {
    text: string;
    style: CanvasTextStyle;
    resolution: number;
    textVisible: boolean;
    protected _textInfo: Array<ILine> | undefined;
    protected _originalScale?: number;
    constructor(renderer: CanvasRenderer, text: string, style: CanvasTextStyle);
    invalidateBounds(): void;
    private _shared;
    protected _prerender(status: IStatus, ignoreGhost?: boolean, ignoreFontWeight?: boolean): void;
    protected _getFontStyle(style2?: ITextStyle, ignoreFontWeight?: boolean): string;
    protected _render(status: IStatus): void;
    _addBounds(bounds: IBounds): void;
    protected _ignoreFontWeight(): boolean;
    _measure(status: IStatus): IBounds;
    protected _fitRatio(bounds: IBounds): number;
    protected _truncateText(context: CanvasRenderingContext2D, text: string, maxWidth: number, breakWords?: boolean, fallbackBreakWords?: boolean): string;
    protected _measureText(text: string, context: CanvasRenderingContext2D): TextMetrics;
}
/**
 * @ignore
 */
export declare class CanvasTextStyle implements ITextStyle {
    fill?: Color | CanvasGradient | CanvasPattern;
    fillOpacity?: number;
    textAlign?: "start" | "end" | "left" | "right" | "center";
    fontFamily?: string;
    fontSize?: string | number;
    fontWeight?: 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    fontStyle?: 'normal' | 'italic' | 'oblique';
    fontVariant?: "normal" | "small-caps";
    textDecoration?: "underline" | "line-through";
    shadowColor?: Color | null;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowOpacity?: number;
    lineHeight?: number | Percent;
    baselineRatio?: number;
    direction?: "ltr" | "rtl";
    textBaseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";
    oversizedBehavior?: "none" | "hide" | "fit" | "wrap" | "wrap-no-break" | "truncate";
    breakWords?: boolean;
    ellipsis?: string;
    maxWidth?: number;
    maxHeight?: number;
    minScale?: number;
    ignoreFormatting?: boolean;
}
/**
 * @ignore
 */
export declare class CanvasRadialText extends CanvasText implements IRadialText {
    textType?: "regular" | "circular" | "radial" | "aligned" | "adjusted";
    radius?: number;
    startAngle?: number;
    inside?: boolean;
    orientation?: "inward" | "outward" | "auto";
    kerning?: number;
    private _textReversed;
    _render(status: IStatus): void;
    _renderCircular(status: IStatus): void;
    _measure(status: IStatus): IBounds;
    _measureCircular(status: IStatus): IBounds;
}
/**
 * @ignore
 */
export declare class CanvasImage extends CanvasDisplayObject implements IPicture {
    width: number | undefined;
    height: number | undefined;
    image: HTMLImageElement | undefined;
    tainted?: boolean;
    shadowColor?: Color;
    shadowBlur?: number;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowOpacity?: number;
    protected _imageMask: HTMLCanvasElement | undefined;
    constructor(renderer: CanvasRenderer, image: HTMLImageElement | undefined);
    protected _dispose(): void;
    getLocalBounds(): IBounds;
    protected _render(status: IStatus): void;
    clear(): void;
    protected _getMask(image: HTMLImageElement): HTMLCanvasElement;
}
/**
 * @ignore
 */
export declare class CanvasRendererEvent<A> implements IRendererEvent<A> {
    event: A;
    originalPoint: IPoint;
    point: IPoint;
    bbox: DOMRect;
    id: Id;
    simulated: boolean;
    native: boolean;
    constructor(event: A, originalPoint: IPoint, point: IPoint, bbox: DOMRect);
}
/**
 * @ignore
 */
interface IEvent<Key extends keyof IRendererEvents> {
    object: CanvasDisplayObject;
    context: unknown;
    callback: (event: IRendererEvents[Key]) => void;
    disposed: boolean;
}
/**
 * @ignore
 */
interface IEvents<Key extends keyof IRendererEvents> {
    disposer: IDisposer;
    callbacks: Array<IEvent<Key>>;
    dispatching: boolean;
    cleanup: boolean;
}
/**
 * @ignore
 */
export declare class CanvasRenderer extends ArrayDisposer implements IRenderer, IDisposer {
    view: HTMLElement;
    protected _layerDom: HTMLElement;
    layers: Array<CanvasLayer>;
    _dirtyLayers: Array<CanvasLayer>;
    defaultLayer: CanvasLayer;
    _ghostLayer: GhostLayer;
    protected _patternCanvas: HTMLCanvasElement;
    protected _patternContext: CanvasRenderingContext2D;
    protected _realWidth: number;
    protected _realHeight: number;
    protected _calculatedWidth: number;
    protected _calculatedHeight: number;
    resolution: number;
    interactionsEnabled: boolean;
    protected _listeners: {
        [key: string]: CounterDisposer;
    };
    protected _events: {
        [Key in keyof IRendererEvents]?: IEvents<Key>;
    };
    protected _colorId: number;
    protected _colorMap: {
        [color: string]: CanvasDisplayObject;
    };
    _forceInteractive: number;
    _omitTainted: boolean;
    _hovering: Set<CanvasDisplayObject>;
    _dragging: Array<{
        id: Id;
        value: CanvasDisplayObject;
    }>;
    _mousedown: Array<{
        id: Id;
        value: CanvasDisplayObject;
    }>;
    protected _lastPointerMoveEvent: {
        events: Array<IPointerEvent>;
        target: Node | null;
        native: boolean;
    } | undefined;
    tapToActivate: boolean;
    tapToActivateTimeout: number;
    _touchActive: boolean;
    protected _touchActiveTimeout?: number;
    constructor(resolution?: number);
    protected _delayTouchDeactivate(): void;
    get debugGhostView(): boolean;
    set debugGhostView(value: boolean);
    createLinearGradient(x1: number, y1: number, x2: number, y2: number): CanvasGradient;
    createRadialGradient(x1: number, y1: number, radius1: number, x2: number, y2: number, radius2: number): CanvasGradient;
    createPattern(graphics: CanvasGraphics, background: CanvasGraphics, repetition: string, width: number, height: number): CanvasPattern;
    makeContainer(): CanvasContainer;
    makeGraphics(): CanvasGraphics;
    makeText(text: string, style: CanvasTextStyle): CanvasText;
    makeTextStyle(): CanvasTextStyle;
    makeRadialText(text: string, style: CanvasTextStyle): CanvasRadialText;
    makePicture(image: HTMLImageElement | undefined): CanvasImage;
    resizeLayer(layer: CanvasLayer): void;
    resizeGhost(): void;
    resize(realWidth: number, realHeight: number, calculatedWidth: number, calculatedHeight: number): void;
    private createDetachedLayer;
    getLayerByOrder(order: number): CanvasLayer | undefined;
    getLayer(order: number, visible?: boolean): CanvasLayer;
    render(root: CanvasDisplayObject): void;
    paintId(obj: CanvasDisplayObject): string;
    _removeObject(obj: CanvasDisplayObject): void;
    protected _adjustBoundingBox(bbox: DOMRect): DOMRect;
    getEvent<A extends IPointerEvent>(originalEvent: A, adjustPoint?: boolean): CanvasRendererEvent<A>;
    _getHitTarget(point: IPoint, bbox: DOMRect, target: Node | null): CanvasDisplayObject | undefined | false;
    _withEvents<Key extends keyof IRendererEvents>(key: Key, f: (events: IEvents<Key>) => void): void;
    _dispatchEventAll<Key extends keyof IRendererEvents>(key: Key, event: IRendererEvents[Key]): void;
    _dispatchEvent<Key extends keyof IRendererEvents>(key: Key, target: CanvasDisplayObject, event: IRendererEvents[Key]): boolean;
    _dispatchMousedown(originalEvent: IPointerEvent, originalTarget: Node | null): void;
    _dispatchGlobalMousemove(originalEvent: IPointerEvent, originalTarget: Node | null, native: boolean): void;
    removeHovering(graphics: CanvasGraphics): void;
    _dispatchGlobalMouseup(originalEvent: IPointerEvent, native: boolean): void;
    _dispatchDragMove(originalEvent: IPointerEvent): void;
    _dispatchDragEnd(originalEvent: IPointerEvent, originalTarget: Node | null): void;
    _dispatchDoubleClick(originalEvent: IPointerEvent, originalTarget: Node | null): void;
    _dispatchWheel(originalEvent: WheelEvent, originalTarget: Node | null): void;
    _makeSharedEvent(key: string, f: () => IDisposer): IDisposer;
    _onPointerEvent(name: string, f: (event: Array<IPointerEvent>, target: Node | null, native: boolean) => void): IDisposer;
    _initEvent(key: keyof IRendererEvents): IDisposer | undefined;
    _addEvent<C, Key extends keyof IRendererEvents>(object: CanvasDisplayObject, key: Key, callback: (this: C, event: IRendererEvents[Key]) => void, context?: C): IDisposer;
    getCanvas(root: CanvasDisplayObject, options?: ICanvasOptions): HTMLCanvasElement;
}
declare class GhostLayer {
    view: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    margin: IMargin;
    private _width;
    private _height;
    constructor();
    resize(canvasWidth: number, canvasHeight: number, domWidth: number, domHeight: number, resolution: number): void;
    getImageData(point: IPoint, bbox: DOMRect): ImageData;
    setMargin(layers: Array<CanvasLayer>): void;
    clear(): void;
}
/**
 * @ignore
 */
export declare class CanvasLayer implements ILayer {
    view: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    tainted: boolean;
    margin: IMargin | undefined;
    order: number;
    visible: boolean;
    width: number | undefined;
    height: number | undefined;
    scale: number | undefined;
    dirty: boolean;
    exportableView: HTMLCanvasElement | undefined;
    exportableContext: CanvasRenderingContext2D | undefined;
    private _width;
    private _height;
    constructor(view: HTMLCanvasElement, context: CanvasRenderingContext2D);
    resize(canvasWidth: number, canvasHeight: number, domWidth: number, domHeight: number, resolution: number): void;
    clear(): void;
}
export {};
//# sourceMappingURL=CanvasRenderer.d.ts.map