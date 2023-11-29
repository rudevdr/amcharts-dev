import type { Graphics } from "./Graphics";
import type { Layout } from "./Layout";
import type { IContainer } from "./backend/Renderer";
import type { Scrollbar } from "./Scrollbar";
import type { DataItem, IComponentDataItem } from "./Component";
import { Children } from "../util/Children";
import { Sprite, ISpriteSettings, ISpritePrivate, ISpriteEvents } from "./Sprite";
import { Rectangle } from "./Rectangle";
import type { IDisposer } from "../util/Disposer";
export interface IContainerSettings extends ISpriteSettings {
    /**
     * Left padding in pixels.
     */
    paddingLeft?: number;
    /**
     * Right padding in pixels.
     */
    paddingRight?: number;
    /**
     * Top padding in pixels.
     */
    paddingTop?: number;
    /**
     * Bottom padding in pixels.
     */
    paddingBottom?: number;
    /**
     * Background element.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/containers/#Background} for more info
     */
    background?: Graphics;
    /**
     * A method to layout
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/containers/#Layout} for more info
     */
    layout?: Layout | null;
    /**
     * An element to use as a container's mask (clipping region).
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/containers/#Masks} for more info
     */
    mask?: Graphics | null;
    /**
     * If set to `true` all content going outside the bounds of the container
     * will be clipped.
     */
    maskContent?: boolean;
    /**
     * If set to `true` all descendants - not just direct children, but every
     * element in it - will become "interactive".
     */
    interactiveChildren?: boolean;
    /**
     * If set to `true`, applying a state on a container will also apply the same
     * state on its children.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/containers/#States} for more info
     */
    setStateOnChildren?: boolean;
    /**
     * Setting this to an instance of [[Scrollbar]] will enable vertical
     * scrolling of content if it does not fit into the Container.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/containers/#Scrollbar} for more info
     */
    verticalScrollbar?: Scrollbar;
    /**
     * If set to `true` its children will be laid out in opposite order.
     *
     * @since 5.1.1
     */
    reverseChildren?: boolean;
    /**
     * HTML content of the container.
     *
     * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/html-content/} for more info
     * @since 5.2.11
     */
    html?: string;
}
export interface IContainerEvents extends ISpriteEvents {
}
export interface IContainerPrivate extends ISpritePrivate {
    /**
     * A `<div>` element used for HTML content of the `Container`.
     */
    htmlElement?: HTMLDivElement;
}
export interface IContainerEvents extends ISpriteEvents {
}
/**
 * A basic element that can have child elements, maintain their layout, and
 * have a background.
 *
 * It can have any [[Sprite]] element as a child, from very basic shapes, to
 * full-fledged charts.
 *
 * @see {@link https://www.amcharts.com/docs/v5/concepts/common-elements/containers/} for more info
 * @important
 */
export declare class Container extends Sprite {
    _settings: IContainerSettings;
    _privateSettings: IContainerPrivate;
    _events: IContainerEvents;
    _display: IContainer;
    _childrenDisplay: IContainer;
    /**
     * List of Container's child elements.
     */
    children: Children<Sprite>;
    _percentageSizeChildren: Array<Sprite>;
    _percentagePositionChildren: Array<Sprite>;
    static className: string;
    static classNames: Array<string>;
    _prevWidth: number;
    _prevHeight: number;
    protected _contentWidth: number;
    protected _contentHeight: number;
    protected _contentMask: Rectangle | undefined;
    protected _vsbd0: IDisposer | undefined;
    protected _vsbd1: IDisposer | undefined;
    protected _afterNew(): void;
    protected _dispose(): void;
    _changed(): void;
    _updateSize(): void;
    protected updateBackground(): void;
    _applyThemes(force?: boolean): boolean;
    _applyState(name: string): void;
    _applyStateAnimated(name: string, duration?: number): void;
    /**
     * Returns container's inner width (width without padding) in pixels.
     *
     * @return Inner width (px)
     */
    innerWidth(): number;
    /**
     * Returns container's inner height (height without padding) in pixels.
     *
     * @return Inner height (px)
     */
    innerHeight(): number;
    _getBounds(): void;
    _updateBounds(): void;
    /**
     * @ignore
     */
    markDirty(): void;
    _prepareChildren(): void;
    _updateChildren(): void;
    _processTemplateField(): void;
    /**
     * @ignore
     */
    walkChildren(f: (child: Sprite) => void): void;
    eachChildren(f: (child: Sprite) => void): void;
    allChildren(): Array<Sprite>;
    _setDataItem(dataItem?: DataItem<IComponentDataItem>): void;
}
//# sourceMappingURL=Container.d.ts.map