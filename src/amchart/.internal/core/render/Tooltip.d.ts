import type { IBounds } from "../util/IBounds";
import type { IPoint } from "../util/IPoint";
import type { Pattern } from "../render/patterns/Pattern";
import type { Time } from "../util/Animation";
import type { Sprite } from "../render/Sprite";
import { MultiDisposer, IDisposer } from "../util/Disposer";
import { Label } from "../render/Label";
import { Container, IContainerPrivate, IContainerSettings } from "./Container";
import { Color } from "../util/Color";
import type { DataItem, IComponentDataItem } from "./Component";
import type { Root } from "../Root";
import type { Template } from "../util/Template";
import type { Entity } from "../util/Entity";
export interface ITooltipSettings extends IContainerSettings {
    /**
     * Text to use for tooltip's label.
     */
    labelText?: string;
    /**
     * HTML content to use for tooltip's label.
     *
     * @since 5.2.11
     */
    labelHTML?: string;
    /**
     * A direction of the tooltip pointer.
     *
     * https://www.amcharts.com/docs/v5/concepts/common-elements/tooltips/#Orientation
     */
    pointerOrientation?: "left" | "right" | "up" | "down" | "vertical" | "horizontal";
    /**
     * If set to `true` will use the same `fill` color for its background as
     * its `tooltipTarget`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/tooltips/#Colors} for more info
     * @default false
     */
    getFillFromSprite?: boolean;
    /**
     * If set to `true` will use the same `fill` color as its `tooltipTarget`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/tooltips/#Colors} for more info
     * @default false
     */
    getLabelFillFromSprite?: boolean;
    /**
     * If set to `true` will use the same `stroke` color as its `tooltipTarget`.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/tooltips/#Colors} for more info
     * @default false
     */
    getStrokeFromSprite?: boolean;
    /**
     * Screen bounds to constrain the tooltip within.
     */
    bounds?: IBounds;
    /**
     * If set to `true` tooltip will adjust its text color for better visibility
     * on its background.
     *
     * @default true
     */
    autoTextColor?: boolean;
    /**
     * Screen coordinates the tooltip show point to.
     */
    pointTo?: IPoint;
    /**
     * Duration in milliseconds for tooltip position change, e.g. when tooltip
     * is jumping from one target to another.
     */
    animationDuration?: number;
    /**
     * Easing function for tooltip animation.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/animations/#Easing_functions} for more info
     */
    animationEasing?: (t: Time) => Time;
    /**
     * A target element tooltip is shown fow.
     */
    tooltipTarget?: Sprite;
    /**
     * If set to `true`, tooltip's target element will considered to be hovered
     * when mouse pointer is over tooltip itself.
     *
     * @since 5.2.14
     */
    keepTargetHover?: boolean;
}
export interface ITooltipPrivate extends IContainerPrivate {
}
/**
 * Creates a tooltip.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/tooltips/} for more info
 * @important
 */
export declare class Tooltip extends Container {
    _fx: number;
    _fy: number;
    _settings: ITooltipSettings;
    _privateSettings: ITooltipPrivate;
    protected _label: Label;
    static className: string;
    static classNames: Array<string>;
    protected _fillDp: IDisposer | undefined;
    protected _strokeDp: IDisposer | undefined;
    protected _labelDp: IDisposer | undefined;
    protected _w: number;
    protected _h: number;
    protected _keepHoverDp: MultiDisposer | undefined;
    protected _htmlContentHovered: boolean;
    constructor(root: Root, settings: Entity["_settings"], isReal: boolean, templates?: Array<Template<Entity>>);
    protected _afterNew(): void;
    /**
     * A [[Label]] element for the tooltip.
     *
     * @readonly
     * @return Label
     */
    get label(): Label;
    /**
     * Permanently disposes the tooltip.
     */
    dispose(): void;
    _updateChildren(): void;
    _changed(): void;
    protected _onShow(): void;
    updateBackgroundColor(): void;
    protected _updateTextColor(fill?: Color | Pattern): void;
    _setDataItem(dataItem?: DataItem<IComponentDataItem>): void;
    protected _updateBackground(): void;
}
//# sourceMappingURL=Tooltip.d.ts.map